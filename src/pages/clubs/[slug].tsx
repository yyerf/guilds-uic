import Head from "next/head";
import Layout from "src/components/layout";
import { allClubs, Club } from "contentlayer/generated";
import {
	Box,
	Container,
	Flex,
	Heading,
	Button,
	HStack,
	Accordion,
	AccordionButton,
	AccordionItem,
	AccordionPanel,
	Img,
	Image,
	VStack,
	Text,
	Link,
	Stack,
} from "@chakra-ui/react";
import { AiOutlineHeart } from "react-icons/ai";
import { BsFacebook, BsGithub } from "react-icons/bs";
import { BsPlus } from "react-icons/bs";
import { HiOutlineGlobeAlt } from "react-icons/hi";
import { SiGmail } from "react-icons/si";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectCoverflow, Pagination, Navigation } from "swiper";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";
import styled from "@emotion/styled";
import { clubAssetURL } from "src/utils";
import { Fragment } from "react";
import { useRouter } from "next/router";
import Content from "src/components/Content";

export async function getStaticPaths() {
	const paths = allClubs.map((c) => c.url);

	return {
		paths,
		fallback: false,
	};
}

export async function getStaticProps({ params: { slug } }) {
	const club = allClubs.find((club) => club._raw.flattenedPath === slug);
	return {
		props: {
			club,
		},
	};
}

export default function ClubPage({ club }: { club: Club }) {
	const router = useRouter();
	const getUrl = (path: string): string => {
		return router.basePath + path;
	}

	return (
		<Layout maxWidth="full" bgColor={club.theme.primary_color}>
			<Head>
				<title>{`${club.name} - Guilds`}</title>
				<meta name="description" content={`Join ${club.name} on Guilds: the official club directory website for the UIC Club Fair 2022`} />
				<meta property="og:type" content="website" />
				<meta property="og:image" content={getUrl(clubAssetURL(club, 'cover_photo'))} />
				<meta name="twitter:card" content="summary_large_image" />
			</Head>

			<Container maxWidth="85rem">
				<ClubBox club={club} />
			</Container>
			
			{club.assets.slideshows && <Carousel club={club} />}

			<Container maxWidth="85rem" mt="20">
				<ClubContent club={club} />
				{/* <ClubOfficers club={club} /> 
				removed the officers section for now, as it is not available for all clubs
				*/} 
				{club.faqs && <ClubFAQ club={club} />}
				{(club.registration || club.links) && <InterestedBox club={club} />}
			</Container>
		</Layout>
	);
}

