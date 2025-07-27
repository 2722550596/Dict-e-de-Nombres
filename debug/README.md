# Debug 目录

此目录包含项目的调试和开发工具文件。

## 文件说明

### 语音测试工具
- `voice-test.html` - 基础语音测试工具，用于测试法语语音合成
- `voice-test-i18n.html` - 多语言语音测试工具，支持多语言环境

### 经验系统调试
- `debug-experience.html` - 经验增长系统调试工具
- `debug-experience-i18n.html` - 多语言版本的经验系统调试工具

## 使用方法

### 开发环境
在开发服务器运行时，可以通过以下URL访问：
- http://localhost:5173/debug/voice-test.html
- http://localhost:5173/debug/voice-test-i18n.html
- http://localhost:5173/debug/debug-experience.html
- http://localhost:5173/debug/debug-experience-i18n.html

### 生产环境
这些文件会被包含在构建输出中，可以通过相应的路径访问。

## 注意事项

- 这些文件仅用于开发和调试目的
- 不应在生产环境中向最终用户暴露
- 修改这些文件不会影响主应用程序的功能
