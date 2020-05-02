<template>
  <el-dialog
    center
    title="删除行程"
    :visible="dialogVisible"
    @close="onCancel"
    width="700px"
  >
    <el-transfer
      v-model="delete_data"
      :data="data" :props="{key: 'accord_id',label: 'destination_name'}"
      :titles="titles"
    ></el-transfer>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="onConfirm">确定</el-button>
      <el-button @click="onCancel">取消</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import http from '@/api/index'
  export default {
    data(){
      return {
        delete_data:[],
        titles:['行程列表','删除项']
      }
    },
    props:{
      dialogVisible: {
        type: Boolean,
        default: false
      },
      data:{

      }
    },
    methods:{
      onCancel(){
        this.$emit('on-cancel');
      },
      onConfirm(){
        this.$emit('on-confirm',this.delete_data);
      }
    },
    mounted(){

    }
  }
</script>

<style scoped>

</style>
