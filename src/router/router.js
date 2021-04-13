const routes = [
  {
    path: '/',
    name: 'login',
    meta: {
      title: '登录'
    },
    component: () => import(/* webpackChunkName: "coursecer" */ '../views/login/login.vue')
  },
  {
    path: '/home',
    name: 'home',
    meta: {
      title: '首页'
    },
    component: () => import(/*webpackChunkName:'home'*/ '../views/Home.vue'),
    redirect: '/authentication',
    children: [
      {
        path: '/authentication',
        name: 'authentication',
        meta: {
          title: '课程管理'
        },
        component: () => import(/* webpackChunkName: "coursecer" */ '../views/authentication/authentication.vue')
      },
      {
        path: '/certification',
        name: 'certification',
        meta: {
          title: '认证管理'
        },
        component: () => import(/* webpackChunkName: "coursecer" */ '../views/authentication/certification.vue')
      }
    ]
  },
  {
    path: '/coursecer',
    name: 'coursecer',
    meta: {
      title: '课程认证'
    },
    component: () => import(/* webpackChunkName: "coursecer" */ '../views/coursecer/coursecer.vue')
  }
]
export default routes
