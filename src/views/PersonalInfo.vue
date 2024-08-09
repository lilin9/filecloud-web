<!-- 个人中心页面 -->
<script setup>
import { getCurrentInstance, onMounted, ref, watchEffect } from 'vue';
import Progress from '../components/Progress.vue'
import regularCode from '@/utils/regularCode';
import { ElMessage } from 'element-plus';
import RequestCodeButton from '@/components/common/RequestCodeButton.vue';
import { useVerifyCode } from '@/hooks/VerifyCode';

const { proxy } = getCurrentInstance();
const local = proxy.$local;
const api = proxy.$api;


//从本地存储拿取用户数据
const userInfo = ref(local.FindForLocal(local.getLoginKey()));
//用户头像文件路径
const avatarFilePath = ref(userInfo.value && userInfo.value.onlineAvatar ? userInfo.value.onlineAvatar : '/static/images/default.jpg');


let isShowImgMasking = ref(false)
//头像鼠标移入事件
const avatarImgMouseEnter = () => {
    isShowImgMasking.value = true;
}
//蒙版鼠标移出事件
const imgMaskingMouseOut = () => {
    isShowImgMasking.value = false;
}


const resetPasswordRef = ref(null);
//密码重置
const resetPasswordModule = ref({
    oldPassword: '',
    newPassword: '',
    verifyPassword: ''
})
//密码重置点击事件
const resetPasswordClick = () => {
    const user = userInfo.value;
    const resetPass = resetPasswordModule.value;
    //唤醒重置密码表单验证
    resetPasswordRef.value.validate(async valid => {
        if (!valid || !userInfo) {
            return;
        }
        //校验原始密码
        const oldTure = await checkOldPassword(user.userId, resetPass.oldPassword);
        if (!oldTure) {
            ElMessage.error('原始密码输入错误');
            return;
        }

        //修改密码
        user.password = resetPass.newPassword;
        await updatePass(user);
    });
}
//校验原始密码
const checkOldPassword = async (userId, oldPass) => {
    const result = await api.checkPassword({ userId, password: oldPass });
    if (!result.success) {
        return false;
    }
    return result.data;
}
//修改密码
const updatePass = async (user) => {
    const result = await api.resetPassword(user);
    if (result && result.success) {
        ElMessage.success('重置密码成功');
        resetPasswordModule.value = {};
    } else {
        ElMessage.error('重置密码失败，请重试');
    }
}



const resetEmailRef = ref(null);
//邮箱重置
const resetEmailModule = ref({
    email: '',
    verifyCode: ''
});
//邮箱重置点击事件
const resetEmailClick = () => {
    //唤醒重置密码表单验证
    resetEmailRef.value.validate(async valid => {
        if (!valid || !userInfo) {
            return;
        }

        const resetEmail = resetEmailModule.value;
        const user = userInfo.value;

        //验证邮箱验证码
        const isTrue = await checkVerifyCode(resetEmail.email, resetEmail.verifyCode);
        if (!isTrue) {
            ElMessage.error('验证码错误，请重新输入');
        }

        //重置邮箱
        user.email = resetEmail.email;
        await resetEmailHandler(user);
    });
}
//校验邮箱验证码
const checkVerifyCode = async (email, code) => {
    const result = await api.checkCode({ email, verifyCode: code });
    return result && result.success == true;
}
//重置邮箱
const resetEmailHandler = async (user) => {
    const result = await api.resetEmail(user);
    if (result && result.success) {
        ElMessage.success('重置邮箱成功');
        resetEmailModule.value = {};
    } else {
        ElMessage.error('重置邮箱失败，请重试');
    }
}



//验证邮箱合法性，然后禁用或者启用发送验证码按钮
let enableSenderCodeBtn = ref(false);
//邮箱验证码发送事件
const senderVerifyCode = () => { return useVerifyCode(resetEmailModule.value); }
//监听邮箱输入，判断是否合法
watchEffect(() => {
    var regex = regularCode.emailVerify;
    var email = resetEmailModule.value.email;
    if (email != '' && regex.test(email)) {
        enableSenderCodeBtn.value = true;
    } else {
        enableSenderCodeBtn.value = false;
    }
});



