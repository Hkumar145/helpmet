import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { useSelector } from "react-redux";
import BarChart from "../components/BarChart";
import { DateTime } from "luxon";
import PendingAndCompletedReports from "@/components/PendingAndCompletedReports";
import Avatar from "react-avatar";
import { Tooltip as ReactTooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import BackToTopButton from "../components/BackToTopButton";

const injuryTypeMapping = {
  T0001: "Overexertion",
  T0002: "Fall from Elevation",
  T0003: "Struck By",
  T0004: "Exposure to Toxic Substances",
  T0005: "Caught In",
  T0006: "Epidemic Related",
  T0007: "Motor Vehicle Incident",
  T0008: "Industrial and Other Vehicle Accident",
  T0009: "Contact with Electricity",
  T0010: "Matter in Eye",
};

const severityMapping = {
  1: "Minor",
  2: "Severe",
  3: "Moderate",
  4: "Significant",
  5: "Fatal",
};

const dayTypeName = {
  Sun: "Sunday",
  Mon: "Monday",
  Tue: "Tuesday",
  Wed: "Wednesday",
  Thu: "Thursday",
  Fri: "Friday",
  Sat: "Saturday",
};

const InjuryAnalytics = () => {
  const username = useSelector((state) => state.user.currentUser?.username);
  const companyID = useSelector((state) => state.user.currentUser?.companyID);
  const [injuryTypeData, setInjuryTypeData] = useState({
    labels: [],
    datasets: [],
  });
  const [weeklyInjuryData, setWeeklyInjuryData] = useState({
    labels: [],
    datasets: [],
  });
  const [selectedBar, setSelectedBar] = useState("T0006");
  const [selectedInjuryReports, setSelectedInjuryReports] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [changeText, setChangeText] = useState("");
  const [injuryComparisonText, setInjuryComparisonText] = useState("");
  const [monthlyEpidemicData, setMonthlyEpidemicData] = useState({
    labels: [],
    datasets: [],
  });
  const [severityData, setSeverityData] = useState(null);
  const [filterBy, setFilterBy] = useState(null);
  const [currentFilterValue, setCurrentFilterValue] = useState(null);
  const navigate = useNavigate();
  const [epidemicPercentage, setEpidemicPercentage] = useState(null);

  useEffect(() => {
    const fetchMonthlyEpidemicData = async () => {
      try {
        const response = await axios.get(
          `/monthly-epidemic-data?companyID=${companyID}`
        );
        const sortedData = response.data;
        const labels = sortedData.map((item) => item._id);
        const counts = sortedData.map((item) => item.count);

        setMonthlyEpidemicData({
          labels,
          datasets: [
            {
              label: "Epidemic Injury Type",
              data: counts,
              backgroundColor: "rgba(152, 162, 179)",
              hoverBackgroundColor: "rgba(105, 56, 239)",

              tension: 0.6,
              fill: true,
              borderRadius: 4,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching monthly epidemic data:", error);
      }
    };

    fetchMonthlyEpidemicData();
  }, [companyID]);

  useEffect(() => {
    const fetchInjuryTypeData = async () => {
      try {
        const response = await axios.get(
          `/injury-type-stats?companyID=${companyID}`
        );
        const data = response.data;
        const sortedData = [...data].sort((a, b) => b.count - a.count);

        const labels = sortedData.map((item) => item._id);
        const counts = sortedData.map((item) => item.count);

        const totalInjuries = counts.reduce((acc, count) => acc + count, 0);

        const epidemicData = sortedData.find((item) => item._id === "T0006");
        const epidemicCount = epidemicData ? epidemicData.count : 0;
        const epidemicPercentage = Math.round(
          (epidemicCount / totalInjuries) * 100
        );

        setEpidemicPercentage(epidemicPercentage);

        setInjuryTypeData({
          labels: labels,
          datasets: [
            {
              label: "Number of Injuries",
              data: counts,
              backgroundColor: "rgba(233, 236, 241)",
              hoverBackgroundColor: "rgba(105, 56, 239)",
              borderRadius: 4,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching injury stats:", error);
      }
    };

    const fetchWeeklyInjuryData = async () => {
      try {
        const response = await axios.get(
          `/weekly-injury-stats?companyID=${companyID}`
        );
        const data = response.data;

        const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const currentWeekCounts = Array(7).fill(0);

        data.forEach((item) => {
          const dayOfWeekIndex = item._id - 1;
          currentWeekCounts[dayOfWeekIndex] = item.count;
        });

        setWeeklyInjuryData({
          labels: daysOfWeek,
          datasets: [
            {
              label: "Injuries This Week",
              data: currentWeekCounts,
              backgroundColor: "rgba(233, 236, 241)",
              hoverBackgroundColor: "rgba(105, 56, 239)",
              borderRadius: 4,
            },
          ],
        });

        const previousWeekResponse = await axios.get(
          `/previous-weekly-injury-stats?companyID=${companyID}`
        );
        const previousWeekData = previousWeekResponse.data;

        const previousWeekCountsTotal = previousWeekData.reduce(
          (acc, item) => acc + item.count,
          0
        );

        const currentWeekCountsTotal = currentWeekCounts.reduce(
          (acc, count) => acc + count,
          0
        );

        const change =
          previousWeekCountsTotal === 0
            ? currentWeekCountsTotal === 0
              ? 0
              : 100 // if previousWeekCountsTotal and currentWeekCountsTotal are zero
            : ((currentWeekCountsTotal - previousWeekCountsTotal) /
                previousWeekCountsTotal) *
              100;

        setChangeText(`${Math.abs(change).toFixed(0)}%`);

        if (change < 0) {
          setInjuryComparisonText(
            `Injuries have been reduced by ${Math.abs(change).toFixed(
              0
            )}% compared to last week.`
          );
        } else {
          setInjuryComparisonText(
            `Injuries have increased by ${Math.abs(change).toFixed(
              0
            )}% compared to last week.`
          );
        }
      } catch (error) {
        console.error("Error fetching weekly injury stats:", error);
      }
    };

    fetchInjuryTypeData();
    fetchWeeklyInjuryData();
  }, []);

  const handleInjuryTypeBarClick = async (barLabel) => {
    let queryParam = "injuryTypeID";
    let value = barLabel;
    setSelectedBar(barLabel);
    try {
      setFilterBy("injuryType");
      setCurrentFilterValue(barLabel);
      const response = await axios.get(
        `/companies/${companyID}/reports?${queryParam}=${value}`
      );

      const sortedReports = response.data.sort((a, b) => {
        return new Date(a.dateOfInjury) - new Date(b.dateOfInjury);
      });

      setSelectedInjuryReports(sortedReports);
      setShowTable(true);
      fetchSeverityData(barLabel, null);
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  };

  const fetchSeverityData = async (injuryTypeID, dateOfInjury) => {
    try {
      const params = {};
      if (injuryTypeID) params.injuryTypeID = injuryTypeID;
      if (dateOfInjury) params.dateOfInjury = dateOfInjury;

      const response = await axios.get(`/companies/${companyID}/reports`, {
        params,
      });
      const severityCounts = [0, 0, 0]; // High, Medium, Low

      response.data.forEach((report) => {
        if (report.severity === 1) {
          severityCounts[2] += 1;
        } else if (report.severity === 3) {
          severityCounts[1] += 1;
        } else if (report.severity === 5) {
          severityCounts[0] += 1;
        }
      });

      setSeverityData({
        labels: ["High Severity", "Medium Severity", "Low Severity"],
        datasets: [
          {
            label: `Severity Counts`,
            data: severityCounts,
            backgroundColor: ["#3E1C96", "#6938EF", "#9B8AFB"],
            hoverBackgroundColor: ["#3E1C96", "#6938EF", "#9B8AFB"],
            borderRadius: 4,
          },
        ],
      });
    } catch (error) {
      console.error("Error fetching severity data:", error);
    }
  };

  const handleWeeklyInjuryBarClick = async (dayLabel) => {
    setSelectedBar(dayLabel);

    const today = DateTime.now();
    const startOfWeek = today.startOf("week").plus({ days: 1 });
    const dayOfWeekIndex = weeklyInjuryData.labels.indexOf(dayLabel);
    // Adjust by subtracting 2 days to account for the offset
    const selectedDate = startOfWeek
      .plus({ days: dayOfWeekIndex })
      .minus({ days: 2 }); // const selectedDate = startOfWeek.plus({ days: dayOfWeekIndex });

    const queryDate = selectedDate.toISODate();

    try {
      const response = await axios.get(
        `/companies/${companyID}/reports?dateOfInjury=${queryDate}`
      );
      setSelectedInjuryReports(response.data);
      setShowTable(true);
      fetchSeverityData(null, queryDate);
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  };

  const filteredInjuryTypeData = {
    ...injuryTypeData,
    datasets: [
      {
        ...injuryTypeData.datasets[0],
        backgroundColor: injuryTypeData.labels.map((label) =>
          label === selectedBar ? "rgba(105, 56, 239)" : "rgba(152, 162, 179)"
        ),
      },
    ],
  };

  const filteredWeeklyInjuryData = {
    ...weeklyInjuryData,
    datasets: [
      {
        ...weeklyInjuryData.datasets[0],
        backgroundColor: weeklyInjuryData.labels.map((label) =>
          label === selectedBar ? "rgba(105, 56, 239)" : "rgba(152, 162, 179)"
        ),
      },
    ],
  };

  const handleViewDetails = (reportID) => {
    navigate(`/report/${reportID}`);
  };

  // default select T0006 when the page is loaded
  useEffect(() => {
    if (selectedBar === "T0006") {
      fetchSeverityData();
    }
  }, [selectedBar]);

  return (

    <div className="w-full flex flex-col gap-4 px-4 lg:px-7 max-w-[2700px]">
      <h1 className="text-lg w-full font-bold xl:ml-1 mb-2 text-left">
        Injury Analytics - Injury Overview
      </h1>
      <div className="flex flex-col w-full gap-4 lg:gap-[0.75rem] items-center justify-center md:flex-row md:flex-wrap">
        <div className="bg-white rounded-lg border-2 max-w-72 flex flex-col items-center h-[300px] w-[386px]">
          <BarChart
            chartData={filteredWeeklyInjuryData}
            barName={dayTypeName}
            title="General Weekly Overview"
            onBarClick={handleWeeklyInjuryBarClick}
            indexAxis="x"
          />
          <div className="flex flex-row items-center justify-center my-3 gap-2 max-w-[75%] mx-auto">
            <p className="text-[#039855]">{changeText}</p>
            <p className="text-[14px] text-left">{injuryComparisonText}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg border-2 max-w-72 h-[300px] w-[386px]">
          {severityData && (
            <div className="max-w-min">
              <BarChart
                chartData={severityData}
                // onBarClick={handleSeverityBarClick}
                barName={{
                  1: "Low Severity",
                  3: "Medium Severity",
                  5: "High Severity",
                }}
                title="Injury Projection"
                indexAxis="y"
              />
              <div className="flex flex-col items-center justify-center my-1 max-w-[90%] mx-auto text-[13px]">
                <p className="text-left w-full dot-before dot-hs">
                  High Severity
                </p>
                <p className="text-left w-full dot-before dot-ms">
                  Medium Severity
                </p>
                <p className="text-left w-full dot-before dot-ls">
                  Low Severity
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg border-2 max-w-72 h-[300px] w-[386px]">
          <BarChart
            chartData={filteredInjuryTypeData}
            barName={injuryTypeMapping}
            title="Injury Category Projection"
            onBarClick={handleInjuryTypeBarClick}
            indexAxis="y"
          />
          <div className="flex flex-row items-center justify-center my-3 gap-2 max-w-[100%] ml-8 mr-6">
            <p className="text-[#039855]">{epidemicPercentage}%</p>
            <p className="text-[14px] text-left">
              Epidemic related injury accounts for {epidemicPercentage}% of the injuries.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg border-2 max-w-72 h-[300px] w-[386px]">
          <PendingAndCompletedReports />
        </div>
      </div>

      {showTable && (
        <div className="mt-8 text-black w-full">
          <h3 className="text-lg xl:ml-1 font-bold">Related Injury Reports</h3>
          <div className="overflow-x-scroll">
            <table className="w-full bg-white text-black mt-4 rounded-lg text-sm text-nowrap">
              <thead>
                <tr>
                  <th className="px-2 py-2 md:px-8">Injury Type</th>
                  <th className="px-0 py-2 md:px-8">Severity</th>
                  {/* <th className="px-0 py-2 md:px-4">Status</th> */}
                  {/* <th className="px-4 py-2">Location</th> */}
                  <th className="px-0 py-2 md:px-8">Date of Injury</th>
                  {/* <th className="px-4 py-2">Injured Employee</th> */}
                  {/* <th className="px-4 py-2">Report Date</th> */}
                  <th className="px-4 py-2">Reported By</th>
                  <th className="px-2 py-2 md:px-8"></th>
                </tr>
              </thead>
              <tbody className="text-center">
                {selectedInjuryReports.map((report) => (
                  <tr
                    key={report._id}
                    className="border-t border-[#E4E7EC] hover:bg-[#F9FAFB]"
                  >
                    <td className="px-2 py-2 md:px-8 text-left">
                      {injuryTypeMapping[report.injuryTypeID]}
                    </td>
                    <td className="px-0 py-2 md:px-8">
                      <span className={`label label-severity-${report.severity}`}>
                        {severityMapping[report.severity]}
                      </span>
                    </td>
                    {/* <td className="px-0 py-2 md:px-4"><span className={`text-nowrap label ${report.status === "Completed" ? "label-completed" : (report.status === "On going" ? "label-ongoing" : "label-onhold")}`}>{report.status}</span></td> */}
                    {/* <td className="px-4 py-2">{report.locationID}</td> */}
                    <td className="px-0 py-2 md:px-8">
                      {new Date(report.dateOfInjury).toLocaleDateString()}
                    </td>
                    {/* <td className="px-4 py-2">{report.injuredEmployeeFirstName}<br />({report.injuredEmployeeID})</td> */}
                    {/* <td className="px-4 py-2">{new Date(report.reportDate).toLocaleDateString()}</td> */}
                    <td className="px-0 py-2 md:px-4">
                      <Avatar
                        name={report.reportByFirstName}
                        round={true}
                        size="30"
                        textSizeRatio={1.75}
                        data-tooltip-id={`tooltip-${report.reportID}`}
                        data-tooltip-content={`${report.reportByFirstName}`}
                        style={{ cursor: "default" }}
                        color="#05603A"
                      />
                      <ReactTooltip
                        id={`tooltip-${report.reportID}`}
                        place="top"
                        effect="solid"
                      />
                    </td>
                    <td className="px-2 py-2 md:px-8 flex items-center justify-center">
                      <button
                        onClick={() => handleViewDetails(report.reportID)}
                        className="p-1 rounded m-0 border-2 hover:cursor-pointer hover:border-[#4A1FB8] flex items-center gap-1"
                      >
                        <span className="pl-2 text-xs text-gray-700">
                          More Details
                        </span>
                        <img
                          className="min-w-[16px] min-h-[16px]"
                          src="./images/right-arrow.svg"
                          alt="details icon"
                        />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <BackToTopButton />
    </div>
  );
};

export default InjuryAnalytics;
