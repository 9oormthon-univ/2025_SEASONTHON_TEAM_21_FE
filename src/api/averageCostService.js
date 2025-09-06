// src/api/averageCostService.js
import axios from 'axios';

const BASE_URL =
  process.env.REACT_APP_API_BASE_URL?.trim() || 'https://apiserver.shop';

// 문자열/숫자 안전 숫자화
const toNumber = (v) =>
  typeof v === 'number' ? v : parseFloat(String(v).replace(/[^\d.-]/g, '')) || 0;

// “만원” → “원”
const manToWon = (v) => Math.round(toNumber(v) * 10000);

/**
 * [GET] https://apiserver.shop/api/scaled-by-income
 * 응답 예:
 * [
 *   {
 *     "group":"1분위","ratio":0.39,
 *     "foodCost":31,"rentMonthly":5,"housingManagementFee":6,
 *     "educationCost":4,"telecomCost":5,"transportationCost":8,"recreationCultureCost":7
 *   }, ...
 * ]
 *
 * 화면 기대 형태(원 단위):
 * [{ name, totalCost, food, housing, education, transport, communication, entertainment }]
 */
export async function fetchAverageCosts(signal) {
  const res = await axios.get(`${BASE_URL}/api/scaled-by-income`, {
    signal,
    headers: { Accept: 'application/json' },
    timeout: 10000,
  });
  if (res.status !== 200) throw new Error(`HTTP ${res.status}`);

  const arr = Array.isArray(res.data) ? res.data : [];

  return arr.map((item, idx) => {
    const food          = manToWon(item.foodCost);
    const housing       = manToWon(toNumber(item.rentMonthly) + toNumber(item.housingManagementFee));
    const education     = manToWon(item.educationCost);
    const transport     = manToWon(item.transportationCost);
    const communication = manToWon(item.telecomCost);
    const entertainment = manToWon(item.recreationCultureCost);

    const totalCost = food + housing + education + transport + communication + entertainment;

    return {
      name: item.group ?? `${idx + 1}분위`,
      totalCost,
      food,
      housing,
      education,
      transport,
      communication,
      entertainment,
    };
  });
}
