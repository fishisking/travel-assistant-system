<template>
  <div>
    <el-page-header @back="goBack" content="详情页面" v-if="ifFromQuery">
    </el-page-header>
    <detail-dialog :dialogVisible="detailDialogVisible" :data="data" @on-close="detailDialogVisible=false" :type=0></detail-dialog>
    <el-table
      @filter-change="handleFilterChange"
      :data="tableData"
      style="width: 100%">
      <el-table-column
        sortable
        prop="user_id"
        label="用户编号"
        width="120px">
      </el-table-column>
      <el-table-column
        sortable
        prop="behaviour_time"
        :filters="interval_list"
        :filter-multiple=false
        :filtered-value="filters.interval"
        filter-placement="bottom-end"
        column-key="interval"
        label="行为时间">
      </el-table-column>
      <el-table-column
        label="行为类型"
        prop="behaviour_type_id"
        :filters="behaviour_type_id_list"
        column-key="behaviour_type_id"
        filter-placement="bottom-end">
        <template slot-scope="scope">
          <el-tag :type="switchStyle(scope.row.behaviour_type_id)">{{formatType(scope.row.behaviour_type_id)}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        sortable
        label="游记编号">
        <template slot-scope="scope">
          <span>{{scope.row.log_id+'['+switchScene_type(scope.row.scene_detail.scene_type_id)+']'}}</span>
          <el-link icon="el-icon-view el-icon--right" @click="getLog_detail(scope.row.log_id)"></el-link>
        </template>
      </el-table-column>
      <el-table-column
        sortable
        label="景点编号">
        <template slot-scope="scope">
          <span>{{scope.row.scene_detail.scene_id}}</span>
          <el-link icon="el-icon-view el-icon--right" @click="getScene_detail(scope.row.scene_detail)"></el-link>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="400">
        <template slot="header" slot-scope="scope">
          <el-input
            v-model="filters.user_id"
            size="mini"
            placeholder="输入用户编号，支持模糊查询">
          <el-button slot="append" icon="el-icon-search" @click="handleFilterChange"></el-button>
          </el-input>
        </template>
        <template slot-scope="scope">
          <template v-if="scope.row.comment">
            <el-tooltip :content="scope.row.comment.comment_content" placement="top" >
              <el-button size="small">查看评论</el-button>
            </el-tooltip>
            <el-tooltip placement="bottom">
              <div slot="content">
                <span>情感态度:{{switchSentimentType(scope.row.sentiment_detail.sentiment)}}</span><br/>
                <span>正面概率:{{scope.row.sentiment_detail.positive_prob}}</span><br/>
                <span>负面概率:{{scope.row.sentiment_detail.negative_prob}}</span><br/>
                <span>置信度:{{scope.row.sentiment_detail.confidence}}</span><br/>
                <span>{{formatText(scope.row.sentiment_detail.score,scope.row.scene_detail.scene_type_id,0)}}</span><br/>
              </div>
              <el-button size="small">文本分析</el-button>
            </el-tooltip>
          </template>
          <template v-else>
            <el-tooltip :content="formatText(scope.row.preference_change,scope.row.scene_detail.scene_type_id,scope.row.sentiment_detail,1)" placement="bottom">
              <el-button size="small">兴趣度变化</el-button>
            </el-tooltip>
          </template>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import {switchBehaviourType,switchScene_type} from "../../api/commonFunction";
  import {switchType} from "@/api/commonFunction";
  import http from '@/api/index'
  import detailDialog from '@/components/common/DetailDialog'
  export default {
    components:{
      detailDialog
    },
    data(){
      return {
        tableData:[],
        detailDialogVisible:false,
        ifFromQuery:false,
        behaviour_type_id_list:[
          { text: '点负赞', value: -1 },
          { text: '点赞', value: 1 },
          { text: '评论', value: 0 },
          { text: '收藏', value: 2 },
          { text: '取消收藏', value: -2 },
        ],
        interval_list:[
          {text:'一个月内',value:30},
          {text:'一周内',value:7},
          {text:'三天内',value:3},
        ],
        data:{},
        filters:{
          behaviour_type_id:[],
          interval:[],
          user_id:''
        }
      }
    },
    methods: {
      goBack(){
        this.$router.go(-1)
      },
      handleFilterChange(filters){
        for(var key in filters){
          this.filters[key] = filters[key]
        }
        this.loadData()
      },
      switchSentimentType(type_id){
        if(type_id==0){
          return '负面'
        }else if(type_id==1){
          return '中性'
        }else{
          return '正面'
        }
      },
      formatText(preference_change,type_id,sentiment_detail,kind){
        let text = '对'+this.switchScene_type(type_id)+'类短期兴趣度'
        if(kind==0){
          text += '情感态度'+sentiment_detail.sentiment +'\\r'
          text += '正向概率'+sentiment_detail.positive_prob
        }
        if(preference_change>0){
          text += '增加了'+preference_change
        }else if(preference_change==0){
          text += '无变化'
        }else{
          text += '减少了'+Math.abs(preference_change)
        }
        return text
      },
      async getLog_detail(log_id){
        let params = {
          log_id
        }
        let data = await http.doPost('/getLogById',params)
        this.$router.push({name:'logDetail',params: {log_id:log_id,data:data}})
      },
      getScene_detail(item){
        this.data = item
        this.detailDialogVisible = true
      },
      formatType(type_id){
        return switchBehaviourType(type_id)
      },
      switchScene_type(type_id){
        return switchScene_type(type_id)
      },
      switchStyle(type_id){
        if(type_id==-2){
          return 'warning'
        }
        else if(type_id==-1){
          return 'danger'
        }
        else if(type_id==0){
          return 'info'
        }
        else if(type_id==1){
          return 'success'
        }
        else if(type_id==2){
          return ''
        }
        else{
          return ''
        }
      },

      async loadData(){
        let params = {
          behaviour_type_id_list:this.filters.behaviour_type_id,
          interval:this.filters.interval[0],
          user_id:this.filters.user_id
        }
        this.tableData = await http.doPost('/getUserBehaviourInfoByParam',params)
      }
    },
    mounted(){
      if(Object.keys(this.$route.params).length>0){
        this.ifFromQuery = true
        this.filters.interval.push(this.$route.params.interval)
        this.filters.user_id = this.$route.params.user_id
        this.loadData()

      }else{
        this.ifFromQuery = false
        this.loadData()
      }
    },
    created(){

    }
  }
</script>

<style scoped>

</style>
