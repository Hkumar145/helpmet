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
import InjuryReport from './pages/InjuryReport';
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
          <Route path="/injury-report" element={<InjuryReport />} />
          <Route element={<PrivateRoute />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/dashboard" element={<Dashboard />} />
            {/* <Route path="/report" element={<Report />} /> */}
          </Route>

        </Routes>
      </div>
    </Router>
  );
}

export default App;
