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
import CreateReport from './pages/CreateReport';
import Report from './pages/Report';

function App() {
  return (
    <Router>
      <Header />
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/report" element={<Report />} />
          <Route element={<PrivateRoute />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/dashboard" element={<Dashboard />} />
            {/* <Route path="/create-report" element={<CreateReport />} /> */}
          </Route>
          <Route path="/create-report" element={<CreateReport />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
