import { getRequest,getOtherRequest, postRequest } from '@/api/myAxios'
import axios from 'axios'


const baseURL= 'https://www.mxnzp.com'
const appid_secret = 'app_id=egeehstmrjgcprxl&app_secret=WVo0b2xEZjYyK1o0Tk83KzFDM1U1Zz09'
 
 



// 获取搞笑段子
export const getNewsDetail = (params) => axios.get(baseURL + '/api/news/details' + '?' + appid_secret,{params})

// 每日一句
export const getDaily = (params) => axios.get(baseURL + '/api/daily_word/recommend' + '?' + appid_secret,{params})
