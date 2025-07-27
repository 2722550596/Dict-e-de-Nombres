/**
 * 构建配置管理
 * 统一管理不同环境的构建配置
 */

export interface BuildConfig {
  base: string;
  outDir: string;
  sourcemap: boolean;
  minify: boolean;
}

export interface DeploymentConfig {
  name: string;
  base: string;
  description: string;
}

// 部署平台配置
export const DEPLOYMENT_CONFIGS: Record<string, DeploymentConfig> = {
  development: {
    name: 'Development',
    base: '/',
    description: '本地开发环境'
  },
  github: {
    name: 'GitHub Pages',
    base: '/Dict-e-de-Nombres/',
    description: 'GitHub Pages 部署'
  },
  cloudflare: {
    name: 'Cloudflare Pages',
    base: '/',
    description: 'Cloudflare Pages 部署'
  },
  production: {
    name: 'Production',
    base: '/',
    description: '生产环境部署'
  }
};

/**
 * 根据环境变量检测部署平台
 */
export function detectDeploymentPlatform(): string {
  // Cloudflare Pages 环境检测
  if (process.env.CF_PAGES === '1' || process.env.CF_PAGES_URL) {
    return 'cloudflare';
  }
  
  // GitHub Actions 环境检测
  if (process.env.GITHUB_ACTIONS === 'true') {
    return 'github';
  }
  
  // 通过环境变量显式指定
  if (process.env.DEPLOY_TARGET) {
    return process.env.DEPLOY_TARGET;
  }
  
  // 默认为开发环境
  return 'development';
}

/**
 * 获取构建配置
 */
export function getBuildConfig(platform?: string): BuildConfig {
  const deploymentPlatform = platform || detectDeploymentPlatform();
  const config = DEPLOYMENT_CONFIGS[deploymentPlatform] || DEPLOYMENT_CONFIGS.development;
  
  return {
    base: config.base,
    outDir: 'dist',
    sourcemap: process.env.NODE_ENV !== 'production',
    minify: process.env.NODE_ENV === 'production'
  };
}
