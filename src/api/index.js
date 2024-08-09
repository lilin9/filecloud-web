import http from "./server";

const api = {
    //用户区
    login(data) {
        return http.post("/user/login", data);
    },
    register(data) {
        return http.post("/user/register", data);
    },
    resetPassword(data) {
        return http.post("/user/resetPass", data);
    },
    resetEmail(data) {
        return http.post("/user/resetEmail", data);
    },
    checkPassword(data) {
        return http.post("/user/checkPass", data);
    },
    resetAvatar(data) {
        return http.post("/user/resetAvatar", data, { headers: { 'Content-Type': 'multipart/form-data' } });
    },
    diskInfo() {
        return http.post("/user/diskInfo");
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
    },
    upload(data) {
        return http.post(`/myFile/upload/${data.parentId}`, data.file, { headers: { 'Content-Type': 'multipart/form-data' } });
    },
    createFolder(parentId, folderName) {
        return http.post(`/myFile/createFolder/${parentId}/${folderName}`);
    },
    renameFile(data) {
        return http.post('/myFile/rename', data);
    },
    deleteFile(data) {
        return http.post('/myFile/delete', data);
    },
};

export default api;