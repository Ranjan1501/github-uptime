const Tabs = ({ active, setActive }) => {
  //   const tabs = ["Repositories", "Projects", "Packages", "C"];
  const tabs = ["Repositories", "Projects", "Packages", "Contributions"];

  return (
    <div className="tabs">
      {tabs.map((tab) => (
        <button
          key={tab}
          className={active === tab ? "active" : ""}
          onClick={() => setActive(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default Tabs;
