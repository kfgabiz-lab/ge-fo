
type TitleMap = ReadonlyMap<string, string>;
type CrumbHrefMap = ReadonlyMap<string, ReadonlyMap<string, string>>;

const EMPTY_MAP: TitleMap = new Map();
const EMPTY_CRUMB_HREF_MAP: CrumbHrefMap = new Map();

let snapshot: TitleMap = EMPTY_MAP;
let crumbHrefSnapshot: CrumbHrefMap = EMPTY_CRUMB_HREF_MAP;
const listeners = new Set<() => void>();

function emit(): void {
  for (const listener of listeners) listener();
}

export function seedBreadcrumbTitle(
  pathname: string,
  title: string | undefined | null,
): void {
  if (!pathname || !title) return;
  if (snapshot.get(pathname) === title) return;
  const next = new Map(snapshot);
  next.set(pathname, title);
  snapshot = next;
  emit();
}

export function seedBreadcrumbCrumbHref(
  pathname: string,
  label: string,
  href: string | undefined | null,
): void {
  if (!pathname || !label || !href) return;
  if (crumbHrefSnapshot.get(pathname)?.get(label) === href) return;
  const nextLabelMap = new Map(crumbHrefSnapshot.get(pathname));
  nextLabelMap.set(label, href);
  const next = new Map(crumbHrefSnapshot);
  next.set(pathname, nextLabelMap);
  crumbHrefSnapshot = next;
  emit();
}

export function subscribeBreadcrumbTitles(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getBreadcrumbTitlesSnapshot(): TitleMap {
  return snapshot;
}

export function getBreadcrumbTitlesServerSnapshot(): TitleMap {
  return EMPTY_MAP;
}

export function getBreadcrumbCrumbHrefsSnapshot(): CrumbHrefMap {
  return crumbHrefSnapshot;
}

export function getBreadcrumbCrumbHrefsServerSnapshot(): CrumbHrefMap {
  return EMPTY_CRUMB_HREF_MAP;
}
