import axios from "axios";
import { ElMessage } from "element-plus";

const instance = axios.create({
    timeout: 50000,
    headers: {
        'Content-Type': 'application/json;charset=utf-8'
    }
});

//请求拦截器
instance.interceptors.request.use(config => {
    config.url = `/api${config.url}`;
    return config;
}, error => {
    return Promise.reject(error);
});

//返回拦截器
instance.interceptors.response.use(res => {
    const data = res.data;
    return Promise.resolve(data);
}, error => {
    if (error.code === 'ERR_BAD_RESPONSE' && error.message.includes('500')) {
        ElMessage.error('请求超时，请稍后再试');
    }
    return Promise.reject(error);
});


//封装请求类型
const http = {
    get(url, data) {
        return instance.get(url, { params: data });
    },
    post(url, data) {
        return instance.post(url, data);
    }
}
export default http;