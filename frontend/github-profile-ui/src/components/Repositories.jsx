const Repositories = ({ repositories, loading }) => {
  if (loading) {
    return <p>Loading repositories...</p>;
  }

  if (!repositories || repositories.length === 0) {
    return <p>No repositories found</p>;
  }

  return (
    <div className="repositories">
      {repositories.map((repo) => (
        <div key={repo.id} className="repository-card">
          <div className="repository-header">
            <h3>
              <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                {repo.name}
              </a>
            </h3>
            {repo.private ? (
              <span className="badge private">Private</span>
            ) : (
              <span className="badge public">Public</span>
            )}
          </div>
          {repo.description && (
            <p className="description">{repo.description}</p>
          )}
          <div className="repository-meta">
            {repo.language && (
              <span className="language">
                <span className="language-dot"></span>
                {repo.language}
              </span>
            )}
            {repo.stargazers_count > 0 && (
              <span className="stars">⭐ {repo.stargazers_count}</span>
            )}
            {repo.forks_count > 0 && (
              <span className="forks">🍴 {repo.forks_count}</span>
            )}
            {repo.updated_at && (
              <span className="updated">
                {new Date(repo.updated_at).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Repositories;
