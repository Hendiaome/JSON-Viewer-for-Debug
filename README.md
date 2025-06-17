# 变量JSON查看器 (Variable JSON Viewer)

这是一个VSCode扩展，用于在Java应用调试期间查看复杂的JSON数据结构。当您在调试过程中需要检查JSON字符串变量时，此扩展提供了一个友好的界面来浏览、搜索和复制JSON数据。

## 功能特点

- 在调试期间快速查看JSON变量内容
- 自动解析和格式化JSON数据
- 支持展开/折叠节点
- 搜索功能帮助定位特定内容
- 自动识别和处理外层带引号的JSON字符串
- 支持复制格式化或紧凑版本的JSON
- 与VSCode主题集成，自动适应您的颜色设置

## 使用方法

1. 在Java应用程序的调试会话中，当您停在断点处
2. 右键点击变量面板中的JSON字符串变量
3. 选择 "查看JSON" 选项
4. 或者，使用快捷键 `Ctrl+Shift+J` (`Cmd+Shift+J` on Mac)

## 支持的库

此扩展支持使用以下Java库转换对象为JSON:
- Alibaba FastJSON

## 需求

- VSCode 1.90.0 或更高版本
- Java语言支持

## 故障排除

- 如果JSON解析失败，请检查字符串格式，扩展会尝试处理外层包含引号的JSON
- 确保您的项目中包含了FastJSON库
- 在使用功能前，确保调试会话已经暂停在断点处

---

# Variable JSON Viewer

A VSCode extension for viewing complex JSON data structures during Java application debugging. When you need to examine JSON string variables during debugging, this extension provides a friendly interface to browse, search, and copy JSON data.

## Features

- Quickly view JSON variable content during debugging
- Automatically parse and format JSON data
- Support for expanding/collapsing nodes
- Search functionality to locate specific content
- Automatic detection and handling of JSON strings with outer quotes
- Support for copying formatted or compact versions of JSON
- Integration with VSCode themes, automatically adapts to your color settings

## How to Use

1. In a Java application debugging session, when stopped at a breakpoint
2. Right-click on a JSON string variable in the variables panel
3. Select "View JSON" option
4. Or, use the shortcut `Ctrl+Shift+J` (`Cmd+Shift+J` on Mac)

## Supported Libraries

This extension supports converting objects to JSON using:
- Alibaba FastJSON

## Requirements

- VSCode 1.90.0 or higher
- Java language support

## Troubleshooting

- If JSON parsing fails, check string format, the extension will try to handle JSON with outer quotes
- Make sure your project includes the FastJSON library
- Ensure that the debugging session is paused at a breakpoint before using features
