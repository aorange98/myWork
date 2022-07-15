<template>
	<div class="detail">
		<div class="nav">
			<div class="title" @click="router.replace({name:'home'})">橙哥资讯</div>
			<ul>
				<li
					v-for="(item, index) in tabList"
					:key="index"
					@click="handleClicktabItem(item)"
				>
					{{ item.typeName }}
				</li>
			</ul>
			<div class="right-wrap">
				{{ $store.state.userInfo.emailNumber }}
			</div>
		</div>

		<div class="main-content">
			<div class="main-left">

				<div class="article-content" v-if="Object.entries(newsDetail).length">
					<div class="title">{{newsDetail.title}}</div>
					<div class="source">{{newsDetail.source}} {{newsDetail.ptime}}</div>
					<img :src="newsDetail.cover" alt="" class="cover" v-if="newsDetail.cover">
					<img :src="a.imgSrc" v-for="a,b in newsDetail.images" :key="b" class="cover">
					<div class="content" v-html="newsDetail.content"></div>
				</div>

				<el-empty description="暂无数据" style="margin-top: 165px;" v-else/>

			</div>

			<div class="main-right">
				<div class="top-card">
					<el-card shadow="always"> 
						<el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
							size="large"
						/>
						<div class="top-card--source">{{newsDetail.source}}</div>
						<div class="comment">{{newsDetail.source}}官方账号</div>
					</el-card>
				</div>
				
				<el-card class="box-card" header="每日一句">
					<div v-for="(item,index) in dailyData" :key="index" class="item">{{item.content}}</div>
				</el-card>
			</div>
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
} from 'vue'
import { getNewsDetail,getDaily } from '@/api/modules/detailApi'
import { getTabbarList } from '@/api/modules/homeApi'
import { useRoute, useRouter } from 'vue-router'
import Header from '@/components/Header.vue'
export default {
	name: 'Detail',
	components: { Header },
	setup() {
		const internalInstance = getCurrentInstance()
		const { $loading, $store } =
			internalInstance.appContext.config.globalProperties

		const route = useRoute()
		const router = useRouter()

		const data = reactive({
			tabList: [],
			newsDetail: {},
			params: {
				typeId: 0,
			},
			dailyData:[]
		})

		const init = function () {
			initGetDetail()
			initGetTabbarList()
			intiGetDaily()
		}
		init()

		// 初始化列表栏
		async function initGetTabbarList() {
			const result = await getTabbarList()
			// 这些都是没数据的
			let arr = [509, 510, 519, 520, 523, 524, 525, 526]
			let cc = result.data.data.filter(item => {
				return arr.includes(item.typeId) !== true
			})
			data.tabList = cc
			data.params.typeId = cc[0].typeId
		}

		// 获取新闻详情
		async function initGetDetail() {
			try {
				const result = await getNewsDetail(route.query)
				console.log(result.data)
				if (result.data.code === 1) {
					data.newsDetail = result.data.data
				}
			} catch (err) {
				console.log(err)
			}
		}

		async function intiGetDaily(){
			try {
				const result = await getDaily({count:5})
				console.log(result.data)
				if (result.data.code === 1) {
					data.dailyData = result.data.data
				}
			} catch (err) {
				console.log(err)
			}
		}

		// 点击菜单
		const handleClicktabItem = item => {
			console.log(item)
			router.push({
				name: 'home',
				query: item,
			})
		}

		return {
			...toRefs(data),
			handleClicktabItem,
			router,
			route,
		}
	},
}
</script>

<style lang="less" scoped>
.detail {
	position: relative;
	width: 100%;
	.nav {
		box-sizing: border-box;
		padding: 0 30px 0 16px;
		height: 64px;
		line-height: 64px;
		margin: 0 auto;
		max-width: 1300px;
		min-width: 1100px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		// background-color:pink;
		.title {
			font-weight: 800;
			// background-color: aliceblue;
			font-size: 24px;
			color: #03a9f4;
			height: 100%;
			cursor: pointer;
		}
		ul {
			display: flex;
			justify-content: space-between;
			align-items: center;
			// background-color: rgb(197, 107, 170);
			height: 100%;
			li {
				padding: 0 15px;
				height: 100%;
				cursor: pointer;
				font-size: 18px;
			}
			:hover {
				color: #03a9f4;
				font-weight: 600;
			}
		}
		.right-wrap {
			// background-color: burlywood;
			height: 100%;
			color: #03a9f4;
		}
	}

	.main-content {
		width: 1100px;
		margin: 0 auto;
		margin-top: 40px;
		min-height: 500px;
		position: relative;
		overflow: hidden;
		box-sizing: border-box;
		display: flex;
		justify-content: space-between;
		box-sizing: border-box;
    padding: 0 10px 100px 10px;
		.main-left {
			width: 70%;
			// background-color: #03a9f45c;
			.article-content{
				.title{
					font-size: 37px;
					font-weight: 600;
					line-height: 56px;
					color: #000;
					
				}
				.source{
					color:#707070;
					font-size: 14px;
					margin: 16px 0 36px 0 ;
				}
				
				.cover{
					max-width:100%;
					margin-bottom: 8px;
					object-fit: cover;
				}

				.content{
					font-size: 18px;
					line-height: 34px;
					color: #222;
					font-family: PingFang SC,Hiragino Sans GB,Microsoft YaHei,WenQuanYi Micro Hei,Helvetica Neue,Arial,sans-serif;
				}
			}
		}
		.main-right {
			width: 28%;
			// background-color: #dcbcd8;
			// min-height:600px;
			font-size: 15px;
		
			.top-card{
				margin-bottom: 23px;
				height: 150px;
				 
				.top-card--source{
					line-height: 38px;
					color: #fff;
					font-size: 16px;
				}
				.comment{
					font-size: 14px;
					color: #f8f8f8;
				}
				:deep(.el-card){
					height: 100%;
					background-color: #03a9f4;
					text-align: center;
				}
				:deep(.is-always-shadow){
					box-shadow:none;
					border: none;
				}
			}

			:deep(.el-card__header) {
				font-weight: 800!important;
				color:#409eff;
			}
		}
	}
}


.item {
  padding: 15px 0;
  color: #2a2a2a;
  line-height: 28px;
}

.item:first-child{
  padding-top:0
}

 
</style>
