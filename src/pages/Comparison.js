import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Comparison.css';

const Comparison = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // MyCost 페이지에서 전달받은 데이터 (실제로는 props나 state로 받아야 함)
  const userData = location.state || {
    selectedRegion: '광주',
    myCosts: {
      housing: '45만원',
      food: '280만원',
      transport: '90만원',
      other: '120만원'
    }
  };

  // 지역별 평균 생활비 데이터 (실제로는 API에서 받아와야 함)
  const regionAverages = {
    '서울': { housing: 65, food: 35, transport: 12, other: 20 },
    '경기': { housing: 55, food: 32, transport: 11, other: 18 },
    '부산': { housing: 40, food: 28, transport: 8, other: 15 },
    '대구': { housing: 38, food: 26, transport: 7, other: 14 },
    '광주': { housing: 35, food: 25, transport: 6, other: 13 },
    '대전': { housing: 42, food: 27, transport: 8, other: 16 }
  };

  const currentRegion = userData.selectedRegion;
  const averageData = regionAverages[currentRegion] || { housing: 0, food: 0, transport: 0, other: 0 };

  // 사용자 입력값에서 숫자만 추출
  const getUserCost = (costString) => {
    return parseInt(costString.replace(/[^0-9]/g, '')) || 0;
  };

  const userHousing = getUserCost(userData.myCosts.housing);
  const userFood = getUserCost(userData.myCosts.food);
  const userTransport = getUserCost(userData.myCosts.transport);
  const userOther = getUserCost(userData.myCosts.other);

  const goBack = () => {
    navigate('/mycost');
  };

  const goHome = () => {
    navigate('/');
  };

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
            <h2>{currentRegion} 지역 생활비 비교</h2>
            <p className="description">나의 생활비와 지역 평균을 비교해보세요</p>
          </div>

          <div className="comparison-section">
            <div className="comparison-item">
              <div className="category-header">
                <h3>주거비</h3>
                <div className="cost-display">
                  <span className={`my-cost ${userHousing > averageData.housing ? 'higher' : 'lower'}`}>{userHousing}만원</span>
                  <span className="vs">vs</span>
                  <span className={`avg-cost ${averageData.housing > userHousing ? 'higher' : 'lower'}`}>{averageData.housing}만원</span>
                </div>
              </div>
              <div className="comparison-bar">
                <div className="bar-container">
                  <div 
                    className={`my-bar ${userHousing > averageData.housing ? 'higher' : 'lower'}`} 
                    style={{ width: `${Math.min((userHousing / Math.max(userHousing, averageData.housing)) * 100, 100)}%` }}
                  ></div>
                  <div 
                    className={`avg-bar ${averageData.housing > userHousing ? 'higher' : 'lower'}`} 
                    style={{ width: `${Math.min((averageData.housing / Math.max(userHousing, averageData.housing)) * 100, 100)}%` }}
                  ></div>
                </div>
                <div className="bar-labels">
                  <span>나의 비용</span>
                  <span>지역 평균</span>
                </div>
              </div>
            </div>

            <div className="comparison-item">
              <div className="category-header">
                <h3>식비</h3>
                <div className="cost-display">
                  <span className={`my-cost ${userFood > averageData.food ? 'higher' : 'lower'}`}>{userFood}만원</span>
                  <span className="vs">vs</span>
                  <span className={`avg-cost ${averageData.food > userFood ? 'higher' : 'lower'}`}>{averageData.food}만원</span>
                </div>
              </div>
              <div className="comparison-bar">
                <div className="bar-container">
                  <div 
                    className={`my-bar ${userFood > averageData.food ? 'higher' : 'lower'}`} 
                    style={{ width: `${Math.min((userFood / Math.max(userFood, averageData.food)) * 100, 100)}%` }}
                  ></div>
                  <div 
                    className={`avg-bar ${averageData.food > userFood ? 'higher' : 'lower'}`} 
                    style={{ width: `${Math.min((averageData.food / Math.max(userFood, averageData.food)) * 100, 100)}%` }}
                  ></div>
                </div>
                <div className="bar-labels">
                  <span>나의 비용</span>
                  <span>지역 평균</span>
                </div>
              </div>
            </div>

            <div className="comparison-item">
              <div className="category-header">
                <h3>교통비</h3>
                <div className="cost-display">
                  <span className={`my-cost ${userTransport > averageData.transport ? 'higher' : 'lower'}`}>{userTransport}만원</span>
                  <span className="vs">vs</span>
                  <span className={`avg-cost ${averageData.transport > userTransport ? 'higher' : 'lower'}`}>{averageData.transport}만원</span>
                </div>
              </div>
              <div className="comparison-bar">
                <div className="bar-container">
                  <div 
                    className={`my-bar ${userTransport > averageData.transport ? 'higher' : 'lower'}`} 
                    style={{ width: `${Math.min((userTransport / Math.max(userTransport, averageData.transport)) * 100, 100)}%` }}
                  ></div>
                  <div 
                    className={`avg-bar ${averageData.transport > userTransport ? 'higher' : 'lower'}`} 
                    style={{ width: `${Math.min((averageData.transport / Math.max(userTransport, averageData.transport)) * 100, 100)}%` }}
                  ></div>
                </div>
                <div className="bar-labels">
                  <span>나의 비용</span>
                  <span>지역 평균</span>
                </div>
              </div>
            </div>

            <div className="comparison-item">
              <div className="category-header">
                <h3>기타</h3>
                <div className="cost-display">
                  <span className={`my-cost ${userOther > averageData.other ? 'higher' : 'lower'}`}>{userOther}만원</span>
                  <span className="vs">vs</span>
                  <span className={`avg-cost ${averageData.other > userOther ? 'higher' : 'lower'}`}>{averageData.other}만원</span>
                </div>
              </div>
              <div className="comparison-bar">
                <div className="bar-container">
                  <div 
                    className={`my-bar ${userOther > averageData.other ? 'higher' : 'lower'}`} 
                    style={{ width: `${Math.min((userOther / Math.max(userOther, averageData.other)) * 100, 100)}%` }}
                  ></div>
                  <div 
                    className={`avg-bar ${averageData.other > userOther ? 'higher' : 'lower'}`} 
                    style={{ width: `${Math.min((averageData.other / Math.max(userOther, averageData.other)) * 100, 100)}%` }}
                  ></div>
                </div>
                <div className="bar-labels">
                  <span>나의 비용</span>
                  <span>지역 평균</span>
                </div>
              </div>
            </div>
          </div>

          <div className="summary-section">
            <h3>분석 요약</h3>
            <div className="summary-content">
              <p>
                {currentRegion} 지역에서 나의 총 생활비는 <strong>{((userHousing * 10000) + (userFood * 10000) + (userTransport * 10000) + (userOther * 10000)).toLocaleString('ko-KR')}원</strong>이고,
                지역 평균은 <strong>{((averageData.housing * 10000) + (averageData.food * 10000) + (averageData.transport * 10000) + (averageData.other * 10000)).toLocaleString('ko-KR')}원</strong>입니다.
              </p>
              <p>
                {(userHousing * 10000) + (userFood * 10000) + (userTransport * 10000) + (userOther * 10000) > (averageData.housing * 10000) + (averageData.food * 10000) + (averageData.transport * 10000) + (averageData.other * 10000)
                  ? '지역 평균보다 높은 생활비를 사용하고 있습니다.' 
                  : '지역 평균보다 낮은 생활비를 사용하고 있습니다.'}
              </p>
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

export default Comparison;
