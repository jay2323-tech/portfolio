export function readingLabel(body: string) {
 const words = body.trim().split(/\s+/).filter(Boolean).length;
 return words < 200 ? "Under 1 min read" : `${Math.ceil(words / 200)} min read`;
}
