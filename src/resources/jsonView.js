// JSON查看器的主要功能
let jsonData = null;
let jsonViewer = null;
let viewState = {
    original: null,
    formatted: null,
    currentDisplay: 'formatted'
};



// 初始化
function initJsonViewer() {
    console.log("JsonViewer 初始化开始");
    
    // 从VSCode获取初始数据
    window.addEventListener('message', event => {
        console.log("收到消息:", event.data);
        const message = event.data;
        
        switch (message.command) {
            case 'setJson':
                console.log("处理JSON数据:", message.variableName);
                handleJsonData(message.jsonString, message.variableName);
                break;
            case 'showError':
                console.log("显示错误:", message.errorMessage);
                showError(message.errorMessage);
                break;
        }
    });
    
    // 注册按钮事件
    document.getElementById('copyButton').addEventListener('click', copyJsonToClipboard);
    document.getElementById('formatButton').addEventListener('click', toggleFormat);

    document.getElementById('collapseToggleAllNodes').addEventListener('click', collapseToggleAllNodes);
    document.getElementById('searchButton').addEventListener('click', searchInJson);
    
    document.getElementById('searchInput').addEventListener('keydown', e => {
        if (e.key === 'Enter') searchInJson();
    });

    
    console.log("JsonViewer 初始化完成，发送ready消息");
    // 通知VSCode视图已准备就绪
    vscode.postMessage({ command: 'ready' });
}

// 处理JSON数据
function handleJsonData(jsonString, variableName) {
    try {
        console.log("开始处理JSON数据", { variableName, jsonLength: jsonString.length });
        
        // 设置标题
        document.getElementById('jsonTitle').textContent = `JSON View: ${variableName}`;
        
        // 保存原始字符串
        viewState.original = jsonString;
        
        // 处理特殊情况：外层包含引号的JSON字符串 (如: '"[{...}]"')
        let processedJsonString = jsonString;
        if (typeof jsonString === 'string') {
            // 检测是否为带引号的JSON字符串
            const trimmed = jsonString.trim();
            if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || 
                (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
                try {
                    // 尝试解析引号内的内容
                    const unquoted = trimmed.substring(1, trimmed.length - 1);
                    // 验证去引号后的字符串是否是有效的JSON
                    JSON.parse(unquoted);
                    // 如果解析成功，使用去掉引号的字符串
                    processedJsonString = unquoted;
                    console.log("检测到外层引号，已去除", { original: trimmed, processed: unquoted });
                } catch (innerError) {
                    // 如果内层解析失败，则使用原始字符串
                    console.warn("尝试去除外层引号解析失败，使用原始字符串", innerError);
                }
            }
        }
        
        // 尝试解析JSON
        jsonData = typeof processedJsonString === 'string' ? JSON.parse(processedJsonString) : processedJsonString;
        
        // 保存格式化的版本
        viewState.formatted = JSON.stringify(jsonData, null, 2);
        viewState.currentDisplay = 'formatted';
        
        console.log("JSON解析成功，准备渲染", { 
            type: Array.isArray(jsonData) ? "数组" : typeof jsonData,
            length: Array.isArray(jsonData) ? jsonData.length : 
                   (typeof jsonData === 'object' ? Object.keys(jsonData).length : 0)
        });
        
        // 渲染JSON
        renderJsonWithViewer();
        
        // 更新状态栏
        updateStatusBar();
        
        // 清除错误
        hideError();
    } catch (e) {
        console.error("JSON解析错误:", e);
        // 显示无法解析的原始内容
        viewState.original = jsonString;
        document.getElementById('jsonViewer').innerText = jsonString;
        showError(`无法解析JSON: ${e.message}`);
    }
}

// 渲染JSON
function renderJsonWithViewer() {
    console.log("开始渲染JSON", { displayMode: viewState.currentDisplay });
    const viewerContainer = document.getElementById('jsonViewer');
    viewerContainer.innerHTML = '';
    
    // 紧凑模式直接显示原始字符串
    if (viewState.currentDisplay === 'original') {
        console.log("使用紧凑模式显示");
        viewerContainer.innerText = viewState.original;
        return;
    }
    
    // 确保DOM已经准备好
    $(document).ready(function() {
        try {
            console.log("使用jquery.json-viewer渲染");
            // 使用jquery.json-viewer渲染
            $(viewerContainer).jsonViewer(jsonData, {
                collapsed: false,
                withQuotes: true,
                withLinks: false
            });
            
        } catch (e) {
            console.error('JSON查看器初始化错误:', e);
            // 备用：使用pre元素显示格式化的JSON
            viewerContainer.innerHTML = `<pre>${escapeHtml(viewState.formatted)}</pre>`;
        }
    });
}

