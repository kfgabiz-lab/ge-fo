import type {
  DownloadCategoryOption,
  DownloadFilterOption,
} from "@/data/support/downloadCenterContent";

// ⚠️ 이 파일의 카테고리/문서유형 정적 데이터는 범위 밖 Documents 탭(searchDocumentsContent.ts)이
//    재사용한다. Products 탭 실데이터 전환 후에도 Documents 의존 때문에 유지한다.

export const searchProductCategories: DownloadCategoryOption[] = [
  {
    id: "lv-products",
    label: "LV Products and Systems",
    count: 100,
    hasArrow: true,
    defaultExpanded: true,
    nested: [
      {
        id: "acb",
        label: "Air Circuit Breaker / Power Circuit Breaker",
        count: 60,
      },
      {
        id: "mccb",
        label: "Molded Case Circuit Breaker",
        count: 60,
      },
      {
        id: "mccb-susol-ul",
        label: "Susol UL MCCB",
        count: 30,
      },
      {
        id: "mccb-susol-smart",
        label: "Susol UL Smart MCCB",
        count: 10,
      },
      {
        id: "mccb-susol-1kv",
        label: "Susol UL MCCB(up to 1000V)",
        count: 20,
      },
      { id: "mcb", label: "Miniature Circuit Breaker", count: 100 },
      { id: "spd", label: "Surge Protective Device", count: 60 },
      { id: "ul67", label: "UL67 Panelboard", count: 100 },
      { id: "rpp", label: "Remote Power Panel", count: 100 },
      { id: "ul891", label: "UL891 Switchboard", count: 100 },
      { id: "ul1558", label: "UL1558 Switchgear", count: 100 },
      { id: "ehouse", label: "E House", count: 100 },
      { id: "contactor", label: "Magnetic Contactor", count: 60 },
      { id: "vfd", label: "Variable Fequency Drive", count: 100 },
    ],
  },
  {
    id: "mv-products",
    label: "MV Products and Systems",
    count: 100,
    hasArrow: true,
  },
  {
    id: "hv-systems",
    label: "HV Systems",
    count: 100,
    hasArrow: true,
  },
  {
    id: "dc-devices",
    label: "DC Products",
    count: 100,
    hasArrow: true,
  },
  {
    id: "iac",
    label: "Industrial Automation and Control",
    count: 100,
    hasArrow: true,
  },
  {
    id: "software",
    label: "Software",
    count: 100,
    hasArrow: true,
  },
];

export const searchProductDocumentTypes: DownloadFilterOption[] = [
  { id: "catalogs", label: "Catalogs", count: 100 },
  { id: "manuals", label: "Manuals", count: 100 },
  { id: "drawings", label: "Drawings", count: 100 },
  { id: "certificates", label: "Certificates", count: 100 },
  { id: "software", label: "Software", count: 100 },
  { id: "tech", label: "Tech Data", count: 100 },
  { id: "firmware", label: "OS/Firmware", count: 0 },
];
