import { fetchHolidays } from '../../apis/fetchHolidays';

describe('fetchHolidays', () => {
  it('주어진 월의 공휴일만 반환한다', () => {
    const testDate = new Date(2024, 7);
    const result = fetchHolidays(testDate);

    expect(result).toEqual({ '2024-08-15': '광복절' });
  });

  it('공휴일이 없는 월에 대해 빈 객체를 반환한다', () => {
    const testDate = new Date(2024, 10);
    const result = fetchHolidays(testDate);

    expect(result).toEqual({});
  });

  it('여러 공휴일이 있는 월에 대해 모든 공휴일을 반환한다', () => {
    const testDate = new Date(2024, 8);
    const result = fetchHolidays(testDate);

    expect(result).toEqual({
      '2024-09-16': '추석',
      '2024-09-17': '추석',
      '2024-09-18': '추석',
    });
  });
});
