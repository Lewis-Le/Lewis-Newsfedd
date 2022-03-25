import React, { Component } from 'react';
import { render } from '@testing-library/react';
import './Navbarall.css';

function Navbarall() {
    return (
      <div>
        <nav className="menu">
          <input className="menu__toggle" id="menu-toggle" type="checkbox"/>
          <label className="menu__toggle-label" for="menu-toggle"></label>
          <label className="menu__toggle-label menu__toggle-label--closer" for="menu-toggle">
            <svg className="menu__icon" preserveAspectRatio="xMinYMin" viewBox="0 0 24 24">
              <path d="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z"></path>
            </svg>
            <svg className="menu__icon" preserveAspectRatio="xMinYMin" viewBox="0 0 24 24">
              <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"></path>
            </svg>
          </label>
          <ul className="menu__content">
            <li className="menu__item" style={{x: 25, y: 20}}><a className="menu__link" href="/">LEWIS NEWSFEED</a></li>
            <li className="menu__item" style={{x: 75, y: 25}}><a className="menu__link" href="http://lewischannel.herokuapp.com/">LEWIS CHANNEL</a></li>
            <li className="menu__item" style={{x: 28, y: 64}}><a className="menu__link" href="#">JOBS</a></li>
            <li className="menu__item" style={{x: 68, y: 74}}><a className="menu__link" href="#">CONTEST</a></li>
            <li className="menu__item" style={{x: 55, y: 60}}><a className="menu__link" href="#">EVENT</a></li>
            <li className="menu__item" style={{x: 68, y: 74}}><a className="menu__link" href="#">MARKET</a></li>
            <li className="menu__item" style={{x: 68, y: 74}}><a className="menu__link" href="#">NEWS</a></li>
          </ul>
        </nav>
        <svg style={{position: "absolute", left: "50%"}}>
          <defs>
            <filter id="goo">
              <feGaussianBlur in="SourceGraphic" stdDeviation="15" result="BLUR"></feGaussianBlur>
              <feColorMatrix in="BLUR" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="GOO"></feColorMatrix>
              <feBlend in="SourceGraphic" in2="goo"></feBlend>
            </filter>
          </defs>
        </svg>
      </div>
    );
}

export default Navbarall;
