import { Box, Container, Text, VStack, HStack, Divider, SimpleGrid, Link, Stack } from "@chakra-ui/react";
import Gdsc from "./logos/Gdsc";
import Usg from "./logos/Usg";

export default function Footer() {
	return (
		<Box 
			bg="#2670FF" 
			color="white" 
			fontFamily="Inter"
			position="relative"
			overflow="hidden"
		>
			{/* Background Pattern */}
			<Box
				position="absolute"
				top="0"
				left="0"
				right="0"
				bottom="0"
				opacity="0.1"
				background="linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)"
				backgroundSize="60px 60px"
			/>
			
			<Container maxW="7xl" py={["8", "12"]} position="relative" zIndex="1">
				<VStack spacing={["8", "10"]}>
					{/* Main Footer Content */}
					<SimpleGrid 
						columns={[1, 1, 3]} 
						spacing={["8", "12"]} 
						w="full"
						alignItems="start"
					>
						{/* Left Section - Branding */}
						<VStack align={["center", "center", "flex-start"]} spacing="4">
							<Text 
								fontSize={["xl", "2xl"]} 
								fontWeight="bold" 
								color="white"
								letterSpacing="tight"
								textAlign={["center", "center", "left"]}
							>
								Club Fair: Guilds 2025
							</Text>
							<Text 
								fontSize="sm" 
								color="whiteAlpha.800" 
								maxW="300px"
								textAlign={["center", "center", "left"]}
								lineHeight="1.6"
							>
								Connecting students with clubs and organizations to build meaningful communities.
							</Text>
						</VStack>

						{/* Center Section - Organizations */}
						<VStack align="center" spacing="6">
							<Text 
								fontSize="lg" 
								fontWeight="semibold" 
								color="white"
								letterSpacing="wide"
							>
								Partners
							</Text>
							<HStack spacing="8" alignItems="center">
								{/*<Box 
									p="4" 
									bg="rgba(255, 255, 255, 0.1)" 
									borderRadius="xl" 
									backdropFilter="blur(10px)"
									border="1px solid rgba(255, 255, 255, 0.2)"
									transition="all 0.3s ease"
									_hover={{
										bg: "rgba(255, 255, 255, 0.15)",
										transform: "translateY(-2px)",
										boxShadow: "0 8px 25px rgba(0, 0, 0, 0.2)"
									}}
								>
									<Usg />
								</Box>*/}
								{/*<Box 
									p="4" 
									bg="rgba(255, 255, 255, 0.1)" 
									borderRadius="xl" 
									backdropFilter="blur(10px)"
									border="1px solid rgba(255, 255, 255, 0.2)"
									transition="all 0.3s ease"
									_hover={{
										bg: "rgba(255, 255, 255, 0.15)",
										transform: "translateY(-2px)",
										boxShadow: "0 8px 25px rgba(0, 0, 0, 0.2)"
									}}
								>

								</Box>*/}
								<Gdsc />
							</HStack>
						</VStack>

						{/* Right Section - Contact/Info */}
						<VStack align={["center", "center", "flex-end"]} spacing="4">
							<Text 
								fontSize="lg" 
								fontWeight="semibold" 
								color="white"
								letterSpacing="wide"
							>
								Connect
							</Text>
							<VStack spacing="2" align={["center", "center", "flex-end"]}>
								<Link
									href="mailto:contact@guilds-uic.com"
									color="whiteAlpha.800"
									fontSize="sm"
									_hover={{ color: "white", textDecoration: "underline" }}
									transition="all 0.2s ease"
								>
									gdsc@uic.edu.ph
								</Link>
								<Text 
									color="whiteAlpha.800" 
									fontSize="sm"
									textAlign={["center", "center", "right"]}
								>
									University of the Immaculate Conception
								</Text>
							</VStack>
						</VStack>
					</SimpleGrid>

					{/* Divider */}
					<Box w="full" h="1px" bg="rgba(255, 255, 255, 0.2)" />

					{/* Bottom Section */}
					<Stack 
						direction={["column", "row"]} 
						justify="space-between" 
						align="center" 
						w="full"
						spacing="4"
					>
						<Text 
							fontSize="sm" 
							color="whiteAlpha.700" 
							fontWeight="medium"
							textAlign={["center", "left"]}
						>
							© {new Date().getFullYear()} GDGOC-UIC. All rights reserved.
						</Text>
						<HStack spacing="6" flexWrap="wrap" justify="center">
							<Link
								href="#"
								color="whiteAlpha.700"
								fontSize="sm"
								_hover={{ color: "white" }}
								transition="color 0.2s ease"
							>
								Privacy Policy
							</Link>
							<Link
								href="#"
								color="whiteAlpha.700"
								fontSize="sm"
								_hover={{ color: "white" }}
								transition="color 0.2s ease"
							>
								Terms of Service
							</Link>
						</HStack>
					</Stack>
				</VStack>
			</Container>
		</Box>
	);
}
