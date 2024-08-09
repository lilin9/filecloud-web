<script setup>
import { getCurrentInstance, onBeforeUnmount, onMounted, ref } from 'vue';
import formRules from "@/utils/formRules";
import { ElMessage, ElMessageBox } from "element-plus";
import { Folder, FolderAdd, Share, ChatLineRound, Setting, SwitchButton } from '@element-plus/icons-vue'
import router from '@/router';
import acceptEventUtils from '@/utils/acceptEventUtils';
import emitEventUtils from '@/utils/emitEventUtils';
import SingleInputDialog from './common/SingleInputDialog.vue';


const { proxy } = getCurrentInstance();
const api = proxy.$api;
const local = proxy.$local;


const parentRowData = ref({});
//从本地存储拿取用户数据
const userInfo = ref(local.FindForLocal(local.getLoginKey()));
//用户头像文件路径
const avatarFilePath = ref(userInfo.value.onlineAvatar);


const problemFormRef = ref(null)
//是否显示问题反馈对话框
let problemDialogVisible = ref(false)
//反馈的问题
let problemForm = ref({
    problem: '',
    email: ''
})



//新建目录输入框
const newFolderForm = ref({ newFolderName: '' });
//是否显示新建文件夹对话框
const newFolderDialogVisible = ref(false);
//确定新建目录点击事件
const createFolderClick = async () => {
    const parentRow = parentRowData.value;

    const parentId = !parentRow.fileId ? ' ' : parentRow.fileId;
    const newFolder = newFolderForm.value;

    //请求后端接口
    const result = await api.createFolder(parentId, newFolder.newFolderName);
    if (result.success) {
        newFolderDialogVisible.value = false;
        ElMessage.success('新建文件夹成功');
        emitEventUtils.emitLoadFileList({ pageIndex: 1, pageSize: 10, parentId });
    } else {
        ElMessage.error('新建文件夹失败，请重试');
    }

    //清空 newFolderForm
    newFolderForm.value = {};
}



//退出登录点击事件
const logoutClick = () => {
    ElMessageBox.confirm(
        '你确认要登出系统吗?',
        '提示',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'Warning',
            center: true
        }
    ).then(() => {
        local.DeleteForLocal(local.getLoginKey());  //清除本地缓存
        router.push('/login');
    });
}


//接收当前文件的父文件数据
const parentRowDataHandler = (val) => {
    parentRowData.value = val;
}

onMounted(() => {
    acceptEventUtils.onParentRowData(parentRowDataHandler);
});

onBeforeUnmount(() => {
    acceptEventUtils.offParentRowData(parentRowDataHandler);
});
</script>

<template>
    <div class="leftAside">
        <div class="top">
            <router-link to="/home/myFile">
                <el-button>
                    <span class="buttonContent">
                        <el-icon :size="26">
                            <Folder />
                        </el-icon>
                        <el-text>我的文件</el-text>
                    </span>
                </el-button>
            </router-link>
            <el-button @click="newFolderDialogVisible = true">
                <span class="buttonContent">
                    <el-icon :size="26">
                        <FolderAdd />
                    </el-icon>
                    <el-text>新建文件夹</el-text>
                </span>
            </el-button>
            <el-divider />
            <!-- <router-link to="/home/myShare">
            <el-button>
                <span class="buttonContent">
                    <el-icon :size="26">
                        <Share />
                    </el-icon>
                    <el-text>我的分享</el-text>
                </span>
            </el-button>
        </router-link>
        <el-button @click="problemDialogVisible = true">
            <span class="buttonContent">
                <el-icon :size="26">
                    <ChatLineRound />
                </el-icon>
                <el-text>问题反馈</el-text>
            </span>
        </el-button>
        <el-divider /> -->
            <router-link to="/home/personalInfo">
                <el-button>
                    <span class="buttonContent">
                        <el-icon :size="26">
                            <Setting />
                        </el-icon>
                        <el-text>个人中心</el-text>
                    </span>
                </el-button>
            </router-link>
            <el-button @click="logoutClick">
                <span class="buttonContent">
                    <el-icon :size="26">
                        <SwitchButton />
                    </el-icon>
                    <el-text>登出</el-text>
                </span>
            </el-button>
        </div>
        <div class="bottom">
            <el-avatar :src="avatarFilePath" :size="45">
                <img src="/static/images/default.jpg" alt="" />
            </el-avatar>
            <el-text>{{ userInfo.userName }}</el-text>
        </div>
    </div>

    <!-- 新建目录弹出框 -->
    <SingleInputDialog :title="'新建文件夹'" :label="'输入新文件夹名称'" :warning="'请输入文件夹名称'"
        v-model:enable="newFolderDialogVisible" v-model:model-value="newFolderForm.newFolderName"
        :on-sure="createFolderClick" />

    <!-- 问题反馈弹出框 -->
    <el-dialog class="problemDialog" v-model="problemDialogVisible" title="意见与反馈" width="50%" align-center>
        <el-form :model="problemForm" :rules="formRules" ref="problemFormRef" label-width="auto" label-position="top"
            class="dialogForm">
            <el-form-item label="意见与问题" prop="problem">
                <el-input v-model="problemForm.problem" type="textarea" placeholder="您可以向我们提出一些疑问或者建设性意见" clearable
                    :autosize="{ minRows: 4 }"></el-input>
            </el-form-item>
            <el-form-item label="电子邮箱" prop="email">
                <el-input v-model="problemForm.email" type="email" placeholder="请填写您的邮箱，以便我们向您回复" size="large"
                    clearable></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button type="primary" @click="problemDialogVisible = false">确认</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<style scoped>
.leftAside,
.top {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.bottom {
    height: 80px;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0 20px;
    margin-bottom: 10px;
}

.bottom .el-text {
    margin-left: 10px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 70%;
    font-size: 1.5em;
}

.el-icon {
    color: #546e7a;
    margin: 10px;
}

.el-button {
    width: 100%;
    height: 60px;
    margin: 0 !important;
    border: none;
    display: flex;
    justify-content: flex-start;
    background-color: transparent;
}

.el-button:hover {
    background-color: rgba(0, 0, 0, 0.1) !important;
}

.el-text {
    font-size: 1.2em;
    color: #546e7a;
    font-weight: normal;
    font-style: normal;
}

.buttonContent {
    display: flex;
    flex-direction: row;
}

.router-link-active {
    text-decoration: none;
    background-color: transparent;
}

a:hover {
    background-color: transparent;
}

.el-divider {
    padding: 0;
    margin: 0;
    border-color: rgba(0, 0, 0, 0.05);
}
</style>