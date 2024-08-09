<script setup>
import { reactive, toRefs, ref, watch } from 'vue';

const props = defineProps({
    title: { type: String, required: true },
    label: { type: String, required: true },
    enable: { type: Boolean, required: true },
    warning: { type: String, required: false, default: '请输入有效值' },
    modelValue: { type: String, required: true, default: '' },
    width: { type: Number, required: false, default: 420 },
    onSure: { type: Function, required: true }
});
const { title, label, warning, width, onSure } = toRefs(props);

const formRules = reactive({
    inputValue: [
        { required: true, message: warning, trigger: 'blur' },
    ]
});

const formRef = ref(null);

const sureClick = () => {
    formRef.value.validate(valid => {
        if (valid) {
            onSure.value();
        }
    });
}

//监控 input 的变化，如果被修改，向父组件发出通知
const emit = defineEmits(['update:modelValue', 'update:enable']);
const inputValue = ref(props.modelValue);
const enable = ref(props.enable);
const formModel = ref({ inputValue });

watch(() => props.modelValue, newValue => {
    inputValue.value = newValue;
});
watch(inputValue, newValue => {
    emit('update:modelValue', newValue);
});


watch(() => props.enable, newValue => {
    enable.value = newValue;
});
watch(enable, newValue => {
    emit('update:enable', newValue);
});
</script>

<template>
    <el-dialog v-model="enable" :title="title" :width="width + 'px'" align-center>
        <el-form ref="formRef" :model="formModel" :rules="formRules" label-width="auto" label-position="top"
            hide-required-asterisk class="dialogForm">
            <el-form-item :label="label" prop="inputValue">
                <el-input v-model="inputValue" style="width:100%; height: 40px;" clearable></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="enable = false; inputValue='';">取消</el-button>
                <el-button type="primary" @click="sureClick">确认</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<style scoped></style>