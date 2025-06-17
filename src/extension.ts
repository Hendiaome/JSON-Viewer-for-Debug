// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

// 创建输出通道
let outputChannel: vscode.OutputChannel;

// 存储暂停的线程ID
let pausedThreadId: number | null = null;

function getOutputChannel(): vscode.OutputChannel {
    if (!outputChannel) {
        outputChannel = vscode.window.createOutputChannel('json viewer for debug');
    }
    return outputChannel;
}

function log(message: string) {
    const channel = getOutputChannel();
    channel.appendLine(`[${new Date().toISOString()}] ${message}`);

    channel.show();
   
}

export function activate(context: vscode.ExtensionContext) { 
    // 初始化输出通道
    getOutputChannel();
    
    log('json viewer for debug extension activating...');
    
    // 监听调试会话启动
    vscode.debug.onDidStartDebugSession(session => {
        log(`Debug session started: ${session.type}, ${session.name}`);
        // 清除之前的暂停线程ID
        pausedThreadId = null;
    });
    
    // 监听调试会话结束
    vscode.debug.onDidTerminateDebugSession(session => {
        log(`Debug session terminated: ${session.type}, ${session.name}`);
        // 清除暂停线程ID
        pausedThreadId = null;
    });

     // 注册调试协议事件监听器
     vscode.debug.registerDebugAdapterTrackerFactory('*', {
        createDebugAdapterTracker(session: vscode.DebugSession) {
            return {
                onDidSendMessage: m => {
                    if (m.event === 'stopped') {
                        // 记录暂停的线程ID
                        pausedThreadId = m.body.threadId;
                        log(`Thread paused: ${pausedThreadId}`);
                    } else if (m.event === 'continued') {
                        // 线程继续，清除记录的线程ID
                        pausedThreadId = null;
                        log('Thread continued');
                    }
                }
            };
        }
    });
    
    // 注册右键菜单命令
    const jsonViewCommand = vscode.commands.registerCommand('json viewer for debug.showJsonView', async (variableData: any) => {
        try {
            // 检查调试会话状态
            if (!vscode.debug.activeDebugSession) {
                vscode.window.showErrorMessage('No active debug session');
                return;
            }
            
            // 获取变量名
            let variableName = getVariableName(variableData);
            
            if (!variableName) {
                log('No variable name found, trying to get from selection or user input');
                variableName = await getVariableNameFromSelectionOrInput();
                
                if (!variableName) {
                    vscode.window.showErrorMessage('Variable name not found');
                    return;
                }
            }
            
            log(`Processing variable: ${variableName}`);
            
            // 检查调试状态
            if (!isDebuggerPaused()) {
                vscode.window.showErrorMessage('Debugger not paused, cannot evaluate expression');
                return;
            }
            
            // 尝试不同的JSON转换方法
            await tryConvertToJson(variableName, context);
            
        } catch (error: any) {
            const errorMsg = error.message || String(error);
            vscode.window.showErrorMessage(`JSON View processing error: ${errorMsg}`);
            log(`Error in JSONView command: ${errorMsg}`);
        }
    });
    
    // 将命令添加到订阅中
    context.subscriptions.push(jsonViewCommand);
    
    // 关闭VSCode时可能保留的空WebView面板的处理
    if (vscode.window.registerWebviewPanelSerializer) {
        // 这将在VSCode尝试恢复WebView面板时调用
        vscode.window.registerWebviewPanelSerializer('jsonView', {
            async deserializeWebviewPanel(webviewPanel: vscode.WebviewPanel, state: any) {
                log('正在尝试恢复JSON查看器面板...');
                
                // 简单地关闭面板，防止出现空面板
                // 用户需要重新通过调试会话创建面板
                webviewPanel.dispose();
                log('关闭了尝试恢复的JSON查看器面板，请通过调试会话重新创建');
            }
        });
    }
    
    // 确保VS Code调试已完全初始化后添加命令到上下文菜单
    setTimeout(() => {
        // 打印当前活动的调试会话
        const sessions = vscode.debug.activeDebugSession ? 
            `Active: ${vscode.debug.activeDebugSession.type}` : 
            'No active sessions';
        log(`Debug status check - ${sessions}`);
    }, 5000);
    
    // 将输出通道添加到订阅中，以便在扩展停用时正确处理
    context.subscriptions.push(outputChannel);
    
    log('json viewer for debug extension activated');
}

