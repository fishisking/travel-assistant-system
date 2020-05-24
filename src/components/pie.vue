<template>
  <div class="pic2" ref="myChart"></div>
</template>
<script>
import echarts from "echarts";
import { SCENE_CATEGORY } from '@/Constant'
export default {
  mounted() {
    this.$nextTick(() => {
      this.drawPie();
    });
  },
  props: ["data","name"],
  watch: {
    data(newVal) {
      this.drawPie();
    }
  },
  data(){
	  return {
		  SCENE_CATEGORY
	  }
  },
  computed: {
    chartData() {
	  let chartData = this.data.list.slice(0);
      if (chartData.length === 10) {
        const sum = chartData.reduce((total, current, index) => {
          return total + current.value;
        }, 0);
		const otherTotal = this.data.total - sum;
        chartData.push({
          name: "其他",
          value: otherTotal
        });
        return chartData;
      } else {
        return chartData;
      }
    }
  },
  methods: {
    drawPie() {
      const ref = this.$refs.myChart;
	  let myChart = echarts.init(ref);
      const option = {
        title: {
          text: this.SCENE_CATEGORY[this.name].c1,
          right: "10"
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} 次/人({d}%)"
        },
        legend: {
          orient: "vertical",
          left: 5,
          data: this.chartData.map(item => {
            return item.name;
          })
        },
        right:'right',
        series: [
          {
            center: ['62%', '50%'],
            name: "所占比例",
            type: "pie",
            label: {
              show: false,
              position: "center"
            },
            emphasis: {
              label: {
                show: true,
                fontSize: "30",
                fontWeight: "bold"
              }
            },
            labelLine: {
              show: false
            },
            data: this.chartData
          }
        ]
      };
      // 绘制图表
      myChart.setOption(option);
    }
  }
};
</script>
<style lang="less">
.pic2 {
  background: #eef8e6;
  height: 420px;
  border: 1px solid #d9d9d9;
  border-top: 2px solid #92ce5b;
  width: 485px;
  padding-top: 15px;
}
</style>