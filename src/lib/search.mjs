export const normalize = value => value.normalize('NFKC').toLocaleLowerCase().replace(/\s+/g, ' ').trim();
export function searchPosts(posts, query) {
  const needle = normalize(query);
  if (!needle) return [];
  return posts.map(post => {
    const title = normalize(post.title);
    const body = normalize(post.body);
    const offset = body.indexOf(needle);
    const score = title.includes(needle) ? 2 : offset >= 0 ? 1 : 0;
    const start = Math.max(0, offset - 55);
    return {...post, score, snippet: offset >= 0 ? `${start ? '…' : ''}${body.slice(start,start+180)}…` : post.description};
  }).filter(post => post.score > 0).sort((a,b) => b.score-a.score);
}
