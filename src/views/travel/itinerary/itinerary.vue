<template>
  <div>
    <el-button @click="switchDateDialog">{{dialogButtonText}}</el-button>
    <el-button @click="addItinerary">增加行程</el-button>
    <el-button @click="updateItineraryDialogVisible = true" v-bind:disabled="itinerarys.length==0">修改行程</el-button>
    <el-button @click="deleteItineraryDialogVisible = true" v-bind:disabled="itinerarys.length==0">删除行程</el-button>
    <div v-show="dateDialogVisible">
      <a-alert :message="`你选择的日期是: ${selectedDate.format('YYYY-MM-DD')}`" />
      <a-calendar @select="selectDate" style="width: 100% " v-model="selectedDate" @change="getEventsInCalendar">
        <ul class="events" slot="dateCellRender" slot-scope="value">
          <li v-for="item in getListData(value)" :key="item.content">
            <a-badge :status="item.type" :text="item.content" />
          </li>
        </ul>
        <ul class="events" slot="monthCellRender" slot-scope="value">
          <li v-for="item in getMonthData(value)">
            <a-badge :status="item.type" :text="item.content" />
          </li>
        </ul>
      </a-calendar>
    </div>
    <div>
      <div style="text-align: center">
        <h1 style="font-size:32px;color:#409EFF;margin: 0 auto;">{{selectedDate.format('YYYY-MM-DD')}}行程单</h1>
      </div>
      <div>
        <el-alert
          v-if="weatherData"
          title="当日天气提示"
          type="success">
          <template >
            <el-row style="width: 750px;">
              <el-col :span="8">
                <el-row>
                  <span>白天</span>
                  <i class="el-icon-sunny"></i>
                </el-row>
                <el-row>
                  {{'天气：'+thatDayWeather.day.weather+' '+thatDayWeather.day.winddirect+'('+thatDayWeather.day.windpower+')'
                  }}
                </el-row>
                <el-row>
                  {{'最高温度：'+thatDayWeather.day.temphigh +'摄氏度'}}
                </el-row>
              </el-col>
              <el-col :span="8">
                <el-row>
                  <span>夜晚</span>
                  <i class="el-icon-moon"></i>
                </el-row>
                <el-row>
                  {{'天气：'+thatDayWeather.night.weather+' '+thatDayWeather.night.winddirect+'('+thatDayWeather.night.windpower+')'
                  }}
                </el-row>
                <el-row>
                  {{'最低温度：'+thatDayWeather.night.templow +'摄氏度'}}
                </el-row>
              </el-col>
              <el-col :span="8">
                <el-row>其他</el-row>
                <el-row>日出时间<i class="el-icon-sunrise"></i>：{{thatDayWeather.sunrise}}</el-row>
                <el-row>日落时间<i class="el-icon-sunset"></i>：{{thatDayWeather.sunset}}</el-row>
              </el-col>
            </el-row>
          </template>
        </el-alert>
        <el-alert
          v-else
          title="当日天气提示"
          type="info"
          description="只能预测最近一周内天气">
        </el-alert>
      </div>
      <timeline>
        <timeline-title style="font-size:24px;" :bg-color="sceneColor"> {{`景点安排(${this.sceneData.length})`}}</timeline-title>
        <template>
          <timeline-item v-if="sceneData.length==0">待添加
          </timeline-item>
          <timeline-item v-for="(item,index) in sceneData" v-else >
            <span style="font-size:24px;margin-left:15px;">{{formatTime(item)}}</span>
            <el-card>
              <el-row :gutter="20">
                <el-col :span="19">
                  <div>
                    <el-badge class="item" :value="formaterSequence(item.sequence)">
                      <span style="font-weight: bold;font-size:24px;">{{item.destination_name}}</span>
                    </el-badge>
                    <span></span>
                  </div>
                  <div>备注:<span>{{item.note}}</span></div>
                  <div>景点地址:{{item.destination_address}}</div>
                  <baidu-map class="bm-view" :center="{lng: item.longitude, lat: item.latitude}" :zoom="20">
                    <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
                    <bm-marker :position="{lng: item.longitude, lat: item.latitude}">
                      <bm-label content="目的地" :Style="{color: 'red', fontSize : '24px'}" :offset="{height: 30}"/>
                    </bm-marker>
                  </baidu-map>
                </el-col>
                <el-col :span="5" v-if="sceneDetail[index]">
                  <h1 style="text-decoration: underline">景点信息</h1>
                  <el-row style="text-align: center;margin-bottom:12px;">
                    <img class="hotel-image" :src="sceneDetail[index].scene_img_src">
                  </el-row>
                  <el-row>景区等级：<span>{{sceneDetail[index].scene_level}}</span></el-row>
                  <el-row>所在地区：<span>{{sceneDetail[index].scene_area|judgeNull}}</span></el-row>
                  <el-row>景点类型：<el-tag size="small">{{switchScene_type(sceneDetail[index].scene_type_id)}}</el-tag></el-row>
                  <el-row>
                    景点是否收费：{{sceneDetail[index].scene_free=='1'?'免费':'收费'|judgeNull}}
                  </el-row>
                  <el-row>景点开放时间：<span>{{sceneDetail[index].opening_hours|judgeNull}}</span></el-row>
                  <el-row>
                    <el-col :span="24">
                      人气指数
                      <el-rate
                        v-model="sceneDetail[index].popularity"
                        disabled
                        show-score
                        text-color="#ff9900"
                        score-template="{value}">
                      </el-rate>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      用户评分
                      <el-rate
                        v-model="sceneDetail[index].avg_score"
                        disabled
                        show-score
                        text-color="#ff9900"
                        score-template="{value}">
                      </el-rate>
                    </el-col>
                  </el-row>
                  <el-row>
                    景点简略介绍<br><span>{{sceneDetail[index].scene_short_info|judgeNull}}</span>
                  </el-row>
                  <el-row style="text-align: center;margin-top:15px;">
                    <el-button size="small" @click="openSceneDetail(sceneDetail[index].scene_id)">查看详细介绍</el-button>
                  </el-row>
                </el-col>
              </el-row>
            </el-card>
          </timeline-item>
          <el-card class="box-card" v-if="this.sceneData.length<=2&&recommendSceneListVisible" style="width:70%;">
            <div slot="header" class="clearfix">
              <span><b>为你推荐景点</b>(点击查看)</span>
              <el-button style="float: right; padding: 3px 0" type="text" @click="recommendSceneListVisible = false">取消推荐</el-button>
            </div>
            <div >
              <el-carousel :interval="4000" type="card"  height="180px" style="text-align: center">
                <el-carousel-item v-for="item in recommendSceneList">
                  <img class="hotel-image" :src="item.scene_img_src" >
                  <div style="">
                    <span @click="getDetail(item,0)">{{item.scene_name}}</span>
                  </div>
                </el-carousel-item>

              </el-carousel>
            </div>

          </el-card>
        </template>
        <timeline-title style="font-size:24px;" :bg-color="customizedColor" >{{`自定义地点安排(${this.customPlaceData.length})`}}</timeline-title>
        <template>
          <timeline-item v-if="customPlaceData.length==0">待添加</timeline-item>
          <timeline-item v-for="(item,index) in customPlaceData" v-else >
            <span style="font-size:24px;margin-left:15px;">{{formatTime(item)}}</span>
            <el-card>
              <el-row :gutter="20">
                <el-col :span="19">
                  <div>
                    <el-badge class="item" :value="formaterSequence(item.sequence)">
                      <span style="font-weight: bold;font-size:24px;">{{item.destination_name}}</span>
                    </el-badge>
                    <span></span>
                  </div>
                  <div>备注:<span>{{item.note}}</span></div>
                  <div>地点地址:{{item.destination_address}}</div>
                  <baidu-map class="bm-view" :center="{lng: item.longitude, lat: item.latitude}" :zoom="20">
                    <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
                    <bm-marker :position="{lng: item.longitude, lat: item.latitude}">
                      <bm-label content="目的地" :Style="{color: 'red', fontSize : '24px'}" :offset="{height: 30}"/>
                    </bm-marker>
                  </baidu-map>
                </el-col>
                <el-col :span="5" v-if="customPlaceDetail[index]">
                  <h1 style="text-decoration: underline">地点信息</h1>
                  <el-row>城市：<span>{{customPlaceDetail[index].province+'   '+customPlaceDetail[index].city}}</span></el-row>
                  <el-row>地区：<span>{{customPlaceDetail[index].district|judgeNull}}</span></el-row>
                  <el-row>
                    标签：
                    <template v-if="customPlaceDetail[index].tag.length>0">
                      <el-tag v-for="tag in customPlaceDetail[index].tag.split(';')" style="margin-right: 5px;">{{tag}}</el-tag>
                    </template>
                  </el-row>
                  <el-row>
                    地图链接：
                    <el-link type="primary" :href="customPlaceDetail[index].link" v-if="customPlaceDetail[index].link">点击此处</el-link>
                    <el-link type="primary" href="https://map.baidu.com" v-else>无,点击进入百度地图</el-link>
                  </el-row>
                  <el-row>描述：{{customPlaceDetail[index].description|judgeNull}}</el-row>
                </el-col>
              </el-row>
            </el-card>
          </timeline-item>
        </template>
        <timeline-title style="font-size:24px;" :bg-color="hotelColor" >{{`酒店安排(${this.hotelData.length})`}}</timeline-title>
        <template>
          <timeline-item v-if="hotelData.length==0">待添加</timeline-item>
          <timeline-item v-for="(item,index) in hotelData" v-else >
            <span style="font-size:24px;margin-left:15px;">{{formatTime(item)}}</span>
            <el-card>
              <el-row :gutter="20">
                <el-col :span="19">
                  <div>
                    <el-badge class="item" :value="formaterSequence(item.sequence)">
                      <span style="font-weight: bold;font-size:24px;">{{item.destination_name}}</span>
                    </el-badge>
                    <span></span>
                  </div>
                  <div>备注:<span>{{item.note}}</span></div>
                  <div>酒店地址:{{item.destination_address}}</div>
                  <baidu-map class="bm-view" :center="{lng: item.longitude, lat: item.latitude}" :zoom="20">
                    <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
                    <bm-marker :position="{lng: item.longitude, lat: item.latitude}">
                      <bm-label content="目的地" :Style="{color: 'red', fontSize : '24px'}" :offset="{height: 30}"/>
                    </bm-marker>
                  </baidu-map>
                </el-col>
                <el-col :span="5" v-if="hotelDetail[index]">
                  <h1 style="text-decoration: underline">酒店信息</h1>
                  <el-carousel indicator-position="outside" height="160px">
                    <el-carousel-item v-for="url in hotelDetail[index].imageUrls" style="text-align: center" >
                      <img class="hotel-image" :src="url">
                    </el-carousel-item>
                  </el-carousel>
                  <el-row>商圈：<span v-if="hotelDetail[index].businessDistrict">{{hotelDetail[index].businessDistrict|judgeNull}}</span></el-row>
                  <el-row>星级：<span>{{hotelDetail[index].level|judgeNull}}</span></el-row>
                  <el-row>品牌：<span>{{hotelDetail[index].brandName|judgeNull}}</span></el-row>
                  <el-row>联系电话：<span v-if="hotelDetail[index].telephones">{{hotelDetail[index].telephones[0]|judgeNull}}</span></el-row>
                  <el-row>
                    开业时间：<span>{{hotelDetail[index].decorationDate|judgeNull}}</span>
                  </el-row>
                  <el-row>
                    装修时间：<span>{{hotelDetail[index].decorationDate|judgeNull}}</span>
                  </el-row>
                  <el-row>是否有Wifi：<span>{{hotelDetail[index].hasWifi==1?'有':'无'|judgeNull}}</span></el-row>
                  <el-row>
                    特色介绍：
                    <el-tag :key="index" v-for="(tag,index) in hotelDetail[index].tags" style="margin-right:5px;margin-top:5px;margin-bottom:2px;">
                      {{tag}}
                    </el-tag>
                  </el-row>
                  <el-row>简介：{{hotelDescriptionVisible?hotelDetail[index].description:hotelDetail[index].description.substring(0,110)}}<span
                    style="color:#409EFF" @click="switchhotelDescriptionVisible" v-if="hotelDetail[index].description.length>110">.....{{hotelDescriptionVisible
                  ?'收起':'展开'}}</span></el-row>
                </el-col>
              </el-row>
            </el-card>
          </timeline-item>
          <el-card class="box-card" v-if="recommendHotelListVisible&&this.hotelData.length==0" style="width: 70%;">
            <div slot="header" class="clearfix">
              <span><b>为你推荐酒店</b>(点击查看)</span>
              <el-button style="float: right; " type="text" @click="conditionFilterVisible = true">筛选条件</el-button>
              <el-button style="float: right; margin-right:15px;" type="text" @click="recommendHotelListVisible = false">取消推荐</el-button>
            </div>
            <el-carousel :interval="4000" type="card" style="text-align: center" height="180px">
              <el-carousel-item v-for="hotel in recommendHotelList">
                <img class="hotel-image" :src="hotel.imageUrls[0]" v-if="hotel.imageUrls">
                <div class="hotel-image" style="background: #eeeeee" v-else>无图片</div>
                <div style="text-align: center;">
                  <span @click="getDetail(hotel,1)">{{hotel.title}}</span>
                </div>
              </el-carousel-item>
            </el-carousel>
          </el-card>
        </template>
      </timeline>

    </div>
    <delete-itinerary :dialogVisible="deleteItineraryDialogVisible" @on-cancel="deleteItineraryDialogVisible = false" @on-confirm="confirmDeleteItinerary" v-if="itinerarys.length!=0" :data="itinerarys"></delete-itinerary>
    <update-itinerary :dialogVisible="updateItineraryDialogVisible" @on-cancel="confirmUpdateItinerary" :data="itinerarys" v-if="itinerarys.length!=0"></update-itinerary>
    <scene-detail-dialog :dialogVisible="sceneDetailDialogVisible" @on-cancel="sceneDetailDialogVisible = false" :scene_id="scene_id" ></scene-detail-dialog>
    <detail-dialog :dialogVisible="detailDialogVisible" :data="data" @on-close="detailDialogVisible=false" :type="currentType"></detail-dialog>
    <condition-filter :dialogVisible="conditionFilterVisible"  @on-close="conditionFilterVisible=false" @on-submit="getRequiredHotelRecommendation"></condition-filter>
  </div>
