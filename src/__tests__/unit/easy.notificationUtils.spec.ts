import { Event } from '../../types';
import { createNotificationMessage, getUpcomingEvents } from '../../utils/notificationUtils';

const mockEvents: Event[] = [
  {
    id: '1',
    title: '회의',
    date: '2024-11-06',
    startTime: '14:00',
    endTime: '15:00',
    description: '팀 프로젝트 회의',
    location: '회의실 A',
    category: 'Work',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 30,
  },
  {
    id: '2',
    title: '헬스 트레이닝',
    date: '2024-11-06',
    startTime: '16:00',
    endTime: '17:00',
    description: '헬스장 PT',
    location: '헬스장',
    category: 'Health',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 60,
  },
];

describe('getUpcomingEvents', () => {
  it('알림 시간이 정확히 도래한 이벤트를 반환한다', () => {
    const now = new Date('2024-11-06T13:30:00');
    const notifiedEvents: string[] = [];
    const result = getUpcomingEvents(mockEvents, now, notifiedEvents);

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
  });

  it('이미 알림이 간 이벤트는 제외한다', () => {
    const now = new Date('2024-11-06T13:30:00');
    const notifiedEvents: string[] = ['1'];
    const result = getUpcomingEvents(mockEvents, now, notifiedEvents);

    expect(result).toHaveLength(0);
  });

  it('알림 시간이 아직 도래하지 않은 이벤트는 반환하지 않는다', () => {
    const now = new Date('2024-11-06T12:00:00');
    const notifiedEvents: string[] = [];
    const result = getUpcomingEvents(mockEvents, now, notifiedEvents);

    expect(result).toHaveLength(0);
  });

  it('알림 시간이 지난 이벤트는 반환하지 않는다', () => {
    const now = new Date('2024-11-06T14:05:00');
    const notifiedEvents: string[] = [];
    const result = getUpcomingEvents(mockEvents, now, notifiedEvents);

    expect(result).toHaveLength(0);
  });
});

describe('createNotificationMessage', () => {
  it('올바른 알림 메시지를 생성해야 한다', () => {
    const event: Event = {
      id: '1',
      title: '회의',
      date: '2024-11-06',
      startTime: '14:00',
      endTime: '15:00',
      description: '팀 프로젝트 회의',
      location: '회의실 A',
      category: 'Work',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 30,
    };
    const result = createNotificationMessage(event);
    const expected = '30분 후 회의 일정이 시작됩니다.';

    expect(result).toBe(expected);
  });
});
