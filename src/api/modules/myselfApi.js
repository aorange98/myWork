import { getRequest, postRequest } from '@/api/myAxios'
 
 

// 获取文件列表
export const getFilesLists = () => getRequest('/api/download')

 


