<template>
  <div class="env-test">
    <h2>环境变量测试</h2>
    <div class="env-info">
      <p><strong>import.meta.env.NODE_ENV:</strong> {{ env.NODE_ENV }}</p>
      <p><strong>import.meta.env.VITE_AMAP_KEY:</strong> {{ env.VITE_AMAP_KEY }}</p>
      <p><strong>所有环境变量:</strong></p>
      <ul>
        <li v-for="(value, key) in env" :key="key">
          {{ key }}: {{ value }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EnvTest',
  data() {
    return {
      env: import.meta.env
    }
  },
  mounted() {
    console.log('=== EnvTest 组件环境变量 ===');
    console.log('import.meta.env:', import.meta.env);
    console.log('VITE_AMAP_KEY:', import.meta.env.VITE_AMAP_KEY);
    console.log('========================');
  }
}
</script>

<style scoped>
.env-test {
  padding: 20px;
  background: #f5f5f5;
  border-radius: 8px;
  margin: 20px;
}

.env-info {
  background: white;
  padding: 15px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.env-info ul {
  max-height: 200px;
  overflow-y: auto;
  background: #f8f9fa;
  padding: 10px;
  border-radius: 4px;
}
</style>