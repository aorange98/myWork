<template>  
  <router-view />
</template>



<script>
/**
 * 新闻的API接口
 *  https://blog.csdn.net/xm1037782843/article/details/103388228
 *  https://blog.csdn.net/QAIN_/article/details/115909775
 * 
 * 做搜索列表的接口
 *  搜索时的接口：https://www.toutiao.com/2/article/search_sug/?keyword=
 *  点击后详情的接口：https://so.toutiao.com/search?dvpf=pc&source=sug&keyword=
 *  
 */
import { useStore } from "vuex"
import { verifyToken } from '@/api/modules/homeApi'
import { getCurrentInstance } from 'vue'
export default {
  name: "App",
  components: {

  },
  setup(){
    const internalInstance = getCurrentInstance()
    const {$message} = internalInstance.appContext.config.globalProperties
    const store = useStore()

    // verifyToken().then(res=>{
    //   // console.log(res)
    //   // 无论是否token过期和不过期都刷新登录状态
    //   store.commit('updateLoginStatus',res.status)
      
    //   if(res.code==1){    //token过期
    //     if(localStorage.getItem('userInfo')!==null || localStorage.getItem('token')!==null){  // 本地中userinfo和token至少有一个
    //       $message({
    //         type:"error",
    //         message: res.msg,
    //       })

    //       // 重新设置一下登录信息
    //       store.commit('updateUserInfo',{})

    //       // 然后把本地的给干掉
    //       localStorage.removeItem('userInfo')
    //       localStorage.removeItem('token')
          

    //     }else{    // 本地中userinfo和token都没有
    //       // console.log('*******************新用户')
    //     }
    //   }else{    // token有效
    //     store.commit('updateUserInfo',{emailNumber:res.data.emailNumber})  // 重新设置一下登录信息 传对象 
    //   }
    // }).catch(err=>{
    //   console.log(err)
    // })
  },
};
</script>

<style lang="less">
  @import "assets/css/reset.css";


</style>
