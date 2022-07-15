import { createStore } from "vuex";

export default createStore({
  state: {
    // 存储用户信息到本地  为了展示而已 下次登录进入App.vue组件会验证token是否过期，如果过期了这个userInfo也会被清掉了
    userInfo: JSON.parse(localStorage.getItem('userInfo')) || {}, 
    isLogin:false   // isLogin不保存在本地   
  },
  getters: {

  },
  mutations: {
    updateUserInfo(state,payload){
      state.userInfo = payload
      localStorage.setItem('userInfo',JSON.stringify(state.userInfo))
    },
    updateLoginStatus(state,payload){
      state.isLogin = payload
    }
  },
  actions: {

  },
  modules: {

  },
});
