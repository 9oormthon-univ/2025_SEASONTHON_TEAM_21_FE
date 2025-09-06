// src/pages/Comparison.js
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Comparison.css';

const Comparison = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 안전 숫자 변환
  const safeNum = (v) => {
    const s = (v ?? '').toString();
    const only = s.replace(/[^0-9]/g, '');
    return only ? parseInt(only, 10) : 0;
  };

  // 전달받은 데이터
  const state = location.state || {};
  const my = state.myCosts || {};

  // 사용자 값(만원)
  const userFood          = safeNum(my.food);
  const userHousing       = safeNum(my.housing);
  const userEducation     = safeNum(my.education);
  const userTransport     = safeNum(my.transport);
  const userCommunication = safeNum(my.communication);
  const userEntertainment = safeNum(my.entertainment);

  // 지역/소득분위
  const currentRegion = state.selectedRegion || state.selectedBracket || '서울';

  // 평균 데이터 (예시)
  const regionAverages = {
    '서울': { food: 35, housing: 65, education: 18, transport: 12, communication: 10, entertainment: 14 },
    '경기': { food: 32, housing: 55, education: 16, transport: 11, communication: 9,  entertainment: 13 },
    '부산': { food: 28, housing: 40, education: 14, transport: 8,  communication: 8,  entertainment: 12 },
    '대구': { food: 26, housing: 38, education: 13, transport: 7,  communication: 7,  entertainment: 11 },
    '광주': { food: 25, housing: 35, education: 12, transport: 6,  communication: 7,  entertainment: 11 },
    '대전': { food: 27, housing: 42, education: 13, transport: 8,  communication: 8,  entertainment: 12 }
  };
  const avg = regionAverages[currentRegion] || { food: 0, housing: 0, education: 0, transport: 0, communication: 0, entertainment: 0 };

  const goBack = () => navigate('/mycost');
  const goHome = () => navigate('/');

  // 가로바 너비 계산
  const widthPct = (me, avgV) => {
    const maxV = Math.max(me, avgV, 1);
    return Math.min((me / maxV) * 100, 100);
  };

  // 합계
  const totalUserWon =
    (userFood + userHousing + userEducation + userTransport + userCommunication + userEntertainment) * 10000;
  const totalAvgWon =
    (avg.food + avg.housing + avg.education + avg.transport + avg.communication + avg.entertainment) * 10000;

  // ===== 렌더 =====
  return (
    <div className="app-container">
      <div className="phone-frame">
        <header className="app-header">
          <div className="logo-circle">3</div>
          <h1 className="logo-text">쓸림</h1>
          <p className="subtitle">나의 생활비 비교 분석</p>
        </header>

        <main className="content-area">
          <div className="title-section">
            <h2>{currentRegion} 생활비 비교</h2>
            <p className="description">나의 생활비와 소득분위 평균을 항목별로 비교해보세요</p>
          </div>

          <div className="comparison-section">
            {/* 식비 */}
            <ComparisonItem label="식비" myValue={userFood} avgValue={avg.food} widthPct={widthPct} />
            {/* 주거비 */}
            <ComparisonItem label="주거비" myValue={userHousing} avgValue={avg.housing} widthPct={widthPct} />
            {/* 교육비 */}
            <ComparisonItem label="교육비" myValue={userEducation} avgValue={avg.education} widthPct={widthPct} />
            {/* 교통비 */}
            <ComparisonItem label="교통비" myValue={userTransport} avgValue={avg.transport} widthPct={widthPct} />
            {/* 통신비 */}
            <ComparisonItem label="통신비" myValue={userCommunication} avgValue={avg.communication} widthPct={widthPct} />
            {/* 오락·문화비 */}
            <ComparisonItem label="오락·문화비" myValue={userEntertainment} avgValue={avg.entertainment} widthPct={widthPct} />
          </div>

          <div className="summary-section">
            <h3>분석 요약</h3>
            <div className="summary-content">
              <p>
                {currentRegion}에서 나의 총 생활비는 <strong>{totalUserWon.toLocaleString('ko-KR')}원</strong>, 
              </p>
              <p>
              소득분위 평균은{' '}
              <strong>{totalAvgWon.toLocaleString('ko-KR')}원</strong>입니다.
              </p>
              <b>
                {totalUserWon > totalAvgWon
                  ? '소득분위 평균보다 높은 생활비를 사용하고 있습니다.'
                  : '소득분위 평균보다 낮은 생활비를 사용하고 있습니다.'}
              </b>
            </div>
          </div>

          <div className="button-group">
            <button className="back-button" onClick={goBack}>
              다시 입력
            </button>
            <button className="home-button" onClick={goHome}>
              홈으로
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

// 재사용 가능한 비교 아이템 컴포넌트
const ComparisonItem = ({ label, myValue, avgValue, widthPct }) => (
  <div className="comparison-item">
    <div className="category-header">
      <h3>{label}</h3>
      <div className="cost-display">
        <span className={`my-cost ${myValue > avgValue ? 'higher' : 'lower'}`}>{myValue}만원</span>
        <span className="vs">vs</span>
        <span className={`avg-cost ${avgValue > myValue ? 'higher' : 'lower'}`}>{avgValue}만원</span>
      </div>
    </div>
    <div className="comparison-bar">
      <div className="bar-container">
        <div className={`my-bar ${myValue > avgValue ? 'higher' : 'lower'}`} style={{ width: `${widthPct(myValue, avgValue)}%` }}></div>
        <div className={`avg-bar ${avgValue > myValue ? 'higher' : 'lower'}`} style={{ width: `${widthPct(avgValue, myValue)}%` }}></div>
      </div>
      <div className="bar-labels">
        <span>나의 비용</span>
        <span>소득분위 평균</span>
      </div>
    </div>
  </div>
);

export default Comparison;
