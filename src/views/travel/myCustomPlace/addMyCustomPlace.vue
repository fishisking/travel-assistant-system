<template>
  <div>
    <el-page-header @back="goBack" content="增加页面">
    </el-page-header>
    <el-form :model="customizedPlaceForm" label-width="120px" style="margin-top:25px;">
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
    </el-form>
    <el-row style="text-align: center">
      <el-button type="primary" @click="onConfirm">提交</el-button>
      <el-button>清空</el-button>
    </el-row>
    <key-word-place-search :dialogVisible="keyWordPlaceSearchDialogVisible" @on-cancel="keyWordPlaceSearchDialogVisible = false" @on-confirm="confirmkeyWordPlaceSearch"></key-word-place-search>
  </div>
</template>

<script>
  import http from '@/api/index'
  import keyWordPlaceSearch from '@/components/itinerary/addItinerary/KeyWordPlaceSearch'
  import { success, warning,danger } from "@/api/messageTips";
    export default {
        name: "addMyCustomPlace",
      components:{
        keyWordPlaceSearch
      },
        data(){
          return {
            city:'',
            customizedPlaceForm:{
              user_id:'',
              //custom_id:null,//自增长不用填
              custom_name:'',
              address:'',
              longitude:'',
              latitude:'',
              description:null,
              province:'',
              city:'',
              district:'',
              link:'',
              tag:'',
              uid:''
            },
            queryPlaceKw:'',
            suggestion:[],
            keyWordPlaceSearchDialogVisible:false,
          }
        },
        methods:{
          goBack(){
            this.$router.go(-1)
          },
          async onConfirm(){
            //调接口  增加自定义地点
            this.customizedPlaceForm.user_id = this.$store.state.user_id
            let result = await http.insertCustomPlace(this.customizedPlaceForm)
            if(result){
              success(this)
              this.goBack()
            }else{
              danger(this)
            }
          },
          async querySearchAsync(queryString, cb) {
            if(queryString!=''){
              this.suggestion = await http.getPlaceSuggestionByKeyWord(queryString)
              this.suggestion = (this.suggestion[0].uid=='')?this.suggestion.slice(1):this.suggestion//去除第一项 有些是空值
              setTimeout(() => {
                cb(this.suggestion);
              }, 1000 * Math.random());
            }
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
                description += '开放时间:'+a.detail_info.shop_hours+'\n'
              }
              if(a.detail_info.detail_url){
                this.customizedPlaceForm.link = a.detail_info.detail_url
              }

            }
          },
        },
      mounted(){
        this.city = this.$store.state.city
        this.customizedPlaceForm.user_id = this.$store.state.user_id
      }
    }
</script>

<style scoped>

</style>
