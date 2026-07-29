
type TitleMap = ReadonlyMap<string, string>;

const EMPTY_MAP: TitleMap = new Map();

let snapshot: TitleMap = EMPTY_MAP;
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
