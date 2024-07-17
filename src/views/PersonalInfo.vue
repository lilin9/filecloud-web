<!-- 个人中心页面 -->
<script setup>
import { onMounted, ref } from 'vue';
import Progress from '../components/Progress.vue'
import regularCode from '@/assets/locale/regularCode';

let isShowImgMasking = ref(false)
//头像鼠标移入事件
const avatarImgMouseEnter = () => {
    isShowImgMasking.value = true;
}
//蒙版鼠标移出事件
const imgMaskingMouseOut = () => {
    isShowImgMasking.value = false;
}


//密码重置
let resetPassword = ref({
    oldPassword: '',
    newPassword: '',
    verifyPassword: ''
})

//邮箱重置
let resetEmail = ref({
    newEmail:'',
    verifyCode: ''
})



//表单验证
const passwordVerify = regularCode.passwordVerify;
const validatorVerifyPassword = (rule, value, callback) => {
    console.log(passwordVerify.test(value));
    if (!passwordVerify.test(value)) {
        callback(new Error("密码 4 ~ 16 位，不包含特殊字符"))
    } else if (value != resetPassword.value.newPassword) {
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
    newEmail: [
        {required: true, message: '请填写邮箱，我们才能回复您', trigger: 'blur'},
        {type: 'email', message: '请输入正确格式的邮箱地址', trigger: ['blur', 'change']}
    ],
    verifyCode: [
        {required:true, message: '请填写正确的邮箱验证码', trigger: 'blur'}
    ]
}
)
const resetFormRef = ref(null)
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
                        <el-image
                            src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
                            style="width: 300px; height: 300px;">
                        </el-image>
                        <transition name="maskingAnime">
                            <div class="imgMasking" v-show="isShowImgMasking">
                                <el-text class="firstText">拖拽</el-text>
                                <el-text class="secondText">或</el-text>
                                <el-button type="success" style="width: 150px;" size="small">浏览</el-button>
                            </div>
                        </transition>
                        <div class="toolMasking" @mouseenter="avatarImgMouseEnter" @mouseout="imgMaskingMouseOut"></div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="12">
                <el-card>
                    <template #header>
                        <el-text class="cardHeader">重置密码</el-text>
                    </template>
                    <el-form :model="resetPassword" :rules="formRules" ref="resetFormRef" label-width="120px">
                        <el-form-item label="原密码" prop="oldPassword">
                            <el-input type="password" size="large" placeholder="原始密码"
                                v-model="resetPassword.oldPassword" clearable show-password></el-input>
                        </el-form-item>
                        <el-form-item label="新密码" prop="newPassword">
                            <el-input type="password" size="large" placeholder="新密码" v-model="resetPassword.newPassword"
                                clearable show-password></el-input>
                        </el-form-item>
                        <el-form-item label="确认密码" prop="verifyPassword">
                            <el-input type="password" size="large" placeholder="确认密码"
                                v-model="resetPassword.verifyPassword" clearable show-password></el-input>
                        </el-form-item>
                        <el-form-item class="formButton">
                            <el-button type="primary" size="large">提交</el-button>
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
                    
                    <el-form :model="resetEmail" :rules="formRules" ref="resetFormRef" label-width="120px">
                        <el-form-item label="新邮箱" prop="newEmail">
                            <el-input size="large" placeholder="请输入新的邮箱地址"
                                v-model="resetEmail.newEmail" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="验证码" prop="verifyCode">
                            <el-input size="large" placeholder="请输入邮箱验证码"
                                v-model="resetEmail.verifyCode" clearable></el-input>
                        </el-form-item>
                        <el-form-item class="formButton">
                            <el-button type="primary" size="large">提交</el-button>
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
                        <Progress :currentStorage="'9.44MB'" :totalStorage="'100GB'" :title="'网盘扩容'"/>
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
</style>