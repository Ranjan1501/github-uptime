const axios = require("axios");

// Get GitHub token from environment variables
const getGitHubHeaders = () => {
  const token = process.env.GITHUB_TOKEN;
  if (token) {
    return {
      Authorization: `token ${token}`,
      Accept: "application/vnd.github.v3+json",
    };
  }
  return {
    Accept: "application/vnd.github.v3+json",
  };
};

exports.fetchUserProfile = async (username) => {
  const res = await axios.get(`https://api.github.com/users/${username}`, {
    headers: getGitHubHeaders(),
  });
  return res.data;
};

/**
 * Fetch contribution data using GitHub Events API
 * This aggregates push events to create a contribution calendar
 */
exports.fetchContributions = async (username) => {
  try {
    // Get user's public events (pushes, commits, etc.)
    const eventsRes = await axios.get(
      `https://api.github.com/users/${username}/events/public`,
      {
        headers: getGitHubHeaders(),
        timeout: 10000,
        params: {
          per_page: 10, // Get last 100 events
        },
      }
    );

    const events = eventsRes.data || [];

    console.log(`Fetched ${events.length} events for ${username}`);

    // Aggregate events by date
    const contributionsMap = {};
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    events.forEach((event) => {
      if (event.type === "PushEvent" && event.created_at) {
        const date = new Date(event.created_at);
        if (date >= oneYearAgo) {
          const dateStr = date.toISOString().split("T")[0]; // YYYY-MM-DD
          const commitCount = event.payload?.commits?.length || 0;
          contributionsMap[dateStr] =
            (contributionsMap[dateStr] || 0) + commitCount;
        }
      }
    });

    // Convert to array format: [{date: "2024-01-01", count: 5}, ...]
    const contributions = Object.keys(contributionsMap).map((date) => ({
      date,
      count: contributionsMap[date],
    }));

    console.log(`Generated ${contributions.length} contribution entries`);

    return contributions;
  } catch (err) {
    // If request fails, return empty array instead of throwing
    console.warn(`Failed to fetch contributions for ${username}:`, err.message);
    return [];
  }
};

exports.fetchUserRepositories = async (username) => {
  try {
    const res = await axios.get(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=100`,
      {
        headers: getGitHubHeaders(),
        timeout: 10000,
      }
    );
    return res.data;
  } catch (err) {
    console.error(`Error fetching repositories for ${username}:`, err.message);
    throw err; // Re-throw to be handled by controller
  }
};
