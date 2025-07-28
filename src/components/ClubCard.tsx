import {
	Heading,
	Img,
	Button,
	Text,
	Box,
	Center,
	Flex,
	VStack,
	HStack,
	useDisclosure,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalCloseButton,
	Divider,
	Icon,
} from "@chakra-ui/react";
import { Club } from "contentlayer/generated";
import Link from "next/link";
import { clubAssetURL } from "src/utils";
import Tag from "./Tag";
import { useState } from "react";

// Function to sort tags with Academic/Non-Academic Club first, then alphabetically
const sortTags = (tags: string[]): string[] => {
	return [...tags].sort((a, b) => {
		const aLower = a.toLowerCase();
		const bLower = b.toLowerCase();
		
		// Check if either tag is "Academic Club" or "Non-Academic Club"
		const aIsOrgType = aLower === "academic club" || aLower === "non-academic club";
		const bIsOrgType = bLower === "academic club" || bLower === "non-academic club";
		
		// If both are org types, sort them (Academic Club should come first)
		if (aIsOrgType && bIsOrgType) {
			return aLower === "academic club" ? -1 : 1;
		}
		
		// If only a is org type, it should come first
		if (aIsOrgType) return -1;
		
		// If only b is org type, it should come first
		if (bIsOrgType) return 1;
		
		// Otherwise, sort alphabetically
		return aLower.localeCompare(bLower);
	});
};

export default function ClubCard({ club }: { club: Club }) {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [showAllTags, setShowAllTags] = useState(false);

	const handleShowMoreTags = () => {
		setShowAllTags(true);
		onOpen();
	};

	// Sort tags for display
	const sortedTags = club.tags ? sortTags(club.tags) : [];

	return (
		<>
			<Box
				bg="white"
				borderRadius="xl"
				overflow="hidden"
				boxShadow="lg"
				border="1px solid"
				borderColor="gray.200"
				_hover={{
					transform: "translateY(-4px)",
					boxShadow: "xl",
				}}
				transition="all 0.3s ease"
				h="full"
				display="flex"
				flexDirection="column"
			>
				{/* Cover Photo - Use cover_card if available, otherwise cover_photo */}
				{(club.assets.cover_card || club.assets.cover_photo) && (
					<Box
						h="48"
						backgroundImage={`url(${clubAssetURL(club, club.assets.cover_card ? 'cover_card' : 'cover_photo')})`}
						backgroundPosition="center"
						backgroundSize="cover"
						position="relative"
					/>
				)}

				{/* Content */}
				<Box p="6" flex="1" display="flex" flexDirection="column">
					{/* Logo and Club Info */}
					<VStack spacing="4" mb="6">
						<Center>
							<Box
								position="relative"
								mt={club.assets.cover_photo ? "-12" : "0"}
							>
								<Img
									src={clubAssetURL(club, 'logo')}
									alt={club.name}
									w="24"
									h="24"
									borderRadius="full"
									border="4px solid white"
									boxShadow="lg"
									objectFit="cover"
								/>
							</Box>
						</Center>
						
						<VStack spacing="2" textAlign="center">
							<Heading fontSize="xl" color="gray.800" lineHeight="1.2">
								{club.name}
							</Heading>
						</VStack>
					</VStack>

					{/* Spacer to push tags and button to bottom */}
					<Box flex="1" />

					{/* Tags - Always at bottom */}
					{sortedTags.length > 0 && (
						<Box mb="4">
							<Flex wrap="wrap" gap="2" justify="center">
								{sortedTags.slice(0, 3).map((tag, index) => (
									<Tag
										key={`${tag}-${index}`}
										tagName={tag}
										size="sm"
										variant="subtle"
									/>
								))}
								{sortedTags.length > 3 && (
									<Box
										as="button"
										onClick={handleShowMoreTags}
										cursor="pointer"
										_hover={{ opacity: 0.8 }}
									>
										<Tag
											tagName={`+${sortedTags.length - 3} more`}
											size="sm"
											variant="outline"
										/>
									</Box>
								)}
							</Flex>
						</Box>
					)}

					{/* Action Button */}
					<Box>
						<Button
							as={Link}
							href={club.url}
							w="full"
							bg="blue.500"
							color="white"
							borderRadius="lg"
							py="3"
							_hover={{
								transform: "translateY(-1px)",
								boxShadow: "0 4px 12px rgba(59, 130, 246, 0.4)"
							}}
							_active={{
								transform: "translateY(0)",
							}}
							transition="all 0.2s"
						>
							View Club
						</Button>
					</Box>
				</Box>
			</Box>

			{/* Professional Modal for showing all tags */}
			<Modal isOpen={isOpen} onClose={onClose} size="md" isCentered>
				<ModalOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
				<ModalContent 
					borderRadius="xl" 
					boxShadow="2xl"
					border="1px solid"
					borderColor="gray.200"
					overflow="hidden"
				>
					{/* Header with club info */}
					<Box
						bg="gray.50"
						px={6}
						py={4}
						borderBottom="1px solid"
						borderColor="gray.200"
					>
						<Flex align="center" justify="space-between">
							<VStack align="start" spacing={1}>
								<Heading size="md" color="gray.800">
									Club Tags
								</Heading>
								<Text fontSize="sm" color="gray.600" fontWeight="medium">
									{club.name}
								</Text>
							</VStack>
							<ModalCloseButton 
								position="static"
								bg="white"
								borderRadius="full"
								w="8"
								h="8"
								boxShadow="sm"
								_hover={{
									bg: "gray.100",
									transform: "scale(1.05)",
								}}
								transition="all 0.2s"
							/>
						</Flex>
					</Box>

					{/* Body with tags */}
					<ModalBody p={6}>
						<VStack spacing={4} align="stretch">
							{/* Tag count info */}
							<Box textAlign="center" pb={2}>
								<Text fontSize="sm" color="gray.500" fontWeight="medium">
									{sortedTags.length} tag{sortedTags.length !== 1 ? 's' : ''} available
								</Text>
							</Box>

							{/* Tags grid */}
							<Box>
								<Flex 
									wrap="wrap" 
									gap={3} 
									justify="center"
									maxH="60vh"
									overflowY="auto"
									sx={{
										'&::-webkit-scrollbar': {
											width: '6px',
										},
										'&::-webkit-scrollbar-track': {
											background: 'gray.100',
											borderRadius: '3px',
										},
										'&::-webkit-scrollbar-thumb': {
											background: 'gray.300',
											borderRadius: '3px',
										},
										'&::-webkit-scrollbar-thumb:hover': {
											background: 'gray.400',
										},
									}}
								>
									{sortedTags.map((tag, index) => (
										<Tag
											key={`modal-${tag}-${index}`}
											tagName={tag}
											size="md"
											variant="subtle"
										/>
									))}
								</Flex>
							</Box>

							{/* Footer with close button */}
							<Box pt={4} borderTop="1px solid" borderColor="gray.200">
								<Button
									onClick={onClose}
									w="full"
									bg="gray.100"
									color="gray.700"
									borderRadius="lg"
									py={3}
									_hover={{
										bg: "gray.200",
									}}
									transition="all 0.2s"
								>
									Close
								</Button>
							</Box>
						</VStack>
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	);
}