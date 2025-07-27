# 部署指南

本文档说明如何在不同平台部署项目。

## 构建脚本

### 开发环境
```bash
npm run dev          # 启动开发服务器
npm run build:dev    # 构建开发版本（包含调试文件）
```

### 生产环境构建
```bash
npm run build        # 自动检测环境构建
npm run build:github # GitHub Pages 构建
npm run build:cloudflare # Cloudflare Pages 构建
```

## 部署平台

### GitHub Pages
1. 构建项目：
   ```bash
   npm run build:github
   ```
2. 部署到 GitHub Pages：
   ```bash
   npm run deploy:github
   ```

### Cloudflare Pages
1. 在 Cloudflare Pages 中连接 GitHub 仓库
2. 设置构建命令：`npm run build:cloudflare`
3. 设置输出目录：`dist`
4. 环境变量会自动检测

### 自定义部署
1. 设置环境变量 `DEPLOY_TARGET`：
   ```bash
   export DEPLOY_TARGET=production
   npm run build
   ```

## 环境变量

### 自动检测
系统会自动检测以下环境：
- `CF_PAGES=1` 或 `CF_PAGES_URL` 存在 → Cloudflare Pages
- `GITHUB_ACTIONS=true` → GitHub Actions

### 手动设置
通过 `DEPLOY_TARGET` 环境变量手动指定：
- `development` - 开发环境
- `github` - GitHub Pages
- `cloudflare` - Cloudflare Pages  
- `production` - 生产环境

## 配置文件

### 构建配置
- `config/build.config.ts` - 统一的构建配置管理
- `vite.config.ts` - Vite 配置文件

### 环境变量
- `.env.example` - 环境变量示例
- `.env` - 本地环境变量（不提交到版本控制）

## 故障排除

### 路径问题
如果部署后资源加载失败，检查：
1. `DEPLOY_TARGET` 环境变量是否正确
2. 构建脚本是否使用了正确的平台配置

### 调试文件
- 生产环境构建不包含调试文件
- 开发环境构建包含所有调试文件
- 可通过 `NODE_ENV` 控制
