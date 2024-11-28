import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Signup from './pages/signup';
import Login from './pages/login';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import Header from './components/Header'
import PrivateRoute from './components/PrivateRoute';
import Equipmentcheck from'./pages/Equipmentcheck.jsx';
import Report from './pages/Report';
import ReportDetails from './pages/ReportDetails';
import InjuryReport from './pages/InjuryReport';
import PendingReport from './pages/PendingReport';
import PendingReportDetails from './pages/PendingReportDetails';
import UpdateReport from './pages/UpdateReport';
import Alert from './pages/Alert'
import Analytics from './pages/Analytics'
import InjuryAnalytics from './pages/InjuryAnalytics';
import Setting from './pages/Setting';
import Employee from './pages/Employee';
import Department from './pages/Department';
import Location from './pages/Location';
import HeaderWithoutLogin from './components/HeaderWithoutLogin';
import ForgotPassword from './pages/ForgotPassword';
import EditAlertIndex from './components/EditAlertIndex';

const HeaderWrapper = () => {
  const location = useLocation();
  
  return (
    /^\/(injury-report|update-report)/.test(location.pathname) ? <HeaderWithoutLogin /> : <Header />
  );
};

function App() {
  return (
    <Router>
      <HeaderWrapper />
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/injury-report" element={<InjuryReport />} />
          <Route path="/update-report/:id" element={<UpdateReport />} />

          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/alert" element={<Alert />} />
            <Route path="/alert/:alertId/:type/edit" element={<EditAlertIndex />}/>
            <Route path="/equipmentcheck" element={<Equipmentcheck />} />
            <Route path="/report" element={<Report />} />
            <Route path="/report/:id" element={<ReportDetails />} />
            <Route path="/pending-report" element={<PendingReport />} />
            <Route path="/pending-report/:id" element={<PendingReportDetails />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/injury-analytics" element={<InjuryAnalytics />} />

            <Route path="/setting" element={<Setting />} />
            <Route path="/setting-employee" element={<Employee />} />
            <Route path="/setting-department" element={<Department />} />
            <Route path="/setting-location" element={<Location />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Routes>
      </div>
      {/* <Footer /> */}
    </Router>
  );
}

export default App;
