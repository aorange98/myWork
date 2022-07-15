<template>
	<!-- banner -->
	<Header></Header>
	<!-- 主内容 -->
	<MainContent></MainContent>
</template>

<script>
import Header from '@/components/Header.vue'
import MainContent from '@/components/MainContent.vue'
export default {
	name: 'Home',
	components: {
		Header,
		MainContent,
	},
	setup() {},
}
</script>

<style lang="less" scoped></style>
