import React, { Component } from 'react';
import './Sidebar.css';

function Sidebar() {
    return (
      <div>
        <aside className="sidebar">
          <nav className="nav">
            <ul>
              <li className="active"><a href="#">Home</a></li>
              <li><a href="#">Friends</a></li>
              <li><a href="#">Saved</a></li>
              <li><a href="#">Groups</a></li>
              <li><a href="#">Pages</a></li>
            </ul>
          </nav>
        </aside>
      </div>
    );
}

export default Sidebar;
