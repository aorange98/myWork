import { createRouter, createWebHashHistory, createWebHistory } from "vue-router";
import store from '../store/index'
import { ElMessage } from 'element-plus'


const routes = [
  {
    path: '/',
    redirect: "/test",
  },
  {
    path: "/home",
    name: "home",
    meta:{
      name:"首页"
    },

    // 路由级代码拆分
    // 这会为此路由生成一个单独的块 (about.[hash].js)
    // 访问路由时延迟加载
    component:() =>import(/* webpackChunkName: "home" */ "../views/Home.vue"),
  },
  {
    path:"/detail",
    name: "detail",
    meta:{
      name:"详情页"
    },
    component:() =>import(/* webpackChunkName: "detail" */ "../views/Detail.vue"),
  },
  {
    path:"/myself",
    name: "myself",
    meta:{
      name:"我的"
    },
    component:() =>import(/* webpackChunkName: "mySelf" */ "../views/MySelf.vue"),
    // 守卫 只在进入路由时触发
    beforeEnter:(to,from,next)=>{  
      if(store.state.isLogin){
        next()
      }else{
        ElMessage({
          type:'warning',
          message:"请进行登录验证！"
        })
        next('/home')
      }
    }
  },
  {
    path:"/test",
    name: "test",
    meta:{
      name:"test"
    },
    component:() =>import(/* webpackChunkName: "detail" */ "../views/Test.vue"),
  },

  
];






const router = createRouter({
  history: createWebHistory('/'),
  // history:createWebHashHistory('/'),  // hash模式 
  routes,
});

export default router;


 