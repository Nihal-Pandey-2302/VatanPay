import { 
  Box, 
  Container, 
  Flex, 
  Heading, 
  Spacer, 
  HStack, 
  VStack, 
  IconButton, 
  useDisclosure, 
  Drawer, 
  DrawerBody, 
  DrawerHeader, 
  DrawerOverlay, 
  DrawerContent, 
  DrawerCloseButton,
  useBreakpointValue
} from '@chakra-ui/react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { WalletConnect } from './WalletConnect';
import { BalanceBar } from './BalanceBar';
import { FaBars } from 'react-icons/fa';

export const Navbar = () => {
  const location = useLocation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isMobile = useBreakpointValue({ base: true, md: false });
  
  const NavLink = ({ to, children, onClick }: { to: string; children: React.ReactNode, onClick?: () => void }) => {
    const isActive = location.pathname === to;
    
    return (
      <Box
        as={RouterLink}
        to={to}
        px={4}
        py={2}
        borderRadius="lg"
        fontWeight="600"
        fontSize="md"
        color={isActive ? 'white' : 'whiteAlpha.900'}
        bg={isActive ? 'whiteAlpha.300' : 'transparent'}
        backdropFilter={isActive ? 'blur(10px)' : 'none'}
        transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
        onClick={onClick}
        _hover={{
          bg: 'whiteAlpha.200',
          transform: 'translateY(-1px)',
          color: 'white',
        }}
        w={isMobile ? "full" : "auto"}
        textAlign={isMobile ? "center" : "left"}
      >
        {children}
      </Box>
    );
  };

  return (
    <Box 
      bgGradient="linear(135deg, brand.500 0%, brand.600 100%)"
      px={4} 
      py={4}
      color="white"
      position="sticky"
      top={0}
      zIndex={1000}
      boxShadow="0 4px 20px rgba(15, 167, 255, 0.2)"
      backdropFilter="blur(10px)"
    >
      <Container maxW="container.xl">
        <Flex align="center" w="full">
          <Heading 
            size="lg" 
            as={RouterLink} 
            to="/"
            fontWeight="900"
            letterSpacing="-0.03em"
            bgGradient="linear(to-r, white, whiteAlpha.800)"
            bgClip="text"
            _hover={{
              bgGradient: "linear(to-r, white, success.200)",
              transform: "scale(1.02)",
            }}
            transition="all 0.3s"
            cursor="pointer"
          >
            VatanPay
          </Heading>
          
          <Spacer />
          
          {/* Desktop Navigation */}
          {!isMobile && (
            <HStack spacing={4}>
              <HStack spacing={2}>
                <NavLink to="/send">Send Money</NavLink>
                <NavLink to="/faucet">Faucet</NavLink>
                <NavLink to="/swap">Swap</NavLink>
                <NavLink to="/history">History</NavLink>
                <NavLink to="/docs">Docs</NavLink>
              </HStack>
              <BalanceBar />
              <WalletConnect />
            </HStack>
          )}

          {/* Mobile Navigation Toggle */}
          {isMobile && (
            <IconButton
              aria-label="Open Menu"
              icon={<FaBars />}
              variant="ghost"
              color="white"
              onClick={onOpen}
              _hover={{ bg: 'whiteAlpha.200' }}
            />
          )}

          {/* Mobile Navigation Drawer */}
          <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
            <DrawerOverlay />
            <DrawerContent bg="brand.600" color="white">
              <DrawerCloseButton />
              <DrawerHeader borderBottomWidth="1px" borderColor="whiteAlpha.200">Menu</DrawerHeader>
              <DrawerBody>
                <VStack spacing={4} mt={4} align="stretch">
                  <WalletConnect />
                  <Box py={2}>
                    <BalanceBar />
                  </Box>
                  <NavLink to="/send" onClick={onClose}>Send Money</NavLink>
                  <NavLink to="/faucet" onClick={onClose}>Faucet</NavLink>
                  <NavLink to="/swap" onClick={onClose}>Swap</NavLink>
                  <NavLink to="/history" onClick={onClose}>History</NavLink>
                  <NavLink to="/docs" onClick={onClose}>Docs</NavLink>
                </VStack>
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        </Flex>
      </Container>
    </Box>
  );
};
