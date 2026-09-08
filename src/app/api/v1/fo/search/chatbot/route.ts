import { NextRequest } from "next/server";

import { SERVER_API_BASE } from "@/lib/api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

const CHATBOT_ENDPOINT = "/api/v1/fo/search/chatbot";

const FORWARDED_REQUEST_HEADERS = [
  "content-type",
  "accept",
  "accept-language",
  "x-site-id",
];

export async function POST(request: NextRequest) {
  const body = await request.text();

  const upstreamHeaders = new Headers();
  for (const name of FORWARDED_REQUEST_HEADERS) {
    const value = request.headers.get(name);
    if (value) {
      upstreamHeaders.set(name, value);
    }
  }
  if (!upstreamHeaders.has("content-type")) {
    upstreamHeaders.set("content-type", "application/json");
  }
  if (!upstreamHeaders.has("accept")) {
    upstreamHeaders.set("accept", "text/event-stream");
  }
  upstreamHeaders.set("accept-encoding", "identity");

  const upstream = await fetch(`${SERVER_API_BASE}${CHATBOT_ENDPOINT}`, {
    method: "POST",
    headers: upstreamHeaders,
    body,
    cache: "no-store",
    signal: request.signal,
  });

  const responseHeaders = new Headers();
  responseHeaders.set(
    "Content-Type",
    upstream.headers.get("content-type") || "text/event-stream",
  );
  responseHeaders.set(
    "Cache-Control",
    "no-cache, no-store, no-transform, must-revalidate",
  );
  responseHeaders.set("Content-Encoding", "identity");
  responseHeaders.set("X-Accel-Buffering", "no");

  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: responseHeaders,
  });
}
