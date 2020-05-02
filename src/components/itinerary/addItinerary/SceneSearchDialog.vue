<template>
  <el-dialog
    center
    title="选择景点"
    :visible="dialogVisible"
    @close="onCancel"
    width="50%">
    <el-form>
      <el-form-item label="景点名">
        <el-input
          style="width: 500px;"
          placeholder="请输入景点名"
          v-model="input">
        </el-input>
        <el-button @click="querySceneByKw">搜索</el-button>
      </el-form-item>
    </el-form>
    <el-table
      ref="singleTable"
      @current-change="handleCurrentChange"
      highlight-current-row
      :data="showData"
      style="width: 100%">
      <el-table-column
        prop="scene_id"
        label="景点编号"
        width="140">
      </el-table-column>
      <el-table-column
        prop="scene_name"
        label="景点名称"
        width="280">
      </el-table-column>
      <el-table-column
        prop="scene_type_id"
        label="景点类型"
        :formatter="formateType"
        width="120">
      </el-table-column>
      <el-table-column
        prop="scene_location"
        label="景点地址">
      </el-table-column>
    </el-table>
    <el-pagination
      :page-size="pageSize"
      :current-page.sync="pageNumber"
      style="margin-top: 15px;"
      background
      small
      layout="prev, pager, next"
      :total="total">
    </el-pagination>
    <span slot="footer" class="dialog-footer">
    <el-button @click="cancelSelection">取消选择</el-button>
    <el-button type="primary" @click="onConfirm">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import http from '@/api/index'
  import {switchScene_type} from "../../../api/commonFunction";
  export default {
    data(){
      return {
        currentRow: null,
        input:null,
        data:[],
        pageNumber:1,
        pageSize:5,
      }
    },
    props:{
      dialogVisible: {
        type: Boolean,
        default: false
      }
    },
    computed:{
      showData(){
        return this.data.slice(this.pageSize*(this.pageNumber-1),this.pageSize*this.pageNumber)
      },
      total(){
        return this.data.length
      }
    },
    methods:{
      formateType(row){
        return switchScene_type(row.scene_type_id)
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
      async loadSceneData(){
        this.data = await http.getAllScene()
      },
      async querySceneByKw(){
        //this.city = this.$store.state.city
        let params = {
          kw:this.input
        }
        //console.log(await http.doPost('getSceneByKw',params))
        this.data = await http.doPost('getSceneByKw',params)
        //此处应连后台根据景点名查询景点的接口
      }
    },
    mounted(){
      this.loadSceneData()
    }
  }
</script>

<style scoped>

</style>
