import { getRequest,getOtherRequest, postRequest } from '@/api/myAxios'
import axios from 'axios'


const baseURL= 'https://www.mxnzp.com'
const appid_secret = 'app_id=egeehstmrjgcprxl&app_secret=WVo0b2xEZjYyK1o0Tk83KzFDM1U1Zz09'
 
 

// 获取搜索时的数据
export const getSearchData = (data,loading) => getOtherRequest('https://www.toutiao.com/2/article/search_sug/',data,loading)

// 获取邮箱验证码
export const getVerificationCode = data => getRequest('/api/sendMsg',data)

// 邮箱登录
export const emilLogin = data => postRequest('/api/emailLogin',data)

// 获取天气
export const getWeather = data => getRequest('/api/getWeather',data)

// 获取tabbar列表
export const getTabbarList = () => axios.get(baseURL + '/api/news/types' + '?' + appid_secret)

// 根据typeId拉取对应的数据列表
export const getNewsList = (params) => axios.get(baseURL + '/api/news/list' + '?' + appid_secret,{params})

// 获取搞笑段子
export const getJokesList = (params) => axios.get(baseURL + '/api/jokes/list' + '?' + appid_secret,{params})

// 验证登录状态
export const verifyToken = data => postRequest('/api/verifyToken',data)


