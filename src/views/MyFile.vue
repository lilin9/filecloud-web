<!-- 我的文件页面 -->
<script setup>
import acceptEventUtils from '@/utils/acceptEventUtils';
import emitEventUtils from '@/utils/emitEventUtils';
import { ArrowRight, HomeFilled, Folder, Files, Picture, PictureFilled } from '@element-plus/icons-vue'
import { getCurrentInstance, onBeforeUnmount, onMounted, ref, toRaw, watch } from 'vue';


const { proxy } = getCurrentInstance();
const api = proxy.$api;
const utils = proxy.$utils;
const emit = defineEmits(["dataForChild"])


//表格是否显示加载动画
const showLoading = ref(false);
//请求后台接口参数
const queryListParams = ref({
  pageIndex: 1,
  pageSize: 10,
  parentId: null
});
//预览图部分需要的数据
const previewImgData = ref({
  showImg: false,
  dataList: []
});
//当前文件页面的父文件数据
const parentRowData = ref(null);



//面包屑列表数据
const breadcrumbList = ref([]);
const pushBreadcrumbList = (row) => {
  breadcrumbList.value.push(row);
}

//面包屑项的点击事件
const breadcrumbItemClick = (fileId, index) => {
  const params = queryListParams.value;
  //记录用户点击的面包项
  parentRowData.value = index == -1 ? "" : breadcrumbList.value[index];
  //pop掉用户点击的项后面的数据
  breadcrumbList.value.splice(index + 1);
  //重新请求表格数据
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
//将 loadFileList 注册进事件总线中
const acceptLoadFileList = (data) => {
  loadFileList(data.pageIndex, data.pageSize, data.parentId);
}



//表格时间格式化
const formatDate = (row, column, cellValue) => {
  return utils.formatDate(cellValue);
}

//表格行被双击事件
const rowDoubleClick = (row, column, event) => {
  const rowData = JSON.parse(JSON.stringify(row));
  //判断当前行是否是文件夹
  if (!rowData.isFolder) {
    //进行非文件夹操作
    FileRowHandler(rowData);
    return;
  }
  //对文件夹进行操作
  FolderRowHandler(row);
}

//对表格文件夹行数据进行处理操作
const FolderRowHandler = (row) => {
  //记录当前行
  parentRowData.value = row;
  //添加面包屑列表
  pushBreadcrumbList(row);
  //查询文件夹内部文件列表
  const params = queryListParams.value;
  loadFileList(params.pageIndex, params.pageSize, row.fileId);
}

//对表格行文件数据进行处理操作
const FileRowHandler = (row) => {
  const previewData = previewImgData.value;
  const dynamicDownloadUrl = row.dynamicDownloadUrl;
  //假如是图片的话，展示预览大图
  if (utils.judgeImg(row.fileMimeType)) {
    previewData.showImg = true;
    previewData.dataList.push(row.dynamicDownloadUrl);
    return;
  }
  //其他就进行文件下载操作
  utils.startDownload(dynamicDownloadUrl);
}

//当前行发生改变事件
const currentChangeHandler = (currentRow, oldRow) => {
  if (currentRow != null) {
    emitEventUtils.emitSelectedTableRow(currentRow);
    emitEventUtils.emitEnableTopOptions(true);
  } else {
    emitEventUtils.emitEnableTopOptions(false);
  }
}



watch(parentRowData, (newVal, oldVal) => {
  //parentRowData 发生变化时，发布事件
  emitEventUtils.emitTableChanged(parentRowData.value);
});

onMounted(() => {
  //将 loadFileList 注册进全局总线
  acceptEventUtils.onLoadFileList(acceptLoadFileList);
  //加载文件列表
  let params = queryListParams.value;
  loadFileList(params.pageIndex, params.pageSize, params.parentId);
});

onBeforeUnmount(() => {
    //销毁事件总线注册事件
    acceptEventUtils.offLoadFileList(acceptLoadFileList);
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
        @click="breadcrumbItemClick(item.fileId, index)">{{ item.fileName }}</el-breadcrumb-item>
    </el-breadcrumb>
    <el-divider />
    <el-table :data="tableData" :row-style="{ height: '65px' }" highlight-current-row
      :header-cell-style="{ backgroundColor: '#fafafa', marginBottom: '15px' }" class="fileTable"
      v-loading="showLoading" @row-dblclick="rowDoubleClick" @current-change="currentChangeHandler">
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
    <el-image-viewer :url-list="previewImgData.dataList" :zoom-rate="1.2" :max-scale="7" :min-scale="0.2"
      v-if="previewImgData.showImg" @close="previewImgData.showImg = false">
      <template #error>
        <div class="image-slot">
          <el-icon>
            <PictureFilled />
          </el-icon>
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