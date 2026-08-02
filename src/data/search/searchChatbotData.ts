export type ChatbotKeywordEvent = {
    session_id: string;
    domain: string;
    keyword: string;
    related_keywords: string[];
    matched: boolean;
    source: string;
};

export type ChatbotChunkEvent = {
    session_id: string;
    domain: string;
    chunk: string;
};

type ChatbotStreamCallbacks = {
    onKeyword?: (event: ChatbotKeywordEvent) => void;
    onChunk?: (event: ChatbotChunkEvent) => void;
    onCompleted?: (data: unknown) => void;
};

export async function fetchChatbotStream(
    query: string,
    callbacks: ChatbotStreamCallbacks,
    signal?: AbortSignal,
): Promise<void> {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
        return;
    }

    const response = await fetch(
        "http://localhost:8080/api/v1/fo/search/chatbot",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "text/event-stream",
            },
            credentials: "omit",
            body: JSON.stringify({
                query: trimmedQuery,
                data_market: "GLOBAL",
                web_enabled: "false",
            }),
            signal,
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

            const eventBlocks =
                buffer.split(/\r?\n\r?\n/);

            buffer = eventBlocks.pop() ?? "";

            for (const eventBlock of eventBlocks) {
                handleSseEventBlock(
                    eventBlock,
                    callbacks,
                );
            }
        }

        buffer += decoder.decode();

        if (buffer.trim()) {
            handleSseEventBlock(
                buffer,
                callbacks,
            );
        }
    } finally {
        reader.releaseLock();
    }
}

function handleSseEventBlock(
    eventBlock: string,
    callbacks: ChatbotStreamCallbacks,
): void {
    let eventName = "";
    const dataLines: string[] = [];

    for (const line of eventBlock.split(/\r?\n/)) {
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

    if (!eventName || !rawData) {
        return;
    }

    try {
        switch (eventName) {
            case "response.keyword": {
                const event =
                    JSON.parse(
                        rawData,
                    ) as ChatbotKeywordEvent;

                callbacks.onKeyword?.(event);
                break;
            }

            case "response.chunk": {
                const event =
                    JSON.parse(
                        rawData,
                    ) as ChatbotChunkEvent;

                callbacks.onChunk?.(event);
                break;
            }

            case "response.completed": {
                callbacks.onCompleted?.(
                    JSON.parse(rawData),
                );
                break;
            }
        }
    } catch {
    }
}