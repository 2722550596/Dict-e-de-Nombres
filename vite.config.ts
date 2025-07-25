import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode, command }) => {
    const env = loadEnv(mode, '.', '');

    // 根据环境变量决定 base 路径
    // Cloudflare Pages: CF_PAGES=1 或 CF_PAGES_URL 存在
    // GitHub Pages: 默认使用子路径
    const isCloudflarePages = process.env.CF_PAGES === '1' || !!process.env.CF_PAGES_URL;
    const base = isCloudflarePages ? '/' : (command === 'build' ? '/Dict-e-de-Nombres/' : '/');

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
      },
      // 确保voice-test.html被复制到构建输出
      publicDir: 'public',
      build: {
        rollupOptions: {
          input: {
            main: path.resolve(__dirname, 'index.html'),
            voiceTest: path.resolve(__dirname, 'voice-test.html')
          }
        }
      }
    };
});
