import { Badge, BadgeProps } from "@chakra-ui/react";

interface TagProps {
	tagName: string;
	size?: "sm" | "md" | "lg";
	variant?: "solid" | "subtle" | "outline";
}

// Tag color mapping for consistent theming
const getTagColorScheme = (tagName: string): BadgeProps["colorScheme"] => {
	const normalizedTag = tagName.toLowerCase().trim();
	
	// Handle special cases and abbreviations first
	const specialCases: Record<string, BadgeProps["colorScheme"]> = {
		"non-academic": "purple",
		"non-academic club": "purple",
		"academic": "blue",
		"academic club": "blue",
		"jpia": "green",
		"bped": "green",
		"ices": "teal",
		"tci": "yellow",
		"umso": "gray",
		"gdsc": "cyan",
		"faces": "pink",
		"code": "blue",
		"cares": "purple",
		"aces": "blue",
		"pfc": "blue",
		"icdt": "pink",
		"debsoc": "indigo",
		"fastabiqul khayrat": "gray",
		"ad meliora": "yellow",
		"toward better things": "yellow",
		"favoredbraved": "gray",
		"public speaking": "indigo",
		"debate": "indigo",
		"student publication": "yellow",
		"music & arts": "pink",
		"music and arts": "pink",
		"physical education": "green",
		"management accounting": "green",
		"accounting information system": "green",
		"technology related": "cyan",
		"technology": "cyan",
		"dance": "pink",
		"culture": "orange",
		"health": "red",
		"engineering": "teal",
		"leadership": "purple",
		"fitness": "green",
		"religious": "gray",
		"community": "blue",
		"service": "blue",
		"collaboration": "blue",
		"learning": "blue",
		"proactive": "green",
		"compassionate": "pink",
		"ambassador": "purple",
		"public relations": "purple",
		"communication": "blue",
		"media": "yellow",
		"english": "blue",
		"literary": "yellow",
		"future builders": "teal",
		"art": "pink",
		"music": "pink",
		"accountancy": "green",
	};

	// Check for exact matches first
	if (specialCases[normalizedTag]) {
		return specialCases[normalizedTag];
	}

	// Check for partial matches
	for (const [key, color] of Object.entries(specialCases)) {
		if (normalizedTag.includes(key) || key.includes(normalizedTag)) {
			return color;
		}
	}

	// Default fallback
	return "gray";
};

// Normalize tag text for consistent display
const normalizeTagText = (tagName: string): string => {
	// Handle special cases and abbreviations
	const specialCases: Record<string, string> = {
		"p.i.o": "P.I.O",
		"jpia": "JPIA",
		"bped": "BPED",
		"ices": "ICES",
		"tci": "TCI",
		"umso": "UMSO",
		"gdsc": "GDSC",
		"faces": "FACES",
		"code": "CODE",
		"cares": "CARES",
		"aces": "ACES",
		"pfc": "PFC",
		"icdt": "ICDT",
		"debsoc": "DebSoc",
		"fastabiqul khayrat": "Fastabiqul Khayrat",
		"ad meliora": "Ad Meliora",
		"toward better things": "Toward Better Things",
		"favoredbraved": "FAVOREDBRAVED",
		"public speaking": "Public Speaking",
		"student publication": "Student Publication",
		"music & arts": "Music & Arts",
		"music and arts": "Music & Arts",
		"physical education": "Physical Education",
		"management acoounting": "Management Accounting",
		"accounting information system": "Accounting Information System",
		"technology related": "Technology",
		"non-academic club": "Non-Academic",
		"academic club": "Academic",
	};

	const normalized = tagName.toLowerCase().trim();
	
	// Check for special cases first
	for (const [key, value] of Object.entries(specialCases)) {
		if (normalized === key) {
			return value;
		}
	}
	
	// Default title case formatting
	return tagName
		.split(" ")
		.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
		.join(" ");
};

export default function Tag({ tagName, size = "sm", variant = "subtle" }: TagProps) {
	const colorScheme = getTagColorScheme(tagName);
	const displayText = normalizeTagText(tagName);
	
	return (
		<Badge
			colorScheme={colorScheme}
			variant={variant}
			fontSize={size === "sm" ? "xs" : size === "md" ? "sm" : "md"}
			px={size === "sm" ? "2" : size === "md" ? "3" : "4"}
			py={size === "sm" ? "1" : size === "md" ? "1.5" : "2"}
			borderRadius="full"
			fontWeight="medium"
			letterSpacing="wide"
			textTransform="none"
			whiteSpace="nowrap"
			transition="all 0.2s"
			_hover={{
				transform: "translateY(-1px)",
				boxShadow: "sm",
			}}
		>
			{displayText}
		</Badge>
	);
}
