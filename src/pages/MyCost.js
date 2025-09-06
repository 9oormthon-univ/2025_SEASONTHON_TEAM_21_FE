import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MyCost.css';

const MyCost = () => {
  const navigate = useNavigate();
  const [selectedRegion, setSelectedRegion] = useState('광주');
  const [myCosts, setMyCosts] = useState({
    housing: '',
    food: '',
    transport: ''
  });

  const regions = ['서울', '경기', '부산', '대구', '광주', '대전'];

  const handleInputChange = (category, value) => {
    setMyCosts(prev => ({
      ...prev,
      [category]: value
    }));
  };

  const handleSubmit = () => {
    // 여기서 백엔드로 데이터를 전송하고 결과를 받아옵니다
    console.log('Selected Region:', selectedRegion);
    console.log('My Costs:', myCosts);
    // 결과 페이지로 이동하거나 결과를 표시합니다
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
            <h2>나의 월 생활비 입력</h2>
            <p className="description">지역을 선택하고 생활비를 입력해주세요</p>
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
            <h3>생활비 입력</h3>
            
            <div className="input-group">
              <label>주거비 (원)</label>
              <input
                type="number"
                placeholder="예: 450000"
                value={myCosts.housing}
                onChange={(e) => handleInputChange('housing', e.target.value)}
              />
            </div>

            <div className="input-group">
              <label>식비 (원)</label>
              <input
                type="number"
                placeholder="예: 280000"
                value={myCosts.food}
                onChange={(e) => handleInputChange('food', e.target.value)}
              />
            </div>

            <div className="input-group">
              <label>교통비 (원)</label>
              <input
                type="number"
                placeholder="예: 90000"
                value={myCosts.transport}
                onChange={(e) => handleInputChange('transport', e.target.value)}
              />
            </div>
          </div>

          <div className="button-group">
            <button className="back-button" onClick={goBack}>
              뒤로가기
            </button>
            <button className="submit-button" onClick={handleSubmit}>
              분석하기
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MyCost;
