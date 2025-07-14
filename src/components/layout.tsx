import { Box, Button, Container, HStack, Text, Icon } from "@chakra-ui/react";
import CurveBackground from "./CurveBackground";
import Footer from "./Footer";
import NavBar from "./NavBar";
import { FiMessageSquare } from "react-icons/fi";

export default function Layout({ children, maxWidth = '90rem', bgColor = '#0057FF', isHome = false }) {
	return (
		<Box position="relative" minH="100vh" display="flex" flexDirection="column">
			{/* Background */}
			<Box position="absolute" top="0" left="0" right="0" bottom="0" zIndex="-1">
				<CurveBackground fill={bgColor} />
			</Box>
			
			{isHome && (
				<Box
					position="absolute"
					top="0"
					left="0"
					right="0"
					bottom="0"
					zIndex="-2"
					bgColor="#FFF6EA"
				/>
			)}
			
			{/* Content */}
			<Box flex="1" display="flex" flexDirection="column">
				<NavBar />
				
				<Box 
					flex="1" 
					mx="auto" 
					px={maxWidth !== 'full' ? '1rem' : '0'} 
					maxWidth={maxWidth}
					w="full"
				>
					{children}
				</Box>
			</Box>

			{/* Professional Beta Banner */}
			<Box 
				position="sticky" 
				bottom="0" 
				left="0" 
				right="0" 
				bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
				zIndex={999}
				borderTop="1px solid"
				borderColor="whiteAlpha.200"
				backdropFilter="blur(10px)"
				boxShadow="0 -4px 20px rgba(0, 0, 0, 0.1)"
			>
				<Container maxW="7xl" py="3">
					<HStack 
						justifyContent="space-between" 
						alignItems="center"
						spacing="4"
					>
						<HStack spacing="3" alignItems="center">
							<Box
								bg="whiteAlpha.200"
								borderRadius="full"
								p="2"
								backdropFilter="blur(10px)"
							>
								<Icon as={FiMessageSquare} color="white" boxSize="4" />
							</Box>
							<Text 
								fontFamily="Inter" 
								fontSize="sm" 
								fontWeight="medium"
								color="white"
								letterSpacing="wide"
							>
								Guilds is in beta. Help us improve!
							</Text>
						</HStack>

						<Button
							as="a"
							href="https://docs.google.com/forms/d/e/1FAIpQLSekeADCSAqtMjjRiLEzMfcevWlLS9Az53bmo01zFgQJYeGfQg/viewform?usp=sf_link"
							target="_blank"
							rel="noopener noreferrer"
							bg="white"
							color="gray.800"
							px="6"
							py="2"
							borderRadius="full"
							fontSize="sm"
							fontWeight="semibold"
							border="1px solid"
							borderColor="whiteAlpha.300"
							_hover={{
								bg: "whiteAlpha.900",
								transform: "translateY(-1px)",
								boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
							}}
							_active={{
								transform: "translateY(0)",
							}}
							transition="all 0.2s ease"
							leftIcon={<Icon as={FiMessageSquare} boxSize="3" />}
						>
							Share Feedback
						</Button>
					</HStack>
				</Container>
			</Box>
			
			<Footer />
		</Box>
	);
}
