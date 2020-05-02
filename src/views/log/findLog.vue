<template>
  <div>
    <el-tag v-for="(tag,index) in tags" style="margin-right:8px;" :type="index==activeTag?'':tag.type" :effect="index==activeTag?'plain':tag.effect" @click="changeShowSceneType(index)">{{tag.text}}</el-tag>
    <a-list
      itemLayout="vertical"
      size="large"
      :pagination="pagination"
      :dataSource="data"
    >
      <a-list-item slot="renderItem" slot-scope="item, index" key="item.comment_id">
        <template slot="actions" v-for="{type, text,message} in actions" v-if="activeActions.length>0">
        <span :key="type" @click="switchAction(text,item,index)">
          <a-icon :type="type" style="margin-right: 8px" :theme="formatIconType(index,message)" :ref="type+index"/>
          {{formatText(text,index)}}
        </span>
        </template>
        <img slot="extra" width="272" alt="logo" :src="item.img_srcs[0]" height="180" v-if="item.img_srcs.length>0" />
        <a-list-item-meta
          :description="item.scene_name"
        >
          <span slot="title" v-html="item.log_title"></span>
          <a-avatar slot="avatar" :src="item.avator" />
        </a-list-item-meta>
        <span v-html="item.log_content.substring(0,200)+'......'"></span>
      </a-list-item>
    </a-list>
  </div>
</template>
<script>
  import http from '@/api/index'
  import moment from 'moment'
  import {info} from "../../api/messageTips";

  export default {
    methods:{
      changeShowSceneType(index){
        this.activeTag = index
      },
      formatText(text,index){
        if(text=='评论'){
          return this.activeActions[index].comment_number+'条评论'
        }
        else if(text=='收藏'){
          if(this.activeActions[index].collection==1){
            return '取消收藏'
          }else{
            return text
          }
        }
        else{
          return text;
        }
      },
      formatIconType(index,message){
        if(message=='like'){
          if(this.activeActions[index]['like']==1){
            return 'filled'
          }else{
            return 'outlined'
          }
        }
        else if(message=='dislike'){
          if(this.activeActions[index]['like']==-1){
            return 'filled'
          }else{
            return 'outlined'
          }
        }
        else if(message=='collection'){
          if(this.activeActions[index][message]==1){
            return 'filled'
          }else{
            return 'outlined'
          }
        }
        else{
          return 'outlined'
        }
      },
      switchAction(text,item,index){
        if(text=='评论'){
          this.comment(item.log_id)
        }
        else if(text=='查看'){
          this.getDetail(item.log_id,item)
        }
        else if(text=="喜欢"){
          this.like(item,index)
        }
        else if(text=='不喜欢'){
          this.dislike(item,index)
        }
        else if(text=='收藏'){
          this.addCollection(item,index)
        }
      },

      async addCollection(item,index){
        let params = {
          user_id:this.$store.state.user_id,
          log_id:item.log_id,
          collect_time:moment().format('YYYY-MM-DD hh:mm:ss')
        }
        let result;
        if(this.activeActions[index].collection==1){
          result = await http.doPostBean('/deleteLogCollection',params)
        }else{
          result = await http.doPostBean('/insertLogCollection',params)
        }
        if(result.success){
          this.getActiveActions()
        }
      },
      async like(item,index){
        let params = {
          user_id:this.$store.state.user_id,
          log_id:item.log_id,
          behaviour_type_id:1,
          behaviour_time:moment().format('YYYY-MM-DD hh:mm:ss')
        }
        if(this.activeActions[index].like==1){
          //提示已点赞
          info(this)
        }else{
          let result = await http.doPostBean('/insertUserBehaviour',params)
          if(result.success){
            this.getActiveActions()
          }
        }
      },
      async dislike(item,index){
        let params = {
          user_id:this.$store.state.user_id,
          log_id:item.log_id,
          behaviour_type_id:-1,
          behaviour_time:moment().format('YYYY-MM-DD hh:mm:ss')
        }
        if(this.activeActions[index].like==-1){
          //提示已点赞
          info(this)
        }else{
          let result = await http.doPostBean('/insertUserBehaviour',params)
          if(result.success){
            this.getActiveActions()
          }
        }
      },
      comment(log_id){
        this.$router.push({name:'comment',params: {log_id}})
      },
      getDetail(log_id,item){
        this.$router.push({name:'logDetail',params: {log_id:log_id,data:item}})
      },
      async loadData(){
        this.data = await http.doPost('/getLogsBySceneTypeId',{scene_type_id:this.activeTag-1})
        for(let i=0;i<this.data.length;i++){
          this.data[i].img_srcs = this.data[i].img_src.split(' ')
        }
      },
      async getActiveActions(){
        let log_ids = []
        for(let i=0;i<3;i++){
          log_ids.push(this.data.slice((this.page-1)*3,this.page*3)[i].log_id)
        }
        let params = {
          log_ids:log_ids,
          user_id:Number(this.$store.state.user_id)
        }
        this.activeActions = await this.http.doPostBean('/getLogActionRecord',params)
      }
    },
    watch:{
      async activeTag(){
        await this.loadData()
        this.getActiveActions()
      },
      page(){
        this.getActiveActions()
      }
    },
    data () {
      return {
        data:[],
        tags:[
          {text:'全部',type:'info',effect:'light'},
          {text:'自然风光 20',type:'info',effect:'light'},
          {text:'文化古迹 20',type:'info',effect:'light'},
          {text:'农家度假 20',type:'info',effect:'light'},
          {text:'游乐场 20',type:'info',effect:'light'},
          {text:'户外运动 19',type:'info',effect:'light'},
          {text:'展馆表演 20',type:'info',effect:'light'},
          {text:'公园类 17',type:'info',effect:'light'},
          {text:'运动健身 20',type:'info',effect:'light'},
          {text:'城市观光 20',type:'info',effect:'light'},
          {text:'水活动 20',type:'info',effect:'light'},
        ],
        activeActions:[],
        activeTag:0,
        pagination: {
          onChange: (page) => {
            this.page = page
          },
          pageSize: 3,
        },
        page:1,
        actions: [
          { type: 'star-o', text: '收藏',message:'collection'},
          { type: 'like-o', text: '喜欢',message:'like'},
          { type: 'dislike-o', text: '不喜欢',message:'dislike'},
          { type: 'message', text: '评论',message:'comment'},
          { type :"ellipsis",text:'查看',message:'getDetail'}
        ],
      }
    },
    async mounted(){
      await this.loadData()
      await this.getActiveActions()
    }
  }
</script>
<style>

</style>
