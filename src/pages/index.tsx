import Head from "next/head";
import { Club } from "contentlayer/generated";
import styled from "@emotion/styled";
import { stringify } from "qs";
import {
	Text,
	Heading,
	Box,
	Flex,
	Button,
	Spacer,
	Input,
	InputGroup,
	InputRightElement,
	Center,
	Image,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	VStack,
	ModalFooter,
	ModalOverlay,
	useDisclosure,
	Stack,
	AspectRatio,
	HStack,
	Badge,
	IconButton,
	Container,
	SimpleGrid,
	Tooltip,
} from "@chakra-ui/react";


import ClubCard from "src/components/ClubCard";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Layout from "src/components/layout";
import { FormEvent, FormEventHandler, useEffect, useState } from "react";
import { clubAssetURL, fetcher } from "src/utils";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { IoClose } from "react-icons/io5";
import { FiCheck } from "react-icons/fi";

const CLUBS_ENDPOINT = '/api/clubs';

export default function Home() {
	const router = useRouter();
	const [selectedTags, setSelectedTags] = useState<string[]>([]);

	const { data: featuredClubs } = useQuery<Club[]>([CLUBS_ENDPOINT, 'all'], () => fetcher(CLUBS_ENDPOINT));
	const { data: clubs, error, refetch } = useQuery<Club[]>([CLUBS_ENDPOINT, router.query], ({ queryKey }) => {
		const [_, queryParams] = queryKey;
		return fetcher(CLUBS_ENDPOINT + `/?${stringify(queryParams)}`);
	});

	const { data: clubTags } = useQuery<string[]>([CLUBS_ENDPOINT + '/tags'], () => fetcher(CLUBS_ENDPOINT + '/tags'));
	
	const handleSearchBar = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const data = new FormData(event.currentTarget);
		const query = data.get('search_query');
		if (!query) return router.push(`/`, undefined, { shallow: true });
		router.push(`/?q=${query}`, undefined, { shallow: true });
	}

	const handleTagClick = (tag: string) => {
		if (selectedTags.includes(tag)) {
			// Remove tag if already selected
			const newTags = selectedTags.filter(t => t !== tag);
			setSelectedTags(newTags);
			if (newTags.length === 0) {
				router.push(`/`, undefined, { shallow: true });
			} else {
				router.push(`/?tags=${newTags.join(',')}`, undefined, { shallow: true });
			}
		} else if (selectedTags.length < 3) {
			// Add tag if less than 3 selected
			const newTags = [...selectedTags, tag];
			setSelectedTags(newTags);
			router.push(`/?tags=${newTags.join(',')}`, undefined, { shallow: true });
		}
		// If 3 tags already selected, do nothing
	};

	const removeTag = (tagToRemove: string) => {
		const newTags = selectedTags.filter(t => t !== tagToRemove);
		setSelectedTags(newTags);
		if (newTags.length === 0) {
			router.push(`/`, undefined, { shallow: true });
		} else {
			router.push(`/?tags=${newTags.join(',')}`, undefined, { shallow: true });
		}
	};

	const { isOpen, onOpen: onModalOpen, onClose } = useDisclosure();
	useEffect(() => {
		if (!localStorage.getItem('__guilds_first')) {
			onModalOpen();
			localStorage.setItem('__guilds_first', '1');
		}
	}, []);

	// Initialize selected tags from URL params
	useEffect(() => {
		const tagsParam = router.query.tags as string;
		if (tagsParam) {
			setSelectedTags(tagsParam.split(','));
		} else {
			setSelectedTags([]);
		}
	}, [router.query.tags]);

	useEffect(() => {
		refetch();
	}, [router.query]);

	const getUrl = (path: string): string => {
		return router.basePath + path;
	}

	// Filter clubs based on selected tags
	const filteredClubs = clubs?.filter(club => {
		if (selectedTags.length === 0) return true;
		return selectedTags.some(tag => club.tags?.includes(tag));
	});

	return (
		<Layout>
			<Head>
				<title>Guilds - Find and join existing clubs</title>
				<meta name="description" content="Find and join existing clubs" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<GuildsModal isOpen={isOpen} onClose={onClose} />

			{/* Hero Section */}
			<Box
				position="relative"
				minH="100vh"
				display="flex"
				alignItems="center"
				justifyContent="center"
				overflow="hidden"
			>
				{/* Background Image */}
				<Image
					src="/girl.png"
					position="absolute"
					left="0"
					bottom="0"
					zIndex="0"
					alt="girl"
					h={["300px", "400px", "500px", "600px"]}
					opacity="0.8"
				/>

				{/* Content Container */}
				<Container maxW="7xl" position="relative" zIndex="1">
					<VStack spacing="12" textAlign="center">
						{/* Main Heading */}
						<Box>
							<Heading 
								fontSize={["2xl", "3xl", "4xl", "5xl"]} 
								fontWeight="bold"
								color="gray.800"
								lineHeight="1.2"
								mb="4"
							>
								Find and join existing clubs
							</Heading>
							<Text 
								fontSize={["lg", "xl"]} 
								color="gray.600"
								maxW="2xl"
								mx="auto"
							>
								Discover the perfect club that matches your interests and passions
							</Text>
						</Box>

						{/* Search Section */}
						<VStack spacing="8" w="full" maxW="4xl">
							<SearchBar
								query={router.query['q']?.toString() ?? ''}
								onSubmit={handleSearchBar} 
							/>

							{/* Selected Tags Display */}
							{selectedTags.length > 0 && (
								<VStack spacing="4" w="full">
									<HStack spacing="3" wrap="wrap" justifyContent="center">
										<Text fontSize="lg" fontWeight="semibold" color="gray.700">
											Selected Categories:
										</Text>
										{selectedTags.map(tag => (
											<Badge
												key={tag}
												colorScheme="blue"
												variant="solid"
												px="4"
												py="2"
												borderRadius="full"
												border="2px solid"
												borderColor="blue.600"
												display="flex"
												alignItems="center"
												gap="2"
												boxShadow="md"
											>
												{tag}
												<IconButton
													aria-label="Remove tag"
													icon={<IoClose />}
													size="xs"
													variant="ghost"
													color="white"
													onClick={() => removeTag(tag)}
													_hover={{ bg: 'rgba(255,255,255,0.2)' }}
												/>
											</Badge>
										))}
									</HStack>
									<Text fontSize="sm" color="gray.500">
										{selectedTags.length}/3 categories selected
									</Text>
								</VStack>
							)}

							{/* Category Selection Instructions */}
							{selectedTags.length === 0 && (
								<Text fontSize="md" color="gray.500" textAlign="center">
									Select up to 3 categories to filter clubs
								</Text>
							)}

							{/* Category Buttons */}
							<SimpleGrid 
								columns={[2, 3, 4, 5]} 
								spacing="4" 
								w="full"
								maxW="6xl"
							>
								{(clubTags ?? []).map(tag => {
									const isSelected = selectedTags.includes(tag);
									const isDisabled = selectedTags.length >= 3 && !isSelected;
									return (
										<Tooltip key={`tag_tooltip_${tag}`} label={tag} hasArrow placement="top">
											<Button
												key={`tag_${tag}`}
												onClick={() => handleTagClick(tag)}
												disabled={isDisabled}
												variant="ghost"
												bg={isSelected ? "blue.600" : "white"}
												color={isSelected ? "white" : "gray.800"}
												borderRadius="full"
												borderWidth={isSelected ? "2px" : "1px"}
												borderColor={isSelected ? "blue.600" : "gray.200"}
												boxShadow={isSelected ? "md" : "sm"}
												fontWeight="semibold"
												fontSize="md"
												px={6}
												py={2.5}
												minH="44px"
												maxW="180px"
												w="full"
												transition="all 0.18s cubic-bezier(.4,1,.7,1)"
												position="relative"
												opacity={isDisabled ? 0.5 : 1}
												cursor={isDisabled ? "not-allowed" : "pointer"}
												textOverflow="ellipsis"
												whiteSpace="nowrap"
												overflow="hidden"
												_display="flex"
												alignItems="center"
												_justifyContent="flex-start"
												_hover={isDisabled ? {} : {
													bg: isSelected ? "blue.700" : "gray.50",
													borderColor: isSelected ? "blue.700" : "blue.300",
													boxShadow: "lg",
													transform: "translateY(-2px) scale(1.04)",
												}}
												_active={isDisabled ? {} : {
													transform: "scale(0.98)",
												}}
												title={isDisabled ? "Maximum 3 categories allowed" : isSelected ? "Click to remove" : "Click to add"}
											>
												{isSelected && (
													<FiCheck style={{ marginRight: 8, flexShrink: 0 }} size={18} />
												)}
												<span style={{
													display: "inline-block",
													verticalAlign: "middle",
													textOverflow: "ellipsis",
													whiteSpace: "nowrap",
													overflow: "hidden",
													maxWidth: isSelected ? 120 : 140
												}}>{tag}</span>
											</Button>
										</Tooltip>
									);
								})}
							</SimpleGrid>
						</VStack>
					</VStack>
				</Container>
			</Box>

			{/* Results Section */}
			<Box bg="gray.50" py="16">
				<Container maxW="7xl">
					<ClubResults clubs={filteredClubs} error={error} />
				</Container>
			</Box>
		</Layout>
	);
}

