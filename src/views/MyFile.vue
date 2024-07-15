<!-- 我的文件页面 -->
<script setup>
import { defineEmits } from 'vue';
import { ArrowRight, HomeFilled } from '@element-plus/icons-vue'

const tableData = [
  {
    title: "download.jpg",
    size: "6.10KB",
    updateTime: "9分钟前"
  },
  {
    title: "sublime_text.exe",
    size: "9.43MB",
    updateTime: "9分钟前"
  },
  {
    title: "testChild",
    size: "-",
    updateTime: "8分钟前"
  }
]

const emit = defineEmits(["isSelectedRow"])
//选中行高亮点击事件
const selectedRowClick = (row, column, event) => {
  emit('isSelectedRow', true)
}
</script>

<template>
  <div class="myFile">
    <el-breadcrumb :separator-icon="ArrowRight">
      <el-breadcrumb-item :to="{ path: '/' }" class="breadcrumbItem">
        <el-icon :size="18">
          <HomeFilled />
        </el-icon>
      </el-breadcrumb-item>
      <el-breadcrumb-item class="breadcrumbItem">test1</el-breadcrumb-item>
      <el-breadcrumb-item class="breadcrumbItem">test2</el-breadcrumb-item>
      <el-breadcrumb-item class="breadcrumbItem">test3</el-breadcrumb-item>
    </el-breadcrumb>
    <el-divider />
    <el-table :data="tableData" :row-style="{ height: '65px' }" highlight-current-row @row-click="selectedRowClick"
      :header-cell-style="{ backgroundColor: '#fafafa', marginBottom: '15px' }" class="fileTable">
      <el-table-column prop="title" label="名称" min-width="60%" />
      <el-table-column prop="size" label="大小" min-width="30%" />
      <el-table-column prop="updateTime" label="最后修改" min-width="10%" />
    </el-table>
  </div>
</template>

<style scoped>
.el-icon {
  color: #6f6f6f;
}

.myFile {
  height: 100%;
  width: 100%;
  background-color: transparent;
}

.myFile .el-divider {
  padding: 0;
  margin: 15px 0 0;
  border-color: rgba(0, 0, 0, 0.05);
}

.myFile .tableHeader {
  display: flex;
  flex-direction: row;
  color: #6f6f6f;
  margin-bottom: 15px;
}

.myFile .breadcrumbItem:deep(.el-breadcrumb__inner),
.myFile .breadcrumbItem:deep(.el-breadcrumb__separator) {
  font-size: 18px;
  color: #6f6f6f;
}

.myFile .fileTable:deep(.el-table__body-wrapper) {
  border-left: solid 1px rgba(0, 0, 0, 0.1);
  border-right: solid 1px rgba(0, 0, 0, 0.1);
}

.myFile .el-table {
  font-size: 14px;
}

:deep(.el-table__body tr.current-row>td) {
  background-color: #488ff9 !important;
  color: #FFFFFF;
}
</style>