// 从变量数据中获取变量名
function getVariableName(variableData: any): string | undefined {
    if (!variableData) return undefined;
    
    // 尝试不同的属性获取变量名
    if (variableData.variable && variableData.variable.name) {
        log(`Found variable name from context menu: ${variableData.variable.name}`);
        return variableData.variable.name;
    } 
    
    if (variableData.name) {
        log(`Found variable name from direct property: ${variableData.name}`);
        return variableData.name;
    }
    
    if (variableData.evaluateName) {
        log(`Found variable from evaluateName: ${variableData.evaluateName}`);
        return variableData.evaluateName;
    }
    
    log(`Complete variable data: ${JSON.stringify(variableData)}`);
    return undefined;
}

// 从选择或用户输入中获取变量名
async function getVariableNameFromSelectionOrInput(): Promise<string | undefined> {
    // 尝试从编辑器选择中获取
    const editor = vscode.window.activeTextEditor;
    if (editor) {
        const selection = editor.selection;
        if (!selection.isEmpty) {
            const selectedText = editor.document.getText(selection);
            log(`Selected text: ${selectedText}`);
            return selectedText;
        }
    }
    
    // 从用户输入获取
    const inputName = await vscode.window.showInputBox({
        placeHolder: '输入要转换为JSON的变量名',
        prompt: '请输入变量名称'
    });
    
    if (!inputName) {
        log('User cancelled variable name input');
        return undefined;
    }
    
    return inputName;
}

// 检查调试器是否处于暂停状态
function isDebuggerPaused(): boolean {
    return vscode.debug.activeDebugSession !== undefined;
}

// 尝试不同的JSON转换方法
async function tryConvertToJson(variableName: string, context: vscode.ExtensionContext): Promise<void> {
    try {
        // 先尝试fastjson
        await evaluateAndShowJson(variableName, `com.alibaba.fastjson.JSON.toJSONString(${variableName})`, context);
    } catch (error) {
        log(`Error with alibaba fastjson: ${error}`);
        

    }
}

// 评估表达式并显示JSON结果
async function evaluateAndShowJson(variableName: string, expression: string, context: vscode.ExtensionContext): Promise<void> {
    if (!vscode.debug.activeDebugSession) {
        throw new Error('No active debug session');
    }
    
    log(`Evaluating expression: ${expression}`);
    
    // 获取暂停的线程
    const pausedThreadId = await findPausedThread();
    if (!pausedThreadId) {
        throw new Error('No paused thread found');
    }
    
    // 获取堆栈帧
    const stackFrames = await vscode.debug.activeDebugSession.customRequest('stackTrace', {
        threadId: pausedThreadId
    });
    
    if (!stackFrames || !stackFrames.stackFrames || stackFrames.stackFrames.length === 0) {
        throw new Error('No stack frames found for paused thread');
    }
    
    // 使用顶层帧
    const frameId = stackFrames.stackFrames[0].id;
    
    // 评估表达式
    const response = await vscode.debug.activeDebugSession.customRequest('evaluate', {
        expression: expression,
        context: 'watch',
        frameId: frameId,
        threadId: pausedThreadId
    });
    
    if (!response || !response.result) {
        throw new Error(`Expression evaluation returned no result: ${JSON.stringify(response)}`);
    }
    
    log(`Received JSON result for ${variableName}`);
    
    // 显示JSON结果
    createJsonViewPanel(`JSON View: ${variableName}`, response.result, context);
}

