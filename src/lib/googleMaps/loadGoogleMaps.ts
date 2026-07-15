// Google Maps JS API 로더
// - 공식 "동적 라이브러리 임포트 부트스트랩 로더"를 설치한 뒤 core(maps) 라이브러리 로딩까지
//   끝난 상태의 window.google.maps 를 resolve 한다.
// - 부트스트랩 로더는 importLibrary 호출을 내부 큐에 쌓아뒀다가 실제 스크립트 로딩이 끝나면
//   순서대로 처리하므로, "언제 importLibrary 가 붙는지"에 대한 레이스 컨디션 자체가 없다.

// 부트스트랩 로더가 설치/사용하는 google.maps 내부 슬롯 타입
type ImportLibraryFn = (name: string, ...rest: unknown[]) => Promise<unknown>;

type BootstrapMaps = {
  importLibrary?: ImportLibraryFn;
  __ib__?: (value?: void | PromiseLike<void>) => void;
  Map?: unknown;
  [key: string]: unknown;
};

// 부트스트랩 로더가 이미 설치되었는지(중복 설치 방지) 및 core 로딩 결과 캐시
let bootstrapInstalled = false;
let loadPromise: Promise<typeof google.maps> | null = null;

export function getGoogleMapsApiKey(): string | undefined {
  return process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
}

// 공식 동적 라이브러리 임포트 부트스트랩 로더 (타입만 최소 보강, 로직 동일)
// g: { key, v, ... } 형태의 로더 설정
function installBootstrapLoader(g: Record<string, string>): void {
  const p = "The Google Maps JavaScript API";
  const c = "google";
  const l = "importLibrary";
  const q = "__ib__";
  const m = document;
  const w = window as unknown as { google?: { maps?: BootstrapMaps } };

  const googleObj = w.google || (w.google = {});
  const maps: BootstrapMaps = googleObj.maps || (googleObj.maps = {});
  const libraries = new Set<string>();
  const params = new URLSearchParams();

  // 실제 스크립트 <script> 를 한 번만 삽입하고, 로딩 완료(callback)를 기다리는 Promise
  let loaderPromise: Promise<void> | undefined;
  const bootstrap = (): Promise<void> =>
    loaderPromise ||
    (loaderPromise = new Promise<void>((resolve, reject) => {
      const a = m.createElement("script");
      params.set("libraries", [...libraries] + "");
      for (const k in g) {
        params.set(k.replace(/[A-Z]/g, (t) => "_" + t[0].toLowerCase()), g[k]);
      }
      params.set("callback", c + ".maps." + q);
      a.src = `https://maps.${c}apis.com/maps/api/js?` + params;
      // 스크립트 로딩이 끝나면 API 가 google.maps.__ib__ 를 호출하여 resolve 한다.
      maps[q] = resolve;
      a.onerror = () => {
        // 실패 시 다음 호출에서 재시도할 수 있도록 로더 Promise 초기화
        loaderPromise = undefined;
        reject(new Error(p + " could not load."));
      };
      a.nonce =
        (m.querySelector("script[nonce]") as HTMLElement | null)?.nonce || "";
      m.head.append(a);
    }));

  if (maps[l]) {
    // 이미 설치된 경우 재설치하지 않는다.
    console.warn(p + " only loads once. Ignoring:", g);
    return;
  }

  // importLibrary 호출을 큐에 모아두고, 최초 호출 시 스크립트 로딩을 트리거한다.
  maps[l] = (name: string, ...rest: unknown[]) =>
    libraries.add(name) &&
    bootstrap().then(() => (maps[l] as ImportLibraryFn)(name, ...rest));
}

export function loadGoogleMaps(apiKey: string): Promise<typeof google.maps> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Google Maps can only load in the browser."));
  }

  // core(Map 등)까지 이미 사용 가능한 상태면 즉시 재사용 (리렌더/재마운트 대비)
  const currentMaps = window.google?.maps as BootstrapMaps | undefined;
  if (currentMaps?.Map) {
    return Promise.resolve(window.google!.maps);
  }

  if (loadPromise) {
    return loadPromise;
  }

  loadPromise = (async () => {
    // 부트스트랩 로더는 한 번만 설치한다.
    if (!bootstrapInstalled) {
      installBootstrapLoader({ key: apiKey, v: "weekly" });
      bootstrapInstalled = true;
    }
    // core 라이브러리 로딩이 끝나야 window.google.maps.Map 등이 사용 가능해진다.
    await window.google!.maps.importLibrary("maps");
    return window.google!.maps;
  })().catch((error) => {
    // 실패 시 다음 시도를 위해 캐시 초기화
    loadPromise = null;
    throw error;
  });

  return loadPromise;
}
