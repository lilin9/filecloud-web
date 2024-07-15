//处理表单校验相关
export default {
    problem: [
        {required: true, message: '请填写您宝贵的意见，您的意见对我们真的很重要', trigger: 'blur'}
    ],
    email: [
        {required: true, message: '请填写邮箱，我们才能回复您', trigger: 'blur'},
        {type: 'email', message: '请输入正确格式的邮箱地址', trigger: ['blur', 'change']}
    ],
    password: [
        {required: true, message: '密码 4 ~ 16 位，不包含特殊字符', trigger: 'blur'},
        {pattern: /^\d{4,16}$/, message: '密码 4 ~ 16 位，不包含特殊字符', trigger: 'blur'}
    ],
}