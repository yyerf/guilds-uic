import { Box, Image } from "@chakra-ui/react";

export default function CurveBackground({ fill = '#0057FF' }: { fill?: string }) {
	return (
		<Box 
			position="absolute" 
			width="full" 
			height="full" 
			zIndex="-1"
			overflow="hidden"
		>
			<Image
				src="/Designated Landing Page Page.png"
				alt="Designated Landing Page Background"
				width="100%"
				height="100%"
				objectFit="cover"
				objectPosition="center"
				position="absolute"
				top="0"
				left="0"
				style={{
					minHeight: '100vh',
					minWidth: '100vw'
				}}
			/>
			{/* Optional overlay for better text readability */}
			<Box
				position="absolute"
				top="0"
				left="0"
				width="100%"
				height="100%"
				bg="rgba(0, 0, 0, 0.1)"
				zIndex="1"
			/>
		</Box>
	);
}