function Carousel({ club }: { club: Club }) {
	return (
		<Box mt="20" position="relative">
			{/* Professional heading for slideshow */}
			<Container maxWidth="85rem" mb="8">
				<Heading 
					fontSize={["2xl", "3xl", "4xl"]} 
					fontWeight="600" 
					color="gray.800"
					textAlign="center"
					mb="2"
				>
					Gallery & Highlights
				</Heading>
				<Text 
					fontSize={["md", "lg"]} 
					color="gray.600"
					textAlign="center"
					maxW="600px"
					mx="auto"
				>
					Explore our memorable moments and exciting activities
				</Text>
			</Container>

			<StyledSwiper
				effect="coverflow"
				slidesPerView={1}
				spaceBetween={30}
				loop={true}
				grabCursor={true}
				centeredSlides={true}
				speed={800} // Smooth transition speed
				coverflowEffect={{
					rotate: 25, // Reduced for more subtle effect
					stretch: 0,
					depth: 150, // Increased depth for better 3D effect
					modifier: 1.5, // Enhanced modifier for smoother transitions
					slideShadows: true,
				}}
				autoplay={{
					delay: 4000, // Slower auto-advance for better viewing
					disableOnInteraction: false,
					pauseOnMouseEnter: true, // Professional touch - pause on hover
				}}
				pagination={{
					clickable: true,
					dynamicBullets: true, // Professional pagination
				}}
				navigation={true} // Add navigation arrows
				breakpoints={{
					640: {
						slidesPerView: 1,
						spaceBetween: 20,
					},
					768: {
						slidesPerView: 2,
						spaceBetween: 30,
						coverflowEffect: {
							rotate: 15, // Smaller rotation for multiple slides
							stretch: 0,
							depth: 100,
							modifier: 1,
							slideShadows: true,
						},
					},
					1024: {
						slidesPerView: 2.5, // Show partial slide for better UX
						spaceBetween: 40,
						coverflowEffect: {
							rotate: 15,
							stretch: 0,
							depth: 100,
							modifier: 1,
							slideShadows: true,
						},
					},
					1200: {
						slidesPerView: 3, // More slides on larger screens
						spaceBetween: 50,
						coverflowEffect: {
							rotate: 10,
							stretch: 0,
							depth: 80,
							modifier: 1,
							slideShadows: true,
						},
					},
				}}
				modules={[Autoplay, EffectCoverflow, Pagination, Navigation]}
			>
				{club.assets.slideshows.map((p, index) => (
					<StyledSwiperSlide key={`slideshow_${p}_${index}`}>
						<Box position="relative" overflow="hidden">
							<Box 
								className="image-container"
								style={{
									'--bg-image': `url(${clubAssetURL(club, 'slideshows', p)})`
								} as any}
							>
								<Image 
									src={clubAssetURL(club, 'slideshows', p)} 
									alt={`${club.name} gallery image ${index + 1}`} 
									transition="transform 0.3s ease"
									_hover={{
										transform: "scale(1.02)"
									}}
								/>
							</Box>
							{/* Professional overlay gradient */}
							<Box
								position="absolute"
								bottom="0"
								left="0"
								right="0"
								h="30%"
								bgGradient="linear(to-t, rgba(0,0,0,0.6), transparent)"
								opacity="0"
								transition="opacity 0.3s ease"
								_hover={{ opacity: 1 }}
								display="flex"
								alignItems="flex-end"
								p="4"
								zIndex="3"
							>
								<Text color="white" fontWeight="500" fontSize="sm">
									{club.name} Gallery
								</Text>
							</Box>
						</Box>
					</StyledSwiperSlide>
				))}
			</StyledSwiper>
		</Box>
	);
}

const StyledSwiper = styled(Swiper)`
	.swiper-wrapper {
		align-items: center;
		padding: 20px 0 60px 0; /* Extra padding for pagination */
	}

	/* Professional pagination styling */
	.swiper-pagination {
		bottom: 10px !important;
		
		.swiper-pagination-bullet {
			width: 12px;
			height: 12px;
			background: rgba(255, 255, 255, 0.5);
			border: 2px solid white;
			opacity: 1;
			transition: all 0.3s ease;
			
			&.swiper-pagination-bullet-active {
				background: #2670FF;
				border-color: #2670FF;
				transform: scale(1.2);
			}
		}
	}

	/* Professional navigation styling */
	.swiper-button-next,
	.swiper-button-prev {
		color: white;
		background: rgba(255, 255, 255, 0.2);
		backdrop-filter: blur(10px);
		border-radius: 50%;
		width: 50px;
		height: 50px;
		margin-top: -25px;
		transition: all 0.3s ease;
		border: 1px solid rgba(255, 255, 255, 0.3);
		
		&:after {
			font-size: 20px;
		}
		
		&:hover {
			background: rgba(255, 255, 255, 0.3);
			transform: scale(1.1);
			box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
		}
		
		&.swiper-button-disabled {
			opacity: 0.3;
			cursor: not-allowed;
		}
	}

	.swiper-button-next {
		right: 20px;
	}
	
	.swiper-button-prev {
		left: 20px;
	}

	/* Smooth slide shadow effects */
	.swiper-slide-shadow-left,
	.swiper-slide-shadow-right {
		background: linear-gradient(
			to right,
			rgba(0, 0, 0, 0.3),
			transparent
		);
	}

	/* Responsive adjustments */
	@media (max-width: 768px) {
		.swiper-button-next,
		.swiper-button-prev {
			width: 40px;
			height: 40px;
			margin-top: -20px;
			
			&:after {
				font-size: 16px;
			}
		}
		
		.swiper-button-next {
			right: 10px;
		}
		
		.swiper-button-prev {
			left: 10px;
		}
	}
`;

