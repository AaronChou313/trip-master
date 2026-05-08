<template>
  <div class="memos-container">
    <!-- <div class="memos-header">
      <h2>备忘事项</h2>
    </div> -->

    <div class="memos-content">
      <!-- 左侧：备忘录列表 -->
      <div class="memos-list-section">
        <div class="section-header">
          <h3>备忘录列表</h3>
          <button @click="createNewMemo" class="btn btn-primary">新建备忘录</button>
        </div>
        
        <div class="memos-list">
          <div 
            v-for="memo in memos" 
            :key="memo.id"
            class="memo-item"
            :class="{ 'active': activeMemoId === memo.id }"
            @click="selectMemo(memo.id)"
          >
            <div class="memo-title">{{ memo.title }}</div>
            <div class="memo-preview">{{ getPreview(memo.content) }}</div>
            <div class="memo-meta">
              <span class="memo-date">{{ formatDate(memo.updatedAt || memo.createdAt) }}</span>
              <button @click.stop="deleteMemo(memo.id)" class="btn-icon delete-btn">🗑️</button>
            </div>
          </div>
          
          <div v-if="memos.length === 0" class="empty-state">
            <p>暂无备忘录</p>
            <p>点击"新建备忘录"开始记录</p>
          </div>
        </div>
      </div>

      <!-- 右侧：编辑器 -->
      <div class="memo-editor-section">
        <div v-if="activeMemo" class="memo-editor">
          <input 
            v-model="activeMemo.title" 
            @input="updateMemo"
            placeholder="请输入标题..."
            class="memo-title-input"
          />
          
          <div class="editor-header">
            <div class="editor-toolbar">
              <button @click="insertMarkdown('**粗体**')" class="btn-tool" title="粗体">B</button>
              <button @click="insertMarkdown('*斜体*')" class="btn-tool" title="斜体">I</button>
              <button @click="insertMarkdown('# 标题')" class="btn-tool" title="标题">#</button>
              <button @click="insertMarkdown('- 列表项')" class="btn-tool" title="列表">•</button>
              <button @click="insertMarkdown('[链接](url)')" class="btn-tool" title="链接">@</button>
              <button @click="insertMarkdown('`代码`')" class="btn-tool" title="代码">{} </button>
            </div>
            
            <div class="preview-toggle">
              <button 
                @click="showPreview = !showPreview" 
                :class="{ 'active': showPreview }"
                class="btn btn-secondary"
              >
                {{ showPreview ? '编辑' : '预览' }}
              </button>
            </div>
          </div>
          
          <!-- 编辑模式 -->
          <textarea 
            v-show="!showPreview"
            v-model="activeMemo.content" 
            @input="updateMemo"
            placeholder="在这里输入您的备忘内容，支持 Markdown 语法..."
            class="memo-content-textarea"
          ></textarea>
          
          <!-- 预览模式 - 使用GitHub样式 -->
          <div v-show="showPreview" class="markdown-preview markdown-body" v-html="renderedContent"></div>
        </div>
        
        <div v-else class="no-selection">
          <p>请选择一个备忘录进行编辑</p>
          <p>或点击左侧"新建备忘录"</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, nextTick } from 'vue';
import Notification from '../components/Notification.vue';
import memoService from '../services/memoService';

export default {
  name: 'MemosView',
  components: {
    Notification
  },
  setup() {
    const memos = ref([]);
    const activeMemoId = ref(null);
    const showPreview = ref(false);
    const isLoading = ref(false);

    // 计算属性
    const activeMemo = computed(() => {
      return memos.value.find(memo => memo.id === activeMemoId.value) || null;
    });

    const renderedContent = computed(() => {
      if (!activeMemo.value) return '';
      return renderMarkdown(activeMemo.value.content);
    });

    // 获取备忘录列表
    const loadMemos = async () => {
      try {
        isLoading.value = true;
        memos.value = await memoService.getAll();
      } catch (error) {
        console.error('Load memos error:', error);
        window.notificationService?.showError(`加载失败: ${error.message}`);
      } finally {
        isLoading.value = false;
        window.notificationService?.showSuccess(`成功加载${memos.value.length}条备忘录`);
      }
    };

    // 创建新备忘录
    const createNewMemo = async () => {
      try {
        const newMemo = {
          title: '新备忘录',
          content: ''
        };

        const createdMemo = await memoService.create(newMemo);
        memos.value.push(createdMemo);
        activeMemoId.value = createdMemo.id;
        window.notificationService?.showSuccess('备忘录创建成功');
      } catch (error) {
        console.error('Create memo error:', error);
        window.notificationService?.showError(`创建失败: ${error.message}`);
      }
    };

    // 选择备忘录
    const selectMemo = (id) => {
      activeMemoId.value = id;
      showPreview.value = false;
    };

    // 更新备忘录
    const updateMemo = async () => {
      if (!activeMemo.value) return;

      try {
        // 防抖处理
        clearTimeout(updateMemo.debounceTimer);
        updateMemo.debounceTimer = setTimeout(async () => {
          const memoToUpdate = {
            ...activeMemo.value
          };

          await memoService.update(activeMemo.value.id, memoToUpdate);
        }, 500);
      } catch (error) {
        console.error('Update memo error:', error);
        window.notificationService?.showError(`保存失败: ${error.message}`);
      }
    };

    // 删除备忘录
    const deleteMemo = async (id) => {
      if (!confirm('确定要删除这个备忘录吗？')) return;

      try {
        await memoService.delete(id);
        memos.value = memos.value.filter(memo => memo.id !== id);
        if (activeMemoId.value === id) {
          activeMemoId.value = memos.value.length > 0 ? memos.value[0].id : null;
        }
        window.notificationService?.showSuccess('备忘录删除成功');
      } catch (error) {
        console.error('Delete memo error:', error);
        window.notificationService?.showError(`删除失败: ${error.message}`);
      }
    };

    // 插入Markdown语法
    const insertMarkdown = (text) => {
      if (!activeMemo.value) return;
      
      const textarea = document.querySelector('.memo-content-textarea');
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const content = activeMemo.value.content;
      
      activeMemo.value.content = content.substring(0, start) + text + content.substring(end);
      
      nextTick(() => {
        textarea.focus();
        textarea.setSelectionRange(start + text.length, start + text.length);
        updateMemo();
      });
    };

    // 辅助函数
    const getPreview = (content) => {
      if (!content) return '无内容';
      return content.length > 50 ? content.substring(0, 50) + '...' : content;
    };

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('zh-CN', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    };

    // 简单的Markdown渲染函数
    const renderMarkdown = (markdown) => {
      if (!markdown) return '';
      
      return markdown
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`(.*?)`/g, '<code>$1</code>')
        .replace(/^# (.*$)/gm, '<h1>$1</h1>')
        .replace(/^## (.*$)/gm, '<h2>$1</h2>')
        .replace(/^### (.*$)/gm, '<h3>$1</h3>')
        .replace(/^- (.*$)/gm, '<li>$1</li>')
        .replace(/\n/g, '<br>');
    };

    // 生命周期
    onMounted(() => {
      loadMemos();
    });

    return {
      memos,
      activeMemoId,
      activeMemo,
      showPreview,
      isLoading,
      renderedContent,
      createNewMemo,
      selectMemo,
      updateMemo,
      deleteMemo,
      insertMarkdown,
      getPreview,
      formatDate
    };
  }
};
</script>

<style scoped>
@import 'github-markdown-css/github-markdown.css';

.memos-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem;
  height: calc(100vh - 120px);
}

.memos-header {
  text-align: center;
  margin-bottom: 30px;
}

.memos-header h2 {
  font-size: 2rem;
  color: #333;
  margin-bottom: 10px;
}

.memos-header p {
  color: #666;
  font-size: 1.1rem;
}

.memos-content {
  display: flex;
  gap: 20px;
  height: calc(100vh - 200px);
  overflow: hidden; /* 防止整个容器滚动 */
}

.memos-list-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  overflow: hidden; /* 防止整个区域滚动 */
}

