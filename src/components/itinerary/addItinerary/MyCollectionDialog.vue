<template>
  <el-dialog
    center
    title="收藏地点"
    :visible="dialogVisible"
    @close="onCancel"
    width="600px">
    <el-table
      ref="singleTable"
      @current-change="handleCurrentChange"
      highlight-current-row
      :data="data"
      style="width: 100%">
      <el-table-column
        prop="collection_id"
        label="收藏编号"
        width="100">
      </el-table-column>
      <el-table-column
        prop="name"
        label="地点名称"
        width="120">
      </el-table-column>
      <el-table-column
        prop="type_id"
        label="地点类型"
        width="120"
        :formatter="formatType"
      >
      </el-table-column>
      <el-table-column
        prop="address"
        label="地点地址">
      </el-table-column>
    </el-table>
    <span slot="footer" class="dialog-footer">
    <el-button @click="cancelSelection">取消选择</el-button>
    <el-button type="primary" @click="onConfirm">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import http from '@/api/index'
  export default {
    name: "CollectionLocationDialog",
    data(){
      return {
        currentRow: null,
        data:[]
      }
    },
    props:{
      dialogVisible: {
        type: Boolean,
        default: false
      },
    },
    methods:{
      formatType(row){
        if(row.type_id==0){
          return '景点'
        }else if(row.type_id==1){
          return '酒店'
        }else{
          return '自定义地点'
        }
      },
      handleCurrentChange(val) {
        this.currentRow = val;
      },
      onCancel(){
        this.$emit('on-cancel');
      },
      cancelSelection(){
        this.$refs.singleTable.setCurrentRow();
      },
      onConfirm(){
        this.$emit('on-confirm',this.currentRow);
      },
      async loadData(){
        this.data = await http.getAllPlaceCollection(this.$store.state.user_id)
      }
    },
    mounted(){
      this.loadData()
    }
  }
</script>

<style scoped>

</style>
