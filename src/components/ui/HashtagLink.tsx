import { buildSearchAllHref } from "@/data/search/searchAllContent";

type HashtagLinkProps = {
  tag: string;
  className?: string;
};

export default function HashtagLink({ tag, className }: HashtagLinkProps) {
  const keyword = tag.replace(/^#/, "");

  return (
    <a href={buildSearchAllHref(keyword)} className={className}>
      {tag}
    </a>
  );
}