</template>

<script>
  import moment from 'moment';
  import {Calendar} from 'ant-design-vue'
  import { Timeline, TimelineItem, TimelineTitle } from 'vue-cute-timeline'
  import {Badge} from 'ant-design-vue'
  import {Alert} from 'ant-design-vue'
  import deleteItinerary from '@/components/itinerary/DeleteItineraryDialog'
  import updateItinerary from '@/components/itinerary/UpdateItineraryDialog'
  import sceneDetailDialog from '@/components/itinerary/SceneDetailDialog'
  import http from '@/api/index'
  import { success, warning,danger } from "@/api/messageTips";
  import {switchScene_type} from "@/api/commonFunction";
  import detailDialog from '@/components/common/DetailDialog'
  import conditionFilter from '@/components/common/ConditionFilter'
    export default {
      components:{
        Timeline,
        TimelineItem,
        TimelineTitle,
        Calendar,
        Badge,
        Alert,
        deleteItinerary,
        updateItinerary,
        sceneDetailDialog,
        detailDialog,
        conditionFilter
      },
      name: "itinerary",
      data(){
        return {
          data:{},
          currentType:0,
          detailDialogVisible:false,
          recommendSceneListVisible:true,
          recommendHotelListVisible:true,
          conditionFilterVisible:false,
          hotel:{},
          itinerarys:[],
          dateDialogVisible:false,
          dialogButtonText:'打开日期框',
          currentDate:new moment().format('YYYY-MM-DD'),
          selectedDate:new moment(),
          sceneColor:'#faad14',
          hotelColor:'#1890ff',
          customizedColor:'#52c41a',
          hotelDescriptionVisible:false,
          imageList:[],
          queryPlaceDetail:'',
          deleteItineraryDialogVisible:false,
          updateItineraryDialogVisible:false,
          sceneDetailDialogVisible:false,
          sceneData:[],
          sceneDetail:[],
          hotelData:[],
          hotelDetail:[],
          customPlaceData:[],
          customPlaceDetail:[],
          weatherData:null,
          scene_id:0,
          events:[],
          yearEvents:[],
          recommendSceneList:[],
          recommendHotelList:[]
        }
      },
      methods: {
        formatTime(item){
          if(item.destination_time){
            return item.destination_date+'\xa0\xa0\xa0'+item.destination_time
          }else{
            return item.destination_date
          }

        },
        openSceneDetail(scene_id){
          this.sceneDetailDialogVisible = true
          this.scene_id = scene_id
        },
        addItinerary(){
          //this.addItineraryDialogVisible = true
          this.$router.push('itinerary/add')
        },
        switchDateDialog(){
          this.getEventsInCalendar()
          this.dateDialogVisible = (this.dateDialogVisible)?false:true
          this.dialogButtonText = (this.dateDialogVisible)?'关闭日期框':'打开日期框'
        },
        formaterSequence(sequence){
          if(sequence=='2'){
            return '非常重要'
          }else if(sequence=='1'){
            return '重要'
          }else{
            return ''
          }
          return sequence
        },
        selectDate(val){
          //console.log(val._d)
        },
        getListData(value) {
          let listData=[];
          let calDate = value.format('YYYY-MM-DD').split('-')
          for (let i = 0; i < this.events.length; i++) {
            let date=this.events[i].destination_date.split("-");//天
            if (calDate[0]===date[0]&&calDate[1]===date[1]&&calDate[2]===date[2]){
              switch (this.events[i].type_id) {
                case 0:
                  listData.push({ type: 'warning', content: this.events[i].destination_name });
                  break;
                case 1:
                  listData.push({ type: 'processing', content: this.events[i].destination_name  });
                  break;
                case 2:
                  listData.push({ type: 'success', content: this.events[i].destination_name })
                  break;
                default:
              }

            }
          }
          return listData || [];
        },
        getMonthData(value) {
          let listData = []
          for(let i = 0; i < this.yearEvents.length; i++){
            if (value.month()==this.yearEvents[i].month){
              switch (this.yearEvents[i].type_id) {
                case 0:
                  listData.push({ type: 'warning', content: '景点行程数 '+this.yearEvents[i].num+'次' });
                  break;
                case 1:
                  listData.push({ type: 'processing', content: '酒店行程数 '+this.yearEvents[i].num+'次' });
                  break;
                case 2:
                  listData.push({ type: 'success', content: '自定义地点行程数 '+this.yearEvents[i].num+'次' })
                  break;
                default:
              }
            }
          }
          return listData
        },
        switchhotelDescriptionVisible(){
          this.hotelDescriptionVisible = (this.hotelDescriptionVisible)?false:true
        },
        confirmUpdateItinerary(){
          this.updateItineraryDialogVisible = false
          this.reload()
        },
        async confirmDeleteItinerary(val){
          let params = []
          val.forEach((a)=>{
            params.push({
              user_id : this.$store.state.user_id,
              destination_date : this.selectedDate.format('YYYY-MM-DD'),
              accord_id:a
            })
          })
          let result = await http.deleteItinerary(params)
          if(result.success){
            success(this)
            this.deleteItineraryDialogVisible = false
            this.reload()
          }else{
            danger(this)
          }
          //请求接口 批量删除行程项列表 参数用户Id和对应id
          //根据回调值 success(this);danger(this)
        },
        async getItinerarys(){
          let params = {
            user_id:this.$store.state.user_id,
            destination_date:this.selectedDate.format('YYYY-MM-DD')
          }
          this.itinerarys = await http.getItineraryByDate(params)//调接口  参数  选择的日期和用户ID 获取所有的行程
          this.divideType()
        },
        divideType(){
          this.sceneData = []
          this.hotelData = []
          this.customPlaceData = []
          if(this.itinerarys.length>0){
            for(var i=0;i<this.itinerarys.length;i++){
              if(this.itinerarys[i].type_id=='0'){
                this.sceneData.push(this.itinerarys[i])
              }
              else if(this.itinerarys[i].type_id=='1'){
                this.hotelData.push(this.itinerarys[i])
              }
              else{
                this.customPlaceData.push(this.itinerarys[i])
              }
            }
          }
          //console.log(this.sceneData)
          this.loadSceneDetailData()
          this.loadCustomPlaceDetailData()
          if(this.hotelData.length>0){
            this.loadHotelData()
          }
        },
        switchScene_type(type_id){
          return switchScene_type(type_id)
        },
        async loadHotelData(){
          let hotel = await http.getHotelDetailByName(this.hotelData[0].destination_name,'杭州');
          hotel = hotel[0]
          hotel.imageUrls = hotel.imageUrls.slice(0,5)
          this.hotelDetail = [].concat([hotel]) 
        }, //调酒店API 参数酒店名称 获取酒店信息
        async loadSceneDetailData(){
          // 遍历this.sce  将scene_id放进去neData
          let params = []
          for(var i=0;i<this.sceneData.length;i++){
            params.push(this.sceneData[i].accord_id)
          }
          if(params.length>0){
            let result = await http.getSceneByIds(params)
            this.sceneDetail = result
          }
        }, //调接口  参数accord_id=scene_id 获取景点信息
        async loadCustomPlaceDetailData(){
          let params = []
          for(var i=0;i<this.customPlaceData.length;i++){
            params.push(this.customPlaceData[i].accord_id)
          }
          if(params.length>0){
            let result = await http.getCustomPlaceByIds(params)
            this.customPlaceDetail = result
          }
        },//调接口   参数accord_id = custom_id 获取自定义地点信息
        async getWeather(newVal){
          //判断在不在七日之内 如果在 则给予当日天气提示 否则提示相应无
          let temp = newVal.format('YYYY-MM-DD')
          let now = moment().format('YYYY-MM-DD');
          let after = moment().add(7,'d').format('YYYY-MM-DD')
          if(temp>=now&&temp<=after){
            this.weatherData = await http.getWeatherByCity('杭州')
          }else{
            this.weatherData = null
          }
          //console.log(this.thatDayWeather)
        },
        async getEventsInCalendar(){
          let params ={
            year:this.selectedDate.year(),
            month:this.selectedDate.month()+1,
            user_id:this.$store.state.user_id
          }
          this.events = await http.doPost('getItineraryInDate',params)
          this.yearEvents = await http.doPost('getItineraryByMonth',params)
        },
        async getSceneRecommendation(){
          let params = {
            user_id:this.$store.state.user_id
          }
          let result = await http.doPost('/getRecommendation',params)
          this.recommendSceneList = eval(result)
        },
        async getHotelRecommendation(){
          this.recommendHotelList = await http.getPopularHotels(this.$store.state.city);
        },
        getRequiredHotelRecommendation(data){
          this.conditionFilterVisible=false
          this.recommendHotelList = data
          //console.log(data)
        },
        getDetail(item,type){
          this.data = item
          this.detailDialogVisible = true
          this.currentType = type
        }
      },
      inject:['reload'],
      watch:{
        async selectedDate(newVal,oldVal){
          this.$store.state.selectedDate = newVal
          this.getWeather(newVal)
          this.getItinerarys()
        },
      },
      computed:{
        thatDayWeather(){
          if(this.weatherData){
            for(var i in this.weatherData.daily){
              if(this.weatherData.daily[i].date==this.selectedDate.format('YYYY-MM-DD')){
                return this.weatherData.daily[i]
              }
            }
          }else{
            return null
          }
        }
      },
      async mounted(){
        this.$store.state.selectedDate = this.selectedDate
        await this.getItinerarys()
        this.getWeather(this.selectedDate)
        this.getSceneRecommendation()
        if(this.hotelData.length===0){
          this.getHotelRecommendation()
        }
      }
    }
</script>
<style scoped>
  .events {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .events .ant-badge-status {
    overflow: hidden;
    white-space: nowrap;
    width: 100%;
    text-overflow: ellipsis;
    font-size: 12px;
  }
  .notes-month {
    text-align: center;
    font-size: 28px;
  }
  .notes-month section {
    font-size: 28px;
  }
  .bm-view {
    width: 100%;
    height: 420px;
  }
  .hotel-image{
    width:80%;
    height:160px;

  }
  .item {
    margin-top: 10px;
    margin-right: 40px;
  }
  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 200px;
    margin: 0;
  }


</style>
