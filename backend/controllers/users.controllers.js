const githubService = require("../services/users.service");

exports.getUserProfile = async (req, res) => {
  try {
    const data = await githubService.fetchUserProfile(req.params.username);
    res.json(data);
  } catch (err) {
    // Check if it's a 404 (user not found) vs other errors
    if (err.response && err.response.status === 404) {
      res.status(404).json({ error: "User not found" });
    } else if (err.response && err.response.status === 403) {
      const rateLimitRemaining =
        err.response.headers["x-ratelimit-remaining"] || "unknown";
      const rateLimitReset = err.response.headers["x-ratelimit-reset"] || null;
      let resetTime = "";
      if (rateLimitReset) {
        const resetDate = new Date(parseInt(rateLimitReset) * 1000);
        resetTime = ` Resets at ${resetDate.toLocaleTimeString()}`;
      }
      res.status(403).json({
        error: `GitHub API rate limit exceeded. Remaining: ${rateLimitRemaining}.${resetTime} ${
          !process.env.GITHUB_TOKEN
            ? " Consider adding a GITHUB_TOKEN to increase limits."
            : ""
        }`,
      });
    } else {
      console.error("Error fetching profile:", err.message);
      res
        .status(500)
        .json({ error: err.message || "Failed to fetch user profile" });
    }
  }
};

exports.getUserContributions = async (req, res) => {
  try {
    const data = await githubService.fetchContributions(req.params.username);
    // Always return an array, even if empty
    res.json(Array.isArray(data) ? data : []);
  } catch (err) {
    // Return empty array instead of error for contributions
    console.error("Error fetching contributions:", err.message);
    res.json([]);
  }
};

exports.getUserRepositories = async (req, res) => {
  try {
    const data = await githubService.fetchUserRepositories(req.params.username);
    res.json(Array.isArray(data) ? data : []);
  } catch (err) {
    // Check if it's a 404 (user not found) vs other errors
    if (err.response && err.response.status === 404) {
      res.status(404).json({ error: "User not found" });
    } else if (err.response && err.response.status === 403) {
      const rateLimitRemaining =
        err.response.headers["x-ratelimit-remaining"] || "unknown";
      const rateLimitReset = err.response.headers["x-ratelimit-reset"] || null;
      let resetTime = "";
      if (rateLimitReset) {
        const resetDate = new Date(parseInt(rateLimitReset) * 1000);
        resetTime = ` Resets at ${resetDate.toLocaleTimeString()}`;
      }
      res.status(403).json({
        error: `GitHub API rate limit exceeded. Remaining: ${rateLimitRemaining}.${resetTime} ${
          !process.env.GITHUB_TOKEN
            ? " Consider adding a GITHUB_TOKEN to increase limits."
            : ""
        }`,
      });
    } else {
      console.error("Error fetching repositories:", err.message);
      res
        .status(500)
        .json({ error: err.message || "Failed to fetch repositories" });
    }
  }
};
