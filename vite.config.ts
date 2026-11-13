import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

// `vite build --mode artifact` gera um único HTML (rotas por #hash, dados no navegador)
// para revisão/compartilhamento. O build normal é o app de produção (Vercel).
export default defineConfig(({ mode }) => {
  const artifact = mode === 'artifact';
  return {
    plugins: [react(), tailwindcss(), ...(artifact ? [viteSingleFile({ removeViteModuleLoader: true })] : [])],
    build: artifact ? { outDir: 'dist-artifact', emptyOutDir: true, assetsInlineLimit: 100_000_000 } : undefined,
    server: { port: 3000, host: true },
  };
});
