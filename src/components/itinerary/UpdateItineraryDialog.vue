<template>
  <el-dialog
    center
    title="修改行程"
    :visible="dialogVisible"
    @close="onCancel"
    width="700px"
    style="text-align: center"
  >
    <el-form :model="form" label-position="left" ref="formData">
      <el-form-item label="选择行程">
        <el-select v-model="accord_id" @change="selectItinerary">
          <el-option v-for="item in data" :label="item.destination_name" :value="item.accord_id"></el-option>
        </el-select>
        <span style="margin-left: 10px;">
          <b>{{'出发日期:'+data[0].destination_date}}</b>
        </span>
      </el-form-item>
      <el-form-item label="出发日期/时间">
        <el-date-picker
          value-format="yyyy-MM-dd"
          v-model="form.destination_date"
          type="date"
          placeholder="选择日期">
        </el-date-picker>
        <el-time-select
          v-model="form.destination_time"
          :picker-options="{
              start: '00:00',
              step: '00:15',
              end: '23:45'
            }"
          placeholder="选择时间,可为空">
        </el-time-select>
      </el-form-item>
      <el-form-item prop="sequence">
        <span>重要性</span>
        <el-slider
          v-model="form.sequence"
          :format-tooltip="formatToolTip"
          :step="1"
          :max="3"
          :min="1"
          show-stops>
        </el-slider>
      </el-form-item>
      <el-form-item label="行程备注" prop="note">
        <el-input type="textarea" placeholder="请输入行程备注" v-model="form.note"
                  :rows="4">
        </el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="onConfirm" :disabled="accord_id==''">确定</el-button>
      <el-button @click="onCancel">取消</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import http from '@/api/index'
  import {success,danger} from "../../api/messageTips";
  export default {
    data(){
      return {
        accord_id:'',
        options:[],
        form:{
          destination_date:'',
          destination_time:'',
          sequence:0,
          note:null
        },
        selectedOption:null,
        toolmsg: ['一般', '重要', '十分重要'],
      }
    },
    props:{
      dialogVisible: {
        type: Boolean,
        default: false
      },
      data:{}
    },
    methods:{
      formatToolTip(index){
        return this.toolmsg[index-1]
      },
      onCancel(){
        this.$refs.formData.resetFields();
        this.$emit('on-cancel');
      },
      async onConfirm(){
        //调用接口 后端检查什么字段修改过了 然后进行修改
        this.form.user_id = this.$store.state.user_id
        let result = await http.doPostBean('updateItinerary',this.form)
        if(result.success){
          success(this)
          this.onCancel()
          setTimeout(()=>{
            this.$router.go(0)
          }, 1500);
        }else{
          danger(this)
        }
      },
      selectItinerary(val){
        for(let i=0;i<this.data.length;i++){
          if(this.data[i].accord_id==val){
            this.form.destination_date = this.data[i].destination_date
            this.form.destination_time = this.data[i].destination_time
            this.form.note = this.data[i].note
            this.form.sequence = this.data[i].sequence
            this.form.accord_id = this.data[i].accord_id
            this.selectedOption = i
          }
        }
      }
    },
    mounted(){
    }
  }
</script>

<style scoped>

</style>
