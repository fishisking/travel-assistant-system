<template>
  <el-dialog
    center
    title="选择酒店"
    :visible="dialogVisible"
    @close="onCancel"
    width="50%">
    <el-form>
      <el-form-item label="酒店名">
        <el-input
          style="width: 500px;"
          placeholder="请输入酒店名"
          v-model="input">
        </el-input>
        <el-button @click="queryHotelByKw">搜索</el-button>
      </el-form-item>
    </el-form>
    <el-table
      ref="singleTable"
      @current-change="handleCurrentChange"
      highlight-current-row
      :data="showData"
      style="width: 100%">
      <el-table-column
        prop="title"
        label="酒店名称"
        width="280">
      </el-table-column>
      <el-table-column
        prop="city"
        label="城市"
        width="120">
      </el-table-column>
      <el-table-column
        prop="district"
        label="地区"
        width="120">
      </el-table-column>
      <el-table-column
        prop="address"
        label="地址">
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
        async queryHotelByKw(){
          this.city = this.$store.state.city
          this.data = await http.getHotelDetailByName(this.input,this.city);
        },
      }
    }
</script>

<style scoped>

</style>
