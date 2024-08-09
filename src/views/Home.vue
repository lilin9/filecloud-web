<!-- 首页 -->
<script setup>
import { RouterView } from 'vue-router'
import TopOptions from "@/components/TopOptions.vue";
import LeftAsides from '@/components/LeftAsides.vue';
</script>

<template>
  <div class="home">
    <el-container>
      <el-header>
        <el-image class="logo" src="/static/images/logo.png" style="width: 40px;height: 40px;float: left;"></el-image>
        <TopOptions />
      </el-header>
      <el-container>
        <el-aside>
          <LeftAsides />
        </el-aside>
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

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
</style>
