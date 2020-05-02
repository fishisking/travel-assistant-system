<template>
  <el-dialog
    center
    title="景点详情"
    :visible="dialogVisible"
    @close="onCancel"
    width="700px"
    style="text-align: center"
    v-if='dialogVisible'
  >
    <el-row>
      <b>{{scene_id}}号景点详细介绍<hr></b>{{scene_data.scene_detail_info|judgeNull}}
    </el-row>
    <el-row style="margin-top: 12px;">

      <b>小贴士<hr></b><span class="text-wrapper" >{{scene_data.scene_note|judgeNull}}</span>
    </el-row>
    <span slot="footer" class="dialog-footer">
      <el-button @click="onCancel">关闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import http from '@/api/index'
  import {success,danger} from "../../api/messageTips";
  export default {
    data(){
      return {
        scene_data:{}
      }
    },
    props:{
      dialogVisible: {
        type: Boolean,
        default: false
      },
      scene_id:{
        type:Number
      }
    },
    computed:{
      id(){
        return this.scene_id;
      }
    },
    watch:{
      id(newVal,oldVal){
        this.loadSceneData(newVal)
      }
    },
    methods:{
      onCancel(){
        this.$emit('on-cancel');
      },
      async loadSceneData(id) {
        let params = {
          scene_id: id
        }
        console.log(params)
        this.scene_data = await http.getSceneById(params)
      }
    },
    mounted(){
      this.loadSceneData()
    }
  }
</script>

<style scoped>
  .text-wrapper {
    white-space: pre-wrap;
  }
</style>
