import {
  Box,
  Flex,
  Button,
  HStack,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import { useWallet } from '../hooks/useWallet';
import { FaWallet, FaChevronDown, FaSignOutAlt, FaCopy } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { BalanceBar } from './BalanceBar';

export const Navbar = () => {
  const { wallet, connect, disconnect } = useWallet();

  const copyAddress = () => {
     if (wallet?.publicKey) {
       navigator.clipboard.writeText(wallet.publicKey);
     }
  };

  return (
    <Box px={8} py={4} bg="white" borderBottom="1px" borderColor="gray.100">
      <Flex justify="space-between" align="center" maxW="container.xl" mx="auto">
        <HStack spacing={8}>
          <Text
            fontSize="2xl"
            fontWeight="900"
            letterSpacing="-0.05em"
            bgGradient="linear(to-r, brand.600, brand.800)"
            bgClip="text"
            as={Link}
            to="/"
            cursor="pointer"
          >
            VatanPay.
          </Text>

          <HStack spacing={6} display={{ base: 'none', md: 'flex' }}>
            <Link to="/faucet">
              <Text fontWeight="600" color="gray.600" _hover={{ color: 'brand.600' }}>
                Bank Deposit
              </Text>
            </Link>
            <Link to="/send">
              <Text fontWeight="600" color="gray.600" _hover={{ color: 'brand.600' }}>
                Send Money
              </Text>
            </Link>
            <Link to="/history">
              <Text fontWeight="600" color="gray.600" _hover={{ color: 'brand.600' }}>
                Transactions
              </Text>
            </Link>
            <Link to="/docs">
              <Text fontWeight="600" color="gray.600" _hover={{ color: 'brand.600' }}>
                Documentation
              </Text>
            </Link>
          </HStack>
        </HStack>

        <Box>
          {!wallet ? (
            <Button
              colorScheme="brand"
              size="md"
              leftIcon={<FaWallet />}
              onClick={connect}
              borderRadius="full"
              px={6}
              boxShadow="lg"
              _hover={{ transform: 'translateY(-1px)', boxShadow: 'xl' }}
            >
              Connect Wallet
            </Button>
          ) : (
            <HStack spacing={4}>
              <Box display={{ base: 'none', md: 'block' }}>
                <BalanceBar />
              </Box>

              <Menu>
                <MenuButton
                  as={Button}
                  variant="solid"
                  bg="gray.100"
                  _hover={{ bg: 'gray.200' }}
                  borderRadius="full"
                  rightIcon={<FaChevronDown size={12} />}
                  leftIcon={<Box w={2} h={2} bg="green.400" borderRadius="full" />}
                >
                  <Text fontSize="sm" fontFamily="monospace" fontWeight="700" color="gray.700">
                    {wallet.publicKey.slice(0, 4)}...{wallet.publicKey.slice(-4)}
                  </Text>
                </MenuButton>
                <MenuList borderRadius="xl" boxShadow="xl" p={2}>
                  <MenuItem
                    icon={<FaCopy />}
                    onClick={copyAddress}
                    borderRadius="lg"
                    fontSize="sm"
                    fontWeight="600"
                  >
                    Copy Address
                  </MenuItem>
                  <MenuItem
                    icon={<FaSignOutAlt />}
                    onClick={disconnect}
                    color="red.500"
                    borderRadius="lg"
                    fontSize="sm"
                    fontWeight="600"
                  >
                    Disconnect
                  </MenuItem>
                </MenuList>
              </Menu>
            </HStack>
          )}
        </Box>
      </Flex>
    </Box>
  );
};
