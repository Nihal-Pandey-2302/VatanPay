import { Box, HStack, Text, VStack, Skeleton, Icon, Tooltip } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useWallet } from '../hooks/useWallet';
import { FaCoins, FaWallet } from 'react-icons/fa';
import * as StellarSdk from 'stellar-sdk';

interface Balance {
  xlm: string;
  aed: string;
  inr: string;
}

export const BalanceBar = () => {
  const { wallet } = useWallet();
  const [balances, setBalances] = useState<Balance>({ xlm: '0', aed: '0', inr: '0' });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!wallet) {
      setBalances({ xlm: '0', aed: '0', inr: '0' });
      return;
    }

    const fetchBalances = async () => {
      setIsLoading(true);
      try {
        const server = new StellarSdk.Horizon.Server(
          import.meta.env.VITE_HORIZON_URL || 'https://horizon-testnet.stellar.org'
        );

        const account = await server.loadAccount(wallet.publicKey);
        
        let xlmBalance = '0';
        let aedBalance = '0';
        let inrBalance = '0';

        account.balances.forEach((balance: any) => {
          if (balance.asset_type === 'native') {
            xlmBalance = parseFloat(balance.balance).toFixed(2);
          } else if ('asset_code' in balance) {
            if (balance.asset_code === 'AED') {
              aedBalance = parseFloat(balance.balance).toFixed(2);
            } else if (balance.asset_code === 'INR') {
              inrBalance = parseFloat(balance.balance).toFixed(2);
            }
          }
        });

        setBalances({ xlm: xlmBalance, aed: aedBalance, inr: inrBalance });
      } catch (error) {
        console.error('Error fetching balances:', error);
        // Keep showing 0 if there's an error
      } finally {
        setIsLoading(false);
      }
    };

    fetchBalances();
    
    // Refresh balances every 10 seconds
    const interval = setInterval(fetchBalances, 10000);
    return () => clearInterval(interval);
  }, [wallet]);

  if (!wallet) {
    return null;
  }

  return (
    <Box
      bg="whiteAlpha.200"
      backdropFilter="blur(10px)"
      borderRadius="xl"
      px={4}
      py={2}
      border="1px"
      borderColor="whiteAlpha.300"
    >
      <HStack spacing={6} divider={<Box h="20px" w="1px" bg="whiteAlpha.400" />}>
        {/* XLM Balance */}
        <Tooltip label="Stellar Lumens (XLM)" placement="bottom">
          <HStack spacing={2}>
            <Icon as={FaWallet} color="white" boxSize={4} />
            <VStack spacing={0} align="start">
              <Text fontSize="xs" color="whiteAlpha.700" fontWeight="600">
                XLM
              </Text>
              <Skeleton isLoaded={!isLoading} minW="50px">
                <Text fontSize="sm" color="white" fontWeight="800" fontFamily="monospace">
                  {balances.xlm}
                </Text>
              </Skeleton>
            </VStack>
          </HStack>
        </Tooltip>

        {/* AED Balance */}
        <Tooltip label="UAE Dirham Token (AED)" placement="bottom">
          <HStack spacing={2}>
            <Icon as={FaCoins} color="success.200" boxSize={4} />
            <VStack spacing={0} align="start">
              <Text fontSize="xs" color="whiteAlpha.700" fontWeight="600">
                AED
              </Text>
              <Skeleton isLoaded={!isLoading} minW="50px">
                <Text fontSize="sm" color="success.200" fontWeight="800" fontFamily="monospace">
                  {balances.aed}
                </Text>
              </Skeleton>
            </VStack>
          </HStack>
        </Tooltip>

        {/* INR Balance */}
        <Tooltip label="Indian Rupee Token (INR)" placement="bottom">
          <HStack spacing={2}>
            <Icon as={FaCoins} color="blue.200" boxSize={4} />
            <VStack spacing={0} align="start">
              <Text fontSize="xs" color="whiteAlpha.700" fontWeight="600">
                INR
              </Text>
              <Skeleton isLoaded={!isLoading} minW="50px">
                <Text fontSize="sm" color="blue.200" fontWeight="800" fontFamily="monospace">
                  {balances.inr}
                </Text>
              </Skeleton>
            </VStack>
          </HStack>
        </Tooltip>
      </HStack>
    </Box>
  );
};
