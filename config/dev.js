export default {
  env: {
    NODE_ENV: '"development"',
  },
  defineConstants: {},
  mini: {},
  // h5 开发环境做下代理
  h5: {
    devServer: {
      proxy: [
        {
          context: ['/'], // 代理本地所有接口
          target: 'http://localhost:3000',
          changeOrigin: true,
        },
      ],
    },
  },
};
