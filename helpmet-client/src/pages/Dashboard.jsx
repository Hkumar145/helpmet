import { useEffect, useState } from "react"
import axios from '../api/axios'
import { useSelector } from 'react-redux'
import BarChart from "../components/BarChart"
import { DateTime } from 'luxon';
import MapComponent from "@/components/MapComponent";
import PendingAndCompletedReports from "@/components/PendingAndCompletedReports"

const injuryTypeName = {
    T0001: 'Overexertion',
    T0002: 'Fall from Elevation',
    T0003: 'Struck By',
    T0004: 'Exposure to Toxic Substances',
    T0005: 'Caught In',
    T0006: 'Repetitive Motion',
    T0007: 'Motor Vehicle Incident',
    T0008: 'Industrial and Other Vehicle Accident',
    T0009: 'Contact with Electricity',
    T0010: 'Matter in Eye'
};

const severityName = {
    1: 'Minor',
    2: 'Severe',
    3: 'Moderate',
    4: 'Significant',
    5: 'Fatal'
};

const dayTypeName = {
    Sun: 'Sunday',
    Mon: 'Monday',
    Tue: 'Tuesday',
    Wed: 'Wednesday',
    Thu: 'Thursday',
    Fri: 'Friday',
    Sat: 'Saturday',
};

