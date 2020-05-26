<template>
  <div class="demo">
    <el-form :model="form" :inline="true">
      <el-form-item label="行程地点">
        <el-select placeholder="出发城市" v-model="form.start">
          <el-option v-for="(item,key) in coachCityList" :label="item" :value="item" :key="key"></el-option>
        </el-select>
        <span class="line">-</span>
        <el-select placeholder="到达城市" v-model="form.end">
          <el-option v-for="(item,key) in coachCityList" :label="item" :value="item" :key="key"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
       <el-checkbox v-model="isShow" label="仅显示可用车次" border></el-checkbox>
    </el-form>
    <hr />
    <template>
      <el-table
        v-if="dataList.length!==0"
       :default-sort = "{prop: 'starttime', order: 'ascending'}"
        :data="isShow?filteredDataList:dataList"
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
      >
        <el-table-column label="出发站点" prop="startstation"></el-table-column>
        <el-table-column label="到达站点" prop="endstation"></el-table-column>
        <el-table-column label="出发时间" prop="starttime" sortable>
        </el-table-column>
        <el-table-column label="巴士类型" prop="bustype"></el-table-column>
        <el-table-column label="预计耗时" prop="distance"></el-table-column>
        <el-table-column label="价格" prop="price"></el-table-column>
        <el-table-column label="发车状态" prop="ticket">
          <template slot-scope="scope">
            <span>
              <el-tag v-if="parseInt(scope.row.ticket)" type="success">{{'剩'+scope.row.ticket}}</el-tag>
              <el-tag v-else-if="scope.row.ticket==='已发车'" type="warning">{{scope.row.ticket}}</el-tag>
              <el-tag v-else type="danger">{{scope.row.ticket}}</el-tag>
            </span>
          </template>
        </el-table-column>
      </el-table>
    </template>
  </div>
</template>
<script>
import { coachCityList } from "@/Constant";
import moment from "moment";
import http from "@/api/index";
import { success, danger } from "@/api/messageTips";
export default {
  data() {
    return {
      form: {
        start: "",
        end: ""
      },
      isShow:false,
      loading: false,
      dataList: [],
      coachCityList
    };
  },
  computed:{
    filteredDataList(){
      return this.dataList.filter(item=>{
        if(parseInt(item.ticket))return item;
      })
    }
  },
  methods: {
    onSubmit() {
      this.loading = true;
      http.queryCoach(this.form).then(res => {
        if (res.status === 200) {
          if (res.data.result) {
            this.$message({
              message: "查询成功",
              type:'success'
            });
            this.dataList = res.data.result;
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
      }).then(()=>{
        this.loading = false;
      })
    }
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