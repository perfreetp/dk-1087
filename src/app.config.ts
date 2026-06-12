export default defineAppConfig({
  pages: [
    'pages/home/index',
    'pages/topic/index',
    'pages/inspiration/index',
    'pages/schedule/index',
    'pages/evaluate/index',
    'pages/archive/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#ffffff',
    navigationBarTitleText: '播客选题助手',
    navigationBarTextStyle: 'black',
    backgroundColor: '#f8fafc'
  },
  tabBar: {
    color: '#94a3b8',
    selectedColor: '#6366f1',
    backgroundColor: '#ffffff',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/home/index',
        text: '首页'
      },
      {
        pagePath: 'pages/topic/index',
        text: '选题'
      },
      {
        pagePath: 'pages/inspiration/index',
        text: '灵感'
      },
      {
        pagePath: 'pages/schedule/index',
        text: '排期'
      },
      {
        pagePath: 'pages/evaluate/index',
        text: '评估'
      },
      {
        pagePath: 'pages/archive/index',
        text: '归档'
      }
    ]
  }
})