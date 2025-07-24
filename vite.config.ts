import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode, command }) => {
    const env = loadEnv(mode, '.', '');

    // 在生产环境构建时使用 GitHub Pages 的子路径
    const base = command === 'build' ? '/Dict-e-de-Nombres/' : '/';

    return {
      base,
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
