import test from 'node:test';
import assert from 'node:assert/strict';
import config from '../astro.config.mjs';
import { formatPublicationTime } from '../src/lib/publication.mjs';

test('the production Markdown pipeline renders inline and display math but preserves code', async () => {
  const renderer = await config.markdown.processor.createRenderer({});
  const opts = { fileURL: new URL('../contents/posts/enai601/enai601-convex-functions/index.md', import.meta.url) };
  const inline = (await renderer.render('본문 $f(x)=x^2$ 입니다.', opts)).code;
  assert.match(inline, /class="katex"/);
  assert.doesNotMatch(inline, /katex-display|katex-error/);
  const display = (await renderer.render('$$\nf(x)=x^2\n$$', opts)).code;
  assert.match(display, /katex-display/);
  const code = (await renderer.render('`$5` and `$f(x)$`', opts)).code;
  assert.doesNotMatch(code, /class="katex"/);
  assert.match(code, /<code>\$5<\/code>/);
});
test('publication times use the correct Eastern daylight and standard times across date boundaries', () => {
  assert.match(formatPublicationTime('2026-10-21T06:52:02Z'), /02:52.*EDT/);
  assert.match(formatPublicationTime('2026-12-01T04:30:00Z'), /11월 30일.*23:30.*EST/);
});