//显示头像文件的加载状态
const showAvatarLoding = ref(false);
//头像图片数据
const uploadAvatarFile = ref({});
//上传头像文件之前，对头像文件进行检测
const beforeAvatarUpload = (rawFile) => {
    if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png') {
        ElMessage.warning('头像图片必须是JPG/PNG格式')
        return false
    } else if (rawFile.size / 1024 / 1024 > 2) {
        ElMessage.warning('头像图片不能大于2M')
        return false
    }
    return true
}
//文件上传器数据发生改变时
const avatarUploadeChange = (uploadFile) => {
    uploadAvatarFile.value = uploadFile.raw;
}
//上传头像的文件上传器的httpRequest重写
const httpAvatarUploade = (opt) => {
    showAvatarLoding.value = true;

    const user = userInfo.value;
    const avatarFile = uploadAvatarFile.value;
    //请求后端接口
    requestResetAvatarApi(user.userId, avatarFile);

    showAvatarLoding.value = false;
}
//重置用户头像接口请求
const requestResetAvatarApi = async (userId, avatarFile) => {
    const param = { userId, avatarFile };
    const result = await api.resetAvatar(param);

    if (result && result.success) {
        if (result.data) {
            userInfo.value = result.data;
        }
        uploadSuccessHandler();
        ElMessage.success('重置头像成功');
    } else {
        ElMessage.error('重置头像失败，去重试');
    }
}
//文件上传成功回调
const uploadSuccessHandler = () => {
    avatarFilePath.value = userInfo.value.onlineAvatar;
    local.saveToLocal(local.getLoginKey(), userInfo.value);
}



//设置磁盘容量信息
const diskInfo = ref({ totalSpace: '', usedSpace: '', ratio: 0 });
const requestDiskInfoApi = async () => {
    const result = await api.diskInfo();
    if (result && result.success) {
        let data = result.data;
        diskInfo.value.totalSpace = data.totalSpace.value + data.totalSpace.unit + '';
        diskInfo.value.usedSpace = data.usedSpace.value + data.usedSpace.unit + '';
        diskInfo.value.ratio = data.ratio;
    }
}



//表单验证
const passwordVerify = regularCode.passwordVerify;
const validatorVerifyPassword = (rule, value, callback) => {
    if (!passwordVerify.test(value)) {
        callback(new Error("密码 4 ~ 16 位，不包含特殊字符"))
    } else if (value != resetPasswordModule.value.newPassword) {
        callback(new Error("确认密码和新密码不一致"))
    } else {
        callback()
    }
}
const formRules = ref({
    oldPassword: [
        { required: true, message: '密码输入不可以为空', trigger: 'blur' },
        { pattern: passwordVerify, message: '密码 4 ~ 16 位，只能包含字母和数字', trigger: 'blur' }
    ],
    newPassword: [
        { required: true, message: '密码输入不可以为空', trigger: 'blur' },
        { pattern: passwordVerify, message: '密码 4 ~ 16 位，只能包含字母和数字', trigger: 'blur' }
    ],
    verifyPassword: [
        { required: true, message: '密码输入不可以为空', trigger: 'blur' },
        { validator: validatorVerifyPassword, trigger: 'blur' }
    ],
    email: [
        { required: true, message: '请填写邮箱，我们才能回复您', trigger: 'blur' },
        { type: 'email', message: '请输入正确格式的邮箱地址', trigger: ['blur', 'change'] }
    ],
    verifyCode: [
        { required: true, message: '请填写正确的邮箱验证码', trigger: 'blur' }
    ]
}
)


onMounted(() => {
    //预加载查询磁盘容量信息
    requestDiskInfoApi();
});
</script>

