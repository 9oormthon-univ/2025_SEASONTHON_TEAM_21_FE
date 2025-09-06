// src/pages/AverageCost.js
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import logo from '../assets/logo.png';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './AverageCost.css';
import { fetchAverageCosts } from '../api/averageCostService';

const AverageCost = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [regionData, setRegionData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const sliderRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();
    let isMounted = true; // 취소/언마운트 시 setState 방지

    (async () => {
      try {
        if (!isMounted) return;
        setLoading(true);
        setError('');

        // averageCostService를 통해 데이터 가져오기
        const data = await fetchAverageCosts(controller.signal);
        if (!isMounted) return;

        // 원 단위 데이터를 포맷팅
        const fmt = (v) => `${Number(v || 0).toLocaleString('ko-KR')}원`;
        const formattedData = (Array.isArray(data) ? data : []).map((item) => ({
          name: item.name,
          totalCost: fmt(item.totalCost),
          food: fmt(item.food),
          housing: fmt(item.housing),
          education: fmt(item.education),
          transport: fmt(item.transport),
          communication: fmt(item.communication),
          entertainment: fmt(item.entertainment),
        }));

        setRegionData(formattedData);
      } catch (e) {
        // ✅ 취소된 요청은 조용히 무시
        if (
          e?.name === 'AbortError' ||
          e?.name === 'CanceledError' ||
          e?.code === 'ERR_CANCELED' ||
          e?.message === 'canceled'
        ) {
          return;
        }
        console.error('AverageCost 데이터 로드 실패:', e);
        if (isMounted) setError('데이터를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.');
      } finally {
        if (isMounted) setLoading(false);
      }
    })();

    // 컴포넌트 언마운트 시 요청 취소
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: '20px',
    arrows: false,
    beforeChange: (current, next) => setActiveSlide(next),
  };

  const goToSlide = (index) => sliderRef.current?.slickGoTo(index);
  const handleMyCostClick = () => navigate('/mycost');

  return (
    <div className="app-container">
      <div className="phone-frame">
        <header className="app-header">
          <img src={logo} alt="로고" className="logo-circle" />
          <h1 className="logo-text">쓸림</h1>
          <p className="subtitle">소득분위별 평균 생활비를 확인해보세요</p>
        </header>

        <main className="content-area">
          <div className="title-section">
            <h2>소득분위별 청년 평균 생활비</h2>
            <p className="description">← → 슬라이드로 소득분위별 평균 생활비를 둘러보세요</p>
          </div>

          {loading && (
            <div className="loading-section">
              <div className="loading-spinner"></div>
              <p>소득분위별 평균 생활비를 불러오는 중...</p>
            </div>
          )}

          {error && !loading && (
            <div className="error-section">
              <div className="error-icon">⚠️</div>
              <p className="error-message">{error}</p>
              <button
                className="retry-button"
                onClick={() => window.location.reload()}
              >
                다시 시도
              </button>
            </div>
          )}

          {!loading && !error && (
            <>
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
            </>
          )}

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
