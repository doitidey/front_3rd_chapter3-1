import { Event } from '../../types';
import { getFilteredEvents } from '../../utils/eventUtils';

const mockEvents: Event[] = [
  {
    id: '1',
    title: 'event 이벤트 1',
    date: '2024-07-01',
    startTime: '10:00',
    endTime: '11:00',
    description: '첫 번째 이벤트',
    location: '회의실',
    category: 'Work',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 30,
  },
  {
    id: '2',
    title: '이벤트 2',
    date: '2024-07-03',
    startTime: '14:00',
    endTime: '15:00',
    description: '두 번째 이벤트',
    location: '회의실',
    category: 'Work',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 30,
  },
  {
    id: '3',
    title: '이벤트 3',
    date: '2024-07-15',
    startTime: '09:00',
    endTime: '10:00',
    description: '세 번째 이벤트',
    location: '카페',
    category: 'Social',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 30,
  },
];

describe('getFilteredEvents', () => {
  it("검색어 '이벤트 2'에 맞는 이벤트만 반환한다", () => {
    const testDate = new Date('2024-07-01');
    const testTerm = '이벤트 2';
    const testView = 'week';
    const result = getFilteredEvents(mockEvents, testTerm, testDate, testView);

    expect(result).toHaveLength(1);
  });

  it('주간 뷰에서 2024-07-01 주의 이벤트만 반환한다', () => {
    const testDate = new Date('2024-07-01');
    const testTerm = '';
    const testView = 'week';
    const result = getFilteredEvents(mockEvents, testTerm, testDate, testView);

    expect(result).toHaveLength(2);
  });

  it('월간 뷰에서 2024년 7월의 모든 이벤트를 반환한다', () => {
    const testDate = new Date('2024-07-01');
    const testTerm = '';
    const testView = 'month';
    const result = getFilteredEvents(mockEvents, testTerm, testDate, testView);

    expect(result).toHaveLength(3);
  });

  it("검색어 '이벤트'와 주간 뷰 필터링을 동시에 적용한다", () => {
    const testDate = new Date('2024-07-01');
    const testTerm = '이벤트';
    const testView = 'week';
    const result = getFilteredEvents(mockEvents, testTerm, testDate, testView);

    expect(result).toHaveLength(2);
  });

  it('검색어가 없을 때 모든 이벤트를 반환한다', () => {
    const testDate = new Date('2024-07-01');
    const testTerm = '';
    const testView = 'month';

    const result = getFilteredEvents(mockEvents, testTerm, testDate, testView);
    expect(result).toHaveLength(3);
  });

  it('검색어가 대소문자를 구분하지 않고 작동한다', () => {
    const testDate = new Date('2024-07-01');
    const testTerm = 'EvEnT';
    const testView = 'month';
    const result = getFilteredEvents(mockEvents, testTerm, testDate, testView);

    expect(result).toHaveLength(1);
  });

  it('월의 경계에 있는 이벤트를 올바르게 필터링한다', () => {
    const testDate = new Date('2024-06-30');
    const testTerm = '';
    const testView = 'month';
    const result = getFilteredEvents(mockEvents, testTerm, testDate, testView);

    expect(result).toHaveLength(0);
  });

  it('빈 이벤트 리스트에 대해 빈 배열을 반환한다', () => {
    const testDate = new Date('2024-07-01');
    const testTerm = '';
    const testView = 'month';
    const result = getFilteredEvents([], testTerm, testDate, testView);

    expect(result).toHaveLength(0);
  });
});
