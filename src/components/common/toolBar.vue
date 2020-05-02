<template>
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true" :model="filters">
            <el-form-item>
                <el-input v-model="filters.name" placeholder="请输入查询关键词"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button icon="el-icon-search" @click="sendFilters" circle>查询</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="success" icon="el-icon-check" circle @click="addItem" v-if="addButton">新增</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="danger" icon="el-icon-delete" circle @click="deleteItem" :disabled="!currentRow" v-if="deleteButton">删除</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-edit" circle @click="updateItem" :disabled="!currentRow" v-if="updateButton">修改</el-button>
            </el-form-item>
        </el-form>
    </el-col>
</template>

<script>
    export default {
        name: "toolBar",
        data(){
            return {
                filters: {
                    name: ''
                },
            }
        },
        props:{
          EditForm:String,
          addButton:{
            type:Boolean,
            default:true
          },
          updateButton:{
            type:Boolean,
            default:true
          },
          deleteButton:{
            type:Boolean,
            default:true
          },
          currentRow:{
            type:Object,
            default:null
          }
        },
        methods:{
            sendFilters(){
                this.$emit('get-filters',this.filters.name);
            },
            addItem(){
              this.$router.push(this.$route.path+'/add')
            },
            updateItem(){
              this.$router.push({path:this.$route.path+'/update',query:this.currentRow})
            },
            deleteItem(){
              this.$confirm('将删除该记录, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
              }).then(() => {
                //调删除接口 参数是this.currentRow
                this.$emit('on-delete')
              }).catch(() => {
                this.$message({
                  type: 'info',
                  message: '已取消删除'
                });
              });
            }
        },
        mounted(){
        }
    }
</script>

<style scoped>

</style>
