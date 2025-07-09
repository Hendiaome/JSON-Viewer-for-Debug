# JSON Viewer for Debug

这是一个VSCode扩展，用于在Java调试器中查看任意数据。它支持任意变量，通过调用evaluate表达式将Java对象转换为JSON格式，然后提供一个友好的界面来浏览、搜索和复制JSON数据。

## 功能特点

- 在调试期间快速查看JSON变量内容
- 自动解析和格式化JSON数据
- 支持展开/折叠节点
- 强大的搜索功能：
  - 实时搜索JSON内容
  - 上一个/下一个匹配项导航
  - 键盘快捷键支持（F3/Shift+F3）
  - 搜索结果高亮显示
- 自动识别和处理外层带引号的JSON字符串
- 支持复制格式化或紧凑版本的JSON
- 与VSCode主题集成，自动适应您的颜色设置
- 可配置的JSON序列化库支持

## 使用方法

### 基本使用
1. 在Java应用程序的调试会话中，当您停在断点处
2. 右键点击变量面板中的任意变量（支持任何Java对象）
3. 选择 "查看JSON" 选项
4. 或者，使用快捷键 `Ctrl+Shift+J` (`Cmd+Shift+J` on Mac)

### JSON查看器功能
- **搜索**：在搜索框中输入关键词，按回车或点击搜索按钮
- **导航搜索结果**：
  - 点击 ↑ 按钮跳转到上一个匹配项
  - 点击 ↓ 按钮跳转到下一个匹配项
  - 使用 `F3` 键跳转到下一个匹配项
  - 使用 `Shift+F3` 键跳转到上一个匹配项
- **展开/折叠**：点击"展开/折叠全部"按钮控制所有节点
- **格式切换**：点击"紧凑"/"格式化"按钮切换显示模式
- **复制**：点击"复制"按钮将JSON复制到剪贴板

## 配置选项

### jsonViewForDebug.jsonLibrary

选择用于将Java对象转换为JSON的序列化库：

- `gson` (默认) - Google Gson库
- `jackson` - Jackson库  
- `fastjson` - 阿里巴巴FastJSON库

在VSCode设置中搜索 "JSON Viewer for Debug" 来配置此选项。

### 配置示例

在项目的 `.vscode/settings.json` 中配置：

```json
{
  "jsonViewForDebug.jsonLibrary": "gson"
}
```

## 支持的库

此扩展支持使用以下Java库转换对象为JSON:
- **Google Gson** - `new com.google.gson.Gson().toJson(object)`
- **Jackson** - `new com.fasterxml.jackson.databind.ObjectMapper().writeValueAsString(object)`
- **Alibaba FastJSON** - `com.alibaba.fastjson.JSON.toJSONString(object)`

扩展会根据您的配置首先尝试指定的库，如果失败则自动尝试其他可用的库作为备选。

## 需求

- VSCode 1.60.0 或更高版本
- Java语言支持

## 故障排除

- 如果JSON解析失败，请检查字符串格式，扩展会尝试处理外层包含引号的JSON
- 确保您的项目中包含了至少一个支持的JSON库（Gson、Jackson或FastJSON）
- 在使用功能前，确保调试会话已经暂停在断点处
- 如果配置的JSON库不可用，扩展会自动尝试其他可用的库

## 版本历史
### v1.1.0
- 兼容js number 展示溢出的问题

### v1.0.2
- ✨ **evaluate逻辑优化**：
  - 新增直接看String变量，优化JOSN视图咯几
  - 新增赞助入口

### v1.0.1
- 🎨 简化代码结构，移除多语言支持，统一使用英语界面
- 💡 新增Maven Helper推广

### v1.0.0
- ✨ **新增搜索功能**：
  - 实时搜索JSON内容
  - 上一个/下一个匹配项导航
  - 键盘快捷键支持（F3/Shift+F3）
  - 搜索结果高亮显示
- 🎨 **界面优化**：
  - 改进搜索工具栏布局
  - 优化按钮样式和交互体验

### v0.0.1 - v0.0.2
- 🎉 **基础功能**：
  - Java调试变量JSON查看
  - 支持多种JSON库（Gson、Jackson、FastJSON）
  - 自动格式化和语法高亮
  - 展开/折叠节点
  - 复制JSON到剪贴板
  - 格式化/紧凑模式切换
  - VSCode主题集成
  - 右键菜单和快捷键支持


