<template>
  <div class="pic2 pic3" ref="myChart" style="width:750px;"></div>
</template>
<script>
import echarts from "echarts";
import { SCENE_CATEGORY } from "@/Constant";
export default {
  mounted() {
    this.$nextTick(() => {
      this.drawPie();
    });
  },
  props: ["info", "name"],
  watch: {
    data(newVal) {
      this.drawPie();
    }
  },
  data() {
    return {
      SCENE_CATEGORY
    };
  },
  computed: {
    chartData() {
      let chartData = this.info.data.slice(
        0
      ); /* 
      if (chartData.length === 10) {
        chartData.push({
          name: "平均",
          frequency: 5.23,
          compare: +0.2
        });
      } */
      return chartData;
    }
  },
  methods: {
    drawPie() {
      const ref = this.$refs.myChart;
      let myChart = echarts.init(ref);
      const option = {
        legend: {
          show:true,
          data: [
            {
              name: "访问次数",
              // 强制设置图形为圆。
              icon: "circle",
            },
            {
              name: "与昨日相比",
              // 强制设置图形为圆。
              icon: "circle",
            }
          ]
        },
        tooltip: {},
        markLine: {
          data:[{
            yAxis:100,
            name:'平均值'
          }]
        },
        dataset: {
          source: this.chartData
        },
        xAxis: {
          show:false,
          type: "category",
          data: this.chartData.map(item => item.name)
        },
        yAxis: {},
        series: [{ name:'访问次数',type: "bar" }, { name:'与昨日相比',type: "bar" }]
      };
      myChart.setOption(option);
    }
  }
};
</script>
<style lang="less" scoped>
.pic3 {
  background: lighten(#fff4c3, 8%);
  border-top: 2px solid #ffb14b;
}
</style>