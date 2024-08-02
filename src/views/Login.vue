<script setup>
import { getCurrentInstance, ref, watch, watchEffect } from 'vue';
import formRules from '@/utils/formRules';
import regularCode from "@/assets/locale/regularCode"
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';

const router = useRouter()
const { proxy } = getCurrentInstance();
const api = proxy.$api;
const local = proxy.$local;

//登录注册切换
let isShowLogin = ref(true)
//验证码按钮文本
let verifyCodeBtnText = ref("获取验证码");
const loginFormRef = ref(null)
const registryFormRef = ref(null)



//用户信息
const userInfo = ref({
  userName: '',
  password: '',
  verifyPassword: '',
  email: '',
  verifyCode: ''
})

//登录点击事件
const loginClick = () => {
  const userData = userInfo.value;
  loginFormRef.value.validate(async (valid) => {
    if (valid) {
      //请求登录接口
      let result = await api.login(userData);
      if (result.success) {
        const user = result.data;
        ElMessage.success(`你好${user.userName}，欢迎登录(*^_^*)`)
        //用户数据存入本地存储
        local.saveToLocal(local.getLoginKey(), user);
        router.push('/home');
      } else {
        ElMessage.error(result.message != '' && result.message != null ? result.message : '用户登录失败，请重试')
      }
    }
  })
}

//注册点击事件
const registerClick = () => {
  const user = userInfo.value;

  //启用表单校验
  registryFormRef.value.validate(async (valid) => {
    if (valid) {
      //对邮箱验证码进行校验
      let result = await api.checkCode(user);
      if (!result.success) {
        ElMessage.error('邮箱验证码校验错误，请重新输入');
        return;
      }

      //用户注册
      result = await api.register(user);
      if (result.success) {
        ElMessage.success("注册成功，请登录");
        isShowLogin.value = true;
      } else {
        ElMessage.error(result.message != '' && result.message != null ? result.message : '注册用户失败，请重试');
      }
    }
  });
}



//验证邮箱合法性，然后禁用或者启用发送验证码按钮
let verifyCodeBtnDisabled = ref(true);
watchEffect(() => {
  var regex = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/;
  var eamil = userInfo.value.email;
  if (eamil != '' && regex.test(eamil)) {
    verifyCodeBtnDisabled.value = false;
  } else {
    verifyCodeBtnDisabled.value = true;
  }
});

//isShowLogin发生变化，将userInfo内容重置
watch(isShowLogin, (newVal, oldVal) => {
  if (newVal != oldVal) {
    userInfo.value = {
      userName: '',
      password: '',
      verifyPassword: '',
      email: '',
      verifyCode: ''
    }
  }
});




//计数器，控制验证码按钮进行 120s 的倒计时计数
let counter = ref(120);
const startCounter = () => {
  verifyCodeBtnText.value = `${counter.value}秒`;
  counter.value--;
  const interval = setInterval(() => {
    if (counter.value > 0) {
      verifyCodeBtnText.value = `${counter.value}秒`;
      counter.value--;
    } else {
      clearInterval(interval);
    }
  }, 1000);
}

//定时器，定时120s
const startTimer = () => {
  verifyCodeBtnDisabled.value = true;
  startCounter();

  setTimeout(() => {
    verifyCodeBtnText.value = "获取验证码";
    verifyCodeBtnDisabled.value = false;
  }, 2 * 60 * 1000);
}

//获取验证码
const getVerifyCodeClick = async () => {
  let user = userInfo.value;
  if (user.email == '') {
    ElMessage.warning("请输入邮箱");
    return;
  }

  //将获取验证码按钮，改为一个120秒内禁止点击并且进行倒计时的按钮
  startTimer();
  let result = await api.senderCode(user.email);
  if (!result.success) {
    ElMessage.error("验证码发送失败，请点击重新获取");
  }
}





