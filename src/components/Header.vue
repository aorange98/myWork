<template>
	<!-- banner -->
	<div class="banner">
		<div class="home-banner-wrapper">
			<div class="home-banner">
				<div class="video-poster"></div>
				<video src="https://lf9-static.bytednsdoc.com/obj/eden-cn/uhbfnupkbps/video/earth_v6.mp4" loop muted
					preload="auto" ref="videoDom" :autoplay="false"></video>
			</div>
		</div>
		<div class="header">
			<div class="header-left">
				<div class="weather" @click="handleWeather">
					<span>天气</span>
				</div>
			</div>
			<div class="header-right">
				<div class="publish" @click="handleToMyZone">Cloud</div>
				<el-button :type="loginText!='登录'?'default':'primary'" 
					class="login-btn" 
					@click="dialogFormVisible = true"
					:plan="loginText!='登录'?true:false"
					:style="loginText!='登录'?{backgroundColor:'transparent',color:'#fff'}:''"
				>
					{{loginText}}
				</el-button>
			</div>
		</div>
		<div class="search">
			<div class="title-wrap">
				<div class="title">橙哥资讯</div>

				<div class="autocomplete-wrap">
					<el-autocomplete 
						v-model="state"
						:fetch-suggestions="handleQuerySearch"
						placeholder="请输入你想了解的"
						@select="handleSelect"
						:prefix-icon="Search"
					/>
					<el-button 
						size="large" 
						:icon="Search" 
						color="#409eff" 
						style="color:#fff;width:60px;height:50px" 
						@click="handleSelect"
						></el-button>
				</div>
			</div>
		</div>



		<el-dialog v-model="dialogFormVisible" title="登录" width="450px" v-if="!store.state.isLogin">
			<el-form :model="form" ref="formRef" size="large">

				<!-- 邮箱号表单 -->
				<el-form-item label="邮箱号" :label-width="formLabelWidth" prop="emailNumber"
					:rules="[
						{
							required: true,
							message: '请输入邮箱号',
							trigger: 'blur',
						},
						{
							type: 'email',
							message: '请输入正确的邮箱号',
							trigger: ['blur', 'change'],
						},
					]"
				>
					<el-input v-model="form.emailNumber" autocomplete="off" :clearable="true"/>
				</el-form-item>

				<!-- 验证码表单 -->
				<el-form-item label="验证码" :label-width="formLabelWidth" prop="verificationCode"
					:rules="[
						{ required: true, message: '请输入验证码' },
						{ type: 'number', message: '验证码必须是数字' },
					]"
				>
					<el-input v-model.number="form.verificationCode" autocomplete="off" 
						maxlength='4' :clearable="true" style="width:220px"
					/>
					<el-button type="primary" plain :disabled="isDisabled" 
					@click="handleGetVerificationCode"
					style="width:110px"
					>
						{{ verifMsg }}
					</el-button>
				</el-form-item>

			</el-form>

			<template #footer>
				<span class="dialog-footer">
					<el-button @click="resetForm(formRef)">取消</el-button>
					<el-button type="primary" 
					@click="submitForm(formRef)"
					>注册/登录</el-button>
				</span>
			</template>
			
		</el-dialog>


		<el-dialog v-model="dialogFormVisible" title="Tips" width="450px" v-else>
			<span>是否要退出登录？</span>
			<template #footer>
				<span class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取消</el-button>
				<el-button type="primary" @click="handleExitLogin">退出</el-button>
				</span>
			</template>
		</el-dialog>

	</div>
</template>

<script>
import { baseURL } from '../api/myAxios.js'
import {  onMounted,reactive,ref,toRef,toRefs,getCurrentInstance,watch,watchEffect } from "vue"
import { useRoute, useRouter } from "vue-router"
import { Search } from '@element-plus/icons-vue'
import { getSearchData, emilLogin,getVerificationCode,getWeather, verifyToken } from '@/api/modules/homeApi'
import { useStore } from "vuex"
import  verifyTokenMixin  from '@/mixin/verifyTokenMixin.vue'
 
