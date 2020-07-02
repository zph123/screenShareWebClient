import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '../views/Index.vue'
import Home from '../views/Home.vue'
import CreateRoom from '../views/CreateRoom.vue'
import JoinRoom from '../views/JoinRoom.vue'
import Introduction from '../views/Introduction.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Index',
    component: Index,
    meta:{
      title: '首页'
    }
  },
  {
    path: '/listroom',
    name: 'Home',
    component: Home,
    meta:{
      title: '列表'
    }
  },
  {
    path: '/createroom',
    name: 'CreateRoom',
    component: CreateRoom,
    meta:{
      title: '创建影院'
    }
  },
  {
    path: '/joinroom',
    name: 'JoinRoom',
    component: JoinRoom,
    meta:{
      title: '加入影院'
    }
  },
  {
    path: '/introduction',
    name: 'Introduction',
    component: Introduction,
    meta:{
      title: '使用说明'
    }
  },
  
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
router.beforeEach((to, from, next) => {
    /* 路由发生变化修改页面title */
    if (to.meta.title) {
        document.title = to.meta.title;
    }
    next();
});

export default router
