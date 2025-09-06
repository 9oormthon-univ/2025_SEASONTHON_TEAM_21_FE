import React, { useState } from 'react';
import './MyCost.css';

const MyCost = () => {
  const [expenses, setExpenses] = useState({
    housing: 0,      // 주거비 (만원 단위)
    food: 0,         // 식비 (천원 단위)
    transportation: 0, // 교통비 (천원 단위)
    other: 0         // 기타 (만원 단위)
  });

  const [selectedCategory, setSelectedCategory] = useState(null);

  // 값 포맷팅 함수
  const formatValue = (value, isTenThousand = false) => {
    const unit = isTenThousand ? 10000 : 1000;
    const formattedValue = (value * unit).toLocaleString();
    return `${formattedValue}원`;
  };

  // 총액 계산
  const calculateTotal = () => {
    const housingTotal = expenses.housing * 10000;
    const foodTotal = expenses.food * 1000;
    const transportationTotal = expenses.transportation * 1000;
    const otherTotal = expenses.other * 10000;
    return (housingTotal + foodTotal + transportationTotal + otherTotal).toLocaleString();
  };

  // 값 변경 핸들러
  const handleValueChange = (category, value) => {
    setExpenses(prev => ({
      ...prev,
      [category]: parseInt(value) || 0
    }));
  };

  // 슬라이더 변경 핸들러
  const handleSliderChange = (category, value) => {
    setExpenses(prev => ({
      ...prev,
      [category]: parseInt(value)
    }));
  };

  const categories = [
    {
      key: 'housing',
      label: '주거비',
      unit: '만원 단위',
      isTenThousand: true,
      max: 100
    },
    {
      key: 'food',
      label: '식비',
      unit: '천원 단위',
      isTenThousand: false,
      max: 1000
    },
    {
      key: 'transportation',
      label: '교통비',
      unit: '천원 단위',
      isTenThousand: false,
      max: 500
    },
    {
      key: 'other',
      label: '기타',
      unit: '만원 단위',
      isTenThousand: true,
      max: 100
    }
  ];

  return (
    <div className="mycost-container">
      <div className="header">
        <div className="header-icon">💡</div>
        <h1>슬라이더</h1>
        <p className="subtitle">입력하세요</p>
      </div>

      <div className="instruction">
        식비·교통비는 천원 단위, 주거비·기타는 만원 단위
      </div>

      <div className="expense-categories">
        {categories.map((category) => (
          <div key={category.key} className="expense-item">
            <div className="expense-header">
              <span className="expense-label">{category.label}</span>
              <div className="radio-container">
                <input
                  type="radio"
                  name="selectedCategory"
                  checked={selectedCategory === category.key}
                  onChange={() => setSelectedCategory(category.key)}
                  className="radio-button"
                />
              </div>
            </div>

            <div className="expense-input-section">
              <input
                type="text"
                placeholder={`직접 입력 (${category.unit})`}
                value={expenses[category.key]}
                onChange={(e) => handleValueChange(category.key, e.target.value)}
                className="expense-input"
              />
              <div className="expense-value">
                {formatValue(expenses[category.key], category.isTenThousand)}
              </div>
            </div>

            <div className="slider-container">
              <input
                type="range"
                min="0"
                max={category.max}
                value={expenses[category.key]}
                onChange={(e) => handleSliderChange(category.key, e.target.value)}
                className="expense-slider"
              />
              <div className="slider-value">
                {expenses[category.key]}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="total-section">
        <span className="total-label">총 월 생활비</span>
        <span className="total-value">{calculateTotal()}원</span>
      </div>

      <div className="bottom-instructions">
        <p>비교할 지역을 먼저 선택해주세요</p>
        <p>위의 지역 버튼 중 하나를 선택하세요</p>
      </div>
    </div>
  );
};

export default MyCost;