---

A VSCode extension for viewing any data in Java debugger. It supports any variable by calling evaluate expressions to convert Java objects to JSON format, then provides a friendly interface to browse, search, and copy JSON data.

## Features

- Quickly view JSON variable content during debugging
- Automatically parse and format JSON data
- Support for expanding/collapsing nodes
- Powerful search functionality:
  - Real-time JSON content search
  - Previous/Next match navigation
  - Keyboard shortcuts support (F3/Shift+F3)
  - Search result highlighting
- Automatic detection and handling of JSON strings with outer quotes
- Support for copying formatted or compact versions of JSON
- Integration with VSCode themes, automatically adapts to your color settings
- Configurable JSON serialization library support

## How to Use

### Basic Usage
1. In a Java application debugging session, when stopped at a breakpoint
2. Right-click on any variable in the variables panel (supports any Java object)
3. Select "View as JSON" option
4. Or, use the shortcut `Ctrl+Shift+J` (`Cmd+Shift+J` on Mac)

### JSON Viewer Features
- **Search**: Enter keywords in the search box, press Enter or click the search button
- **Navigate Search Results**:
  - Click ↑ button to jump to the previous match
  - Click ↓ button to jump to the next match
  - Use `F3` key to jump to the next match
  - Use `Shift+F3` key to jump to the previous match
- **Expand/Collapse**: Click "Expand/Collapse All" button to control all nodes
- **Format Toggle**: Click "Compact"/"Format" button to switch display modes
- **Copy**: Click "Copy" button to copy JSON to clipboard

## Configuration Options

### jsonViewForDebug.jsonLibrary

Choose the serialization library for converting Java objects to JSON:

- `gson` (default) - Google Gson library
- `jackson` - Jackson library  
- `fastjson` - Alibaba FastJSON library

Search for "JSON Viewer for Debug" in VSCode settings to configure this option.

### Configuration Example

Configure in your project's `.vscode/settings.json`:

```json
{
  "jsonViewForDebug.jsonLibrary": "gson"
}
```

## Supported Libraries

This extension supports converting objects to JSON using:
- **Google Gson** - `new com.google.gson.Gson().toJson(object)`
- **Jackson** - `new com.fasterxml.jackson.databind.ObjectMapper().writeValueAsString(object)`
- **Alibaba FastJSON** - `com.alibaba.fastjson.JSON.toJSONString(object)`

The extension will first try the configured library, and automatically fallback to other available libraries if the primary one fails.

## Requirements

- VSCode 1.60.0 or higher
- Java language support
- At least one supported JSON library in your project

## Troubleshooting

- If JSON parsing fails, check string format, the extension will try to handle JSON with outer quotes
- Make sure your project includes at least one supported JSON library (Gson, Jackson, or FastJSON)
- Ensure that the debugging session is paused at a breakpoint before using features
- If the configured JSON library is not available, the extension will automatically try other available libraries as fallbacks

## Version History

### v1.1.0
- Fix JS number overflow display issue

### v1.0.2
- ✨ **evaluate logic optimized**：
  - Added direct String variable viewing, optimized JSON view logic
  - Added sponsor entry

### v1.0.1
- 🎨 Simplified code structure, removed multi-language support, unified to English interface
- 🔧 Optimized script loading and initialization process
- 📦 Reduced dependencies, improved performance and stability
- 💡 added Maven Helper promotion

### v1.0.0
- ✨ **New Search Features**:
  - Real-time JSON content search
  - Previous/Next match navigation buttons
  - Keyboard shortcuts support (F3/Shift+F3)
  - Search result highlighting
  - Status bar showing match count and current position

- 🎨 **UI Improvements**:
  - Enhanced search toolbar layout
  - Optimized button styles and interaction experience

### v0.0.1 - v0.0.2
- 🎉 **Core Features**:
  - Java debug variable JSON viewing
  - Multiple JSON library support (Gson, Jackson, FastJSON)
  - Automatic formatting and syntax highlighting
  - Expand/collapse nodes
  - Copy JSON to clipboard
  - Formatted/compact mode toggle
  - VSCode theme integration
  - Context menu and keyboard shortcut support

---

**Enjoy debugging with beautiful JSON views!** 🚀

