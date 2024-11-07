import { events } from '../../__mocks__/response/realEvents.json';
import { Event } from '../../types';
import { createNotificationMessage, getUpcomingEvents } from '../../utils/notificationUtils';

describe('getUpcomingEvents', () => {
  const mockEventsList: Event[] = events as Event[];

  it('알림 시간이 정확히 도래한 이벤트를 반환한다', () => {
    const now = new Date('2024-11-20T09:59:00');
    const notifiedEvents: string[] = [];
    const result = getUpcomingEvents(mockEventsList, now, notifiedEvents);

    expect(result).toHaveLength(1);
  });

  it('이미 알림이 간 이벤트는 제외한다', () => {
    const now = new Date('2024-11-06T13:30:00');
    const notifiedEvents: string[] = ['1'];
    const result = getUpcomingEvents(mockEventsList, now, notifiedEvents);

    expect(result).toHaveLength(0);
  });

  it('알림 시간이 아직 도래하지 않은 이벤트는 반환하지 않는다', () => {
    const now = new Date('2024-11-06T12:00:00');
    const notifiedEvents: string[] = [];
    const result = getUpcomingEvents(mockEventsList, now, notifiedEvents);

    expect(result).toHaveLength(0);
  });

  it('알림 시간이 지난 이벤트는 반환하지 않는다', () => {
    const now = new Date('2024-11-28T22:05:00');
    const notifiedEvents: string[] = [];
    const result = getUpcomingEvents(mockEventsList, now, notifiedEvents);

    expect(result).toHaveLength(0);
  });
});

describe('createNotificationMessage', () => {
  it('올바른 알림 메시지를 생성해야 한다', () => {
    const event: Event = events[0] as Event;
    const result = createNotificationMessage(event);
    const expected = '1분 후 팀 회의 일정이 시작됩니다.';

    expect(result).toBe(expected);
  });
});
