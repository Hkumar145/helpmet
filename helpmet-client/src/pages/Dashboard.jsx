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

  return (
    <div className="flex flex-col text-white gap-12">
        <p>Hi, {username}!</p>
        <div>
            <BarChart chartData={injuryTypeData} barName={injuryTypeName} title="Injury Category Projection" />
            <div className="flex flex-row items-center justify-center my-3 gap-2 max-w-[60%] mx-auto">
                <p className="text-emerald-400">30%</p>
                <p className="text-[14px] text-center">Injuries have been reduced by 30% compared to last week</p>
            </div>
        </div>
        <div>
            <BarChart chartData={weeklyInjuryData} barName={dayTypeName} title="General Weekly Overview" />
        </div>
    </div>
  );
};

export default Dashboard;