.memo-editor-section {
  flex: 2;
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  overflow: hidden; /* 防止整个区域滚动 */
}

.section-header {
  padding: 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0; /* 防止头部被压缩 */
}

.section-header h3 {
  margin: 0;
  color: #333;
}

.memos-list {
  flex: 1;
  overflow-y: auto; /* 启用独立垂直滚动 */
  padding: 10px;
  height: 100%; /* 确保占满可用空间 */
}

.memo-item {
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 8px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.memo-item:hover {
  border-color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
}

.memo-item.active {
  border-color: #667eea;
  background-color: #f8f9ff;
}

.memo-title {
  font-weight: 600;
  color: #333;
  margin-bottom: 5px;
  font-size: 1.1rem;
}

.memo-preview {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 10px;
  line-height: 1.4;
}

.memo-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.memo-date {
  color: #999;
  font-size: 0.8rem;
}

.delete-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  padding: 5px;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.delete-btn:hover {
  background-color: #ffebee;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #999;
}

.empty-state p {
  margin: 10px 0;
}

.memo-editor {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: white;
  border-radius: 0 0 10px 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  overflow: hidden; /* 防止整个编辑器滚动 */
}

.memo-title-input {
  padding: 15px 20px;
  border: none;
  border-bottom: 1px solid #eee;
  font-size: 1.3rem;
  font-weight: 600;
  outline: none;
  background-color: white;
  flex-shrink: 0; /* 防止标题输入框被压缩 */
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  border-bottom: 1px solid #eee;
  background-color: #f8f9fa;
  flex-shrink: 0; /* 防止工具栏被压缩 */
}

.editor-toolbar {
  display: flex;
  gap: 8px;
}

.btn-tool {
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 6px 12px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.btn-tool:hover {
  background-color: #667eea;
  color: white;
  border-color: #667eea;
}

.memo-content-textarea {
  flex: 1;
  padding: 1rem 2rem;
  border: none;
  resize: none;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 1rem;
  line-height: 1.6;
  outline: none;
  background-color: white;
  overflow-y: auto; /* 启用编辑区域独立滚动 */
}

.markdown-preview {
  flex: 1;
  padding: 1rem 3rem !important;
  overflow-y: auto;
  background-color: white;
  border-left: none;
}

/* 覆盖github-markdown-css的一些样式以适配我们的设计 */
.markdown-body {
  background-color: transparent !important;
  padding: 0;
  min-height: 100%;
  /* 恢复正常的左对齐显示 */
  text-align: left;
  margin: 0;
  max-width: 100%;
}

.no-selection {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #999;
  text-align: center;
}

.no-selection p {
  margin: 10px 0;
}

/* 按钮样式 */
.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.btn-secondary {
  background: #f8f9fa;
  color: #333;
  border: 1px solid #ddd;
}

.btn-secondary:hover {
  background: #e9ecef;
}

.btn-secondary.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.btn-icon {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.btn-icon:hover {
  background-color: #f0f0f0;
}

/* 滚动条样式 */
.memos-list::-webkit-scrollbar,
.memo-content-textarea::-webkit-scrollbar,
.markdown-preview::-webkit-scrollbar {
  width: 6px;
}

.memos-list::-webkit-scrollbar-thumb,
.memo-content-textarea::-webkit-scrollbar-thumb,
.markdown-preview::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.memos-list::-webkit-scrollbar-thumb:hover,
.memo-content-textarea::-webkit-scrollbar-thumb:hover,
.markdown-preview::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
