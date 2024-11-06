import { Event } from '../../types';
import {
  convertEventToDateRange,
  findOverlappingEvents,
  isOverlapping,
  parseDateTime,
} from '../../utils/eventOverlap';

describe('parseDateTime', () => {
  it('2024-07-01 14:30을 정확한 Date 객체로 변환한다', () => {
    const testDate = '2024-07-01';
    const testTime = '14:30';
    const result = parseDateTime(testDate, testTime);

    expect(result).toEqual(new Date('2024-07-01 14:30'));
  });

  it('잘못된 날짜 형식에 대해 Invalid Date를 반환한다', () => {
    const testDate = '2024-0701';
    const testTime = '14:30';
    const result = parseDateTime(testDate, testTime);

    expect(result.getTime()).toBeNaN();
  });

  it('잘못된 시간 형식에 대해 Invalid Date를 반환한다', () => {
    const testDate = '2024-07-01';
    const testTime = '555:30';
    const result = parseDateTime(testDate, testTime);

    expect(result.getTime()).toBeNaN();
  });

  it('날짜 문자열이 비어있을 때 Invalid Date를 반환한다', () => {
    const testDate = '';
    const testTime = '14:30';
    const result = parseDateTime(testDate, testTime);

    expect(result.getTime()).toBeNaN();
  });
});

describe('convertEventToDateRange', () => {
  it('일반적인 이벤트를 올바른 시작 및 종료 시간을 가진 객체로 변환한다', () => {
    const testEvent: Event = {
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
    };
    const result = convertEventToDateRange(testEvent);

    expect(result.start).toEqual(new Date('2024-11-10 19:00'));
    expect(result.end).toEqual(new Date('2024-11-10 22:00'));
  });

  it('잘못된 날짜 형식의 이벤트에 대해 Invalid Date를 반환한다', () => {
    const testEvent: Event = {
      id: '3',
      title: '생일 파티',
      date: '2024-1110',
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
    };
    const result = convertEventToDateRange(testEvent);

    expect(result.end.getTime()).toBeNaN();
    expect(result.start.getTime()).toBeNaN();
  });

  it('잘못된 시간 형식의 이벤트에 대해 Invalid Date를 반환한다', () => {
    const testEvent: Event = {
      id: '3',
      title: '생일 파티',
      date: '2024-11-10',
      startTime: '1900',
      endTime: '22:990',
      description: '친구들과 생일 파티',
      location: '레스토랑',
      category: 'Social',
      repeat: {
        type: 'none',
        interval: 0,
      },
      notificationTime: 60,
    };
    const result = convertEventToDateRange(testEvent);

    expect(result.end.getTime()).toBeNaN();
    expect(result.start.getTime()).toBeNaN();
  });
});

describe('isOverlapping', () => {
  const testEvent: Event = {
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
  };
  it('두 이벤트가 겹치는 경우 true를 반환한다', () => {
    const testEvent2: Event = {
      id: '4',
      title: '요가 클래스',
      date: '2024-11-10',
      startTime: '19:00',
      endTime: '22:00',
      description: '아침 요가로 하루 시작하기',
      location: '요가 스튜디오',
      category: 'Health',
      repeat: {
        type: 'weekly',
        interval: 1,
        endDate: '2024-12-31',
      },
      notificationTime: 20,
    };
    const result = isOverlapping(testEvent, testEvent2);

    expect(result).toBe(true);
  });

  it('두 이벤트가 겹치지 않는 경우 false를 반환한다', () => {
    const testEvent2: Event = {
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
    };
    const result = isOverlapping(testEvent, testEvent2);

    expect(result).toBe(false);
  });
});

describe('findOverlappingEvents', () => {
  const mockEvents: Event[] = [
    {
      id: '1',
      title: '회의',
      date: '2024-11-10',
      startTime: '17:00',
      endTime: '18:00',
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

  it('새 이벤트와 겹치는 모든 이벤트를 반환한다', () => {
    const newEvent: Event = {
      id: '5',
      title: '헬스 트레이닝',
      date: '2024-11-10',
      startTime: '17:00',
      endTime: '19:30',
      description: 'PT와 근력 운동',
      location: '헬스장',
      category: 'Health',
      repeat: {
        type: 'daily',
        interval: 1,
      },
      notificationTime: 15,
    };
    const result = findOverlappingEvents(newEvent, mockEvents);

    expect(result).toHaveLength(2);
    expect(result[0].category).toBe('Work');
  });

  it('겹치는 이벤트가 없으면 빈 배열을 반환한다', () => {
    const newEvent: Event = {
      id: '5',
      title: '헬스 트레이닝',
      date: '2024-11-14',
      startTime: '17:00',
      endTime: '19:30',
      description: 'PT와 근력 운동',
      location: '헬스장',
      category: 'Health',
      repeat: {
        type: 'daily',
        interval: 1,
      },
      notificationTime: 15,
    };
    const result = findOverlappingEvents(newEvent, mockEvents);

    expect(result).toHaveLength(0);
  });
});
