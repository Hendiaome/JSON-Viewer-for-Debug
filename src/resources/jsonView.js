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
    console.log("JsonViewer initialization started");
    
    // 从VSCode获取初始数据
    window.addEventListener('message', event => {
        console.log("Received message:", event.data);
        const message = event.data;
        
        switch (message.command) {
            case 'setJson':
                console.log("Processing JSON data:", message.variableName);
                handleJsonData(message.jsonString, message.variableName);
                break;
            case 'showError':
                console.log("Showing error:", message.errorMessage);
                showError(message.errorMessage);
                break;
        }
    });
    
    // 注册按钮事件
    document.getElementById('copyButton').addEventListener('click', copyJsonToClipboard);
    document.getElementById('formatButton').addEventListener('click', toggleFormat);
    document.getElementById('collapseToggleAllNodes').addEventListener('click', collapseToggleAllNodes);
    document.getElementById('searchButton').addEventListener('click', searchInJson);
    document.getElementById('prevButton').addEventListener('click', goToPreviousResult);
    document.getElementById('nextButton').addEventListener('click', goToNextResult);
    
    // 注册赞助链接事件
    // document.getElementById('sponsorLink').addEventListener('click', function(e) {
    //     e.preventDefault();
    //     vscode.postMessage({ command: 'openSponsor' });
    // });
    
    document.getElementById('searchInput').addEventListener('keydown', e => {
        if (e.key === 'Enter') searchInJson();
        if (e.key === 'F3') {
            e.preventDefault();
            if (e.shiftKey) {
                goToPreviousResult();
            } else {
                goToNextResult();
            }
        }
    });
    
    console.log("JsonViewer initialization completed, sending ready message");
    // 通知VSCode视图已准备就绪
    vscode.postMessage({ command: 'ready' });
}

// 处理JSON数据
function handleJsonData(jsonString, variableName) {
    try {
        console.log("Starting JSON data processing", { variableName, jsonLength: jsonString.length });
        
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
                    console.log("Detected outer quotes, removed", { original: trimmed, processed: unquoted });
                } catch (innerError) {
                    // 如果内层解析失败，则使用原始字符串
                    console.warn("Failed to parse after removing outer quotes, using original string", innerError);
                }
            }
        }
        
        // 尝试解析JSON
        jsonData = typeof processedJsonString === 'string' ? JSON.parse(processedJsonString) : processedJsonString;
        
        // 保存格式化的版本
        viewState.formatted = JSON.stringify(jsonData, null, 2);
        viewState.currentDisplay = 'formatted';
        
        console.log("JSON parsing successful, preparing to render", { 
            type: Array.isArray(jsonData) ? "array" : typeof jsonData,
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
        console.error("JSON parsing error:", e);
        // 显示无法解析的原始内容
        viewState.original = jsonString;
        document.getElementById('jsonViewer').innerText = jsonString;
        showError(`Unable to parse JSON: ${e.message}`);
    }
}

// 渲染JSON
function renderJsonWithViewer() {
    console.log("Starting JSON rendering", { displayMode: viewState.currentDisplay });
    const viewerContainer = document.getElementById('jsonViewer');
    viewerContainer.innerHTML = '';
    
    // 紧凑模式直接显示原始字符串
    if (viewState.currentDisplay === 'original') {
        console.log("Using compact mode display");
        viewerContainer.innerText = viewState.original;
        return;
    }
    
    // 确保DOM已经准备好
    $(document).ready(function() {
        try {
            console.log("Using jquery.json-viewer for rendering");
            // 使用jquery.json-viewer渲染
            $(viewerContainer).jsonViewer(jsonData, {
                collapsed: false,
                withQuotes: true,
                withLinks: false
            });
            
        } catch (e) {
            console.error('JSON viewer initialization error:', e);
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
        document.getElementById('statusBar').textContent = 'JSON copied to clipboard';
        vscode.postMessage({ command: 'copied' });
        
        // 2秒后恢复状态栏
        setTimeout(updateStatusBar, 2000);
    }).catch(err => {
        showError(`Copy failed: ${err}`);
    });
}

// 切换格式
function toggleFormat() {
    if (!viewState.original) return;
    
    if (viewState.currentDisplay === 'formatted') {
        // 切换到紧凑模式
        document.getElementById('formatButton').textContent = 'Format';
        document.getElementById('jsonViewer').innerText = viewState.original;
        viewState.currentDisplay = 'original';
        
        // 禁用展开/折叠按钮
        document.getElementById('collapseToggleAllNodes').disabled = true;
    } else {
        // 切换到格式化模式
        document.getElementById('formatButton').textContent = 'Compact';
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
    console.log("Collapse/expand all nodes");
    try {
        // 确保选择正确的元素并使用jQuery折叠，保留第一个节点展开
        $('#jsonViewer .json-toggle').not(':first').each(function() {
            $(this).click();
        });
        document.getElementById('statusBar').textContent = 'Collapsed/expanded all nodes (except root)';
    } catch (e) {
        console.error("Collapse/expand all nodes error:", e);
        showError("Collapse/expand all nodes: " + e.message);
    }
}

// 更新状态栏
function updateStatusBar() {
    let statusText = '';
    
    if (Array.isArray(jsonData)) {
        statusText = `Array: ${jsonData.length} items`;
    } else if (jsonData && typeof jsonData === 'object') {
        statusText = `Object: ${Object.keys(jsonData).length} properties`;
    } else {
        statusText = 'Ready';
    }
    
    document.getElementById('statusBar').textContent = statusText;
}

// 搜索变量和值
let searchResults = [];
let currentSearchIndex = -1;

function searchInJson() {
    const searchText = document.getElementById('searchInput').value.trim().toLowerCase();
    if (!searchText || !jsonData) {
        clearSearchResults();
        updateSearchButtons();
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
        updateSearchButtons();
        document.getElementById('statusBar').textContent = `Found ${searchResults.length} matches`;
    } else {
        updateSearchButtons();
        document.getElementById('statusBar').textContent = 'No matches found';
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
    
    document.getElementById('statusBar').textContent = `Match ${currentSearchIndex + 1} / ${searchResults.length}`;
}

// 跳转到上一个搜索结果
function goToPreviousResult() {
    if (searchResults.length === 0) return;
    
    currentSearchIndex = currentSearchIndex <= 0 ? searchResults.length - 1 : currentSearchIndex - 1;
    highlightSearchResult(currentSearchIndex);
    updateSearchButtons();
}

// 跳转到下一个搜索结果
function goToNextResult() {
    if (searchResults.length === 0) return;
    
    currentSearchIndex = currentSearchIndex >= searchResults.length - 1 ? 0 : currentSearchIndex + 1;
    highlightSearchResult(currentSearchIndex);
    updateSearchButtons();
}

// 更新搜索导航按钮状态
function updateSearchButtons() {
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');
    
    if (searchResults.length === 0) {
        prevButton.disabled = true;
        nextButton.disabled = true;
    } else {
        prevButton.disabled = false;
        nextButton.disabled = false;
    }
}

function clearSearchResults() {
    $('.search-highlight').removeClass('search-highlight current-highlight');
    searchResults = [];
    currentSearchIndex = -1;
    updateSearchButtons();
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