// 预算管理页面样式定义
export const budgetManagerStyles = `
/* 全局容器和基础样式 */
.budget-manager {
  height: 100%;
  overflow: hidden;
}

.container {
  display: grid;
  grid-template-columns: 380px 1fr;  /* 改为两栏布局，加宽左侧区域 */
  gap: 1.25rem;
  height: 100%;
  padding: 1.25rem;
  overflow: hidden;
}

.panel {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.12);
  border: 1px solid #eef2f7;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.panel:hover {
  box-shadow: 0 12px 40px rgba(0,0,0,0.15);
  transform: translateY(-2px);
}

.panel-header {
  padding: 1.35rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: 600;
  font-size: 1.15rem;
  border-radius: 16px 16px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.panel-body {
  flex: 1;
  padding: 1.35rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

/* 美化添加预算项按钮 */
.btn-add-budget {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  padding: 0.7rem 1.5rem;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;
  position: relative;
  overflow: hidden;
}

.btn-add-budget::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.5s;
}

.btn-add-budget:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.btn-add-budget:hover::before {
  left: 100%;
}

.btn-add-budget:active {
  transform: translateY(-1px);
}

.btn-add-budget .button-icon {
  font-size: 1.1rem;
  transition: transform 0.3s ease;
}

.btn-add-budget:hover .button-icon {
  transform: rotate(90deg);
}

/* 预算明细面板特殊样式 */
.budget-details-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.budget-details-panel .panel-body {
  flex: 1;
  overflow-y: auto;
}

/* 美化预算筛选器 */
.enhanced-budget-filters {
  margin-bottom: 1.75rem;
  padding: 1.75rem;
  background: linear-gradient(135deg, #f8f9ff 0%, #eef2ff 100%);
  border-radius: 16px;
  border: 1px solid #e0e7ff;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.08);
  width: 100%;
  box-sizing: border-box;
}

.filters-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.filters-header h4 {
  color: #495057;
  margin: 0;
  font-size: 1.05rem;
  font-weight: 600;
}

.btn-reset-filters {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1.1rem;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(255, 107, 107, 0.3);
}

.btn-reset-filters:hover {
  background: linear-gradient(135deg, #ee5a52 0%, #d14836 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(255, 107, 107, 0.4);
}

.filters-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.filter-label {
  font-weight: 500;
  color: #495057;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-label .label-icon {
  font-size: 1.1rem;
  color: #667eea;
}

.filter-options {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}

.filter-chip {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.6rem 1.1rem;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 24px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
  position: relative;
  overflow: hidden;
}

.filter-chip::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: -1;
}

.filter-chip:hover {
  background: #f1f5f9;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  border-color: #cbd5e1;
}

.filter-chip.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: #667eea;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  transform: translateY(-3px);
}

.filter-chip.active::before {
  opacity: 1;
}

.chip-icon {
  font-size: 1rem;
  transition: transform 0.3s ease;
}

.filter-chip:hover .chip-icon {
  transform: scale(1.1);
}

.chip-text {
  font-weight: 500;
}

.chip-count {
  background: rgba(255,255,255,0.3);
  padding: 0.15rem 0.6rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  backdrop-filter: blur(4px);
}

.range-filters {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: white;
  padding: 1rem;
  border-radius: 12px;
  border: 2px solid #e2e8f0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.range-input {
  flex: 1;
  padding: 0.7rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  background: #fff;
}

.range-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  background: #fff;
}

.range-separator {
  color: #6c757d;
  font-weight: 500;
  font-size: 1.1rem;
}

.filters-summary {
  padding-top: 1.25rem;
  border-top: 1px solid #e2e8f0;
  color: #6c757d;
  font-size: 0.9rem;
  text-align: center;
  font-weight: 500;
}

/* 美化预算列表 - 优化间距和文字显示 */
.enhanced-budget-list {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  flex: 1;
  overflow-y: auto;
}

.enhanced-card {
  border-radius: 16px;
  border: 1px solid #eef2f7;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px rgba(0,0,0,0.08);
  background: white;
  width: 100%;
  box-sizing: border-box;
  position: relative;
}

.enhanced-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, #667eea, #764ba2);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease;
}

.enhanced-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(0,0,0,0.15);
  border-color: #667eea;
}

.enhanced-card:hover::before {
  transform: scaleX(1);
}

.status-completed { border-left: 4px solid #4caf50; }
.status-partial { border-left: 4px solid #ff9800; }
.status-planned { border-left: 4px solid #2196f3; }

.card-header {
  padding: 1.3rem;
  border-bottom: 1px solid #eef2f7;
  background: #fafbff;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.item-main {
  flex: 1;
  min-width: 200px;
}

.item-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 0.75rem 0;
  line-height: 1.4;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.item-title .title-icon {
  font-size: 1.1rem;
  color: #667eea;
}

.item-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  align-items: center;
}

.category-tag, .status-tag, .date-tag {
  padding: 0.35rem 0.9rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
}

.category-tag {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  box-shadow: 0 2px 6px rgba(102, 126, 234, 0.3);
}

.category-tag:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 10px rgba(102, 126, 234, 0.4);
}

.status-tag {
  background: #e2e8f0;
  color: #4a5568;
}

.status-已完成 {
  background: linear-gradient(135deg, #4caf50, #81c784);
  color: white;
  box-shadow: 0 2px 6px rgba(76, 175, 80, 0.3);
}

.status-已预订 {
  background: linear-gradient(135deg, #2196f3, #64b5f6);
  color: white;
  box-shadow: 0 2px 6px rgba(33, 150, 243, 0.3);
}

.status-计划中 {
  background: linear-gradient(135deg, #ffc107, #ffd54f);
  color: #333;
  box-shadow: 0 2px 6px rgba(255, 193, 7, 0.3);
}

.date-tag {
  background: #e3f2fd;
  color: #1976d2;
}

.item-amount {
  text-align: right;
  min-width: 120px;
}

.amount-value {
  font-size: 1.5rem;
  font-weight: 800;
  color: #2d3748;
  margin-bottom: 0.25rem;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.amount-paid {
  font-size: 0.9rem;
  color: #718096;
  font-weight: 500;
}

.card-body {
  padding: 1.3rem;
}

.item-description {
  margin-bottom: 1.25rem;
}

.item-description p {
  color: #718096;
  line-height: 1.7;
  margin: 0;
  font-size: 0.95rem;
  word-break: break-word;
  hyphens: auto;
  text-align: justify;
  max-height: 120px;
  overflow-y: auto;
  padding-right: 8px;
}

.item-description p::-webkit-scrollbar {
  width: 6px;
}

.item-description p::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.item-description p::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.item-description p::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.item-progress-section {
  margin-bottom: 1.25rem;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  font-size: 0.9rem;
  color: #4a5568;
  font-weight: 500;
}

.progress-bar.enhanced {
  height: 12px;
  background: #e2e8f0;
  border-radius: 6px;
  overflow: hidden;
  position: relative;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.05);
}

.progress-bar.enhanced .progress-fill {
  height: 100%;
  border-radius: 6px;
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.progress-bar.enhanced .progress-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.payment-complete { background: linear-gradient(90deg, #4caf50, #81c784); }
.payment-high { background: linear-gradient(90deg, #ff9800, #ffb74d); }
.payment-medium { background: linear-gradient(90deg, #2196f3, #64b5f6); }
.payment-low { background: linear-gradient(90deg, #9e9e9e, #bdbdbd); }

.item-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1.25rem;
  padding-top: 1.25rem;
  border-top: 1px solid #edf2f7;
  flex-wrap: wrap;
}

.action-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 1.25rem;
  border: none;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 6px rgba(0,0,0,0.08);
  white-space: nowrap;
  position: relative;
  overflow: hidden;
}

.action-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.5s;
}

.action-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.12);
}

.action-button:hover::before {
  left: 100%;
}

.action-button.edit {
  background: linear-gradient(135deg, #e3f2fd, #bbdefb);
  color: #1976d2;
}

.action-button.edit:hover {
  background: linear-gradient(135deg, #bbdefb, #90caf9);
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.25);
}

.action-button.duplicate {
  background: linear-gradient(135deg, #f3e5f5, #e1bee7);
  color: #7b1fa2;
}

.action-button.duplicate:hover {
  background: linear-gradient(135deg, #e1bee7, #ce93d8);
  box-shadow: 0 4px 12px rgba(123, 31, 162, 0.25);
}

.action-button.delete {
  background: linear-gradient(135deg, #ffebee, #ffcdd2);
  color: #c62828;
}

.action-button.delete:hover {
  background: linear-gradient(135deg, #ffcdd2, #ef9a9a);
  box-shadow: 0 4px 12px rgba(198, 40, 40, 0.25);
}

.button-icon {
  font-size: 1.1rem;
  transition: transform 0.3s ease;
}

.action-button:hover .button-icon {
  transform: scale(1.1);
}

/* 空状态样式 */
.empty-state {
  text-align: center;
  padding: 2.5rem 1.5rem;
  color: #718096;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.empty-icon {
  font-size: 3.5rem;
  margin-bottom: 1.2rem;
  opacity: 0.7;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
}

.empty-state h3 {
  color: #2d3748;
  margin-bottom: 0.6rem;
  font-size: 1.3rem;
  font-weight: 600;
}

.empty-state p {
  color: #718096;
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.6;
}

/* 美化预算概览统计 - 左侧区域优化 */
.budget-summary {
  margin-bottom: 1.5rem;
}

.summary-card.total {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 18px;
  padding: 3rem 2.5rem;  /* 增加内边距，提供更多空间 */
  text-align: center;
  margin-bottom: 1.5rem;
  box-shadow: 0 8px 30px rgba(102, 126, 234, 0.3);
  position: relative;
  overflow: hidden;
  border: none;
  min-height: 220px;  /* 设置最小高度确保内容完整显示 */
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.summary-card.total::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
  transform: rotate(30deg);
}

.summary-value {
  font-size: 2.8rem;  /* 稍微减小字体大小 */
  font-weight: 800;
  margin-bottom: 1rem;  /* 增加下边距 */
  text-shadow: 0 2px 4px rgba(0,0,0,0.2);
  letter-spacing: -0.5px;
  color: white;  /* 使用纯白色而不是渐变文字 */
  line-height: 1.2;  /* 增加行高确保文字完整显示 */
}

.summary-label {
  font-size: 1.2rem;  /* 稍微增大标签字体 */
  opacity: 0.95;
  margin-bottom: 1.2rem;  /* 增加下边距 */
  font-weight: 500;
  color: white;  /* 确保标签文字清晰可见 */
}

.summary-trend {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  padding: 0.6rem 1.2rem;  /* 增加内边距 */
  border-radius: 20px;
  background: rgba(255,255,255,0.25);
  backdrop-filter: blur(10px);
  font-weight: 500;
  color: #e8f5e8;  /* 使用浅绿色确保可见性 */
}

.trend-good { color: #e8f5e8; }
.trend-normal { color: #fff9c4; }
.trend-warning { color: #ffe0b2; }
.trend-danger { color: #ffcdd2; }

/* 美化统计数据 - 更紧凑的布局 */
.summary-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-item {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  padding: 1.2rem;
  border-radius: 14px;
  text-align: center;
  border: 1px solid #e2e8f0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  position: relative;
  overflow: hidden;
}

.stat-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, #667eea, #764ba2);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease;
}

.stat-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.1);
  border-color: #667eea;
}

.stat-item:hover::before {
  transform: scaleX(1);
}

.stat-icon {
  font-size: 1.7rem;
  margin-bottom: 0.7rem;
  transition: transform 0.3s ease;
}

.stat-item:hover .stat-icon {
  transform: scale(1.1);
}

.icon-good { color: #4caf50; }
.icon-normal { color: #ff9800; }
.icon-warning { color: #ff5722; }
.icon-danger { color: #f44336; }

.stat-content .stat-value {
  font-size: 1.3rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 0.2rem;
}

.stat-content .stat-label {
  font-size: 0.85rem;
  color: #718096;
  font-weight: 500;
}

/* 美化预算进度条 */
.enhanced-budget-progress {
  margin-bottom: 1.5rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, #f8f9ff 0%, #eef2ff 100%);
  border-radius: 18px;
  border: 1px solid #e0e7ff;
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.08);
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.progress-title {
  font-weight: 700;
  color: #2d3748;
  font-size: 1.1rem;
}

.progress-percentage {
  font-size: 1.2rem;
  font-weight: 800;
  color: #667eea;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.progress-container {
  position: relative;
  margin-bottom: 1.25rem;
}

.progress-track {
  height: 18px;
  background: #e2e8f0;
  border-radius: 9px;
  overflow: hidden;
  position: relative;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
}

.track-good { background: linear-gradient(90deg, #e8f5e8, #c8e6c9); }
.track-normal { background: linear-gradient(90deg, #fff8e1, #ffecb3); }
.track-warning { background: linear-gradient(90deg, #ffe0b2, #ffcc80); }
.track-danger { background: linear-gradient(90deg, #ffcdd2, #ef9a9a); }

.progress-fill {
  height: 100%;
  border-radius: 9px;
  transition: width 1.2s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}

.progress-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
  animation: progressShimmer 2s infinite;
}

@keyframes progressShimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.fill-good { background: linear-gradient(90deg, #4caf50, #81c784); }
.fill-normal { background: linear-gradient(90deg, #ff9800, #ffb74d); }
.fill-warning { background: linear-gradient(90deg, #ff5722, #ff8a65); }
.fill-danger { background: linear-gradient(90deg, #f44336, #ef5350); }

.progress-markers {
  display: flex;
  justify-content: space-between;
  position: relative;
  margin-top: 0.6rem;
}

.marker {
  font-size: 0.8rem;
  color: #718096;
  transform: translateX(-50%);
  font-weight: 500;
}

.progress-insights {
  background: white;
  border-radius: 14px;
  padding: 1rem;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

.insight-item {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.5rem 0;
  font-size: 0.9rem;
  color: #4a5568;
  font-weight: 500;
}

.insight-icon {
  font-size: 1.2rem;
}

/* 美化分类统计 */
.enhanced-category-stats {
  margin-top: 1.5rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
  padding-bottom: 0.7rem;
  border-bottom: 2px solid #e2e8f0;
}

.section-header h4 {
  color: #2d3748;
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
}

.stats-summary {
  color: #718096;
  font-size: 0.85rem;
  font-weight: 500;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 1rem;
}

.category-card {
  background: white;
  border-radius: 14px;
  padding: 1.1rem;
  border: 1px solid #e2e8f0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  position: relative;
  overflow: hidden;
}

.category-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, #667eea, #764ba2);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease;
}

.category-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.12);
  border-color: #667eea;
}

.category-card:hover::before {
  transform: scaleX(1);
}

.category-high { border-left: 4px solid #f44336; }
.category-medium { border-left: 4px solid #ff9800; }
.category-low { border-left: 4px solid #4caf50; }

.category-header {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  margin-bottom: 0.9rem;
}

.category-icon {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.1rem;
  flex-shrink: 0;
  box-shadow: 0 4px 10px rgba(0,0,0,0.15);
  transition: transform 0.3s ease;
}

.category-card:hover .category-icon {
  transform: scale(1.1);
}

.category-name {
  font-weight: 700;
  color: #2d3748;
  font-size: 0.9rem;
}

.category-content .category-amount {
  font-size: 1.2rem;
  font-weight: 800;
  color: #2d3748;
  margin-bottom: 0.2rem;
}

.category-content .category-percent {
  font-size: 0.85rem;
  color: #718096;
  margin-bottom: 0.6rem;
  font-weight: 500;
}

.category-progress .progress-bar.small {
  height: 7px;
  background: #e2e8f0;
  border-radius: 3.5px;
  overflow: hidden;
}

.category-progress .progress-fill {
  height: 100%;
  border-radius: 3.5px;
  transition: width 0.6s ease;
}

/* 美化模态框 */
.enhanced-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(10px);
  animation: fadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.enhanced-modal-container {
  background: white;
  border-radius: 22px;
  box-shadow: 0 30px 60px rgba(0,0,0,0.3);
  width: 90%;
  max-width: 650px;
  max-height: 90vh;
  overflow: hidden;
  animation: modalSlideIn 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid #e2e8f0;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-50px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.enhanced-modal-header {
  padding: 1.75rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 22px 22px 0 0;
}

.enhanced-modal-header h3 {
  margin: 0;
  font-size: 1.4rem;
  font-weight: 700;
}

.close-button {
  background: none;
  border: none;
  color: white;
  font-size: 1.8rem;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s ease;
}

.close-button:hover {
  background: rgba(255,255,255,0.2);
}

.enhanced-modal-body {
  padding: 1.75rem;
  max-height: 60vh;
  overflow-y: auto;
}

.enhanced-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.input-group.full-width {
  grid-column: 1 / -1;
}

.enhanced-input, .enhanced-select, .enhanced-textarea {
  width: 100%;
  padding: 0.9rem 1.1rem;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: #fff;
  font-weight: 400;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
}

.enhanced-input:focus, .enhanced-select:focus, .enhanced-textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.2);
  background: #fff;
  transform: translateY(-1px);
}

.enhanced-textarea {
  resize: vertical;
  min-height: 110px;
}

.enhanced-modal-actions {
  display: flex;
  gap: 1.1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 2px solid #e2e8f0;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .container {
    grid-template-columns: 260px 1fr 320px;
    gap: 0.75rem;
    padding: 0.75rem;
  }
  
  .filters-grid {
    grid-template-columns: 1fr;
  }
  
  .categories-grid {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  }
  
  .summary-stats {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 992px) {
  .container {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr auto;
    gap: 1rem;
    padding: 1rem;
  }
  
  .budget-overview-panel, .budget-details-panel, .savings-panel {
    height: auto;
  }
  
  .summary-stats {
    grid-template-columns: 1fr;
  }
  
  .categories-grid {
    grid-template-columns: 1fr 1fr;
  }
  
  .item-header {
    flex-direction: column;
    gap: 1rem;
  }
  
  .item-actions {
    flex-direction: column;
  }
  
  .action-button {
    width: 100%;
    justify-content: center;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .container {
    padding: 0.5rem;
    gap: 0.5rem;
  }
  
  .panel-header {
    padding: 1rem;
    font-size: 1rem;
  }
  
  .panel-body {
    padding: 1rem;
  }
  
  .enhanced-budget-filters {
    padding: 1.1rem;
  }
  
  .filters-grid {
    gap: 0.8rem;
  }
  
  .filter-chip {
    padding: 0.4rem 0.7rem;
    font-size: 0.75rem;
  }
  
  .enhanced-card {
    border-radius: 12px;
  }
  
  .card-header, .card-body {
    padding: 0.9rem;
  }
  
  .item-title {
    font-size: 1rem;
  }
  
  .amount-value {
    font-size: 1.2rem;
  }
  
  .enhanced-modal-container {
    width: 95%;
    margin: 0.5rem;
    border-radius: 18px;
  }
  
  .enhanced-modal-header {
    padding: 1.25rem;
    border-radius: 18px 18px 0 0;
  }
  
  .enhanced-modal-body {
    padding: 1.25rem;
  }
  
  .enhanced-modal-actions {
    flex-direction: column;
    gap: 0.6rem;
  }
  
  .action-button {
    width: 100%;
    justify-content: center;
  }
  
  .summary-card.total {
    padding: 2rem 1.5rem;  /* 移动端适当减小内边距 */
    min-height: 180px;     /* 移动端减小最小高度 */
  }
  
  .summary-value {
    font-size: 2.2rem;     /* 移动端减小字体大小 */
  }
  
  .stat-item {
    padding: 1rem;
  }
  
  .stat-content .stat-value {
    font-size: 1.1rem;
  }
}
`;