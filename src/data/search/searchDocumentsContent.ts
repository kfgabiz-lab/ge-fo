import {
  searchProductCategories,
  searchProductDocumentTypes,
} from "@/data/search/searchProductsContent";
import type { DownloadFilterOption } from "@/data/support/downloadCenterContent";
import type {
  DownloadCenterFile,
  DownloadCenterItem,
  DownloadCenterVersion,
} from "@/data/support/downloadCenterData";

/** Figma 6430:111072 — Search Documents tab + filter */
export const searchDocumentsPage = {
  totalResults: 2658,
  pageSize: 10,
} as const;

// Documents 탭은 정적 데모라 URL 검색어(q)가 없다. 퍼블리싱 원본에서 제목/파일명에 강조되던
// 데모 키워드를 카드 searchTerm 으로 고정 전달해 강조 표기를 유지한다(실데이터 연동은 범위 밖).
export const searchDocumentsDemoKeyword = "DC Device";

/** Figma 6571:104998 — default active filter chips (demo; driven by filter provider) */
export const searchDocumentActiveFilterDefaults = [
  { id: "search-document-category-mccb-susol-ul", group: "Category", value: "Susol UL MCCB" },
  { id: "search-document-type-catalogs", group: "Types", value: "Catalog" },
  { id: "search-document-type-manuals", group: "Types", value: "Manuals" },
] as const;

export const searchDocumentCategories = searchProductCategories;

export const searchDocumentTypes: DownloadFilterOption[] = searchProductDocumentTypes;

// 목업 파일 1건 생성. 실 API(DownloadCenterFile) 와 동일 shape.
// - filePath 는 목업이라 null(다운로드/Copy Link 는 로컬 CTP 미연동과 동일하게 no-op).
function mockDownloadFile(
  fileId: number,
  fileName: string,
  fileSizeText: string,
): DownloadCenterFile {
  return {
    fileId,
    fileName,
    fileExt: null,
    fileSize: null,
    fileSizeText,
    sourceSystem: null,
    filePath: null,
  };
}

// 단일 버전(파일 묶음) 생성. sortKey 클수록 최신(실 API 규칙과 동일).
function mockVersion(
  versionId: number,
  versionName: string,
  sortKey: number,
  files: DownloadCenterFile[],
): DownloadCenterVersion {
  return { versionId, versionName, sortKey, files };
}

const catalogFiles: DownloadCenterFile[] = [
  mockDownloadFile(1, "MC-800a, 630a, 500a.pdf", "12.09MB"),
  mockDownloadFile(2, "Metasol MS_MC-800a_500-800A_3P_2D CAD.pdf", "5.23MB"),
];

const manualFiles: DownloadCenterFile[] = [
  mockDownloadFile(3, "LS_Solution_Overview_EN_CZZZ02-04-202603 DC Device", ""),
  mockDownloadFile(4, "[HVDC_and_FACTS]_EN_C84602-02-201905.pdf", "4.62MB"),
  mockDownloadFile(5, "MC-800a, 630a, 500a.pdf", "12.09MB"),
  mockDownloadFile(6, "Metasol MS_MC-800a_500-800A_3P_2D CAD.pdf", "5.23MB"),
];

// 다버전(V38.0 / V37.0). 첫 버전(sortKey 큰 쪽)이 최신.
function multiVersion(files: DownloadCenterFile[]): DownloadCenterVersion[] {
  return [
    mockVersion(380, "V38.0", 2, files),
    mockVersion(370, "V37.0", 1, files),
  ];
}

/** Figma 6430:111082 · 111083 · 111085 — document card templates */
const documentTemplates: DownloadCenterItem[] = [
  {
    id: 1,
    docType: "C",
    docTypeLabel: "Catalog",
    title: "LV SWGR Smart LV Solution DC Device",
    date: "2025-12-09",
    categoryL1Id: null,
    categoryL2Id: null,
    versions: multiVersion(catalogFiles),
  },
  {
    id: 2,
    docType: "C",
    docTypeLabel: "Catalog",
    title: "DC Device LV SWGR Smart LV Solution",
    date: "2025-12-09",
    categoryL1Id: null,
    categoryL2Id: null,
    versions: [mockVersion(380, "V38.0", 2, catalogFiles)],
  },
  {
    id: 3,
    docType: "M",
    docTypeLabel: "Manual",
    title: "EMPR [UL SPD]USPE Series Manual DC Device",
    date: "2025-12-09",
    categoryL1Id: null,
    categoryL2Id: null,
    versions: multiVersion(manualFiles),
  },
];

/** Figma 6430:111072 — page 1 accordion order */
const searchDocumentsFirstPageTemplateIndices = [0, 1, 0, 2, 0, 0, 0, 1, 0, 0] as const;

const documentPool: DownloadCenterItem[] = searchDocumentsFirstPageTemplateIndices.map(
  (templateIndex, slotIndex) => {
    const source = documentTemplates[templateIndex];
    return {
      ...source,
      id: slotIndex + 1,
    };
  },
);

export function getSearchDocumentPageItems(
  page: number,
  pageSize: number,
): DownloadCenterItem[] {
  const start = (page - 1) * pageSize;
  const items: DownloadCenterItem[] = [];

  for (let i = 0; i < pageSize; i++) {
    const globalIndex = start + i;
    const source = documentPool[globalIndex % documentPool.length];
    items.push({
      ...source,
      id: globalIndex + 1,
    });
  }

  return items;
}
