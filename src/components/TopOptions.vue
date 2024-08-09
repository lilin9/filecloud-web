<script setup>
import acceptEventUtils from '@/utils/acceptEventUtils';
import emitEventUtils from '@/utils/emitEventUtils';
import { Edit, DocumentCopy, Share, DocumentRemove, DeleteFilled, InfoFilled, UploadFilled, WarningFilled } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus';
import { getCurrentInstance, markRaw, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import SingleInputDialog from './common/SingleInputDialog.vue';


const { proxy } = getCurrentInstance();
const api = proxy.$api;
const local = proxy.$local;


const uploadRef = ref(null);
//是否启用头部功能选项
const enableTopOptions = ref(false);
//是否启用分享选项
const enableShareOption = ref(enableTopOptions.value);
//父文件夹行数据
const parentRowData = ref(null);
//表格选中的当前行数据
const selectedTableRow = ref({});
//从本地存储拿取用户数据
const userInfo = ref(local.FindForLocal(local.getLoginKey()));



//从全局事件中接收表格点击选中的当前行
const receiveSelectedTableRow = (data) => {
    selectedTableRow.value = data;
}


//上传按钮的加载状态
const uploadLoding = ref(false);
//需要上传的文件
const uploadFileData = ref({});
//文件上传之前
const fileBeforeUpload = (file) => {
    //限制上传大小不能大于 1G
    const mbFileSize = file.size / 1024 / 1024;
    if (mbFileSize > 1024) {
        ElMessage.warning("文件大小不能超过 1G");
        return false;
    }
    return true;
}
//文件上传，上传的文件发生变化时触发
const fileChangeHandler = (uploadFile) => {
    uploadFileData.value = uploadFile.raw;
}
//文件的网络请求
const fileHttpRequest = (opt) => {
    uploadLoding.value = true;

    const parentData = parentRowData.value;
    const parentId = !parentData.fileId ? ' ' : parentData.fileId;

    const formData = new FormData();
    formData.append('file', uploadFileData.value);
    uploadRequest(parentId, formData);

    uploadLoding.value = false;
}
//请求文件上传的后端接口
const uploadRequest = async (parentId, file) => {
    const params = { parentId, file };
    const result = await api.upload(params);

    if (result.success) {
        //重新加载文件列表
        emitEventUtils.emitLoadFileList({ pageIndex: 1, pageSize: 10, parentId });
        ElMessage.success('上传文件成功');
    } else {
        ElMessage.error('上传文件失败，请重试');
    }
}



//接收显示头部选项按钮值
const enableTopOptionsHandler = (val) => {
    enableTopOptions.value = val;
}
//接收当前文件的父文件数据
const parentRowDataHandler = (val) => {
    parentRowData.value = val;
}



//修改按钮加载状态
const editLoding = ref(false);
//显示名称修改弹出框
const enableRenameDialog = ref(false);
//文件的重置名
const resetFileModel = ref({ fileId: '', fileName: '' })
//打开重置文件名弹出框点击事件
const enableRenameDialogClick = () => {
    const resetFile = resetFileModel.value;
    const selectedRow = selectedTableRow.value;

    enableRenameDialog.value = true;
    resetFile.fileId = selectedRow.fileId;
    resetFile.fileName = selectedRow.fileName;
}
//重置文件名确认点击事件
const resetFileNameClick = async () => {
    editLoding.value = true;

    const resetFile = resetFileModel.value;
    const result = await api.renameFile(resetFile);
    if (result.success) {
        enableRenameDialog.value = false;
        ElMessage.success('重命名文件成功');
        emitEventUtils.emitLoadFileList({ pageIndex: 1, pageSize: 10, parentId: parentRowData.value.fileId });
    } else {
        ElMessage.error('重命名文件失败，请重试');
    }

    editLoding.value = false;
}



//删除按钮加载状态
const deleteLoading = ref(false);
//文件删除图标点击事件
const deleteFileClick = () => {
    deleteLoading.value = true;

    ElMessageBox.confirm(
        '你确认要删除此文件/文件夹吗?',
        '警告',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'Warning',
            icon: markRaw(DeleteFilled),
            center: true
        }
    ).then(() => {
        const selectedRow = selectedTableRow.value;
        requestDeleteApi(selectedRow);
    }).catch(action => {
        console.log(action);
    });

    deleteLoading.value = false;
}
//请求删除接口
const requestDeleteApi = async (deleteRow) => {
    if (!deleteRow) { return; }

    const parentRow = parentRowData.value;
    const result = await api.deleteFile(deleteRow);
    if (result.success) {
        emitEventUtils.emitLoadFileList({ pageInde: 1, pageSize: 10, parentId: parentRow.fileId });
        ElMessage.success('删除文件/文件夹成功');
    } else {
        ElMessage.error('删除文件/文件夹失败，请重试');
    }
}



