<template>
  <div>
    <el-steps :active="active" finish-status="success">
      <el-step title="步骤 1" description="填写出行信息"></el-step>
      <el-step title="步骤 2" description="填写地点信息"></el-step>
    </el-steps>
    <el-form :model="form" label-width="120px" label-position="left" style="margin-top:20px;">
      <template >
        <el-form-item label="出发日期/时间">
          <el-date-picker
            value-format="yyyy-MM-dd"
            v-model="form.destination_date"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
          <el-time-select
            v-model="form.destination_time"
            :picker-options="{
              start: '00:00',
              step: '00:15',
              end: '23:45'
            }"
            placeholder="选择时间,可为空">
          </el-time-select>
        </el-form-item>
        <el-form-item label="重要性">
          <el-slider
            style="width:50%"
            v-model="form.sequence"
            :format-tooltip="formatToolTip"
            :step="1"
            :max="3"
            :min="1"
            show-stops>
          </el-slider>
        </el-form-item>
        <el-form-item label="地点类型">
          <el-select placeholder="请选择类型" v-model="form.type_id" @change="clearForm">
            <el-option value="0" label="景点"></el-option>
            <el-option value="1" label="酒店"></el-option>
            <el-option value="2" label="自定义地点"></el-option>
          </el-select>
          <el-button @click="myCollectionDialogVisible = true">我的收藏</el-button>
        </el-form-item>
        <el-form-item label="行程备注" style="width: 800px">
          <el-input type="textarea" placeholder="请输入行程备注" v-model="form.note"
                    :rows="4">
          </el-input>
          <span style="margin-right:5px;">常用标签</span>
          <span v-for="note in notes"><el-tag style="margin-right:5px;" @click="selectNote(note)">{{note}}</el-tag></span>
        </el-form-item>
      </template>
      <template v-if="form.type_id=='0'&&active==1">
        <el-divider></el-divider>
        <el-form-item label="所在城市">
          <el-input :disabled="true" v-model="city" style="width:30%"></el-input>
        </el-form-item>
        <el-form-item label="景点名称">
          <el-input style="width:70%" v-model="form.destination_name"></el-input>
          <el-button @click="openSceneSelection">查询</el-button>
        </el-form-item>
        <el-form-item label="景点地址">
          <el-input style="width:70%" v-model="form.destination_address"></el-input>
        </el-form-item>
      </template>
      <template v-if="form.type_id=='1'&&active==1">
        <el-divider></el-divider>
        <el-form-item label="所在城市">
          <el-input :disabled="true" v-model="city" style="width:30%"></el-input>
        </el-form-item>
        <el-form-item label="酒店名称">
          <el-input style="width:70%" v-model="form.destination_name"></el-input>
          <el-button @click="hotelSearchDialogVisible = true">查询</el-button>
        </el-form-item>
        <el-form-item label="酒店地址">
          <el-input style="width:70%" v-model="form.destination_address"></el-input>
        </el-form-item>
      </template>
      <template v-else-if="form.type_id=='2'&&active==1">
        <el-divider></el-divider>
        <el-form-item label="地点选择方式">
          <el-switch
            v-model="selectionTypeEqualMyCollection"
            active-text="我的自定义地点"
            inactive-text="新的地点"
          >
          </el-switch>
        </el-form-item>
        <template>
          <template v-if="selectionTypeEqualMyCollection">
            <el-form-item label="我的自定义地点">
              <el-button @click="selectMyCustomPlace">选择地点</el-button>
            </el-form-item>
            <el-form-item label="自定义地点名称">
              <el-input style="width:70%" v-model="form.destination_name" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="自定义地点地址">
              <el-input style="width:70%" v-model="form.destination_address" :disabled="true"></el-input>
            </el-form-item>
          </template>
          <template v-else>
            <el-form-item label="所在城市">
              <el-input :disabled="true" v-model="city" style="width:30%"></el-input>
            </el-form-item>
            <el-form-item label="地点检索" >
              <el-autocomplete v-model="queryPlaceKw" placeholder="请输入地点关键词获取提示"
                               popper-class="my-autocomplete" :fetch-suggestions="querySearchAsync"
                               @select="handleSelect"
              >
                <template slot-scope="props">
                  <div class="name">{{ props.item.name }}</div>
                  <span class="addr">{{ props.item.province+'     '+props.item.city + '     '+props.item.district}}</span>
                </template>
              </el-autocomplete>
              <el-button @click="keyWordPlaceSearchDialogVisible=true">搜索</el-button>
            </el-form-item>
            <el-form-item label="自定义地点名称">
              <el-input placeholder="请输入自定义地点名称" v-model="customizedPlaceForm.custom_name"></el-input>
            </el-form-item>
            <el-form-item label="地点详细地址" >
              <el-input placeholder="请输入详细地址信息" :disabled="true" v-model="customizedPlaceForm.address"></el-input>
            </el-form-item>
            <el-form-item label="地点经纬度">
              <el-input style="width: 150px;" placeholder="经度" :disabled="true" v-model="customizedPlaceForm.longitude"></el-input>
              <el-input style="width: 150px;" placeholder="纬度" :disabled="true" v-model="customizedPlaceForm.latitude"></el-input>
            </el-form-item>
            <el-form-item label="地点链接">
              <el-input :disabled="true" v-model="customizedPlaceForm.link"></el-input>
            </el-form-item>
            <el-form-item label="地点标签">
              <el-input placeholder="请输入地点标签,以;分割多个标签内容" v-model="customizedPlaceForm.tag"></el-input>
            </el-form-item>
            <el-form-item label="地点描述">
              <el-input type="textarea" :rows="4" placeholder="请输入地点描述" v-model="customizedPlaceForm.description"></el-input>
            </el-form-item>
          </template>
        </template>
      </template>

    </el-form>
    <span slot="footer" class="dialog-footer">
    <el-button @click="goBack" v-if="active==0">返回</el-button>
      <el-button @click="active--" v-else>上一步</el-button>
    <el-button type="primary" @click="active++" v-if="active==0">下一步</el-button>
      <el-button type="primary" @click="onConfirm" v-else>确 定</el-button>
  </span>
    <hotel-search :dialogVisible="hotelSearchDialogVisible" @on-cancel="hotelSearchDialogVisible = false" @on-confirm="confirmHotelData"></hotel-search>
    <scene-search :dialogVisible="sceneSearchDialogVisible" @on-cancel="sceneSearchDialogVisible = false" @on-confirm="confirmSceneData"></scene-search>
    <custom-place-search :dialogVisible="customPlaceSearchDialogVisible" @on-cancel="customPlaceSearchDialogVisible = false" @on-confirm="confirmCustomPlace"></custom-place-search>
    <my-collection :dialogVisible="myCollectionDialogVisible" @on-cancel="myCollectionDialogVisible = false"  @on-confirm="confirmMyCollection"></my-collection>
    <key-word-place-search :dialogVisible="keyWordPlaceSearchDialogVisible" @on-cancel="keyWordPlaceSearchDialogVisible = false" @on-confirm="confirmkeyWordPlaceSearch"></key-word-place-search>
  </div>
