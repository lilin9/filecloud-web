import http from "./server";

const api = {
    //用户区
    login(data) {
        return http.post("/user/login", data);
    },
    register (data) {
        return http.post("/user/register", data);
    },

    //验证码区
    senderCode(data) {
        return http.post(`/verifyCode/senderCode/${data}`);
    },
    checkCode(data) {
        return http.post(`/verifyCode/checkCode/${data.email}/${data.verifyCode}`);
    },

    //文件区
    searchList(data) {
        return http.post("/myFile/searchList", data);
    }
};

export default api;