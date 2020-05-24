<template>
  <div class="pic2" ref="myChart" style="width:750px;"></div>
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
  props: ["data", "name"],
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
      let chartData = this.data.list.slice(0);
      if (chartData.length === 10) {
        const sum = chartData.reduce((total, current, index) => {
          return total + current.value;
        }, 0);
        const otherTotal = this.data.total - sum;
        chartData.unshift({
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
          text: this.SCENE_CATEGORY[this.name].c2,
          left: "center"
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} 次/人"
        },
        xAxis: {
          type: "category",
          data: this.chartData.map(item => {
            return item.name;
          }),
          axisLabel: {
            interval: 0,
            rotate: 25,
            fontSize:'12'
          }
        },
        yAxis: {
          type: "value"
        },
        label: {
          show: true,
          position: "top"
        },
        series: [
          {
            name: "次数/人数",
            data: this.chartData.map(item => {
              return item.value;
            }),
            type: "bar",
            itemStyle: {
              normal: {
                //每个柱子的颜色即为colorList数组里的每一项，如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
                color: function(params) {
                  var colorList = [
                    "#083136",
                    "#0B4850",
                    "#246169",
                    "#5C8A8F",
                    "#B3C8CA"
                  ];
                  const index = params.dataIndex <= 4 ? params.dataIndex : 4;
                  return colorList[index];
                }
              }
            }
          }
        ]
      };
      // 绘制图表
      myChart.setOption(option);
    }
  }
};
</script>
<style lang="less" scoped>

</style>