<template>
  <el-dialog
    center
    title="选择地点"
    :visible="dialogVisible"
    @close="onCancel"
    width="50%">
    <el-form>
      <el-form-item label="地点关键字">
        <el-input
          style="width: 500px;"
          placeholder="请输入地点关键字"
          v-model="input">
        </el-input>
        <el-button @click="search">搜索</el-button>
      </el-form-item>
    </el-form>
    <el-table
      ref="singleTable"
      @current-change="handleCurrentChange"
      highlight-current-row
      :data="data"
      style="width: 100%">
      <el-table-column
        prop="name"
        label="地点名称">
      </el-table-column>
      <el-table-column label="省份城市" align="center">
        <template slot-scope="scope">
          <span>
            {{scope.row.province+scope.row.city}}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="area"
        label="地区"
        width="120">
      </el-table-column>
      <el-table-column
        prop="address"
        label="地址">
      </el-table-column>
    </el-table>
    <el-pagination
      :page-size="10"
      :current-page.sync="pageNumber"
      style="margin-top: 15px;"
      background
      @current-change="changeCurrentPage"
      layout="prev, pager, next">
    </el-pagination>
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
        data:[],
        pageNumber:1,
        pageSize:10,
        total:200
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
      async queryPlaceByKw(){
        //this.city = this.$store.state.city
        this.data = await http.getPlaceByKeyWord(this.input,this.pageNumber);
        console.log(this.data)
      },
      changeCurrentPage(){
        this.queryPlaceByKw()
      },
      search(){
        this.queryPlaceByKw()
        this.pageNumber=1
      }
    }
  }
</script>

<style scoped>

</style>
