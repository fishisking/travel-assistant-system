<template>
  <el-dialog
    @close="cancelLoginOn"
    title="用户登录"
    :visible.sync="dialogVisible"
    width="25%"
    center>
    <el-form label-width="55px" label-position="left" v-model="form">
      <el-form-item label="账号ID"  >
        <el-input style="width:100%;" placeholder="请输入账号ID" v-model="form.user_id"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input style="width:100%;" placeholder="请输入密码" v-model="form.password" type="password"></el-input>
      </el-form-item>
      <el-form-item label="验证码">
        <el-input style="width:80%;" placeholder="请输入验证码" v-model="form.yzm"></el-input>
      </el-form-item>
      <el-form-item>
        <img :src="url+random" height="35" width="120"/>
        <el-link :underline="false" @click="loadCode">切换验证码</el-link>
      </el-form-item>
        <el-checkbox-group v-model="form.loginSettings" style="margin-left:45px">
          <el-checkbox label="3天内免登录" ></el-checkbox>
        </el-checkbox-group>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancelLoginOn">取 消</el-button>
      <el-button type="primary" @click="confirmLoginOn">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import http from '@/api/index'
  import {danger} from "../../api/messageTips";

  export default {
    data() {
      return {
        code:'',
        url:'/api/getCode?',
        random:0,
        form:{
          user_id:'1000',
          password:'123456',
          yzm:'abcd',
          loginSettings:[]
        },

      };
    },
    computed:{
    },
    props:{
      dialogVisible: Boolean
    },
    methods:{
      cancelLoginOn(){
        this.$emit('on-cancel');
      },
      async confirmLoginOn(){
        /*
        直接在此处进行cookie处理就不需要传递登录设置
         */
        let params = this.form
        let result = await http.doPost('/logOn',params)
        if(!result==''){
          //登录成功的情况下
          //result['loginSettings'] = this.form['loginSettings']
          if(params['loginSettings'].indexOf('3天内免登录')>=0){
            //关闭浏览器或者关闭页面 三天内打开直接登录  即用cookie保存用户信息 三天   登录方式保存在localStorage
            this.$cookies.set("user_id", result.user_id,"3d")
            this.$cookies.set("permission", result.permission,"3d")
            this.$cookies.set("user_name", result.user_name,"3d")
          }
          sessionStorage.setItem("user_id",result.user_id)
          sessionStorage.setItem("permission",result.permission)
          sessionStorage.setItem("user_name",result.user_name)
          this.$emit('on-confirm',result);
        }else{
          danger(this)
        }
        //
      },
      async loadCode(){
        //let result = await http.doPost('/getCode')
        //this.code = require(result)
        this.random = Math.random()
      }
    },
    mounted(){
      this.loadCode()
    }
  };
</script>

<style scoped>
</style>
