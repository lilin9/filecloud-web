//处理表单校验相关
import regularCode from "@/assets/locale/regularCode"

const passwordVerify = regularCode.passwordVerify
const verifyCodeVerify = regularCode.verifyCodeVerify

export default {
    problem: [
        {required: true, message: '请填写您宝贵的意见，您的意见对我们真的很重要', trigger: 'blur'}
    ],
    email: [
        {required: true, message: '邮箱不可以为空', trigger: 'blur'},
        {type: 'email', message: '请输入正确格式的邮箱地址', trigger: ['blur', 'change']}
    ],
    password: [
        {required: true, message: '登录密码不可以为空', trigger: 'blur'},
        {pattern: passwordVerify, message: '密码 4 ~ 16 位，不包含特殊字符', trigger: ['blur', 'change']}
    ],
    verifyCode: [
        {required: true, message: '验证码不可以为空', trigger: 'blur'},
        {pattern: verifyCodeVerify, message: '验证码格式错误，请重新输入', trigger: ['blur', 'change']}
    ],
    userName: [
        {required: true, message: '用户名不可以为空', trigger: 'blur'},
    ]
}