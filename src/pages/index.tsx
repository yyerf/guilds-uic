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
import { FormEvent, FormEventHandler, useEffect, useState, useMemo } from "react";
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
	}, [onModalOpen]);

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
	}, [router.query, refetch]);

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
				py={["16", "20"]}
				px={["4", "6", "8"]}
			>
				{/* Content Container */}
				<Container maxW="7xl" position="relative" zIndex="1">
					<VStack spacing={["8", "10", "12"]} textAlign="center">
						{/* Logo */}
						<Box>
							<Image
								src="/image.png"
								alt="Guilds Logo"
								maxH={["100px", "130px", "160px", "200px"]}
								maxW={["250px", "350px", "450px", "600px"]}
								objectFit="contain"
								mx="auto"
								filter="drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))"
							/>
						</Box>

						{/* Main Heading and Subtext */}
						<Box px={["2", "4", "6"]}>
							<Heading 
								fontSize={["xl", "2xl", "3xl", "4xl", "5xl"]} 
								fontWeight="bold"
								color="white"
								lineHeight="1.1"
								mb={["4", "5", "6"]}
								letterSpacing="-0.02em"
								textShadow="2px 2px 4px rgba(0,0,0,0.3)"
							>
								Welcome to Guilds
							</Heading>
							<Text 
								fontSize={["md", "lg", "xl", "2xl"]} 
								color="white"
								maxW="3xl"
								mx="auto"
								fontWeight="500"
								lineHeight="1.6"
								textShadow="1px 1px 2px rgba(0,0,0,0.2)"
								px={["2", "0"]}
							>
								Discover the perfect club that matches your interests and passions!
							</Text>
						</Box>

						{/* Slideshow Section */}
						<Box w="full" maxW="6xl">
							<ClubSlideshow />
						</Box>

						{/* Search Section */}
						<VStack spacing={["6", "8", "10"]} w="full" maxW="6xl" px={["2", "4"]}>
							<SearchBar
								query={router.query['q']?.toString() ?? ''}
								onSubmit={handleSearchBar} 
							/>

							{/* Category Buttons */}
							<Box w="full" maxW="5xl">
								<SimpleGrid 
									columns={[1, 2, 2, 3]} 
									spacing={["3", "4", "4", "4"]} 
									w="full"
									justifyItems="center"
								>
									{clubTags?.map(tag => {
										const isSelected = selectedTags.includes(tag);
										const isDisabled = selectedTags.length >= 3 && !isSelected;
										return (
											<Button
												key={`tag_${tag}`}
												onClick={() => handleTagClick(tag)}
												disabled={isDisabled}
												variant="outline"
												bg={isSelected ? "white" : "rgba(255,255,255,0.2)"}
												color="black"
												borderRadius="full"
												borderWidth="2px"
												borderColor={isSelected ? "black" : "rgba(0,0,0,0.6)"}
												backdropFilter="blur(10px)"
												boxShadow={isSelected ? "0 8px 25px rgba(0,0,0,0.3)" : "0 4px 15px rgba(0,0,0,0.2)"}
												fontWeight="600"
												fontSize={["sm", "sm", "md", "md"]}
												px={["4", "5", "6", "6"]}
												py={["2.5", "3", "3", "3"]}
												minH={["40px", "44px", "48px", "48px"]}
												w="full"
												maxW={["280px", "220px", "200px", "200px"]}
												transition="all 0.2s ease-in-out"
												position="relative"
												opacity={isDisabled ? 0.5 : 1}
												cursor={isDisabled ? "not-allowed" : "pointer"}
												textAlign="center"
												whiteSpace="nowrap"
												overflow="hidden"
												textOverflow="ellipsis"
												display="flex"
												alignItems="center"
												justifyContent="center"
												// Remove hover effects on mobile to prevent color flickering
												_hover={{
													"@media (hover: hover)": isDisabled ? {} : {
														borderColor: "black",
														boxShadow: isSelected ? "0 10px 30px rgba(0,0,0,0.35)" : "0 6px 20px rgba(0,0,0,0.25)",
														transform: "translateY(-1px)",
													}
												}}
												_active={{
													transform: "scale(0.98)",
													transition: "all 0.1s ease-in-out",
												}}
												_focus={{
													outline: "none",
													boxShadow: isSelected 
														? "0 0 0 3px rgba(0,0,0,0.3), 0 8px 25px rgba(0,0,0,0.3)"
														: "0 0 0 3px rgba(0,0,0,0.3), 0 4px 15px rgba(0,0,0,0.2)",
												}}
												// Ensure consistent touch behavior on mobile
												sx={{
													WebkitTapHighlightColor: "transparent",
													touchAction: "manipulation",
												}}
											>
												{isSelected && (
													<Box as={FiCheck} mr={[1, 2]} flexShrink={0} color="black" w={["14px", "16px"]} h={["14px", "16px"]} />
												)}
												<Text 
													fontSize="inherit" 
													fontWeight="inherit" 
													color="black"
													lineHeight="1.2"
													noOfLines={1}
												>
													{tag}
												</Text>
											</Button>
										);
									})}
								</SimpleGrid>
							</Box>
						</VStack>
					</VStack>
				</Container>
			</Box>

			{/* Results Section */}
			<Box 
				py="8"
			>
				<Container maxW="7xl">
					<ClubResults clubs={filteredClubs} error={error} selectedTags={selectedTags} />
				</Container>
			</Box>
		</Layout>
	);
}

