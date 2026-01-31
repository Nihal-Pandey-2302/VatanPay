import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  VStack,
  HStack,
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
  Badge,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useWallet } from '../hooks/useWallet';
import { FaUniversity, FaMoneyBillWave } from 'react-icons/fa';
import * as StellarSdk from 'stellar-sdk';
import { signTransaction } from '@stellar/freighter-api';

// Exchange rates (tokens per XLM)
// Realistic exchange rates matching DEX liquidity for demo simulation
const EXCHANGE_RATES = {
  AED: 200, 
  INR: 20, 
  XLM: 1,
};

export const Faucet = () => {
  const { wallet } = useWallet();
  const toast = useToast();
  const [selectedToken, setSelectedToken] = useState<'AED' | 'INR'>('AED');
  const [xlmAmount, setXlmAmount] = useState('5'); // Default 5 XLM
  const [isLoading, setIsLoading] = useState(false);

  // Calculate how many tokens user will get
  const calculateTokenAmount = (xlm: string): number => {
    const xlmNum = parseFloat(xlm) || 0;
    return Math.floor(xlmNum * EXCHANGE_RATES[selectedToken]);
  };

  const tokenAmount = calculateTokenAmount(xlmAmount);

  const handleClaim = async () => {
    if (!wallet) {
      toast({
        title: 'Wallet not connected',
        description: 'Please connect your Freighter wallet',
        status: 'warning',
        duration: 3000,
      });
      return;
    }

    const xlmNum = parseFloat(xlmAmount);
    if (!xlmNum || xlmNum <= 0) {
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

      // Create asset based on selection
      const asset = selectedToken === 'AED'
        ? new StellarSdk.Asset('AED', import.meta.env.VITE_AED_ISSUER || 'GCGH7MHBMNIRWEU6XKZ4CUGESGWZHQJL36ZI2ZOSZAQV6PREJDNYKEYZ')
        : new StellarSdk.Asset('INR', import.meta.env.VITE_INR_ISSUER || 'GBSVZWQQRRHZ2NF3WD3FVER2AUFQLVO5KWHXJJR3PTR5QWIW4QHNMITH');

      // Load source account
      const sourceAccount = await server.loadAccount(wallet.publicKey);

      // Check if trustline exists
      const hasTrustline = sourceAccount.balances.some(
        (balance: any) => 
          balance.asset_type !== 'native' && 
          balance.asset_code === selectedToken &&
          balance.asset_issuer === asset.getIssuer()
      );

      // Create trustline if it doesn't exist
      if (!hasTrustline) {
        toast({
          title: 'Linking Bank Account...',
          description: `Setting up ${selectedToken} wallet trustline`,
          status: 'info',
          duration: 3000,
        });

        const trustlineOp = StellarSdk.Operation.changeTrust({
          asset: asset,
        });

        const trustlineTx = new StellarSdk.TransactionBuilder(sourceAccount, {
          fee: StellarSdk.BASE_FEE,
          networkPassphrase: StellarSdk.Networks.TESTNET,
        })
          .addOperation(trustlineOp)
          .setTimeout(300)
          .build();

        // Sign and submit trustline transaction
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
          title: 'Account Connected!',
          description: `You can now receive ${selectedToken} funds`,
          status: 'success',
          duration: 3000,
        });

        // Reload account with new trustline
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Now perform the swap
      const updatedAccount = await server.loadAccount(wallet.publicKey);

      // Build path payment: XLM → Token
      const transaction = new StellarSdk.TransactionBuilder(updatedAccount, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: StellarSdk.Networks.TESTNET,
      })
        .addOperation(
          StellarSdk.Operation.pathPaymentStrictSend({
            sendAsset: StellarSdk.Asset.native(),
            sendAmount: xlmAmount,
            destination: wallet.publicKey,
            destAsset: asset,
            destMin: (tokenAmount * 0.9).toString(), // 10% slippage tolerance
          })
        )
        .setTimeout(300)
        .build();

      // Sign with Freighter
      const xdr = transaction.toXDR();
      const signResult = await signTransaction(xdr, {
        networkPassphrase: StellarSdk.Networks.TESTNET,
      });

      // Submit to network
      const signedTx = StellarSdk.TransactionBuilder.fromXDR(
        signResult.signedTxXdr,
        StellarSdk.Networks.TESTNET
      );
      const result = await server.submitTransaction(signedTx);

      console.log('Deposit simulation successful:', result);

      toast({
        title: 'Deposit Successful!',
        description: `Received ${tokenAmount.toLocaleString()} ${selectedToken} in your VatanPay wallet`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      
      // Reset amount
      setXlmAmount('5');
    } catch (error) {
      console.error('Error funding wallet:', error);
      
      let errorMessage = 'Deposit failed. Please try again.';
      
      // Enhanced error logging
      if ((error as any).response?.data?.extras) {
        console.log('Stellar error details:', (error as any).response.data);
        const resultCodes = (error as any).response.data.extras.result_codes;
        
        if (resultCodes?.operations) {
          const opErrors = resultCodes.operations;
          if (opErrors.includes('op_under_dest_min')) {
            errorMessage = `Rate fluctuation. Try refreshing.`;
          } else if (opErrors.includes('op_too_few_offers')) {
            errorMessage = `No liquidity for bank transfer simulation. Run setup scripts.`;
          } else if (opErrors.includes('op_underfunded')) {
            errorMessage = `Insufficient XLM for testnet fee.`;
          } else if (opErrors.length > 0) {
            errorMessage = `Simulation failed: ${opErrors.join(', ')}`;
          }
        }
      }
      
      toast({
        title: 'Deposit Failed',
        description: errorMessage,
        status: 'error',
        duration: 10000,
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
        bgGradient="linear(to-br, gray.50, brand.50)"
        display="flex"
        alignItems="center"
        justifyContent="center"
        py={10}
      >
        <Container maxW="container.md">
          <Alert 
            status="info" 
            borderRadius="2xl" 
            p={8}
            boxShadow="glass"
            bg="white"
            border="2px"
            borderColor="brand.200"
          >
            <AlertIcon boxSize={6} color="brand.500" />
            <VStack align="start" spacing={2} ml={2}>
              <Text fontWeight="700" fontSize="lg">
                Connect Wallet to Deposit
              </Text>
              <Text color="gray.600">
                Please connect your wallet to simulate a bank deposit into VatanPay
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
      bgGradient="linear(to-br, gray.50, brand.50)"
      py={12}
    >
      <Container maxW="container.md">
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <VStack spacing={3} textAlign="center">
            <Icon as={FaUniversity} boxSize={12} color="brand.600" />
            <Heading 
              size="2xl" 
              fontWeight="900" 
              letterSpacing="-0.03em"
              color="brand.800"
            >
              Simulate Bank Deposit
            </Heading>
            <Text color="gray.600" fontSize="lg" maxW="xl">
              Deposit fiat currency (AED/INR) into your VatanPay wallet via Partner Anchor.
            </Text>
            <Badge colorScheme="orange" variant="solid" fontSize="sm" mt={2} px={3} py={1} borderRadius="full">
              Testnet Demo Mode
            </Badge>
          </VStack>

          {/* Setup Warning */}
          <Alert status="warning" borderRadius="xl" bg="orange.50" border="1px" borderColor="orange.200">
            <AlertIcon />
            <Box>
              <Text fontWeight="700" fontSize="sm" mb={1}>
                ⚠️ Testnet Simulation
              </Text>
              <Text fontSize="xs" color="gray.700">
                In production, this would be a real bank transfer.
                For this demo, we swap testnet XLM for AED/INR tokens to simulate the deposit.
              </Text>
            </Box>
          </Alert>

          {/* Main Card */}
          <Box 
            bg="white" 
            p={10} 
            borderRadius="3xl" 
            boxShadow="glass-lg"
            border="1px"
            borderColor="gray.100"
          >
            <VStack spacing={7}>
              {/* Token Selection */}
              <FormControl>
                <FormLabel 
                  fontWeight="700" 
                  fontSize="md" 
                  color="gray.700"
                  mb={3}
                >
                  Deposit Currency
                </FormLabel>
                <Select
                  value={selectedToken}
                  onChange={(e) => setSelectedToken(e.target.value as 'AED' | 'INR')}
                  size="lg"
                  fontSize="lg"
                  fontWeight="600"
                  h="64px"
                  icon={<FaMoneyBillWave />}
                >
                  <option value="AED">🇦🇪 AED (UAE Dirham)</option>
                  <option value="INR">🇮🇳 INR (Indian Rupee)</option>
                </Select>
              </FormControl>

              {/* Amount Input */}
              <FormControl>
                <FormLabel 
                  fontWeight="700" 
                  fontSize="md" 
                  color="gray.700"
                  mb={3}
                >
                  Deposit Amount (via XLM swap)
                </FormLabel>
                <NumberInput
                  value={xlmAmount}
                  onChange={(valueString) => setXlmAmount(valueString)}
                  min={0.1}
                  max={10000}
                  step={0.1}
                  size="lg"
                >
                  <NumberInputField 
                    h="64px" 
                    fontSize="xl" 
                    fontWeight="600"
                    placeholder="Enter amount"
                  />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                <Text fontSize="xs" color="gray.500" mt={2}>
                  Simulated Rate: 1 XLM = {EXCHANGE_RATES[selectedToken].toLocaleString()} {selectedToken}
                </Text>
              </FormControl>

              {/* Exchange Preview */}
              <Box 
                bgGradient="linear(135deg, brand.50, blue.50)"
                p={8} 
                borderRadius="2xl" 
                w="full"
                border="2px"
                borderColor="brand.200"
              >
                <VStack spacing={4}>
                  <Text fontSize="sm" fontWeight="700" color="gray.600" textTransform="uppercase">
                    Your Wallet Will Receive
                  </Text>
                  <HStack spacing={4} justify="center" align="center">
                    <Icon as={FaMoneyBillWave} boxSize={8} color="green.500" />
                    <Text fontSize="4xl" fontWeight="900" color="brand.800">
                      {tokenAmount.toLocaleString()}
                    </Text>
                    <Text fontSize="xl" fontWeight="700" color="gray.500">
                      {selectedToken}
                    </Text>
                  </HStack>
                </VStack>
              </Box>

              {/* Action Button */}
              <Button
                colorScheme="brand"
                size="lg"
                w="full"
                h="64px"
                fontSize="lg"
                fontWeight="800"
                onClick={handleClaim}
                isLoading={isLoading}
                loadingText="Processing Deposit..."
                isDisabled={!xlmAmount || parseFloat(xlmAmount) <= 0}
                leftIcon={<FaUniversity />}
                boxShadow="0 8px 24px rgba(49, 151, 149, 0.3)"
                _hover={{
                  transform: 'translateY(-2px)',
                  boxShadow: '0 16px 32px rgba(49, 151, 149, 0.4)',
                }}
                transition="all 0.3s"
              >
                Deposit Funds
              </Button>

              <Text fontSize="xs" color="gray.500" textAlign="center">
                ⚡ Funds are tokenized and deposited instantly on Stellar
              </Text>
            </VStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};
