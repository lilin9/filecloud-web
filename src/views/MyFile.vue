<!-- 我的文件页面 -->
<script setup>
import { ArrowRight, HomeFilled, Folder, Files, Picture,PictureFilled } from '@element-plus/icons-vue'
import { getCurrentInstance, onMounted, ref } from 'vue';

const { proxy } = getCurrentInstance();
const emit = defineEmits(["dataByChild"])
const api = proxy.$api;
const utils = proxy.$utils;

//表格是否显示加载动画
const showLoading = ref(false);
//请求后台接口参数
const tableListParams = ref({
  pageIndex: 1,
  pageSize: 10,
  parentId: null
});
//预览图部分需要的数据
const previewImgData = ref({
  showImg: false,
  dataList: []
});



//面包屑列表数据
const breadcrumbList = ref([]);
const pushBreadcrumbList = (text, fileId) => {
  breadcrumbList.value.push({ text, fileId });
}

//面包屑项的点击事件
const breadcrumbItemClick = (fileId, index) => {
  const params = tableListParams.value;
  breadcrumbList.value.splice(index + 1);
  loadFileList(params.pageIndex, params.pageSize, fileId);
}



//表格数据
const tableData = ref([]);
//请求文件列表
const loadFileList = async (pageIndex, pageSize, parentId) => {
  showLoading.value = true;

  const params = { pageIndex, pageSize, parentId };
  const result = await api.searchList(params);
  if (result.success) {
    tableData.value = result.data;
  }

  showLoading.value = false;
}



//表格时间格式化
const formatDate = (row, column, cellValue) => {
  return utils.formatDate(cellValue);
}

//选中行高亮点击事件
const selectedRowClick = (row, column, event) => {
  emit('dataByChild', { showTopItem: true })
}

//表格行被双击事件
const rowDoubleClick = (row, column, event) => {
  const rowData = JSON.parse(JSON.stringify(row));
  //判断当前行是否是文件夹
  //不是文件夹不进行查询操作
  if (!rowData.isFolder) {
    //进行非文件夹操作
    RowDataHandler(rowData);
    return;
  }

  //添加面包屑列表
  pushBreadcrumbList(row.fileName, row.fileId);
  //查询文件夹内部文件列表
  const params = tableListParams.value;
  loadFileList(params.pageIndex, params.pageSize, rowData.fileId);
}

//对表格行数据进行处理操作
const RowDataHandler = (row) => {
  const previewData = previewImgData.value;
  const staticDownloadUrl = row.staticDownloadUrl;
  //假如是图片的话，展示预览大图
  if (utils.judgeImg(row.fileMimeType)) {
    previewData.showImg = true;
    previewData.dataList.push(row.dynamicDownloadUrl);
    return;
  }
  //其他就进行文件下载操作
  utils.startDownload(row.dynamicDownloadUrl);
}



onMounted(() => {
  //加载文件列表
  let params = tableListParams.value;
  loadFileList(params.pageIndex, params.pageSize, params.parentId);
});
</script>

<template>
  <div class="myFile">
    <el-breadcrumb :separator-icon="ArrowRight">
      <el-breadcrumb-item :to="{ path: '/' }" class="breadcrumbItem" @click="breadcrumbItemClick(null, -1)">
        <el-icon :size="18">
          <HomeFilled />
        </el-icon>
      </el-breadcrumb-item>
      <el-breadcrumb-item class="breadcrumbItem" v-for="(item, index) in breadcrumbList" :key="item.fileId"
        @click="breadcrumbItemClick(item.fileId, index)">{{ item.text }}</el-breadcrumb-item>
    </el-breadcrumb>
    <el-divider />
    <el-table :data="tableData" :row-style="{ height: '65px' }" highlight-current-row @row-click="selectedRowClick"
      :header-cell-style="{ backgroundColor: '#fafafa', marginBottom: '15px' }" class="fileTable"
      v-loading="showLoading" @row-dblclick="rowDoubleClick">
      <el-table-column label="名称" min-width="95%">
        <template #default="scope">
          <div class="table-fileName">
            <Folder v-if="scope.row.isFolder" style="width: 2.3em;height: 2.3em;margin: 0 10px;" />
            <Picture v-else-if="utils.judgeImg(scope.row.fileMimeType)"
              style="width: 2.3em;height: 2.3em;margin: 0 10px;" />
            <Files v-else style="width: 2.3em;height: 2.3em;margin: 0 10px;" />
            <span>{{ scope.row.fileName }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="大小">
        <template #default="scope">
          <span v-if="scope.row.fileSize.value == 0">–</span>
          <span v-else>{{ scope.row.fileSize.value }}{{ scope.row.fileSize.unit }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="updateTime" label="最后修改" :formatter="formatDate" />
    </el-table>

    <!-- 预览大图部分 -->
    <el-image-viewer :url-list="previewImgData.dataList" :zoom-rate="1.2" :max-scale="7" :min-scale="0.2" v-if="previewImgData.showImg"
      @close="previewImgData.showImg = false">
      <template #error>
        <div class="image-slot">
          <el-icon><PictureFilled /></el-icon>
        </div>
      </template>
    </el-image-viewer>
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

.table-fileName {
  display: flex;
  flex-direction: row;
}

:deep(.el-breadcrumb__inner),
:deep(tr.el-table__row) {
  cursor: pointer !important;
}
</style>