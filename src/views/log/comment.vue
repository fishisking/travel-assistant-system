<template>
  <div>
    <el-page-header @back="goBack" content="评论页面">
    </el-page-header>
    <a-list
      class="comment-list"
      :header="`${data.length} 条回复`"
      itemLayout="horizontal"
      :dataSource="data"
    >
      <a-list-item slot="renderItem" slot-scope="item, index">
        <a-comment
          :author="'用户名:'+item.user_id"
          :avatar="circleUrl"
        >
          <a-tooltip slot="datetime">
            <span>{{moment(item.comment_time).from(currentTime.format('YYYY-MM-DD hh:mm:ss'))}}</span>
          </a-tooltip>
          <p slot="content">{{item.comment_content}}</p>
        </a-comment>
      </a-list-item>
    </a-list>
    <el-row>
      <el-col style="width: 50px;">
        <div class="block"><el-avatar :size="40" :src="circleUrl"></el-avatar></div>
      </el-col>
      <el-col :span="22">
        <el-input type="textarea" :rows="4" v-model="input"></el-input>
        <el-button-group style="margin-top: 10px;margin-left:5px;">
          <el-button type="primary" @click="onSubmit">确定</el-button>
          <el-button @click="input=''">清空</el-button>
        </el-button-group>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import moment from 'moment'
  import http from '@/api/index'
  import {success,danger} from "../../api/messageTips";
  export default {
    inject:['reload'],
    methods:{
      goBack(){
        this.$router.go(-1)
      },
      async onSubmit(){
        //调发评论接口
        let params = {
          user_id:this.$store.state.user_id,
          log_id:this.$route.params.log_id,
          comment_content:this.input,
          comment_time:moment().format('YYYY-MM-DD hh:mm:ss')
        }
        let result = await http.doPostBean('/insertComment',params)
        if(result.success){
          this.$message({
            type: 'success',
            message: '评价成功!'
          });
          this.reload()
        }else{
          danger(this)
        }
      },
      async loadData(){
        this.data = await http.doPost('/getLogCommentByLogId',{log_id:this.$route.params.log_id})
        console.log(this.data)
      }
    },
    data () {
      return {
        circleUrl: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
        input:'',
        moment,
        data:[],
        currentTime:moment()
      }
    },
    computed:{


    },
    mounted(){
      this.loadData()
    }
  }
</script>