</template>

<script>
  import http from '@/api/index'
  import {success,danger} from "../../../api/messageTips";
  import sceneSearch from '@/components/itinerary/addItinerary/SceneSearchDialog'
  import hotelSearch from '@/components/itinerary/addItinerary/HotelSearchDialog'
  import customPlaceSearch from '@/components/itinerary/addItinerary/CustomPlaceSearchDialog'
  import myCollection from '@/components/itinerary/addItinerary/MyCollectionDialog'
  import keyWordPlaceSearch from '@/components/itinerary/addItinerary/KeyWordPlaceSearch'
  import moment from 'moment'
  export default {
    components: {
      hotelSearch,
      myCollection,
      sceneSearch,
      customPlaceSearch,
      keyWordPlaceSearch
    },
    data(){
      return {
        city:'',
        active:0,
        selectionTypeEqualMyCollection:false,
        queryPlaceKw:'',
        form:{
          destination_name:'',
          destination_address:'',
          longitude:null,
          latitude:null,
          destination_date:'',
          destination_time:null,
          sequence:0,
          type_id:null,
          accord_id:'',
          note:'',
        },//第一张表单 出行表单
        customizedPlaceForm:{
          //custom_id:null,//自增长不用填
          custom_name:'',
          address:'',
          longitude:'',
          latitude:'',
          description:'',
          province:'',
          city:'',
          district:'',
          link:'',
          tag:'',
          uid:''
        },//第二张表单 自定义地点详情表
        suggestion:[],
        sceneSearchDialogVisible:false,
        customPlaceSearchDialogVisible:false,
        hotelSearchDialogVisible:false,
        myCollectionDialogVisible:false,
        keyWordPlaceSearchDialogVisible:false,
        toolmsg: ['一般', '重要', '十分重要'],
        sceneListData:[],
        customePlaceListData:[],
        notes:[
          '记得带身份证',
          '提前购票',
          '电话联系',
          '出行前查看当地天气预报'
        ]
      }
    },
    methods:{
      async querySearchAsync(queryString, cb) {
        if(queryString!=''){
          this.suggestion = await http.getPlaceSuggestionByKeyWord(queryString)
          this.suggestion = (this.suggestion[0].uid=='')?this.suggestion.slice(1):this.suggestion//去除第一项 有些是空值
          setTimeout(() => {
            cb(this.suggestion);
          }, 1000 * Math.random());
        }
      },
      openMyCollection(){
        this.loadMyCollectionListData()
        this.myCollectionDialogVisible = true
      },
      openSceneSelection(){
        this.sceneSearchDialogVisible = true
      },
      async handleSelect(val){
        let a = await http.getPlaceDetailById(val.uid)
        this.queryPlaceKw = a.name
        Object.keys(this.customizedPlaceForm).forEach((key)=>{
          this.customizedPlaceForm[key] = val[key]
        })
        this.customizedPlaceForm.address = a.address
        this.customizedPlaceForm.custom_name = a.name
        this.customizedPlaceForm.latitude = a.location.lat
        this.customizedPlaceForm.longitude = a.location.lng
        if(a.detail_info){
          this.customizedPlaceForm.tag = a.detail_info.tag
          if(a.detail_info.shop_hours){
            this.customizedPlaceForm.description = '开放时间:'+a.detail_info.shop_hours
          }
          if(a.detail_info.detail_url){
            this.customizedPlaceForm.link = a.detail_info.detail_url
          }
        }
        console.log(this.customizedPlaceForm)
      },
      async onConfirm(){
        let result;
        //vuex 登录模块还没做
        //接口1：添加自定义地点  接口2：添加新行程
        if(this.form.type_id=='2'&&!this.selectionTypeEqualMyCollection){
          this.customizedPlaceForm.user_id = this.$store.state.user_id
          let insertCustomPlaceResult = await http.insertCustomPlace(this.customizedPlaceForm)
          if(insertCustomPlaceResult.success){
            this.form.destination_address = this.customizedPlaceForm.address
            this.form.destination_name = this.customizedPlaceForm.custom_name
            this.form.latitude = this.customizedPlaceForm.latitude
            this.form.longitude = this.customizedPlaceForm.longitude
            this.form.accord_id = insertCustomPlaceResult.message
          }
          result = await http.insertItinerary(this.form)
        }else{
          result = await http.insertItinerary(this.form)
        }
        if(result.data.success){
          success(this)
          this.goBack()
        }else{
          danger(this)
        }
      },
      formatToolTip(index){
        return this.toolmsg[index-1]
      },
      goBack(){
        this.$router.go(-1)
      },
      confirmHotelData(val){
        this.hotelSearchDialogVisible = false
        this.form.accord_id = val.id
        this.form.destination_name = val.title
        this.form.destination_address = val.address
        this.form.latitude = val.geoPoint.lat
        this.form.longitude = val.geoPoint.lon
      },
      async confirmSceneData(val){
        this.sceneSearchDialogVisible = false
        this.form.accord_id = val.scene_id
        this.form.destination_name = val.scene_name
        this.form.destination_address = val.scene_location
        let details = await http.getPlaceDetailByKeyWord(this.form.destination_name)
        this.form.latitude = details[0].location.lat
        this.form.longitude = details[0].location.lng
      },
      confirmCustomPlace(val){
        this.customPlaceSearchDialogVisible = false
        this.form.accord_id = val.custom_id
        this.form.destination_name = val.custom_name
        this.form.destination_address = val.address
        this.form.latitude = val.latitude
        this.form.longitude = val.longitude
        console.log(this.form)
      },
      confirmMyCollection(val){
        this.myCollectionDialogVisible = false
        this.form.type_id = val.type_id+''
        console.log(val)
        if(this.form.type_id=='0'){
          //景点自动填充后面的表单项
          this.active =1
          this.form.accord_id = val.accord_id
          this.form.destination_name = val.name
          this.form.destination_address = val.address
          this.form.longitude = val.longitude
          this.form.latitude = val.latitude
        }else if(this.form.type_id=='1'){
          this.active =1
          this.form.accord_id = val.accord_id
          this.form.destination_name = val.name
          this.form.destination_address = val.address
          this.form.longitude = val.longitude
          this.form.latitude = val.latitude
          //酒店自动填充后面的表单项
        }
      },
      async confirmkeyWordPlaceSearch(val){
        //this.queryPlaceKw = val.name
        this.keyWordPlaceSearchDialogVisible = false
        Object.keys(this.customizedPlaceForm).forEach((key)=>{
          this.customizedPlaceForm[key] = val[key]
        })
        this.customizedPlaceForm.address = val.address
        this.customizedPlaceForm.custom_name = val.name
        this.customizedPlaceForm.latitude = val.location.lat
        this.customizedPlaceForm.longitude = val.location.lng
        this.customizedPlaceForm.district = val.area
        let a = await http.getPlaceDetailById(val.uid)
        if(a.detail_info){
          this.customizedPlaceForm.tag = a.detail_info.tag
          if(a.detail_info.shop_hours){
            this.customizedPlaceForm.description = '开放时间:'+a.detail_info.shop_hours
          }
          if(a.detail_info.detail_url){
            this.customizedPlaceForm.link = a.detail_info.detail_url
          }
        }
        console.log(this.customizedPlaceForm)
      },
      selectMyCustomPlace(){
        this.customPlaceSearchDialogVisible = true
      },
      clearForm(){
        this.form.destination_name = null
        this.form.destination_address = null
        this.form.latitude = null
        this.form.longitude = null
        this.form.accord_id = null
      },
      selectNote(note){
        this.form.note += note + '\n'
        console.log(note)
      },
      initParams(){
        this.city = this.$store.state.city
        this.form.user_id = this.$store.state.user_id
        this.customizedPlaceForm.user_id = this.$store.state.user_id
        if(this.$store.state.selectedDate){
          this.form.destination_date = this.$store.state.selectedDate.format('YYYY-MM-DD')
        }
        this.form.destination_date = new moment().format('YYYY-MM-DD')
        console.log(this.form)
      }
    },
    mounted(){
      this.initParams()
      if(this.$route.params){
          if(this.$route.params.type_id==1){
            this.form.type_id='1'
            this.active++
            this.confirmHotelData(this.$route.params)
          }
          else if(this.$route.params.type_id==0){
            this.form.type_id='0'
            this.active++
            this.confirmSceneData(this.$route.params)
          }
      }
    }
  }
</script>

<style scoped>
  .name {
    text-overflow: ellipsis;
    overflow: hidden;
    line-height:14px;
    margin-top: 10px;
  }
  .addr {
    font-size: 12px;
    color: #b4b4b4;
  }
  .my-autocomplete li{
    padding:7px;
  }
</style>
