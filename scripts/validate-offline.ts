import { readFile, readdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { findForbiddenBundledReference } from './frontend-policy-guard';

const offlineDirectory = resolve('offline');
const offlineIndex = resolve(offlineDirectory, 'index.html');
const rootIndex = resolve('index.html');
const files = await readdir(offlineDirectory);
const errors: string[] = [];

if (files.length !== 1 || files[0] !== 'index.html') {
  errors.push(
    `offline 目录必须只包含 index.html，当前包含：${files.join(', ') || '空目录'}`,
  );
}

const html = await readFile(offlineIndex, 'utf8');
const rootHtml = await readFile(rootIndex, 'utf8');

if (
  !rootHtml.includes('id="offline-entry-redirect"') ||
  !rootHtml.includes('./offline/index.html')
) {
  errors.push('根目录 index.html 缺少本地离线入口。');
}

if (!html.includes('<script')) {
  errors.push('index.html 中没有内嵌 JavaScript。');
}

if (!html.includes('<style')) {
  errors.push('index.html 中没有内嵌 CSS。');
}

if (/<script\b[^>]*\bsrc\s*=/i.test(html)) {
  errors.push('index.html 仍引用外部 JavaScript 文件。');
}

if (/<link\b[^>]*\brel\s*=\s*["']?stylesheet["']?[^>]*>/i.test(html)) {
  errors.push('index.html 仍引用外部样式表。');
}

if (/(?:src|href)\s*=\s*["'](?:\/|\.\/)?assets\//i.test(html)) {
  errors.push('index.html 仍引用 assets 目录。');
}

if (/data\/processed\/graph\.json/i.test(html)) {
  errors.push('index.html 仍引用外部候选数据文件。');
}

if (html.includes('offline-entry-redirect')) {
  errors.push('离线文件不应包含根目录入口跳转。');
}

if (!html.includes('SanguoGraph') || !html.includes('id="root"')) {
  errors.push('index.html 缺少应用标题或 React 根节点。');
}

const forbiddenReference = findForbiddenBundledReference(html);
if (forbiddenReference) {
  errors.push(`离线文件包含禁止发布的外部知识平台标识：${forbiddenReference}`);
}

if (errors.length > 0) {
  console.error('离线单文件校验失败：');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exitCode = 1;
} else {
  const sizeInKiB = (Buffer.byteLength(html) / 1024).toFixed(1);
  console.log(`离线单文件校验通过：offline/index.html（${sizeInKiB} KiB）`);
}
