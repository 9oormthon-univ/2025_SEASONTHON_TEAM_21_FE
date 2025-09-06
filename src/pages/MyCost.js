import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MyCost.css';

const MyCost = () => {
  const navigate = useNavigate();
  const [selectedRegion, setSelectedRegion] = useState('광주');
  const [myCosts, setMyCosts] = useState({
    housing: '',
    food: '',
    transport: '',
    other: ''
  });

  const regions = ['서울', '경기', '부산', '대구', '광주', '대전'];

  // 슬라이더 범위 설정 (만원 단위)
  const getSliderRange = (category) => {
    switch (category) {
      case 'housing':
        return { min: 10, max: 200, step: 1, unit: '만원' }; // 10만원 ~ 200만원
      case 'food':
        return { min: 100, max: 1000, step: 10, unit: '만원' }; // 10만원 ~ 100만원
      case 'transport':
        return { min: 20, max: 200, step: 5, unit: '만원' }; // 2만원 ~ 20만원
      case 'other':
        return { min: 50, max: 500, step: 10, unit: '만원' }; // 5만원 ~ 50만원
      default:
        return { min: 0, max: 100, step: 1, unit: '만원' };
    }
  };

  const handleSliderChange = (category, value) => {
    const range = getSliderRange(category);
    const displayValue = `${value}${range.unit}`;
    
    setMyCosts(prev => ({
      ...prev,
      [category]: displayValue
    }));
  };

  const handleInputChange = (category, value) => {
    // 숫자만 입력받고 단위에 따라 표시
    const numericValue = value.replace(/[^0-9]/g, '');
    const range = getSliderRange(category);
    const displayValue = numericValue ? `${numericValue}${range.unit}` : '';
    
    setMyCosts(prev => ({
      ...prev,
      [category]: displayValue
    }));
  };

  // 입력값에서 숫자만 추출하는 함수
  const getNumericValue = (costString) => {
    return parseInt(costString.replace(/[^0-9]/g, '')) || 0;
  };

  // 총 생활비 계산 (모든 값을 원 단위로 변환)
  const getTotalCost = () => {
    const housing = getNumericValue(myCosts.housing) * 10000; // 만원 -> 원
    const food = getNumericValue(myCosts.food) * 1000; // 천원 -> 원
    const transport = getNumericValue(myCosts.transport) * 1000; // 천원 -> 원
    const other = getNumericValue(myCosts.other) * 1000; // 천원 -> 원
    
    return housing + food + transport + other;
  };

  // 총 생활비를 천원 단위로 포맷팅
  const formatTotalCost = (total) => {
    return total.toLocaleString('ko-KR');
  };

  const handleSubmit = () => {
    // 여기서 백엔드로 데이터를 전송하고 결과를 받아옵니다
    console.log('Selected Region:', selectedRegion);
    console.log('My Costs:', myCosts);
    // Comparison 페이지로 데이터와 함께 이동
    navigate('/comparison', {
      state: {
        selectedRegion,
        myCosts
      }
    });
  };

  const goBack = () => {
    navigate('/');
  };

  return (
    <div className="app-container">
      <div className="phone-frame">
        <header className="app-header">
          <div className="logo-circle">3</div>
          <h1 className="logo-text">쓸림</h1>
          <p className="subtitle">나의 월 생활비를 입력해보세요</p>
        </header>

        <main className="content-area">
          <div className="title-section">
            <h2>나의 월 생활비</h2>
            <div className="instruction">
              <div className="instruction-icon">💡</div>
              <p>슬라이더로 빠르게 조정하거나, 직접 입력하세요</p>
              <p className="unit-info">식비·교통비·기타는 천원 단위, 주거비는 만원 단위</p>
            </div>
          </div>

          <div className="region-selection">
            <h3>지역 선택</h3>
            <div className="region-buttons">
              {regions.map((region) => (
                <button
                  key={region}
                  className={`region-btn ${selectedRegion === region ? 'active' : ''}`}
                  onClick={() => setSelectedRegion(region)}
                >
                  {region}
                </button>
              ))}
            </div>
          </div>

          <div className="cost-input-section">
            {/* 주거비 */}
            <div className="cost-item">
              <div className="cost-header">
                <label>주거비</label>
                <span className="cost-display">{myCosts.housing || '0만원'}</span>
              </div>
              <div className="slider-container">
                <input
                  type="range"
                  min={getSliderRange('housing').min}
                  max={getSliderRange('housing').max}
                  step={getSliderRange('housing').step}
                  value={getNumericValue(myCosts.housing) || getSliderRange('housing').min}
                  onChange={(e) => handleSliderChange('housing', e.target.value)}
                  className="cost-slider"
                />
              </div>
              <input
                type="text"
                placeholder="예: 45"
                value={getNumericValue(myCosts.housing) || ''}
                onChange={(e) => handleInputChange('housing', e.target.value)}
                className="cost-input"
              />
            </div>

            {/* 식비 */}
            <div className="cost-item">
              <div className="cost-header">
                <label>식비</label>
                <span className="cost-display">{myCosts.food || '0만원'}</span>
              </div>
              <div className="slider-container">
                <input
                  type="range"
                  min={getSliderRange('food').min}
                  max={getSliderRange('food').max}
                  step={getSliderRange('food').step}
                  value={getNumericValue(myCosts.food) || getSliderRange('food').min}
                  onChange={(e) => handleSliderChange('food', e.target.value)}
                  className="cost-slider"
                />
              </div>
              <input
                type="text"
                placeholder="예: 280"
                value={getNumericValue(myCosts.food) || ''}
                onChange={(e) => handleInputChange('food', e.target.value)}
                className="cost-input"
              />
            </div>

            {/* 교통비 */}
            <div className="cost-item">
              <div className="cost-header">
                <label>교통비</label>
                <span className="cost-display">{myCosts.transport || '0만원'}</span>
              </div>
              <div className="slider-container">
                <input
                  type="range"
                  min={getSliderRange('transport').min}
                  max={getSliderRange('transport').max}
                  step={getSliderRange('transport').step}
                  value={getNumericValue(myCosts.transport) || getSliderRange('transport').min}
                  onChange={(e) => handleSliderChange('transport', e.target.value)}
                  className="cost-slider"
                />
              </div>
              <input
                type="text"
                placeholder="예: 90"
                value={getNumericValue(myCosts.transport) || ''}
                onChange={(e) => handleInputChange('transport', e.target.value)}
                className="cost-input"
              />
            </div>

            {/* 기타 */}
            <div className="cost-item">
              <div className="cost-header">
                <label>기타</label>
                <span className="cost-display">{myCosts.other || '0만원'}</span>
              </div>
              <div className="slider-container">
                <input
                  type="range"
                  min={getSliderRange('other').min}
                  max={getSliderRange('other').max}
                  step={getSliderRange('other').step}
                  value={getNumericValue(myCosts.other) || getSliderRange('other').min}
                  onChange={(e) => handleSliderChange('other', e.target.value)}
                  className="cost-slider"
                />
              </div>
              <input
                type="text"
                placeholder="예: 120"
                value={getNumericValue(myCosts.other) || ''}
                onChange={(e) => handleInputChange('other', e.target.value)}
                className="cost-input"
              />
            </div>
          </div>

          {/* 총 월 생활비 */}
          <div className="total-cost-section">
            <div className="total-cost-display">
              <span className="total-label">총 월 생활비</span>
              <span className="total-amount">{formatTotalCost(getTotalCost())}원</span>
            </div>
          </div>

          <div className="button-group">
            <button className="back-button" onClick={goBack}>
              뒤로가기
            </button>
            <button 
              className={`submit-button ${selectedRegion ? 'active' : 'disabled'}`}
              onClick={handleSubmit}
              disabled={!selectedRegion}
            >
              {selectedRegion ? `${selectedRegion}과 비교 분석하기` : '지역을 선택해주세요'}
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MyCost;
