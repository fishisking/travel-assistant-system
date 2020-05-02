<template>
  <div>
    <el-dialog
      @before-close="cancel"
      title="条件选择"
      :visible.sync="dialogVisible"
      width="40%"
      center>
      <template>
        <el-form  v-model="form">
          <el-form-item label="排序方式">
            <el-radio-group v-model="form.sortByField" size="small">
              <el-radio-button label="">综合排序</el-radio-button>
              <el-radio-button label="price">按价格</el-radio-button>
              <el-radio-button label="rating">按评分</el-radio-button>
              <el-radio-button label="star">按星级</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="星级">
            <el-select v-model="form.level">
              <el-option :value="'五星级/豪华'" label="五星级/豪华"></el-option>
              <el-option :value="'四星级/高档'" label="四星级/高档"></el-option>
              <el-option :value="'三星级/舒适'" label="三星级/舒适"></el-option>
              <el-option :value="'二星级/经济'" label="二星级/经济"></el-option>
              <el-option :value="'客栈/公寓'" label="客栈/公寓"></el-option>
              <el-option :value="'其他'" label="其他"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="经纬度 (必须搭配经纬度以及距离一起使用才能生效)">
            <el-input placeholder="请点击选择地图定位或者地点" v-model="location">
              <el-button slot="prepend" icon="el-icon-s-flag" @click="getLocationByPlace"></el-button>
              <el-button slot="append" icon="el-icon-rank" @click="getLocationByMap"></el-button>
            </el-input>
          </el-form-item>
          <el-form-item label="距离范围 (必须搭配纬度以及距离一起使用才能生效)">
            <el-select v-model="form.distance">
              <el-option label="1KM" :value="'1km'"></el-option>
              <el-option label="3KM" :value="'3km'"></el-option>
              <el-option label="5KM" :value="'5km'"></el-option>
            </el-select>
          </el-form-item>
        </el-form>


      </template>
      <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="onSubmit">确定</el-button>
      <el-button @click="cancel">关闭</el-button>
    </span>
    </el-dialog>
    <el-dialog title="获取地点经纬度"
               append-to-body
               :visible.sync="locationDialogVisible"
               v-if="getLocationType == 0"
    >
      <template >
        选择行程地点
        <el-select v-model="itineraryPlace" value-key="accord_id">
          <el-option v-for="item in itinerarys" :label="item.destination_name" :value="item" :key="item.accord_id"></el-option>
        </el-select>
        <el-button type="primary" @click="chooseItinerary">确定</el-button>
      </template>
    </el-dialog>
    <el-dialog title="定位设置" :visible.sync="mapVisible" :fullscreen=true  id="mapDialog" :close-on-click-modal="false" @close="confirmMapLocation">
      <baidu-map  class="map" :center="center" :zoom="zoom" @ready="handler" v-if="getLocationType == 1"
                  :scroll-wheel-zoom="true"
                  @click="clickEvent"
                  ak="33B192o1jPaqOHASGGAIkoMuwi8W76j3">
        <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
        <bm-city-list anchor="BMAP_ANCHOR_TOP_LEFT"></bm-city-list>
        <bm-geolocation anchor="BMAP_ANCHOR_BOTTOM_RIGHT"  :showAddressBar="true" :autoLocation="true" @locationSuccess="getLoctionSuccess" ></bm-geolocation>
        <bm-view :style="{width:'100%',height: this.clientHeight+'px',flex: 1,marginBottom:'-30px'}"></bm-view>
      </baidu-map>
      <div class="demo-input-suffix" >
        <el-link type="info">lng：</el-link><el-input  class="lineinput"  style="width:200px" size="mini" v-model.number="locData.longitude"></el-input>
        <el-link type="info">lat：</el-link><el-input  class="lineinput"  style="width:200px" size="mini" v-model.number="locData.latitude"></el-input>
        <el-link type="info">address：</el-link><el-input  class="lineinput"  style="width:200px" size="mini" v-model="locData.address"></el-input>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="warning"  size="small" icon="el-icon-close" @click.native="mapVisible = false">取消</el-button>
        <el-button type="primary" size="small" icon="el-icon-check" @click.native="findlocation">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {BaiduMap,BmNavigation,BmView,BmGeolocation,BmCityList} from 'vue-baidu-map'
  import {switchScene_type} from "@/api/commonFunction";
  import http from '@/api/index'
  export default {
    name: "detailDialog",
    data(){
      return {
        hotelDescriptionVisible:false,
        locationDialogVisible:false,
        mapVisible:false,
        getLocationType:0,
        form:{
          sortByField:'',
          level:'',
          distance:'',
          lon:'',
          lat:'',
          city:this.$store.state.city
        },
        itinerarys:[],
        accord_id:'',
        itineraryPlace:{},
        center: {lng: 121.833138, lat: 39.081725},
        zoom: 12,
        mapVisible:false,
        locData:{
          longitude:'',
          latitude:'',
          address:'',
        },
        clientHeight:document.documentElement.clientHeight-90, // 屏幕高度
      }
    },
    computed:{
      location(){
        if(this.form.lon&&this.form.lat){
          return this.form.lon+','+this.form.lat
        }else{
          return ''
        }
      }
    },
    watch:{

    },
    components:{
      BaiduMap,
      BmNavigation,
      BmView,
      BmGeolocation,
      BmCityList
    },
    props:{
      dialogVisible: Boolean,
      data:{
        type:Object
      },
      type:Number
    },
    watch:{
    },
    methods:{
      handler ({BMap, map}) {
        let _this = this;	// 设置一个临时变量指向vue实例，因为在百度地图回调里使用this，指向的不是vue实例；
        var geolocation = new BMap.Geolocation();
        geolocation.getCurrentPosition(function(r){
          console.log(r);
          _this.center = {lng: r.longitude, lat: r.latitude};		// 设置center属性值
          _this.autoLocationPoint = {lng: r.longitude, lat: r.latitude};		// 自定义覆盖物
          _this.initLocation = true;
        },{enableHighAccuracy: true})

        window.map = map;
      },
      //点击地图监听
      clickEvent(e){
        map.clearOverlays();
        let a = require('../../../static/fly.png')
        let Icon_0 = new BMap.Icon(a, new BMap.Size(64, 64), {anchor: new BMap.Size(18, 32),imageSize: new BMap.Size(36, 36)});
        var myMarker = new BMap.Marker(new BMap.Point(e.point.lng, e.point.lat),{icon: Icon_0});
        map.addOverlay(myMarker);
        //用所定位的经纬度查找所在地省市街道等信息
        var point = new BMap.Point(e.point.lng, e.point.lat);
        var gc = new BMap.Geocoder();
        let _this = this;
        gc.getLocation(point, function (rs) {
          var addComp = rs.addressComponents;
          //console.log(rs.address);//地址信息
          _this.locData.address = rs.address;

        });
        this.locData.longitude = e.point.lng;
        this.locData.latitude = e.point.lat;
      },
      //定位成功回调
      getLoctionSuccess(point, AddressComponent, marker){
        map.clearOverlays();
        let a = require('../../../static/fly.png')
        let Icon_0 = new BMap.Icon(a, new BMap.Size(64, 64), {anchor: new BMap.Size(18, 32),imageSize: new BMap.Size(36, 36)});
        var myMarker = new BMap.Marker(new BMap.Point(point.point.lng, point.point.lat),{icon: Icon_0});
        map.addOverlay(myMarker);
        this.locData.longitude = point.point.lng;
        this.locData.latitude = point.point.lat;
      },
      findlocation(){
        this.$emit("findlocdata",this.locData)
        this.mapVisible = false
      },
      confirmMapLocation(){
        this.form.lon = this.locData.longitude
        this.form.lat = this.locData.latitude

      },
      chooseItinerary(){
        this.locationDialogVisible = false
        this.form.lon = this.itineraryPlace.longitude
        this.form.lat = this.itineraryPlace.latitude
      },
      async getLocationByPlace(){
        this.getLocationType = 0
        this.locationDialogVisible = true
        let params = {
          user_id:this.$store.state.user_id,
          destination_date:this.$store.state.selectedDate.format('YYYY-MM-DD')
        }
        this.itinerarys =  await http.getItineraryByDate(params)//调接口  参数  选择的日期和用户ID 获取所有的行程
        //console.log(this.itinerarys)
      },
      getLocationByMap(){
        this.getLocationType = 1
        this.mapVisible = true
      },
      cancel(){
        this.$emit('on-close')
      },
      async onSubmit(){
        let params = this.form
        let result = await http.getHotelByParameter(params)
        this.$emit('on-submit',result)
        //this.$emit('on-close')
      }
    },
    mounted(){

    }
  }
</script>

<style scoped>
  .hotel-image{
    width:200px;
    height:200px;

  }
  .item {
    margin-top: 10px;
    margin-right: 40px;
  }
  .hotel-detail .el-row{
    color:#aaa;
    margin-top:10px;
  }
  .hotel-detail span{
    color:#303133
  }
  .text-wrapper {
    white-space: pre-wrap;
  }
</style>
