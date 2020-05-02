<template>
  <div>
    <template v-if="true">
      <div style="margin-bottom:10px;margin-top: 10px;">
        <h1 style="font-size:24px;">今日精选景点推荐</h1>
      </div>
      <div class="hotel-lists" v-if="sceneData.length!=0">
        <el-card class="hotel-card" v-for="scene in sceneData">
          <div slot="header" class="hotel-card-header">
            <el-row>
              <el-col :span="10">{{scene.scene_name}}</el-col>
              <el-col :span="9"><el-rate
                v-model="scene.avg_score"
                disabled
                show-score
                text-color="#ff9900"
                score-template="{value}">
              </el-rate>
              </el-col>
              <el-col :span="5" >
                <span style="font-weight:600;">{{scene.comment_number}}</span>
                <span style="margin-left:2px;">人评</span>
              </el-col>
            </el-row>
          </div>
          <div style="height:150px;">
            <el-row>
              <el-col :span="12">
                <img class="hotel-image" :src="scene.scene_img_src">
              </el-col>
              <el-col :span="12" class="hotel-detail">
                <el-row>质量等级：<span>{{scene.scene_level|judgeNull}}</span></el-row>
                <el-row>景点地区：<span>{{scene.scene_area|judgeNull}}</span></el-row>
                <el-row>景点是否收费：<span>{{formatIsFree(scene.scene_free)|judgeNull}}</span></el-row>
                <el-row>景点类型：<el-tag>{{switchScene_type(scene.scene_type_id)}}</el-tag></el-row>
                <el-row>简略介绍：<span>{{scene.scene_short_info|judgeNull}}</span></el-row>
              </el-col>
            </el-row>
            <el-row style="margin-top:10px;">
              <b>地址&nbsp;</b>
              {{scene.scene_location }}
            </el-row>
          </div>
          <el-divider></el-divider>
          <el-row style="margin:5px 0px 0px 0px;">
            <el-button-group>
              <el-button icon="el-icon-s-promotion" type="primary" size="small" @click="addItinerary(scene,0)">开始行程</el-button>
              <el-button icon="el-icon-star-off" type="warning" size="small" @click="addPlaceCollection(scene)">收藏</el-button>
              <el-button icon="el-icon-zoom-in" type="info" size="small" @click="getDetail(scene,0)">查看详情</el-button>
            </el-button-group>
          </el-row>
        </el-card>
      </div>
    </template>
    <el-divider></el-divider>
    <template v-if="true">
      <div style="margin-bottom:10px;">
        <h1 style="font-size:24px;">今日精选酒店推荐</h1>
      </div>
      <div class="hotel-lists" v-if="hotelData.length!=0">
        <el-card class="hotel-card" v-for="hotel in hotelData.slice(0,12)">
          <div slot="header" class="hotel-card-header">
            <el-row>
              <el-col :span="12">{{hotel.title}}</el-col>
              <el-col :span="8"><el-rate
                v-model="hotel.rating"
                disabled
                show-score
                text-color="#ff9900"
                score-template="{value}">
              </el-rate>
              </el-col>
              <el-col :span="4" >
                <span style="font-weight:600;">{{hotel.commentCount}}</span>
                <span style="margin-left:2px;">人评</span>
              </el-col>
            </el-row>
          </div>
          <el-row>
            <el-col :span="12">
              <img class="hotel-image" :src="hotel.imageUrls[0]">
            </el-col>
            <el-col :span="12" class="hotel-detail">
              <el-row>商圈：<span>{{hotel.businessDistrict|judgeNull}}</span></el-row>
              <el-row>星级：<span>{{hotel.level|judgeNull}}</span></el-row>
              <el-row>品牌：<span>{{hotel.brandName|judgeNull}}</span></el-row>
              <el-row>装修时间：<span>{{hotel.decorationDate|judgeNull}}</span></el-row>
              <el-row>特色介绍：</el-row>
              <el-row>
                <el-tag :key="index" type="info" v-for="(tag,index) in hotel.tags" v-if="index<judgeDetailStatusNumber(hotel)" style="margin-right:5px;margin-top:5px;margin-bottom:2px;">
                  {{tag}}
                </el-tag>
                <span @click="changeOpenDetailHotel(hotel)" v-if="judgeDetailStatus(hotel)">
                {{openDetailHotel == hotel.id?'收缩':'展开'}}
              </span>
              </el-row>
            </el-col>
          </el-row>
          <el-row style="margin-top:10px;">
            <b>地址&nbsp;</b>
            {{hotel.address }}
          </el-row>
          <el-divider></el-divider>
          <el-row>
            <el-button-group>
              <el-button icon="el-icon-s-promotion" type="primary" size="small" @click="addItinerary(hotel,1)">开始行程</el-button>
              <el-button icon="el-icon-star-off" type="warning" size="small" @click="addPlaceCollection(hotel)">收藏</el-button>
              <el-button icon="el-icon-zoom-in" type="info" size="small" @click="getDetail(hotel,1)">查看详情</el-button>
            </el-button-group>
          </el-row>
        </el-card>
      </div>
    </template>
