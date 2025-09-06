import React from 'react';
import logo from './assets/logo.png'; // 이미지 불러오기
import './Navbar.css'; // 스타일링을 위해 CSS 따로 연결

function Navbar() {
  return (
    <div className="navbar">
      <img src={logo} alt="로고" className="logo" />
      <h1 className="title">쓸림 로고고</h1>
    </div>
  );
}

export default Navbar;
