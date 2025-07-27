import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import { getBuildConfig } from './config/build.config';

export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, '.', '');
  const buildConfig = getBuildConfig();

  return {
    base: buildConfig.base,
    define: {
      // 环境变量注入
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || mode),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
        '@/src': path.resolve(__dirname, 'src'),
        '@/config': path.resolve(__dirname, 'config'),
      }
    },
    build: {
      outDir: buildConfig.outDir,
      sourcemap: buildConfig.sourcemap,
      minify: buildConfig.minify,
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          // 包含调试文件到生产构建中
          'debug/voice-test': path.resolve(__dirname, 'debug/voice-test.html'),
          'debug/voice-test-i18n': path.resolve(__dirname, 'debug/voice-test-i18n.html'),
          'debug/debug-experience': path.resolve(__dirname, 'debug/debug-experience.html'),
          'debug/debug-experience-i18n': path.resolve(__dirname, 'debug/debug-experience-i18n.html'),
          'debug/test-voice-fix': path.resolve(__dirname, 'debug/test-voice-fix.html'),
          'debug/dynamic-title-test': path.resolve(__dirname, 'debug/dynamic-title-test.html'),
          'debug/multilingual-test': path.resolve(__dirname, 'debug/multilingual-test.html'),
          'debug/test-language-sync': path.resolve(__dirname, 'debug/test-language-sync.html')
        }
      }
    },
    // 开发服务器配置
    server: {
      port: 5173,
      open: true,
      cors: true
    },
    // 预览服务器配置
    preview: {
      port: 4173,
      open: true
    }
  };
});
