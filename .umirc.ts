import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: 'YouBet',
  },
  routes: [
    {
      path: '/',
      redirect: '/goals',
    },
    {
      name: '目标列表',
      path: '/goals',
      component: './Goal',
    },
    {
      name: '事件列表',
      path: '/events',
      component: './Event',
    },
  ],
  npmClient: 'pnpm',
});