// 寻找暂停的线程
async function findPausedThread(): Promise<any> {
    // 如果有记录的暂停线程ID，直接使用
    if (pausedThreadId !== null) {
        return pausedThreadId;
    }
    
    return null;
}

// 创建JSON查看面板
function createJsonViewPanel(title: string, jsonString: string, context: vscode.ExtensionContext): vscode.WebviewPanel {
    // 创建webview
    const panel = vscode.window.createWebviewPanel(
        'jsonView',
        title,
        vscode.ViewColumn.Two,
        {
            enableScripts: true,
            retainContextWhenHidden: true,
            localResourceRoots: [
                context.extensionUri
            ]
        }
    );
    
    // 设置面板关闭前的处理
    panel.onDidDispose(() => {
        // 在面板关闭时可以做一些清理工作
        log(`JSON viewer panel closed: ${title}`);
    }, null, context.subscriptions);
    
    // 设置状态变化的处理
    panel.onDidChangeViewState(e => {
        const panel = e.webviewPanel;
        if (panel.visible) {
            log(`JSON viewer panel became visible: ${title}`);
        }
    }, null, context.subscriptions);
    
    // 初始化WebView内容
    setupJsonViewPanel(panel, jsonString, title, context);
    
    return panel;
}

// 设置WebView面板的内容和事件处理
function setupJsonViewPanel(panel: vscode.WebviewPanel, jsonString: string, title: string, context: vscode.ExtensionContext): void {
    // 获取资源URI - 使用context.extensionUri确保路径兼容性
    const htmlPath = vscode.Uri.joinPath(context.extensionUri, 'src', 'resources', 'jsonView.html');
    const scriptPath = vscode.Uri.joinPath(context.extensionUri, 'src', 'resources', 'jsonView.js');
    const jqueryPath = vscode.Uri.joinPath(context.extensionUri, 'src', 'resources',  'jquery.min.js');
    const jsonViewerJsPath = vscode.Uri.joinPath(context.extensionUri, 'src', 'resources', 'jquery.json-viewer.js');
    const jsonViewerCssPath = vscode.Uri.joinPath(context.extensionUri, 'src', 'resources', 'jquery.json-viewer.css');
    
    // 转换为webview可用URI
    const scriptUri = panel.webview.asWebviewUri(scriptPath);
    const jqueryUri = panel.webview.asWebviewUri(jqueryPath);
    const jsonViewerJsUri = panel.webview.asWebviewUri(jsonViewerJsPath);
    const jsonViewerCssUri = panel.webview.asWebviewUri(jsonViewerCssPath);
    
    // 读取HTML模板
    let htmlContent = fs.readFileSync(htmlPath.fsPath, 'utf8');
    
    // 替换模板变量
    const replacements = {
        '{{scriptUri}}': scriptUri.toString(),
        '{{jqueryUri}}': jqueryUri.toString(),
        '{{jsonViewerJsUri}}': jsonViewerJsUri.toString(),
        '{{jsonViewerCssUri}}': jsonViewerCssUri.toString()
    };
    
    // 应用替换
    for (const [placeholder, value] of Object.entries(replacements)) {
        htmlContent = htmlContent.replace(new RegExp(placeholder, 'g'), value);
    }
    
    // 设置内容
    panel.webview.html = htmlContent;
    
    // 处理消息
    panel.webview.onDidReceiveMessage(
        message => {
            switch (message.command) {
                case 'ready':
                    // 发送JSON数据
                    panel.webview.postMessage({ 
                        command: 'setJson', 
                        jsonString,
                        variableName: title.replace('JSON View: ', '')
                    });
                    break;
                case 'copied':
                    vscode.window.showInformationMessage('JSON已复制到剪贴板');
                    break;

            }
        },
        undefined,
        context.subscriptions
    );
}

export function deactivate() {
    if (outputChannel) {
        outputChannel.dispose();
    }
    log('json viewer for debug extension deactivated');
}