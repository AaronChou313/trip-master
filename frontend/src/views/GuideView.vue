<template>
  <div class="guide-container">
    <div class="guide-header">
      <h1>使用指南</h1>
      <p>欢迎使用 TripMaster 旅行规划助手！以下是各功能模块的详细使用说明。</p>
    </div>

    <div class="guide-content">
      <!-- 快速导航 -->
      <div class="quick-nav">
        <button @click="scrollToSection('pois')" class="nav-btn">
          <span class="icon">📍</span>
          <span>地点管理</span>
        </button>
        <button @click="scrollToSection('itinerary')" class="nav-btn">
          <span class="icon">🗺️</span>
          <span>行程规划</span>
        </button>
        <button @click="scrollToSection('budget')" class="nav-btn">
          <span class="icon">💰</span>
          <span>预算管理</span>
        </button>
        <button @click="scrollToSection('memos')" class="nav-btn">
          <span class="icon">📝</span>
          <span>备忘事项</span>
        </button>
      </div>

      <!-- 地点管理 -->
      <section id="pois" class="guide-section">
        <div class="section-header">
          <h2>📍 地点管理</h2>
          <div class="section-badge">第一步</div>
        </div>
        <div class="section-content">
          <div class="step-list">
            <div class="step-item">
              <div class="step-number">1</div>
              <div class="step-content">
                <h3>搜索景点</h3>
                <p>在搜索框中输入您想去的景点名称或关键词，系统将显示相关景点列表。</p>
              </div>
            </div>
            <div class="step-item">
              <div class="step-number">2</div>
              <div class="step-content">
                <h3>浏览搜索结果</h3>
                <p>在搜索结果列表中查看景点的详细信息，包括名称、地址、描述等。</p>
              </div>
            </div>
            <div class="step-item">
              <div class="step-number">3</div>
              <div class="step-content">
                <h3>添加到兴趣点</h3>
                <p>点击目标景点卡片右侧的 <strong>➕ 加号按钮</strong>，将其添加到您的兴趣点列表中。</p>
              </div>
            </div>
            <div class="step-item">
              <div class="step-number">4</div>
              <div class="step-content">
                <h3>管理兴趣点</h3>
                <p>在"我的兴趣点"区域，您可以查看、编辑或删除已添加的景点。</p>
              </div>
            </div>
          </div>
          <div class="tips-box">
            <div class="tips-icon">💡</div>
            <div class="tips-content">
              <h4>小贴士</h4>
              <ul>
                <li>建议先收集所有感兴趣的景点，再进行行程规划</li>
                <li>可以添加多个城市或地区的景点</li>
                <li>查看景点详情可以帮助您更好地安排行程</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <!-- 行程规划 -->
      <section id="itinerary" class="guide-section">
        <div class="section-header">
          <h2>🗺️ 行程规划</h2>
          <div class="section-badge">第二步</div>
        </div>
        <div class="section-content">
          <div class="step-list">
            <div class="step-item">
              <div class="step-number">1</div>
              <div class="step-content">
                <h3>创建行程</h3>
                <p>点击"创建行程"按钮，输入行程名称、日期等基本信息。</p>
              </div>
            </div>
            <div class="step-item">
              <div class="step-number">2</div>
              <div class="step-content">
                <h3>添加景点到行程</h3>
                <p>从左侧的兴趣点列表中，选择您想包含的景点，点击添加到当前行程中。</p>
              </div>
            </div>
            <div class="step-item">
              <div class="step-number">3</div>
              <div class="step-content">
                <h3>查看路线地图</h3>
                <p>右侧地图将自动显示已添加景点的位置，并用连线显示游玩顺序。</p>
              </div>
            </div>
            <div class="step-item">
              <div class="step-number">4</div>
              <div class="step-content">
                <h3>编辑景点详情</h3>
                <p>点击景点卡片可编辑：</p>
                <ul>
                  <li><strong>备注</strong>：添加游玩建议或注意事项</li>
                  <li><strong>景点预算</strong>：设置该景点的预计花费</li>
                  <li><strong>交通方式</strong>：选择前往下一个景点的交通方式（步行/公交/打车等）</li>
                  <li><strong>交通预算</strong>：设置预计的交通费用</li>
                </ul>
              </div>
            </div>
            <div class="step-item">
              <div class="step-number">5</div>
              <div class="step-content">
                <h3>调整顺序</h3>
                <p>拖动景点卡片可以调整游玩顺序，地图路线会自动更新。</p>
              </div>
            </div>
          </div>
          <div class="tips-box">
            <div class="tips-icon">💡</div>
            <div class="tips-content">
              <h4>小贴士</h4>
              <ul>
                <li>建议按地理位置相近的景点安排在同一天</li>
                <li>合理分配每个景点的游玩时间</li>
                <li>考虑交通方式和时间成本来优化路线</li>
                <li>可以为不同的日期创建多个行程</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <!-- 预算管理 -->
      <section id="budget" class="guide-section">
        <div class="section-header">
          <h2>💰 预算管理</h2>
          <div class="section-badge">第三步</div>
        </div>
        <div class="section-content">
          <div class="step-list">
            <div class="step-item">
              <div class="step-number">1</div>
              <div class="step-content">
                <h3>自动同步行程预算</h3>
                <p>点击"从行程同步"按钮，系统将自动汇总所有行程中设置的景点预算和交通预算。</p>
              </div>
            </div>
            <div class="step-item">
              <div class="step-number">2</div>
              <div class="step-content">
                <h3>添加其他预算项目</h3>
                <p>除了自动同步的行程预算，您还可以手动添加：</p>
                <ul>
                  <li><strong>交通预算</strong>：往返机票、高铁票等大额交通费用</li>
                  <li><strong>住宿预算</strong>：酒店、民宿等住宿费用</li>
                  <li><strong>其他预算</strong>：餐饮、购物、应急资金等</li>
                </ul>
              </div>
            </div>
            <div class="step-item">
              <div class="step-number">3</div>
              <div class="step-content">
                <h3>记录实际消费</h3>
                <p>旅游过程中或结束后，点击编辑按钮，填入每项预算的实际消费金额。</p>
              </div>
            </div>
            <div class="step-item">
              <div class="step-number">4</div>
              <div class="step-content">
                <h3>查看统计分析</h3>
                <p>右侧图表区域会显示：</p>
                <ul>
                  <li><strong>预算分布</strong>：各分类预算占比的饼图</li>
                  <li><strong>预算 vs 实际</strong>：预算与实际消费对比的柱状图</li>
                  <li><strong>总预算卡片</strong>：显示预算总数、实际消费总数和节省/超支金额</li>
                </ul>
              </div>
            </div>
          </div>
          <div class="tips-box">
            <div class="tips-icon">💡</div>
            <div class="tips-content">
              <h4>小贴士</h4>
              <ul>
                <li>实际消费超过预算时，金额会以红色高亮显示</li>
                <li>定期更新实际消费，可以更好地控制支出</li>
                <li>保存记录便于下次旅行时参考</li>
                <li>使用"导出数据"功能可以备份所有预算信息</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <!-- 备忘事项 -->
      <section id="memos" class="guide-section">
        <div class="section-header">
          <h2>📝 备忘事项</h2>
          <div class="section-badge">随时记录</div>
        </div>
        <div class="section-content">
          <div class="step-list">
            <div class="step-item">
              <div class="step-number">1</div>
              <div class="step-content">
                <h3>创建备忘</h3>
                <p>点击"新建备忘"按钮，输入备忘事项的标题和内容。</p>
              </div>
            </div>
            <div class="step-item">
              <div class="step-number">2</div>
              <div class="step-content">
                <h3>使用 Markdown 格式</h3>
                <p>支持 Markdown 语法，让您的备忘更加美观：</p>
                <ul>
                  <li><strong># 标题</strong>：使用 # 号创建标题</li>
                  <li><strong>**加粗**</strong>：使用双星号加粗文字</li>
                  <li><strong>*斜体*</strong>：使用单星号斜体文字</li>
                  <li><strong>- 列表</strong>：使用减号创建列表</li>
                  <li><strong>[链接](url)</strong>：创建超链接</li>
                </ul>
              </div>
            </div>
            <div class="step-item">
              <div class="step-number">3</div>
              <div class="step-content">
                <h3>预览效果</h3>
                <p>编辑时实时预览 Markdown 渲染效果，所见即所得。</p>
              </div>
            </div>
            <div class="step-item">
              <div class="step-number">4</div>
              <div class="step-content">
                <h3>管理备忘</h3>
                <p>可以编辑、删除备忘事项，也可以快速查看所有备忘列表。</p>
              </div>
            </div>
          </div>
          <div class="tips-box">
            <div class="tips-icon">💡</div>
            <div class="tips-content">
              <h4>备忘示例</h4>
              <div class="memo-example">
                <h5>旅行前准备</h5>
                <ul>
                  <li>证件：身份证、护照</li>
                  <li>衣物：根据天气准备合适的衣服</li>
                  <li>药品：常用药品、急救包</li>
                  <li>电子设备：充电器、充电宝</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 数据管理 -->
      <section class="guide-section">
        <div class="section-header">
          <h2>🗂️ 数据管理</h2>
          <div class="section-badge">安全备份</div>
        </div>
        <div class="section-content">
          <div class="data-manage-grid">
            <div class="data-card">
              <div class="card-icon">📤</div>
              <h3>导出数据</h3>
              <p>将您的所有数据（地点、行程、预算、备忘）导出为 JSON 文件，便于备份。</p>
            </div>
            <div class="data-card">
              <div class="card-icon">📥</div>
              <h3>导入数据</h3>
              <p>从之前导出的 JSON 文件中恢复数据，方便换设备使用。</p>
            </div>
          </div>
          <div class="tips-box">
            <div class="tips-icon">🔒</div>
            <div class="tips-content">
              <h4>安全建议</h4>
              <ul>
                <li>定期导出数据进行备份</li>
                <li>将备份文件保存在安全的地方</li>
                <li>更换设备前先导出数据</li>
                <li>建议使用云存储保存备份文件</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GuideView',
  methods: {
    scrollToSection(sectionId) {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }
};
</script>