//表单验证
const passwordVerify = regularCode.passwordVerify;
const validatorVerifyPassword = (rule, value, callback) => {
  if (!passwordVerify.test(value)) {
    callback(new Error("密码 4 ~ 16 位，不包含特殊字符"))
  } else if (value != userInfo.value.password) {
    callback(new Error("登录密码和再次输入的密码不一致"))
  } else {
    callback()
  }
}
let registryFormRules = { ...formRules }
registryFormRules.verifyPassword = [
  { required: true, message: '登录密码不可以为空', trigger: 'blur' },
  { validator: validatorVerifyPassword, trigger: 'blur' }
]
</script>

<template>
  <div class="login">
    <div class="loginNest">
      <div class="title">
        <el-image src="/static/images/logo.png" class="logoImg"></el-image>
        <el-text v-if="isShowLogin">兜兜网盘</el-text>
        <el-text v-else>欢迎注册</el-text>
      </div>
      <div class="container">
        <!-- 登录 -->
        <div class="containerContent" v-if="isShowLogin">
          <el-form :model="userInfo" :rules="formRules" ref="loginFormRef">
            <el-form-item prop="email">
              <el-input size="large" v-model="userInfo.email" placeholder="请输入邮箱" clearable></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input type="password" size="large" v-model="userInfo.password" placeholder="请输入登录密码"
                clearable></el-input>
            </el-form-item>
            <el-form-item class="loginOrRegisterItem">
              <el-button type="primary" size="large" @click="loginClick">登录</el-button>
            </el-form-item>
          </el-form>
          <div class="buttomButton">
            <el-button link size="small">忘记密码</el-button>
            <el-button link size="small" @click="isShowLogin = false">免费注册</el-button>
          </div>
        </div>

        <!-- 注册 -->
        <div class="containerContent" v-else>
          <el-form :model="userInfo" :rules="registryFormRules" ref="registryFormRef">
            <el-form-item prop="userName">
              <el-input size="large" v-model="userInfo.userName" placeholder="用户名" clearable></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input type="password" size="large" v-model="userInfo.password" placeholder="请设置你的登录密码"
                clearable></el-input>
            </el-form-item>
            <el-form-item prop="verifyPassword">
              <el-input type="password" size="large" v-model="userInfo.verifyPassword" placeholder="请再次输入你的登录密码"
                clearable></el-input>
            </el-form-item>
            <el-form-item prop="email">
              <el-input size="large" v-model="userInfo.email" placeholder="请输入邮箱地址" clearable>
                <template #append>
                  <el-button @click="getVerifyCodeClick" :disabled="verifyCodeBtnDisabled">{{ verifyCodeBtnText
                    }}</el-button>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item prop="verifyCode">
              <el-input size="large" v-model="userInfo.verifyCode" placeholder="请输入邮箱验证码" clearable></el-input>
            </el-form-item>
            <el-form-item class="loginOrRegisterItem">
              <el-button type="primary" size="large" @click="registerClick">注册</el-button>
            </el-form-item>
          </el-form>
          <div class="buttomButton">
            <el-button link size="small"></el-button>
            <el-button link size="small" @click="isShowLogin = true">>>前往登录</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login {
  height: calc(100vh);
  width: calc(100vw);
  background-color: #fafafa;
}

.loginNest {
  height: auto;
  width: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 60px;
}

.title {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.logoImg {
  width: 64px;
  height: 64px;
}

.title .el-text {
  color: #2c3e50;
  font-weight: bold;
  font-size: 2.5em;
}

.containerContent {
  width: 420px;
  height: auto;
  margin: 45px;
  padding: 35px 35px 15px 35px;
  box-shadow: 0 0 25px #909399;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: transparent;
}

.el-form {
  width: 100%;
  height: 100%;
}

.el-form .el-form-item {
  margin-bottom: 20px;
}

.el-form .el-input {
  background-color: #ffffff;
}

.loginOrRegisterItem .el-button {
  width: 100%;
}

.buttomButton {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 8px 0;
}

.buttomButton .el-button {
  color: #9b9ea0;
}

:deep(.el-input-group__append) {
  background-color: #ffffff;
  color: gray;
}

:deep(.el-input-group__append:hover) {
  background-color: rgba(72, 143, 249, 0.1);
  color: #488ff9;
}
</style>