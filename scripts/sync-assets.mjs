import { readdir, mkdir, copyFile } from 'node:fs/promises';
import path from 'node:path';
async function walk(dir) {
 for (const e of await readdir(dir,{withFileTypes:true})) {
  const source=path.join(dir,e.name);
  if (e.isDirectory()) await walk(source);
  else if (!source.endsWith('.md')) {
   const dest=path.join('public','media',path.basename(dir),e.name);
   await mkdir(path.dirname(dest),{recursive:true}); await copyFile(source,dest);
  }
 }
}
await walk('contents/posts');