function ClubResults({ clubs, error, selectedTags }: { clubs: Club[] | null, error?: any, selectedTags: string[] }) {
	if (error) {
		return (
			<Box
				bg="rgba(255, 255, 255, 0.1)"
				backdropFilter="blur(10px)"
				borderRadius="xl"
				p={["6", "8"]}
				boxShadow="0 8px 32px rgba(0, 0, 0, 0.05)"
				border="1px solid rgba(255, 255, 255, 0.1)"
				textAlign="center"
				py="20"
			>
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
			<Box
				bg="rgba(255, 255, 255, 0.1)"
				backdropFilter="blur(10px)"
				borderRadius="xl"
				p={["6", "8"]}
				boxShadow="0 8px 32px rgba(0, 0, 0, 0.05)"
				border="1px solid rgba(255, 255, 255, 0.1)"
				textAlign="center"
				py="20"
			>
				<Text fontSize="xl" color="gray.600" mb="4">
					Loading clubs...
				</Text>
			</Box>
		);
	}

	if (clubs.length === 0) {
		return (
			<Box
				bg="rgba(255, 255, 255, 0.1)"
				backdropFilter="blur(10px)"
				borderRadius="xl"
				p={["6", "8"]}
				boxShadow="0 8px 32px rgba(0, 0, 0, 0.05)"
				border="1px solid rgba(255, 255, 255, 0.1)"
				textAlign="center"
				py="20"
			>
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
		<Box
			bg="rgba(255, 255, 255, 0.1)"
			backdropFilter="blur(10px)"
			borderRadius="xl"
			p={["6", "8"]}
			boxShadow="0 8px 32px rgba(0, 0, 0, 0.05)"
			border="1px solid rgba(255, 255, 255, 0.1)"
		>
			<VStack spacing="8" align="stretch">
				<Box>
				<HStack spacing="4" wrap="wrap" justify="space-between" align="flex-start">
					<VStack align="flex-start" spacing="2">
						<Heading fontSize="2xl" color="gray.800">
							Found {clubs.length} Club{clubs.length !== 1 ? 's' : ''}:
						</Heading>
						<Text color="gray.600">
							{clubs.length} out of {clubs.length} Results
						</Text>
					</VStack>
					
					{selectedTags.length > 0 && (
						<VStack align="flex-end" spacing="3">
							<HStack spacing="2" wrap="wrap" justify="flex-end">
								{selectedTags.map(tag => (
									<Badge
										key={tag}
										bg="rgba(255,255,255,0.9)"
										color="gray.700"
										borderWidth="1px"
										borderColor="gray.300"
										px="3"
										py="1"
										borderRadius="full"
										fontSize="xs"
										fontWeight="600"
										backdropFilter="blur(5px)"
										boxShadow="0 2px 8px rgba(0,0,0,0.1)"
									>
										{tag}
									</Badge>
								))}
							</HStack>
						</VStack>
					)}
				</HStack>
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
		</Box>
	);
}

function SearchBar({ query, onSubmit }: { query: string, onSubmit: FormEventHandler<HTMLFormElement> }) {
	return (
		<Box w="full" maxW="4xl" mx="auto" px={["2", "4"]}>
			<form onSubmit={onSubmit} style={{ width: '100%' }}>
				<InputGroup
					size={["md", "lg"]}
					borderRadius="full"
					boxShadow="0 8px 25px rgba(0,0,0,0.15)"
					overflow="hidden"
					border="2px solid"
					borderColor="rgba(255,255,255,0.3)"
					bg="rgba(255,255,255,0.95)"
					backdropFilter="blur(10px)"
					_hover={{
						borderColor: "rgba(255,255,255,0.6)",
						boxShadow: "0 12px 35px rgba(0,0,0,0.2)",
						transform: "translateY(-1px)",
					}}
					_focusWithin={{
						borderColor: "white",
						boxShadow: "0 0 0 4px rgba(255,255,255,0.3), 0 15px 40px rgba(0,0,0,0.25)",
						transform: "translateY(-2px)",
					}}
					transition="all 0.3s ease-in-out"
				>
					<Input
						placeholder="Search Club..."
						bg="transparent"
						border="none"
						px={["4", "6", "8"]}
						py={["4", "5", "6"]}
						fontSize={["sm", "md", "lg"]}
						fontWeight="500"
						color="gray.700"
						_placeholder={{
							color: "gray.500",
							fontSize: ["sm", "md", "lg"],
						}}
						_focus={{
							boxShadow: "none",
							border: "none",
							outline: "none",
						}}
						name="search_query"
						defaultValue={query}
					/>
					<InputRightElement
						w="auto"
						h="full"
						pr={["2", "3"]}
					>
						<Button
							h={["calc(100% - 4px)", "calc(100% - 6px)"]}
							px={["4", "6", "8"]}
							bg="blue.600"
							color="white"
							borderRadius="full"
							mr={["2", "3"]}
							fontWeight="600"
							fontSize={["xs", "sm", "md"]}
							boxShadow="0 4px 15px rgba(59, 130, 246, 0.4)"
							_hover={{
								transform: "translateY(-1px)",
								boxShadow: "0 6px 20px rgba(59, 130, 246, 0.5)",
							}}
							_active={{
								transform: "translateY(0)",
								boxShadow: "0 4px 15px rgba(59, 130, 246, 0.4)",
							}}
							transition="all 0.2s ease-in-out"
							type="submit"
						>
							Search
						</Button>
					</InputRightElement>
				</InputGroup>
			</form>
		</Box>
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

// Club Slideshow Component
function ClubSlideshow() {
	const slideshowItems = useMemo(() => [
		{
			id: 1,
			title: "Academic Excellence Awards",
			image: "/slideshow/clubfair_2024.jpg",
			description: "Celebrating outstanding achievements in academic clubs",
			borderColor: "#EF4444" // Red
		},
		{
			id: 2,
			title: "Club Fair 2025 Highlights",
			image: "/slideshow/clubfair2.jpg",
			description: "Amazing moments from our annual club fair",
			borderColor: "#3B82F6" // Blue
		},
		{
			id: 3,
			title: "Community Service Projects",
			image: "/slideshow/clubfair3.jpg",
			description: "Making a difference in our community",
			borderColor: "#10B981" // Green
		},
		{
			id: 4,
			title: "Creative Arts Showcase",
			image: "/slideshow/clubfair4.jpg",
			description: "Showcasing talents from our arts and creative clubs",
			borderColor: "#F59E0B" // Yellow
		},
		{
			id: 5,
			title: "Leadership Development",
			image: "/slideshow/clubfair5.jpg",
			description: "Building tomorrow's leaders today",
			borderColor: "#8B5CF6" // Purple
		},
		{
			id: 6,
			title: "Leadership Development",
			image: "/slideshow/clubfair6.jpg",
			description: "Building tomorrow's leaders today",
			borderColor: "#26076eff" 
		},
	], []);

	const [currentSlide, setCurrentSlide] = useState(0);
	const [floatingPositions, setFloatingPositions] = useState([]);

	// Initialize random floating positions
	useEffect(() => {
		const generatePositions = () => {
			return slideshowItems.map((_, index) => ({
				x: Math.random() * 60 + 10, // 10% to 70% from left
				y: Math.random() * 50 + 10, // 10% to 60% from top
				rotation: Math.random() * 20 - 10, // -10 to +10 degrees
				scale: 0.6 + Math.random() * 0.3, // 0.6 to 0.9 scale
				animationDelay: Math.random() * 2, // 0 to 2 seconds delay
			}));
		};
		setFloatingPositions(generatePositions());
	}, [slideshowItems]);

	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentSlide((prev) => (prev + 1) % slideshowItems.length);
			// Regenerate positions occasionally for more dynamism
			if (Math.random() < 0.3) {
				const newPositions = slideshowItems.map((_, index) => ({
					x: Math.random() * 60 + 10,
					y: Math.random() * 50 + 10,
					rotation: Math.random() * 20 - 10,
					scale: 0.6 + Math.random() * 0.3,
					animationDelay: Math.random() * 2,
				}));
				setFloatingPositions(newPositions);
			}
		}, 5000); // Auto-advance every 5 seconds

		return () => clearInterval(timer);
	}, [slideshowItems]);

	return (
		<Box 
			position="relative" 
			w="full" 
			h={["400px", "500px", "600px"]} 
			overflow="hidden" 
			bg="rgba(255, 255, 255, 0.1)"
			backdropFilter="blur(10px)"
			borderRadius={["xl", "2xl", "3xl"]} 
			p={["4", "6", "8"]}
			boxShadow="0 8px 32px rgba(0, 0, 0, 0.05)"
			border="1px solid rgba(255, 255, 255, 0.1)"
		>
			{/* Club Fair Banner - floating with gravity */}
			<Box
				position="absolute"
				top={["2", "4", "8"]}
				left={["2", "4", "8"]}
				bg="blue.500"
				color="white"
				px={["3", "4", "6"]}
				py={["1.5", "2", "3"]}
				borderRadius="full"
				fontSize={["sm", "md", "lg"]}
				fontWeight="600"
				display="inline-flex"
				alignItems="center"
				gap="2"
				boxShadow="0 4px 20px rgba(59, 130, 246, 0.4)"
				zIndex="20"
				maxW={["180px", "240px", "auto"]}
				transform="rotate(-2deg)"
				animation="float 6s ease-in-out infinite"
				sx={{
					"@keyframes float": {
						"0%, 100%": { transform: "rotate(-2deg) translateY(0px)" },
						"50%": { transform: "rotate(-1deg) translateY(-10px)" }
					}
				}}
			>
				🎉 Club Fair 2025 is Here!
			</Box>

			{/* Floating background circles with gravity effect */}
			{floatingPositions.length > 0 && slideshowItems.map((item, index) => {
				if (index === currentSlide) return null; // Don't render main slide here
				
				const position = floatingPositions[index];
				const isVisible = Math.abs(index - currentSlide) <= 2 || 
								Math.abs(index - currentSlide) >= slideshowItems.length - 2;
				
				return (
					<Box
						key={`floating-${index}`}
						position="absolute"
						left={`${position?.x || 20}%`}
						top={`${position?.y || 30}%`}
						w={["80px", "100px", "120px"]}
						h={["80px", "100px", "120px"]}
						borderRadius="50%"
						overflow="hidden"
						border={`4px solid ${item.borderColor}`}
						opacity={isVisible ? 0.7 : 0.3}
						transform={`rotate(${position?.rotation || 0}deg) scale(${position?.scale || 0.7})`}
						transition="all 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
						cursor="pointer"
						onClick={() => setCurrentSlide(index)}
						zIndex="2"
						_hover={{ 
							transform: `rotate(${position?.rotation || 0}deg) scale(${(position?.scale || 0.7) * 1.1})`,
							opacity: 0.9
						}}
						animation={`gravityFloat ${3 + (index * 0.5)}s ease-in-out infinite ${position?.animationDelay || 0}s`}
						sx={{
							"@keyframes gravityFloat": {
								"0%, 100%": { 
									transform: `rotate(${position?.rotation || 0}deg) scale(${position?.scale || 0.7}) translateY(0px)` 
								},
								"33%": { 
									transform: `rotate(${(position?.rotation || 0) + 5}deg) scale(${position?.scale || 0.7}) translateY(-15px)` 
								},
								"66%": { 
									transform: `rotate(${(position?.rotation || 0) - 3}deg) scale(${position?.scale || 0.7}) translateY(5px)` 
								}
							}
						}}
					>
						<Image
							src={item.image}
							alt={item.title}
							objectFit="cover"
							w="full"
							h="full"
						/>
					</Box>
				);
			})}

			{/* Main center circle - enhanced with smooth transitions */}
			<Box
				position="absolute"
				left="50%"
				top="50%"
				transform="translate(-50%, -50%)"
				w={["200px", "250px", "300px", "350px", "400px"]}
				h={["200px", "250px", "300px", "350px", "400px"]}
				borderRadius="50%"
				overflow="hidden"
				border={`${["8px", "10px", "12px"][Math.min(2, 1)]} solid ${slideshowItems[currentSlide].borderColor}`}
				boxShadow={[
					"0 8px 20px rgba(0,0,0,0.2), 0 0 40px rgba(0,0,0,0.1)", 
					"0 12px 30px rgba(0,0,0,0.2), 0 0 50px rgba(0,0,0,0.1)", 
					"0 15px 40px rgba(0,0,0,0.2), 0 0 60px rgba(0,0,0,0.1)"
				]}
				transition="all 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)"
				zIndex="15"
				animation="mainPulse 8s ease-in-out infinite"
				sx={{
					"@keyframes mainPulse": {
						"0%, 100%": { 
							transform: "translate(-50%, -50%) scale(1) rotate(0deg)",
							filter: "brightness(1)"
						},
						"25%": { 
							transform: "translate(-50%, -50%) scale(1.02) rotate(1deg)",
							filter: "brightness(1.05)"
						},
						"75%": { 
							transform: "translate(-50%, -50%) scale(0.98) rotate(-1deg)",
							filter: "brightness(0.95)"
						}
					}
				}}
			>
				<Box position="relative" w="full" h="full">
					<Image
						src={slideshowItems[currentSlide].image}
						alt={slideshowItems[currentSlide].title}
						objectFit="cover"
						w="full"
						h="full"
						transition="all 0.8s ease-in-out"
					/>
				</Box>
			</Box>

			{/* Enhanced navigation arrows with floating effect */}
			<Button
				position="absolute"
				left={["2", "3", "4"]}
				top="50%"
				transform="translateY(-50%)"
				bg="whiteAlpha.800"
				color="gray.700"
				borderRadius="full"
				w={["10", "12", "14"]}
				h={["10", "12", "14"]}
				fontSize={["lg", "xl", "2xl"]}
				_hover={{ 
					bg: "whiteAlpha.900", 
					transform: "translateY(-50%) scale(1.1) rotate(-10deg)",
					boxShadow: "0 8px 25px rgba(0,0,0,0.2)"
				}}
				onClick={() => setCurrentSlide((prev) => (prev - 1 + slideshowItems.length) % slideshowItems.length)}
				zIndex="18"
				minW="0"
				transition="all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)"
				animation="arrowFloat 4s ease-in-out infinite"
				sx={{
					"@keyframes arrowFloat": {
						"0%, 100%": { transform: "translateY(-50%) translateX(0px)" },
						"50%": { transform: "translateY(-50%) translateX(-5px)" }
					}
				}}
			>
				‹
			</Button>
			<Button
				position="absolute"
				right={["2", "3", "4"]}
				top="50%"
				transform="translateY(-50%)"
				bg="whiteAlpha.800"
				color="gray.700"
				borderRadius="full"
				w={["10", "12", "14"]}
				h={["10", "12", "14"]}
				fontSize={["lg", "xl", "2xl"]}
				_hover={{ 
					bg: "whiteAlpha.900", 
					transform: "translateY(-50%) scale(1.1) rotate(10deg)",
					boxShadow: "0 8px 25px rgba(0,0,0,0.2)"
				}}
				onClick={() => setCurrentSlide((prev) => (prev + 1) % slideshowItems.length)}
				zIndex="18"
				minW="0"
				transition="all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)"
				animation="arrowFloat 4s ease-in-out infinite 2s"
				sx={{
					"@keyframes arrowFloat": {
						"0%, 100%": { transform: "translateY(-50%) translateX(0px)" },
						"50%": { transform: "translateY(-50%) translateX(5px)" }
					}
				}}
			>
				›
			</Button>

			{/* Animated background particles */}
			{[...Array(6)].map((_, i) => (
				<Box
					key={`particle-${i}`}
					position="absolute"
					w={`${20 + Math.random() * 40}px`}
					h={`${20 + Math.random() * 40}px`}
					borderRadius="50%"
					bg={`${['blue', 'green', 'yellow', 'red', 'purple', 'pink'][i]}.100`}
					opacity="0.3"
					left={`${Math.random() * 80 + 10}%`}
					top={`${Math.random() * 80 + 10}%`}
					animation={`particleFloat ${5 + Math.random() * 5}s ease-in-out infinite ${Math.random() * 2}s`}
					zIndex="1"
					sx={{
						"@keyframes particleFloat": {
							"0%, 100%": { 
								transform: "translateY(0px) rotate(0deg) scale(1)",
								opacity: 0.3 
							},
							"33%": { 
								transform: "translateY(-20px) rotate(120deg) scale(1.2)",
								opacity: 0.5 
							},
							"66%": { 
								transform: "translateY(10px) rotate(240deg) scale(0.8)",
								opacity: 0.2 
							}
						}
					}}
				/>
			))}

			{/* Enhanced navigation dots with animated colors */}
			<HStack
				position="absolute"
				bottom={["3", "4", "6"]}
				left="50%"
				transform="translateX(-50%)"
				spacing={["2", "2", "3"]}
				zIndex="20"
				bg="whiteAlpha.800"
				borderRadius="full"
				px="4"
				py="2"
				backdropFilter="blur(10px)"
			>
				{slideshowItems.map((item, index) => (
					<Box
						key={index}
						w={["3", "3", "4"]}
						h={["3", "3", "4"]}
						borderRadius="full"
						bg={currentSlide === index ? item.borderColor : "gray.300"}
						cursor="pointer"
						transition="all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)"
						onClick={() => setCurrentSlide(index)}
						_hover={{
							transform: "scale(1.5) rotate(180deg)",
							bg: currentSlide === index ? item.borderColor : "gray.500"
						}}
						border={["1px", "1px", "2px"]} 
						borderColor="white"
						position="relative"
						sx={currentSlide === index ? {
							animation: "dotPulse 2s ease-in-out infinite",
							"@keyframes dotPulse": {
								"0%, 100%": { transform: "scale(1)", boxShadow: "0 0 0 0 rgba(59, 130, 246, 0.7)" },
								"50%": { transform: "scale(1.2)", boxShadow: "0 0 0 4px rgba(59, 130, 246, 0)" }
							}
						} : {}}
					/>
				))}
			</HStack>
		</Box>
	);
}

