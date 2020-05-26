<template>
  <el-tabs type="border-card">
    <el-tab-pane>
      <span slot="label">
        <i class="el-icon-date"></i> 查询航班
      </span>
      <router-view></router-view>
    </el-tab-pane>
    <el-tab-pane>
      <span slot="label">
        <i class="el-icon-date"></i> 查询高铁火车票
      </span>
    </el-tab-pane>
    <el-tab-pane>
      <span slot="label">
        <i class="el-icon-date"></i> 查询汽车票
      </span>
    </el-tab-pane>
  </el-tabs>
</template>
<script>
export default {};
</script>