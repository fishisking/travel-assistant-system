<template>
  <div class="demo">
    <el-form :model="form" :inline="true">
      <el-form-item label="行程地点">
        <el-select placeholder="出发城市" v-model="form.arrive_code">
          <el-option
            v-for="(item,key) in cityList"
            :label="item"
            :value="cityCodeList[item]"
            :key="key"
          ></el-option>
        </el-select>
        <span class="line">-</span>
        <el-select placeholder="到达城市" v-model="form.leave_code">
          <el-option
            v-for="(item,key) in cityList"
            :label="item"
            :value="cityCodeList[item]"
            :key="key"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="出发日期">
        <el-date-picker
          type="date"
          placeholder="选择日期"
          value-format="yyyy-MM-dd"
          v-model="form.date"
          style="width: 200px;"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
    <hr />
    <template>
      <el-table :data="dataList">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="商品名称">
                <span>{{ props.row.name }}</span>
              </el-form-item>
              <el-form-item label="所属店铺">
                <span>{{ props.row.shop }}</span>
              </el-form-item>
              <el-form-item label="商品 ID">
                <span>{{ props.row.id }}</span>
              </el-form-item>
              <el-form-item label="店铺 ID">
                <span>{{ props.row.shopId }}</span>
              </el-form-item>
              <el-form-item label="商品分类">
                <span>{{ props.row.category }}</span>
              </el-form-item>
              <el-form-item label="店铺地址">
                <span>{{ props.row.address }}</span>
              </el-form-item>
              <el-form-item label="商品描述">
                <span>{{ props.row.desc }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="航班号" width="180" prop="flightNo"></el-table-column>
        <el-table-column label="航空公司" prop="airlineCompany"></el-table-column>
        <el-table-column label="出发/到达时间" prop="arTime">
          <template slot-scope="scope">
            {{`${formatDate(scope.row.tkTime)} - ${formatDate(scope.row.arTime)}`}}
            <span class="cost-time">
                耗时:{{subtractTime(scope.row.tkTime,scope.row.arTime)}}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="准点率" width="100" prop="onTimeRate">
          <template slot-scope="scope">{{scope.row.onTimeRate+'%'}}</template>
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
export default {
  data() {
    return {
      form: {
        arrive_code: "",
        leave_code: "",
        date: new moment().format("YYYY-MM-DD")
      },
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
    formatDate(date){
        const dataReg = / \d{2}:\d{2}/ //将日期数据正则处理
        return date.match(dataReg)[0]
    },
    subtractTime(d1,d2){
        const duration = moment.duration(moment(d2).diff(moment(d1)))
        const result = duration.get('minutes')+'分钟'
        return duration.get('hours')!==0?duration.get('hours')+'小时'+result:result
    },
    onSubmit() {
      const { arrive_code, leave_code } = this.form;
      let params = {
        arrive_code,
        leave_code,
        query_date: this.form.date
      };
      http.queryFlight(params).then(res => {
        if (res.errCode === 0) {
          success(this);
          this.dataList = res.flightInfos;
        }
        console.log(res);
      });
    }
  },
  created() {
  }
};
</script>
<style scoped>
.demo {
  height: 100%;
  width: 100%;
}
.line {
  width: 50px;
  display: inline-block;
  text-align: center;
}
.cost-time {
  background: #f56c6c;
  color: #fff;
  font-size: 12px;
  line-height: 18px;
  display: inline-block;
}
</style>