function GuildsModal({ isOpen, onClose }) {
	return (
		<Modal isOpen={isOpen} onClose={onClose} size="2xl" isCentered>
			<ModalOverlay 
				bg="rgba(0, 0, 0, 0.6)" 
				backdropFilter="blur(8px)"
			/>
			<ModalContent
				bg="rgba(255, 255, 255, 0.95)"
				backdropFilter="blur(20px)"
				borderRadius={["20px", "25px", "30px"]}
				border="1px solid rgba(255, 255, 255, 0.2)"
				boxShadow="0 20px 60px rgba(0, 0, 0, 0.15)"
				mx={["4", "6", "8"]}
				my={["4", "6", "8"]}
				maxW={["95%", "90%", "600px", "700px"]}
				overflow="hidden"
				position="relative"
			>
				{/* Professional gradient background */}
				<Box
					position="absolute"
					top="0"
					left="0"
					right="0"
					bottom="0"
					bgGradient="linear(135deg, rgba(38, 112, 255, 0.05) 0%, rgba(147, 51, 234, 0.05) 50%, rgba(239, 68, 68, 0.05) 100%)"
					zIndex="-1"
				/>

				<ModalCloseButton
					position="absolute"
					top={["3", "4", "5"]}
					right={["3", "4", "5"]}
					bg="rgba(255, 255, 255, 0.9)"
					backdropFilter="blur(10px)"
					borderRadius="full"
					w={["8", "10", "12"]}
					h={["8", "10", "12"]}
					fontSize={["sm", "md", "lg"]}
					color="gray.600"
					border="1px solid rgba(255, 255, 255, 0.3)"
					transition="all 0.3s ease"
					_hover={{
						bg: "rgba(239, 68, 68, 0.1)",
						color: "red.500",
						transform: "scale(1.1)",
						boxShadow: "0 4px 15px rgba(239, 68, 68, 0.2)"
					}}
					zIndex="10"
				/>

				<ModalBody p={["6", "8", "10"]}>
					<VStack spacing={["6", "8", "10"]} align="center" textAlign="center">
						{/* Logo with professional styling */}
						<Box position="relative">
							<Image
								src="/guilds-logo.png"
								alt="Guilds Logo"
								w={["120px", "150px", "180px", "200px"]}
								h="auto"
								objectFit="contain"
								transition="transform 0.3s ease"
								_hover={{ transform: "scale(1.05)" }}
								fallbackSrc="/guildLogo.png"
							/>
							{/* Subtle glow effect */}
							<Box
								position="absolute"
								top="50%"
								left="50%"
								transform="translate(-50%, -50%)"
								w={["140px", "170px", "200px", "220px"]}
								h={["140px", "170px", "200px", "220px"]}
								borderRadius="full"
								bg="radial-gradient(circle, rgba(38, 112, 255, 0.1) 0%, transparent 70%)"
								zIndex="-1"
							/>
						</Box>

						{/* Professional heading */}
						<VStack spacing={["2", "3", "4"]}>
							<Heading
								fontSize={["2xl", "3xl", "4xl", "5xl"]}
								fontWeight="700"
								color="gray.800"
								letterSpacing="-0.02em"
								lineHeight="1.1"
							>
								Welcome to{" "}
								<Text as="span" color="#2670FF">
									Guilds
								</Text>
							</Heading>
							<Text
								fontSize={["lg", "xl", "2xl"]}
								color="gray.600"
								fontWeight="500"
								maxW="400px"
							>
								UIC Club Fair 2025
							</Text>
						</VStack>

						{/* Professional description */}
						<Text
							fontSize={["sm", "md", "lg"]}
							color="gray.700"
							lineHeight="1.6"
							maxW={["100%", "90%", "500px"]}
							textAlign="center"
						>
							Discover your passion and find your community! Explore all the amazing clubs and organizations 
							that the University of the Immaculate Conception has to offer. From academic excellence to 
							creative pursuits, there's a perfect place for you to grow and thrive.
						</Text>

						{/* Key features with icons */}
						<VStack spacing="3" w="full" maxW="400px">
							<HStack spacing="4" w="full" justify="flex-start">
								<Box
									w="8"
									h="8"
									bg="rgba(38, 112, 255, 0.1)"
									borderRadius="full"
									display="flex"
									alignItems="center"
									justifyContent="center"
								>
									<Text fontSize="lg" color="#2670FF">🔍</Text>
								</Box>
								<Text fontSize={["sm", "md"]} color="gray.700" textAlign="left">
									Browse and search all available clubs
								</Text>
							</HStack>
							<HStack spacing="4" w="full" justify="flex-start">
								<Box
									w="8"
									h="8"
									bg="rgba(147, 51, 234, 0.1)"
									borderRadius="full"
									display="flex"
									alignItems="center"
									justifyContent="center"
								>
									<Text fontSize="lg" color="#9333EA">🎯</Text>
								</Box>
								<Text fontSize={["sm", "md"]} color="gray.700" textAlign="left">
									Filter by your interests and passions
								</Text>
							</HStack>
							<HStack spacing="4" w="full" justify="flex-start">
								<Box
									w="8"
									h="8"
									bg="rgba(16, 185, 129, 0.1)"
									borderRadius="full"
									display="flex"
									alignItems="center"
									justifyContent="center"
								>
									<Text fontSize="lg" color="#10B981">🤝</Text>
								</Box>
								<Text fontSize={["sm", "md"]} color="gray.700" textAlign="left">
									Connect with like-minded students
								</Text>
							</HStack>
						</VStack>
					</VStack>
				</ModalBody>

				<ModalFooter 
					justifyContent="center" 
					pb={["6", "8", "10"]} 
					pt="0"
				>
					<Button
						bg="#2670FF"
						color="white"
						size={["md", "lg", "xl"]}
						px={["8", "12", "16"]}
						py={["3", "4", "6"]}
						fontSize={["md", "lg", "xl"]}
						fontWeight="600"
						borderRadius="full"
						boxShadow="0 8px 25px rgba(38, 112, 255, 0.3)"
						transition="all 0.3s ease"
						_hover={{
							bg: "#1557d8",
							transform: "translateY(-2px)",
							boxShadow: "0 12px 35px rgba(38, 112, 255, 0.4)"
						}}
						_active={{
							transform: "translateY(0px)",
							boxShadow: "0 4px 15px rgba(38, 112, 255, 0.3)"
						}}
						onClick={onClose}
					>
						Explore Clubs
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
