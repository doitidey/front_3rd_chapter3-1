import { act, renderHook } from '@testing-library/react';

import { events } from '../../__mocks__/response/realEvents.json';
import { useSearch } from '../../hooks/useSearch.ts';
import { Event } from '../../types.ts';

const mockEventsList: Event[] = events as Event[];
const testDate = new Date('2024-11-01');

it('검색어가 비어있을 때 모든 이벤트를 반환해야 한다', () => {
  const { result } = renderHook(() => useSearch(mockEventsList, testDate, 'month'));

  expect(result.current.filteredEvents).toEqual(events);
});

it('검색어에 맞는 이벤트만 필터링해야 한다', () => {
  const { result } = renderHook(() => useSearch(mockEventsList, testDate, 'month'));

  act(() => {
    result.current.setSearchTerm('운동');
  });

  expect(result.current.filteredEvents).toHaveLength(1);
  expect(result.current.filteredEvents[0].title).toBe('운동');
});

it('검색어가 제목, 설명, 위치 중 하나라도 일치하면 해당 이벤트를 반환해야 한다', () => {
  const { result } = renderHook(() => useSearch(mockEventsList, testDate, 'month'));

  act(() => {
    result.current.setSearchTerm('팀 회의');
  });

  expect(result.current.filteredEvents).toHaveLength(1);
  expect(result.current.filteredEvents[0].title).toBe('팀 회의');

  act(() => {
    result.current.setSearchTerm('동료와 점심');
  });
  expect(result.current.filteredEvents).toHaveLength(1);
  expect(result.current.filteredEvents[0].title).toBe('점심 약속');

  act(() => {
    result.current.setSearchTerm('헬스장');
  });

  expect(result.current.filteredEvents).toHaveLength(1);
  expect(result.current.filteredEvents[0].title).toBe('운동');
});

it('현재 뷰(주간/월간)에 해당하는 이벤트만 반환해야 한다', () => {
  const { result: monthResult } = renderHook(() => useSearch(mockEventsList, testDate, 'month'));

  expect(monthResult.current.filteredEvents).toHaveLength(mockEventsList.length);

  const { result: weekResult } = renderHook(() => useSearch(mockEventsList, testDate, 'week'));

  expect(weekResult.current.filteredEvents).toHaveLength(0);
});

it("검색어를 '회의'에서 '점심'으로 변경하면 필터링된 결과가 즉시 업데이트되어야 한다", () => {
  // 왜 new Date('2024-11-01')대신 testDate를 쓰면 테스트 통과가 되지 않을까...
  const { result } = renderHook(() => useSearch(mockEventsList, new Date('2024-11-01'), 'month'));

  act(() => {
    result.current.setSearchTerm('회의');
  });

  expect(result.current.filteredEvents[0]).toEqual(events[0]);

  act(() => {
    result.current.setSearchTerm('점심');
  });

  expect(result.current.filteredEvents[0]).toEqual(events[1]);
});
