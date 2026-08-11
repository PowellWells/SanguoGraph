import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { frontendPolicyGuard } from './scripts/frontend-policy-guard';

export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/SanguoGraph/' : '/',
  plugins: [react(), frontendPolicyGuard()],
}));
