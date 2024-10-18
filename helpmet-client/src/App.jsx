import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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

function App() {
  return (
    <Router>
      <Header />
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/alert" element={<Alert />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/equipmentcheck" element={<Equipmentcheck />} />
          <Route path="/report" element={<Report />} />
          <Route path="/report/:id" element={<ReportDetails />} />
          <Route path="/pending-report" element={<PendingReport />} />
          <Route path="/pending-report/:id" element={<PendingReportDetails />} />
          <Route path="/update-report/:id" element={<UpdateReport />} />
          <Route path="/injury-report" element={<InjuryReport />} />
          <Route element={<PrivateRoute />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>

        </Routes>
      </div>
    </Router>
  );
}

export default App;
