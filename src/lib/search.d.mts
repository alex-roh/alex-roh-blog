export interface SearchPost { title: string; url: string; body: string; description: string; }
export function normalize(value: string): string;
export function searchPosts(posts: SearchPost[], query: string): (SearchPost & { score: number; snippet: string })[];
