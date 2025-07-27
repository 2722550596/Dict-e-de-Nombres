# Tests 目录

此目录包含项目的测试文件和验证工具。

## 文件说明

### 功能测试
- `test-fixes.html` - 修复功能的综合测试页面
- `test-game-system.html` - 游戏系统测试
- `test-level-system.html` - 等级系统测试
- `test-simplified-level-system.html` - 简化等级系统测试

### HUD组件测试
- `test-hud.html` - HUD组件基础测试
- `test-hud-debug.html` - HUD调试测试
- `test-hud-final.html` - HUD最终版本测试
- `test-hud-i18n.html` - HUD多语言测试
- `test-gamehud-fix.html` - GameHUD修复测试

### UI组件测试
- `test-svg-icons.html` - SVG图标测试

### 验证工具
- `verify-fix.html` - 修复验证工具

## 使用方法

### 开发环境
在开发服务器运行时，可以通过以下URL访问：
- http://localhost:5173/tests/[文件名].html

### 测试流程
1. 启动开发服务器：`npm run dev`
2. 在浏览器中打开相应的测试文件
3. 按照测试页面的说明进行手动测试
4. 记录测试结果

## 注意事项

- 这些是手动测试文件，不是自动化测试
- 主要用于验证UI组件和用户交互
- 测试文件独立于主应用程序，可以安全地修改和实验