<template>
    <div class="personalInfo">
        <el-row :gutter="20" style="height: 50%;">
            <el-col :span="12">
                <el-card>
                    <template #header>
                        <el-text class="cardHeader">修改头像</el-text>
                    </template>
                    <div class="cardBody">
                        <el-upload action="#" :show-file-list="false" drag :http-request="httpAvatarUploade"
                            :before-upload="beforeAvatarUpload" :on-change="avatarUploadeChange">
                            <div class="avatarContainer">
                                <el-avatar :src="avatarFilePath" :size="120">
                                </el-avatar>
                            </div>
                            <transition name="maskingAnime">
                                <div class="imgMasking" v-show="isShowImgMasking">
                                    <el-text class="firstText">拖拽</el-text>
                                    <el-text class="secondText">或</el-text>
                                    <el-button type="success" style="width: 150px;" size="small">浏览</el-button>
                                </div>
                            </transition>
                            <div class="toolMasking" @mouseenter="avatarImgMouseEnter" @mouseout="imgMaskingMouseOut">
                            </div>
                        </el-upload>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="12">
                <el-card>
                    <template #header>
                        <el-text class="cardHeader">重置密码</el-text>
                    </template>
                    <el-form :model="resetPasswordModule" :rules="formRules" ref="resetPasswordRef" label-width="120px">
                        <el-form-item label="原密码" prop="oldPassword">
                            <el-input type="password" size="large" placeholder="原始密码"
                                v-model="resetPasswordModule.oldPassword" clearable show-password></el-input>
                        </el-form-item>
                        <el-form-item label="新密码" prop="newPassword">
                            <el-input type="password" size="large" placeholder="新密码"
                                v-model="resetPasswordModule.newPassword" clearable show-password></el-input>
                        </el-form-item>
                        <el-form-item label="确认密码" prop="verifyPassword">
                            <el-input type="password" size="large" placeholder="确认密码"
                                v-model="resetPasswordModule.verifyPassword" clearable show-password></el-input>
                        </el-form-item>
                        <el-form-item class="formButton">
                            <el-button type="primary" size="large" @click="resetPasswordClick">提交</el-button>
                        </el-form-item>
                    </el-form>
                </el-card>
            </el-col>
        </el-row>
        <el-row :gutter="20" style="height: 30%;">
            <el-col :span="12">
                <el-card>
                    <template #header>
                        <el-text class="cardHeader">重置邮箱</el-text>
                    </template>

                    <el-form :model="resetEmailModule" :rules="formRules" ref="resetEmailRef" label-width="120px">
                        <el-form-item label="新邮箱" prop="email">
                            <el-input size="large" placeholder="请输入新的邮箱地址" v-model="resetEmailModule.email" clearable>
                                <template #append>
                                    <RequestCodeButton :text="'获取验证码'" v-model:enable="enableSenderCodeBtn"
                                        :number="120" :on-sender="senderVerifyCode" />
                                </template>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="验证码" prop="verifyCode">
                            <el-input size="large" placeholder="请输入邮箱验证码" v-model="resetEmailModule.verifyCode"
                                clearable>
                            </el-input>
                        </el-form-item>
                        <el-form-item class="formButton">
                            <el-button type="primary" size="large" @click="resetEmailClick">提交</el-button>
                        </el-form-item>
                    </el-form>
                </el-card>
            </el-col>
            <el-col :span="12">
                <el-card>
                    <template #header>
                        <el-text class="cardHeader">我的容量</el-text>
                    </template>
                    <div class="myStorage">
                        <Progress :currentStorage="diskInfo.usedSpace" :totalStorage="diskInfo.totalSpace"
                            :ratio="diskInfo.ratio" :title="''" />
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<style scoped>
.personalInfo {
    width: 100%;
    height: 100%;
    background-color: transparent;
}

.cardHeader {
    font-size: 18px;
    color: black;
}

.el-row {
    margin-bottom: 20px
}

.el-card {
    height: 100%;
}

:deep(.el-card__body) {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 100%;
}

.imgMasking {
    position: absolute;
    bottom: 0;
    width: 300px;
    height: 160px;
    padding: 24px;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    transition: transform 0.5s;
}

.toolMasking {
    position: absolute;
    bottom: 5.8%;
    width: 300px;
    height: 300px;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999999;
}

.imgMasking .el-text {
    color: white;
}

.imgMasking .firstText {
    font-weight: bold;
    font-size: 20px;
}

.imgMasking .secondText {
    font-weight: lighter;
}

.maskingAnime-enter-active,
.maskingAnime-leave-active {
    transition: all .3s ease;
}

.maskingAnime-enter-from,
.maskingAnime-leave-to {
    opacity: 0;
    transform: translateY(100%);
}

.maskingAnime-leave-to .maskingAnime-leave-from {
    transform: translateY(0);
}

.cardBody {
    position: relative;
    width: 300px;
    height: 300px;
    overflow: hidden;
}

.el-form {
    width: 100%;
    height: 100%;
}

.el-form .el-form-item {
    margin-bottom: 20px;
}

:deep(.el-form-item__label) {
    padding: 0 36px 0 0;
}

.el-form .formButton {
    float: right;
}

.myStorage {
    width: 100%;
    height: 100%;
}

:deep(.el-upload-dragger) {
    padding: 0;
    border: none;
}

.avatarContainer {
    width: 300px;
    height: 300px;
    background-color: #373737;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>