<!-- 请求按钮 -->
<script setup>
import { ref, toRef, toRefs, watch } from 'vue';

const props = defineProps({
    text: { type: String, required: true },
    onSender: { type: Function, require: true },
    number: { type: Number, require: false, default: 120 },
    enable: { type: Boolean, require: true, default: false },
});
const { text, onSender, number } = toRefs(props);


//按钮文本
let buttonText = ref(text.value);
//计数器
const counter = () => {
    let count = ref(number.value);
    buttonText.value = `${count.value}秒`;
    const interval = setInterval(() => {
        if (count.value > 0) {
            count.value--;
            buttonText.value = `${count.value}秒`;
        } else {
            clearInterval(interval);
        }
    }, 1000);
}
//定时器
const timer = () => {
    setTimeout(() => {
        buttonText.value = text.value;
        enable.value = true;
    }, number.value * 1000);
}


//倒计时事件
const timerHandler = () => {
    enable.value = false;
    //设置计数器部分代码
    counter();
    //设置定时器
    timer();
}
//倒计时点击事件
const countdownClick = async () => {
    //开始倒计时
    timerHandler();
    //发送验证码
    onSender.value();
}

//设置父子双向绑定属性
const emit = defineEmits(['update:enable']);
const enable = ref(props.enable);

watch(() => props.enable, newValue => {
    enable.value = newValue;
});
watch(enable, newValue => {
    emit('update:enable', newValue);
});
</script>

<template>
    <div>
        <el-button @click="countdownClick" :disabled="!enable">{{ buttonText }}</el-button>
    </div>
</template>

<style scoped></style>