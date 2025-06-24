# 更新日志

所有重要的项目变更都会记录在此文件中。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，
并且本项目遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

## [1.0.0] - 2024-01-XX

### 新增
- ✨ **强大的搜索功能**
  - 实时搜索JSON内容，支持键值和数值搜索
  - 上一个/下一个匹配项导航按钮（↑/↓）
  - 键盘快捷键支持：
    - `F3` - 跳转到下一个匹配项
    - `Shift+F3` - 跳转到上一个匹配项
  - 搜索结果高亮显示，当前匹配项特殊标记
  - 状态栏显示匹配数量和当前位置（如"匹配项 2 / 5"）
  - 循环导航：到达最后一个结果时自动跳转到第一个

### 改进
- 🎨 **界面优化**
  - 重新设计搜索工具栏布局，更加紧凑美观
  - 优化搜索导航按钮样式，使用直观的箭头符号
  - 改进按钮状态管理，没有搜索结果时自动禁用导航按钮
  - 搜索结果自动滚动到视野中心，提升用户体验

### 技术改进
- 🔧 优化搜索算法，支持在折叠的节点中搜索
- 🔧 改进搜索状态管理，格式切换时自动清除搜索结果
- 🔧 增强错误处理和日志记录

## [0.0.2] - 2024-01-XX

### 改进
- 🐛 修复了一些边界情况的处理
- 📝 完善了文档和说明

## [0.0.1] - 2024-01-XX

### 新增
- 🎉 **核心功能发布**
  - Java调试变量JSON查看器
  - 支持多种JSON序列化库：
    - Google Gson (`new com.google.gson.Gson().toJson()`)
    - Jackson (`new com.fasterxml.jackson.databind.ObjectMapper().writeValueAsString()`)
    - Alibaba FastJSON (`com.alibaba.fastjson.JSON.toJSONString()`)
  - 自动格式化和语法高亮显示
  - 展开/折叠JSON节点功能
  - 复制JSON到剪贴板（支持格式化和紧凑模式）
  - 格式化/紧凑模式切换
  - 完美集成VSCode主题系统
  - 右键菜单集成（在变量面板和编辑器中）
  - 快捷键支持：`Ctrl+Shift+J` (Windows/Linux) / `Cmd+Shift+J` (Mac)
  - 自动识别和处理外层带引号的JSON字符串
  - 库回退机制：配置的库不可用时自动尝试其他库
  - 调试状态检测，仅在调试暂停时可用
  - 支持从编辑器选择文本或手动输入变量名

### 技术特性
- 🔧 基于VSCode WebView API构建
- 🔧 使用jQuery JSON Viewer组件进行JSON渲染
- 🔧 完整的TypeScript类型支持
- 🔧 详细的错误处理和日志记录
- 🔧 支持VSCode扩展序列化和状态恢复

---

## 版本说明

- **主版本号**：不兼容的API修改
- **次版本号**：向下兼容的功能性新增
- **修订版本号**：向下兼容的问题修正

更多信息请访问：[GitHub Repository](https://github.com/hendiaome/JSON-Viewer-for-Debug)