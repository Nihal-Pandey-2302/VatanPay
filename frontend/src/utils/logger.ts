/**
 * Logger utility for consistent console logging across the app
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  level: LogLevel;
  module: string;
  message: string;
  data?: any;
  timestamp: string;
}

class Logger {
  private isDevelopment = import.meta.env.DEV;

  private formatMessage(module: string, message: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${module}] ${message}`;
  }

  private log(level: LogLevel, module: string, message: string, data?: any) {
    if (!this.isDevelopment && level === 'debug') {
      return; // Skip debug logs in production
    }

    const formattedMessage = this.formatMessage(module, message);
    
    switch (level) {
      case 'error':
        console.error(formattedMessage, data || '');
        break;
      case 'warn':
        console.warn(formattedMessage, data || '');
        break;
      case 'debug':
        console.debug(formattedMessage, data || '');
        break;
      default:
        console.log(formattedMessage, data || '');
    }

    // Store in sessionStorage for debugging
    this.storeLog({ level, module, message, data, timestamp: new Date().toISOString() });
  }

  private storeLog(entry: LogEntry) {
    try {
      const logs = this.getLogs();
      logs.push(entry);
      // Keep only last 100 logs
      const recentLogs = logs.slice(-100);
      sessionStorage.setItem('vatanpay_logs', JSON.stringify(recentLogs));
    } catch (e) {
      // Ignore storage errors
    }
  }

  public getLogs(): LogEntry[] {
    try {
      const logs = sessionStorage.getItem('vatanpay_logs');
      return logs ? JSON.parse(logs) : [];
    } catch {
      return [];
    }
  }

  public clearLogs() {
    sessionStorage.removeItem('vatanpay_logs');
  }

  public info(module: string, message: string, data?: any) {
    this.log('info', module, message, data);
  }

  public warn(module: string, message: string, data?: any) {
    this.log('warn', module, message, data);
  }

  public error(module: string, message: string, data?: any) {
    this.log('error', module, message, data);
  }

  public debug(module: string, message: string, data?: any) {
    this.log('debug', module, message, data);
  }

  public exportLogs(): string {
    return JSON.stringify(this.getLogs(), null, 2);
  }
}

export const logger = new Logger();

// Expose logger globally for debugging
if (typeof window !== 'undefined') {
  (window as any).vatanpayLogger = logger;
  console.log('[Logger] VatanPay logger initialized. Use window.vatanpayLogger to access logs.');
}
