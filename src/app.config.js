// eslint-disable-next-line no-undef
export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/order/order',
    'pages/airportlist/index',
    'pages/login/login',
    'pages/calendar/index',
  ],
  // 分包  （不需要第一次就加载的跳转页面等等）
  subPackages: [
    {
      root: 'pages/flight',
      pages: ['list/list', 'detail/detail'],
    },
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'travel',
    navigationBarTextStyle: 'black',
  },
  tabBar: {
    color: '#7F8389',
    selectedColor: '#5495e6',
    borderStyle: 'black',
    list: [
      {
        text: '首页',
        pagePath: 'pages/index/index',
        iconPath: './assets/images/index-unselected.png',
        selectedIconPath: './assets/images/index-selected.png',
      },
      {
        text: '我的订单',
        pagePath: 'pages/order/order',
        iconPath: './assets/images/order-unselected.png',
        selectedIconPath: './assets/images/order-selected.png',
      },
    ],
  },
  // 定位权限
  permission: {
    'scope.userLocation': {
      desc: '为了更好的服务体验，我们希望获取你的位置',
    },
  },
  requiredPrivateInfos: ['getLocation', 'chooseLocation'],
});
