# JSON Viewer for Debug

这是一个VSCode扩展，用于在Java调试器中查看任意数据。它支持任意变量，通过调用evaluate表达式将Java对象转换为JSON格式，然后提供一个友好的界面来浏览、搜索和复制JSON数据。

## 功能特点

- 在调试期间快速查看JSON变量内容
- 自动解析和格式化JSON数据
- 支持展开/折叠节点
- 搜索功能帮助定位特定内容
- 自动识别和处理外层带引号的JSON字符串
- 支持复制格式化或紧凑版本的JSON
- 与VSCode主题集成，自动适应您的颜色设置
- 可配置的JSON序列化库支持

## 使用方法

1. 在Java应用程序的调试会话中，当您停在断点处
2. 右键点击变量面板中的任意变量（支持任何Java对象）
3. 选择 "查看JSON" 选项
4. 或者，使用快捷键 `Ctrl+Shift+J` (`Cmd+Shift+J` on Mac)

## 配置选项

### jsonViewForDebug.jsonLibrary

选择用于将Java对象转换为JSON的序列化库：

- `gson` (默认) - Google Gson库
- `jackson` - Jackson库  
- `fastjson` - 阿里巴巴FastJSON库

在VSCode设置中搜索 "JSON Viewer for Debug" 来配置此选项。

### 配置示例

在 `settings.json` 中添加：

```json
{
  "jsonViewForDebug.jsonLibrary": "gson"
}
```

或通过VSCode设置界面：
1. 打开设置 (`Ctrl+,` 或 `Cmd+,`)
2. 搜索 "JSON Viewer for Debug"
3. 在下拉菜单中选择您偏好的JSON库

## 支持的库

此扩展支持使用以下Java库转换对象为JSON:
- **Google Gson** - `new com.google.gson.Gson().toJson(object)`
- **Jackson** - `new com.fasterxml.jackson.databind.ObjectMapper().writeValueAsString(object)`
- **Alibaba FastJSON** - `com.alibaba.fastjson.JSON.toJSONString(object)`

扩展会根据您的配置首先尝试指定的库，如果失败则自动尝试其他可用的库作为备选。

### 库依赖说明

确保您的Java项目包含以下依赖之一：

**Maven 依赖：**
```xml
<!-- Gson -->
<dependency>
    <groupId>com.google.code.gson</groupId>
    <artifactId>gson</artifactId>
    <version>2.10.1</version>
</dependency>

<!-- Jackson -->
<dependency>
    <groupId>com.fasterxml.jackson.core</groupId>
    <artifactId>jackson-databind</artifactId>
    <version>2.15.2</version>
</dependency>

<!-- FastJSON -->
<dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>fastjson</artifactId>
    <version>1.2.83</version>
</dependency>
```

**Gradle 依赖：**
```gradle
// Gson
implementation 'com.google.code.gson:gson:2.10.1'

// Jackson
implementation 'com.fasterxml.jackson.core:jackson-databind:2.15.2'

// FastJSON
implementation 'com.alibaba:fastjson:1.2.83'
```

## 需求

- VSCode 1.60.0 或更高版本
- Java语言支持

## 故障排除

- 如果JSON解析失败，请检查字符串格式，扩展会尝试处理外层包含引号的JSON
- 确保您的项目中包含了至少一个支持的JSON库（Gson、Jackson或FastJSON）
- 在使用功能前，确保调试会话已经暂停在断点处
- 如果配置的JSON库不可用，扩展会自动尝试其他可用的库

## 开源信息

- **许可证**: MIT License
- **仓库地址**: [https://github.com/hendiaome/JSON-Viewer-for-Debug](https://github.com/hendiaome/JSON-Viewer-for-Debug)
- **问题反馈**: [https://github.com/hendiaome/JSON-Viewer-for-Debug/issues](https://github.com/hendiaome/JSON-Viewer-for-Debug/issues)

## 贡献

欢迎提交 Pull Request 和 Issue！如果您有任何建议或发现了问题，请在 GitHub 仓库中创建 Issue。

---

A VSCode extension for viewing any data in Java debugger. It supports any variable by calling evaluate expressions to convert Java objects to JSON format, then provides a friendly interface to browse, search, and copy JSON data.

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
2. Right-click on any variable in the variables panel (supports any Java object)
3. Select "View JSON" option
4. Or, use the shortcut `Ctrl+Shift+J` (`Cmd+Shift+J` on Mac)

## Configuration Options

### jsonViewForDebug.jsonLibrary

Choose the serialization library for converting Java objects to JSON:

- `gson` (default) - Google Gson library
- `jackson` - Jackson library  
- `fastjson` - Alibaba FastJSON library

Search for "JSON Viewer for Debug" in VSCode settings to configure this option.

### Configuration Example

Add to your `settings.json`:

```json
{
  "jsonViewForDebug.jsonLibrary": "gson"
}
```

Or through VSCode Settings UI:
1. Open Settings (`Ctrl+,` or `Cmd+,`)
2. Search for "JSON Viewer for Debug"
3. Select your preferred JSON library from the dropdown

## Supported Libraries

This extension supports converting objects to JSON using:
- **Google Gson** - `new com.google.gson.Gson().toJson(object)`
- **Jackson** - `new com.fasterxml.jackson.databind.ObjectMapper().writeValueAsString(object)`
- **Alibaba FastJSON** - `com.alibaba.fastjson.JSON.toJSONString(object)`

The extension will first try the configured library, and automatically fallback to other available libraries if the primary one fails.

### Library Dependencies

Make sure your Java project includes one of the following dependencies:

**Maven Dependencies:**
```xml
<!-- Gson -->
<dependency>
    <groupId>com.google.code.gson</groupId>
    <artifactId>gson</artifactId>
    <version>2.10.1</version>
</dependency>

<!-- Jackson -->
<dependency>
    <groupId>com.fasterxml.jackson.core</groupId>
    <artifactId>jackson-databind</artifactId>
    <version>2.15.2</version>
</dependency>

<!-- FastJSON -->
<dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>fastjson</artifactId>
    <version>1.2.83</version>
</dependency>
```

**Gradle Dependencies:**
```gradle
// Gson
implementation 'com.google.code.gson:gson:2.10.1'

// Jackson
implementation 'com.fasterxml.jackson.core:jackson-databind:2.15.2'

// FastJSON
implementation 'com.alibaba:fastjson:1.2.83'
```

## Requirements

- VSCode 1.60.0 or higher
- Java language support

## Troubleshooting

- If JSON parsing fails, check string format, the extension will try to handle JSON with outer quotes
- Make sure your project includes at least one supported JSON library (Gson, Jackson, or FastJSON)
- Ensure that the debugging session is paused at a breakpoint before using features
- If the configured JSON library is not available, the extension will automatically try other available libraries as fallbacks

## Open Source Information

- **License**: MIT License
- **Repository**: [https://github.com/hendiaome/JSON-Viewer-for-Debug](https://github.com/hendiaome/JSON-Viewer-for-Debug)
- **Bug Reports**: [https://github.com/hendiaome/JSON-Viewer-for-Debug/issues](https://github.com/hendiaome/JSON-Viewer-for-Debug/issues)

## Contributing

Pull Requests and Issues are welcome! If you have any suggestions or find any problems, please create an Issue in the GitHub repository.