function ClubResults({ clubs, error }: { clubs: Club[] | null, error?: any }) {
	if (error) {
		return (
			<Box textAlign="center" py="20">
				<Text fontSize="xl" color="red.500" mb="4">
					Error loading clubs
				</Text>
				<Text color="gray.600">
					Please try refreshing the page
				</Text>
			</Box>
		);
	}

	if (!clubs) {
		return (
			<Box textAlign="center" py="20">
				<Text fontSize="xl" color="gray.600" mb="4">
					Loading clubs...
				</Text>
			</Box>
		);
	}

	if (clubs.length === 0) {
		return (
			<Box textAlign="center" py="20">
				<Text fontSize="xl" color="gray.600" mb="4">
					No clubs found
				</Text>
				<Text color="gray.500">
					Try adjusting your search or filter criteria
				</Text>
			</Box>
		);
	}

	return (
		<VStack spacing="8" align="stretch">
			<Box>
				<Heading fontSize="2xl" color="gray.800" mb="2">
					Found {clubs.length} club{clubs.length !== 1 ? 's' : ''}
				</Heading>
				<Text color="gray.600">
					Explore the clubs below and find your perfect match
				</Text>
			</Box>
			
			<SimpleGrid 
				columns={[1, 2, 3, 4]} 
				spacing="6"
				w="full"
			>
				{clubs.map((club) => (
					<Box key={club._id}>
						<ClubCard club={club} />
					</Box>
				))}
			</SimpleGrid>
		</VStack>
	);
}

