import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // We'll add some basic styling in the next step

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <h2>Calmanaut</h2>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/resources">Resources</Link></li>
        <li><Link to="/progress">Progress Tracker</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
