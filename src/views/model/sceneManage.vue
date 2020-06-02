<template>
  <div>
    <tool-bar :addButton="false" :updateButton="false" :currentRow="row" @on-delete="handleDelete" @get-filters="handleFilter"></tool-bar>
    <el-table :data="data" style="width: 100%" @row-click="handle" highlight-current-row>
      <el-table-column type="index" width="40"></el-table-column>
      <el-table-column prop="scene_name" label="景点名称"></el-table-column>
      <el-table-column prop="scene_level" label="景区等级"></el-table-column>
      <el-table-column prop="scene_area" label="景点地区"></el-table-column>
      <el-table-column prop="scene_location" label="景点地址"></el-table-column>
      <el-table-column prop="scene_type_id" label="景点类型">
        <template slot-scope="scope">{{switchScene_type(scope.row.scene_type_id)}}</template>
      </el-table-column>
      <el-table-column prop="opening_hours" label="景点开放时间"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-switch
            style="display: block"
            :active-value=1
            :inactive-value=0
            v-model="scope.row.is_available"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-text="可用"
            inactive-text="禁用"
          ></el-switch>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import http from "@/api/index";
import toolBar from "@/components/common/toolBar";
import { switchScene_type } from "@/api/commonFunction";
import { success,danger } from '@/api/messageTips'
export default {
  data() {
    return {
      data: [],
      row:{},
      kw:''
    };
  },
  components: {
    toolBar
  },
  computed:{
      filterData(){
          return this.data;
      }
  },
  methods: {
    async loadData() {
      const data = await http.getAllScene();
      this.data = data;
    },
    switchScene_type(id) {
      return switchScene_type(id);
    },
    handle(row){
        this.row = row
        http.doPost('updateScene',{scene_id:this.row.scene_id,is_available:this.row.is_available}).then((res)=>{
            if(res.success){
                success(this)
            }
        })
    },
    handleDelete(){
        http.doPost('deleteScene',{scene_id:this.row.scene_id}).then((res)=>{
            if(res.success){
                success(this)
            }
        })
    },
    handleFilter(val){
        console.log(val)
    }
  },
  mounted() {
    this.loadData();
  }
};
</script>