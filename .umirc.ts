import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  // antd: {
  //   dark: true, // 开启暗色主题
  //   compact: true, // 开启紧凑主题
  // },
    title: 'hi-umi你好',
  layout: {
    name: '你好!虚拟dom',
  },
  theme: {
    '@primary-color': '#1DA57A',
  },
  routes: [
    { path: '/',name:'首页',   icon: 'smile', component: '@/pages/index' },
  ],
});
