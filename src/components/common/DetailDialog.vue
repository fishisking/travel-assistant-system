<template>
  <el-dialog
    title="详情页面"
    :visible.sync="dialogVisible"
    width="40%"
    center>
    <template v-if="type==0">
      <div style="text-align: center;">
        <img class="hotel-image" :src="data.scene_img_src">
      </div>
      <div class="hotel-detail">
        <el-row>景点地址：<span>{{data.scene_location}}</span></el-row>
        <el-row>开放时间：<span>{{data.opening_hours |judgeNull}}</span></el-row>
        <el-row>详细介绍：<span>{{data.scene_detail_info |judgeNull}}</span></el-row>
        <el-row>
          <b>小贴士<hr></b><span class="text-wrapper" >{{data.scene_note|judgeNull}}</span>
        </el-row>
      </div>
    </template>
    <template v-if="type==1">
      <el-carousel indicator-position="outside" height="160px" v-if="data.imageUrls">
        <el-carousel-item v-for="url in data.imageUrls.slice(0,5)" style="text-align: center" >
          <img class="hotel-image" :src="url">
        </el-carousel-item>
      </el-carousel>
      <div class="hotel-detail">
        <el-row>酒店地址：<span>{{data.address}}</span></el-row>
        <el-row>商圈：<span v-if="data.businessDistrict">{{data.businessDistrict|judgeNull}}</span></el-row>
        <el-row>星级：<span>{{data.level|judgeNull}}</span></el-row>
        <el-row>品牌：<span>{{data.brandName|judgeNull}}</span></el-row>
        <el-row>联系电话：<span v-if="data.telephones">{{data.telephones[0]|judgeNull}}</span></el-row>
        <el-row>
          开业时间：<span>{{data.decorationDate|judgeNull}}</span>
        </el-row>
        <el-row>
          装修时间：<span>{{data.decorationDate|judgeNull}}</span>
        </el-row>
        <el-row>是否有Wifi：<span>{{data.hasWifi==1?'有':'无'|judgeNull}}</span></el-row>
        <el-row>简介：<span>{{hotelDescriptionVisible?data.description:data.description.substring(0,110)}}</span><span
          style="color:#409EFF" @click="switchhotelDescriptionVisible" v-if="data.description.length>110">.....{{hotelDescriptionVisible
                  ?'收起':'展开'}}</span></el-row>
      </div>
    </template>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="addItinerary(data,type)">加入行程</el-button>
      <el-button @click="cancel">关闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import {switchScene_type} from "@/api/commonFunction";
    export default {
        name: "detailDialog",
      data(){
          return {
            hotelDescriptionVisible:false,
          }
      },
      props:{
        dialogVisible: Boolean,
        data:{
          type:Object
        },
        type:Number
      },
      methods:{
        addItinerary(item,type_id){
          item.type_id= type_id
          this.$router.push({name:'addItinerary',params:item})
        },
        cancel(){
          this.$emit('on-close')
        },
        switchhotelDescriptionVisible(){
          this.hotelDescriptionVisible = (this.hotelDescriptionVisible)?false:true
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
          console.log(this.data)
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