<detail-dialog :dialogVisible="detailDialogVisible" :data="data" @on-close="detailDialogVisible=false" :type="currentType"></detail-dialog>
  </div>
</template>

<script>
  import http from '@/api/index'
  import detailDialog from '@/components/common/DetailDialog'
  import {switchScene_type} from "@/api/commonFunction";
  import { success, warning,danger } from "@/api/messageTips";
  export default {
    name: "Content",
    data(){
      return {
        hotelData:[],
        sceneData:[],
        openDetailHotel:'',
        detailDialogVisible:false,
        data:{},
        currentType:null
      }
    },
    components:{
      detailDialog
    },
    computed:{
    },
    watch:{
      '$store.state.city'(val){
        this.loadHotelData(val)
      }
    },
    methods: {
      async loadHotelData(val){
        this.hotelData = await http.getPopularHotels(val);
      },
      changeOpenDetailHotel(hotel){
        if(this.openDetailHotel == ''){
          this.openDetailHotel = hotel.id
        }
        else if(this.openDetailHotel == hotel.id){
          this.openDetailHotel = ''
        }
        else{
          this.openDetailHotel = ''
          setTimeout(this.openDetailHotel = hotel.id, 1000);
        }
      },
      judgeDetailStatusNumber(hotel){
        if(this.openDetailHotel == hotel.id){
          return 999
        }else{
          return 2;
        }
      },
      judgeDetailStatus(hotel){
        if(hotel.tags){
          if(hotel.tags.length>2){
            return true;
          }else{
            return false;
          }
        }else{
          return false;
        }
      },
      addItinerary(item,type_id){
        item.type_id= type_id
        this.$router.push({name:'addItinerary',params:item})
      },
      async addPlaceCollection(item){
        let params;
        if(item.scene_id){
          let a = await http.getPlaceDetailByKeyWord(item.scene_name)
          let location = a[0].location
          //判断类型  景点类型
          params = {
            user_id:this.$store.state.user_id,
            collection_id:null,
            accord_id:item.scene_id,
            name:item.scene_name,
            type_id:'0',
            address:item.scene_location,
            longitude:location.lng,
            latitude:location.lat
          }
        }else{
          params = {
            user_id:this.$store.state.user_id,
            collection_id:null,
            accord_id:item.id,
            name:item.title,
            type_id:'1',
            address:item.address,
            longitude:item.geoPoint.lon,
            latitude:item.geoPoint.lat
          }
        }
        let result;
        this.$prompt('请输入备注', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(({ value }) => {
          //调接口
          params.note = value
          result = http.insertPlaceCollection(params)
          result.then((res)=>{
            if(res.success){
              success(this)
            }else{
              danger(this)
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      },
      async getLocationAboutScene(kw){
        let location = await http.getPlaceDetailByKeyWord(item.scene_name)
        return location;
      },
      getDetail(item,type){
        this.data = item
        this.detailDialogVisible = true
        this.currentType = type
      },
      async loadSceneData(){
        this.sceneData = await http.getPopularScenes()
      },
      switchScene_type(type_id){
        return switchScene_type(type_id)
      },
      formatIsFree(status){
        if(status==0){
          return '免费或部分收费'
        }else{
          return '收费'
        }
      }
    },
    mounted(){

      this.loadHotelData(this.$store.state.city)
      this.loadSceneData()
    }
  }
</script>

<style scoped>
  .hotel-card{
    width:455px;
    margin:5px;
  }
  .hotel-lists{
    display: flex;
    flex-direction: row;
    flex-wrap:wrap;
  }
  .hotel-image{
    width:200px;
    height:120px;

  }
  .hotel-detail .el-row{
    color:#aaa
  }
  .hotel-detail span{
    color:#303133
  }
</style>
