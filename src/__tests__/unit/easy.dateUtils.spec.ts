import { Event } from '../../types';
import {
  fillZero,
  formatDate,
  formatMonth,
  formatWeek,
  getDaysInMonth,
  getEventsForDay,
  getWeekDates,
  getWeeksAtMonth,
  isDateInRange,
} from '../../utils/dateUtils';

describe('getDaysInMonth', () => {
  it('1월은 31일 수를 반환한다', () => {
    const year = 2024;
    const month = 1;
    const expected = 31;

    expect(getDaysInMonth(year, month)).toBe(expected);
  });

  it('4월은 30일 일수를 반환한다', () => {
    const year = 2024;
    const month = 4;
    const expected = 30;

    expect(getDaysInMonth(year, month)).toBe(expected);
  });

  it('윤년의 2월에 대해 29일을 반환한다', () => {
    const year = 2024;
    const month = 2;
    const expected = 29;

    expect(getDaysInMonth(year, month)).toBe(expected);
  });

  it('평년의 2월에 대해 28일을 반환한다', () => {
    const year = 2023;
    const month = 2;
    const expected = 28;

    expect(getDaysInMonth(year, month)).toBe(expected);
  });

  // TODO : 적절히??
  it('유효하지 않은 월에 대해 적절히 처리한다', () => {
    const year = 2024;
    const month = 13;
    const expected = 31;

    expect(getDaysInMonth(year, month)).toBe(expected);
  });
});

describe('getWeekDates', () => {
  it('주중의 날짜(수요일)에 대해 올바른 주의 날짜들을 반환한다', () => {
    const testDate = new Date('2024-11-6');
    const result = getWeekDates(testDate);

    expect(result).toHaveLength(7);
    expect(result[3]).toEqual(new Date('2024-11-6'));
  });

  it('주의 시작(월요일)에 대해 올바른 주의 날짜들을 반환한다', () => {
    const testDate = new Date('2024-11-4');
    const result = getWeekDates(testDate);

    expect(result).toHaveLength(7);
    expect(result[1]).toEqual(new Date('2024-11-4'));
  });

  it('주의 끝(일요일)에 대해 올바른 주의 날짜들을 반환한다', () => {
    const testDate = new Date('2024-11-10');
    const result = getWeekDates(testDate);

    expect(result).toHaveLength(7);
    expect(result[0]).toEqual(new Date('2024-11-10'));
  });

  it('연도를 넘어가는 주의 날짜를 정확히 처리한다 (연말)', () => {
    const testDate = new Date('2024-12-31');
    const result = getWeekDates(testDate);

    expect(result).toHaveLength(7);
    expect(result[3]).toEqual(new Date('2025-01-01'));
  });

  it('연도를 넘어가는 주의 날짜를 정확히 처리한다 (연초)', () => {
    const testDate = new Date('2024-01-01');
    const result = getWeekDates(testDate);

    expect(result).toHaveLength(7);
    expect(result[0]).toEqual(new Date('2023-12-31'));
  });

  it('윤년의 2월 29일을 포함한 주를 올바르게 처리한다', () => {
    const testDate = new Date('2024-02-29');
    const result = getWeekDates(testDate);

    expect(result).toHaveLength(7);
    expect(result[4]).toEqual(new Date('2024-02-29'));
  });

  it('월의 마지막 날짜를 포함한 주를 올바르게 처리한다', () => {
    const testDate = new Date('2024-02-29');
    const result = getWeekDates(testDate);

    expect(result).toHaveLength(7);
    expect(result[5]).toEqual(new Date('2024-03-01'));
  });
});

describe('getWeeksAtMonth', () => {
  it('2024년 7월 1일의 올바른 주 정보를 반환해야 한다', () => {
    const testDate = new Date('2024-07-01');
    const result = getWeeksAtMonth(testDate);

    expect(result).toHaveLength(5);
    expect(result[0][0]).toBeNull();
    expect(result[4][3]).toBe(31);
  });
});

