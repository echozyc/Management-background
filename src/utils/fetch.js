import axios from 'axios';
// 创建axios实例
const service = axios.create({
    baseURL: '/', // api的base_url
    timeout: 20000, // 请求超时时间
});
//  request拦截器
service.interceptors.request.use(async config => {
    // 合伙人
    config.headers['Content-type'] = 'application/json;charset=UTF-8';
    return config;
}, error => {
    // Do something with request error
    console.log(error);  //for debug
    Promise.reject(error);
});
//
//  respone拦截器
// service.interceptors.response.use(
//     response => {
//         /**
//          * 下面的注释为通过response自定义code来标示请求状态，当code返回如下情况为权限有问题，登出并返回到登录页
//          * 如通过xmlhttprequest 状态码标识 逻辑可写在下面error中
//          */
//         const res = response.data;
//         if (res.code === 3002) {
//            //  3002
//
//           window.location.href = `${API_ROOT}//app.sdlipei.com/wechat/case/bind`
//           console.log(window.location.href)
//           return Promise.reject(res);
//         } else {
//             return response;
//         }
//     },
//     error => {
//         console.log('err' + error);  // for debug
//         return Promise.reject(error);
//     }
// )

export default service;
