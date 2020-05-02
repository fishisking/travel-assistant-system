<template>
  <div>
    <el-form v-model="form" label-position="top">
      <el-form-item label="填写状态">
        <el-tag :type="(ifCompleted)==true?'success':'info'">{{(ifCompleted)==true?'已填写':'未填写'}}</el-tag>
      </el-form-item>
      <el-form-item label="性别">
        <el-radio-group v-model="form.sex" :disabled="!updateStatus">
          <el-radio :label="1">男</el-radio>
          <el-radio :label="2">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="年龄" >
        <el-input v-model="form.age" :disabled="!updateStatus" style="width: 150px;"></el-input>
      </el-form-item>
      <el-form-item label="工作">
        <el-select v-model="form.professional" :disabled="!updateStatus">
          <el-option v-for="(item,index) in professionalOptions" :label="item.text" :value="item.value" :key="index">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="月收入水平">
        <el-select v-model="form.income" :disabled="!updateStatus">
          <el-option v-for="(item,index) in incomeOptions" :label="item.text" :value="item.value" :key="index">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="旅游风格(推荐使用描述得到更准确的推荐,只可填写一次，不可修改)">
        <el-radio-group v-model="form.style" @change="judgeStyle" :disabled="!updateStatus||this.form.style!=''">
          <el-radio :label="1">自然风光陶醉者</el-radio>
          <el-radio :label="2">户外休闲享受者</el-radio>
          <el-radio :label="3">城市生活观光者</el-radio>
          <el-radio :label="4">运动健身痴迷者</el-radio>
          <el-radio :label="5">展馆演出必到者</el-radio>
          <el-radio :label="6">其他(描述)</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="描述" v-if="descriptionVisible" >
        <el-input v-model="form.description" :disabled="!updateStatus" placeholder="不可为空，填写长度大于5"></el-input>
      </el-form-item>
      <el-form-item>
        <template v-if="updateStatus">
          <el-button type="success" @click="updateUserInformation">保存</el-button>
        </template>
        <template v-else>
          <el-button @click="updateStatus = true" type="primary" >修改</el-button>
        </template>

      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import http from '@/api/index'
  import {success,danger} from "../../api/messageTips";

  export default {
        name: "userInformation",
      data(){
          return {
            descriptionVisible:false,
            updateStatus:false,
            form:{
              user_id:this.$store.state.user_id,
              sex:'',
              age:'',
              professional:'',
              income:'',
              style:'',
              description:''
            },
            ifCompleted:false,
            professionalOptions:[
              {
                text:'国家机关，党群组织，企事业单位的负责人',
                value:'国家机关，党群组织，企事业单位的负责人',
              },
              {
                text:'专业技术人员',
                value:'专业技术人员',
              },
              {
                text:'办事人员和有关人员',
                value:'办事人员和有关人员',
              },
              {
                text:'商业，服务业人员',
                value:'商业，服务业人员',
              },
              {
                text:'农，林，牧，鱼，水利业人员',
                value:'农，林，牧，鱼，水利业人员',
              },
              {
                text:'生产，运输设备操作人员及有关人员',
                value:'生产，运输设备操作人员及有关人员',
              },
              {
                text:'军人',
                value:'军人',
              },
              {
                text:'其他从业人员',
                value:'其他从业人员',
              },

            ],
            incomeOptions:[
              {
                text:'3000以下',
                value:'3000以下',
              },
              {
                text:'3000-5000',
                value:'3000-5000',
              },
              {
                text:'5000-10000',
                value:'5000-10000',
              },
              {
                text:'10000-30000',
                value:'10000-30000',
              },
              {
                text:'大于30000',
                value:'大于30000',
              }
            ]
          }
      },
      watch:{

      },
      methods:{
          judgeStyle(){
            if(this.form.style==6){
              this.descriptionVisible = true
            }else{
              this.descriptionVisible = false
            }
          },
        saveUpdate(){
          this.updateStatus = false
          console.log(this.form)
        },
        async getUserInformation(){
          let params = {
            user_id:this.$store.state.user_id
          }
          let result = await http.doPost('/getUserInformation',params)
          if(result){
            this.form = result
            this.ifCompleted = true
          }else{
            this.ifCompleted = false
          }
        },
        async updateUserInformation(){
            let result = await http.doPost('insertUpdateUserInformation',this.form)
          console.log(result)
          if(result.success){
            success(this,result.log)
            this.updateStatus = false
            this.ifCompleted = true
          }else{
              danger(this)
          }
        }
      },
      mounted(){
          this.getUserInformation()
      }

    }
</script>

<style scoped>

</style>
