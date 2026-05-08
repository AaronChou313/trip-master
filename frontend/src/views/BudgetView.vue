<template>
  <div class="budget-container">
    <!-- <h1 class="page-title">预算管理</h1> -->
    
    <div class="budget-content">
      <!-- 左侧预算分类 -->
      <div class="budget-categories">
        <div class="category-section">
          <div class="section-header">
            <h2>行程预算</h2>
            <div class="header-actions">
              <button @click="exportBudget" class="btn btn-secondary">导出预算</button>
              <button @click="syncFromItineraries" class="btn btn-secondary">从行程同步</button>
            </div>
          </div>
          <div class="budget-items">
            <div
              v-for="item in itineraryBudgets"
              :key="item.id"
              class="budget-item"
            >
              <div class="item-info">
                <h3>{{ item.name }}</h3>
                <p>{{ item.description || '无描述' }}</p>
              </div>
              <div class="item-amounts">
                <div class="amount-row budget">
                  <span class="amount-label">预算:</span>
                  <span class="amount-value">¥{{ item.amount?.toLocaleString() || 0 }}</span>
                </div>
                <div class="amount-row actual">
                  <span class="amount-label">实际:</span>
                  <span class="amount-value" :class="{ 'over-budget': (item.actualAmount || 0) > (item.amount || 0) }">
                    ¥{{ (item.actualAmount || 0).toLocaleString() }}
                  </span>
                </div>
              </div>
              <div class="item-actions">
                <button @click="editBudget(item)" class="btn-icon edit">✏️</button>
                <button @click="deleteBudget(item.id)" class="btn-icon delete">🗑️</button>
              </div>
            </div>
          </div>
          <div class="category-totals">
            <div class="total-row budget">
              <span>预算小计:</span>
              <span>¥{{ itineraryTotal.toLocaleString() }}</span>
            </div>
            <div class="total-row actual" :class="{ 'over-budget': itineraryActualTotal > itineraryTotal }">
              <span>实际小计:</span>
              <span>¥{{ itineraryActualTotal.toLocaleString() }}</span>
            </div>
          </div>
        </div>
        
        <div class="category-section">
          <div class="section-header">
            <h2>交通预算</h2>
            <button @click="addTransportBudget" class="btn btn-primary">+ 添加</button>
          </div>
          <div class="budget-items">
            <div
              v-for="item in transportBudgets"
              :key="item.id"
              class="budget-item"
            >
              <div class="item-info">
                <h3>{{ item.name }}</h3>
                <p>{{ item.description || '无描述' }}</p>
              </div>
              <div class="item-amounts">
                <div class="amount-row budget">
                  <span class="amount-label">预算:</span>
                  <span class="amount-value">¥{{ item.amount?.toLocaleString() || 0 }}</span>
                </div>
                <div class="amount-row actual">
                  <span class="amount-label">实际:</span>
                  <span class="amount-value" :class="{ 'over-budget': (item.actualAmount || 0) > (item.amount || 0) }">
                    ¥{{ (item.actualAmount || 0).toLocaleString() }}
                  </span>
                </div>
              </div>
              <div class="item-actions">
                <button @click="editBudget(item)" class="btn-icon edit">✏️</button>
                <button @click="deleteBudget(item.id)" class="btn-icon delete">🗑️</button>
              </div>
            </div>
          </div>
          <div class="category-totals">
            <div class="total-row budget">
              <span>预算小计:</span>
              <span>¥{{ transportTotal.toLocaleString() }}</span>
            </div>
            <div class="total-row actual" :class="{ 'over-budget': transportActualTotal > transportTotal }">
              <span>实际小计:</span>
              <span>¥{{ transportActualTotal.toLocaleString() }}</span>
            </div>
          </div>
        </div>
        
        <div class="category-section">
          <div class="section-header">
            <h2>住宿预算</h2>
            <button @click="addAccommodationBudget" class="btn btn-primary">+ 添加</button>
          </div>
          <div class="budget-items">
            <div
              v-for="item in accommodationBudgets"
              :key="item.id"
              class="budget-item"
            >
              <div class="item-info">
                <h3>{{ item.name }}</h3>
                <p>{{ item.description || '无描述' }}</p>
              </div>
              <div class="item-amounts">
                <div class="amount-row budget">
                  <span class="amount-label">预算:</span>
                  <span class="amount-value">¥{{ item.amount?.toLocaleString() || 0 }}</span>
                </div>
                <div class="amount-row actual">
                  <span class="amount-label">实际:</span>
                  <span class="amount-value" :class="{ 'over-budget': (item.actualAmount || 0) > (item.amount || 0) }">
                    ¥{{ (item.actualAmount || 0).toLocaleString() }}
                  </span>
                </div>
              </div>
              <div class="item-actions">
                <button @click="editBudget(item)" class="btn-icon edit">✏️</button>
                <button @click="deleteBudget(item.id)" class="btn-icon delete">🗑️</button>
              </div>
            </div>
          </div>
          <div class="category-totals">
            <div class="total-row budget">
              <span>预算小计:</span>
              <span>¥{{ accommodationTotal.toLocaleString() }}</span>
            </div>
            <div class="total-row actual" :class="{ 'over-budget': accommodationActualTotal > accommodationTotal }">
              <span>实际小计:</span>
              <span>¥{{ accommodationActualTotal.toLocaleString() }}</span>
            </div>
          </div>
        </div>
        
        <div class="category-section">
          <div class="section-header">
            <h2>其他预算</h2>
            <button @click="addCustomBudget" class="btn btn-primary">+ 添加</button>
          </div>
          <div class="budget-items">
            <div
              v-for="item in customBudgets"
              :key="item.id"
              class="budget-item"
            >
              <div class="item-info">
                <h3>{{ item.name }}</h3>
                <p>{{ item.description || '无描述' }}</p>
              </div>
              <div class="item-amounts">
                <div class="amount-row budget">
                  <span class="amount-label">预算:</span>
                  <span class="amount-value">¥{{ item.amount?.toLocaleString() || 0 }}</span>
                </div>
                <div class="amount-row actual">
                  <span class="amount-label">实际:</span>
                  <span class="amount-value" :class="{ 'over-budget': (item.actualAmount || 0) > (item.amount || 0) }">
                    ¥{{ (item.actualAmount || 0).toLocaleString() }}
                  </span>
                </div>
              </div>
              <div class="item-actions">
                <button @click="editBudget(item)" class="btn-icon edit">✏️</button>
                <button @click="deleteBudget(item.id)" class="btn-icon delete">🗑️</button>
              </div>
            </div>
          </div>
          <div class="category-totals">
            <div class="total-row budget">
              <span>预算小计:</span>
              <span>¥{{ customTotal.toLocaleString() }}</span>
            </div>
            <div class="total-row actual" :class="{ 'over-budget': customActualTotal > customTotal }">
              <span>实际小计:</span>
              <span>¥{{ customActualTotal.toLocaleString() }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 右侧图表和总预算区域 -->
      <div class="budget-sidebar">
        <!-- 总预算卡片 -->
        <div class="total-budget-card">
          <div class="budget-card">
            <h2>总预算</h2>
            <div class="amount">¥{{ totalBudget.toLocaleString() }}</div>
          </div>
          <div class="actual-budget-card">
            <h2>实际消费</h2>
            <div class="amount" :class="{ 'over-budget': totalActualBudget > totalBudget }">
              ¥{{ totalActualBudget.toLocaleString() }}
            </div>
            <div class="budget-diff">
              <span v-if="totalBudget >= totalActualBudget" class="saved">
                节省: ¥{{ (totalBudget - totalActualBudget).toLocaleString() }}
              </span>
              <span v-else class="over">
                超支: ¥{{ (totalActualBudget - totalBudget).toLocaleString() }}
              </span>
            </div>
          </div>
        </div>
        
        <!-- 图表区域 -->
        <div class="budget-charts">
          <div class="chart-section">
            <h2>预算分布</h2>
            <canvas ref="pieChartRef" class="chart-canvas"></canvas>
          </div>

          <div class="chart-section">
            <h2>预算 vs 实际</h2>
            <canvas ref="barChartRef" class="chart-canvas"></canvas>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 编辑模态框 -->
    <div v-if="showEditModal" class="modal-overlay" @click="closeEditModal">
      <div class="modal-content" @click.stop>
        <h2>{{ editingBudget?.id ? '编辑预算' : '添加预算' }}</h2>
        <form @submit.prevent="saveBudget">
          <div class="form-group">
            <label>项目名称</label>
            <input v-model="editingBudget.name" required class="form-input">
          </div>
          <div class="form-group">
            <label>描述</label>
            <textarea v-model="editingBudget.description" class="form-textarea"></textarea>
          </div>
          <div class="form-group">
            <label>预算金额</label>
            <input v-model.number="editingBudget.amount" type="number" required class="form-input">
          </div>
          <div class="form-group">
            <label>实际消费</label>
            <input v-model.number="editingBudget.actualAmount" type="number" class="form-input" placeholder="0">
          </div>
          <div class="form-group">
            <label>类别</label>
            <select v-model="editingBudget.category" class="form-select">
              <option value="itinerary">行程</option>
              <option value="transport">交通</option>
              <option value="accommodation">住宿</option>
              <option value="custom">其他</option>
            </select>
          </div>
          <div class="modal-actions">
            <button type="button" @click="closeEditModal" class="btn btn-secondary">取消</button>
            <button type="submit" class="btn btn-primary">保存</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import Chart from 'chart.js/auto';
import budgetService from '../services/budgetService';
import itineraryService from '../services/itineraryService';
import apiClient from '../utils/apiClient';

export default {
  name: 'BudgetView',
  setup() {
    const route = useRoute();
    const budgets = ref([]);
    const showEditModal = ref(false);
    const editingBudget = ref(null);
    const pieChartRef = ref(null);
    const barChartRef = ref(null);
    let pieChart = null;
    let barChart = null;

    // 按类别分组预算
    const itineraryBudgets = computed(() => {
      return budgets.value.filter(budget => budget.category === 'itinerary');
    });

    const transportBudgets = computed(() => {
      return budgets.value.filter(budget => budget.category === 'transport');
    });

    const accommodationBudgets = computed(() => {
      return budgets.value.filter(budget => budget.category === 'accommodation');
    });

    const customBudgets = computed(() => {
      return budgets.value.filter(budget => budget.category === 'custom');
    });

    // 计算各类别的小计 - 修复数值转换问题
    const itineraryTotal = computed(() => {
      const total = itineraryBudgets.value.reduce((sum, budget) => {
        const amount = parseFloat(budget.amount) || 0;
        return sum + amount;
      }, 0);
      return Math.round(total * 100) / 100; // 保留两位小数
    });

    const transportTotal = computed(() => {
      const total = transportBudgets.value.reduce((sum, budget) => {
        const amount = parseFloat(budget.amount) || 0;
        return sum + amount;
      }, 0);
      return Math.round(total * 100) / 100;
    });

    const accommodationTotal = computed(() => {
      const total = accommodationBudgets.value.reduce((sum, budget) => {
        const amount = parseFloat(budget.amount) || 0;
        return sum + amount;
      }, 0);
      return Math.round(total * 100) / 100;
    });

    const customTotal = computed(() => {
      const total = customBudgets.value.reduce((sum, budget) => {
        const amount = parseFloat(budget.amount) || 0;
        return sum + amount;
      }, 0);
      return Math.round(total * 100) / 100;
    });

    // 计算总预算
    const totalBudget = computed(() => {
      const total = itineraryTotal.value + transportTotal.value + accommodationTotal.value + customTotal.value;
      return Math.round(total * 100) / 100;
    });

    // 计算各类别的实际消费小计
    const itineraryActualTotal = computed(() => {
      const total = itineraryBudgets.value.reduce((sum, budget) => {
        const amount = parseFloat(budget.actualAmount) || 0;
        return sum + amount;
      }, 0);
      return Math.round(total * 100) / 100;
    });

    const transportActualTotal = computed(() => {
      const total = transportBudgets.value.reduce((sum, budget) => {
        const amount = parseFloat(budget.actualAmount) || 0;
        return sum + amount;
      }, 0);
      return Math.round(total * 100) / 100;
    });

    const accommodationActualTotal = computed(() => {
      const total = accommodationBudgets.value.reduce((sum, budget) => {
        const amount = parseFloat(budget.actualAmount) || 0;
        return sum + amount;
      }, 0);
      return Math.round(total * 100) / 100;
    });

    const customActualTotal = computed(() => {
      const total = customBudgets.value.reduce((sum, budget) => {
        const amount = parseFloat(budget.actualAmount) || 0;
        return sum + amount;
      }, 0);
      return Math.round(total * 100) / 100;
    });

    // 计算总实际消费
    const totalActualBudget = computed(() => {
      const total = itineraryActualTotal.value + transportActualTotal.value + accommodationActualTotal.value + customActualTotal.value;
      return Math.round(total * 100) / 100;
    });

    // 从行程同步预算（按行程统计）
    const syncFromItineraries = async () => {
      try {
        console.log('开始同步行程预算...');
        const itineraries = await apiClient.get('/api/itineraries');
        console.log('获取到的行程数据:', itineraries);
        let syncedCount = 0;
        let deletedCount = 0;
        let updatedCount = 0;

        // 从现有预算的 id 中提取行程ID（格式为 itinerary_${itin.id}）
        const extractItineraryId = (budgetId) => {
          if (budgetId && budgetId.startsWith('itinerary_')) {
            return budgetId.replace('itinerary_', '');
          }
          return null;
        };

        const existingItineraryIds = new Set(
          budgets.value
            .filter(b => b.category === 'itinerary')
            .map(b => extractItineraryId(b.id))
            .filter(id => id !== null)
        );
        console.log('现有行程预算ID:', existingItineraryIds);

        // 构建新的行程预算项
        const newBudgetItems = [];

        itineraries.forEach(itin => {
          if (itin.pois && itin.pois.length > 0) {
            // 计算该行程的总预算（景点预算 + 交通预算）
            let itineraryTotalBudget = 0;

            // 计算景点预算
            itin.pois.forEach(poi => {
              if (poi.budget && poi.budget > 0) {
                console.log(`景点 ${poi.poi?.name} 预算: ${poi.budget}`);
                itineraryTotalBudget += poi.budget;
              }
            });

            // 计算交通预算 - 适配后端数据结构
            itin.pois.forEach((poi, index) => {
              // 检查直接在poi对象上的交通字段
              if (poi.transport_budget && poi.transport_budget > 0) {
                console.log(`POI ${poi.poi?.name} 交通预算: ${poi.transport_budget}`);
                itineraryTotalBudget += poi.transport_budget;
              }
              // 也检查嵌套的transport对象（为了兼容性）
              else if (poi.transport && poi.transport.budget && poi.transport.budget > 0) {
                console.log(`POI ${poi.poi?.name} 嵌套交通预算: ${poi.transport.budget}`);
                itineraryTotalBudget += poi.transport.budget;
              }
            });

            // 如果总预算大于0，则添加到行程预算中
            if (itineraryTotalBudget > 0) {
              const budgetItem = {
                id: `itinerary_${itin.id}`,
                name: itin.name || `行程-${itin.id}`,
                description: itin.description || `日期: ${itin.date || '未设置'}`,
                amount: itineraryTotalBudget,
                actualAmount: 0,
                category: 'itinerary',
                sourceType: 'itinerary',
                sourceId: itin.id,
                createdAt: new Date().toISOString()
              };
              console.log('创建行程预算项:', budgetItem);
              newBudgetItems.push(budgetItem);
              syncedCount++;
            } else {
              console.log(`行程 ${itin.name} 总预算为0，不添加`);
            }
          }
        });

        // 获取新行程的ID集合
        const newItineraryIds = new Set(newBudgetItems.map(b => b.sourceId));

        // 找出需要删除的行程（已删除的行程）
        const idsToDelete = [...existingItineraryIds].filter(id => !newItineraryIds.has(id));
        console.log('需要删除的行程预算:', idsToDelete);

        // 删除已删除行程对应的预算项
        for (const itineraryId of idsToDelete) {
          const budgetToDelete = budgets.value.find(b =>
            b.category === 'itinerary' &&
            extractItineraryId(b.id) === itineraryId
          );
          if (budgetToDelete) {
            try {
              await budgetService.delete(budgetToDelete.id);
              budgets.value = budgets.value.filter(b => b.id !== budgetToDelete.id);
              deletedCount++;
              console.log('删除行程预算:', budgetToDelete.name);
            } catch (err) {
              console.error('删除行程预算失败:', budgetToDelete.id, err);
            }
          }
        }

        // 保存或更新新的行程预算
        for (const budgetItem of newBudgetItems) {
          const existingBudget = budgets.value.find(b =>
            b.category === 'itinerary' &&
            extractItineraryId(b.id) === budgetItem.sourceId
          );

          if (existingBudget) {
            // 更新现有预算（只有当金额变化时）
            if (existingBudget.amount !== budgetItem.amount) {
              try {
                await budgetService.update(existingBudget.id, budgetItem);
                Object.assign(existingBudget, budgetItem);
                updatedCount++;
                console.log('更新行程预算:', existingBudget.name);
              } catch (err) {
                console.error('更新行程预算失败:', existingBudget.id, err);
              }
            } else {
              console.log('行程预算未变化，跳过:', existingBudget.name);
            }
          } else {
            // 创建新预算
            try {
              const created = await budgetService.create(budgetItem);
              budgetItem.id = created.id;
              budgets.value.push(budgetItem);
              console.log('创建行程预算:', budgetItem.name);
            } catch (err) {
              console.error('创建行程预算失败:', budgetItem, err);
            }
          }
        }

        // 显示结果通知
        if (syncedCount > 0 || deletedCount > 0) {
          let message = `同步完成：新增 ${syncedCount - updatedCount} 个，更新 ${updatedCount} 个，删除 ${deletedCount} 个`;
          if (deletedCount > 0 && syncedCount === 0) {
            message = `已删除 ${deletedCount} 个行程预算`;
          } else if (syncedCount > 0 && deletedCount === 0 && updatedCount === 0) {
            message = `成功同步了 ${syncedCount} 个行程预算`;
          } else if (updatedCount > 0 && syncedCount - updatedCount === 0) {
            message = `已更新 ${updatedCount} 个行程预算`;
          }
          window.notificationService?.showSuccess(message);
        } else {
          window.notificationService?.showInfo('没有需要同步的行程预算');
        }

        // 重新加载预算确保数据一致
        await loadBudgets();

      } catch (error) {
        console.error('同步失败:', error);
        window.notificationService?.showError(`同步失败: ${error.message}`);
      }
    };

    // 添加交通预算
    const addTransportBudget = () => {
      editingBudget.value = {
        name: '',
        description: '',
        amount: 0,
        category: 'transport'
      };
      showEditModal.value = true;
    };

    // 添加住宿预算
    const addAccommodationBudget = () => {
      editingBudget.value = {
        name: '',
        description: '',
        amount: 0,
        category: 'accommodation'
      };
      showEditModal.value = true;
    };

    // 添加自定义预算
    const addCustomBudget = () => {
      editingBudget.value = {
        name: '',
        description: '',
        amount: 0,
        category: 'custom'
      };
      showEditModal.value = true;
    };

    // 编辑预算
    const editBudget = (budget) => {
      editingBudget.value = { ...budget };
      showEditModal.value = true;
    };

    // 保存预算
    const saveBudget = async () => {
      if (!editingBudget.value) return;

      try {
        // 确保金额是数字类型
        editingBudget.value.amount = parseFloat(editingBudget.value.amount) || 0;
        
        if (editingBudget.value.id) {
          await budgetService.update(editingBudget.value.id, editingBudget.value);
        } else {
          await budgetService.create(editingBudget.value);
        }
        
        await loadBudgets();
        closeEditModal();
        window.notificationService?.showSuccess('预算保存成功');
      } catch (error) {
        console.error('保存预算失败:', error);
        window.notificationService?.showError(`保存预算失败: ${error.message}`);
      }
    };

    // 删除预算
    const deleteBudget = async (id) => {
      if (!confirm('确定要删除这个预算项吗？')) return;
      
      try {
        await budgetService.delete(id);
        await loadBudgets();
        window.notificationService?.showSuccess('预算删除成功');
      } catch (error) {
        console.error('删除预算失败:', error);
        window.notificationService?.showError(`删除预算失败: ${error.message}`);
      }
    };

    // 关闭编辑模态框
    const closeEditModal = () => {
      showEditModal.value = false;
      editingBudget.value = null;
    };

    // 加载预算数据
    const loadBudgets = async () => {
      try {
        console.log('开始加载预算数据...');
        const data = await budgetService.getAll();
        console.log('获取到的预算数据:', data);
        budgets.value = Array.isArray(data) ? data : [];
        console.log('处理后的预算列表:', budgets.value);
      } catch (error) {
        console.error('加载预算失败:', error);
        window.notificationService?.showError(`加载预算失败: ${error.message}`);
        budgets.value = []; // 确保即使出错也设置为空数组
      }
    };

    // 初始化图表
    const initCharts = () => {
      nextTick(() => {
        if (pieChartRef.value) {
          const ctx = pieChartRef.value.getContext('2d');
          if (pieChart) {
            pieChart.destroy();
          }
          
          const categoryNames = ['行程', '交通', '住宿', '其他'];
          const categoryTotals = [
            itineraryTotal.value,
            transportTotal.value,
            accommodationTotal.value,
            customTotal.value
          ];
          
          // 过滤掉为0的类别
          const filteredLabels = categoryNames.filter((_, index) => categoryTotals[index] > 0);
          const filteredData = categoryTotals.filter(total => total > 0);
          
          if (filteredData.length > 0) {
            pieChart = new Chart(ctx, {
              type: 'pie',
              data: {
                labels: filteredLabels,
                datasets: [{
                  data: filteredData,
                  backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0'
                  ]
                }]
              },
              options: {
                responsive: true,
                plugins: {
                  legend: {
                    position: 'bottom'
                  }
                }
              }
            });
          }
        }

        if (barChartRef.value) {
          const ctx = barChartRef.value.getContext('2d');
          if (barChart) {
            barChart.destroy();
          }

          barChart = new Chart(ctx, {
            type: 'bar',
            data: {
              labels: ['行程', '交通', '住宿', '其他'],
              datasets: [
                {
                  label: '预算',
                  data: [
                    itineraryTotal.value,
                    transportTotal.value,
                    accommodationTotal.value,
                    customTotal.value
                  ],
                  backgroundColor: [
                    'rgba(102, 126, 234, 0.8)',
                    'rgba(118, 75, 162, 0.8)',
                    'rgba(255, 193, 7, 0.8)',
                    'rgba(75, 192, 192, 0.8)'
                  ],
                  borderColor: [
                    'rgba(102, 126, 234, 1)',
                    'rgba(118, 75, 162, 1)',
                    'rgba(255, 193, 7, 1)',
                    'rgba(75, 192, 192, 1)'
                  ],
                  borderWidth: 1
                },
                {
                  label: '实际',
                  data: [
                    itineraryActualTotal.value,
                    transportActualTotal.value,
                    accommodationActualTotal.value,
                    customActualTotal.value
                  ],
                  backgroundColor: [
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(255, 159, 64, 0.8)',
                    'rgba(153, 102, 255, 0.8)'
                  ],
                  borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(153, 102, 255, 1)'
                  ],
                  borderWidth: 1
                }
              ]
            },
            options: {
              responsive: true,
              scales: {
                y: {
                  beginAtZero: true
                }
              },
              plugins: {
                legend: {
                  position: 'bottom'
                }
              }
            }
          });
        }
      });
    };

    // 监听预算数据变化，重新绘制图表
    watch([itineraryTotal, transportTotal, accommodationTotal, customTotal,
           itineraryActualTotal, transportActualTotal, accommodationActualTotal, customActualTotal], () => {
      initCharts();
    });

    // 组件挂载时加载数据
    onMounted(async () => {
      console.log('预算页面挂载，开始加载数据...');
      await loadBudgets();
      await syncFromItineraries();
      initCharts();
      console.log('预算数据加载完成');
    });

    // 导出预算清单
    const exportBudget = () => {
      if (budgets.value.length === 0) {
        window.notificationService?.showError('没有可导出的预算数据');
        return;
      }

      // 生成HTML内容
      const htmlContent = generateBudgetHTML();

      // 创建Blob和下载链接
      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `旅游预算清单-${new Date().toISOString().split('T')[0]}.html`;
      a.click();
      URL.revokeObjectURL(url);

      window.notificationService?.showSuccess('预算清单导出成功！');
    };

    // 生成预算清单的HTML内容
    const generateBudgetHTML = () => {
      const categoryNames = {
        'itinerary': '行程预算',
        'transport': '交通预算',
        'accommodation': '住宿预算',
        'custom': '其他预算'
      };

      const categoryIcons = {
        'itinerary': '🗺️',
        'transport': '🚗',
        'accommodation': '🏨',
        'custom': '📦'
      };

      // 按类别分组预算项
      const budgetGroups = {};
      budgets.value.forEach(budget => {
        const category = budget.category || 'custom';
        if (!budgetGroups[category]) {
          budgetGroups[category] = [];
        }
        budgetGroups[category].push(budget);
      });

      let budgetSectionsHTML = '';

      // 为每个类别生成HTML
      ['itinerary', 'transport', 'accommodation', 'custom'].forEach(category => {
        const items = budgetGroups[category] || [];
        if (items.length === 0) return;

        const categoryTotal = items.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
        const categoryActualTotal = items.reduce((sum, item) => sum + (parseFloat(item.actualAmount) || 0), 0);

        budgetSectionsHTML += `
          <div class="budget-section">
            <div class="section-header">
              <span class="section-icon">${categoryIcons[category]}</span>
              <h3>${categoryNames[category]}</h3>
            </div>

            <div class="budget-items">
        `;

        items.forEach(item => {
          const isOverBudget = (parseFloat(item.actualAmount) || 0) > (parseFloat(item.amount) || 0);
          budgetSectionsHTML += `
            <div class="budget-item">
              <div class="item-name">
                <h4>${item.name || '未命名项目'}</h4>
                ${item.description ? `<p class="item-description">${item.description}</p>` : ''}
              </div>
              <div class="item-amounts ${isOverBudget ? 'over-budget' : ''}">
                <span class="budget-amount">预算: ¥${(parseFloat(item.amount) || 0).toLocaleString()}</span>
                <span class="actual-amount">实际: ¥${(parseFloat(item.actualAmount) || 0).toLocaleString()}</span>
                ${isOverBudget ? `<span class="over-amount">超支: ¥${((parseFloat(item.actualAmount) || 0) - (parseFloat(item.amount) || 0)).toLocaleString()}</span>` :
                  `<span class="saved-amount">节省: ¥${((parseFloat(item.amount) || 0) - (parseFloat(item.actualAmount) || 0)).toLocaleString()}</span>`}
              </div>
            </div>
          `;
        });

        budgetSectionsHTML += `
            </div>
            <div class="section-total">
              <span class="total-label">小计:</span>
              <span class="total-amount">预算 ¥${categoryTotal.toLocaleString()} / 实际 ¥${categoryActualTotal.toLocaleString()}</span>
            </div>
          </div>
        `;
      });

      return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>旅游预算清单</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      background: #f5f5f5;
      padding: 20px;
    }

    .container {
      max-width: 900px;
      margin: 0 auto;
      background: white;
      padding: 40px;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }

    .header {
      text-align: center;
      border-bottom: 3px solid #667eea;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }

    .header h1 {
      color: #667eea;
      font-size: 2.5em;
      margin-bottom: 10px;
    }

    .header p {
      color: #666;
      font-size: 1.1em;
    }

    .summary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 25px;
      border-radius: 8px;
      margin-bottom: 30px;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
    }

    .summary-card {
      text-align: center;
      padding: 15px;
      background: rgba(255,255,255,0.15);
      border-radius: 8px;
    }

    .summary-card .label {
      font-size: 0.9em;
      opacity: 0.9;
      margin-bottom: 8px;
    }

    .summary-card .value {
      font-size: 2em;
      font-weight: bold;
    }

    .summary-card.budget-total .value {
      color: #fff;
    }

    .summary-card.actual-total .value {
      color: #ffeb3b;
    }

    .summary-card.diff .value.positive {
      color: #a5d6a7;
    }

    .summary-card.diff .value.negative {
      color: #ef9a9a;
    }

    .budget-section {
      margin-bottom: 30px;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      overflow: hidden;
    }

    .section-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 15px 20px;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .section-icon {
      font-size: 1.5em;
    }

    .section-header h3 {
      font-size: 1.3em;
    }

    .budget-items {
      padding: 20px;
    }

    .budget-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px;
      margin-bottom: 15px;
      background: #f8f9fa;
      border-radius: 6px;
      border-left: 3px solid #667eea;
    }

    .budget-item:last-child {
      margin-bottom: 0;
    }

    .budget-item.over-budget {
      border-left-color: #f44336;
      background: #ffebee;
    }

    .item-name {
      flex: 1;
    }

    .item-name h4 {
      color: #333;
      font-size: 1.1em;
      margin-bottom: 5px;
    }

    .item-description {
      color: #666;
      font-size: 0.9em;
    }

    .item-amounts {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 5px;
      min-width: 200px;
    }

    .budget-amount {
      color: #4CAF50;
      font-weight: 600;
    }

    .actual-amount {
      color: #2196F3;
      font-weight: 600;
    }

    .over-amount {
      color: #f44336;
      font-weight: 700;
      font-size: 0.95em;
    }

    .saved-amount {
      color: #4CAF50;
      font-weight: 600;
      font-size: 0.95em;
    }

    .section-total {
      background: #f5f5f5;
      padding: 15px 20px;
      text-align: right;
      border-top: 2px solid #e0e0e0;
      font-weight: 600;
    }

    .total-label {
      color: #666;
      margin-right: 10px;
    }

    .total-amount {
      color: #333;
      font-size: 1.1em;
    }

    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px solid #e0e0e0;
      text-align: center;
      color: #666;
      font-size: 0.9em;
    }

    @media print {
      body {
        background: white;
        padding: 0;
      }

      .container {
        box-shadow: none;
        padding: 20px;
      }

      .budget-section {
        page-break-inside: avoid;
      }
    }

    @media (max-width: 600px) {
      .container {
        padding: 20px;
      }

      .header h1 {
        font-size: 1.8em;
      }

      .summary {
        grid-template-columns: 1fr;
      }

      .budget-item {
        flex-direction: column;
        align-items: flex-start;
      }

      .item-amounts {
        align-items: flex-start;
        margin-top: 10px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>💰 旅游预算清单</h1>
      <p>生成时间: ${new Date().toLocaleString('zh-CN')}</p>
    </div>

    <div class="summary">
      <div class="summary-card budget-total">
        <div class="label">总预算</div>
        <div class="value">¥${totalBudget.value.toLocaleString()}</div>
      </div>
      <div class="summary-card actual-total">
        <div class="label">实际消费</div>
        <div class="value">¥${totalActualBudget.value.toLocaleString()}</div>
      </div>
      <div class="summary-card diff">
        <div class="label">差额</div>
        <div class="value ${totalBudget.value >= totalActualBudget.value ? 'positive' : 'negative'}">
          ${totalBudget.value >= totalActualBudget.value ?
            '节省 ¥' + (totalBudget.value - totalActualBudget.value).toLocaleString() :
            '超支 ¥' + (totalActualBudget.value - totalBudget.value).toLocaleString()}
        </div>
      </div>
    </div>

    ${budgetSectionsHTML}

    <div class="footer">
      <p>由 TripMaster 旅行规划助手生成</p>
    </div>
  </div>
</body>
</html>`;
    };

    return {
      budgets,
      showEditModal,
      editingBudget,
      pieChartRef,
      barChartRef,
      itineraryBudgets,
      transportBudgets,
      accommodationBudgets,
      customBudgets,
      itineraryTotal,
      transportTotal,
      accommodationTotal,
      customTotal,
      totalBudget,
      itineraryActualTotal,
      transportActualTotal,
      accommodationActualTotal,
      customActualTotal,
      totalActualBudget,
      syncFromItineraries,
      addTransportBudget,
      addAccommodationBudget,
      addCustomBudget,
      editBudget,
      saveBudget,
      deleteBudget,
      closeEditModal,
      loadBudgets,
      initCharts,
      exportBudget
    };
  }
};
</script>

<style scoped>
.budget-container {
  padding: 1rem;
  max-width: 1400px;
  margin: 0 auto;
  height: calc(100vh - 120px);
}

.page-title {
  color: #333;
  margin-bottom: 2rem;
  text-align: center;
  font-size: 2rem;
}

.budget-content {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 2rem;
  height: calc(100vh - 150px);
}

.budget-categories {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  overflow-y: auto;
  padding-right: 0.5rem;
}

.budget-categories::-webkit-scrollbar {
  width: 6px;
}

.budget-categories::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.budget-categories::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.budget-categories::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.budget-sidebar {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  height: 100%;
}

/* 总预算卡片样式 */
.total-budget-card {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.budget-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1.5rem;
  border-radius: 15px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}

.budget-card h2 {
  font-size: 1.3rem;
  margin-bottom: 0.75rem;
}

.amount {
  font-size: 2rem;
  font-weight: 700;
}

.amount.over-budget {
  color: #dc3545;
}

/* 实际消费卡片样式 */
.actual-budget-card {
  background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
  color: white;
  padding: 1.5rem;
  border-radius: 15px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  transition: background 0.3s;
}

.actual-budget-card.over-budget {
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
}

.actual-budget-card h2 {
  font-size: 1.3rem;
  margin-bottom: 0.75rem;
}

.budget-diff {
  margin-top: 0.5rem;
  font-size: 1rem;
  font-weight: 500;
}

.budget-diff .saved {
  color: #e8f5e8;
}

.budget-diff .over {
  color: #ffe0e0;
}

.budget-charts {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  overflow-y: auto;
  padding-right: 0.5rem;
}

.budget-charts::-webkit-scrollbar {
  width: 6px;
}

.budget-charts::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.budget-charts::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.budget-charts::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.chart-section {
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  flex-shrink: 0;
}

.chart-section h2 {
  color: #333;
  margin-bottom: 1.5rem;
  text-align: center;
  font-size: 1.25rem;
}

.chart-canvas {
  width: 100%;
  height: 250px;
  background: #f8f9fa;
  border-radius: 10px;
  display: block;
}

.budget-categories {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.category-section {
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f0f0f0;
}

.section-header h2 {
  color: #333;
  font-size: 1.5rem;
}

.header-actions {
  display: flex;
  gap: 0.5rem;
}

.budget-items {
  margin-bottom: 1rem;
}

.budget-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid #eee;
  border-radius: 10px;
  margin-bottom: 0.5rem;
  transition: all 0.3s;
}

.budget-item:hover {
  background-color: #f8f9fa;
  transform: translateX(5px);
}

.item-info {
  flex: 1;
}

.item-info h3 {
  color: #333;
  margin-bottom: 0.25rem;
}

.item-info p {
  color: #666;
  font-size: 0.9rem;
}

/* 预算项金额显示 */
.item-amounts {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 150px;
}

.amount-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1rem;
}

.amount-row.budget {
  color: #4CAF50;
}

.amount-row.actual {
  color: #2196f3;
}

.amount-row.actual .amount-value.over-budget {
  color: #dc3545;
  font-weight: 700;
}

.amount-label {
  font-size: 0.9rem;
  color: #666;
  margin-right: 0.5rem;
}

.amount-value {
  font-weight: 600;
}

/* 类别总计显示 */
.category-totals {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  border-top: 2px solid #f0f0f0;
  font-size: 1.1rem;
}

.total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.total-row.budget {
  color: #4CAF50;
}

.total-row.actual {
  color: #2196f3;
}

.total-row.actual.over-budget {
  color: #dc3545;
  font-weight: 700;
}

.item-actions {
  display: flex;
  gap: 0.5rem;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn:hover {
  transform: translateY(-2px);
}

.btn-icon {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  border: none;
  background: #f5f5f5;
  cursor: pointer;
  font-size: 1.1rem;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-icon:hover {
  transform: scale(1.1);
}

.btn-icon.edit:hover {
  background: #ffc107;
  color: #333;
}

.btn-icon.delete:hover {
  background: #dc3545;
  color: white;
}

.category-total {
  font-weight: 700;
  color: #333;
  text-align: right;
  padding: 1rem;
  border-top: 2px solid #f0f0f0;
  font-size: 1.1rem;
}

.budget-charts {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.chart-section {
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.chart-section h2 {
  color: #333;
  margin-bottom: 1.5rem;
  text-align: center;
}

.chart-canvas {
  width: 100%;
  height: 300px;
  background: #f8f9fa;
  border-radius: 10px;
  display: block;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 15px;
  padding: 2rem;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-content h2 {
  color: #333;
  margin-bottom: 1.5rem;
  text-align: center;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 500;
}

.form-input,
.form-textarea,
.form-select {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e1e1e1;
  border-radius: 8px;
  font-family: inherit;
  transition: border-color 0.3s;
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
  outline: none;
  border-color: #667eea;
}

.form-textarea {
  min-height: 100px;
  resize: vertical;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
}

@media (max-width: 1200px) {
  .budget-content {
    grid-template-columns: 1fr;
    height: auto;
  }
  
  .budget-sidebar {
    order: -1;
    height: auto;
  }
  
  .budget-charts {
    overflow-y: visible;
  }
}
</style>