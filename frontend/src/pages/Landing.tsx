import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  SimpleGrid,
  Icon,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { FaRocket, FaDollarSign, FaClock, FaShieldAlt, FaBolt, FaGlobe } from 'react-icons/fa';

export const Landing = () => {
  const navigate = useNavigate();

  return (
    <Box>
      {/* Hero Section with Gradient */}
      <Box
        bgGradient="linear(135deg, brand.500 0%, brand.700 50%, brand.900 100%)"
        color="white"
        py={{ base: 16, md: 24 }}
        position="relative"
        overflow="hidden"
      >
        {/* Animated background elements */}
        <Box
          position="absolute"
          top="10%"
          right="10%"
          w="400px"
          h="400px"
          borderRadius="full"
          bg="whiteAlpha.100"
          filter="blur(100px)"
          sx={{ animation: 'float 6s ease-in-out infinite' }}
        />
        <Box
          position="absolute"
          bottom="10%"
          left="5%"
          w="300px"
          h="300px"
          borderRadius="full"
          bg="success.400"
          opacity={0.1}
          filter="blur(100px)"
          sx={{ animation: 'float 8s ease-in-out infinite 1s' }}
        />
        
        <Container maxW="container.xl" position="relative" zIndex={1}>
          <VStack spacing={8} textAlign="center">
            <Box>
              <Text
                fontSize="sm"
                fontWeight="700"
                letterSpacing="wider"
                textTransform="uppercase"
                color="success.200"
                mb={4}
                sx={{ animation: 'pulse 2s ease-in-out infinite' }}
              >
                🚀 Powered by Stellar Blockchain
              </Text>
              <Heading
                size="3xl"
                fontWeight="900"
                letterSpacing="-0.04em"
                lineHeight="1.1"
                bgGradient="linear(to-r, white, whiteAlpha.900)"
                bgClip="text"
                mb={4}
              >
                Send Money Home Instantly
              </Heading>
              <Heading
              as="h1"
              size="4xl"
              fontWeight="900"
              lineHeight="1.2"
              letterSpacing="-0.04em"
              color="brand.900"
            >
              Send money home <br />
              <Text as="span" color="brand.500">
                instantly via MoneyGram
              </Text>
            </Heading>
            <Text fontSize="xl" color="gray.600" maxW="lg" lineHeight="1.8">
              The speed of Stellar. The trust of MoneyGram. <br/>
              Send USDC instantly from the Gulf to India with <b>0.5% fees</b>.
            </Text>
            </Box>
            
            <Text
              fontSize={{ base: 'lg', md: 'xl' }}
              maxW="3xl"
              color="whiteAlpha.900"
              lineHeight="tall"
            >
              Stop paying 5-7% to Western Union. Send AED to India in{' '}
              <Box as="span" color="success.200" fontWeight="700">
                5 seconds
              </Box>{' '}
              with transparent, real-time exchange rates.
            </Text>
            
            <VStack spacing={4}>
              <Button
                size="lg"
                colorScheme="green"
                onClick={() => navigate('/send')}
                px={12}
                h="60px"
                fontSize="lg"
                fontWeight="700"
                boxShadow="success"
                _hover={{
                  transform: 'translateY(-4px)',
                  boxShadow: '0 16px 32px rgba(0, 255, 144, 0.4)',
                }}
              >
                Send Money Now →
              </Button>
              <Text fontSize="sm" color="whiteAlpha.700">
                No signup required • Connect wallet to start
              </Text>
            </VStack>

            {/* Stats */}
            <SimpleGrid columns={{ base: 1, sm: 3 }} spacing={8} pt={8} w="full">
              {[
                { label: 'Settlement Time', value: '~5 sec', icon: FaBolt },
                { label: 'Platform Fee', value: '0.5%', icon: FaDollarSign },
                { label: 'Availability', value: '24/7', icon: FaGlobe },
              ].map((stat, idx) => (
                <Box
                  key={idx}
                  bg="whiteAlpha.200"
                  backdropFilter="blur(10px)"
                  p={6}
                  borderRadius="2xl"
                  border="1px"
                  borderColor="whiteAlpha.300"
                  textAlign="center"
                  transition="all 0.3s"
                  _hover={{
                    bg: 'whiteAlpha.300',
                    transform: 'translateY(-4px)',
                  }}
                >
                  <Icon as={stat.icon} boxSize={6} color="success.200" mb={2} />
                  <Text fontSize="3xl" fontWeight="900" mb={1}>
                    {stat.value}
                  </Text>
                  <Text fontSize="sm" color="whiteAlpha.800">
                    {stat.label}
                  </Text>
                </Box>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* Features */}
      <Container maxW="container.xl" py={20}>
        <VStack spacing={4} mb={12} textAlign="center">
          <Heading size="2xl" fontWeight="900" letterSpacing="-0.03em">
            Why VatanPay?
          </Heading>
          <Text fontSize="lg" color="gray.600" maxW="2xl">
            Built for migrant workers who deserve better than expensive traditional remittance services
          </Text>
        </VStack>

        <SimpleGrid columns={[1, 2, 3]} spacing={8}>
          {[
            {
              icon: FaRocket,
              title: 'Lightning Fast',
              description: 'Transactions settle in under 5 seconds on Stellar network. Your family gets money instantly.',
              color: 'brand.500',
              bg: 'brand.50',
            },
            {
              icon: FaDollarSign,
              title: 'Transparent Fees',
              description: 'Just 0.5% platform fee vs 5-7% with Western Union. Save thousands every year.',
              color: 'success.500',
              bg: 'success.50',
            },
            {
              icon: FaShieldAlt,
              title: 'Secure & Safe',
              description: 'Powered by Stellar blockchain. Your funds are secured by cryptography and smart contracts.',
              color: 'purple.500',
              bg: 'purple.50',
            },
            {
              icon: FaClock,
              title: '24/7 Available',
              description: 'Send money any time, any day. No banking hours, no holidays, no waiting.',
              color: 'orange.500',
              bg: 'orange.50',
            },
            {
              icon: FaBolt,
              title: 'Real-Time Rates',
              description: 'See exact exchange rates before sending. No hidden fees, no surprises.',
              color: 'yellow.600',
              bg: 'yellow.50',
            },
            {
              icon: FaGlobe,
              title: 'Borderless',
              description: 'Send from UAE to India with one click. More corridors coming soon.',
              color: 'cyan.500',
              bg: 'cyan.50',
            },
          ].map((feature, idx) => (
            <Box
              key={idx}
              bg="white"
              p={8}
              borderRadius="2xl"
              boxShadow="glass"
              border="1px"
              borderColor="gray.100"
              transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
              _hover={{
                transform: 'translateY(-8px)',
                boxShadow: 'glass-lg',
                borderColor: feature.color,
              }}
            >
              <Box
                bg={feature.bg}
                w="60px"
                h="60px"
                borderRadius="xl"
                display="flex"
                alignItems="center"
                justifyContent="center"
                mb={4}
              >
                <Icon as={feature.icon} boxSize={7} color={feature.color} />
              </Box>
              <Heading size="md" mb={3} fontWeight="800">
                {feature.title}
              </Heading>
              <Text color="gray.600" lineHeight="tall">
                {feature.description}
              </Text>
            </Box>
          ))}
        </SimpleGrid>
      </Container>

      {/* Comparison */}
      <Box bg="gray.50" py={20}>
        <Container maxW="container.lg">
          <Heading textAlign="center" mb={12} size="2xl" fontWeight="900" letterSpacing="-0.03em">
            See How Much You Save
          </Heading>
          <SimpleGrid columns={[1, 3]} spacing={6}>
            <Box
              bg="white"
              p={8}
              borderRadius="2xl"
              boxShadow="md"
              border="2px"
              borderColor="gray.200"
            >
              <Text fontSize="sm" fontWeight="700" color="gray.500" mb={2} textTransform="uppercase">
                Western Union
              </Text>
              <Text fontSize="4xl" fontWeight="900" color="red.500" mb={2}>
                5-7%
              </Text>
              <Text color="gray.600" fontSize="sm">
                Fee on ₹10,000 = <strong>₹500-700</strong>
              </Text>
              <Text color="gray.500" fontSize="xs" mt={2}>
                + Hidden exchange rate markup
              </Text>
            </Box>
            
            <Box
              bg="white"
              p={8}
              borderRadius="2xl"
              boxShadow="md"
              border="2px"
              borderColor="gray.200"
            >
              <Text fontSize="sm" fontWeight="700" color="gray.500" mb={2} textTransform="uppercase">
                Bank Transfer
              </Text>
              <Text fontSize="4xl" fontWeight="900" color="orange.500" mb={2}>
                2-3 days
              </Text>
              <Text color="gray.600" fontSize="sm">
                Plus 3-4% in fees
              </Text>
              <Text color="gray.500" fontSize="xs" mt={2}>
                Slow and expensive
              </Text>
            </Box>
            
            <Box
              bg="linear-gradient(135deg, #00FF90 0%, #00CC73 100%)"
              p={8}
              borderRadius="2xl"
              boxShadow="success"
              border="3px"
              borderColor="success.400"
              position="relative"
              overflow="hidden"
            >
              <Box
                position="absolute"
                top="-20px"
                right="-20px"
                bg="whiteAlpha.300"
                w="100px"
                h="100px"
                borderRadius="full"
                filter="blur(30px)"
              />
              <Text fontSize="sm" fontWeight="900" color="gray.800" mb={2} textTransform="uppercase">
                ✨ VatanPay
              </Text>
              <Text fontSize="4xl" fontWeight="900" color="gray.900" mb={2}>
                0.5%
              </Text>
              <Text color="gray.800" fontSize="sm" fontWeight="600">
                Fee on ₹10,000 = <strong>₹50 only!</strong>
              </Text>
              <Text color="gray.700" fontSize="xs" mt={2} fontWeight="600">
                Save 90% on fees 🎉
              </Text>
            </Box>
          </SimpleGrid>
        </Container>
      </Box>

      {/* How It Works */}
      <Container maxW="container.xl" py={20}>
        <Heading textAlign="center" mb={12} size="2xl" fontWeight="900" letterSpacing="-0.03em">
          How It Works
        </Heading>
        <SimpleGrid columns={[1, 3]} spacing={12}>
          {[
            {
              num: '1',
              title: 'Connect Wallet',
              description: 'Install Freighter wallet and connect to VatanPay in seconds',
              color: 'brand',
            },
            {
              num: '2',
              title: 'Enter Amount',
              description: 'Enter AED amount and recipient address. See real-time exchange rates',
              color: 'success',
            },
            {
              num: '3',
              title: 'Send Money',
              description: 'Confirm and send. Recipient gets INR in their wallet within 5 seconds',
              color: 'purple',
            },
          ].map((step, idx) => (
            <VStack key={idx} spacing={4}>
              <Box
                bgGradient={`linear(135deg, ${step.color}.400 0%, ${step.color}.600 100%)`}
                borderRadius="full"
                w={20}
                h={20}
                display="flex"
                alignItems="center"
                justifyContent="center"
                fontSize="3xl"
                fontWeight="900"
                color="white"
                boxShadow={`0 8px 20px rgba(0, 0, 0, 0.15)`}
              >
                {step.num}
              </Box>
              <Heading size="lg" fontWeight="800">
                {step.title}
              </Heading>
              <Text textAlign="center" color="gray.600" fontSize="lg" lineHeight="tall">
                {step.description}
              </Text>
            </VStack>
          ))}
        </SimpleGrid>
      </Container>

      {/* Final CTA */}
      <Box bgGradient="linear(135deg, brand.600 0%, brand.800 100%)" color="white" py={20}>
        <Container maxW="container.lg" textAlign="center">
          <Heading mb={4} size="2xl" fontWeight="900" letterSpacing="-0.03em">
            Ready to Send Money Home?
          </Heading>
          <Text mb={8} fontSize="xl" color="whiteAlpha.900" lineHeight="tall">
            Join thousands of migrant workers saving money on remittance fees
          </Text>
          <Button
            size="lg"
            colorScheme="green"
            onClick={() => navigate('/send')}
            px={12}
            h="60px"
            fontSize="lg"
            fontWeight="700"
            boxShadow="success"
            _hover={{
              transform: 'translateY(-4px)',
              boxShadow: '0 16px 32px rgba(0, 255, 144, 0.4)',
            }}
          >
            Get Started Now →
          </Button>
        </Container>
      </Box>
    </Box>
  );
};