<style scoped>
.guide-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
}

.guide-header {
  text-align: center;
  margin-bottom: 3rem;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
}

.guide-header h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.guide-header p {
  font-size: 1.1rem;
  opacity: 0.9;
}

.guide-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.quick-nav {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: white;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  position: sticky;
  top: 10px;
  z-index: 100;
}

.nav-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, #f8f9ff 0%, #eef2ff 100%);
  border: 2px solid #e0e7ff;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  color: #4a5568;
  min-width: 100px;
}

.nav-btn:hover {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3);
  border-color: #667eea;
}

.nav-btn .icon {
  font-size: 1.8rem;
}

.guide-section {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  scroll-margin-top: 120px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 3px solid #f0f0f0;
}

.section-header h2 {
  font-size: 2rem;
  color: #2d3748;
}

.section-badge {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
}

.step-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.step-item {
  display: flex;
  gap: 1.5rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, #f8f9ff 0%, #f5f5ff 100%);
  border-radius: 15px;
  transition: all 0.3s ease;
}

.step-item:hover {
  transform: translateX(10px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.15);
}

.step-number {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  flex-shrink: 0;
}

.step-content {
  flex: 1;
}

.step-content h3 {
  font-size: 1.3rem;
  color: #2d3748;
  margin-bottom: 0.75rem;
}

