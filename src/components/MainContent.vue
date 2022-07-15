<template>
	<div class="MainContent">
    <div class="main-left">  
      <el-tabs v-model="params.typeId" @tab-click="handleClick">
        <el-tab-pane v-for="(item,index) in tabList" :key="index" :name="item.typeId" :label="item.typeName">
          <!-- 里面的内容 -->
          <NewList v-for="(item,index) in newsListData" :key="index" :item="item" @click="handleClickItem(item)"></NewList>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="main-right">
      <el-card class="box-card" header="每日搞笑段子">
        <div v-for="(item,index) in jokesList" :key="index" class="item">{{item.content}}</div>
      </el-card>
    </div>
  </div>
</template>

<script>
import {
	computed,
	nextTick,
	onMounted,
	reactive,
	ref,
	toRef,
	toRefs,
	watch,
	watchEffect,
	getCurrentInstance,
  onUpdated,
  onActivated,
} from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getTabbarList,getNewsList,getJokesList } from '@/api/modules/homeApi'
import NewList from './NewList.vue'

export default {
	name: 'MainContent',
	components: {
    NewList
},
	setup() {
    /**
     * 踩雷： 如果你使用了 async setup()，那么在如果想要使用 onMounted 生命周期的话，需要确保在第一个 await 语句之前注册 生命周期钩子
     */
    onMounted (()=>{
      console.log('onMounted')
      window.onscroll = function(){
        //变量scrollTop是滚动条滚动时，距离顶部的距离
        var scrollTop = document.documentElement.scrollTop||document.body.scrollTop;
        //变量windowHeight是可视区的高度
        var windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
        //变量scrollHeight是滚动条的总高度
        var scrollHeight = document.documentElement.scrollHeight||document.body.scrollHeight;
        //滚动条到底部的条件
        if(Math.round(scrollTop+windowHeight) == scrollHeight){
          //到了这个就可以进行业务逻辑加载后台数据了
          data.isBottom = true;
          console.log("到了底部");
          console.log(100)
          if(data.notData == false){
            data.params.page = Number(data.params.page)+1
            console.log(data.params.page)
            clickTabAndInitGetNewsList()
          }
        }else{
          data.isBottom = false;
        } 
      }
    }) 



    const internalInstance = getCurrentInstance()

    const { ctx:_this } =internalInstance   // 实例化对象

    
    const {$loading} = internalInstance.appContext.config.globalProperties

    const route = useRoute()
    const router = useRouter()

    const data = reactive({
      typeId:"",
      tabList:[],
      newsListData:[],
      params:{    // 获取列表的参数
        typeId:"",
        page:1
      },
      isBottom:false,
      notData:false, //没有更多数据了
      jokesList:[]
    })


    // 初始化拉取tabbar数据
    const init = ()=>{
      initGetTabbarList()
      initGetJokesList()
      getNewsListFn()
    }
    init()

    
    



    // 初始化列表栏
    async function initGetTabbarList(){
      const result = await getTabbarList()
      // console.log(result.data)
      // 这些都是没数据的
      let arr = [509,510,519,520,523,524,525,526]
      let cc = result.data.data.filter(item=>{
        return arr.includes(item.typeId) !== true
      })
      data.tabList = cc
      data.params.typeId = cc[0].typeId

      // 如果url中没有typeid那么就要加载
      if(!route.query.typeId){
        console.log('url中没有typeID')
        clickTabAndInitGetNewsList()
        // 设置typeID为初始化的id
        data.params.typeId = cc[0].typeId
      }else{
        // 如果是有typeId的,那么就设置为传过来的id
        data.params.typeId = +route.query.typeId
      }
      
    }


    // 初始化获取玩笑
    async function initGetJokesList(){
      try {
        const result = await getJokesList({page:1})
        if(result.data.code==1){
          data.jokesList = result.data.data.list
        }
      } catch (error) {
        console.log(error)
      }
    }

    
    // 点击切换
    const handleClick = (tab,event) => {
      console.log(tab.props.name)
      data.newsListData = []
      data.params.page=1
      clickTabAndInitGetNewsList()
    }


    // 主要用于从详情页进来的使用的获取数据
    async function getNewsListFn(){
      // 如果有传递这个id的才执行
      if(route.query.typeId){
        // 跳转回来之后重新给typeid选中
        data.params.typeId = Number(route.query.typeId)
        let loading = $loading({
          text:"加载中",
          background:"rgb(0,0,0,0.1)"
        })

        try{
          console.log('路由信息',route.query)
          const result = await getNewsList(data.params)
          if(result.data.code == 1){
            data.newsListData.push(...result.data.data)
            console.log(data.newsListData)
          }else{
            data.notData = true
          }
          loading.close()
        }catch(err){
          console.log(err)
        }
      }
    }


    // 点击tab切换数据的 初始化的时候也使用 根据typeId拉取对应的数据列表 
    async function clickTabAndInitGetNewsList(){
      let loading = $loading({
        text:"加载中",
        background:"rgb(0,0,0,0.1)"
      })
      try{
        console.log(data.params)
        const result = await getNewsList(data.params)
        if(result.data.code == 1){
          console.log('请求的数据------------>',result.data.data)

          console.log('data数组里面的---',data.newsListData)

          data.newsListData.push(...result.data.data)

          console.log('最后的----',data.newsListData)
        }else{
          data.notData = true
        }
        loading.close()
      }catch(err){
        console.log(err)
      }
    }



    // 点击列表中的每一项跳转
    const handleClickItem = (item)=>{
      console.log(item)
      router.push({
        name:'detail',
        query:{
          newsId:item.newsId
        }
      })
    }





    return {
      ...toRefs(data),
      handleClick,
      handleClickItem,
      router,
      route
    }

  },
}
</script>

<style scoped lang="less">
.MainContent {
	width: 1100px;
	margin: 0 auto;
	// height: 600px;
  padding-bottom:100px ;
	position: relative;
	overflow: hidden;
	display: flex;
	justify-content: space-between;
	// border: 1px solid #000;
	.main-left {
		width: 700px;
    // border: 1px solid red;
	}
	.main-right {
		width: 350px;
		// border: 1px solid #79bbff7a;
    font-size: 15px;

    :deep(.el-card__header){
      font-weight: 800!important;
      color:#409eff;
    }
	}
}


.infinite-list {
  height: 800px;
}

.item {
  padding: 20px 0;
  color: #2a2a2a;
  line-height: 28px;
}

.item:first-child{
  padding-top:0
}


</style>
