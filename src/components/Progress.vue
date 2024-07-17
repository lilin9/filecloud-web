<!-- 进度条组件 -->
<template>
    <div class="progress">
        <div class="storageTitle">
            <el-text class="left">网盘：{{ props.currentStorage }}/{{props.totalStorage }}</el-text>
            <el-text class="right">{{ props.title }}</el-text>
        </div>
        <el-progress :percentage="50" :show-text="false" />
    </div>
</template>
<script setup>

const props = defineProps({
    currentStorage: String,
    totalStorage: String,
    title: String
})
</script>
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