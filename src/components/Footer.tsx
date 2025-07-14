import { Box, Container, Text, Center, VStack, HStack, Divider } from "@chakra-ui/react";
import Gdsc from "./logos/Gdsc";
import Usg from "./logos/Usg";

export default function Footer() {
	return (
	<>
		<Box bg="gray.900" color="white" fontFamily="Inter">
			<Container maxW="7xl" py="5">
				<VStack spacing="6">
					{/* Main Footer Content */}
					<HStack 
						spacing="8" 
						alignItems="center" 
						justifyContent="center"
						flexWrap="wrap"
						>
						<Usg />
						<Divider orientation="vertical" h="8" borderColor="whiteAlpha.300" />
						<Gdsc />
					</HStack>

					{/* Divider */}
					<Divider borderColor="whiteAlpha.200" />

					{/* Footer Info */}
					<VStack spacing="2" textAlign="center">
						<Text fontSize="lg" fontWeight="semibold" color="white">
							Club Fair: Guilds
						</Text>
						<Text fontSize="xs" color="whiteAlpha.600" letterSpacing="wide">
							© {new Date().getFullYear()} GDGOC-UIC • Developed by Google Developer Group On Campus - UIC
						</Text>
					</VStack>
				</VStack>
			</Container>
			</Box>
		</>
	);
}
