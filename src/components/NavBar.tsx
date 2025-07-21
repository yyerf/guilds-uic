import { Box, Flex } from "@chakra-ui/react";
import Link from "next/link";
import NewGuildLogo from "./logos/newGuildLogo";
import Gdgoc from "./logos/Gdgoc"

export default function NavigationBar() {
	return (
		<Flex
			bg = "gray.900"
			justifyContent={["center", "center", "flex-start"]}
			pl={["0", "0", "3rem"]}
			pt="3rem"
			pb={["1.4rem", "1.4rem", "3rem"]}
		>
			<Link href="/">
				<NewGuildLogo />
			</Link>
		</Flex>
	);
}
