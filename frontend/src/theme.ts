import { extendTheme, type ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  fonts: {
    heading: `'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`,
    body: `'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`,
  },
  colors: {
    brand: {
      50: '#E6F6FF',
      100: '#BAE6FF',
      200: '#8DD6FF',
      300: '#61C7FF',
      400: '#34B7FF',
      500: '#0FA7FF', // Primary brand color
      600: '#0C86CC',
      700: '#096499',
      800: '#064366',
      900: '#032133',
    },
    accent: {
      50: '#FFF5E6',
      100: '#FFE0B8',
      200: '#FFCB8A',
      300: '#FFB65C',
      400: '#FFA12E',
      500: '#FF8C00', // Accent orange
      600: '#CC7000',
      700: '#995400',
      800: '#663800',
      900: '#331C00',
    },
    success: {
      50: '#E6FFF4',
      100: '#B8FFE0',
      200: '#8AFFCC',
      300: '#5CFFB8',
      400: '#2EFFA4',
      500: '#00FF90', // Success green
      600: '#00CC73',
      700: '#009956',
      800: '#006639',
      900: '#00331D',
    },
  },
  styles: {
    global: {
      'html, body': {
        backgroundColor: 'gray.50',
        color: 'gray.800',
        fontFamily: 'body',
      },
      '*::placeholder': {
        color: 'gray.400',
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: '600',
        borderRadius: 'xl',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      },
      variants: {
        solid: (props: any) => {
          const { colorScheme } = props;
          if (colorScheme === 'brand') {
            return {
              bg: 'linear-gradient(135deg, #0FA7FF 0%, #0C86CC 100%)',
              color: 'white',
              _hover: {
                bg: 'linear-gradient(135deg, #0C86CC 0%, #096499 100%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 12px 24px rgba(15, 167, 255, 0.3)',
              },
              _active: {
                transform: 'translateY(0)',
              },
            };
          }
          if (colorScheme === 'green') {
            return {
              bg: 'linear-gradient(135deg, #00FF90 0%, #00CC73 100%)',
              color: 'gray.900',
              fontWeight: '700',
              _hover: {
                bg: 'linear-gradient(135deg, #00CC73 0%, #009956 100%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 12px 24px rgba(0, 255, 144, 0.4)',
              },
              _active: {
                transform: 'translateY(0)',
              },
            };
          }
        },
      },
      sizes: {
        lg: {
          h: '56px',
          fontSize: 'lg',
          px: 8,
        },
      },
    },
    Input: {
      variants: {
        outline: {
          field: {
            borderColor: 'gray.300',
            borderWidth: '2px',
            borderRadius: 'xl',
            fontSize: 'md',
            _hover: {
              borderColor: 'brand.400',
            },
            _focus: {
              borderColor: 'brand.500',
              boxShadow: '0 0 0 3px rgba(15, 167, 255, 0.1)',
            },
          },
        },
      },
      sizes: {
        lg: {
          field: {
            h: '56px',
            px: 6,
            fontSize: 'md',
          },
        },
      },
      defaultProps: {
        variant: 'outline',
      },
    },
    Heading: {
      baseStyle: {
        fontWeight: '800',
        letterSpacing: '-0.02em',
      },
    },
    Card: {
      baseStyle: {
        container: {
          borderRadius: '2xl',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          overflow: 'hidden',
        },
      },
    },
  },
  shadows: {
    'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
    'glass-lg': '0 12px 48px 0 rgba(31, 38, 135, 0.2)',
    'brand': '0 12px 24px rgba(15, 167, 255, 0.3)',
    'success': '0 12px 24px rgba(0, 255, 144, 0.3)',
  },
  radii: {
    '2xl': '1rem',
    '3xl': '1.5rem',
  },
});

export default theme;
