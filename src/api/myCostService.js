// src/api/myCostService.js
import client from './_client';

/** 소득(만원) → 소득분위 조회 */
export async function getIncomeBracket(incomeMan, signal) {
  const res = await client.get('/api/income-bracket', {
    params: { income: incomeMan },
    signal,
  });
  // 기대 응답 예시: { name: "3분위", label: "300~399만원 구간" }
  return {
    name: res.data?.name,
    label: res.data?.label ?? res.data?.name,
  };
}

/** 입력한 값 전송(원화 숫자 기준 권장) */
export async function saveMyCosts(payload, signal) {
  // 기대 페이로드 예시:
  // {
  //   age: 25,
  //   incomeWon: 3000000,
  //   costsWon: { food: 280000, housing: 450000, education: 120000, transport: 90000, communication: 60000, entertainment: 110000 }
  // }
  const res = await client.post('/api/my-costs', payload, { signal });
  return res.data; // 필요 시 저장 결과/ID 반환 가정
}
