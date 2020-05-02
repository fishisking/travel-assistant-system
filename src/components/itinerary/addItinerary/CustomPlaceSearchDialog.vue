<template>
  <el-dialog
    center
    title="选择地点"
    :visible="dialogVisible"
    @close="onCancel"
    width="50%">
    <el-table
      ref="singleTable"
      @current-change="handleCurrentChange"
      highlight-current-row
      :data="data"
      style="width: 100%">
      <el-table-column
        prop="custom_id"
        label="地点编号"
        width="100">
      </el-table-column>
      <el-table-column
        prop="custom_name"
        label="地点名称"
        width="200">
      </el-table-column>
      <el-table-column
        prop="address"
        label="地址">
      </el-table-column>
      <el-table-column
        prop="description"
        label="地点描述">
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
    data(){
      return {
        currentRow: null,
        input:null,
        data:[
          {
            custom_id:'1',
            custom_name:'发展大厦',
            address:'杭州市下城区庆春路26号\n',
            longitude:'50.555',
            latitude:'44.444',
            description:'办公地点'
          },
          {
            custom_id:'4',
            custom_name:'浙江理工大学南门',
            address:'杭州市江干区下沙高教园区2号大街928号',
            longitude:'50.555',
            latitude:'44.444',
            description:'办公地点'
          }
        ]
      }
    },
    props:{
      dialogVisible: {
        type: Boolean,
        default: false
      }
    },
    methods:{
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
      async loadCustomListData(){
        //读取数据
        this.data = await http.getAllCustomPlace(this.$store.state.user_id)
      }
    },
    mounted(){
      this.loadCustomListData()
    }
  }
</script>

<style scoped>

</style>
