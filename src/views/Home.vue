<!-- 首页 -->
<template>
  <div class="home">
    <el-container>
      <el-header>
        <el-image class="logo" src="/static/images/logo.png" style="width: 40px;height: 40px;float: left;"></el-image>
        <div class="topItem" style="height: 70px;">
          <el-button type="primary" link circle v-if="isVisibleTopItems">
            <template #icon>
              <el-icon :size="24">
                <Share />
              </el-icon>
            </template>
          </el-button>
          <el-button type="primary" link circle v-if="isVisibleTopItems">
            <template #icon>
              <el-icon :size="24">
                <Edit />
              </el-icon>
            </template>
          </el-button>
          <el-button type="primary" link circle v-if="isVisibleTopItems">
            <template #icon>
              <el-icon :size="24">
                <DocumentCopy />
              </el-icon>
            </template>
          </el-button>
          <el-button type="primary" link circle v-if="isVisibleTopItems">
            <template #icon>
              <el-icon :size="24">
                <DocumentRemove />
              </el-icon>
            </template>
          </el-button>
          <el-button type="primary" link circle v-if="isVisibleTopItems">
            <template #icon>
              <el-icon :size="24">
                <DeleteFilled />
              </el-icon>
            </template>
          </el-button>
          <el-button type="primary" link circle v-if="isVisibleTopItems">
            <template #icon>
              <el-icon :size="24">
                <InfoFilled />
              </el-icon>
            </template>
          </el-button>
          <el-button type="primary" link circle>
            <template #icon>
              <el-icon :size="24">
                <UploadFilled />
              </el-icon>
            </template>
          </el-button>
        </div>
      </el-header>
      <el-container>
        <el-aside>
          <div class="leftAside">
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
            <el-button @click="createNewFolderClick">
              <span class="buttonContent">
                <el-icon :size="26">
                  <FolderAdd />
                </el-icon>
                <el-text>新建文件夹</el-text>
              </span>
            </el-button>
            <el-divider />
            <router-link to="/home/myShare">
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
            <el-divider />
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

            <el-button @click="logoutDialogVisible = true">
              <span class="buttonContent">
                <el-icon :size="26">
                  <SwitchButton />
                </el-icon>
                <el-text>登出</el-text>
              </span>
            </el-button>
          </div>
        </el-aside>
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>

  <!-- 新建目录弹出框 -->
  <el-dialog v-model="newFolderDialogVisible" title="新建目录" width="20%" align-center>
    <el-text>输入新目录名称</el-text>
    <el-input v-model="newFolderName" style="width:100%;height: 40px;margin: 15px 0;" clearable></el-input>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="newFolderDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="newFolderDialogVisible = false">确认</el-button>
      </div>
    </template>
  </el-dialog>

  <!-- 问题反馈弹出框 -->
  <el-dialog class="problemDialog" v-model="problemDialogVisible" title="意见与反馈" width="50%" align-center>
    <el-form :model="problemForm" :rules="formRules" ref="problemFormRef" label-width="auto" label-position="top"
      class="problemDialogForm">
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


  <!-- 登出弹出框 -->
  <el-dialog v-model="logoutDialogVisible" title="提示" width="20%" align-center>
    <el-text>确认退出吗？</el-text>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="logoutDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="logoutClick">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref } from "vue";
import formRules from "@/utils/formRules";
import { RouterView, useRouter } from 'vue-router'
import {
  Folder, FolderAdd, Share, ChatLineRound, Setting, SwitchButton, Edit, DocumentCopy,
  DocumentRemove, DeleteFilled, InfoFilled, UploadFilled
} from '@element-plus/icons-vue'

const router = useRouter();

//是否显示头部功能按钮
let isVisibleTopItems = ref(false);
const showTopItems = (val) => {
  isVisibleTopItems.value = val;
}


//是否显示新建文件夹对话框
let newFolderDialogVisible = ref(false);
//弹出新建文件夹对话框点击事件
const createNewFolderClick = () => {
  newFolderDialogVisible.value = true;
}
//新建目录输入框
let newFolderName = ref('')



const problemFormRef = ref(null)
//是否显示问题反馈对话框
let problemDialogVisible = ref(false)
//反馈的问题
let problemForm = ref({
  problem: '',
  email: ''
})



//是否显示退出登录对话框
let logoutDialogVisible = ref(false)
//退出登录点击事件
const logoutClick = () => {
  logoutDialogVisible.value = false;
  router.push('/login');
}
</script>

<style scoped>
.home {
  width: calc(100vw);
  height: calc(100vh);
}

.el-header {
  width: 100%;
  height: 70px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0px 3px 3px rgba(0, 0, 0, 0.1);
  z-index: 999;
}

.el-aside {
  width: 260px;
  height: calc(100vh - 70px);
  background-color: #fafafa;
}

.el-main {
  width: calc(100vw - 260px);
  height: calc(100vh - 70px);
  background-color: #fafafa;
}

.el-divider {
  padding: 0;
  margin: 0;
  border-color: rgba(0, 0, 0, 0.05);
}

.problemDialogForm .el-form-item {
  margin-top: 30px;
}



.topItem {
  display: flex;
  align-items: center;
}

.topItem .el-icon {
  color: #546e7a;
}

.topItem .el-button.is-circle {
  padding: 18px;
  height: 45px;
  width: 45px;
}

.topItem .el-button+.el-button {
  margin: 0;
}

.topItem .el-button:hover {
  background-color: rgba(0, 0, 0, 0.1) !important;
}



.leftAside {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.leftAside .el-icon {
  color: #546e7a;
  margin: 10px;
}

.leftAside .el-button {
  width: 100%;
  height: 60px;
  margin: 0 !important;
  border: none;
  display: flex;
  justify-content: flex-start;
  background-color: transparent;
}

.leftAside .el-button:hover {
  background-color: rgba(0, 0, 0, 0.1) !important;
}

.leftAside .el-text {
  font-size: 1.2em;
  color: #546e7a;
  font-weight: normal;
  font-style: normal;
}

.leftAside .buttonContent {
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
</style>
