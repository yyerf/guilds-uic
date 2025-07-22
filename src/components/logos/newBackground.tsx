import React from 'react';

const NewBackground: React.FC = () => {
	return (
		<svg 
			width="100%" 
			height="100%" 
			viewBox="0 0 1440 800" 
			fill="none" 
			xmlns="http://www.w3.org/2000/svg"
			preserveAspectRatio="xMidYMid slice"
			style={{ width: '100%', height: '100%', minHeight: '100vh' }}
		>
			<defs>
				{/* Blue gradient matching your Figma design */}
				<linearGradient 
					id="blueGradient" 
					x1="0%" 
					y1="0%" 
					x2="100%" 
					y2="100%"
				>
					<stop offset="0%" stopColor="#1e40af" stopOpacity="1" />
					<stop offset="25%" stopColor="#3b82f6" stopOpacity="0.95" />
					<stop offset="50%" stopColor="#60a5fa" stopOpacity="0.8" />
					<stop offset="75%" stopColor="#93c5fd" stopOpacity="0.6" />
					<stop offset="100%" stopColor="#dbeafe" stopOpacity="0.4" />
				</linearGradient>
				
				{/* Additional radial gradient for university building effect */}
				<radialGradient 
					id="buildingGradient" 
					cx="50%" 
					cy="30%" 
					r="70%"
				>
					<stop offset="0%" stopColor="rgba(30,64,175,0.8)" />
					<stop offset="50%" stopColor="rgba(59,130,246,0.6)" />
					<stop offset="100%" stopColor="rgba(219,234,254,0.3)" />
				</radialGradient>
			</defs>
			
			{/* Main blue gradient background */}
			<rect 
				x="0" 
				y="0" 
				width="100%" 
				height="100%" 
				fill="url(#blueGradient)" 
			/>
			
			{/* Radial overlay for depth and university building silhouette effect */}
			<rect 
				x="0" 
				y="0" 
				width="100%" 
				height="100%" 
				fill="url(#buildingGradient)" 
			/>
			
			{/* Subtle building silhouette shapes */}
			<rect 
				x="0" 
				y="60%" 
				width="20%" 
				height="40%" 
				fill="rgba(30,64,175,0.3)" 
			/>
			<rect 
				x="15%" 
				y="50%" 
				width="25%" 
				height="50%" 
				fill="rgba(59,130,246,0.25)" 
			/>
			<rect 
				x="35%" 
				y="55%" 
				width="30%" 
				height="45%" 
				fill="rgba(96,165,250,0.2)" 
			/>
			<rect 
				x="60%" 
				y="45%" 
				width="40%" 
				height="55%" 
				fill="rgba(147,197,253,0.15)" 
			/>
		</svg>
	);
};

export default NewBackground;