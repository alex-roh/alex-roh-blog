import { allPosts, postHref, excerpt } from '../lib/posts';
export async function GET() {
 const posts = await allPosts();
 return new Response(JSON.stringify(posts.map(p => ({title:p.data.title,url:postHref(p),body:p.body || '',description:excerpt(p)}))), {headers:{'Content-Type':'application/json; charset=utf-8'}});
}