function SearchBar({ query, onSubmit }: { query: string, onSubmit: FormEventHandler<HTMLFormElement> }) {
	return (
		<form onSubmit={onSubmit} style={{ width: '100%' }}>
			<InputGroup
				size="lg"
				borderRadius="xl"
				boxShadow="lg"
				overflow="hidden"
				border="2px solid"
				borderColor="gray.200"
				_hover={{
					borderColor: "blue.300",
					boxShadow: "xl",
				}}
				_focusWithin={{
					borderColor: "blue.500",
					boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)",
				}}
				transition="all 0.2s"
			>
				<Input
					placeholder="Search for a club..."
					bg="white"
					border="none"
					px="6"
					py="4"
					fontSize="lg"
					_focus={{
						boxShadow: "none",
						border: "none",
					}}
					name="search_query"
					defaultValue={query}
				/>
				<InputRightElement
					w="auto"
					h="full"
					pr="2"
				>
					<Button
						h="calc(100% - 4px)"
						px="8"
						bg="blue.500"
						color="white"
						borderRadius="lg"
						mr="2"
						_hover={{
							bg: "blue.600",
							transform: "translateY(-1px)",
						}}
						_active={{
							transform: "translateY(0)",
						}}
						transition="all 0.2s"
						type="submit"
					>
						Search
					</Button>
				</InputRightElement>
			</InputGroup>
		</form>
	);
}

const StyledSlideShow = styled(Swiper)`
	max-height: 420px;
	background-color: lightgray;
	position: relative;
	color: white;
	border-width: 6px;
	border-radius: 25px;
	border-color: black;
	

	@media (min-width: 62em) {
		max-height: 592px;
	}
`;

function GuildsModal({ isOpen, onClose }) {
	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent
				border="10px solid black"
				borderRadius="50px"
				p="10"
				maxW={["90%", "60rem"]}
				bg="#FFECEC"
			>
				<ModalCloseButton
					_hover={{
						background: "red",
						color: "white",
						borderRadius: "50%",
					}}
					borderRadius="50%"
					fontSize="15px"
					m="1rem"
				/>
				<Flex>
					<VStack alignItems="center">
						<ModalBody textAlign="center">
							<Image
								src="/guilds-emblem.png"
								alt="Guilds"
								width={["50%", "30%"]}
								mx="auto"
								mb="4rem"
							/>
							<Text
								fontFamily="Space Grotesk"
								fontSize={["10px", "20px", "40px", "60px"]}
								fontWeight="bold"
							>
								Welcome to Guilds!
							</Text>
							<Text fontSize={["12px", "16px"]}>
								Guilds is the official club directory website for the UIC Club Fair 2025.
								You can search and browse all the clubs and organizations the university has to offer.
								Search your interests and find the best place where your heart beats!
							</Text>
						</ModalBody>
						<ModalFooter justifyContent="center">
							<Button
								px={["2rem", "7rem"]}
								py={["1rem", "2rem"]}
								boxShadow="5px 5px 0px black"
								borderRadius="0px"
								bg="#F2779A"
								color="white"
								border="3px solid black"
								onClick={onClose}
							>
								Get Started!
							</Button>
						</ModalFooter>
					</VStack>
				</Flex>
			</ModalContent>
		</Modal>
	);
}
