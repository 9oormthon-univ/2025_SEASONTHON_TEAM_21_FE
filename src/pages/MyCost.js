// src/pages/MyCost.js
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MyCost.css';
import logo from '../assets/logo.png';
import { getIncomeBracket, saveMyCosts } from '../api/myCostService';

export default function MyCost() {
  const navigate = useNavigate();
  const isDev = process.env.NODE_ENV === 'development';

  // 월 소득(만원 단위, "300만원" 형태로 보관)
  const [income, setIncome] = useState('');
  // 나이("25세" 형태로 보관)
  const [age, setAge] = useState('');

  // 소득분위
  const [bracket, setBracket] = useState(null); // { name, label }
  const [bracketLoading, setBracketLoading] = useState(false);
  const [bracketError, setBracketError] = useState('');

  // 6개 지출 항목 (만원 단위)
  const [myCosts, setMyCosts] = useState({
    food: '',           // 식비
    housing: '',        // 주거비
    education: '',      // 교육비
    transport: '',      // 교통비
    communication: '',  // 통신비
    entertainment: ''   // 오락·문화비
  });

  const getNumericValue = (str) => parseInt((str || '').replace(/[^0-9]/g, ''), 10) || 0;
  const formatCurrency = (num) => num.toLocaleString('ko-KR');

  const toWonFromMan = (man) => (Number(man) || 0) * 10000;

  const getSliderRange = (key) => {
    switch (key) {
      case 'age':           return { min: 0,   max: 120,  step: 1, unit: '세' };
      case 'income':        return { min: 50,  max: 1000, step: 1, unit: '만원' }; // 50만~1000만
      case 'housing':       return { min: 1,   max: 300,  step: 1, unit: '만원' };
      case 'food':          return { min: 1,   max: 200,  step: 1, unit: '만원' };
      case 'education':     return { min: 0,   max: 200,  step: 1, unit: '만원' };
      case 'transport':     return { min: 0,   max: 100,  step: 1, unit: '만원' };
      case 'communication': return { min: 0,   max: 100,  step: 1, unit: '만원' };
      case 'entertainment': return { min: 0,   max: 150,  step: 1, unit: '만원' };
      default:              return { min: 0,   max: 100,  step: 1, unit: '만원' };
    }
  };

  const handleSliderChange = (key, value) => {
    const { unit } = getSliderRange(key);
    if (key === 'income') setIncome(`${value}${unit}`);
    else if (key === 'age') setAge(`${value}${unit}`);
    else setMyCosts((p) => ({ ...p, [key]: `${value}${unit}` }));
  };

  const handleInputChange = (key, value) => {
    const onlyNum = value.replace(/[^0-9]/g, '');
    const { unit } = getSliderRange(key);
    const display = onlyNum ? `${onlyNum}${unit}` : '';
    if (key === 'income') setIncome(display);
    else if (key === 'age') setAge(display);
    else setMyCosts((p) => ({ ...p, [key]: display }));
  };

  // 총 지출(원) = (만원 합계) * 10,000
  const getTotalExpenseWon = () => {
    const sumMan =
      getNumericValue(myCosts.food) +
      getNumericValue(myCosts.housing) +
      getNumericValue(myCosts.education) +
      getNumericValue(myCosts.transport) +
      getNumericValue(myCosts.communication) +
      getNumericValue(myCosts.entertainment);
    return sumMan * 10000;
  };

  // 소득 대비 지출 비율
  const expenseRatio = (() => {
    const incMan = getNumericValue(income);
    if (!incMan) return 0;
    const expMan =
      getNumericValue(myCosts.food) +
      getNumericValue(myCosts.housing) +
      getNumericValue(myCosts.education) +
      getNumericValue(myCosts.transport) +
      getNumericValue(myCosts.communication) +
      getNumericValue(myCosts.entertainment);
    return Math.min(999, Math.round((expMan / incMan) * 100));
  })();

  const ratioLevel = (() => {
    if (!getNumericValue(income)) return { text: '—', className: '' };
    if (expenseRatio >= 80) return { text: '높음', className: 'level-high' };
    if (expenseRatio >= 60) return { text: '보통', className: 'level-medium' };
    return { text: '양호', className: 'level-good' };
  })();

  // --- 개발 모드용 임시 소득분위 계산 ---
  function mockBracketFromIncome(incMan) {
    if (!incMan) return null;
    if (incMan < 120)  return { name: '1분위(임시)', label: '0~119만원 구간(임시)' };
    if (incMan < 300)  return { name: '2분위(임시)', label: '120~299만원 구간(임시)' };
    if (incMan < 500)  return { name: '3분위(임시)', label: '300~499만원 구간(임시)' };
    if (incMan < 800)  return { name: '4분위(임시)', label: '500~799만원 구간(임시)' };
    return { name: '5분위+(임시)', label: '800만원 이상(임시)' };
  }

  // --- 소득분위: 백엔드 조회 (디바운스 300ms) ---
  const debounceRef = useRef(null);
  useEffect(() => {
    const incMan = getNumericValue(income);
    setBracket(null);
    setBracketError('');

    if (!incMan) { setBracketLoading(false); return; }

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      const controller = new AbortController();
      try {
        setBracketLoading(true);

        if (isDev) {
          setBracket(mockBracketFromIncome(incMan));
        } else {
          const b = await getIncomeBracket(incMan, controller.signal);
          setBracket(b);
        }
      } catch (e) {
        setBracket(null);
        setBracketError('소득분위 정보를 불러오지 못했습니다.');
      } finally {
        setBracketLoading(false);
      }
      return () => controller.abort();
    }, 300);

    return () => debounceRef.current && clearTimeout(debounceRef.current);
  }, [income, isDev]);

  const goBack = () => navigate('/home');

  const handleSubmit = async () => {
    const incMan = getNumericValue(income);
    if (!incMan) return;

    const realBracket = bracket ?? (isDev ? mockBracketFromIncome(incMan) : null);
    if (!isDev && !realBracket) return;

    // 백엔드에 값 전송(원화 숫자)
    const payload = {
      age: getNumericValue(age) || null,
      incomeWon: toWonFromMan(incMan),
      costsWon: {
        food:          toWonFromMan(getNumericValue(myCosts.food)),
        housing:       toWonFromMan(getNumericValue(myCosts.housing)),
        education:     toWonFromMan(getNumericValue(myCosts.education)),
        transport:     toWonFromMan(getNumericValue(myCosts.transport)),
        communication: toWonFromMan(getNumericValue(myCosts.communication)),
        entertainment: toWonFromMan(getNumericValue(myCosts.entertainment)),
      },
    };

    try {
      await saveMyCosts(payload);
    } catch (e) {
      // 실패하더라도 비교 페이지 이동은 유지(필요 시 막아도 됨)
      // eslint-disable-next-line no-console
      console.error('[saveMyCosts failed]', e);
    }

    navigate('/comparison', {
      state: {
        selectedBracket: realBracket?.name,
        selectedRegion: realBracket?.name, // 하위호환
        myCosts,
        income,
        age: getNumericValue(age) || undefined,
      }
    });
  };

  const CostItem = ({ label, keyName }) => {
    const range = getSliderRange(keyName);
    const valueNum = getNumericValue(myCosts[keyName]) || range.min;
    const progress = ((valueNum - range.min) / (range.max - range.min)) * 100;

    return (
      <div className="cost-item">
        <div className="cost-header">
          <label>{label}</label>
          <span className="cost-display">{myCosts[keyName] || `0${range.unit}`}</span>
        </div>
        <div className="slider-container">
          <input
            type="range"
            min={range.min}
            max={range.max}
            step={range.step}
            value={valueNum}
            onChange={(e) => handleSliderChange(keyName, e.target.value)}
            className="cost-slider"
            style={{ '--slider-progress': `${Math.max(0, Math.min(100, progress))}%` }}
          />
        </div>
        <input
          type="text"
          placeholder="직접 입력하세요."
          value={getNumericValue(myCosts[keyName]) || ''}
          onChange={(e) => handleInputChange(keyName, e.target.value)}
          className="cost-input"
        />
      </div>
    );
  };

  const IncomeItem = () => {
    const range = getSliderRange('income');
    const valueNum = getNumericValue(income) || range.min;
    const progress = ((valueNum - range.min) / (range.max - range.min)) * 100;

    return (
      <div className="cost-item">
        <div className="cost-header">
          <label>나의 월 소득</label>
          <span className="cost-display">{income || `0${range.unit}`}</span>
        </div>
        <div className="slider-container">
          <input
            type="range"
            min={range.min}
            max={range.max}
            step={range.step}
            value={valueNum}
            onChange={(e) => handleSliderChange('income', e.target.value)}
            className="cost-slider"
            style={{ '--slider-progress': `${Math.max(0, Math.min(100, progress))}%` }}
          />
        </div>
        <input
          type="text"
          placeholder="직접 입력하세요."
          value={getNumericValue(income) || ''}
          onChange={(e) => handleInputChange('income', e.target.value)}
          className="cost-input"
        />

        <div className="bracket-info">
          {bracketLoading && <span className="badge badge-muted">소득분위 불러오는 중…</span>}
          {!bracketLoading && bracket && <span className="badge badge-primary">{bracket.label}</span>}
          {!bracketLoading && bracketError && <span className="badge badge-danger">{bracketError}</span>}
          {!bracketLoading && !bracket && !bracketError && isDev && getNumericValue(income) > 0 && (
            <span className="badge badge-primary">{mockBracketFromIncome(getNumericValue(income)).label}</span>
          )}
        </div>
      </div>
    );
  };

  // NEW: AgeItem — 소득 입력 카드와 동일한 스타일
  const AgeItem = () => {
    const range = getSliderRange('age');
    const valueNum = getNumericValue(age) || range.min;
    const progress = ((valueNum - range.min) / (range.max - range.min)) * 100;

    return (
      <div className="cost-item">
        <div className="cost-header">
          <label>만 나이</label>
          <span className="cost-display">{age || `0${range.unit}`}</span>
        </div>
        <div className="slider-container">
          <input
            type="range"
            min={range.min}
            max={range.max}
            step={range.step}
            value={valueNum}
            onChange={(e) => handleSliderChange('age', e.target.value)}
            className="cost-slider"
            style={{ '--slider-progress': `${Math.max(0, Math.min(100, progress))}%` }}
          />
        </div>
        <input
          type="text"
          placeholder="직접 입력하세요."
          value={getNumericValue(age) || ''}
          onChange={(e) => handleInputChange('age', e.target.value)}
          className="cost-input"
        />
      </div>
    );
  };

  // 개발/운영에 따라 버튼 활성 조건 분리
  const canSubmit = (() => {
    const hasIncome = !!getNumericValue(income);
    if (!hasIncome || bracketLoading) return false;
    return isDev ? true : !!bracket;
  })();

  const submitLabel = (() => {
    const hasIncome = !!getNumericValue(income);
    if (!hasIncome) return '월 소득을 입력해주세요';
    if (bracketLoading) return '소득분위를 불러오는 중…';
    if (isDev) return (bracket?.label ?? mockBracketFromIncome(getNumericValue(income))?.label) + '과 비교 분석하기';
    if (bracket) return `${bracket.label}과 비교 분석하기`;
    return '소득분위를 불러오지 못했습니다';
  })();

  return (
    <div className="app-container">
      <div className="phone-frame">
        <header className="app-header">
          <img src={logo} alt="로고" className="logo-circle" />
          <h1 className="logo-text">쓸림</h1>
          <p className="subtitle">나의 월 소득과 생활비를 입력해보세요</p>
        </header>

        <main className="content-area">
          <div className="title-section">
            <h2>나의 월 생활비</h2>
            <div className="instruction">
              <div className="instruction-icon">💡</div>
              <p>슬라이더로 빠르게 조정하거나, 직접 입력하세요</p>
              <p className="unit-info">모든 항목은 <b>만원</b> 단위로 입력/표시됩니다</p>
            </div>
          </div>

          {/* 나이(소득 카드와 동일 스타일) */}
          <div className="cost-input-section">
            <AgeItem />
          </div>

          {/* 월 소득 */}
          <div className="cost-input-section">
            <IncomeItem />
          </div>

          {/* 지출 6개 항목 */}
          <div className="cost-input-section">
            <CostItem label="식비" keyName="food" />
            <CostItem label="주거비" keyName="housing" />
            <CostItem label="교육비" keyName="education" />
            <CostItem label="교통비" keyName="transport" />
            <CostItem label="통신비" keyName="communication" />
            <CostItem label="오락·문화비" keyName="entertainment" />
          </div>

          {/* 총 지출 & 소득 대비 지출 비율 */}
          <div className="total-cost-section">
            <div className="total-cost-display">
              <span className="total-label">총 월 생활비</span>
              <span className="total-amount">{formatCurrency(getTotalExpenseWon())}원</span>
            </div>

            <div className="ratio-row">
              <span className="ratio-label">소득 대비 지출 비율</span>
              <div className="ratio-right">
                <span className="ratio-number">{getNumericValue(income) ? `${expenseRatio}%` : '—'}</span>
                <span className={`level-badge ${ratioLevel.className}`}>{ratioLevel.text}</span>
              </div>
            </div>
          </div>

          {/* 비교 버튼 */}
          <div className="button-group">
            <button className="back-button" onClick={goBack}>뒤로가기</button>
            <button
              className={`submit-button ${canSubmit ? 'active' : 'disabled'}`}
              onClick={handleSubmit}
              disabled={!canSubmit}
            >
              {submitLabel}
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
