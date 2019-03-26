import axios from 'axios';
import moment from 'moment';
// 创建axios实例
const service = axios.create({
    baseURL: 'https://ehkrd.danarupiah.id/seaweed/', // api的base_url
    timeout: 20000, // 请求超时时间
    withCredentials: true, // 是否携带cookies
});
const datetime = moment(new Date).valueOf() + '';

//  request拦截器
service.interceptors.request.use(async config => {
    // 合伙人
    config.headers['Content-type'] = 'application/json;charset=UTF-8';
    if (config.method === 'post') {
        let data = {
            head: {
                datetime,
            },
            body: {
                ...config.data,
            },
        };
        config.data = data;
    }
    return config;
}, error => {
    // Do something with request error
    console.log(error);  //for debug
    Promise.reject(error);
});
//
//  respone拦截器
service.interceptors.response.use(response => {

    if (response.data.head.returncode === '0001') {
        location.href = `${location.origin}/#login`;
        localStorage.removeItem('ms_username');
    }
    return response.data;
}, error => {
    return Promise.reject(error);
});

export default service;
