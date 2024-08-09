import { ElMessage } from "element-plus";
import api from '@/api/index.js';

export async function useVerifyCode(userInfo) {
    if (!userInfo.email) {
        ElMessage.warning('请输入邮箱');
    }
    //请求后端接口
    const res = await api.senderCode(userInfo.email);
    if (!res || !res.success) {
        ElMessage.error("验证码发送失败，请点击重新获取");
    }
}