// 复制到剪贴板
function copyJsonToClipboard() {
    const jsonToCopy = viewState.currentDisplay === 'formatted' ? 
        JSON.stringify(jsonData, null, 2) : 
        viewState.original;
    
    navigator.clipboard.writeText(jsonToCopy).then(() => {
        document.getElementById('statusBar').textContent = '已复制到剪贴板';
        vscode.postMessage({ command: 'copied' });
        
        // 2秒后恢复状态栏
        setTimeout(updateStatusBar, 2000);
    }).catch(err => {
        showError(`复制失败: ${err}`);
    });
}

// 切换格式
function toggleFormat() {
    if (!viewState.original) return;
    
    if (viewState.currentDisplay === 'formatted') {
        document.getElementById('formatButton').textContent = '格式化';
        document.getElementById('jsonViewer').innerText = viewState.original;
        viewState.currentDisplay = 'original';
        
        // 禁用展开/折叠按钮
        document.getElementById('collapseToggleAllNodes').disabled = true;
    } else {
        document.getElementById('formatButton').textContent = '紧凑';
        viewState.currentDisplay = 'formatted';
        
        // 启用展开/折叠按钮
        document.getElementById('collapseToggleAllNodes').disabled = false;
        
        // 重新渲染
        renderJsonWithViewer();
    }
    
    // 清除搜索结果
    clearSearchResults();
}


// 折叠所有节点
function collapseToggleAllNodes() {
    console.log("折叠/折叠所有节点");
    try {
        // 确保选择正确的元素并使用jQuery折叠，保留第一个节点展开
        $('#jsonViewer .json-toggle').not(':first').each(function() {
            $(this).click();
        });
        document.getElementById('statusBar').textContent = '折叠/折叠所有节点（除根节点外）';
    } catch (e) {
        console.error("折叠/折叠所有节点:", e);
        showError("折叠/折叠所有节点: " + e.message);
    }
}

// 更新状态栏
function updateStatusBar() {
    let statusText = '';
    
    if (Array.isArray(jsonData)) {
        statusText = `数组: ${jsonData.length} 项`;
    } else if (jsonData && typeof jsonData === 'object') {
        statusText = `对象: ${Object.keys(jsonData).length} 属性`;
    } else {
        statusText = '就绪';
    }
    
    document.getElementById('statusBar').textContent = statusText;
}

// 搜索变量和值
let searchResults = [];
let currentSearchIndex = -1;

function searchInJson() {
    const searchText = document.getElementById('searchInput').value.trim().toLowerCase();
    if (!searchText || !jsonData) {
        return;
    }
    
    clearSearchResults();
    
    // 查找所有匹配的DOM元素
    searchResults = [];
    $('.json-string, .json-key, .json-value, .json-literal').each(function() {
        const text = $(this).text().toLowerCase();
        if (text.includes(searchText)) {
            searchResults.push($(this));
        }
    });
    
    if (searchResults.length > 0) {
        currentSearchIndex = 0;
        highlightSearchResult(0);
        document.getElementById('statusBar').textContent = `找到 ${searchResults.length} 个匹配项`;
    } else {
        document.getElementById('statusBar').textContent = '未找到匹配项';
    }
}

function highlightSearchResult(index) {
    // 移除所有高亮
    $('.search-highlight').removeClass('search-highlight current-highlight');
    
    if (searchResults.length === 0 || index < 0 || index >= searchResults.length) {
        return;
    }
    
    // 高亮当前结果
    const result = searchResults[index];
    result.addClass('search-highlight current-highlight');
    
    // 滚动到视图
    result[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // 确保包含此节点的折叠容器都是展开的
    let parent = result.closest('.json-collapsed');
    while (parent.length) {
        parent.click();
        parent = parent.parent().closest('.json-collapsed');
    }
    
    document.getElementById('statusBar').textContent = 
        `匹配项 ${currentSearchIndex + 1} / ${searchResults.length}`;
}





function clearSearchResults() {
    $('.search-highlight').removeClass('search-highlight current-highlight');
    searchResults = [];
    currentSearchIndex = -1;
}

// 显示错误消息
function showError(message) {
    const errorContainer = document.getElementById('errorContainer');
    errorContainer.textContent = message;
    errorContainer.style.display = 'block';
}

// 隐藏错误消息
function hideError() {
    document.getElementById('errorContainer').style.display = 'none';
}

// HTML转义
function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
} 