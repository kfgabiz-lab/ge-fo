"use client";

import Link from "next/link";
import { buildSearchAllHref } from "@/data/search/searchAllContent";
import { logSearchKeyword } from "@/data/search/searchKeywordData";

type HashtagLinkProps = {
  tag: string;
  className?: string;
};

export default function HashtagLink({ tag, className }: HashtagLinkProps) {
  const keyword = tag.replace(/^#/, "");

  return (
    <Link
      href={buildSearchAllHref(keyword)}
      className={className}
      onClick={() => {
        void logSearchKeyword("UNIFIED_SEARCH", keyword);
      }}
    >
      {tag}
    </Link>
  );
}
