// 推广功能 - Maven Helper插件推广
// 此文件不会被开源，包含推广逻辑和样式

(function() {
    'use strict';
    
    // 推广配置
    const PROMOTION_CONFIG = {
        pluginName: 'Maven Helper',
        pluginId: 'hendiaome.vscode-maven-helper',
        marketplaceUrl: 'https://marketplace.visualstudio.com/items?itemName=hendiaome.vscode-maven-helper',
        showDelay: 1000, // 1秒后显示
        storageKey: 'jsonViewer_promotion_maven_helper'
    };
    
    // 检查是否应该显示推广
    function shouldShowPromotion() {
        try {
            const lastClosed = localStorage.getItem(PROMOTION_CONFIG.storageKey);
            return !lastClosed;
        } catch (e) {
            return false; // 如果localStorage不可用，默认不显示
        }
    }
    
    // 记录推广关闭时间
    function recordPromotionClosed() {
        try {
            localStorage.setItem(PROMOTION_CONFIG.storageKey, Date.now().toString());
        } catch (e) {
            // 忽略localStorage错误
        }
    }
    
    // 注入CSS样式
    function injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .promotion-area {
                background: var(--vscode-notifications-background, #252526);
                border-top: 1px solid var(--vscode-notifications-border, #454545);
                padding: 8px 12px;
                font-size: 13px;
                color: var(--vscode-notifications-foreground, #cccccc);
            }
            
            .promotion-content {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 12px;
            }
            
            .promotion-text {
                flex: 1;
                line-height: 1.4;
            }
            
            .promotion-actions {
                display: flex;
                gap: 8px;
                align-items: center;
                white-space: nowrap;
            }
            
            .promotion-btn {
                padding: 4px 8px;
                border: 1px solid var(--vscode-button-border, transparent);
                border-radius: 2px;
                cursor: pointer;
                font-size: 12px;
                text-decoration: none;
                transition: background-color 0.2s ease;
            }
            
            .promotion-btn.secondary {
                background: transparent;
                color: var(--vscode-textLink-foreground, #3794ff);
                border: none;
            }
            
            .promotion-btn.secondary:hover {
                color: var(--vscode-textLink-activeForeground, #4daafc);
                text-decoration: underline;
            }
            
            .promotion-close {
                background: none;
                border: none;
                color: var(--vscode-notifications-foreground, #cccccc);
                font-size: 16px;
                cursor: pointer;
                padding: 2px;
                opacity: 0.7;
                transition: opacity 0.2s ease;
            }
            
            .promotion-close:hover {
                opacity: 1;
            }
        `;
        document.head.appendChild(style);
    }
    
    // 创建推广内容
    function createPromotionContent() {
        return `
            <div class="promotion-area" id="promotionArea">
                <div class="promotion-content">
                    <div class="promotion-text">
                        💡 <strong>Maven Helper</strong> - Visualize Maven dependencies and resolve conflicts easily
                    </div>
                    <div class="promotion-actions">
                        <a href="#" class="promotion-btn secondary" id="learnMore">Learn More</a>
                        <button class="promotion-close" id="closePromotion" title="Close">×</button>
                    </div>
                </div>
            </div>
        `;
    }
    
    // 绑定事件
    function bindEvents() {
        console.log('Binding promotion events...');
        
        // 了解更多按钮
        const learnMoreBtn = document.getElementById('learnMore');
        if (learnMoreBtn) {
            console.log('Learn More button found, binding click event');
            learnMoreBtn.addEventListener('click', function(e) {
                console.log('Learn More button clicked');
                e.preventDefault();
                // 通过VSCode API打开marketplace
                if (typeof vscode !== 'undefined') {
                    console.log('Sending openUrl message to VSCode');
                    vscode.postMessage({
                        command: 'openUrl',
                        url: PROMOTION_CONFIG.marketplaceUrl
                    });
                } else {
                    // 备用方案：复制链接到剪贴板
                    console.log('VSCode API not available, copying URL to clipboard');
                    navigator.clipboard.writeText(PROMOTION_CONFIG.marketplaceUrl).then(() => {
                        alert('Link copied to clipboard: ' + PROMOTION_CONFIG.marketplaceUrl);
                    }).catch(() => {
                        alert('Please visit manually: ' + PROMOTION_CONFIG.marketplaceUrl);
                    });
                }
            });
        } else {
            console.error('Learn More button not found');
        }
        
        // 关闭按钮
        const closeBtn = document.getElementById('closePromotion');
        if (closeBtn) {
            console.log('Close button found, binding click event');
            closeBtn.addEventListener('click', function() {
                console.log('Close button clicked');
                recordPromotionClosed();
                hidePromotion();
            });
        } else {
            console.error('Close button not found');
        }
    }
    
    // 显示推广
    function showPromotion() {
        console.log('Showing promotion...');
        const container = document.getElementById('promotionContainer');
        if (!container) {
            console.error('Promotion container not found');
            return;
        }
        
        // 注入样式
        injectStyles();
        
        // 设置内容
        container.innerHTML = createPromotionContent();
        
        // 绑定事件
        setTimeout(bindEvents, 100); // 延迟绑定，确保DOM元素已创建
    }
    
    // 隐藏推广
    function hidePromotion() {
        console.log('Hiding promotion...');
        const container = document.getElementById('promotionContainer');
        if (container) {
            container.innerHTML = '';
        }
    }
    
    // 初始化推广
    function initPromotion() {
        console.log('Initializing promotion...');
        const shouldShow = shouldShowPromotion();
        if (shouldShow) {
            console.log('Should show promotion, scheduling display...');
            setTimeout(showPromotion, PROMOTION_CONFIG.showDelay);
        } else {
            console.log('Promotion in cooldown period, not showing');
        }
    }
    
    // 当DOM加载完成后初始化推广
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPromotion);
    } else {
        // DOM已经加载完成
        initPromotion();
    }
    
})(); 