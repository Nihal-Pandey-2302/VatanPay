import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Code,
  OrderedList,
  ListItem,
  UnorderedList,
  Alert,
  AlertIcon,
  Link as ChakraLink,
  SimpleGrid,
  Icon,
  Divider,
  Badge,
} from '@chakra-ui/react';
import { FaRocket, FaShieldAlt, FaExchangeAlt, FaUniversity, FaQuestionCircle } from 'react-icons/fa';

export const Documentation = () => {
  return (
    <Box minH="calc(100vh - 80px)" bgGradient="linear(to-br, gray.50, blue.50)" py={12}>
      <Container maxW="container.xl">
        <VStack spacing={10} align="stretch">
          {/* Header */}
          <VStack spacing={4} textAlign="center">
            <Heading 
              size="2xl" 
              fontWeight="900" 
              letterSpacing="-0.03em"
              bgGradient="linear(to-r, brand.600, brand.800)"
              bgClip="text"
            >
              Documentation
            </Heading>
            <Text fontSize="xl" color="gray.600" maxW="3xl">
              Everything you need to know about VatanPay - from technology to token economics
            </Text>
            <Alert status="info" maxW="3xl" borderRadius="xl">
              <AlertIcon />
              <Box>
                <Text fontWeight="bold">Testnet Demo</Text>
                <Text fontSize="sm">
                  This is a demonstration running on Stellar Testnet. Do not send real money.
                  All transactions use test tokens with no real-world value.
                </Text>
              </Box>
            </Alert>
          </VStack>

          {/* Quick Links */}
          <SimpleGrid columns={[1, 2, 3]} spacing={6}>
            <Box 
              bg="white" 
              p={6} 
              borderRadius="2xl" 
              boxShadow="glass"
              border="1px"
              borderColor="gray.100"
              transition="all 0.3s"
              _hover={{ transform: 'translateY(-4px)', boxShadow: 'glass-lg' }}
              cursor="pointer"
              as="a"
              href="#how-it-works"
            >
              <Icon as={FaRocket} boxSize={8} color="brand.500" mb={3} />
              <Heading size="md" mb={2} fontWeight="800">How It Works</Heading>
              <Text fontSize="sm" color="gray.600">
                Learn the step-by-step process of sending money home
              </Text>
            </Box>

            <Box 
              bg="white" 
              p={6} 
              borderRadius="2xl" 
              boxShadow="glass"
              border="1px"
              borderColor="gray.100"
              transition="all 0.3s"
              _hover={{ transform: 'translateY(-4px)', boxShadow: 'glass-lg' }}
              cursor="pointer"
              as="a"
              href="#token-economics"
            >
              <Icon as={FaExchangeAlt} boxSize={8} color="success.500" mb={3} />
              <Heading size="md" mb={2} fontWeight="800">Token Economics</Heading>
              <Text fontSize="sm" color="gray.600">
                Understand AED/INR tokens and the anchor system
              </Text>
            </Box>

            <Box 
              bg="white" 
              p={6} 
              borderRadius="2xl" 
              boxShadow="glass"
              border="1px"
              borderColor="gray.100"
              transition="all 0.3s"
              _hover={{ transform: 'translateY(-4px)', boxShadow: 'glass-lg' }}
              cursor="pointer"
              as="a"
              href="#faq"
            >
              <Icon as={FaQuestionCircle} boxSize={8} color="purple.500" mb={3} />
              <Heading size="md" mb={2} fontWeight="800">FAQ</Heading>
              <Text fontSize="sm" color="gray.600">
                Get answers to common questions
              </Text>
            </Box>
          </SimpleGrid>

          {/* How It Works */}
          <Box id="how-it-works" bg="white" p={8} borderRadius="3xl" boxShadow="glass-lg" border="1px" borderColor="gray.100">
            <HStack spacing={3} mb={6}>
              <Icon as={FaRocket} boxSize={6} color="brand.500" />
              <Heading size="lg" fontWeight="900">How It Works</Heading>
            </HStack>
            <OrderedList spacing={4} fontSize="md">
              <ListItem>
                <Text fontWeight="700" mb={1}>Connect Your Wallet</Text>
                <Text fontSize="sm" color="gray.600">
                  Install <ChakraLink color="brand.600" fontWeight="600" href="https://www.freighter.app" isExternal>Freighter wallet</ChakraLink> extension and connect it to VatanPay
                </Text>
              </ListItem>
              <ListItem>
                <Text fontWeight="700" mb={1}>Enter Amount in AED</Text>
                <Text fontSize="sm" color="gray.600">
                  Specify how much you want to send (100-50,000 AED). You'll see real-time exchange rates from Stellar DEX
                </Text>
              </ListItem>
              <ListItem>
                <Text fontWeight="700" mb={1}>Add Recipient Address</Text>
                <Text fontSize="sm" color="gray.600">
                  Enter the Stellar wallet address of your family member in India
                </Text>
              </ListItem>
              <ListItem>
                <Text fontWeight="700" mb={1}>Review & Confirm</Text>
                <Text fontSize="sm" color="gray.600">
                  Check the fee breakdown (0.5%) and estimated INR amount with slippage protection
                </Text>
              </ListItem>
              <ListItem>
                <Text fontWeight="700" mb={1}>Send Money</Text>
                <Text fontSize="sm" color="gray.600">
                  Transaction executes in 3 steps: <Badge colorScheme="blue">Escrow</Badge> → <Badge colorScheme="green">Path Payment</Badge> → <Badge colorScheme="purple">Completion</Badge>. Takes ~5 seconds total!
                </Text>
              </ListItem>
            </OrderedList>
          </Box>

          {/* Token Economics Section */}
          <Box id="token-economics" bg="white" p={8} borderRadius="3xl" boxShadow="glass-lg" border="1px" borderColor="gray.100">
            <HStack spacing={3} mb={6}>
              <Icon as={FaExchangeAlt} boxSize={6} color="success.500" />
              <Heading size="lg" fontWeight="900">Understanding Tokens & Anchors</Heading>
            </HStack>
            
            <VStack align="stretch" spacing={6}>
              <Box>
                <Heading size="md" mb={3} fontWeight="800" color="brand.600">What are AED and INR Tokens?</Heading>
                <Text fontSize="sm" color="gray.700" mb={3}>
                  AED and INR tokens are <strong>digital representations of real currencies</strong> on the Stellar blockchain, issued by trusted entities called <strong>Anchors</strong>.
                </Text>
                <SimpleGrid columns={[1, 2]} spacing={4}>
                  <Box bg="brand.50" p={4} borderRadius="xl">
                    <Text fontWeight="700" mb={2}>🇦🇪 AED Token</Text>
                    <UnorderedList fontSize="sm" spacing={1}>
                      <ListItem>1 AED token = 1 real AED</ListItem>
                      <ListItem>Backed by <strong>Partner Anchor's</strong> reserves</ListItem>
                      <ListItem>Redeemable for real AED anytime</ListItem>
                    </UnorderedList>
                  </Box>
                  <Box bg="success.50" p={4} borderRadius="xl">
                    <Text fontWeight="700" mb={2}>🇮🇳 INR Token</Text>
                    <UnorderedList fontSize="sm" spacing={1}>
                      <ListItem>1 INR token = 1 real INR</ListItem>
                      <ListItem>Backed by <strong>Partner Anchor's</strong> reserves</ListItem>
                      <ListItem>Redeemable for real INR anytime</ListItem>
                    </UnorderedList>
                  </Box>
                </SimpleGrid>
              </Box>

              <Divider />

              <Box>
                <Heading size="md" mb={3} fontWeight="800" color="purple.600">The Anchor System</Heading>
                <Text fontSize="sm" color="gray.700" mb={3}>
                  <strong>Anchors</strong> are trusted entities that bridge traditional banking and blockchain:
                </Text>
                
                <VStack align="stretch" spacing={4}>
                  <Box bg="purple.50" p={4} borderRadius="xl">
                    <Text fontWeight="700" mb={2}>📥 On-Ramp (Real Money → Tokens)</Text>
                    <Text fontSize="sm" mb={2}>Worker in UAE:</Text>
                    <OrderedList fontSize="xs" spacing={1} ml={4}>
                      <ListItem>Deposits real AED to VatanPay's bank account</ListItem>
                      <ListItem>VatanPay verifies the deposit</ListItem>
                      <ListItem>VatanPay issues AED tokens to worker's wallet</ListItem>
                      <ListItem>Worker can now use tokens on blockchain</ListItem>
                    </OrderedList>
                  </Box>

                  <Box bg="orange.50" p={4} borderRadius="xl">
                    <Text fontWeight="700" mb={2}>📤 Off-Ramp (Tokens → Real Money)</Text>
                    <Text fontSize="sm" mb={2}>Family in India:</Text>
                    <OrderedList fontSize="xs" spacing={1} ml={4}>
                      <ListItem>Receives INR tokens in Stellar wallet</ListItem>
                      <ListItem>Opens VatanPay app and clicks "Withdraw"</ListItem>
                      <ListItem>VatanPay burns the tokens</ListItem>
                      <ListItem>VatanPay transfers real INR to family's bank account</ListItem>
                    </OrderedList>
                  </Box>
                </VStack>
              </Box>

              <Alert status="warning" borderRadius="xl">
                <AlertIcon />
                <Box>
                  <Text fontWeight="bold" fontSize="sm">Demo Limitation</Text>
                  <Text fontSize="xs">
                    The current testnet demo does NOT have banking integration. Tokens are issued manually for testing. Production would require banking partnerships and regulatory licenses.
                  </Text>
                </Box>
              </Alert>
            </VStack>
          </Box>

          {/* Proof of Remittance Section - NEW! */}
          <Box bg="white" p={8} borderRadius="3xl" boxShadow="glass-lg" border="1px" borderColor="gray.100">
            <HStack spacing={3} mb={6}>
              <Icon as={FaUniversity} boxSize={6} color="green.500" />
              <Heading size="lg" fontWeight="900">Proof of Remittance</Heading>
            </HStack>
            
            <VStack align="stretch" spacing={6}>
              <Box>
                <Heading size="md" mb={3} fontWeight="800" color="green.600">Verifiable On-Chain Proof</Heading>
                <Text fontSize="sm" color="gray.700" mb={3}>
                  Every transaction on VatanPay is recorded on the <strong>Stellar Blockchain</strong>. This serves as an immutable, cryptographically secure receipt that cannot be forged or altered.
                </Text>
                <Alert status="success" borderRadius="xl">
                  <AlertIcon />
                  <Box>
                    <Text fontSize="sm" fontWeight="bold">How to Verify?</Text>
                    <Text fontSize="xs">
                      Click the "TX Hash" link in your Transaction History to view the official record on Stellar Expert. This explorer shows the exact flow of funds from Sender → DEX → Recipient.
                    </Text>
                  </Box>
                </Alert>
              </Box>
            </VStack>
          </Box>

          {/* Trustline Requirements Section - NEW! */}
          <Box bg="white" p={8} borderRadius="3xl" boxShadow="glass-lg" border="1px" borderColor="gray.100">
            <HStack spacing={3} mb={6}>
              <Icon as={FaShieldAlt} boxSize={6} color="orange.500" />
              <Heading size="lg" fontWeight="900">Understanding Trustlines</Heading>
            </HStack>
            
            <VStack align="stretch" spacing={6}>
              <Box>
                <Heading size="md" mb={3} fontWeight="800" color="orange.600">What is a Trustline?</Heading>
                <Text fontSize="sm" color="gray.700" mb={3}>
                  A <strong>trustline</strong> is a Stellar account setting that allows you to hold and receive custom tokens (assets). Think of it as "enabling" a specific token for your wallet.
                </Text>
                <Alert status="info" borderRadius="xl">
                  <AlertIcon />
                  <Box>
                    <Text fontSize="sm" fontWeight="bold">Why is this needed?</Text>
                    <Text fontSize="xs">
                      By default, Stellar accounts can only hold XLM. To receive AED or INR tokens, you must first create a trustline to "trust" the token issuer.
                    </Text>
                  </Box>
                </Alert>
              </Box>

              <Divider />

              <Box>
                <Heading size="md" mb={3} fontWeight="800" color="blue.600">How to Create a Trustline</Heading>
                <SimpleGrid columns={[1, 2]} spacing={4}>
                  <Box bg="blue.50" p={4} borderRadius="xl">
                    <Text fontWeight="700" mb={2}>✅ Automatic (Recommended)</Text>
                    <OrderedList fontSize="sm" spacing={1}>
                      <ListItem>Go to the <strong>Faucet</strong> page</ListItem>
                      <ListItem>Select AED or INR token</ListItem>
                      <ListItem>Enter any amount of XLM</ListItem>
                      <ListItem>Click "Get Tokens"</ListItem>
                      <ListItem>Trustline is created automatically! ✨</ListItem>
                    </OrderedList>
                  </Box>
                  <Box bg="gray.50" p={4} borderRadius="xl">
                    <Text fontWeight="700" mb={2}>⚙️ Manual (Advanced)</Text>
                    <OrderedList fontSize="sm" spacing={1}>
                      <ListItem>Go to <ChakraLink color="blue.500" href="https://laboratory.stellar.org" isExternal>Stellar Laboratory</ChakraLink></ListItem>
                      <ListItem>Create Change Trust operation</ListItem>
                      <ListItem>Enter asset code (AED/INR)</ListItem>
                      <ListItem>Enter issuer address</ListItem>
                      <ListItem>Sign and submit</ListItem>
                    </OrderedList>
                  </Box>
                </SimpleGrid>
              </Box>

              <Alert status="warning" borderRadius="xl">
                <AlertIcon />
                <Box>
                  <Text fontWeight="bold" fontSize="sm">⚠️ Important for Send Money</Text>
                  <Text fontSize="xs">
                    When sending tokens to someone, the <strong>recipient must have a trustline</strong> for that token. Otherwise the transaction will fail with `op_no_trust` error. Make sure both sender and recipient have trustlines set up!
                  </Text>
                </Box>
              </Alert>
            </VStack>
          </Box>

          {/* Token Faucet Section */}
          <Box bg="white" p={8} borderRadius="3xl" boxShadow="glass-lg" border="1px" borderColor="gray.100">
            <HStack spacing={3} mb={6}>
              <Icon as={FaExchangeAlt} boxSize={6} color="purple.500" />
              <Heading size="lg" fontWeight="900">Token Faucet - Get Test Tokens</Heading>
            </HStack>
            
            <VStack align="stretch" spacing={6}>
              <Box>
                <Heading size="md" mb={3} fontWeight="800" color="purple.600">Real DEX Swaps, Not Fake Claims</Heading>
                <Text fontSize="sm" color="gray.700" mb={3}>
                  Unlike traditional faucets that just say "tokens claimed", our faucet <strong>actually exchanges your XLM for tokens</strong> using Stellar's decentralized exchange!
                </Text>
                
                <SimpleGrid columns={[1, 2]} spacing={4}>
                  <Box bg="purple.50" p={4} borderRadius="xl">
                    <Text fontWeight="700" mb={2}>💱 How It Works</Text>
                    <OrderedList fontSize="xs" spacing={1}>
                      <ListItem>Enter the XLM amount you want to swap</ListItem>
                      <ListItem>Choose AED or INR tokens</ListItem>
                      <ListItem>System auto-creates trustline (first time only)</ListItem>
                      <ListItem>Executes path payment: XLM → Tokens</ListItem>
                      <ListItem>Tokens appear in your wallet in ~5 seconds!</ListItem>
                    </OrderedList>
                  </Box>
                  
                  <Box bg="pink.50" p={4} borderRadius="xl">
                    <Text fontWeight="700" mb={2}>📊 Exchange Rates</Text>
                    <UnorderedList fontSize="xs" spacing={1}>
                      <ListItem>1 XLM = 200 AED tokens</ListItem>
                      <ListItem>1 XLM = 4,500 INR tokens</ListItem>
                      <ListItem>Custom amounts supported</ListItem>
                      <ListItem>10% slippage tolerance</ListItem>
                    </UnorderedList>
                  </Box>
                </SimpleGrid>
              </Box>

              <Divider />

              <Box>
                <Heading size="md" mb={3} fontWeight="800" color="brand.600">Automatic Trustline Creation</Heading>
                <Text fontSize="sm" color="gray.700" mb={3}>
                  On Stellar, you need a <strong>trustline</strong> before receiving custom tokens. Our faucet <strong>automatically creates it for you!</strong>
                </Text>
                
                <Box bg="blue.50" p={4} borderRadius="xl">
                  <Text fontWeight="700" mb={2}>🔧 What Happens Behind the Scenes</Text>
                  <OrderedList fontSize="xs" spacing={2}>
                    <ListItem>
                      <strong>First time using a token:</strong>
                      <UnorderedList mt={1} ml={4}>
                        <ListItem>Faucet detects missing trustline</ListItem>
                        <ListItem>Creates trustline transaction (you sign)</ListItem>
                        <ListItem>Waits 1 second for confirmation</ListItem>
                        <ListItem>Then performs the swap (you sign again)</ListItem>
                      </UnorderedList>
                    </ListItem>
                    <ListItem>
                      <strong>Subsequent swaps:</strong> Only one signature needed!
                    </ListItem>
                  </OrderedList>
                </Box>
              </Box>

              <Alert status="success" borderRadius="xl">
                <AlertIcon />
                <Box>
                  <Text fontWeight="bold" fontSize="sm">User Experience Win!</Text>
                  <Text fontSize="xs">
                    Traditional Stellar dApps force users to create trustlines manually via Stellar Laboratory. 
                    We automate this completely - just click, sign, and get tokens!
                  </Text>
                </Box>
              </Alert>

              <Box>
                <Text fontWeight="700" mb={2} color="gray.700">Prerequisites</Text>
                <UnorderedList fontSize="sm" spacing={1} ml={4}>
                  <ListItem>Freighter wallet installed and connected</ListItem>
                  <ListItem>At least 5 XLM in your wallet (get from <ChakraLink href="https://laboratory.stellar.org/#account-creator?network=test" isExternal color="brand.500" textDecoration="underline">Stellar Friendbot</ChakraLink>)</ListItem>
                  <ListItem>That's it! We handle the rest ✨</ListItem>
                </UnorderedList>
              </Box>
            </VStack>
          </Box>

          {/* Technical Architecture */}
          <Box bg="white" p={8} borderRadius="3xl" boxShadow="glass-lg" border="1px" borderColor="gray.100">
            <HStack spacing={3} mb={6}>
              <Icon as={FaShieldAlt} boxSize={6} color="purple.500" />
              <Heading size="lg" fontWeight="900">Technical Architecture</Heading>
            </HStack>
            
            <VStack align="stretch" spacing={6}>
              <Box>
                <Text fontWeight="700" mb={2} color="brand.600">🔒 Smart Contract (Soroban)</Text>
                <UnorderedList fontSize="sm" spacing={1} ml={4}>
                  <ListItem>Escrows AED tokens during transaction</ListItem>
                  <ListItem>Calculates 0.5% platform fee automatically</ListItem>
                  <ListItem>Tracks transaction history on-chain</ListItem>
                  <ListItem>Rate limiting: 5 transactions per user per day</ListItem>
                  <ListItem>24-hour refund mechanism for failed transactions</ListItem>
                </UnorderedList>
              </Box>
              
              <Box>
                <Text fontWeight="700" mb={2} color="success.600">💱 Path Payment Flow</Text>
                <Text fontSize="sm" color="gray.600" mb={2}>
                  VatanPay uses Stellar's native path payment to convert currencies automatically:
                </Text>
                <Code display="block" my={2} p={3} fontSize="sm" borderRadius="lg" bg="gray.50">
                  AED → XLM → INR (via Stellar DEX liquidity pools)
                </Code>
                <Text fontSize="sm" color="gray.600">
                  This ensures you get the best available exchange rate in real-time from the decentralized exchange.
                </Text>
              </Box>
              
              <Box>
                <Text fontWeight="700" mb={2} color="purple.600">🛡️ Security Features</Text>
                <UnorderedList fontSize="sm" spacing={1} ml={4}>
                  <ListItem>Wallet authentication required via Freighter</ListItem>
                  <ListItem>Amount validation (min: 100 AED, max: 50,000 AED)</ListItem>
                  <ListItem>Slippage protection (max 2% from quoted rate)</ListItem>
                  <ListItem>Event logging for complete transparency</ListItem>
                  <ListItem>Non-custodial (you control your private keys)</ListItem>
                </UnorderedList>
              </Box>
            </VStack>
          </Box>

          {/* FAQ */}
          <Box id="faq" bg="white" p={8} borderRadius="3xl" boxShadow="glass-lg" border="1px" borderColor="gray.100">
            <HStack spacing={3} mb={6}>
              <Icon as={FaQuestionCircle} boxSize={6} color="orange.500" />
              <Heading size="lg" fontWeight="900">Frequently Asked Questions</Heading>
            </HStack>
            
            <Accordion allowToggle>
              <AccordionItem border="none" mb={2}>
                <h2>
                  <AccordionButton 
                    bg="gray.50" 
                    borderRadius="lg" 
                    _hover={{ bg: 'gray.100' }}
                    _expanded={{ bg: 'brand.50', color: 'brand.700' }}
                  >
                    <Box flex="1" textAlign="left" fontWeight="700">
                      How is VatanPay different from Western Union?
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4} pt={4} fontSize="sm">
                  <SimpleGrid columns={[1, 2]} spacing={4}>
                    <Box>
                      <Text fontWeight="700" color="red.600" mb={1}>❌ Western Union</Text>
                      <UnorderedList spacing={1} fontSize="xs">
                        <ListItem>5-7% fees</ListItem>
                        <ListItem>1-3 days settlement</ListItem>
                        <ListItem>Hidden exchange rate markups</ListItem>
                        <ListItem>Limited business hours</ListItem>
                      </UnorderedList>
                    </Box>
                    <Box>
                      <Text fontWeight="700" color="success.600" mb={1}>✅ VatanPay</Text>
                      <UnorderedList spacing={1} fontSize="xs">
                        <ListItem>0.5% fees (10x cheaper)</ListItem>
                        <ListItem>5 seconds settlement (1000x faster)</ListItem>
                        <ListItem>Transparent real-time rates</ListItem>
                        <ListItem>24/7 availability</ListItem>
                      </UnorderedList>
                    </Box>
                  </SimpleGrid>
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem border="none" mb={2}>
                <h2>
                  <AccordionButton 
                    bg="gray.50" 
                    borderRadius="lg" 
                    _hover={{ bg: 'gray.100' }}
                    _expanded={{ bg: 'brand.50', color: 'brand.700' }}
                  >
                    <Box flex="1" textAlign="left" fontWeight="700">
                      Is my money safe?
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4} pt={4} fontSize="sm">
                  Yes! Your funds are protected by multiple layers:
                  <UnorderedList mt={2} spacing={1} fontSize="sm">
                    <ListItem>Smart contract escrow (funds locked during transaction)</ListItem>
                    <ListItem>Stellar blockchain security (battle-tested since 2014)</ListItem>
                    <ListItem>Non-custodial wallet (you own your private keys)</ListItem>
                    <ListItem>Automatic refund if transaction fails</ListItem>
                    <ListItem>Anchor reserves are audited and 1:1 backed</ListItem>
                  </UnorderedList>
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem border="none" mb={2}>
                <h2>
                  <AccordionButton 
                    bg="gray.50" 
                    borderRadius="lg" 
                    _hover={{ bg: 'gray.100' }}
                    _expanded={{ bg: 'brand.50', color: 'brand.700' }}
                  >
                    <Box flex="1" textAlign="left" fontWeight="700">
                      What's the difference between XLM and AED/INR tokens?
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4} pt={4} fontSize="sm">
                  <VStack align="stretch" spacing={3}>
                    <Box>
                      <Text fontWeight="700" color="brand.600">XLM (Stellar Lumens)</Text>
                      <Text fontSize="xs">
                        Stellar's native cryptocurrency used ONLY for paying tiny network fees (~$0.000001 per transaction). You don't use XLM for remittances.
                      </Text>
                    </Box>
                    <Box>
                      <Text fontWeight="700" color="success.600">AED/INR Tokens</Text>
                      <Text fontSize="xs">
                        Digital representations of real currencies issued by anchors (like VatanPay). 1 AED token = 1 real AED in the bank. These are what you actually send.
                      </Text>
                    </Box>
                  </VStack>
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem border="none" mb={2}>
                <h2>
                  <AccordionButton 
                    bg="gray.50" 
                    borderRadius="lg" 
                    _hover={{ bg: 'gray.100' }}
                    _expanded={{ bg: 'brand.50', color: 'brand.700' }}
                  >
                    <Box flex="1" textAlign="left" fontWeight="700">
                      What are the transaction limits?
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4} pt={4} fontSize="sm">
                  <UnorderedList spacing={1}>
                    <ListItem><strong>Minimum per transaction:</strong> 100 AED (~₹2,250)</ListItem>
                    <ListItem><strong>Maximum per transaction:</strong> 50,000 AED (~₹11,25,000)</ListItem>
                    <ListItem><strong>Daily limit:</strong> 5 transactions per user</ListItem>
                    <ListItem><strong>Slippage tolerance:</strong> Maximum 2% from quoted rate</ListItem>
                  </UnorderedList>
                  <Text mt={2} fontSize="xs" color="gray.500">
                    These limits are for the MVP demo. Production version will have higher limits based on regulatory requirements.
                  </Text>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </Box>

          {/* Resources */}
          <Box bg="linear-gradient(135deg, brand.50 0%, success.50 100%)" p={8} borderRadius="3xl" border="2px" borderColor="brand.200">
            <HStack spacing={3} mb={6}>
              <Icon as={FaUniversity} boxSize={6} color="brand.600" />
              <Heading size="lg" fontWeight="900">Useful Resources</Heading>
            </HStack>
            
            <SimpleGrid columns={[1, 2]} spacing={4} fontSize="sm">
              <ChakraLink 
                href="https://www.freighter.app/" 
                isExternal 
                color="brand.700"
                fontWeight="600"
                _hover={{ color: 'brand.900' }}
              >
                📦 Freighter Wallet - Install browser extension
              </ChakraLink>
              <ChakraLink 
                href="https://stellar.org" 
                isExternal 
                color="brand.700"
                fontWeight="600"
                _hover={{ color: 'brand.900' }}
              >
                ⭐ Stellar Network - Learn about the blockchain
              </ChakraLink>
              <ChakraLink 
                href="https://soroban.stellar.org" 
                isExternal 
                color="brand.700"
                fontWeight="600"
                _hover={{ color: 'brand.900' }}
              >
                📜 Soroban Docs - Smart contract platform
              </ChakraLink>
              <ChakraLink 
                href="https://stellar.expert/explorer/testnet" 
                isExternal 
                color="brand.700"
                fontWeight="600"
                _hover={{ color: 'brand.900' }}
              >
                🔍 Stellar Expert - Testnet blockchain explorer
              </ChakraLink>
              <ChakraLink 
                href="https://github.com/your-repo" 
                isExternal 
                color="brand.700"
                fontWeight="600"
                _hover={{ color: 'brand.900' }}
              >
                💻 GitHub Repository - View source code
              </ChakraLink>
              <ChakraLink 
                href="/docs/HOW_IT_WORKS.md" 
                color="brand.700"
                fontWeight="600"
                _hover={{ color: 'brand.900' }}
              >
                📚 Complete Guide - Detailed documentation with diagrams
              </ChakraLink>
            </SimpleGrid>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};
