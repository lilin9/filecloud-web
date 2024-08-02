// 缓存操作工具类
export default {
    //将数据存入本地存储
    saveToLocal(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    },
    //取出本地存储
    FindForLocal(key) {
      var data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;  
    },
    //将本地存储删除
    DeleteForLocal(key) {
        localStorage.removeItem(key);
    },

    //获取登录用户的key
    getLoginKey(userId) {
        return `loginUser_${userId}`;
    },
    //获取登录用户的key
    getLoginKey() {
        return "fileCloud_loginUser";
    }
}