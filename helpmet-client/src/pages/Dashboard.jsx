import { useEffect, useState } from "react"
import { useNavigate } from 'react-router-dom'
import axios from '../api/axios'
import { useSelector } from 'react-redux'
import BarChart from "../components/BarChart"
import LineChart from "../components/LineChart"
import { DateTime } from 'luxon';
import MapComponent from '@/components/MapComponent';
import PendingAndCompletedReports from "@/components/PendingAndCompletedReports"
import ReportsByLocation from "@/components/ReportsByLocation"
import BackToTopButton from '../components/BackToTopButton';
import EquipmentStatusPieChart from "@/components/EquipmentStatusPieChart"
import SiteAgentTable from "@/components/SiteAgentTable"
import Loader from "../components/Loader"

const injuryTypeMapping = {
    T0001: 'Overexertion',
    T0002: 'Fall from Elevation',
    T0003: 'Struck By',
    T0004: 'Exposure to Toxic Substances',
    T0005: 'Caught In',
    T0006: 'Epidemic Related',
    T0007: 'Motor Vehicle Incident',
    T0008: 'Industrial and Other Vehicle Accident',
    T0009: 'Contact with Electricity',
    T0010: 'Matter in Eye'
};

const severityMapping = {
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
    const [selectedBar, setSelectedBar] = useState('T0006');
    const [selectedInjuryReports, setSelectedInjuryReports] = useState([]);
    const [showTable, setShowTable] = useState(false);
    const [changeText, setChangeText] = useState("");
    const [injuryComparisonText, setInjuryComparisonText] = useState("");
    const [monthlyEpidemicData, setMonthlyEpidemicData] = useState({ labels: [], datasets: [] });
    const [severityData, setSeverityData] = useState(null);
    const [filterBy, setFilterBy] = useState(null);
    const [currentFilterValue, setCurrentFilterValue] = useState(null);
    const navigate = useNavigate();
    const [epidemicPercentage, setEpidemicPercentage] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMonthlyEpidemicData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`/monthly-epidemic-data?companyID=${companyID}`);
                const sortedData = response.data;
                const labels = sortedData.map(item => item._id);
                const counts = sortedData.map(item => item.count);
    
                setMonthlyEpidemicData({
                    labels,
                    datasets: [
                        {
                            label: 'Epidemic Injury Type',
                            data: counts,
                            backgroundColor: '#F4F3FF',
                            hoverBackgroundColor: 'rgba(105, 56, 239)',
                            
                            tension: 0.6,
                            fill: true,
                            borderRadius: 4,
                        },
                    ],
                });
            } catch (error) {
                console.error('Error fetching monthly epidemic data:', error);
            } finally {
                setLoading(false);
            }
        };
    
        fetchMonthlyEpidemicData();
    }, [companyID]); 
    

    useEffect(() => {
        const fetchInjuryTypeData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`/injury-type-stats?companyID=${companyID}`);
                const data = response.data;
                const sortedData = [...data].sort((a, b) => b.count - a.count);

                const labels = sortedData.map(item => item._id);
                const counts = sortedData.map(item => item.count);

                const totalInjuries = counts.reduce((acc, count) => acc + count, 0);

                const epidemicData = sortedData.find(item => item._id === "T0006");
                const epidemicCount = epidemicData ? epidemicData.count : 0;
                const epidemicPercentage = Math.round((epidemicCount / totalInjuries) * 100);

                setEpidemicPercentage(epidemicPercentage);

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
            } finally {
                setLoading(false);
            }
        };

        const fetchWeeklyInjuryData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`/weekly-injury-stats?companyID=${companyID}`);
                const data = response.data;
        
                const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
                const currentWeekCounts = Array(7).fill(0);
        
                data.forEach(item => {
                    const dayOfWeekIndex = item._id - 1;
                    currentWeekCounts[dayOfWeekIndex] = item.count;
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
            } finally {
                setLoading(false);
            }
        };

        fetchInjuryTypeData();
        fetchWeeklyInjuryData();
    }, []);

    const handleDateClick = async (dateLabel) => {
        try {
            setFilterBy("date");
            setCurrentFilterValue(dateLabel);

            const response = await axios.get(`/companies/${companyID}/reports`, {
                params: { dateOfInjury: dateLabel }
            });

            setSelectedInjuryReports(response.data);
            fetchSeverityData(null, dateLabel);
        } catch (error) {
            console.error('Error fetching reports:', error);
        }
    };


    const handleInjuryTypeBarClick = async (barLabel) => {
        let queryParam = 'injuryTypeID';
        let value = barLabel;
        setSelectedBar(barLabel);
        try {
            setFilterBy("injuryType");
            setCurrentFilterValue(barLabel);
            const response = await axios.get(`/companies/${companyID}/reports?${queryParam}=${value}`);

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
        setLoading(true);
        try {
            const params = {};
            if (injuryTypeID) params.injuryTypeID = injuryTypeID;
            if (dateOfInjury) params.dateOfInjury = dateOfInjury;
    
            const response = await axios.get(`/companies/${companyID}/reports`, { params });
            const severityCounts = [0, 0, 0]; // High, Medium, Low
    
            response.data.forEach(report => {
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
                        backgroundColor: ['#3E1C96', '#6938EF', '#9B8AFB'],
                        hoverBackgroundColor: ['#3E1C96', '#6938EF', '#9B8AFB'],
                        borderRadius: 4,
                    },
                ],
            });
        } catch (error) {
            console.error("Error fetching severity data:", error);
        } finally {
            setLoading(false);
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
                backgroundColor: injuryTypeData.labels.map(label =>
                    label === selectedBar ? 'rgba(105, 56, 239)' : 'rgba(152, 162, 179)'
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
                    label === selectedBar ? 'rgba(105, 56, 239)' : 'rgba(152, 162, 179)'
                ),
            }
        ]
    };

    const handleViewDetails = (reportID) => {
        navigate(`/report/${reportID}`);
    };

    const handleViewCompletedReports = () => {
        navigate(`/report`);
    };

    // const handleSeverityBarClick = async (severityLevel) => {
    //     try {
    //         const params = { severity: severityLevel };
 
    //         if (filterBy === "injuryType") {
    //             params.injuryTypeID = currentFilterValue;
    //         } else if (filterBy === "date") {
    //             params.dateOfInjury = currentFilterValue;
    //         }
    //         const response = await axios.get(`/companies/${companyID}/reports`, { params });
    //         setSelectedInjuryReports(response.data);
    //         setShowTable(true);
    //     } catch (error) {
    //         console.error('Error fetching reports:', error);
    //     }
    // };

    // default select T0006 when the page is loaded
    useEffect(() => {
        if (selectedBar === 'T0006') {
            fetchSeverityData();
        }
    }, [selectedBar]);
    
  return (
    <div className="w-full px-4 lg:px-7 max-w-[2700px]">
        {loading ? (
        <div className="flex justify-center items-center h-[400px]">
          <Loader />
        </div>
      ) : injuryTypeData.labels.length > 0 ? (
        <div className="flex flex-col text-black gap-12 items-center justify-start">
            {/* <p>Hi, {username}!</p> */}
            <div className="flex flex-col flex-wrap md:flex-row gap-4 items-center justify-center w-full mx-auto">
            {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-center w-full max-w-6xl mx-auto"> */}

                {/* Update */}

    {/* 1 */}   <div className="bg-white rounded-lg border shadow-md max-w-72 flex flex-col items-center h-[280px] w-[384px]">
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

    {/* 2 */}   <div className="bg-white rounded-lg border shadow-md max-w-72 h-[280px] w-[384px]">
                    <BarChart
                        chartData={filteredInjuryTypeData}
                        barName={injuryTypeMapping}
                        title="Injury Category Projection"
                        onBarClick={handleInjuryTypeBarClick}
                        indexAxis="y"
                    />
                    <div className="flex flex-row items-center justify-center gap-2 w-full p-2">
                        <button
                            className="bg-[#6938EF] w-32 text-white font-bold hover:bg-[#D9D6FE] hover:text-[#6938EF] text-xs px-4 py-2 rounded my-2"
                            onClick={() => navigate('/injury-analytics')}
                        >
                            Details
                        </button>
                    </div>
                </div>

    {/* 3 */}   <div className="bg-white rounded-lg border shadow-md h-[280px] w-[384px] md:w-[790px] 2xl:w-[770px]">
                    <p className="text-center w-full text-sm font-bold mt-4">Injury Heat Map</p>
                    <MapComponent/>
                </div>

    {/* 4 */}   <div className="bg-white rounded-lg border shadow-md max-w-72 h-[280px] w-[384px]">
                    <LineChart
                        chartData={monthlyEpidemicData}
                        lineName={{ T0006: "Epidemic Injury Type" }}
                        title="Epidemic Projection (Nov)"
                        onLineClick={handleDateClick}
                        indexAxis="x"
                    />
                    <div className="flex flex-row items-center justify-center my-3 gap-2 max-w-[100%] ml-8 mr-6">
                        <p className="text-[#039855]">{epidemicPercentage}%</p>
                        <p className="text-[14px] text-left">
                            Epidemic related injury accounts for {epidemicPercentage}% of the injuries.
                        </p>
                    </div>
                </div>

    {/* 5 */}   <div className="bg-white rounded-lg border shadow-md max-w-72 h-[280px] w-[384px]">
                    {severityData && (
                        <div className="max-w-min">
                            <BarChart
                                chartData={severityData}
                                // onBarClick={handleSeverityBarClick}
                                barName={{ 1: "Low Severity", 3: "Medium Severity", 5: "High Severity" }}
                                title="Injury Projection"
                                indexAxis="y"
                            />
                            <div className="flex flex-col items-center justify-center my-1 max-w-[90%] mx-auto text-[13px]">
                                <p className="text-left w-full dot-before dot-hs">High Severity</p>
                                <p className="text-left w-full dot-before dot-ms">Medium Severity</p>
                                <p className="text-left w-full dot-before dot-ls">Low Severity</p>
                            </div>
                        </div>
                    )}
                </div>

    {/* 6 */}   <div className="bg-white rounded-lg border shadow-md max-w-72">
                    <PendingAndCompletedReports/>
                </div>
    

    {/* 7 */}   <div className="bg-white rounded-lg border shadow-md max-w-72">
                    <EquipmentStatusPieChart companyID={companyID} />
                </div>

    {/* 8 */}   <div className="bg-white rounded-lg border shadow-md h-auto w-[384px] md:w-[770px] 2xl:w-[1580px]">
                    <SiteAgentTable/>
                </div>
            </div>
        </div>
        ) : (
            <div className='text-center mt-6 bg-white rounded-lg py-[120px] px-3'>
                <p className='font-bold'>No Report Available</p>
                <p className='text-sm text-gray-500'>Start by creating the first incident report</p>
                <button
                    className="bg-[#6938EF] text-white font-bold hover:bg-[#D9D6FE] hover:text-[#6938EF] text-xs px-4 py-2 rounded my-4"
                    onClick={handleViewCompletedReports}
                >
                    Get Started
                </button>
            </div>
        )}
        
        <BackToTopButton />
    </div>
  );
};

export default Dashboard;
