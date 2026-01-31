import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  VStack,
  Text,
  Alert,
  AlertIcon,
  useToast,
  Icon,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  IconButton,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { useWallet } from '../hooks/useWallet';
import { FaExchangeAlt, FaArrowDown } from 'react-icons/fa';
import * as StellarSdk from 'stellar-sdk';
import { signTransaction } from '@stellar/freighter-api';

// Exchange rates (matching our liquidity pool rates)
const EXCHANGE_RATES = {
  'XLM-AED': 0.33,  // 1 XLM ≈ 0.33 AED
  'AED-XLM': 1.1,   // 1 AED ≈ 1.1 XLM
  'XLM-INR': 20,    // 1 XLM = 20 INR
  'INR-XLM': 0.05,  // 1 INR = 0.05 XLM
};

type TokenType = 'XLM' | 'AED' | 'INR';

export const Swap = () => {
  const { wallet } = useWallet();
  const toast = useToast();
  
  const [fromToken, setFromToken] = useState<TokenType>('XLM');
  const [toToken, setToToken] = useState<TokenType>('AED');
  const [fromAmount, setFromAmount] = useState('5');
  const [isLoading, setIsLoading] = useState(false);

  // Calculate output amount based on exchange rate
  const calculateToAmount = (): number => {
    const amount = parseFloat(fromAmount) || 0;
    const rateKey = `${fromToken}-${toToken}` as keyof typeof EXCHANGE_RATES;
    const rate = EXCHANGE_RATES[rateKey] || 0;
    return Math.floor(amount * rate * 100) / 100; // Round to 2 decimals
  };

  const toAmount = calculateToAmount();

  // Swap the from/to tokens
  const handleFlip = () => {
    const tempToken = fromToken;
    setFromToken(toToken);
    setToToken(tempToken);
  };

  // Prevent selecting same token for both from and to
  useEffect(() => {
    if (fromToken === toToken) {
      // Auto-select a different token
      const tokens: TokenType[] = ['XLM', 'AED', 'INR'];
      const available = tokens.filter(t => t !== fromToken);
      setToToken(available[0]);
    }
  }, [fromToken, toToken]);

  const handleSwap = async () => {
    if (!wallet) {
      toast({
        title: 'Wallet not connected',
        description: 'Please connect your Freighter wallet',
        status: 'warning',
        duration: 3000,
      });
      return;
    }

    const amount = parseFloat(fromAmount);
    if (!amount || amount <= 0) {
      toast({
        title: 'Invalid amount',
        description: 'Please enter a valid amount',
        status: 'warning',
        duration: 3000,
      });
      return;
    }

    setIsLoading(true);

    try {
      const server = new StellarSdk.Horizon.Server(
        import.meta.env.VITE_HORIZON_URL || 'https://horizon-testnet.stellar.org'
      );

      // Create assets
      const createAsset = (token: TokenType): StellarSdk.Asset => {
        if (token === 'XLM') return StellarSdk.Asset.native();
        if (token === 'AED') {
          return new StellarSdk.Asset('AED', import.meta.env.VITE_AED_ISSUER || 'GCGH7MHBMNIRWEU6XKZ4CUGESGWZHQJL36ZI2ZOSZAQV6PREJDNYKEYZ');
        }
        return new StellarSdk.Asset('INR', import.meta.env.VITE_INR_ISSUER || 'GBSVZWQQRRHZ2NF3WD3FVER2AUFQLVO5KWHXJJR3PTR5QWIW4QHNMITH');
      };

      const sendAsset = createAsset(fromToken);
      const destAsset = createAsset(toToken);

      // Load account
      const sourceAccount = await server.loadAccount(wallet.publicKey);

      // Check if we need trustline for destination token (if not XLM)
      if (toToken !== 'XLM') {
        const hasTrustline = sourceAccount.balances.some(
          (balance: any) => 
            balance.asset_type !== 'native' && 
            balance.asset_code === toToken &&
            balance.asset_issuer === destAsset.getIssuer()
        );

        if (!hasTrustline) {
          toast({
            title: 'Creating trustline...',
            description: `Setting up ${toToken} token access`,
            status: 'info',
            duration: 3000,
          });

          const trustlineTx = new StellarSdk.TransactionBuilder(sourceAccount, {
            fee: StellarSdk.BASE_FEE,
            networkPassphrase: StellarSdk.Networks.TESTNET,
          })
            .addOperation(StellarSdk.Operation.changeTrust({ asset: destAsset }))
            .setTimeout(300)
            .build();

          const trustlineXdr = trustlineTx.toXDR();
          const trustlineSignResult = await signTransaction(trustlineXdr, {
            networkPassphrase: StellarSdk.Networks.TESTNET,
          });

          const signedTrustlineTx = StellarSdk.TransactionBuilder.fromXDR(
            trustlineSignResult.signedTxXdr,
            StellarSdk.Networks.TESTNET
          );
          await server.submitTransaction(signedTrustlineTx);

          toast({
            title: 'Trustline created!',
            status: 'success',
            duration: 2000,
          });

          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      // Reload account
      const updatedAccount = await server.loadAccount(wallet.publicKey);

      // Build path payment for the swap
      const swapTx = new StellarSdk.TransactionBuilder(updatedAccount, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: StellarSdk.Networks.TESTNET,
      })
        .addOperation(
          StellarSdk.Operation.pathPaymentStrictSend({
            sendAsset: sendAsset,
            sendAmount: fromAmount,
            destination: wallet.publicKey,
            destAsset: destAsset,
            destMin: (toAmount * 0.9).toString(), // 10% slippage tolerance
          })
        )
        .setTimeout(300)
        .build();

      // Sign and submit
      const xdr = swapTx.toXDR();
      const signResult = await signTransaction(xdr, {
        networkPassphrase: StellarSdk.Networks.TESTNET,
      });

      const signedTx = StellarSdk.TransactionBuilder.fromXDR(
        signResult.signedTxXdr,
        StellarSdk.Networks.TESTNET
      );
      const result = await server.submitTransaction(signedTx);

      console.log('Swap successful:', result);

      toast({
        title: 'Swap successful!',
        description: `Swapped ${fromAmount} ${fromToken} for ${toAmount} ${toToken}`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      // Reset
      setFromAmount('5');
    } catch (error) {
      console.error('Swap error:', error);

      if ((error as any).response?.data) {
        console.error('Stellar error:', (error as any).response.data);
        console.error('Result codes:', (error as any).response.data?.extras?.result_codes);
      }

      let errorMessage = 'Swap failed. Please try again.';
      const stellarError = (error as any).response?.data?.extras?.result_codes;
      
      if (stellarError) {
        console.error('Transaction result:', stellarError.transaction);
        console.error('Operation errors:', stellarError.operations);
        
        const operationErrors = stellarError.operations || [];
        if (operationErrors.includes('op_too_few_offers')) {
          errorMessage = `No liquidity available for ${fromToken} → ${toToken}. The liquidity pool may be depleted. Try the faucet direction (XLM → AED/INR) or smaller amounts.`;
        } else if (operationErrors.includes('op_underfunded')) {
          errorMessage = `Insufficient ${fromToken} balance. You need at least ${fromAmount} ${fromToken}.`;
        } else if (operationErrors.includes('op_no_trust')) {
          errorMessage = `Missing trustline for ${toToken}. Please try again - trustline creation may have failed.`;
        } else if (operationErrors.length > 0) {
          errorMessage = `Swap failed: ${operationErrors.join(', ')}. Check console for details.`;
        }
      }

      toast({
        title: 'Swap failed',
        description: errorMessage,
        status: 'error',
        duration: 8000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!wallet) {
    return (
      <Box 
        minH="calc(100vh - 80px)" 
        bgGradient="linear(to-br, gray.50, blue.50)"
        display="flex"
        alignItems="center"
        justifyContent="center"
        py={10}
      >
        <Container maxW="container.md">
          <Alert 
            status="warning" 
            borderRadius="2xl" 
            p={8}
            boxShadow="glass"
            bg="white"
            border="2px"
            borderColor="orange.200"
          >
            <AlertIcon boxSize={6} />
            <VStack align="start" spacing={2} ml={2}>
              <Text fontWeight="700" fontSize="lg">
                Wallet Not Connected
              </Text>
              <Text color="gray.600">
                Please connect your Freighter wallet to swap tokens
              </Text>
            </VStack>
          </Alert>
        </Container>
      </Box>
    );
  }

  return (
    <Box 
      minH="calc(100vh - 80px)" 
      bgGradient="linear(to-br, gray.50, blue.50)"
      py={12}
    >
      <Container maxW="container.sm">
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <VStack spacing={3} textAlign="center">
            <Icon as={FaExchangeAlt} boxSize={12} color="blue.500" />
            <Heading 
              size="2xl" 
              fontWeight="900" 
              letterSpacing="-0.03em"
              bgGradient="linear(to-r, blue.600, purple.600)"
              bgClip="text"
            >
              Token Swap
            </Heading>
            <Text color="gray.600" fontSize="lg" maxW="xl">
              Swap between XLM, AED, and INR tokens using DEX liquidity
            </Text>
          </VStack>

          {/* Info */}
          <Alert status="info" borderRadius="xl" bg="blue.50" border="1px" borderColor="blue.200">
            <AlertIcon />
            <Text fontSize="xs" color="gray.700">
              Real swaps powered by Stellar DEX! Rates: 1 XLM = 200 AED or 4,500 INR
            </Text>
          </Alert>

          {/* Warning for unsupported directions */}
          {(fromToken === 'AED' || fromToken === 'INR') && toToken === 'XLM' && (
            <Alert status="warning" borderRadius="xl" bg="orange.50" border="1px" borderColor="orange.200">
              <AlertIcon />
              <Text fontSize="xs" color="gray.700">
                ⚠️ Reverse swaps (AED/INR → XLM) are not currently supported. Only XLM → AED/INR swaps have liquidity on testnet.
                Try flipping the direction!
              </Text>
            </Alert>
          )}
          {/* Swap Card */}
          <Box 
            bg="white" 
            p={8} 
            borderRadius="3xl" 
            boxShadow="glass-lg"
            border="1px"
            borderColor="gray.100"
          >
            <VStack spacing={4}>
              {/* From Token */}
              <Box w="full" bg="gray.50" p={6} borderRadius="2xl" border="2px" borderColor="gray.200">
                <VStack spacing={4} align="stretch">
                  <FormControl>
                    <FormLabel fontSize="sm" fontWeight="700" color="gray.600">
                      From
                    </FormLabel>
                    <Select
                      value={fromToken}
                      onChange={(e) => setFromToken(e.target.value as TokenType)}
                      size="lg"
                      fontWeight="600"
                      bg="white"
                    >
                      <option value="XLM">XLM (Stellar Lumens)</option>
                      <option value="AED">AED (UAE Dirham)</option>
                      <option value="INR">INR (Indian Rupee)</option>
                    </Select>
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel fontSize="sm" fontWeight="700" color="gray.600">
                      Amount
                    </FormLabel>
                    <NumberInput
                      value={fromAmount}
                      onChange={(value) => setFromAmount(value)}
                      min={0.1}
                      step={0.1}
                      size="lg"
                    >
                      <NumberInputField 
                        fontSize="2xl" 
                        fontWeight="800"
                        h="64px"
                        bg="white"
                      />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>
                </VStack>
              </Box>

              {/* Flip Button */}
              <IconButton
                aria-label="Flip tokens"
                icon={<FaArrowDown />}
                onClick={handleFlip}
                size="lg"
                borderRadius="full"
                colorScheme="blue"
                boxShadow="md"
              />

              {/* To Token */}
              <Box w="full" bg="blue.50" p={6} borderRadius="2xl" border="2px" borderColor="blue.200">
                <VStack spacing={4} align="stretch">
                  <FormControl>
                    <FormLabel fontSize="sm" fontWeight="700" color="gray.600">
                      To
                    </FormLabel>
                    <Select
                      value={toToken}
                      onChange={(e) => setToToken(e.target.value as TokenType)}
                      size="lg"
                      fontWeight="600"
                      bg="white"
                    >
                      <option value="XLM">XLM (Stellar Lumens)</option>
                      <option value="AED">AED (UAE Dirham)</option>
                      <option value="INR">INR (Indian Rupee)</option>
                    </Select>
                  </FormControl>
                  
                  <Box>
                    <FormLabel fontSize="sm" fontWeight="700" color="gray.600">
                      You'll receive (estimated)
                    </FormLabel>
                    <Box 
                      h="64px" 
                      bg="white" 
                      borderRadius="lg" 
                      display="flex" 
                      alignItems="center"
                      px={4}
                      border="1px"
                      borderColor="gray.200"
                    >
                      <Text fontSize="2xl" fontWeight="800" color="blue.600">
                        {toAmount.toLocaleString()}
                      </Text>
                    </Box>
                  </Box>
                </VStack>
              </Box>

              {/* Swap Button */}
              <Button
                colorScheme="blue"
                size="lg"
                w="full"
                h="64px"
                fontSize="lg"
                fontWeight="800"
                onClick={handleSwap}
                isLoading={isLoading}
                loadingText="Swapping..."
                isDisabled={!fromAmount || parseFloat(fromAmount) <= 0}
                leftIcon={<FaExchangeAlt />}
                boxShadow="0 8px 24px rgba(49, 130, 206, 0.3)"
                _hover={{
                  transform: 'translateY(-2px)',
                  boxShadow: '0 16px 32px rgba(49, 130, 206, 0.4)',
                }}
                transition="all 0.3s"
              >
                Swap {fromAmount || '0'} {fromToken} → {toAmount.toLocaleString()} {toToken}
              </Button>
            </VStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};
