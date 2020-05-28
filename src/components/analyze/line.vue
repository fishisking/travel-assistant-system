<template>
  <div class="pic3" ref="myChart" style="width:750px;"></div>
</template>
<script>
import echarts from "echarts";
import { SCENE_CATEGORY } from "@/Constant";
import { HOTEL_LINES } from "@/Constant";
export default {
  mounted() {
    this.$nextTick(() => {
      this.drawPie();
    });
  },
  watch: {
    index(newVal) {
      this.drawPie();
    }
  },
  props: ["index"],
  computed: {
      hdata(){
          return HOTEL_LINES[this.index]
      }
  },
  methods: {
    drawPie() {
      const ref = this.$refs.myChart;
      let myChart = echarts.init(ref);
      const data = this.hdata.lines
      const option = {
        xAxis: {
          type: "category",
          data: data.map((item)=>item.date)
        },
        yAxis: {
          type: "value"
        },
        title:{
          text:`一周访问人数折线图`,
          right:190,
          textAlign:'center',
          subtext:`${this.hdata.name}`
        },
        tooltip: {
          trigger: "item",
          formatter: "{b}访问人数:{c}"
        },
        series: [
          {
            data: data.map((item)=>item.value),
            type: "line"
          }
        ]
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
  height:550px;
}
</style>