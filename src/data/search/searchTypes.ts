/**
 * 챗봇 호출 요청.
 *
 * 백엔드 ChatbotSearchRequest와 맞춘다.
 */
export type ChatbotSearchRequest = {
    query: string;
    data_market: string;
    web_enabled: string;
};

/**
 * 챗봇의 response.keyword 이벤트 데이터.
 */
export type ChatbotKeywordEvent = {
    session_id: string;
    domain: string;
    keyword: string;
    related_keywords: string[];
    matched: boolean;
    source: string;
};

/**
 * 챗봇의 response.chunk 이벤트 데이터.
 */
export type ChatbotChunkEvent = {
    session_id: string;
    domain: string;
    chunk: string;
};

/**
 * 챗봇의 response.completed 이벤트 데이터.
 */
export type ChatbotCompletedEvent = {
    session_id: string;
    domain: string;
    message_id: string;
    content: string;
    product_name: string | null;
    references: unknown[];
    actions: unknown[];
};

/**
 * 통합검색 결과 아이템.
 *
 * 실제 백엔드 응답이 확정되면 필드명을 맞춰서 수정한다.
 */
export type IntegratedSearchItem = {
    id: string;
    title: string;
    type: string;
    description: string;
    url: string;
};

/**
 * 통합검색 API 응답.
 */
export type IntegratedSearchResponse = {
    keyword: string;
    type: string;
    totalCount: number;
    items: IntegratedSearchItem[];
};