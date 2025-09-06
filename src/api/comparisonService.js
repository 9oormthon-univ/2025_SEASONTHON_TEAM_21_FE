// src/api/comparisonService.js
import client from './_client';

// "원" 또는 숫자 → 만원(정수)
const toMan = (v) => {
  if (v == null) return 0;
  const n = typeof v === 'string' ? parseInt(v.replace(/[^\d]/g, ''), 10) || 0 : Number(v) || 0;
  return Math.round(n / 10000);
};

/**
 * 소득분위(또는 지역/브래킷 이름)로 평균 생활비 조회
 * Swagger가 열리면 아래 엔드포인트/파라미터만 맞추면 됩니다.
 * 기대 응답 예시(케이스 1: 객체):
 *  {
 *    "name": "3분위",
 *    "averages": {
 *      "food": 350000, "housing": 550000, "education": 150000,
 *      "transport": 140000, "communication": 120000, "entertainment": 140000
 *    }
 *  }
 * 기대 응답 예시(케이스 2: 배열):
 *  [{
 *    "name": "3분위",
 *    "food": 350000, "housing": 550000, "education": 150000,
 *    "transport": 140000, "communication": 120000, "entertainment": 140000
 *  }]
 */
export async function getAveragesByBracket(bracketName, signal) {
  const res = await client.get('/api/average-costs', {
    params: { bracket: bracketName }, // 필요 시 key 이름만 바꾸면 됩니다.
    signal,
  });

  const payload = res.data;
  // 응답이 배열이면 첫 항목 사용, 객체면 그대로
  const root = Array.isArray(payload) ? payload[0] : payload;

  // averages 래핑 여부 처리
  const src = root?.averages ?? root ?? {};

  return {
    food:          toMan(src.food ?? src.foodCost ?? src.food_cost),
    housing:       toMan(src.housing ?? src.housingCost ?? src.house_cost ?? src.rent),
    education:     toMan(src.education ?? src.educationCost ?? src.edu_cost),
    transport:     toMan(src.transport ?? src.transportCost ?? src.trans_cost),
    communication: toMan(src.communication ?? src.communicationCost ?? src.comm_cost),
    entertainment: toMan(src.entertainment ?? src.entertainmentCost ?? src.leisure_cost),
  };
}
