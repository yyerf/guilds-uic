import { allClubs } from "contentlayer/generated";
import { NextApiRequest, NextApiResponse } from "next";
import MiniSearch from "minisearch";

type ClubSearchOptions = {
  q: string,
  type: 'non-academic' | 'academic',
  tags: string,
  limit: string,
  page: string
}

const searchIndex = allClubs.map(club => ({
	id: club._id,
	name: club.name,
	description: club.description?.full || '',
	shortDescription: club.description?.short || '',
	tags: club.tags?.join(' ') || '',
	orgType: club.org_type || '',
	// Create searchable text from all content
	searchableText: [
		club.name,
		club.description?.full,
		club.description?.short,
		...(club.tags || []),
		club.org_type
	].filter(Boolean).join(' ')
}));

const minisearch = new MiniSearch({
	fields: ["name", "description", "shortDescription", "tags", "orgType", "searchableText"],
	storeFields: ["id"],
	searchOptions: {
		boost: { name: 2, shortDescription: 1.5 }, // Boost name and short description in results
		fuzzy: 0.2, // Allow for small typos
		prefix: true // Allow partial word matching
	}
});

minisearch.addAll(searchIndex);

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== "GET") {
		return res.status(405);
	}

	const params: Partial<ClubSearchOptions> = req.query;
	let results = allClubs;

	// Handle text search
	if (params.q) {
		const resultsFromSearch = Array.from(new Set(minisearch.search(params.q).map(result => result.id)));
		results = resultsFromSearch.map(id => results.find(r => r._id === id)).filter(Boolean) as typeof allClubs;
	}

	// Handle multi-tag filtering
	if (params.tags) {
		const selectedTags = params.tags.split(',');
		results = results.filter(club => {
			return selectedTags.some(tag => club.tags?.includes(tag));
		});
	}

	res.status(200).json(results);
}
