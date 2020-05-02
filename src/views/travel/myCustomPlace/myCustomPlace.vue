<template>
  <div>
    <tool-bar :currentRow="currentRow" @on-delete="deleteItem"></tool-bar>
    <el-table
      :data="tableData"
      style="width: 100%"
      highlight-current-row
      @current-change="handleCurrentChange"
    >
      <el-table-column type="index" width="40"></el-table-column>
      <el-table-column prop="custom_name" label="地点名称"></el-table-column>
      <el-table-column label="区域">
        <template
          slot-scope="scope"
        >{{ scope.row.province + '-' + scope.row.city + '-' +scope.row.district}}</template>
      </el-table-column>
      <el-table-column prop="address" label="地址" width="200"></el-table-column>
      <el-table-column prop="date" label="经纬度">
        <template slot-scope="scope">{{ scope.row.longitude + '/' + scope.row.latitude}}</template>
      </el-table-column>
      <el-table-column label="地图链接">
        <template slot-scope="scope" v-if="scope.row.link">
            <el-link :href="scope.row.link" type="primary" :title="scope.row.link" target="_blank">链接</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="tag" label="标签">
        <template slot-scope="scope">
          <template v-if="scope.row.tag">
            <el-tag v-for="tag in scope.row.tag.split(';')" style="margin-right: 5px;">{{tag}}</el-tag>
          </template>
        </template>
      </el-table-column>
      <el-table-column prop="description" label="描述"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            icon="el-icon-star-off"
            type="warning"
            size="small"
            @click="addPlaceCollection(scope.row)"
          >收藏</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import toolBar from "@/components/common/toolBar";
import http from "@/api/index";
import axios from "axios";
export default {
  name: "myCustomePlace",
  components: {
    toolBar
  },
  data() {
    return {
      tableData: [
        {
          user_id: "100001",
          custom_id: "1",
          custom_name: "浙江理工大学生活-三区",
          address: "学林街686号",
          province: "浙江省",
          city: "杭州市",
          district: "江干区",
          longitude: "120.3701904905",
          latitude: "30.322299389622",
          description: "开放时间9:00-17:00",
          link:
            "http://api.map.baidu.com/place/detail?uid=b9e20c7db1f01327f32d83fe&output=html&source=placeapi_v2",
          tag: "房地产;宿舍",
          uid: "b9e20c7db1f01327f32d83fe"
        }
      ],
      currentRow: null
    };
  },
  methods: {
    handleCurrentChange(val) {
      this.currentRow = val;
    },
    async deleteItem() {
      let a = await http.deleteCustomPlace(this.currentRow);
      if (a.success) {
        this.$message({
          type: "success",
          message: "删除成功!"
        });
        this.loadData();
      } else {
        this.$message({
          type: "error",
          message: "删除失败"
        });
      }
    },
    addPlaceCollection(row) {
      let params = {
        user_id: 100001,
        collection_id: 1,
        accord_id: 12,
        name: "西湖",
        type: 0,
        address: "杭州市西湖区龙井路1号\n",
        longitude: "50.555",
        latitude: "44.444"
      }; //改参数
      //调接口  增加自定义地点为收藏
    },
    async loadData() {
      this.tableData = await http.getAllCustomPlace(this.$store.state.user_id);
    }
  },
  mounted() {
    this.loadData();
  }
};
</script>

<style scoped>
</style>
