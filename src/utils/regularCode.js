export default {
    passwordVerify: /^[a-zA-Z0-9]{4,16}$/,  //密码正则
    verifyCodeVerify: /^\d{6}$/,            //验证码正则
    emailVerify: /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/,    //邮箱验证正则
    numLetterVerify: /^(\d+)(\D+)$/, //数字字母正则

    //传入数值字符串，将单位和值分开
    splitValAndUnit(value) {
        const match = value.match(this.numLetterVerify);
        if (match) {
            return {
                number: match[1],
                unit: match[2]
            }
        }
        return null;
    }
}