export default {
	name: "Header",
	mixins:[verifyTokenMixin],
	setup() {
		// getCurrentInstance 只能在 setup 或生命周期钩子中调用。
		const internalInstance = getCurrentInstance()
		// console.log(internalInstance.appContext)
		
		// 这里存着一些全局属性 如vue的$router $route $store这三个属性
		// 还有element上面的一些全局属性 如$alert $loading 等
		// console.log(internalInstance.appContext.config.globalProperties)

		const {$message,$notify} = internalInstance.appContext.config.globalProperties
    const { ctx:_this } = internalInstance   // 实例化对象
		const store = useStore()
		const router = useRouter()

 

		const data = reactive({
			videoDom:null,
			state:'',				// 搜索框的数据
			searchList:[],		// 搜索出来的数据
			formRef:"",

			// 登录表单
			dialogFormVisible:false,
			formLabelWidth:'80px',
			form:{
				emailNumber:"",	//邮箱号
				verificationCode: null	//验证码

				// emailNumber:"q@qq.com", 
				// verificationCode: 7316	  
			},
			isDisabled:false,
			verifMsg:"获取验证码",
			loginText:"登录",

		})

		data.loginText = store.state.isLogin?store.state.userInfo.emailNumber:data.loginText

		onMounted(() => {
			// 开始播放视频/音频（audio/video）时触发 让他播放
			data.videoDom.addEventListener("canplay", data.videoDom.play())
		})
 
 
		// 输入时搜索
		const handleQuerySearch = async (value,cb)=>{
			if(value !==""){
				// 拉取数据：...
				const result = await getSearchData({keyword:value},false)
				const {data} = result
				// console.log(data)

				const handleDataList = data.reduce((prev,cur)=>{
					let obj = {}
					obj.value = cur.keyword
					obj.info = cur.info
					prev.push(obj)
					return prev
				},[])

				// 赋值
				data.searchList = handleDataList
				// 调用回调将拉取的数据返回
				cb(data.searchList)
			}
		}

		// 点击预选操作
		const handleSelect = (item) => {
			open(`https://so.toutiao.com/search?dvpf=pc&source=sug&keyword=${item.value || data.state}`)
		}



		// 获取验证码
		const handleGetVerificationCode = async ()=>{
			let emailReg = /^\w+@[a-z0-9]+(\.[a-z]+){1,3}$/
      if (emailReg.test(data.form.emailNumber)) {
        const result = await getVerificationCode({emailNumber:data.form.emailNumber})
        console.log(result)
        if(result.code == 0){
					$message({
						type:"success",
						message: result.msg,
					})
          let time = 60
          let timer = setInterval(()=>{
            data.verifMsg = time -- + '秒后重新获取'
            data.isDisabled=true
            if(time==-1){
              clearInterval(timer)
              data.verifMsg="获取验证码"
              data.isDisabled=false
            }
          },1000)
        }else{
					$message({
						type:"error",
						message: "获取失败，可能是无效邮箱！",
					})

        }
			}
		}

		

		// 提交表单--登录
		const submitForm = (formEl) => {
			if (!formEl) return
			formEl.validate((valid) => {
				if (valid) {
					console.log('submit!')
					emilLogin(data.form).then(res=>{
						console.log(res)
						if( res.code == 0 ){
							$message({
								type:"success",
								message: res.msg,
							})
							data.loginText = res.data.emailNumber
							data.dialogFormVisible=false
							data.formRef.resetFields()
							
							// token存在本地
							localStorage.setItem('token',res.data.token)

							// 更新用户信息
							store.commit('updateUserInfo',res.data.userInfo)

							// 更新登录态
							store.commit('updateLoginStatus',true)

						}else{
							$message({
								type:"error",
								message: res.msg,
							})
						}
					}).catch(rej=>{
						console.log(rej)
					})
				} else {
					console.log('error submit!')
					return false
				}
			})
		}

		// 重置表单
		const resetForm = (formEl) => {
			if (!formEl) return
			formEl.resetFields()
			data.dialogFormVisible = false
		}


		// 天气
		const handleWeather = async ()=>{
			const result = await getWeather({city:'广州'})
			const [cityResult,cityList] = result.data
			const now = cityResult.now
			console.log(now,cityList.location[0].name)

			$notify({
				title: `${cityList.location[0].name}天气`,
				dangerouslyUseHTMLString:true,
				position: 'top-left',
				type:"success",
				// duration:0,
				message:`
					<p style="display: flex">	
						<span>天气：${now.text}</span>
						<img src='${baseURL}/img/icons/${now.icon}.svg' style="padding-left: 10px;"/>
					</p>
					<p>温度：${now.temp}</p>
					<p>风向风力：${now.windDir} ${now.windScale} 级</p>
					<p>相对湿度：${now.humidity}%</p>
					<p>大气压强：${now.pressure} 百帕</p>
					<p>能见度：${now.vis} 公里</p>
					<p>更新时间：${new Date(now.obsTime).toLocaleTimeString()}</p>
				`,
			})
		} 


		// 去我的页面
		const handleToMyZone = ()=>{
			router.push({
				name:'myself'
			})
		}



		// 退出登录
		const handleExitLogin = ()=>{
			// 把token清掉
			localStorage.removeItem('token')
			
			// 重新验证
			_this.verifyTokenMinxin()
			data.loginText = '登录'

			data.dialogFormVisible = false
		}



		
		return {
			...toRefs(data),
			store,
			Search,
			handleQuerySearch,
			handleSelect,
			submitForm,
			resetForm,
			handleGetVerificationCode,
			handleWeather,
			handleToMyZone,
			handleExitLogin
		}
	}
}
</script>