describe('getEventsForDay', () => {
  const mockEvents: Event[] = [
    {
      id: '1',
      title: '회의',
      date: '2024-11-06',
      startTime: '10:00',
      endTime: '11:00',
      description: '프로젝트 진행 상황 점검 회의',
      location: '회의실 A',
      category: 'Work',
      repeat: {
        type: 'weekly',
        interval: 1,
        endDate: '2025-01-01',
      },
      notificationTime: 30,
    },
    {
      id: '2',
      title: '헬스 트레이닝',
      date: '2024-11-07',
      startTime: '18:00',
      endTime: '19:30',
      description: 'PT와 근력 운동',
      location: '헬스장',
      category: 'Health',
      repeat: {
        type: 'daily',
        interval: 1,
      },
      notificationTime: 15,
    },
    {
      id: '3',
      title: '생일 파티',
      date: '2024-11-10',
      startTime: '19:00',
      endTime: '22:00',
      description: '친구들과 생일 파티',
      location: '레스토랑',
      category: 'Social',
      repeat: {
        type: 'none',
        interval: 0,
      },
      notificationTime: 60,
    },
    {
      id: '4',
      title: '요가 클래스',
      date: '2024-11-08',
      startTime: '07:00',
      endTime: '08:00',
      description: '아침 요가로 하루 시작하기',
      location: '요가 스튜디오',
      category: 'Health',
      repeat: {
        type: 'weekly',
        interval: 1,
        endDate: '2024-12-31',
      },
      notificationTime: 20,
    },
  ];

  it('특정 날짜(1일)에 해당하는 이벤트만 정확히 반환한다', () => {
    const testDate = new Date('2024-11-06').getDate();
    const result = getEventsForDay(mockEvents, testDate);

    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('회의');
  });

  it('해당 날짜에 이벤트가 없을 경우 빈 배열을 반환한다', () => {
    const testDate = new Date('2024-11-01').getDate();
    const result = getEventsForDay(mockEvents, testDate);

    expect(result).toHaveLength(0);
  });

  it('날짜가 0일 경우 빈 배열을 반환한다', () => {
    const testDate = 0;
    const result = getEventsForDay(mockEvents, testDate);

    expect(result).toHaveLength(0);
  });

  it('날짜가 32일 이상인 경우 빈 배열을 반환한다', () => {
    const testDate = new Date('2024-11-32').getDate();
    const result = getEventsForDay(mockEvents, testDate);

    expect(result).toHaveLength(0);
  });
});

describe('formatWeek', () => {
  it('월의 중간 날짜에 대해 올바른 주 정보를 반환한다', () => {
    const testDate = new Date('2024-10-16');
    const expected = '2024년 10월 3주';

    expect(formatWeek(testDate)).toBe(expected);
  });

  it('월의 첫 주에 대해 올바른 주 정보를 반환한다', () => {
    const testDate = new Date('2024-10-01');
    const expected = '2024년 10월 1주';

    expect(formatWeek(testDate)).toBe(expected);
  });

  it('월의 마지막 주에 대해 올바른 주 정보를 반환한다', () => {
    const testDate = new Date('2024-10-31');
    const expected = '2024년 10월 5주';

    expect(formatWeek(testDate)).toBe(expected);
  });

  it('연도가 바뀌는 주에 대해 올바른 주 정보를 반환한다', () => {
    const testDate = new Date('2023-12-31');
    const expected = '2024년 1월 1주';

    expect(formatWeek(testDate)).toBe(expected);
  });

  it('윤년 2월의 마지막 주에 대해 올바른 주 정보를 반환한다', () => {
    const testDate = new Date('2024-02-29');
    const expected = '2024년 2월 5주';

    expect(formatWeek(testDate)).toBe(expected);
  });

  it('평년 2월의 마지막 주에 대해 올바른 주 정보를 반환한다', () => {
    const testDate = new Date('2023-02-28');
    const expected = '2023년 3월 1주';

    expect(formatWeek(testDate)).toBe(expected);
  });
});

describe('formatMonth', () => {
  it("2024년 7월 10일을 '2024년 7월'로 반환한다", () => {
    const testDate = new Date('2024-07-10');
    const expected = '2024년 7월';

    expect(formatMonth(testDate)).toBe(expected);
  });
});

