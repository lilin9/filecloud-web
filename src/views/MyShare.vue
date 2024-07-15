<!-- 我的分享页面 -->
<script setup>
import { Link, Remove } from '@element-plus/icons-vue'
import { ref } from 'vue';

//表格数据
const tableData = ref([
    {
        isShare: '分享已过期',
        verifyCode: '12345',
        validityTime: '已过期',
        browseCount: '0',
        downloadCount: '0',
        shareTime: '2024-07-11 10:05:18'
    }
]);


const handleSizeChange = (val) => {
    console.log(`每页 ${val} 条`)
}
const handleCurrentChange = (val) => {
    console.log(`当前页: ${val}`)
}
</script>

<template>
    <div class="myShare">
        <div class="buttonGroup">
            <el-button :icon="Link" type="primary" size="large" round disabled>复制链接</el-button>
            <el-button :icon="Remove" type="primary" size="large" round disabled>取消分享</el-button>
        </div>
        <div class="shareTable">
            <div class="tableTitle"><el-text>分享列表信息</el-text></div>
            <el-table :data="tableData" :row-style="{ height: '65px' }" table-layout="auto">
                <el-table-column type="selection" width="55" />
                <el-table-column prop="isShare" label="分享文件" min-width="30%"/>
                <el-table-column prop="verifyCode" label="提取码" min-width="10%"/>
                <el-table-column prop="validityTime" label="有效期" min-width="10%"/>
                <el-table-column prop="browseCount" label="浏览量" min-width="10%"/>
                <el-table-column prop="downloadCount" label="下载量" min-width="10%"/>
                <el-table-column prop="shareTime" label="分享时间" min-width="10%"/>
                <el-table-column label="操作" min-width="20%">
                    <template #default>
                        <el-button :icon="Link" type="primary" size="small" plain>复制链接</el-button>
                        <el-button :icon="Remove" type="danger" size="small" plain>取消分享</el-button>
                    </template> 
                </el-table-column>
            </el-table>
            <el-pagination
            :current-page="1"
            :page-sizes="[10,20,30,40,50,100]"
            :page-size="10"
            layout="sizes, prev, pager, next, total"
            :total="1"
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            />
        </div>
    </div>
</template>

<style scoped>
.shareTable {
    border: 1px solid rgba(0, 0, 0, 0.1);
    background-color: white;
    margin-top: 20px;
    padding: 0 20px 20px;
}
.el-table {
    background-color: transparent;
}
.tableTitle {
    width: 100%;
    height: 65px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}
.tableTitle .el-text {
    line-height: 65px;
    font-size: 18px;
}
.buttonGroup .el-button:first-of-type {
    margin-right: 10px;
}

.buttonGroup .el-button:last-of-type {
    margin-left: 10px;
}

:deep(.el-pagination>.is-first),
:deep(.el-select__wrapper) {
    width: 110px;
}
:deep(.el-pagination>.is-last) {
    margin-right: 10px;
    margin-left: auto;
}
:deep(.el-table__footer), 
:deep(.el-table__header) {
    height: 65px;
}
.el-pagination {
    margin-top: 20px;
}
</style> 