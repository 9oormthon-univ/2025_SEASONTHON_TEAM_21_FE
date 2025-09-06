import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';

// react-slick의 필수 CSS
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

import './AverageCost.css';

// 소득구간 별 생활비 데이터 (5개 항목)
const regionData = [
  {
    name: '1분위',
    totalCost: '1,800,000원',
    food: '400,000원',
    housing: '700,000원',
    education: '200,000원',
    transport: '160,000원',
    communication: '140,000원',
    entertainment: '200,000원',
  },
  {
    name: '2분위',
    totalCost: '1,650,000원',
    food: '370,000원',
    housing: '600,000원',
    education: '180,000원',
    transport: '150,000원',
    communication: '130,000원',
    entertainment: '220,000원',
  },
  {
    name: '3분위',
    totalCost: '1,450,000원',
    food: '350,000원',
    housing: '550,000원',
    education: '150,000원',
    transport: '140,000원',
    communication: '120,000원',
    entertainment: '140,000원',
  },
  {
    name: '4분위',
    totalCost: '1,400,000원',
    food: '340,000원',
    housing: '500,000원',
    education: '150,000원',
    transport: '130,000원',
    communication: '120,000원',
    entertainment: '160,000원',
  },
  {
    name: '5분위',
    totalCost: '1,300,000원',
    food: '320,000원',
    housing: '450,000원',
    education: '140,000원',
    transport: '120,000원',
    communication: '110,000원',
    entertainment: '160,000원',
  },
];

const AverageCost = () => {
  const [activeSlide, setActiveSlide] = useState(4);
  const sliderRef = useRef(null);
  const navigate = useNavigate();

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: '20px',
    arrows: false,
    initialSlide: 4,
    beforeChange: (current, next) => setActiveSlide(next),
  };

  const goToSlide = (index) => {
    sliderRef.current.slickGoTo(index);
  };

  const handleMyCostClick = () => {
    navigate('/mycost');
  };

  return (
    <div className="app-container">
      <div className="phone-frame">
        <header className="app-header">
          <div className="logo-circle">3</div>
          <h1 className="logo-text">쓸림</h1>
          <p className="subtitle">소득분위별 평균 생활비를 확인해보세요</p>
        </header>

        <main className="content-area">
          <div className="title-section">
            <h2>소득분위별 청년 평균 생활비</h2>
            <p className="description">← → 슬라이드로 소득분위별 평균 생활비를 둘러보세요</p>
          </div>
          
          <div className="slider-wrapper">
            <Slider ref={sliderRef} {...settings}>
              {regionData.map((region, index) => (
                <div key={index} className="slide-card-wrapper">
                  <div className="slide-card">
                    <h3>{region.name}</h3>
                    <div className="cost-total">
                      <span>총 생활비</span>
                      <p>{region.totalCost}</p>
                    </div>
                    <div className="cost-details"><span>식비</span><span>{region.food}</span></div>
                    <div className="cost-details"><span>주거비</span><span>{region.housing}</span></div>
                    <div className="cost-details"><span>교육비</span><span>{region.education}</span></div>
                    <div className="cost-details"><span>교통비</span><span>{region.transport}</span></div>
                    <div className="cost-details"><span>통신비</span><span>{region.communication}</span></div>
                    <div className="cost-details"><span>오락·문화비</span><span>{region.entertainment}</span></div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>

          <nav className="region-nav">
            {regionData.map((region, index) => (
              <button
                key={index}
                className={`region-tab ${activeSlide === index ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
              >
                {region.name}
              </button>
            ))}
          </nav>

          <button className="cta-button" onClick={handleMyCostClick}>
            나의 월 생활비 조회
          </button>

          <footer className="footer-text">
            <p>나의 월 생활비를 조회해보세요</p>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default AverageCost;
