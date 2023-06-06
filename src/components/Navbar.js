// navbar
import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
// import { logout } from '../actions/currentUser.js';

const Navbar = ({ currentUser, logout }) => {
  return (
    <div className="navbar">
      <Link to="/home">Home</Link>
      <Link to="/game">Game</Link>
      <Link to="/messaging">Messaging</Link>
      <Link to="/matching">Matching</Link>
      <Link to="/login">Login</Link>
      <Link to="/signup">Sign Up</Link>
      <Link to="/logout" onClick={logout}>Logout</Link>
      
      {/* <Link to="/home">Home</Link>
      <Link to="/game">Game</Link>
      <Link to="/messaging">Messaging</Link>
      <Link to="/matching">Matching</Link>
      <Link to="/login">Login</Link>
      <Link to="/signup">Sign Up</Link>
      <Link to="/logout" onClick={logout}>Logout</Link>
      { currentUser ? `Welcome, ${currentUser.attributes.name}` : "" } */}
    </div>
  );
}
export default Navbar;

// export default connect(null, { logout })(Navbar);