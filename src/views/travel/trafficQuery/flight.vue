<template>
  <div
    class="demo"
    v-loading="loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
  >
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
      <el-table :data="dataList" v-if="dataList.length!==0">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="原价：" style="margin-right:25px;">
                <span>{{ props.row.lowestPriceInfo.standardPrice }}</span>
              </el-form-item>
              <el-form-item label="折扣：" style="margin-right:25px;">
                <span>{{ props.row.lowestPriceInfo.discount }}</span>
              </el-form-item>
              <el-form-item label="折后价:" style="margin-right:25px;">
                <span>{{ `${props.row.lowestPriceInfo.price} (含燃油附加费${props.row.lowestPriceInfo.oilFee}元和机场建设费${props.row.lowestPriceInfo.buildTax}元)`}}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="航班号" prop="flightNo"></el-table-column>
        <el-table-column label="航空公司" prop="airlineCompany" width="400"></el-table-column>
        <el-table-column label="出发/到达时间" prop="arTime">
          <template slot-scope="scope">
            {{`${formatDate(scope.row.tkTime)} - ${formatDate(scope.row.arTime)}`}}
            <span
              class="cost-time"
            >耗时:{{subtractTime(scope.row.tkTime,scope.row.arTime)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="准点率" prop="onTimeRate">
          <template slot-scope="scope">{{scope.row.onTimeRate+'%'}}</template>
        </el-table-column>
        <el-table-column label="最低价格" prop="onTimeRate">
          <template slot-scope="scope">
            <span class="price">{{scope.row.lowestPriceInfo.price}}</span>
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
export default {
  data() {
    return {
      form: {
        arrive_code: "",
        leave_code: "",
        date: new moment().format("YYYY-MM-DD")
      },
      dataList: [],
      loading: false
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
    formatDate(date) {
      const dataReg = / \d{2}:\d{2}/; //将日期数据正则处理
      return date.match(dataReg)[0];
    },
    subtractTime(d1, d2) {
      const duration = moment.duration(moment(d2).diff(moment(d1)));
      const result = duration.get("minutes") + "分钟";
      return duration.get("hours") !== 0
        ? duration.get("hours") + "小时" + result
        : result;
    },
    onSubmit() {
      const { arrive_code, leave_code } = this.form;
      let params = {
        arrive_code,
        leave_code,
        query_date: this.form.date
      };
      this.loading = true;
      http.queryFlight(params).then(res => {
        if (res.errCode === 0) {
          if (res.flightInfos && res.flightInfos.length === 0) {
            this.$message({
              message: "本次查询无可用班次"
            });
          } else {
            this.$message({
              message: "查询成功",
              type: "success"
            });
          }
          this.dataList = res.flightInfos;
        } else {
          this.$message.error("请求失败");
        }
        this.loading = false;
      });
    }
  },
  created() {}
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
  padding: 4px;
}
.price {
  font-size: 14px;
  font-weight: bold;
}
form {
  padding-left: 20px;
}
</style>