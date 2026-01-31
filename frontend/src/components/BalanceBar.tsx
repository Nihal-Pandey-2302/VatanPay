import { Box, HStack, Text, VStack, Skeleton, Icon, Tooltip } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useWallet } from '../hooks/useWallet';
import { FaCoins, FaWallet, FaDollarSign } from 'react-icons/fa';
import * as StellarSdk from 'stellar-sdk';

interface Balance {
  xlm: string;
  usdc: string;
  inr: string;
}

export const BalanceBar = () => {
  const { wallet } = useWallet();
  const [balances, setBalances] = useState<Balance>({ xlm: '0', usdc: '0', inr: '0' });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!wallet) {
      setBalances({ xlm: '0', usdc: '0', inr: '0' });
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
        let usdcBalance = '0';
        let inrBalance = '0';

        account.balances.forEach((balance: any) => {
          if (balance.asset_type === 'native') {
            xlmBalance = parseFloat(balance.balance).toFixed(2);
          } else if ('asset_code' in balance) {
            if (balance.asset_code === 'USDC') {
              usdcBalance = parseFloat(balance.balance).toFixed(2);
            } else if (balance.asset_code === 'INR') {
              inrBalance = parseFloat(balance.balance).toFixed(2);
            }
          }
        });

        setBalances({ xlm: xlmBalance, usdc: usdcBalance, inr: inrBalance });
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
      bg="gray.50"
      borderRadius="full"
      px={4}
      py={2}
      border="1px"
      borderColor="gray.200"
    >
      <HStack spacing={6} divider={<Box h="20px" w="1px" bg="gray.300" />}>
        {/* XLM Balance */}
        <Tooltip label="Stellar Lumens (XLM)" placement="bottom">
          <HStack spacing={2}>
            <Icon as={FaWallet} color="gray.500" boxSize={4} />
            <VStack spacing={0} align="end">
              <Text fontSize="xs" color="gray.500" fontWeight="700" textTransform="uppercase">
                XLM
              </Text>
              <Skeleton isLoaded={!isLoading} minW="40px">
                <Text fontSize="sm" color="gray.700" fontWeight="800" fontFamily="monospace">
                  {balances.xlm}
                </Text>
              </Skeleton>
            </VStack>
          </HStack>
        </Tooltip>

        {/* USDC Balance */}
        <Tooltip label="USD Coin (USDC)" placement="bottom">
          <HStack spacing={2}>
            <Icon as={FaDollarSign} color="brand.500" boxSize={4} />
            <VStack spacing={0} align="end">
              <Text fontSize="xs" color="gray.500" fontWeight="700" textTransform="uppercase">
                USDC
              </Text>
              <Skeleton isLoaded={!isLoading} minW="40px">
                <Text fontSize="sm" color="brand.600" fontWeight="800" fontFamily="monospace">
                  {balances.usdc}
                </Text>
              </Skeleton>
            </VStack>
          </HStack>
        </Tooltip>

        {/* INR Balance */}
        <Tooltip label="Indian Rupee Token (INR)" placement="bottom">
          <HStack spacing={2}>
            <Icon as={FaCoins} color="blue.500" boxSize={4} />
            <VStack spacing={0} align="end">
              <Text fontSize="xs" color="gray.500" fontWeight="700" textTransform="uppercase">
                INR
              </Text>
              <Skeleton isLoaded={!isLoading} minW="40px">
                <Text fontSize="sm" color="blue.600" fontWeight="800" fontFamily="monospace">
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
