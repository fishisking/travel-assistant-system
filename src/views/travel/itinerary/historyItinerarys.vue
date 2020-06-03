<template>
  <div>
    <el-page-header @back="goBack"></el-page-header>
    <div style="margin-top:10px;">
      <el-form :inline="true" :model="form" class="demo-form-inline">
        <el-form-item label="关键词">
          <el-input placeholder="请输入行程地点关键词" v-model="form.kw"></el-input>
        </el-form-item>
        <el-form-item label="日期期限">
          <el-date-picker
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
            style="width:400px;"
            v-model="form.date"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="query">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="filterData?filterData:data" style="width: 100%" highlight-current-row  :default-sort = "{prop: 'destination_date', order: 'descending'}">
      <el-table-column prop="destination_name" label="行程地点"></el-table-column>
      <el-table-column prop="destination_date" label="行程日期" sortable="">
        <template
          slot-scope="scope"
        >{{`${scope.row.destination_date} / ${scope.row.destination_time?scope.row.destination_time:'无具体时间'}`}}</template>
      </el-table-column>
      <el-table-column label="地点类型">
        <template slot-scope="scope">
          <el-tag>{{switchScene_type(scope.row.type_id)}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="destination_address" label="行程地点"></el-table-column>
      <el-table-column prop="note" label="行程备注"></el-table-column>
      <el-table-column label="操作" >
          <template>
              <el-button size="small">查看行程</el-button>
          </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import http from "@/api/index";
import toolBar from "@/components/common/toolBar";
import { switchScene_type } from "@/api/commonFunction";
import { success, danger } from "@/api/messageTips";
export default {
  data() {
    return {
      data: [],
      form: {
          date:[],
          kw:''
      },
      filterData:null
    };
  },
  computed:{
      /* filterData(){
          console.log(this.form)
          return this.data.filter(item=>item.destination_name.indexOf(this.form.kw)>=0)
      } */
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    query() {
        let data1 = this.data.filter(item=>item.destination_name.indexOf(this.form.kw)>=0)
        //this.filterData = array
        if(this.form.date&&this.form.date.length>0){
            data1 = data1.filter(item=>item.destination_date<=this.form.date[1]&&item.destination_date>=this.form.date[0])
        }
        this.filterData = data1
    },
    switchScene_type(id) {
      switch (id) {
        case 0:
          return "景点";
          break;
        case 1:
          return "酒店";
          break;
        case 2:
          return "自定义地点";
          break;
      }
    },
    async loadData() {
      this.data = await http.getAllItinerary();
      console.log(this.data);
    }
  },
  mounted() {
    this.loadData();
  }
};
</script>
<style scoped>
.container {
  width: 500px;
  height: 800px;
  background: #eee;
}
</style>