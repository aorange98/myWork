<template>
	<div class="myself">
		<div class="nav">
			<div class="title" @click="router.replace({name:'home'})">ORA CLOUD</div>
			
			<div class="right-wrap">
				{{ $store.state.userInfo.emailNumber }}
			</div>
		</div>
		
		<div class="content">
			<div class="wrap">
				<div class="upload">
					<h3 class="title">上传文件</h3>
					<div class="upload_btn">
						<span>点击上传</span>
						<input type="file" name="file" class="upload_btn_in" @change="handleChange"/>
					</div>
				</div>

				<div class="check">
					<h3 class="title">云盘中的文件</h3>
					<ul>
						<li v-for="(item, index) in getList" :key="index" class="list">
							<el-icon color="#fff" style="margin-right:10px"><Files /></el-icon>
							<span>{{ item }}</span>
							<a :href="`/api/download/${item}`">点击下载</a>
						</li>
					</ul>
				</div>
			</div>
		</div>
  </div>

	
	<div class="progress">
		<el-progress type="circle" :percentage="percentage" v-if="percentage"/>
	</div>

</template>

<script>
import { reactive,toRefs,getCurrentInstance } from "vue"
import { useRouter } from "vue-router"
import { getFilesLists } from '@/api/modules/myselfApi'
import { Files } from "@element-plus/icons";
import axios from 'axios'

export default {
	name: 'myself',
	components:{
		Files,
	},
	setup() {
		const internalInstance = getCurrentInstance()
		const {$message} = internalInstance.appContext.config.globalProperties
		const router = useRouter()
		const data = reactive({
			getList:[],		// 文件列表
			percentage:0	// 进度条进度
    })
 

		const getFileListDataFn = ()=>{
			// 初始化获取文件列表
			getFilesLists().then((res) => {
				data.getList = res
			}).catch((err) => {
				console.log(err)
			});	
		}
		getFileListDataFn()

	

		const handleChange = async (e)=>{
			console.log(e.target.files["0"]);
      let file = e.target.files[0];

      // 把他变成用表单的形式传输 要new FormDate
      let formdata = new FormData();
      formdata.append("file", file);
      formdata.append("chunk", "0"); // 添加form表单中其他数据
      // console.log(formdata, 1);

      // 请求配置 配置请求头
      let config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },

        // `onUploadProgress` 允许为上传处理进度事件
        onUploadProgress: (progressEvent) => {
          // 对原生进度事件的处理
          const { loaded, total } = progressEvent;
          // loaded:已上传进度   total：总进度
          const progressTime = (loaded / total) * 100;
          data.percentage = Math.floor(progressTime);
          console.log(progressTime);
        },
			}

      const result = await axios.post("/api/uploadFile", formdata, config); 	// 添加请求头
      console.log(result.data);
 
			// 置空
      data.percentage = 0;
			$message({
				type:"success",
				message:result.data.txt
			})
      getFileListDataFn()
		}
 
		return {
			...toRefs(data),
			router,
			handleChange
		}
	},
}


/** 
	https://zhuanlan.zhihu.com/p/68271019
	文件上传的几种方式
		1.普通表单上传 
			首先构建文件上传的表单，并指定表单的提交内容类型为enctype="multipart/form-data"，表明表单需要上传二进制数据。

			form表单上传大文件时，很容易遇见服务器超时的问题。通过xhr，前端也可以进行异步上传文件的操作，一般由两个思路

			1.1 思路一：文件编码上传
				将文件进行编码，然后在服务端进行解码，原理就是将图片转换成base64进行传递
				缺点:base64编码的后在于其体积比原图片更大

			
			1.2 思路二：读取文件内容后以二进制格式上传
				new ArrayBuffer()



		2.formData异步上传  √
			FormData对象主要用来 组装一组用XMLHttpRequest发送请求的键/值对，可以更加灵活地发送Ajax请求。
			可以使用FormData来模拟表单提交。

			let files = e.target.files  // 获取input的file对象
			let formData = new FormData();
			formData.append('file', file);
			axios.post(url, formData);

		3.iframe无刷新页面

        
*/


</script>

<style scoped lang="less">
 
.myself {
	position: relative;
	width: 100%;
	background-color: #fff;
	.nav {
		padding: 0 30px 0 16px;
		box-sizing: border-box;
		height: 64px;
		line-height: 64px;
		margin: 0 auto;
		max-width: 1300px;
		min-width: 800px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		// background-color:#ffb1c4;
		.title {
			font-weight: 800;
			font-size: 24px;
			color: #03a9f4;
			height: 100%;
			cursor: pointer;
		}
		.right-wrap {
			height: 100%;
			color: #03a9f4;
		}
	}


	.content{
		// max-width: 1300px;
		min-width: 800px;
		box-sizing: border-box;
		position: relative; 
		margin: 0 auto;
		// min-height: 770px;
		height:calc(100vh - 64px);
		padding-bottom: 100px;
		background-repeat: no-repeat;
		background-image:url("@/assets/img/index_bg.jpg") ;
		background-size: 100% 100%;
		overflow: hidden;
		

		.wrap{
			display: flex;
			width: 70%;
			margin: 0 auto;
			border-radius: 20px;
			box-shadow: 0px 6px 20px 10px rgb(255 255 0 / 50%);
			padding: 20px;
			min-height: 300px;
			max-width: 900px;
			margin-top: 80px;
			color: rgba(255, 255, 255, 0.889);

			// 左边
			.upload{
				width: 40%;
				// background-color: rgb(161, 125, 75);
				.upload_btn {
				position: relative;
				width: 80px;
				height: 30px;
				padding: 0 10px;
				background-color: rgb(255, 149, 0);
				border-radius: 15px;
				span {
					text-align: center;
					line-height: 29px;
					padding-left: 8px;
				}
				.upload_btn_in {
					position: absolute;
					top: 0;
					left: 0;
					opacity: 0;
					}
				}
			}

			//右边
			.check {
				width: 60%;
				// background-color: #03a9f4;
				.list {
					padding-bottom: 14px;
					a{
						background-color: #000000;
						padding: 3px 15px;
						border-radius: 28px;
						color: #ffa50a;
						text-decoration: none;
						font-size: 13px;
						margin-left: 15px;
					}
				}
			}

			// 公共的
			.title{
				font-size: 20px;
				font-weight: 600;
				margin:18px 0 30px;
			}
		}
	}
}

.progress{
	position: fixed;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
}

:deep(.el-progress__text){
	color:#fff;
}

</style>
