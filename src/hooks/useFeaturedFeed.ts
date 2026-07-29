"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { PageDataItem } from "@/lib/pageData";
import { fetchData } from "@/lib/pageDataApi";

export interface UseFeaturedFeedParams<TCard> {
  slug: string;
  where?: Record<string, string>;
  sort?: string;
  toCard: (row: PageDataItem) => TCard;
}

export interface UseFeaturedFeedResult<TCard> {
  featured: TCard | null;
  featuredRow: PageDataItem | null;
  featuredId: number | null;
  excludeWhere: Record<string, string>;
  loaded: boolean;
  error: Error | null;
}

export function useFeaturedFeed<TCard>({
  slug,
  where,
  sort = "createdAt,desc",
  toCard,
}: UseFeaturedFeedParams<TCard>): UseFeaturedFeedResult<TCard> {
  const queryRef = useRef({ slug, where, sort });

  const [featuredRow, setFeaturedRow] = useState<PageDataItem | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let alive = true;
    const query = queryRef.current;
    fetchData({
      slug: query.slug,
      size: 1,
      sort: query.sort,
      where: { ...(query.where ?? {}) },
      리턴함수: (rows) => rows,
    })
      .then((res) => {
        if (!alive) return;
        setFeaturedRow(res.content[0] ?? null);
        setLoaded(true);
      })
      .catch((e: unknown) => {
        if (!alive) return;
        setFeaturedRow(null);
        setError(e instanceof Error ? e : new Error(String(e)));
        setLoaded(true);
      });
    return () => {
      alive = false;
    };
  }, []);

  const featured = useMemo(
    () => (featuredRow ? toCard(featuredRow) : null),
    [featuredRow, toCard],
  );

  const featuredId = featuredRow?.id ?? null;

  const excludeWhere = useMemo<Record<string, string>>(() => {
    const next: Record<string, string> = {};
    if (featuredId != null) next.ne_id = String(featuredId);
    return next;
  }, [featuredId]);

  return { featured, featuredRow, featuredId, excludeWhere, loaded, error };
}
