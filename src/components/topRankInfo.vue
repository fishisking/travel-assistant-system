<template>
  <div>
    <div v-loading="loading">
      <div class="top_container" style="font-size:12px">
        <div class="top_container_header">
          <span class="top_container_header_title">
            <span>{{TIME_LIST[showList[activeIndex]]+title}}</span>
            <span class="top_container_header_title bold">Top10</span>
          </span>
          <el-dropdown @command="handleCommand" trigger="click">
            <span class="el-dropdown-link" style="font-size:12px">
              图表选项
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="switchToToday">今日数据</el-dropdown-item>
              <el-dropdown-item command="switchToWeek">一周数据</el-dropdown-item>
              <el-dropdown-item command="switchToHistory">历史数据</el-dropdown-item>
              <el-dropdown-item command="draw" divided :disabled="selected">显示图表</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div class="top_container_tableTitle flex-row" style="justify-content:space-between">
          <span style="padding-left:42px;">名称</span>
          <span style="padding-left:75px;">{{SCENE_CATEGORY[name].tt}}</span>
          <span style="padding-right:10px;">{{SCENE_CATEGORY[name].tt2}}</span>
        </div>
        <ul>
          <li v-for="(item,index) in chartData" :key="index">
            <i :class="index<=3?`i1-${index+1}`:'i1-4'" v-if="index!==10">{{index+1}}</i>
            <span style="display:inline-block;width:16px;" v-else></span>
            <span class="name">
              <span v-if="index===10" style="text-decoration:underline">{{item.name}}</span>
              <a href="http://www.baidu.com" target="_target" v-else>{{item.name}}</a>
            </span>
            <span :class="{'bold':(index<3?true:false),'frequency':true}">{{item.value}}</span>
            <span
              :class="{'bold':(index<3?true:false),'radio':true}"
            >{{(Math.round(item.value/total*10000) / 100.00).toFixed(2) + "%"}}</span>
          </li>
        </ul>
      </div>
      <div class="pic2" ref="myChart" v-if="chartVisible"></div>
    </div>
  </div>
</template>
<script>
import echarts from "echarts";
import { TIME_LIST,SCENE_CATEGORY } from '@/Constant'
export default {
  props: ["info","title","index","selected","name"],
  TIME_LIST,
  data() {
    return {
      showList: ["history", "today", "week"],
      activeIndex: 0,
      option: null,
      loading: false,
      chartVisible: false,
      TIME_LIST,
      SCENE_CATEGORY
    };
  },
  mounted(){
	  console.log(SCENE_CATEGORY)
  },
  methods: {
    handleCommand(command) {
      if (command.indexOf("switch") >= 0) {
        const reg = /^switchTo(.+)$/;
        const type = command.match(reg)[1].toLowerCase();
        this.activeIndex = this.showList.indexOf(type);
        this.$emit('handleCommand',this.index,type,this.chartData)
      } else {
        const type = this.showList[this.activeIndex]
        this.$emit('handleCommand',this.index,type,this.chartData,'draw')
        /* this.loading = true;
        setTimeout(() => {
          this.chartVisible = true;
          this.ininDraw();
        }, 300); */
      }
    },
    
  },
  computed: {
    total() {
      return this.info.history.total;
    },
    chartData() {
      let chartData = this.info[this.showList[this.activeIndex]].list.slice(0);
      chartData.push({
        name: "其他",
        value: this.otherTotal
      });
      return chartData;
    },
    otherTotal() {
      const sum = this.info[this.showList[this.activeIndex]].list.reduce((total, current, index) => {
        return total + current.value;
      }, 0);
      return this.total - sum;
    }
  }
};
</script>
<style lang="less">
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
}
.top_container a {
  width: 132px;
  height: 22px;
  color: #16b;
  overflow: hidden;
}
.i1 {
  background: url("../assets/top.png") no-repeat -45px -2px;
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
.top_container {
  border: 1px solid #d9d9d9;
  border-top: 2px solid #92ce5b;
  width: 400px;
  background: #fff;
  &_header {
    background: #eef8e6;
    line-height: 35px;
    color: #4fa609;
    padding: 0 12px;
    .flex-row();
    justify-content: space-between;
    &_title {
      font-size: 14px;
    }
  }
}

.top_container {
  min-width: 300px;
  height: 100%;
}
.other {
  padding-left: 20px;
  width: 132px;
  display: inline-block;
}
</style>