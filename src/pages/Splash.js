// src/pages/Splash.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Splash.css';
import logo from '../assets/logo-splash.png';

const Splash = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/home'); // 3초 후 이동
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="splash-container">
      <div className="splash-phone-frame">
        <div className="splash-logo-container">
          <div className="splash-logo-circle">
            {/* ✅ CSS 아이콘 대신 로고 이미지 삽입 */}
            <img src={logo} alt="로고" className="splash-logo-img" />
          </div>
          <h1 className="splash-logo-text">쓸림</h1>
        </div>
      </div>
    </div>
  );
};

export default Splash;
