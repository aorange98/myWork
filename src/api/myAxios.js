// request拦截器
import axios from 'axios'
import { ElLoading,ElMessage } from 'element-plus'
import $router from '../router/index'


let loadingOptions = {
  text:"加载中",
  background:"rgb(0,0,0,0.1)"
}
let $loading = null  

 

// export const baseURL = "http://s4209d3435.picp.vip";     // 生产环境   必须通过花生壳
// export const baseURL = "http://192.168.0.2:1210";       //  开发环境
// export const baseURL = "http://10.19.1.60:8203";        //  学校内网环境  不使用花生壳 使用域名访问会跨域拿不到数据
export const baseURL = "";                                 //  不设置url   使用花生壳 内网都能访问


// 可以使用自定义配置新建一个 axios 实例
const axiosInstance = axios.create({
  baseURL,
  timeout: 10000,  // 请求超过timeout的时间将会被中断  单位毫秒
  headers: {
    // 'Authorization':'9999999',   // header里面放Authorization为了验证用户身份 就是用来存放token的  Authorization：授权
    'X-Auth0-Token': localStorage.getItem('token') || ''  // 丰富获取 token 渠道，个性化处理
  },
})



// 通过axiosInstance.defaults可以查看实例时设置配置的默认值
// console.log(axiosInstance.defaults)



// 执行顺序：请求函数 -->请求拦截器 -->(正式请求) -->响应拦截器 -->then函数或者catch函数

// 添加请求拦截器
axiosInstance.interceptors.request.use(config => {
  // 在发送请求之前做些什么
  return config;
}, error => {
  // 对响应错误做点什么
  return Promise.reject(error);
});

// 添加响应拦截器
axiosInstance.interceptors.response.use(response => {
  // 对响应数据做点什么
  switch(response.data.code){
    case 0:
      return response.data
    case 40001:    // token失效 则重新登录
    case -401:   
      ElMessage({ type:"warning" ,message:"登录已过期，请重新登录"})
      setTimeout(()=>{
        $router.replace('/login')   
      },1500)
      return response.data
    default:
      // ElMessage({ type:"info" ,message:response.data.msg})  // 不需要
      return response.data
  }
}, error => {
  // 对响应错误做点什么
  if (error.response) {
    switch (error.response.status) {
      case 400:
        error.message = `错误请求：${error.response.data}`
        break
      case 401:
        error.message = '未授权，请重新登录'
        $router.replace('/login')
        break
      case 403:
        error.message = '拒绝访问'
        break
      case 404:
        error.message = '请求错误,未找到该资源'
        break
      case 405:
        error.message = '请求方法未允许'
        break
      case 408:
        error.message = '请求超时'
        break
      case 500:
        error.message = '服务器端出错'
        break
      case 501:
        error.message = '网络未实现'
        break
      case 502:
        error.message = '网络错误'
        break
      case 503:
        error.message = '服务不可用'
        break
      case 504:
        error.message = '网络超时'
        break
      case 505:
        error.message = 'http版本不支持该请求'
        break
      default:
        error.message = `连接错误${error.response.status}`
    }
  } else {
    error.message = '服务器异常'
  }
  ElMessage({ type:"error" ,message:error.message})
  return Promise.reject(error.response);
});



/** 封装get请求
 * @param {String} url 
 * @param {Object} params 
 * @param {Boolean} loading 
 * @returns {Promise}
 */
export function getRequest(url, params, loading = true) {
  if (loading) {
    $loading = ElLoading.service(loadingOptions)
  }
  return new Promise((resolve, reject) => {
    // axiosInstance.request({config}) 等价 axiosInstance({config})
    axiosInstance.request({     // {config} 的配置将与实例axiosInstance的配置合并。
      url,
      method: "GET",
      params,
    }).then(res => {
      resolve(res)
      $loading.close()
    }).catch(err => {
      reject(err)
      $loading.close()
    })
  })

}

// 第三方接口
export function getOtherRequest(baseURL, params, loading = true) {
  if (loading) {
    $loading = ElLoading.service(loadingOptions)
  }
  return new Promise((resolve, reject) => {
    // 将请求头置空
    axiosInstance.defaults.headers = {}
    axiosInstance.request({
      baseURL,
      method: "GET",
      headers:{}, // 置空
      params,
    }).then(res => {
      resolve(res)
      $loading.close()
    }).catch(err => {
      reject(err)
      $loading.close()
    })
  })

}


// 封装 POST PUT PATCH请求
export function postRequest(url, data, method = "POST", loading = true) {
  if (loading) {
    $loading = ElLoading.service(loadingOptions)
  }
  return new Promise((resolve, reject) => {
    axiosInstance.request({
      url,
      method,
      data,     // `data` 是作为请求主体被发送的数据 只适用于这些请求方法 'PUT', 'POST', 和 'PATCH'
    }).then(res => {
      resolve(res)
      $loading.close()
    }).catch(err => {
      reject(err)
      $loading.close()
    })
  })
}