.step-content p {
  color: #4a5568;
  line-height: 1.7;
}

.step-content ul {
  margin-left: 1.5rem;
  margin-top: 0.75rem;
  color: #4a5568;
  line-height: 1.7;
}

.step-content li {
  margin-bottom: 0.5rem;
}

.tips-box {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, #fff9c4 0%, #fff59d 100%);
  border-radius: 15px;
  border-left: 4px solid #ffc107;
}

.tips-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.tips-content h4 {
  font-size: 1.2rem;
  color: #2d3748;
  margin-bottom: 0.75rem;
}

.tips-content ul {
  margin-left: 1.5rem;
  color: #4a5568;
  line-height: 1.7;
}

.tips-content li {
  margin-bottom: 0.5rem;
}

.memo-example {
  background: white;
  padding: 1rem;
  border-radius: 10px;
  margin-top: 0.75rem;
}

.memo-example h5 {
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.memo-example ul {
  margin-left: 1.5rem;
  margin-bottom: 0;
}

.data-manage-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.data-card {
  padding: 1.5rem;
  background: linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%);
  border-radius: 15px;
  text-align: center;
  transition: all 0.3s ease;
}

.data-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(76, 175, 80, 0.2);
}

.card-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.data-card h3 {
  font-size: 1.3rem;
  color: #2d3748;
  margin-bottom: 0.75rem;
}

.data-card p {
  color: #4a5568;
  line-height: 1.7;
}

@media (max-width: 768px) {
  .guide-container {
    padding: 1rem;
  }

  .guide-header h1 {
    font-size: 1.8rem;
  }

  .guide-header p {
    font-size: 1rem;
  }

  .quick-nav {
    position: static;
    padding: 1rem;
  }

  .nav-btn {
    padding: 0.75rem 1rem;
    min-width: 80px;
  }

  .nav-btn .icon {
    font-size: 1.4rem;
  }

  .section-header h2 {
    font-size: 1.5rem;
  }

  .step-item {
    flex-direction: column;
    padding: 1rem;
  }

  .step-number {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
  }

  .data-manage-grid {
    grid-template-columns: 1fr;
  }

  .tips-box {
    flex-direction: column;
  }
}
</style>