const StyledSwiperSlide = styled(SwiperSlide)`
	border-radius: 20px;
	padding: 0 10px;
	transition: all 0.3s ease;
	
	/* Container for better image handling */
	.image-container {
		position: relative;
		width: 100%;
		height: 300px;
		border-radius: 15px;
		overflow: hidden;
		background: linear-gradient(135deg, 
			rgba(38, 112, 255, 0.1) 0%, 
			rgba(147, 51, 234, 0.1) 50%, 
			rgba(239, 68, 68, 0.1) 100%
		);
		box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
		transition: all 0.3s ease;
		
		/* Alternative: Use blurred background of the same image */
		&::before {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			background-image: var(--bg-image);
			background-size: cover;
			background-position: center;
			filter: blur(20px) brightness(0.3);
			transform: scale(1.1);
			z-index: 1;
		}
	}
	
	img {
		position: relative;
		z-index: 2;
		border: none;
		width: 100%;
		height: 100%;
		object-fit: contain;
		object-position: center;
		border-radius: 15px;
		transition: all 0.3s ease;
	}

	/* Professional hover effects */
	&:hover {
		transform: translateY(-5px);
		
		.image-container {
			box-shadow: 0 15px 40px rgba(0, 0, 0, 0.25);
		}
	}

	/* Active slide enhancement */
	&.swiper-slide-active {
		.image-container {
			box-shadow: 0 12px 35px rgba(38, 112, 255, 0.3);
		}
	}

	/* Mobile optimizations */
	@media (max-width: 768px) {
		padding: 0 5px;
		
		.image-container {
			height: 250px;
		}
	}
`;

function ClubBox({ club }: { club: Club }) {
	return (
		<Box
			bg="white"
			borderRadius="25px"
			border="1px solid"
			borderColor="rgba(0,0,0,0.1)"
			overflow="hidden"
			boxShadow="0 10px 40px rgba(0,0,0,0.15)"
		>
			{/* Cover Photo */}
			<Box 
				h={["200px", "250px", "350px"]}
				w="full"
				backgroundImage={`url(${clubAssetURL(club, 'cover_photo')})`}
				backgroundSize="cover"
				backgroundPosition="center"
				position="relative"
				_before={{
					content: '""',
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					bg: "rgba(0,0,0,0.3)",
					zIndex: 1
				}}
			>
				{/* Club Logo */}
				<Box
					position="absolute"
					bottom="-60px"
					left={["50%", "50%", "40px"]}
					transform={["translateX(-50%)", "translateX(-50%)", "none"]}
					zIndex={2}
				>
					<Box
						w={["120px", "140px", "160px"]}
						h={["120px", "140px", "160px"]}
						borderRadius="full"
						overflow="hidden"
						bg="white"
						p="2"
						boxShadow="0 8px 30px rgba(0,0,0,0.3)"
					>
						<Img
							w="full"
							h="full"
							src={clubAssetURL(club, 'logo')}
							objectFit="cover"
							alt={`${club.name} logo`}
							borderRadius="full"
						/>
					</Box>
				</Box>
			</Box>

			{/* Club Information */}
			<Box
				pt={["80px", "80px", "100px"]}
				pb="8"
				px={["6", "8", "12"]}
				textAlign={["center", "center", "left"]}
				bg="white"
			>
				{/* Club Name & Description */}
				<Box mb="8">
					<Heading 
						fontSize={["2xl", "3xl", "4xl"]} 
						fontWeight="700"
						color="gray.800"
						mb="4"
						textAlign="center"
					>
						{club.name}
					</Heading>
					<Text 
						fontSize={["md", "lg", "xl"]} 
						color="gray.600"
						lineHeight="1.6"
						textAlign="center"
						maxW="800px"
						mx="auto"
					>
						{club.description?.short ?? ""}
					</Text>
				</Box>

				{/* Social Media Links */}
				{club.links && (
					<Box mb="6">
						<Text 
							fontSize="lg" 
							fontWeight="600" 
							color="gray.700" 
							mb="4"
							textAlign="center"
						>
							Connect with us
						</Text>
						<Flex 
							wrap="wrap" 
							justify="center"
							gap="3"
						>
							{club.links.map((link, i) => (
								<Fragment key={`link_top_${link._id}`}>
									{link.label !== 'Contact Number' ? (
										<Button
											as="a"
											key={`link_${link._id}`}
											href={link.url}
											target="_blank"
											size="sm"
											bg="gray.100"
											color="gray.700"
											border="1px solid"
											borderColor="gray.200"
											borderRadius="full"
											px="4"
											py="2"
											fontWeight="500"
											_hover={{
												bg: "gray.200",
												transform: "translateY(-1px)",
												boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
											}}
											transition="all 0.3s ease"
										>
											{link.label}
										</Button>
									) : (
										<Text 
											key={`contact_${link._id}`}
											fontSize="sm"
											color="gray.600"
											bg="gray.100"
											px="4"
											py="2"
											borderRadius="full"
											border="1px solid"
											borderColor="gray.200"
										>
											{link.label}: {link.url}
										</Text>
									)}
								</Fragment>
							))}
						</Flex>
					</Box>
				)}

				{/* Interested Button */}
				{(club.org_type === 'non-academic' && club.registration) && (
					<Flex justify="center">
						<Button
							as="a"
							href="#interested"
							bg="#2670FF"
							color="white"
							borderRadius="full"
							px="8"
							py="6"
							fontSize="lg"
							fontWeight="600"
							leftIcon={<AiOutlineHeart fontSize="1.2rem" />}
							boxShadow="0 4px 15px rgba(38, 112, 255, 0.3)"
							_hover={{
								bg: "#1557d8",
								transform: "translateY(-2px)",
								boxShadow: "0 6px 20px rgba(38, 112, 255, 0.4)"
							}}
							transition="all 0.3s ease"
						>
							Join {club.name}
						</Button>
					</Flex>
				)}
			</Box>
		</Box>
	);
}

