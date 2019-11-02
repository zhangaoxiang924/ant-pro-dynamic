// 所有 router 配置
export default [
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './user/login',
      },
    ],
  },
  {
    path: '/',
    component: '../layouts/SecurityLayout',
    routes: [
      {
        path: '/',
        component: '../layouts/BasicLayout',
        authority: ['admin', 'user'],
        routes: [
          {
            path: '/',
            redirect: '/welcome',
          },
          {
            path: '/welcome',
            name: 'welcome',
            icon: 'smile',
            component: './Welcome',
          },
          {
            name: 'account',
            icon: 'smile',
            path: '/accountcenter',
            component: './AccountCenter',
          },
          {
            path: '/form',
            icon: 'form',
            name: 'form',
            Routes: ['src/pages/Authorized'],
            authority: ['admin'],
            routes: [
              {
                name: 'basic-form',
                icon: 'smile',
                authority: ['admin'],
                Routes: ['src/pages/Authorized'],
                path: '/form/basic-form',
                component: './Form/BasicForm',
              },
              {
                name: 'advanced-form',
                icon: 'smile',
                path: '/form/advanced-form',
                component: './Form/AdvancedForm',
              },
            ],
          },
          {
            component: './404',
          },
        ],
      },
      {
        component: './404',
      },
    ],
  },
  {
    component: './404',
  },
];