const Dashboard = () => {
    const username = useSelector((state) => state.user.currentUser?.username);
    const companyID = useSelector((state) => state.user.currentUser?.companyID);
    const [injuryTypeData, setInjuryTypeData] = useState({ labels: [], datasets: [] });
    const [weeklyInjuryData, setWeeklyInjuryData] = useState({ labels: [], datasets: [] });
    const [selectedBar, setSelectedBar] = useState(null);
    const [selectedInjuryReports, setSelectedInjuryReports] = useState([]);
    const [showTable, setShowTable] = useState(false);
    const [changeText, setChangeText] = useState("");
    const [injuryComparisonText, setInjuryComparisonText] = useState("");

    useEffect(() => {
        const fetchInjuryTypeData = async () => {
            try {
                const response = await axios.get(`/injury-type-stats?companyID=${companyID}`);
                const data = response.data;
                const sortedData = [...data].sort((a, b) => b.count - a.count);

                const labels = sortedData.map(item => item._id);
                const counts = sortedData.map(item => item.count);

                setInjuryTypeData({
                    labels: labels,
                    datasets: [
                        {
                            label: 'Number of Injuries',
                            data: counts,
                            backgroundColor: 'rgba(233, 236, 241)',
                            hoverBackgroundColor: 'rgba(105, 56, 239)',
                            borderRadius: 4,
                        }
                    ]
                });
            } catch (error) {
                console.error("Error fetching injury stats:", error);
            }
        };

        const fetchWeeklyInjuryData = async () => {
            try {
                const response = await axios.get(`/weekly-injury-stats?companyID=${companyID}`);
                const data = response.data;
        
                const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
                const currentWeekCounts = Array(7).fill(0);
        
                data.forEach(item => {
                    const dayOfWeek = item._id - 1;
                    if (dayOfWeek >= 0 && dayOfWeek <= 6) {
                        currentWeekCounts[dayOfWeek] = item.count;
                    }
                });
        
                setWeeklyInjuryData({
                    labels: daysOfWeek,
                    datasets: [
                        {
                            label: 'Injuries This Week',
                            data: currentWeekCounts,
                            backgroundColor: 'rgba(233, 236, 241)',
                            hoverBackgroundColor: 'rgba(105, 56, 239)',
                            borderRadius: 4,
                        }
                    ]
                });

                const previousWeekResponse = await axios.get(`/previous-weekly-injury-stats?companyID=${companyID}`);
                const previousWeekData = previousWeekResponse.data;
                // console.log("Previous Week Start Date:", DateTime.now().startOf('week').minus({ days: 7 }).toISODate());
                // console.log("Previous Week End Date:", DateTime.now().endOf('week').minus({ days: 7 }).toISODate());
                // console.log("This Week Start Date:", DateTime.now().startOf('week').minus({ days: 1 }).toJSDate());
                // console.log("This Week End Date:", DateTime.now().endOf('week').toJSDate());
                // console.log(previousWeekData);

                const previousWeekCountsTotal = previousWeekData.reduce((acc, item) => acc + item.count, 0);

                const currentWeekCountsTotal = currentWeekCounts.reduce((acc, count) => acc + count, 0);

                const change = previousWeekCountsTotal === 0
                    ? (currentWeekCountsTotal === 0 ? 0 : 100)    // if previousWeekCountsTotal and currentWeekCountsTotal are zero
                    : ((currentWeekCountsTotal - previousWeekCountsTotal) / previousWeekCountsTotal) * 100;

                setChangeText(`${Math.abs(change).toFixed(0)}%`);

                if (change < 0) {
                    setInjuryComparisonText(`Injuries have been reduced by ${Math.abs(change).toFixed(0)}% compared to last week.`);
                } else {
                    setInjuryComparisonText(`Injuries have increased by ${Math.abs(change).toFixed(0)}% compared to last week.`);
                }

            } catch (error) {
                console.error("Error fetching weekly injury stats:", error);
            }
        };

        fetchInjuryTypeData();
        fetchWeeklyInjuryData();
    }, []);

    const handleInjuryTypeBarClick = async (barLabel) => {
        let queryParam = 'injuryTypeID';
        let value = barLabel;

        setSelectedBar(barLabel);

        try {
            const response = await axios.get(`/companies/${companyID}/reports?${queryParam}=${value}`);
            setSelectedInjuryReports(response.data);
            setShowTable(true);
        } catch (error) {
            console.error("Error fetching reports:", error);
        }
    };

    const handleWeeklyInjuryBarClick = async (dayLabel) => {
        setSelectedBar(dayLabel);
    
        const today = DateTime.now();
        const startOfWeek = today.startOf('week').plus({ days: 1 });
        const dayOfWeekIndex = weeklyInjuryData.labels.indexOf(dayLabel);
        // Adjust by subtracting 2 days to account for the offset
        const selectedDate = startOfWeek.plus({ days: dayOfWeekIndex }).minus({ days: 2 });    // const selectedDate = startOfWeek.plus({ days: dayOfWeekIndex });
    
        const queryDate = selectedDate.toISODate();
    
        try {
            const response = await axios.get(`/companies/${companyID}/reports?dateOfInjury=${queryDate}`);
            setSelectedInjuryReports(response.data);
            setShowTable(true);
        } catch (error) {
            console.error("Error fetching reports:", error);
        }
    };

    const filteredInjuryTypeData = {
        ...injuryTypeData,
        datasets: [
            {
                ...injuryTypeData.datasets[0],
                backgroundColor: injuryTypeData.labels.map(label =>
                    label === selectedBar ? 'rgba(105, 56, 239)' : 'rgba(233, 236, 241)'
                ),
            }
        ]
    };

    const filteredWeeklyInjuryData = {
        ...weeklyInjuryData,
        datasets: [
            {
                ...weeklyInjuryData.datasets[0],
                backgroundColor: weeklyInjuryData.labels.map(label =>
                    label === selectedBar ? 'rgba(105, 56, 239)' : 'rgba(233, 236, 241)'
                ),
            }
        ]
    };

  return (
    <>
        <div className="flex flex-col text-white gap-12 items-center justify-start">
            <p>Hi, {username}!</p>
            <div className="flex flex-row gap-20">
                <div className="max-w-min">
                    <BarChart
                        chartData={filteredInjuryTypeData}
                        barName={injuryTypeName}
                        title="Injury Category Projection"
                        onBarClick={handleInjuryTypeBarClick}
                        className="items-center justify-center mx-auto"
                        indexAxis="y"
                    />
                </div>
                <div className="max-w-min">
                    <BarChart
                        chartData={filteredWeeklyInjuryData}
                        barName={dayTypeName}
                        title="General Weekly Overview"
                        onBarClick={handleWeeklyInjuryBarClick}
                        indexAxis="x"
                    />
                    <div className="flex flex-row items-center justify-center my-3 gap-2 max-w-[90%] mx-auto">
                        <p className="text-emerald-400">{changeText}</p>
                        <p className="text-[14px] text-center">{injuryComparisonText}</p>
                    </div>
                    <MapComponent/>
                    <PendingAndCompletedReports/>
                    
                </div>
                <div>
                    
                </div>
            </div>
        </div>
        {showTable && (
            <div className="mt-8 text-white">
                <h3 className="text-lg font-bold">Related Injury Reports</h3>
                <table className="min-w-full bg-gray-800 text-white mt-4 rounded-lg">
                    <thead>
                        <tr>
                            <th className="px-4 py-2">Injury Type</th>
                            <th className="px-4 py-2">Severity</th>
                            <th className="px-4 py-2">Location</th>
                            <th className="px-4 py-2">Date of Injury</th>
                            <th className="px-4 py-2">Injured Employee</th>
                            <th className="px-4 py-2">Report Date</th>
                            <th className="px-4 py-2">Reported By</th>
                        </tr>
                    </thead>
                    <tbody className='text-center'>
                        {selectedInjuryReports.map(report => (
                            <tr key={report._id} className="border-t border-gray-700">
                                <td className="px-4 py-2">{injuryTypeName[report.injuryTypeID]}</td>
                                <td className="px-4 py-2">{severityName[report.severity]}</td>
                                <td className="px-4 py-2">{report.locationID}</td>
                                <td className="px-4 py-2">{new Date(report.dateOfInjury).toLocaleDateString()}</td>
                                <td className="px-4 py-2">{report.reportByFirstName}<br />({report.reportBy})</td>
                                <td className="px-4 py-2">{new Date(report.reportDate).toLocaleDateString()}</td>
                                <td className="px-4 py-2">{report.injuredEmployeeFirstName}<br />({report.injuredEmployeeID})</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
    </>
  );
};

export default Dashboard;
