<template>
	<div class="test">
    <div>{{ num }}</div>
    <div>{{ userInfo }}</div>
  </div>
</template>

<script setup>
  import { onMounted,onUpdated,reactive, ref } from "vue"

  let nums
 
  onMounted(()=>{
    console.log("onMounted")
  })

  onUpdated(()=>{
    console.log("onUpdated")
  })
 



</script>

<style scoped lang="less">
.test {
	margin: 0 auto;
	width: 1000px;
	min-height: 600px;
	background-color: pink;
}
</style>
