<template>
  <el-dialog
    @close="cancelRegister"
    title="用户注册"
    :visible.sync="dialogVisible"
    width="25%"
    center>
    <el-form label-width="70px" label-position="left" v-model="form">
      <el-form-item label="用户名">
        <el-input style="width:100%;" placeholder="请输入用户名" v-model="form.user_name"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input style="width:100%;" placeholder="请输入密码" v-model="form.password"></el-input>
      </el-form-item>
      <el-form-item label="注册类型" >
        <el-radio-group v-model="form.permission">
          <el-radio :label="0">普通用户</el-radio>
          <el-radio :label="1">管理员</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancelRegister">取 消</el-button>
      <el-button type="primary" @click="confirmRegister">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import http from '@/api/index'
  import {success,danger} from "../../api/messageTips";
  export default {
    data() {
      return {
        form:{
          user_name:'',
          password:'',
          permission:0
        }
      };
    },
    computed:{
    },
    props:{
      dialogVisible: Boolean
    },
    methods:{
      cancelRegister(){
        this.$emit('on-cancel');
      },
      async confirmRegister(){
        let account = this.form
        let result = await http.doPostBean('/registerAccount',account)
        if(result.success){
          this.$notify({
            title: '注册成功',
            message: '注册ID'+result.info.user_id+'\n密码'+result.info.password+'\n请凭此登录',
            duration: 10000,
            type:'success'
          });
          this.$emit('on-confirm',result.info);
        }else{
          danger(this)
        }

      }
    }
  };
</script>

<style scoped>
</style>
