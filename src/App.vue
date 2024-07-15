<script setup>
import { RouterView } from 'vue-router'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import localeZh from './assets/locale/cn'

zhCn.el.pagination = Object.assign(zhCn.el.pagination, localeZh.el.pagination);
</script>

<template>
  <el-config-provider :locale="zhCn">
    <RouterView />
  </el-config-provider>
</template>