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
      <div class="header1 flex-pic">
        <span>出行人数趋势图</span>
        <span>
          <span style="font-size:14px;">时间单位:</span>
          <el-select v-model="recentTripChart.measure">
            <el-option value="year" label="年"></el-option>
            <el-option value="month" label="月"></el-option>
            <el-option value="week" label="日"></el-option>
          </el-select>
        </span>
      </div>
      <div class="pic1" ref="myChart"></div>
      <div class="header1">热门景点信息</div>
      <div class="half_container">
        <topRankInfo :info="hotSceneInfo"></topRankInfo>
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
import topRankInfo from "@/components/topRankInfo";
export default {
  components: {
    report,
    topRankInfo
  },
  data() {
    return {
      recentTripChart: {
        measure: "month",
        start: "",
        end: ""
      },
      hotSceneInfo: {
        history: {
          total: 232,
          list: [
            {
              name: "西湖",
              value: 43
            },
            {
              name: "胡雪岩故居",
              value: 21
            },
            {
              name: "杭州野生动物园",
              value: 11
            },
            {
              name: "杭州乐园",
              value: 9
            },
            {
              name: "杭州动物园",
              value: 5
            },
            {
              name: "印象西湖",
              value: 4
            },
            {
              name: "杭州海底世界",
              value: 4
            },
            {
              name: "杭州烂苹果乐园",
              value: 3
            },
            {
              name: "千岛湖",
              value: 2
            },
            {
              name: "千岛湖中心湖",
              value: 1
            },
          ]
        },
        today:{
          total: 32,
          list: [
            {
              name: "灵隐寺",
              value: 10
            },
            {
              name: "杭州岳王庙",
              value: 5
            },
            {
              name: "雷峰塔",
              value: 5
            },
            {
              name: "大明山",
              value: 4
            },
            {
              name: "杭州动物园",
              value: 3
            },
            {
              name: "杭州飞来峰",
              value: 2
            },
            {
              name: "杭州海底世界",
              value: 1
            },
            {
              name: "杭州烂苹果乐园",
              value: 1
            },
            {
              name: "千岛湖",
              value: 1
            },
            {
              name: "千岛湖中心湖",
              value: 1
            },
          ]
        },
        week:{
          total: 66,
          list: [
            {
              name: "灵隐寺",
              value: 22
            },
            {
              name: "杭州岳王庙",
              value: 15
            },
            {
              name: "千岛湖",
              value: 11
            },
            {
              name: "雷峰塔",
              value: 7
            },
            {
              name: "大明山",
              value: 6
            },
            {
              name: "杭州动物园",
              value: 4
            },
            {
              name: "杭州飞来峰",
              value: 3
            },
            {
              name: "杭州海底世界",
              value: 3
            },
            {
              name: "杭州烂苹果乐园",
              value: 3
            },
            {
              name: "千岛湖中心湖",
              value: 1
            },
          ]
        },
      }
    };
  },
  methods: {
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(this.$refs.myChart);
      // 绘制图表
      const option = {
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
          data: [
            "出行总人数",
            "景点出行人数",
            "酒店出行人数",
            "自定义地点出行人数"
          ]
        },
        toolbox: {
          show: true,
          feature: {
            dataView: {
              //数据视图
              show: true
            },
            saveAsImage: {
              //保存图片
              show: true
            },
            magicType: {
              //动态类型切换
              type: ["bar", "line"]
            }
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
            name: "自定义地点出行人数",
            type: "line",
            stack: "总量",
            areaStyle: {},
            data: [120, 132, 101, 134, 90, 230, 210]
          },
          {
            name: "景点出行人数",
            type: "line",
            stack: "总量",
            areaStyle: {},
            data: [220, 182, 191, 234, 290, 330, 310]
          },
          {
            name: "酒店出行人数",
            type: "line",
            stack: "总量",
            areaStyle: {},
            data: [150, 232, 201, 154, 190, 330, 410]
          },
          {
            name: "出行总人数",
            type: "line",
            stack: "总量",
            areaStyle: {},
            data: [320, 332, 301, 334, 390, 330, 320]
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
.flex-row {
  display: flex;
  flex-direction: row;
}

.bold {
  font-weight: bold;
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
  margin-top: 15px;
  margin-bottom: 15px;
}
.header1 {
  font-size: 26px;
}
.flex-pic {
  display: flex;
  justify-content: space-between;
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