function ClubContent({ club }: { club: Club }) {
	return (
		<VStack mt="3rem" spacing="3rem">
			<Box w="full">
				<Heading 
					fontSize={["2xl", "3xl"]} 
					fontWeight="600" 
					color="gray.800"
					mb="6"
				>
					About {club.name}
				</Heading>
				<Box 
					bg="rgba(255, 255, 255, 0.1)" 
					backdropFilter="blur(10px)"
					borderRadius="20px"
					p="8"
					border="1px solid"
					borderColor="rgba(0,0,0,0.1)"
				>
					<Text 
						fontSize={["md", "lg"]} 
						lineHeight="1.8"
						color="gray.700"
						textAlign="justify"
					>
						{club.description.full}
					</Text>
				</Box>
			</Box>

			<Box w="full">
				<Content content={club.body.raw} club={club} />
			</Box>
		</VStack>
	);
}

function ClubFAQ({ club }: { club: Club }) {
	return (
		<Box my="3rem" w="full">
			<Heading 
				fontSize={["2xl", "3xl"]} 
				fontWeight="600" 
				color="gray.800"
				mb="6"
				textAlign="center"
			>
				Frequently Asked Questions
			</Heading>
			
			<Box
				bg="rgba(255, 255, 255, 0.1)"
				backdropFilter="blur(10px)"
				borderRadius="20px"
				p="6"
				border="1px solid"
				borderColor="rgba(0,0,0,0.1)"
			>
				<Accordion allowToggle>
					{(club.faqs ?? []).map((faq, i) => (
						<AccordionItem
							key={`faq_${club._raw.flattenedPath}_${i}`}
							border="1px solid"
							borderColor="rgba(0,0,0,0.1)"
							borderRadius="15px"
							mb="4"
							bg="rgba(255,255,255,0.5)"
							backdropFilter="blur(5px)"
							_last={{ mb: 0 }}
						>
							{({ isExpanded }) => (
								<>
									<AccordionButton
										borderRadius="15px"
										_hover={{
											bg: "rgba(255,255,255,0.7)"
										}}
										py="4"
									>
										<Box
											flex="1"
											textAlign="left"
											fontWeight="600"
											fontSize={["md", "lg"]}
											color="gray.800"
										>
											{faq.question ?? 'Question'}
										</Box>
										<Box
											transform={isExpanded ? "rotate(45deg)" : ""}
											transition="transform 200ms ease"
											color="gray.600"
										>
											<BsPlus fontSize="24" />
										</Box>
									</AccordionButton>
									<AccordionPanel 
										pb={4} 
										pt={0}
										fontSize="md"
										color="gray.700"
										lineHeight="1.6"
									>
										{faq.answer ?? 'Answer'}
									</AccordionPanel>
								</>
							)}
						</AccordionItem>
					))}
				</Accordion>
			</Box>
		</Box>
	);
}

