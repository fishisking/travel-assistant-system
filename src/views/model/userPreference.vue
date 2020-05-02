<template>
  <div>
    <el-page-header @back="goBack" content="详情页面"></el-page-header>
    <div id="main" style="width: 1000px;height: 850px;"></div>
    <el-button @click="updatePreference">更新长期兴趣度</el-button>
  </div>


</template>



  <script>
    import moment from 'moment';
    import echarts from 'echarts'
    import http from '@/api/index'
    export default {
      name: 'Bank',
      inject:['reload'],
      data () {
        return {
          tableData:[],
          user_id:''
        }
      },
      async created() {
        if(Object.keys(this.$route.params).length>0){
          this.user_id = this.$route.params.user_id
        }else{
          this.user_id = this.$store.state.user_id
        }
        await this.loadData()
        this.$nextTick(function() {
          this.drawPie('main')
        })
      },
      methods: {
        goBack(){
          this.$router.go(-1)
        },
        async updatePreference(){
          let result = await http.doPost('convertShortTermToLongTermPreference',{user_id:this.$store.state.user_id})
          if(result.success){
            this.$message({
              type: 'success',
              message: '更新成功!'
            });
            this.reload()
          }else{
            this.$message({
              type: 'error',
              message: '更新失败!'
            });
          }
        },
        async loadData(){
          let params = {
            user_id:this.user_id
          }
          this.tableData =  await http.doPost('/getBothTermUserPreference',params)
          //console.log(this.tableData)
        },
        drawPie(id) {
          let arr = []
          for(let i=0;i<this.tableData.length;i++){
            let parameter_dict = this.tableData[i]
            let item = []
            item.push(parameter_dict['natural_scene_preference'],
              parameter_dict['cultural_relic_preference'],
              parameter_dict['farm_vacation_preference'],
              parameter_dict['amusement_park_preference'],
              parameter_dict['outdoor_activity_preference'],
              parameter_dict['exhibition_preference'],
              parameter_dict['park_preference'],
              parameter_dict['sports_preference'],
              parameter_dict['city_sightseeing_preference'],
              parameter_dict['water_activity_preference'])
            arr.push(item)
          }
          if(arr.length==1){
            arr.push([])
          }
          console.log(arr)
          var charts = echarts.init(document.getElementById(id))
          var option = {
            title: {
              text: '用户ID'+this.user_id+'的兴趣度模型',
              left: 'center',
              top:35
            },
            tooltip: {},//提示层
            legend: {
              top:60,
              data: ['长期兴趣度','短期兴趣度','注册初始'],
            },
            radar: {
              name: {
                textStyle: {
                  color: '#fff', //字体颜色
                  backgroundColor: '#999', //背景色
                  borderRadius: 3, //圆角
                  padding: [3, 5] //padding
                }
              },
              center: ['50%', '50%'],
              radius: '60%',
              startAngle: 270,
              indicator: [
                {
                name: '自然风光',
                max: 100
                },
                {
                  name: '文化古迹',
                  max: 100
                },
                {
                  name: '农家度假',
                  max: 100
                },
                {
                  name: '游乐场',
                  max: 100
                },
                {
                  name: '户外运动',
                  max: 100
                },
                {
                  name: '展馆表演',
                  max: 100
                },
                {
                  name: '公园',
                  max: 100
                },
                {
                  name: '运动健身',
                  max: 100
                },
                {
                  name: '城市观光',
                  max: 100
                },
                {
                  name: '水活动',
                  max: 100
                },
              ],
            },
            series: [{
              name: '测试标题名字',
              type: 'radar',
              data: [
                {
                  value: arr[2],
                  name: "注册初始",
                  areaStyle: {},
                },
                {
                value: arr[0],
                name: "长期兴趣度",
                  areaStyle: {},
              },
                {
                  value: arr[1],
                  name: '短期兴趣度',
                  areaStyle: {},
                }]
            }]
          }
          charts.setOption(option);
        },

      }
    }
  </script>


<style scoped>

</style>
