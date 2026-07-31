import type {
    IntegratedSearchResponse,
} from "@/data/search/searchTypes";

/**
 * 통합검색 API 호출.
 *
 * 호출 예:
 * /api/v1/fo/search/integration?keyword=SPD&type=all
 */
export async function getIntegrationSearch(
    keyword: string,
    type = "all",
): Promise<IntegratedSearchResponse> {
    const trimmedKeyword = keyword.trim();

    if (!trimmedKeyword) {
        throw new Error("통합검색 keyword가 없습니다.");
    }

    const searchParams = new URLSearchParams({
        keyword: trimmedKeyword,
        type,
    });

    const response = await fetch(
        `/api/v1/fo/search/integrated?${searchParams.toString()}`,
        {
            method: "GET",
            headers: {
                Accept: "application/json",
            },
            cache: "no-store",
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