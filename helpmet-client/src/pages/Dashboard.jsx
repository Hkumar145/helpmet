import { useEffect, useState } from "react"
import axios from '../api/axios'
import { useSelector } from 'react-redux'
import BarChart from "../components/BarChart"

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
                const counts = Array(7).fill(0);
        
                data.forEach(item => {
                    const dayOfWeek = item._id - 1;
                    if (dayOfWeek >= 0 && dayOfWeek <= 6) {
                        counts[dayOfWeek] = item.count;
                    }
                });
        
                setWeeklyInjuryData({
                    labels: daysOfWeek,
                    datasets: [
                        {
                            label: 'Injuries This Week',
                            data: counts,
                            backgroundColor: 'rgba(233, 236, 241)',
                            hoverBackgroundColor: 'rgba(105, 56, 239)',
                            borderRadius: 4,
                        }
                    ]
                });
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

  return (
    <div className="flex flex-col text-white gap-12 items-center">
        <p>Hi, {username}!</p>
        <div className="flex flex-row gap-6">
            <div className="max-w-min">
                <BarChart
                    chartData={filteredInjuryTypeData}
                    barName={injuryTypeName}
                    title="Injury Category Projection"
                    onBarClick={handleInjuryTypeBarClick}
                    className="items-center justify-center mx-auto"
                />
                <div className="flex flex-row items-center justify-center my-3 gap-2 max-w-[90%] mx-auto">
                    <p className="text-emerald-400">30%</p>
                    <p className="text-[14px] text-center">Injuries have been reduced by 30% compared to last week</p>
                </div>
            </div>
            <div>
                <BarChart
                    chartData={weeklyInjuryData}
                    barName={dayTypeName}
                    title="General Weekly Overview"
                    onBarClick={handleInjuryTypeBarClick} //handleWeeklyInjuryBarClick
                />
            </div>
        </div>
        {showTable && (
                <div className="mt-8">
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
                        <tbody>
                            {selectedInjuryReports.map(report => (
                                <tr key={report._id} className="border-t border-gray-700">
                                    <td className="px-4 py-2">{injuryTypeName[report.injuryTypeID]}</td>
                                    <td className="px-4 py-2">{severityName[report.severity]}</td>
                                    <td className="px-4 py-2">{report.locationID}</td>
                                    <td className="px-4 py-2">{new Date(report.dateOfInjury).toLocaleDateString()}</td>
                                    <td className="px-4 py-2">{report.injuredEmployeeID}</td>
                                    <td className="px-4 py-2">{new Date(report.reportDate).toLocaleDateString()}</td>
                                    <td className="px-4 py-2">{report.reportBy}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
    </div>
  );
};

export default Dashboard;
