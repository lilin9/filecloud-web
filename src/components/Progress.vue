<!-- 进度条组件 -->
<script setup>
import { toRefs } from 'vue';

const props = defineProps({
    currentStorage: String,
    totalStorage: String,
    ratio: Number,
    title: String,
});

const { currentStorage, totalStorage, ratio, title } = toRefs(props);
</script>
<template>
    <div class="progress">
        <div class="storageTitle">
            <el-text class="left">网盘：{{ currentStorage }}/{{ totalStorage }}</el-text>
            <el-text class="right">{{ title }}</el-text>
        </div>
        <el-progress :percentage="ratio" :show-text="false" />
    </div>
</template>
<style scoped>
.progress {
    width: 100%;
    margin-bottom: 30px;
}

.storageTitle {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 12px;
}

.storageTitle .left,
.storageTitle .right {
    font-size: 12px;
    font-weight: 540;
}

.storageTitle .right {
    color: #409eff;
}
</style>