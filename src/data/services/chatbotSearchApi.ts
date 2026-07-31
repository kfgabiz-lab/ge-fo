import type {
    ChatbotSearchRequest,
} from "@/data/search/searchTypes";

export type ChatbotSseEventHandler = (
    eventName: string,
    rawData: string,
) => void;

/**
 * 챗봇 POST SSE API 호출.
 */
export async function streamChatbotSearch(
    requestBody: ChatbotSearchRequest,
    onEvent: ChatbotSseEventHandler,
): Promise<void> {
    const response = await fetch(
        "/api/v1/fo/search/chatbot",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "text/event-stream",
            },
            body: JSON.stringify(requestBody),
        },
    );

    if (!response.ok) {
        const errorBody = await response.text();

        throw new Error(
            `챗봇 API 호출 실패: ${response.status} ${errorBody}`,
        );
    }

    if (!response.body) {
        throw new Error("챗봇 스트리밍 응답이 없습니다.");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");

    let buffer = "";

    try {
        while (true) {
            const { value, done } = await reader.read();

            if (done) {
                break;
            }

            buffer += decoder.decode(value, {
                stream: true,
            });

            /*
             * SSE 이벤트는 빈 줄로 구분된다.
             */
            const eventBlocks =
                buffer.split(/\r?\n\r?\n/);

            /*
             * 마지막 블록은 아직 완성되지 않았을 수 있다.
             */
            buffer = eventBlocks.pop() ?? "";

            for (const eventBlock of eventBlocks) {
                parseSseEventBlock(
                    eventBlock,
                    onEvent,
                );
            }
        }

        buffer += decoder.decode();

        if (buffer.trim()) {
            parseSseEventBlock(buffer, onEvent);
        }
    } finally {
        reader.releaseLock();
    }
}

/**
 * SSE 이벤트 블록 하나를 파싱한다.
 *
 * 예:
 * event: response.keyword
 * data: {"keyword":"SPD"}
 */
function parseSseEventBlock(
    eventBlock: string,
    onEvent: ChatbotSseEventHandler,
): void {
    let eventName = "";
    const dataLines: string[] = [];

    const lines = eventBlock.split(/\r?\n/);

    for (const line of lines) {
        /*
         * SSE heartbeat 또는 주석은 무시한다.
         */
        if (line.startsWith(":")) {
            continue;
        }

        if (line.startsWith("event:")) {
            eventName = line
                .substring("event:".length)
                .trim();

            continue;
        }

        if (line.startsWith("data:")) {
            dataLines.push(
                line
                    .substring("data:".length)
                    .trimStart(),
            );
        }
    }

    const rawData = dataLines.join("\n");

    /*
     * 로그에 있던 event=null, data=null 형태는 무시한다.
     */
    if (!eventName || !rawData) {
        return;
    }

    onEvent(eventName, rawData);
}