import ReactECharts from "echarts-for-react";

const ContributionGraph = ({ data }) => {
  console.log("ContributionGraph data:", data);
  console.log("ContributionGraph rendering with data:", data);
  console.log(
    "ContributionGraph - data type:",
    typeof data,
    "isArray:",
    Array.isArray(data),
    "length:",
    Array.isArray(data) ? data.length : "N/A"
  );

  // Helper to render no-contributions state
  const renderNoContributions = () => (
    <div
      data-testid="no-contributions"
      style={{ padding: "15px", textAlign: "left" }}
    >
      No contribution available for this user
    </div>
  );

  // Early return if no data at all
  if (!data || (Array.isArray(data) && data.length === 0)) {
    console.log("Rendering empty contribution state");
    return renderNoContributions();
  }

  // Transform data to ECharts format: [date, value]
  let chartData = [];
  let maxValue = 0;

  // Handle different data formats
  if (Array.isArray(data)) {
    // If it's an array, check the format
    if (data.length > 0) {
      // Check if it's already in [date, value] format
      if (Array.isArray(data[0]) && data[0].length === 2) {
        chartData = data;
        maxValue = Math.max(...data.map((item) => item[1] || 0));
      } else if (data[0].date !== undefined) {
        // Format: [{date: "2024-01-01", count: 5}, ...] or [{date: "2024-01-01", contributionCount: 5}, ...]
        chartData = data.map((item) => [
          item.date,
          item.count || item.contributionCount || 0,
        ]);
        maxValue = Math.max(
          ...data.map((item) => item.count || item.contributionCount || 0)
        );
      } else if (data[0].contributionCount !== undefined) {
        // Format: [{contributionCount: 5, date: "2024-01-01"}, ...]
        chartData = data.map((item) => [
          item.date,
          item.contributionCount || 0,
        ]);
        maxValue = Math.max(...data.map((item) => item.contributionCount || 0));
      }
    } else {
      chartData = [
        "No contributions made or contributions made in private repositories testing ........",
      ];
      maxValue = 0;
      console.log("ChartData", chartData);
    }
  } else if (typeof data === "object") {
    // Handle object format - might have years as keys
    if (Object.keys(data).length > 0) {
      if (data.years) {
        // Format: {years: {2024: [{date, count}]}}
        Object.keys(data.years).forEach((year) => {
          const yearData = data.years[year];
          if (Array.isArray(yearData)) {
            yearData.forEach((item) => {
              const date = item.date || item[0];
              const count =
                item.count || item.contributionCount || item[1] || 0;
              chartData.push([date, count]);
              maxValue = Math.max(maxValue, count);
            });
          }
        });
      } else if (data.contributions) {
        // Format: {contributions: [...]}
        chartData = data.contributions.map((item) => [
          item.date,
          item.count || 0,
        ]);
        maxValue = Math.max(
          ...data.contributions.map((item) => item.count || 0)
        );
      }
    } else {
      chartData = [
        "No contributions made or contributions made in private repositories testing ........",
      ];
      console.log("ChartData", chartData);
      maxValue = 0;
      console.log("Data", data);
    }
  }

  const totalContributions = chartData.reduce(
    (sum, item) => sum + (item[1] || 0),
    0
  );

  if (chartData.length === 0 || totalContributions === 0) {
    return renderNoContributions();
  }

  // Determine year range from data
  let yearRange = new Date().getFullYear().toString();
  try {
    const dates = chartData.map((item) => item[0]);
    const minDate = new Date(
      Math.min(...dates.map((d) => new Date(d).getTime()))
    );
    const maxDate = new Date(
      Math.max(...dates.map((d) => new Date(d).getTime()))
    );
    const startYear = minDate.getFullYear();
    const endYear = maxDate.getFullYear();
    yearRange =
      startYear === endYear ? `${startYear}` : `${startYear}-${endYear}`;
  } catch (err) {
    console.error("Error calculating year range:", err);
    yearRange = new Date().getFullYear().toString();
  }

  const option = {
    tooltip: {
      position: "top",
      formatter: function (params) {
        return `${params.data[0]}<br/>Contributions: ${params.data[1]}`;
      },
    },
    visualMap: {
      min: 0,
      max: Math.max(maxValue, 10),
      calculable: false,
      orient: "horizontal",
      left: "center",
      bottom: 20,
      inRange: {
        color: ["#ebedf0", "#c6e48b", "#7bc96f", "#239a3b", "#196127"],
      },
    },
    calendar: {
      range: yearRange,
      cellSize: ["auto", 13],
      itemStyle: {
        borderWidth: 0.5,
      },
      yearLabel: {
        show: true,
      },
    },
    series: {
      type: "heatmap",
      coordinateSystem: "calendar",
      data: chartData,
    },
  };

  return (
    <div style={{ width: "100%", minHeight: "200px" }}>
      <ReactECharts
        option={option}
        style={{ height: "200px", width: "100%" }}
      />
    </div>
  );
};

export default ContributionGraph;
