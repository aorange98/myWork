<script>
import { verifyToken } from '@/api/modules/homeApi'
import { getCurrentInstance } from 'vue'


export default {
  data(){
    return{
      $message:""
    }
  },
	created() {
		const internalInstance = getCurrentInstance()
		const { $message } = internalInstance.appContext.config.globalProperties
    this.$message = $message
	},
	methods: {
		verifyTokenMinxin() {
			verifyToken()
				.then(res => {
					console.log(res)
					// 无论是否token过期和不过期都刷新登录状态
					this.$store.commit('updateLoginStatus', res.status)

					if (res.code == 1) {	// token过期或者无token
						if ( localStorage.getItem('userInfo') !== null || localStorage.getItem('token') !== null ) {   // 本地中userinfo和token至少有一个
							this.$message({
								type: 'error',
								message: res.msg,
							})

							// 然后重新设置一下登录信息
							this.$store.commit('updateUserInfo', {})


							// 最后把本地的给干掉
							localStorage.removeItem('userInfo')
							localStorage.removeItem('token')


						} else {		// 本地中userinfo和token都没有
							console.log('*******************新用户')
						}
					} else {
						// token有效
						this.$store.commit('updateUserInfo', {emailNumber:res.data.emailNumber}) // 重新设置一下登录信息 传对象 
					}
				})
				.catch(err => {
					console.log(err)
				})
		},
	},







}

 



</script>
