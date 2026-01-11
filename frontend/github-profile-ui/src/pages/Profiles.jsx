import { useEffect, useState } from "react";
import {
  getUserProfile,
  getUserContributions,
  getUserRepositories,
} from "../services/api";

import Sidebar from "../components/Sidebar";
import Tabs from "../components/Tabs";
import ContributionGraph from "../components/ContributionGraph";
import Repositories from "../components/Repositories";

const Profiles = () => {
  const username = "shreeramk";
  const [profile, setProfile] = useState(null);
  const [contributions, setContributions] = useState([]);
  const [repositories, setRepositories] = useState([]);
  const [activeTab, setActiveTab] = useState("Repositories");
  const [loading, setLoading] = useState(true);
  const [reposLoading, setReposLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [profileRes, contributionsRes] = await Promise.all([
          getUserProfile(username).catch((err) => {
            console.error("Error fetching profile:", err);
            throw err;
          }),
          getUserContributions(username).catch((err) => {
            console.error("Error fetching contributions:", err);
            return { data: [] }; // Return empty array on error
          }),
        ]);

        setProfile(profileRes.data);
        const contribData = contributionsRes.data || [];
        console.log("Contributions data received:", contribData);
        setContributions(contribData);
      } catch (err) {
        // Check if it's a 403 rate limit error
        if (err.response && err.response.status === 403) {
          const errorMsg = err.response.data?.error || "Rate limit exceeded";
          setError(errorMsg);
        } else {
          setError(err.message || "Failed to load profile data");
        }
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchRepositories = async () => {
      if (activeTab === "Repositories" && repositories.length === 0) {
        try {
          setReposLoading(true);
          const reposRes = await getUserRepositories(username).catch((err) => {
            console.error("Error fetching repositories:", err);
            // If it's a 403, show the error message
            if (err.response && err.response.status === 403) {
              setError(err.response.data?.error || "Rate limit exceeded");
            }
            return { data: [] };
          });
          setRepositories(reposRes.data || []);
        } catch (err) {
          console.error("Error:", err);
        } finally {
          setReposLoading(false);
        }
      }
    };

    fetchRepositories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  useEffect(() => {
    const fetchContributions = async () => {
      if (activeTab === "Contributions" && contributions.length === 0) {
        try {
          setReposLoading(true);
          const reposRes = await getUserContributions(username).catch((err) => {
            console.error("Error fetching repositories:", err);
            // If it's a 403, show the error message
            if (err.response && err.response.status === 403) {
              setError(err.response.data?.error || "Rate limit exceeded");
            }
            return { data: [] };
          });
          setContributions(reposRes.data || []);
        } catch (err) {
          console.error("Error:", err);
        } finally {
          setReposLoading(false);
        }
      }
    };

    fetchContributions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  // Helper to detect whether contributions dataset is effectively empty
  const isContributionsEmpty = (data) => {
    if (!data) return true;
    if (Array.isArray(data)) {
      if (data.length === 0) return true;
      for (const item of data) {
        if (Array.isArray(item) && item.length >= 2 && (item[1] || 0) > 0)
          return false;
        if (item && typeof item === "object") {
          const count = item.count || item.contributionCount || item[1] || 0;
          if (count > 0) return false;
        }
      }
      return true;
    }
    if (typeof data === "object") {
      if (data.contributions && Array.isArray(data.contributions)) {
        return data.contributions.every((it) => (it.count || 0) === 0);
      }
      if (data.years && typeof data.years === "object") {
        for (const yearKey of Object.keys(data.years)) {
          const arr = data.years[yearKey];
          if (Array.isArray(arr)) {
            for (const item of arr) {
              const count =
                item.count || item.contributionCount || item[1] || 0;
              if (count > 0) return false;
            }
          }
        }
        return true;
      }
    }
    return true;
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "Repositories":
        return (
          <Repositories repositories={repositories} loading={reposLoading} />
        );
      case "Projects":
        return <p>Projects feature coming soon...</p>;
      case "Packages":
        return <p>Packages feature coming soon...</p>;
      case "Contributions": {
        const empty = isContributionsEmpty(contributions);
        return (
          <div
            className="contributions-section"
            style={{
              display: "block",
              visibility: "visible",
              position: "relative",
              zIndex: 1,
              marginTop: "20px",
              paddingTop: "15px",
              borderTop: "1px solid rgba(255, 255, 255, 0.1)",
              width: "100%",
              minHeight: "250px",
            }}
            data-testid="contributions-section"
          >
            <h3
              data-testid="contribution-header"
              style={{
                fontSize: "0.95em",
                margin: "0 0 15px 0",
                color: "rgba(255, 255, 255, 0.9)",
                fontWeight: "600",
                display: "block",
              }}
            >
              {empty
                ? "Contribution Activity — No contribution available for this user"
                : "Contribution Activity"}
            </h3>
            {!empty && <ContributionGraph data={contributions} />}
          </div>
        );
      }
      default:
        return null;
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!profile) return <p>No profile data available</p>;

  console.log(
    "Rendering Profiles - activeTab:",
    activeTab,
    "contributions:",
    contributions,
    "contributions length:",
    Array.isArray(contributions) ? contributions.length : "not array"
  );

  return (
    <div className="layout">
      <Sidebar profile={profile} />

      <div className="content">
        <Tabs active={activeTab} setActive={setActiveTab} />
        {renderTabContent()}
        {activeTab === "Repositories" && (
          <div
            className="contributions-section"
            style={{
              display: "block",
              visibility: "visible",
              position: "relative",
              zIndex: 1,
              marginTop: "20px",
              paddingTop: "15px",
              borderTop: "1px solid rgba(255, 255, 255, 0.1)",
              width: "100%",
              minHeight: "250px",
            }}
            data-testid="contributions-section"
          >
            <h3
              style={{
                fontSize: "0.95em",
                margin: "0 0 15px 0",
                color: "rgba(255, 255, 255, 0.9)",
                fontWeight: "600",
                display: "block",
              }}
            >
              Contribution Activity
            </h3>
            <ContributionGraph data={contributions} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Profiles;
