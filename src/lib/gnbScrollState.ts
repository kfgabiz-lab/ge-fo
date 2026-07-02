/** GNB 스크롤 상태 갱신 — 앵커·쿨다운으로 빠른 스크롤 시 깜빡임 완화 */
export const GNB_SCROLL_THROTTLE_MS = 220;
export const GNB_SCROLL_DIRECTION_DELTA = 80;
export const GNB_SCROLL_MODE_COOLDOWN_MS = 320;

const TOP_LEAVE_HYSTERESIS_MIN_PX = 8;

export type GnbScrollVisibility = "visible" | "hidden";

/** main(80) 등 threshold가 클수록 leave 구간을 넓혀 is-at-top 토글 완화 */
export function getTopLeaveHysteresis(topThreshold: number): number {
  return Math.max(TOP_LEAVE_HYSTERESIS_MIN_PX, Math.round(topThreshold * 0.12));
}

export function resolveAtTop(
  currentScrollY: number,
  wasAtTop: boolean,
  topThreshold: number,
): boolean {
  const leaveAt = topThreshold + getTopLeaveHysteresis(topThreshold);

  if (wasAtTop) {
    return currentScrollY <= leaveAt;
  }
  return currentScrollY <= topThreshold;
}

type ResolveGnbScrollVisibilityOptions = {
  currentScrollY: number;
  anchorScrollY: number;
  topThreshold: number;
  hideOnScroll: boolean;
  currentVisibility: GnbScrollVisibility;
  lastModeChangeAt: number;
  wasAtTop?: boolean;
  now?: number;
};

type GnbScrollVisibilityResult = {
  visibility: GnbScrollVisibility;
  isAtTop: boolean;
  anchorScrollY: number;
  lastModeChangeAt: number;
};

/** 마지막 전환 위치(앵커) 기준 누적 이동량 + 쿨다운으로 hidden/visible 전환 */
export function resolveGnbScrollVisibility({
  currentScrollY,
  anchorScrollY,
  topThreshold,
  hideOnScroll,
  currentVisibility,
  lastModeChangeAt,
  wasAtTop,
  now = Date.now(),
}: ResolveGnbScrollVisibilityOptions): GnbScrollVisibilityResult {
  const isAtTop =
    wasAtTop !== undefined
      ? resolveAtTop(currentScrollY, wasAtTop, topThreshold)
      : currentScrollY <= topThreshold;

  if (isAtTop) {
    return {
      visibility: "visible",
      isAtTop: true,
      anchorScrollY: currentScrollY,
      lastModeChangeAt: now,
    };
  }

  if (!hideOnScroll) {
    return {
      visibility: "visible",
      isAtTop: false,
      anchorScrollY: currentScrollY,
      lastModeChangeAt,
    };
  }

  // hidden 중 추가 하강·visible 중 추가 상승 시 앵커를 갱신해 반대 방향 전환이 현재 위치 기준으로 동작하게 함
  let activeAnchor = anchorScrollY;
  if (currentVisibility === "hidden") {
    if (currentScrollY > activeAnchor) {
      activeAnchor = currentScrollY;
    }
  } else if (currentScrollY < activeAnchor) {
    activeAnchor = currentScrollY;
  }

  const travel = currentScrollY - activeAnchor;
  let nextVisibility = currentVisibility;

  if (travel >= GNB_SCROLL_DIRECTION_DELTA) {
    nextVisibility = "hidden";
  } else if (travel <= -GNB_SCROLL_DIRECTION_DELTA) {
    nextVisibility = "visible";
  }

  if (nextVisibility === currentVisibility) {
    return {
      visibility: currentVisibility,
      isAtTop: false,
      anchorScrollY: activeAnchor,
      lastModeChangeAt,
    };
  }

  if (now - lastModeChangeAt < GNB_SCROLL_MODE_COOLDOWN_MS) {
    return {
      visibility: currentVisibility,
      isAtTop: false,
      anchorScrollY: activeAnchor,
      lastModeChangeAt,
    };
  }

  return {
    visibility: nextVisibility,
    isAtTop: false,
    anchorScrollY: currentScrollY,
    lastModeChangeAt: now,
  };
}
