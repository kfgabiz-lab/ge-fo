/**
 * FO GNB 메뉴 API 응답 타입 — BE FoGnbMenuResponse DTO와 동일
 * 사용법: import type { FoGnbMenuResponse } from '@/types/api/fo/gnb'
 */
export type FoGnbMenuResponse = {
  id: number;
  name: string;
  nameMsgKey: string;
  url: string;
  icon: string;
  sortOrder: number;
  children: FoGnbMenuResponse[];
};