function ClubOfficers({ club }: { club: Club }) {
	return (
		<Box my="3rem" w="full">
			<Heading 
				fontSize={["2xl", "3xl"]} 
				fontWeight="600" 
				color="gray.800"
				mb="6"
				textAlign="center"
			>
				Meet Our Officers
			</Heading>
			
			<Box
				bg="rgba(255, 255, 255, 0.1)"
				backdropFilter="blur(10px)"
				borderRadius="20px"
				p="8"
				border="1px solid"
				borderColor="rgba(0,0,0,0.1)"
			>
				<Flex 
					direction="row" 
					overflowX="auto" 
					gap="6"
					pb="4"
					css={{
						'&::-webkit-scrollbar': {
							height: '8px',
						},
						'&::-webkit-scrollbar-track': {
							background: 'rgba(0,0,0,0.1)',
							borderRadius: '10px',
						},
						'&::-webkit-scrollbar-thumb': {
							background: 'rgba(0,0,0,0.3)',
							borderRadius: '10px',
						},
						'&::-webkit-scrollbar-thumb:hover': {
							background: 'rgba(0,0,0,0.5)',
						},
					}}
				>
					{club.officers.map((officer, index) => (
						<Box 
							key={`officer_${officer.name}_${index}`}
							flexShrink={0} 
							minW="200px"
							maxW="220px"
						>
							<VStack spacing="4">
								<Box
									position="relative"
									overflow="hidden"
									borderRadius="full"
									bg="white"
									p="1"
									boxShadow="0 4px 20px rgba(0,0,0,0.15)"
								>
									<Image
										h="120px"
										w="120px"
										borderRadius="full"
										objectFit="cover"
										alt={officer.name}
										fallbackSrc="/blank-profile.webp"
										src={clubAssetURL(club, 'officer_images', officer.photo_name)}
										transition="transform 0.3s ease"
										_hover={{
											transform: "scale(1.05)"
										}}
									/>
								</Box>

								<Box textAlign="center" w="full">
									<Text 
										fontWeight="600" 
										fontSize="md"
										color="gray.800"
										noOfLines={2}
										mb="1"
									>
										{officer.name}
									</Text>
									<Text 
										fontSize="sm"
										color="gray.600"
										fontWeight="500"
										bg="rgba(255,255,255,0.7)"
										px="3"
										py="1"
										borderRadius="full"
										noOfLines={1}
									>
										{officer.position}
									</Text>
								</Box>
							</VStack>
						</Box>
					))}
				</Flex>
			</Box>
		</Box>
	);
}

