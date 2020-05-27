<template>
  <div class="demo">
    <el-form :model="form" :inline="true">
      <el-form-item label="行程地点">
        <el-select placeholder="出发城市" v-model="form.start">
          <el-option v-for="(item,key) in cityList" :label="item" :value="item" :key="key"></el-option>
        </el-select>
        <span class="line">-</span>
        <el-select placeholder="到达城市" v-model="form.end">
          <el-option v-for="(item,key) in cityList" :label="item" :value="item" :key="key"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="出发日期">
        <el-date-picker
          type="date"
          placeholder="选择日期"
          value-format="yyyy-MM-dd"
          v-model="form.date"
          style="width: 180px;"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-checkbox
          v-model="form.ishigh"
          label="仅高铁"
          class="ishigh"
          :true-label="1"
          :false-label="0"
        ></el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
    <hr />
    <template>
      <el-table
        v-if="dataList.length!==0"
        :default-sort="{prop: 'departuretime', order: 'ascending'}"
        :data="dataList"
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
      >
        <el-table-column label="车次" prop="trainno"></el-table-column>
        <el-table-column label="类型" prop="type"></el-table-column>
        <el-table-column label="出发/到达站点">
          <template slot-scope="scope">
            <div class="flex-column">
              <span class="flex-row">
                <i class="icon-start"></i>
                <strong>{{scope.row.station}}</strong>
              </span>
              <span class="flex-row">
                <i :class="scope.row.isend===1?'icon-end':'icon-pass'"></i>
                <strong>{{scope.row.endstation}}</strong>
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="出发时间" prop="departuretime" sortable></el-table-column>
        <el-table-column label="到达时间" prop="arrivaltime"></el-table-column>
        <el-table-column label="用时" prop="costtime" sortable></el-table-column>
        <el-table-column label="距离" prop="distance" sortable></el-table-column>
        <el-table-column label="预计耗时" prop="arrivaltime"></el-table-column>
        <!-- <el-table-column label="发车状态" prop="ticket">
          <template slot-scope="scope">
            <span>
              <el-tag v-if="parseInt(scope.row.ticket)" type="success">{{'剩'+scope.row.ticket}}</el-tag>
              <el-tag v-else-if="scope.row.ticket==='已发车'" type="warning">{{scope.row.ticket}}</el-tag>
              <el-tag v-else type="danger">{{scope.row.ticket}}</el-tag>
            </span>
          </template>
        </el-table-column>-->
      </el-table>
      
    </template>
  </div>
</template>
<script>
import cityCode from "@/cityCode";
import moment from "moment";
import http from "@/api/index";
import { success, danger } from "@/api/messageTips";
export default {
  data() {
    return {
      form: {
        start: "北京",
        end: "杭州",
        date: "2020-05-27",
        ishigh: 0
      },
      loading: false,
      dataList: []
    };
  },
  computed: {
    cityList() {
      return Object.keys(cityCode);
    },
    cityCodeList() {
      return cityCode;
    }
  },
  methods: {
    onSubmit() {
      this.loading = true;
      http.queryTrain(this.form).then(res => {
        console.log(res);
        if (res.status === 200) {
          if (res.data.result) {
            this.$message({
              message: "查询成功",
              type: "success"
            });
            this.dataList = res.data.result.list;
          } else {
            this.$message({
              message: "本次查询无可用班次"
            });
          }
        } else {
          this.$message({
            type: "error",
            message: "查询出错"
          });
        }
      });
      this.loading = false;
      console.log(this.form);
    }
  }
};
</script>
<style lang="less" scoped>
.demo {
  height: 100%;
  width: 100%;
}
.line {
  width: 50px;
  display: inline-block;
  text-align: center;
}
form {
  padding-left: 20px;
}
.flex-column {
  display: flex;
  flex-direction: column;
}
.flex-row{
  display: flex;
  flex-direction: row; 
  align-items: flex-end;
  strong{
    font-size:12px;
    line-height: 12px;
    color:#333;
  }
}
.icon-basic{
  height: 16px;
  line-height: 18px;
  overflow: hidden;
  width:16px;
  display: inline-block;
  background: url("../../../assets/train.png") no-repeat;
}
.icon-pass {
  .icon-basic();
  background-position: 0 -446px;
}
.icon-start {
  .icon-basic();
  background-position: 0 -546px;
}
.icon-end {
  .icon-basic();
  background-position: 0 -496px;
}
</style>