<style lang="less" scoped>

.banner {
	position: relative;
	padding-bottom: 40px;
	min-width: 1100px;
}

.home-banner-wrapper {
	position: relative;
	overflow: hidden;
	height: 26.31579vw;
	max-height: 420px;
	min-height: 280px;
	background: #222;
}

.home-banner-wrapper .home-banner {
	position: relative;
	overflow: hidden;
	width: 100%;
	height: 100%;
}

.video-poster {
	background-image: url("https://p5.toutiaoimg.com/obj/eden-cn/uhbfnupkbps/video/earth_v6.jpeg");
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-size: cover;
}

.home-banner video {
	width: 100%;
	height: 100%;
	position: relative;
	z-index: 1;
	object-fit: cover; // 对图片进行剪切，保留原始比例：
}

// 头部
.header {
	width: 100%;
	display: flex;
	justify-content: space-between;
	position: absolute;
	top: 0;
	left: 0;
	z-index: 2;
	box-sizing: border-box;
	padding: 20px;
	color: #fff;

	.header-left {
		width: 200px;
		// border:1px solid #fff;
		font-size: 14px;
		cursor: pointer;
		.weather {
			display: inline-block;
			line-height: 32px;
			height: 100%;
		}
	}

	.header-right {

		// width:200px;
		// border:1px solid #fff;
		.publish {
			display: inline-block;
			font-size: 14px;
			cursor: pointer;
		}

		.login-btn {
			display: inline-block;
			margin-left: 40px;
		}
	}
}

// 搜索
.search {
	width: 100%;
	height: 26.31579vw;
	max-height: 420px;
	min-height: 280px;
	display: flex;
	justify-content: center;
	position: absolute;
	align-items: center;
	top: 0;
	z-index: 1;
	color: #fff;

	.title-wrap {
		width: 704px;
		height: 157px;
		// border: 1px solid #fff;

		.title {
			font-size: 28px;
			font-weight: 800;
			text-align: center;
			padding-bottom: 20px;
		}
		
		.autocomplete-wrap{
			display: flex;
			width: 658px;
			margin:0 auto;
			margin: 20px auto;
			:deep(.el-autocomplete){
				width:600px;
				height: 50px!important;
			}
		}
	}
}

.autocomplete-wrap{
	:deep(.el-input__inner){
		width: 600px!important;
		height: 50px!important;
	}
}


 


</style>
