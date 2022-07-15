<template>
	<div class="test">
    <div>{{ num }}</div>
    <div>{{ userInfo }}</div>
  </div>
</template>

<script setup>
  import { onMounted,onUpdated,reactive, ref } from "vue"

 
  onMounted(()=>{
    console.log("onMounted")
  })

  const arr = () => [1,2,3,4,5]
  console.log(arr);


</script>

<style scoped lang="less">
.test {
	margin: 0 auto;
	width: 1000px;
	min-height: 600px;
	background-color: pink;
}
</style>