describe('isDateInRange', () => {
  const rangeStart = new Date('2024-07-01');
  const rangeEnd = new Date('2024-07-31');

  it('범위 내의 날짜 2024-07-10에 대해 true를 반환한다', () => {
    const testDate = new Date('2024-07-10');
    const result = isDateInRange(testDate, rangeStart, rangeEnd);

    expect(result).toBe(true);
  });

  it('범위의 시작일 2024-07-01에 대해 true를 반환한다', () => {
    const testDate = new Date('2024-07-01');
    const result = isDateInRange(testDate, rangeStart, rangeEnd);

    expect(result).toBe(true);
  });

  it('범위의 종료일 2024-07-31에 대해 true를 반환한다', () => {
    const testDate = new Date('2024-07-31');
    const result = isDateInRange(testDate, rangeStart, rangeEnd);

    expect(result).toBe(true);
  });

  it('범위 이전의 날짜 2024-06-30에 대해 false를 반환한다', () => {
    const testDate = new Date('2024-06-30');
    const result = isDateInRange(testDate, rangeStart, rangeEnd);

    expect(result).toBe(false);
  });

  it('범위 이후의 날짜 2024-08-01에 대해 false를 반환한다', () => {
    const testDate = new Date('2024-08-01');
    const result = isDateInRange(testDate, rangeStart, rangeEnd);

    expect(result).toBe(false);
  });

  it('시작일이 종료일보다 늦은 경우 모든 날짜에 대해 false를 반환한다', () => {
    const testDate = new Date('2024-07-01');
    const result = isDateInRange(testDate, rangeEnd, rangeStart);

    expect(result).toBe(false);
  });
});

describe('fillZero', () => {
  test("5를 2자리로 변환하면 '05'를 반환한다", () => {
    const testNumber = 5;
    const testSize = 2;
    const result = fillZero(testNumber, testSize);

    expect(result).toBe('05');
  });

  test("10을 2자리로 변환하면 '10'을 반환한다", () => {
    const testNumber = 10;
    const testSize = 2;
    const result = fillZero(testNumber, testSize);

    expect(result).toBe('10');
  });

  test("3을 3자리로 변환하면 '003'을 반환한다", () => {
    const testNumber = 3;
    const testSize = 3;
    const result = fillZero(testNumber, testSize);

    expect(result).toBe('003');
  });

  test("100을 2자리로 변환하면 '100'을 반환한다", () => {
    const testNumber = 100;
    const testSize = 2;
    const result = fillZero(testNumber, testSize);

    expect(result).toBe('100');
  });

  test("0을 2자리로 변환하면 '00'을 반환한다", () => {
    const testNumber = 0;
    const testSize = 2;
    const result = fillZero(testNumber, testSize);

    expect(result).toBe('00');
  });

  test("1을 5자리로 변환하면 '00001'을 반환한다", () => {
    const testNumber = 1;
    const testSize = 5;
    const result = fillZero(testNumber, testSize);

    expect(result).toBe('00001');
  });

  test("소수점이 있는 3.14를 5자리로 변환하면 '03.14'를 반환한다", () => {
    const testNumber = 3.14;
    const testSize = 5;
    const result = fillZero(testNumber, testSize);

    expect(result).toBe('03.14');
  });

  test('size 파라미터를 생략하면 기본값 2를 사용한다', () => {
    const testNumber = 1;
    const result = fillZero(testNumber);

    expect(result).toBe('01');
  });

  test('value가 지정된 size보다 큰 자릿수를 가지면 원래 값을 그대로 반환한다', () => {
    const testNumber = 2222;
    const testSize = 3;
    const result = fillZero(testNumber, testSize);

    expect(result).toBe('2222');
  });
});

describe('formatDate', () => {
  it('날짜를 YYYY-MM-DD 형식으로 포맷팅한다', () => {
    const currentDate = new Date('2024-11-06');
    const result = formatDate(currentDate);
    const expected = '2024-11-06';

    expect(result).toBe(expected);
  });

  it('day 파라미터가 제공되면 해당 일자로 포맷팅한다', () => {
    const currentDate = new Date('2024-11-06');
    const result = formatDate(currentDate, 15);
    const expected = '2024-11-15';

    expect(result).toBe(expected);
  });

  it('월이 한 자리 수일 때 앞에 0을 붙여 포맷팅한다', () => {
    const currentDate = new Date('2024-01-06');
    const result = formatDate(currentDate);
    const expected = '2024-01-06';

    expect(result).toBe(expected);
  });

  it('일이 한 자리 수일 때 앞에 0을 붙여 포맷팅한다', () => {
    const currentDate = new Date('2024-11-06');
    const result = formatDate(currentDate, 7);
    const expected = '2024-11-07';

    expect(result).toBe(expected);
  });
});
