<template>
	<div class="newList">
		<div class="card-wrap">
			<div class="txt-left">
				<div class="title">{{props.item.title}}</div>
				<div class="digest">{{props.item.digest}}</div>
				<div class="bottom-desc">
					<span class="sourcce">{{props.item.source}}</span>
					<span class="post-time">{{props.item.postTime}}</span>
				</div>
			</div>
			<div class="img-right">
				<img :src="props.item.imgList[0]" v-if="props.item.imgList!=null">
				<img src="../assets/img/001.jpg" v-else>
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
import { useRoute, useRouter } from 'vue-router'
 

export default {
	name: 'newList',
	props:{
		item:{
      type: Object,
      required: true
    }
	},
	setup(props) {
    return {
			props
    }
  }
}
</script>

<style scoped lang="less">
  .newList{
		cursor: pointer;
		position: relative;
		width: 100%;
		border-bottom: 1px solid #ddd;
    margin-bottom: 22px;
    padding-bottom: 19px;
		.card-wrap{
			width: 100%;
			max-width: 1100px;
			// height: 180px;
			display: flex;
			justify-content: space-between;			
			.txt-left{
				width: 67%;
				// background-color: rgb(215, 215, 215);

				.title{
					padding-bottom: 10px;
					width: 100%;
					font-size: 20px;
					font-weight: 500;
					line-height: 28px;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					overflow: hidden;
					word-break: break-all;
				}
				.digest{
					line-height: 20px;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					font-size: 15px;
					overflow: hidden;
					word-break: break-all;
				}

				.bottom-desc{
					margin-top: 5%;
					padding-bottom: 15px;
					.sourcce{
						font-size: 14px;
						color: rgb(176, 171, 171);
					}

					.post-time{
						font-size: 14px;
						padding-left: 30px;
						color: rgb(176, 171, 171);
					}
				}
			}
			.img-right{
				width: 30%;
				max-width: 276px;
    		max-height: 160px;
				// background-color: rgb(166, 150, 200);
				border-radius: 15px;
				overflow: hidden;
				img{
					width: 100%;
					height: 100%;
					object-fit: cover; // 对图片进行剪切，保留原始比例
					
				}
			}
		}



    
  }




</style>