//分享图标点击事件
const shareClick = () => {
    //获取分享链接
    const selectedRow = selectedTableRow.value;
    const daynamicUrlStr = selectedRow.dynamicDownloadUrl;
    //将链接复制进剪切板
    navigator.clipboard.writeText(daynamicUrlStr).then(() => {
        ElMessage.success("分享链接已复制到剪贴板");
    }).catch(err => {
        ElMessage.error('获取分享链接失败，请重试');
    });
}



//其他信息按钮点击事件
const otherInfoClick = () => {
    let msg = '';
    const now = new Date();
    const hours = now.getHours();
    const userName = userInfo.value.userName;

    if (6 <= hours <= 10) {
        msg = `上午好，${userName}! (●'◡'●)`;
    } else if (11 <= hours <= 12) {
        msg = `中午好，${userName}! (●'◡'●)`;
    } else if (13 <= hours <= 18) {
        msg = `下午好，${userName}! (●'◡'●)`;
    } else if (19 <= hours <= 24) {
        msg = `晚上好，${userName}! (●'◡'●)`;
    } else if (1 <= hours <= 5) {
        msg = `夜深了，${userName}该睡觉了! (●'◡'●)`;
    } else {
        msg = `你好，${userName}! (●'◡'●)`;
    }

    if (msg) {
        ElMessage.success(msg);
    }
}



//监控用户选中的表格行，假如选中的是文件夹，将分享按钮给禁用掉
watch(selectedTableRow, newValue => {
    if (newValue.isFolder) {
        enableShareOption.value = false;
    } else {
        enableShareOption.value = true;
    }
});


onMounted(() => {
    acceptEventUtils.onEnableTopOptions(enableTopOptionsHandler);
    acceptEventUtils.onParentRowData(parentRowDataHandler);
    acceptEventUtils.onSelectedTableRow(receiveSelectedTableRow);
});

onBeforeUnmount(() => {
    acceptEventUtils.offEnableTopOptions(enableTopOptionsHandler);
    acceptEventUtils.offParentRowData(parentRowDataHandler);
    acceptEventUtils.offSelectedTableRow(receiveSelectedTableRow);
});
</script>

<template>
    <div class="topOption" style="height: 70px;">
        <!-- 分享 -->
        <el-button type="primary" link circle :disabled="!enableShareOption" @click="shareClick">
            <template #icon>
                <el-icon :size="24">
                    <Share />
                </el-icon>
            </template>
        </el-button>
        <!-- 编辑 -->
        <el-button type="primary" link circle :disabled="!enableTopOptions" :loading="editLoding"
            @click="enableRenameDialogClick">
            <template #icon>
                <el-icon :size="24">
                    <Edit />
                </el-icon>
            </template>
        </el-button>
        <!-- 复制 -->
        <!-- <el-button type="primary" link circle :disabled="!enableTopOptions">
            <template #icon>
                <el-icon :size="24">
                    <DocumentCopy />
                </el-icon>
            </template>
        </el-button> -->
        <!-- 移动 -->
        <!-- <el-button type="primary" link circle :disabled="!enableTopOptions">
            <template #icon>
                <el-icon :size="24">
                    <DocumentRemove />
                </el-icon>
            </template>
        </el-button> -->
        <!-- 删除 -->
        <el-button type="primary" link circle :disabled="!enableTopOptions" :loading="deleteLoading"
            @click="deleteFileClick">
            <template #icon>
                <el-icon :size="24">
                    <DeleteFilled />
                </el-icon>
            </template>
        </el-button>
        <!-- 其他信息 -->
        <el-button type="primary" link circle @click="otherInfoClick">
            <template #icon>
                <el-icon :size="24">
                    <InfoFilled />
                </el-icon>
            </template>
        </el-button>
        <!-- 上传 -->
        <el-upload ref="uploadRef" action="#" :show-file-list="false" :limit="1" :before-upload="fileBeforeUpload"
            :http-request="fileHttpRequest" :on-change="fileChangeHandler">
            <el-button type="primary" link circle :loading="uploadLoding">
                <template #icon>
                    <el-icon :size="24">
                        <UploadFilled />
                    </el-icon>
                </template>
            </el-button>
        </el-upload>
    </div>

    <SingleInputDialog :title="'重命名'" :label="'请输入新名称'" :warning="'请输入文件名称'" v-model:enable="enableRenameDialog"
        v-model:model-value="resetFileModel.fileName" :on-sure="resetFileNameClick" />
</template>

<style scoped>
.topOption {
    display: flex;
    align-items: center;
}

.topOption .el-icon {
    color: #546e7a;
}

.topOption .el-button.is-circle {
    padding: 18px;
    height: 45px;
    width: 45px;
}

.topOption .el-button+.el-button {
    margin: 0;
}

.topOption .el-button:hover {
    background-color: rgba(0, 0, 0, 0.1) !important;
}
</style>