export default function truncateTitle(
  title: string,
  limit: number = 20,
): string {
  if (title.length <= limit) return title;
  return title.slice(0, limit).trimEnd() + "…";
}
