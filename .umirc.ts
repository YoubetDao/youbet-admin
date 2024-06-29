import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: '@umijs/max',
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
  ],
  npmClient: 'pnpm',
});
