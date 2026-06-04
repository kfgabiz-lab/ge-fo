import { fetchApi } from '@/lib/api/client';
import type { FoGnbMenuResponse } from '@/types/api/fo/gnb';

/**
 * FO GNB 메뉴 목록 조회
 * 사용법: const menus = await fetchGnbMenus()
 * - visible=true 루트 메뉴 + 자식 메뉴 트리 반환
 */
export async function fetchGnbMenus(): Promise<FoGnbMenuResponse[]> {
  return fetchApi<FoGnbMenuResponse[]>('/fo/menus/gnb');
}
