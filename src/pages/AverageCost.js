import React, { useState, useRef } from 'react';
import Slider from 'react-slick'; // react-slick 라이브러리 import

// react-slick의 필수 CSS 파일들을 불러옵니다.
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

import './AverageCost.css'; // 이 컴포넌트의 스타일 파일 import

// 지역별 데이터 (나중에는 이 부분을 API로 받아오게 됩니다)
const regionData = [
  {
    name: '서울',
    totalCost: '1,280,000원',
    housing: '760,000원',
    food: '360,000원',
    transport: '160,000원',
  },
  {
    name: '경기',
    totalCost: '1,110,000원',
    housing: '650,000원',
    food: '320,000원',
    transport: '140,000원',
  },
  {
    name: '부산',
    totalCost: '980,000원',
    housing: '550,000원',
    food: '300,000원',
    transport: '130,000원',
  },
  {
    name: '대구',
    totalCost: '920,000원',
    housing: '500,000원',
    food: '290,000원',
    transport: '130,000원',
  },
  {
    name: '광주',
    totalCost: '890,000원',
    housing: '480,000원',
    food: '280,000원',
    transport: '130,000원',
  },
  {
    name: '대전',
    totalCost: '910,000원',
    housing: '490,000원',
    food: '290,000원',
    transport: '130,000원',
  },
];

const AverageCost = () => {
  // 현재 활성화된 슬라이드를 추적하는 state (1번 인덱스 '경기'를 기본값으로 설정)
  const [activeSlide, setActiveSlide] = useState(1);
  const sliderRef = useRef(null); // 슬라이더 컴포넌트를 직접 제어하기 위한 ref

  // react-slick 슬라이더 설정
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: '20px', // 양 옆 슬라이드가 살짝 보이도록
    arrows: false, // 기본 화살표 숨김
    initialSlide: 1, // '경기'부터 시작
    beforeChange: (current, next) => setActiveSlide(next), // 슬라이드 변경 시 activeSlide state 업데이트
  };

  // 지역 탭 클릭 시 해당 슬라이드로 이동하는 함수
  const goToSlide = (index) => {
    sliderRef.current.slickGoTo(index);
  };

  return (
    <div className="app-container">
      <div className="phone-frame">
        <header className="app-header">
          <div className="logo-circle">슬</div>
          <h1 className="logo-text">슬림</h1>
          <p className="subtitle">지역별 평균 생활비를 확인해보세요</p>
        </header>

        <main className="content-area">
          <div className="title-section">
            <h2>지역별 청년 평균 생활비</h2>
            <p className="description">← → 슬라이드로 지역별 평균 생활비를 둘러보세요</p>
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
                    <div className="cost-details">
                      <span>주거비</span>
                      <span>{region.housing}</span>
                    </div>
                    <div className="cost-details">
                      <span>식비</span>
                      <span>{region.food}</span>
                    </div>
                    <div className="cost-details">
                      <span>교통비</span>
                      <span>{region.transport}</span>
                    </div>
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

          <button className="cta-button">
            나의 월 생활비 조회
          </button>

          <footer className="footer-text">
            <p>슬라이더로 지역별 평균 생활비를 둘러보세요</p>
            <p>지역 선택은 다음 단계에서 할 수 있습니다</p>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default AverageCost;
