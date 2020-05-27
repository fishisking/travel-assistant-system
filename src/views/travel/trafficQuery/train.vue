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
        :data="dataList"
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
      >
        <el-table-column label="车次">
          <template slot-scope="scope">
            <span class="train-number">{{scope.row.trainno}}</span>
          </template>
        </el-table-column>
        <el-table-column label="类型" prop="type">
          <template slot-scope="scope">
            <span class="train-type">{{scope.row.typename}}</span>
          </template>
        </el-table-column>
        <el-table-column label="出发|到达站点">
          <template slot-scope="scope">
            <div class="flex-column">
              <span class="flex-row time">
                <i class="icon-start"></i>
                <strong>{{scope.row.station}}</strong>
              </span>
              <span class="flex-row time">
                <i :class="scope.row.isend===1?'icon-end':'icon-pass'"></i>
                <strong>{{scope.row.endstation}}</strong>
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="出发|到达时间" prop="departuretime">
          <template slot-scope="scope">
            <div class="flex-column">
              <span class="flex-row time">
                {{scope.row.departuretime}}
              </span>
              <span class="flex-row time" style="color:#999">
                {{scope.row.arrivaltime}}
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="历时" prop="costtime" sortable>
          <template slot-scope="scope">
            <div class="flex-column">
              <el-tooltip placement="bottom" effect="light" :content="`${scope.row.distance}km`">
                <span class="flex-row time">
                {{scope.row.costtime}}
              </span>
              </el-tooltip>
              <span class="flex-row">
                {{scope.row.day<=1?'当日到达':'次日到达'}}
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="原价：" style="margin-right:25px;">
                <span>{{ props.row.pricesw }}</span>
              </el-form-item>
              <el-form-item label="折扣：" style="margin-right:25px;">
                <span>{{ props.row.pricesw }}</span>
              </el-form-item>
              <el-form-item label="折后价:" style="margin-right:25px;">
                <span>{{props.row.pricesw}} </span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
      </el-table>
    </template>
  </div>
</template>
<script>
import cityCode from "@/cityCode";
import moment from "moment";
import http from "@/api/index";
import { success, danger } from "@/api/messageTips";
import { trains } from "@/Constant";
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
      dataList: trains
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
            console.log(this.dataList);
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
.time{
      font-family: Tahoma;
    font-size: 14px;
    color: #333;
    font-weight: bold;
}
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
.flex-row {
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  strong {
    font-size: 12px;
    line-height: 12px;
    color: #333;
  }
}
.icon-basic {
  height: 16px;
  line-height: 18px;
  overflow: hidden;
  width: 16px;
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
.train-type {
  color: #333;
}
.train-number {
  font-size: 16px;
  color: #333;
  text-decoration: underline;
  width: 60px;
  overflow: hidden;
  font-weight: 700;
}
</style>
