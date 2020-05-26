<template>
  <el-tabs type="border-card" class="container" :value="tabName">
    <el-tab-pane name="flight"> 
      <span slot="label">
        <i class="el-icon-alijipiao"></i> <router-link to="/travel/trafficQuery/flight" class="text">查询航班</router-link>
      </span>
      <router-view></router-view>
    </el-tab-pane>
    <el-tab-pane name="train">
      <span slot="label">
        <i class="el-icon-aliqichepiao" ></i><router-link to="/travel/trafficQuery/train" class="text">查询高铁火车票</router-link>
      </span>
      <router-view></router-view>
    </el-tab-pane>
    <el-tab-pane name="coach">
      <span slot="label">
        <i class="el-icon-alihuochepiao"></i><router-link to="/travel/trafficQuery/coach" class="text">查询汽车票</router-link>
      </span>
      <router-view></router-view>
    </el-tab-pane>
  </el-tabs>
</template>
<script>
export default {
  data(){
    return {
      tabName:'flight'
    }
  },
  methods:{
  }
};
</script>
<style scoped>
.container{
  width:1050px;
}
.text{
  margin-left: 5px;
}
</style>