function InterestedBox({ club }: { club: Club }) {
	return (
		<Box
			id="interested"
			bg="rgba(255, 255, 255, 0.1)"
			backdropFilter="blur(10px)"
			borderRadius="20px"
			border="1px solid"
			borderColor="rgba(0,0,0,0.1)"
			my="9rem"
			p="8"
		>
			<Flex
				flexDirection={["column", "column", "row"]}
				alignItems="center"
				gap="8"
			>
				{(club.org_type == 'non-academic' && club.registration) && 
					<Box
						flex="1"
						textAlign={["center", "center", club.links && club.registration ? "left" : "center"]}
					>
						<Heading 
							fontSize={["xl", "2xl"]}
							fontWeight="600"
							color="gray.800"
							mb="6"
						>
							Interested to join <Text as="span" color="#2670FF">{club.name}</Text>?
						</Heading>
						
						<Stack 
							direction={["column", "row"]} 
							spacing="4"
							justify={["center", "center", club.links && club.registration ? "flex-start" : "center"]}
						>
							{club.registration.form_url && 
								<Button
									as="a"
									href={club.registration.form_url}
									target="_blank"
									bg="#2670FF"
									color="white"
									borderRadius="full"
									px="8"
									py="6"
									fontSize="md"
									fontWeight="600"
									boxShadow="0 4px 15px rgba(38, 112, 255, 0.3)"
									_hover={{
										bg: "#1557d8",
										transform: "translateY(-2px)",
										boxShadow: "0 6px 20px rgba(38, 112, 255, 0.4)"
									}}
									transition="all 0.3s ease"
								>
									Register Now
								</Button>
							}

							{club.registration.livestream_url && 
								<Button
									as="a"
									href={club.registration.livestream_url}
									target="_blank"
									bg="transparent"
									color="#2670FF"
									border="2px solid #2670FF"
									borderRadius="full"
									px="8"
									py="6"
									fontSize="md"
									fontWeight="600"
									_hover={{
										bg: "#2670FF",
										color: "white",
										transform: "translateY(-2px)"
									}}
									transition="all 0.3s ease"
								>
									Watch Livestream
								</Button>
							}

							{club.registration.meeting_url && 
								<Button
									as="a"
									href={club.registration.meeting_url}
									target="_blank"
									bg="transparent"
									color="#2670FF"
									border="2px solid #2670FF"
									borderRadius="full"
									px="8"
									py="6"
									fontSize="md"
									fontWeight="600"
									_hover={{
										bg: "#2670FF",
										color: "white",
										transform: "translateY(-2px)"
									}}
									transition="all 0.3s ease"
								>
									Join Event
								</Button>
							}
						</Stack>
					</Box>
				}
				
				{(club.links && club.registration) && 
					<Box
						h={["1px", "1px", "120px"]}
						w={["100%", "100%", "1px"]}
						bg="rgba(0,0,0,0.2)"
					/>
				}
				
				{club.links && 
					<Box flex="1" w="full">
						<Heading 
							fontSize={["lg", "xl"]}
							fontWeight="600"
							color="gray.800"
							mb="6"
							textAlign={club.registration ? ["center", "center", "left"] : "center"}
						>
							Connect with us
						</Heading>
						
						<HStack spacing="4" w="full" justify="center" flexWrap="wrap">
							{(club.links?.slice(0, 4) ?? []).map(link => 
								link.label === 'Contact Number' ? (
									<Box
										key={`link_interested_${club._raw.flattenedPath}_${link.label}`}
										bg="rgba(255,255,255,0.7)"
										backdropFilter="blur(5px)"
										borderRadius="full"
										px="4"
										py="2"
										textAlign="center"
										border="1px solid"
										borderColor="rgba(0,0,0,0.1)"
										minW="200px"
									>
										<Text fontWeight="500" color="gray.700" fontSize="sm">
											{link.label}: {link.url}
										</Text>
									</Box>
								) : (
									<Button
										key={`link_interested_${club._raw.flattenedPath}_${link.label}`}
										as="a"
										href={link.url}
										target="_blank"
										bg={
											link.label.toLowerCase().includes('facebook') ? "#1877F2" :
											link.label.toLowerCase().includes('github') ? "#24292e" :
											link.label.toLowerCase().includes('gmail') || link.label.toLowerCase().includes('email') ? "#EA4335" :
											link.label.toLowerCase().includes('website') || link.label.toLowerCase().includes('web') ? "#4285F4" :
											"rgba(255,255,255,0.7)"
										}
										backdropFilter="blur(5px)"
										color={
											link.label.toLowerCase().includes('facebook') || 
											link.label.toLowerCase().includes('github') ||
											link.label.toLowerCase().includes('gmail') || link.label.toLowerCase().includes('email') ||
											link.label.toLowerCase().includes('website') || link.label.toLowerCase().includes('web') ? 
											"white" : "gray.700"
										}
										border="1px solid"
										borderColor={
											link.label.toLowerCase().includes('facebook') ? "#1877F2" :
											link.label.toLowerCase().includes('github') ? "#24292e" :
											link.label.toLowerCase().includes('gmail') || link.label.toLowerCase().includes('email') ? "#EA4335" :
											link.label.toLowerCase().includes('website') || link.label.toLowerCase().includes('web') ? "#4285F4" :
											"rgba(0,0,0,0.1)"
										}
										borderRadius="full"
										px={
											link.label.toLowerCase().includes('facebook') ||
											link.label.toLowerCase().includes('github') ||
											link.label.toLowerCase().includes('gmail') || link.label.toLowerCase().includes('email') ||
											link.label.toLowerCase().includes('website') || link.label.toLowerCase().includes('web') ? 
											"4" : "6"
										}
										py={
											link.label.toLowerCase().includes('facebook') ||
											link.label.toLowerCase().includes('github') ||
											link.label.toLowerCase().includes('gmail') || link.label.toLowerCase().includes('email') ||
											link.label.toLowerCase().includes('website') || link.label.toLowerCase().includes('web') ? 
											"4" : "3"
										}
										w={
											link.label.toLowerCase().includes('facebook') ||
											link.label.toLowerCase().includes('github') ||
											link.label.toLowerCase().includes('gmail') || link.label.toLowerCase().includes('email') ||
											link.label.toLowerCase().includes('website') || link.label.toLowerCase().includes('web') ? 
											"auto" : "full"
										}
										h={
											link.label.toLowerCase().includes('facebook') ||
											link.label.toLowerCase().includes('github') ||
											link.label.toLowerCase().includes('gmail') || link.label.toLowerCase().includes('email') ||
											link.label.toLowerCase().includes('website') || link.label.toLowerCase().includes('web') ? 
											"50px" : "auto"
										}
										minW={
											link.label.toLowerCase().includes('facebook') ||
											link.label.toLowerCase().includes('github') ||
											link.label.toLowerCase().includes('gmail') || link.label.toLowerCase().includes('email') ||
											link.label.toLowerCase().includes('website') || link.label.toLowerCase().includes('web') ? 
											"50px" : "auto"
										}
										fontWeight="500"
										display="flex"
										alignItems="center"
										justifyContent="center"
										_hover={{
											bg: 
												link.label.toLowerCase().includes('facebook') ? "#166FE5" :
												link.label.toLowerCase().includes('github') ? "#1a1e22" :
												link.label.toLowerCase().includes('gmail') || link.label.toLowerCase().includes('email') ? "#D33B2C" :
												link.label.toLowerCase().includes('website') || link.label.toLowerCase().includes('web') ? "#3367D6" :
												"rgba(255,255,255,0.9)",
											transform: "translateY(-2px) scale(1.05)",
											boxShadow: 
												link.label.toLowerCase().includes('facebook') ? "0 6px 20px rgba(24, 119, 242, 0.5)" :
												link.label.toLowerCase().includes('github') ? "0 6px 20px rgba(36, 41, 46, 0.5)" :
												link.label.toLowerCase().includes('gmail') || link.label.toLowerCase().includes('email') ? "0 6px 20px rgba(234, 67, 53, 0.5)" :
												link.label.toLowerCase().includes('website') || link.label.toLowerCase().includes('web') ? "0 6px 20px rgba(66, 133, 244, 0.5)" :
												"0 4px 10px rgba(0,0,0,0.1)"
										}}
										transition="all 0.3s ease"
									>
										{
											link.label.toLowerCase().includes('facebook') ? 
											<BsFacebook fontSize="1.5rem" /> :
											link.label.toLowerCase().includes('github') ? 
											<BsGithub fontSize="1.5rem" /> :
											link.label.toLowerCase().includes('gmail') || link.label.toLowerCase().includes('email') ? 
											<SiGmail fontSize="1.5rem" /> :
											link.label.toLowerCase().includes('website') || link.label.toLowerCase().includes('web') ? 
											<HiOutlineGlobeAlt fontSize="1.5rem" /> :
											link.label
										}
									</Button>
								)
							)}
						</HStack>
					</Box>
				}
			</Flex>
		</Box>
	);
}
