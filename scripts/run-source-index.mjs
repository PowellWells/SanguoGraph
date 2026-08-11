import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const scriptPath = fileURLToPath(
  new URL('./source_index.py', import.meta.url),
);

if (!existsSync(scriptPath)) {
  console.error(`史料索引脚本不存在：${scriptPath}`);
  process.exit(1);
}

const configuredPython = process.env.SANGUO_PYTHON?.trim();
const candidates = [
  ...(configuredPython
    ? [{ command: configuredPython, prefix: [] }]
    : []),
  ...(process.platform === 'win32'
    ? [{ command: 'py', prefix: ['-3'] }]
    : []),
  { command: 'python3', prefix: [] },
  { command: 'python', prefix: [] },
];

const selected = candidates.find(({ command, prefix }) => {
  const probe = spawnSync(command, [...prefix, '--version'], {
    encoding: 'utf8',
    windowsHide: true,
  });
  return probe.status === 0;
});

if (!selected) {
  console.error(
    '未找到 Python 3。可安装 Python，或通过 SANGUO_PYTHON 指定解释器。',
  );
  process.exit(1);
}

const result = spawnSync(
  selected.command,
  [...selected.prefix, scriptPath, ...process.argv.slice(2)],
  {
    cwd: process.cwd(),
    env: {
      ...process.env,
      PYTHONIOENCODING: 'utf-8',
      PYTHONUTF8: '1',
    },
    stdio: 'inherit',
    windowsHide: true,
  },
);

if (result.error) {
  console.error(`无法启动史料索引脚本：${result.error.message}`);
  process.exit(1);
}

process.exit(result.status ?? 1);
