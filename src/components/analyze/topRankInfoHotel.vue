<template>
  <div>
    <div v-loading="loading">
      <div class="top_container" style="font-size:12px">
        <div :class="{top_container_header:true,'top_container_header-darken':true}">
          <span class="top_container_header_title">
            <span>{{'今日'+title}}</span>
            <span class="top_container_header_title bold">Top10</span>
          </span>
        </div>
        <div class="top_container_tableTitle flex-row" style="justify-content:space-between">
          <span style="padding-left:42px;">名称</span>
          <span style="padding-left:35px;">{{HOTEL_CATEGORY[name].tt}}</span>
          <span style="padding-right:45px;">{{HOTEL_CATEGORY[name].tt2}}</span>
        </div>
        <ul>
          <li v-for="(item,index) in chartData" :key="index">
            <i :class="index<=3?`i1-${index+1}`:'i1-4'" v-if="index!==10">{{index+1}}</i>
            <span style="display:inline-block;width:16px;" v-else></span>
            <span class="name">
              <span v-if="index===10" style="text-decoration:underline">{{item.name}}</span>
              <a href="http://www.baidu.com" target="_target" v-else>{{item.name}}</a>
            </span>
            <span :class="{'bold':(index<3?true:false),'frequency':true}">{{item.frequency}}</span>
            <span
              :class="{'bold':(index<3?true:false),'radio':true}"
            >{{`${item.compare>0?'+':''}${item.compare}`}}
            </span>
           <i :class="['open-icon',activeIndex===index?'el-icon-right':'el-icon-back']" @click="selectChart(index)"></i>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import echarts from "echarts";
import { HOTEL_CATEGORY } from "@/Constant";
export default {
  props: ["info", "title", "activeIndex"],
  data() {
    return {
      loading: false,
      HOTEL_CATEGORY,
      name:'visit'
    };
  },
  mounted(){

  },
  methods: {
    selectChart(index){
      this.$emit('handleSelect',index)
    }
  },
  computed: {
    total() {
      return this.info.data.length;
    },
    
    chartData() {
      let chartData = this.info.data.slice(0);
      chartData.push({
        name: "平均",
        frequency: 5.23,
        compare:+0.2
      });
      return chartData;
    },
  }
};
</script>
<style lang="less" scoped>
.theme(@darken) {
  @theme-color: darken(#fff4c3,@darken);
  @theme-font-color: darken(#d58500,@darken);
  @theme-border-color: darken(#ffb14b,@darken);
}
.name {
  width: 120px;
  display: inline-block;
  margin-left: 4px;
}
.frequency {
  display: inline-block;
  margin-left: 10px;
  width: 48px;
  text-align: center;
}
.radio {
  display: inline-block;
  margin-left: 35px;
  width: 132px;
  text-align: center;
}
.flex-row {
  display: flex;
  flex-direction: row;
}
.bold {
  font-weight: bold;
}
ul {
  list-style: none;
  padding: 0;
  padding-left: 5px;
}
a {
  text-decoration: none;
}
.top_container li {
  border-bottom: 1px dotted #e1e1e1;
  padding: 6px 0 6px 20px;
  display: flex;
  flex-direction: row;
  align-items:center;
}
.top_container a {
  width: 132px;
  height: 22px;
  color: #16b;
  overflow: hidden;
}
.i1 {
  background: url("../../assets/top.png") no-repeat -45px -2px;
  width: 15px;
  height: 22px;
  display: inline-block;
  color: #fff;
  text-align: center;
  font-style: normal;
}
.i1-1 {
  .i1();
  background-position: 0 0;
}
.i1-2 {
  .i1();
  background-position: -15px 0;
}
.i1-3 {
  .i1();
  background-position: -30px 0;
}
.i1-4 {
  .i1();
  height: 16px;
  line-height: 16px;
  width: 16px;
}
.top_container_tableTitle {
  height: 24px;
  line-height: 24px;
  border-bottom: 1px solid #e1e1e1;
  color: #888;
}
.top_container{
  .theme(0%);
  border: 1px solid #d9d9d9;
  border-top: 2px solid @theme-border-color;
  width: 400px;
  background: #fff;
  height: 100%;
}
.top_container_header {
  .theme(0%);
  background: @theme-color;
  line-height: 35px;
  color: @theme-font-color;
  padding: 0 12px;
  .flex-row();
  justify-content: space-between;
  &_title {
    font-size: 14px;
  }
}

.top_container_header-darken{
  .theme(30%);
  .top_container_header();
  background:@theme-color;
  color: @theme-font-color;
}

.other {
  padding-left: 20px;
  width: 132px;
  display: inline-block;
}
.open-icon{
  position:relative;
  right:35px;
  color:#409EFF;
  font-size:16px;
}
</style>