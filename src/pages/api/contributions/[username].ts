import type { APIRoute } from 'astro';

export const prerender = false;

// In-memory cache with TTL (5 minutes)
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds
const cache = new Map<string, { data: any; timestamp: number }>();

/**
 * Fetches user data from GitHub API
 * Bypasses CORS by making the request server-side
 */
async function fetchGitHubUserData(username: string) {
	// Validate username format
	if (!username || typeof username !== 'string' || username.length === 0) {
		throw new Error('Invalid username');
	}

	// Sanitize username to prevent injection
	const sanitizedUsername = username.replace(/[^a-zA-Z0-9-]/g, '');
	if (sanitizedUsername.length === 0) {
		throw new Error('Invalid username format');
	}

	// Check cache
	const cached = cache.get(sanitizedUsername);
	if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
		return cached.data;
	}

	try {
		// Fetch from GitHub REST API
		const response = await fetch(`https://api.github.com/users/${sanitizedUsername}`, {
			headers: {
				Accept: 'application/vnd.github.v3+json',
				// Add GitHub token if available for higher rate limits
				...(process.env.GITHUB_TOKEN && { Authorization: `token ${process.env.GITHUB_TOKEN}` }),
			},
		});

		if (response.status === 404) {
			throw new Error(`User not found: ${sanitizedUsername}`);
		}

		if (response.status === 403) {
			throw new Error('GitHub API rate limit exceeded. Please try again later.');
		}

		if (!response.ok) {
			throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
		}

		const userData = await response.json();

		// Extract relevant contribution data
		const contributionData = {
			username: userData.login,
			name: userData.name,
			avatar_url: userData.avatar_url,
			public_repos: userData.public_repos,
			followers: userData.followers,
			following: userData.following,
			created_at: userData.created_at,
			updated_at: userData.updated_at,
		};

		// Cache the result
		cache.set(sanitizedUsername, {
			data: contributionData,
			timestamp: Date.now(),
		});

		return contributionData;
	} catch (error) {
		if (error instanceof Error) {
			throw error;
		}
		throw new Error('Failed to fetch GitHub user data');
	}
}

export const GET: APIRoute = async ({ params }) => {
	const { username } = params;

	try {
		const data = await fetchGitHubUserData(username as string);

		return new Response(JSON.stringify(data), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Unknown error';

		// Determine appropriate status code
		let statusCode = 500;
		if (message.includes('not found')) statusCode = 404;
		if (message.includes('Invalid username')) statusCode = 400;
		if (message.includes('rate limit')) statusCode = 429;

		return new Response(
			JSON.stringify({
				error: message,
				username: username,
			}),
			{
				status: statusCode,
				headers: { 'Content-Type': 'application/json' },
			}
		);
	}
};
