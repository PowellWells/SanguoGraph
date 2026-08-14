import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

interface PackageMetadata {
  name?: unknown;
  version?: unknown;
  license?: unknown;
}

const errors: string[] = [];

async function readProjectFile(path: string): Promise<string> {
  return readFile(resolve(path), 'utf8');
}

const [packageText, dataLicense, appSource, aboutSource, rootIndex] =
  await Promise.all([
    readProjectFile('package.json'),
    readProjectFile('LICENSE-DATA'),
    readProjectFile('src/App.tsx'),
    readProjectFile('src/pages/AboutPage.tsx'),
    readProjectFile('index.html'),
  ]);

const packageMetadata = JSON.parse(packageText) as PackageMetadata;

if (packageMetadata.name !== 'sanguo-graph') {
  errors.push('package.json 项目名称不是 sanguo-graph。');
}

if (packageMetadata.version !== '1.0.0') {
  errors.push('稳定版 package.json 版本必须为 1.0.0。');
}

if (packageMetadata.license !== 'MIT') {
  errors.push('软件包许可证必须继续保持 MIT。');
}

const requiredLicenseNotices = [
  'Creative Commons Attribution 4.0',
  'International Public License',
  'https://creativecommons.org/licenses/by/4.0/',
  'https://creativecommons.org/licenses/by/4.0/legalcode',
  '数据来源：三国人物关系谱 · SanguoGraph（CC BY 4.0）',
  'software code',
  'quotations or excerpts',
  'data/processed',
] as const;

for (const notice of requiredLicenseNotices) {
  if (!dataLicense.includes(notice)) {
    errors.push(`LICENSE-DATA 缺少必要范围或署名声明：${notice}`);
  }
}

if (!appSource.includes('正式数据 CC BY 4.0')) {
  errors.push('应用页脚没有显示正式数据 CC BY 4.0。');
}

if (
  !aboutSource.includes('数据来源：三国人物关系谱 ·') ||
  !aboutSource.includes('SanguoGraph') ||
  !aboutSource.includes('https://creativecommons.org/licenses/by/4.0/')
) {
  errors.push('关于页缺少正式数据署名方式或许可证链接。');
}

if (
  !rootIndex.includes('id="offline-entry-redirect"') ||
  !rootIndex.includes('./offline/index.html')
) {
  errors.push('根目录 index.html 缺少直接打开离线版的跳转。');
}

if (errors.length > 0) {
  console.error('稳定版发布校验失败：');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exitCode = 1;
} else {
  console.log('稳定版发布校验通过：v1.0.0，代码 MIT，正式数据 CC BY 4.0。');
}
