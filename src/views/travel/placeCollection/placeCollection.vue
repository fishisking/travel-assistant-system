<template>
  <div class="container" style="display: flex;flex-direction: row;flex-wrap: wrap;">
    <a-card hoverable style="width: 250px;margin-right:15px;margin-top:15px" v-for="(collection,index) in data">
      <div slot="cover"
           @mouseenter="handleMoveImageEvent(0,index)"
           @mouseleave="handleMoveImageEvent(1,index)">
        <el-image
          alt="example"
          :src="formatType(collection)"
          :class="[{ 'click-image-style': ifMoveImage===index }, 'normal-image-style']"
        ></el-image>
        <el-button-group style="position:absolute;top:50%;left:50%;transform: translate(-50%,-50%);" v-if="ifMoveImage===index">
          <el-button icon="el-icon-search" circle @click="handleDetailDialog(collection)"></el-button>
          <el-button icon="el-icon-aim" circle @click="pinLocation(collection)"></el-button>
          <el-button icon="el-icon-delete" circle @click="deleteItem(collection)"></el-button>
        </el-button-group>
      </div>
      <a-card-meta >
        <template slot="title">
          <span class="title-name" :title="collection.name">{{collection.name}}</span>
        </template>
        <template>
          <div slot="description">
            <span :title="collection.address">{{collection.address}}</span>
            <el-tooltip v-if="collection.note" class="item"  effect="dark" :content="collection.note" placement="bottom-end">
              <el-button circle size="small"><el-icon class="el-icon-reading"></el-icon></el-button>
            </el-tooltip>
          </div>
        </template>
      </a-card-meta>
    </a-card>
    <map-dialog :dialogVisible="locationDialogVisible" :data="mapData" @on-cancel="handleMapDialogClose" v-if="locationDialogVisible"></map-dialog>
    <detail-dialog :dialogVisible="detailDialogVisible"  :data="detailData" @on-close="detailDialogVisible=false" :type="currentType" v-if="detailDialogVisible"></detail-dialog>
  </div>
</template>
<script>
  import {switchType} from "@/api/commonFunction";
  import http from '@/api/index'
  import AListItem from "ant-design-vue/es/list/Item";
  import MapDialog from '@/components/common/MapDialog'
  import detailDialog from '@/components/common/DetailDialog'
  export default {
    components: {
      MapDialog,
      detailDialog
    },
    data(){
      return {
        data:[],
        ButtonGroupVisible:false,
        ifMoveImage:-1,
        locationDialogVisible:false,
        detailDialogVisible:false,
        mapData:{},
        currentType:-1,
        detailData:{}
      }
    },
    methods:{
      async loadData(){
        this.data = await http.getAllPlaceCollection(this.$store.state.user_id)
      },
      handleMoveImageEvent(type,index){
        this.ifMoveImage = type===0?index:-1
      },
      async handleDetailDialog(collection){
        this.currentType = collection.type_id
        let params = {}

        if(collection.type_id===0){
          params.scene_id = collection.accord_id
          this.detailData = await http.doPost('getSceneById',params)
          this.detailDialogVisible = true
        }else if(collection.type_id===1){
          this.detailData = (await http.getHotelDetailByName(collection.name,'杭州'))[0]
          this.detailDialogVisible = true
        }

        console.log(this.detailData)
      },
      formatType(collection){
        if(collection.type_id===0){
          return 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1585048920768&di=06faea0e0059eb8a024c74b6b071a263&imgtype=0&src=http%3A%2F%2Fimg.mp.itc.cn%2Fupload%2F20161221%2F48fae5ee9bb849968d5b6fdb7dc363b3_th.jpg'  //
        }else if(collection.type_id===1){
          return 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1585048974306&di=cf540f5760c41c12cb2355d5bd5db8fd&imgtype=0&src=http%3A%2F%2Fbig.justeasy.cn%2Feffect%2F201706%2F20170622140918_594b5f0e2843f.jpg'
        }
      },
      async deleteItem(collection){
        //调删除接口
        let a = await http.deletePlaceCollection(collection)
        if(a.success){
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.loadData()
        }else{
          this.$message({
            type: 'error',
            message: '删除失败'
          });
        }
      },
      pinLocation(collection){
        this.mapData = collection
        this.locationDialogVisible = true
      },
      handleMapDialogClose(){
        this.locationDialogVisible = false
      }
    },
    mounted(){
      this.loadData()
    }
  }
</script>
<style scoped>
  .click-image-style{
    opacity:0.4;
    filter:alpha(opacity=40);
  }
  .normal-image-style{
    position: relative;
    height:300px;
  }
</style>
