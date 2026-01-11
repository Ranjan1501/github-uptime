const Sidebar = ({ profile }) => {
  if (!profile) return null;

  return (
    <div className="sidebar">
      {profile.avatar_url && <img src={profile.avatar_url} alt="avatar" />}
      <h2>{profile.name || profile.login || "Unknown User"}</h2>
      {profile.bio && <p>{profile.bio}</p>}

      <p>Followers: {profile.followers ?? 0}</p>
      <p>Following: {profile.following ?? 0}</p>
      <p>Public Repos: {profile.public_repos ?? 0}</p>
    </div>
  );
};

export default Sidebar;
