<template>
  <div class="container">
    <div class="header1_container">
      <div class="header1">今日出行人数信息</div>
      <div
        style=" display: flex;justify-content: space-between;margin-top:12px;margin-bottom:32px;"
      >
        <report title="出行总人数" num="25" icon="el-icon-s-promotion" color="#409EFF"></report>
        <report title="景点出行人数" num="15" icon="el-icon-location" color="#67C23A"></report>
        <report title="酒店出行人数" num="13" icon="el-icon-school" color="#E6A23C"></report>
        <report title="自定义地点出行人数" num="12" icon="el-icon-office-building" color="#909399"></report>
      </div>
      <div class="header1">最近出行人数趋势图</div>
      <div class="pic1" ref="myChart"></div>
      <div class="header1">热门景点信息</div>
      <div class="half_container">
        <div class="half" style="background:blue">
          <div class="half_content"></div>
        </div>
        <div class="half">
          <div class="half_content"></div>
        </div>
      </div>
      <div class="header1">热门酒店信息</div>
      <div class="half_container">
        <div class="half" style="background:pink">
          <div class="half_content"></div>
        </div>
        <div class="half">
          <div class="half_content" style="background:grey"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import echarts from "echarts";
import http from "@/api/index";
import report from "@/components/report";
export default {
  components: {
    report
  },
  data() {
    return {};
  },
  methods: {
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(this.$refs.myChart);
      // 绘制图表
      const option = {
        title: {
          text: "堆叠区域图"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985"
            }
          }
        },
        legend: {
          data: ["邮件营销", "联盟广告", "视频广告", "直接访问", "搜索引擎"]
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]
          }
        ],
        yAxis: [
          {
            type: "value"
          }
        ],
        series: [
          {
            name: "邮件营销",
            type: "line",
            stack: "总量",
            areaStyle: {},
            data: [120, 132, 101, 134, 90, 230, 210]
          },
          {
            name: "联盟广告",
            type: "line",
            stack: "总量",
            areaStyle: {},
            data: [220, 182, 191, 234, 290, 330, 310]
          },
          {
            name: "视频广告",
            type: "line",
            stack: "总量",
            areaStyle: {},
            data: [150, 232, 201, 154, 190, 330, 410]
          },
          {
            name: "直接访问",
            type: "line",
            stack: "总量",
            areaStyle: {},
            data: [320, 332, 301, 334, 390, 330, 320]
          },
          {
            name: "搜索引擎",
            type: "line",
            stack: "总量",
            label: {
              normal: {
                show: true,
                position: "top"
              }
            },
            areaStyle: {},
            data: [820, 932, 901, 934, 1290, 1330, 1320]
          }
        ]
      };

      myChart.setOption(option);
    }
  },
  mounted() {
    this.drawLine();
  }
};
</script>
<style scoped>
.header1_container {
}
.half_content {
  background: crimson;
  width: 100%;
  height: 100%;
}
.half {
  width: 50%;
  background-color: chocolate;
  padding: 10px;
}
.half_container {
  display: flex;
  flex-direction: row;
  font-size: 26px;
  height: 250px;
  margin-top: 15px;
  margin-bottom: 15px;
}
.header1 {
  font-size: 26px;
}
.container {
  padding: 15px;
  min-height: 1200px;
  background: #eee;
}
.pic1 {
  width: 100%;
  height: 420px;
  margin-top: 15px;
  margin-bottom: 15px;
}
</style>