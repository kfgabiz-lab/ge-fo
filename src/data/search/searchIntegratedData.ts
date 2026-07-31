export type IntegratedSearchResponse =
    Record<string, unknown>;

/**
 * chatbot에서 추출한 keyword로 통합검색 API 호출
 */
export async function fetchIntegratedSearch(
    keyword: string,
    type: string,
    pageNumber: string,
    signal?: AbortSignal,
): Promise<IntegratedSearchResponse> {
    const trimmedKeyword = keyword.trim();

    if (!trimmedKeyword) {
        throw new Error(
            "통합검색 keyword가 없습니다.",
        );
    }

    const searchParams = new URLSearchParams({
        keyword: trimmedKeyword,
        type,
        pageNumber,
    });

    const response = await fetch(
        `/api/v1/fo/search/integrated?${searchParams.toString()}`,
        {
            method: "GET",
            headers: {
                Accept: "application/json",
            },
            cache: "no-store",
            signal,
        },
    );

    if (!response.ok) {
        const errorBody = await response.text();

        throw new Error(
            `통합검색 API 호출 실패: ${response.status} ${errorBody}`,
        );
    }

    return response.json() as Promise<IntegratedSearchResponse>;
}