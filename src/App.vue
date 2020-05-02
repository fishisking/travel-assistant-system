<template>
  <div class="app" id="app">
    <el-container>
      <el-aside class="app-side app-side-left"
                style="padding-top:1.5%;width:205px;" v-if="!asideIfCollapse">
        <div class="app-side-logo">
          <img src="@/assets/最终版logo.png"
               height="150" width="180"/>
        </div>
        <div style="margin-top:85px;">
          <!-- 我是样例菜单 -->
          <hr>
          <el-menu
            :collapse-transition="true"
            background-color="#eef1f6"
                   class="el-menu-vertical-demo"
                   router
                    v-if="isLogin">
            <el-menu-item index="/home">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span slot="title">首页</span>
              </template>
            </el-menu-item>
            <el-submenu index="/travel">
              <template slot="title">
                <i class="el-icon-date"></i>
                <span slot="title">行程管理</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="/travel/itinerary">我的行程单</el-menu-item>
                <el-menu-item index="/travel/myCustomPlace">自定义地点</el-menu-item>
                <el-menu-item index="/travel/placeCollection">地点收藏</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-submenu index="3">
              <template slot="title">
                <i class="el-icon-document"></i>
                <span slot="title">游记管理</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="/log/findLog">探索游记</el-menu-item>
                <el-menu-item index="/log/logCollection">游记收藏</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-submenu index="4" v-if="userStatus.permission!=0">
              <template slot="title">
                <i class="el-icon-setting"></i>
                <span slot="title">信息管理</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="/model/userInformationRecord">用户信息</el-menu-item>
                <el-menu-item index="/model/userPreference">用户兴趣度</el-menu-item>
                <el-menu-item index="/model/userBehaviourRecord">用户行为记录</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-submenu index="5">
              <template slot="title">
                <i class="el-icon-user"></i>
                <span slot="title">个人中心</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="/user/userInformation">个人信息</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
          </el-menu>
          <div v-else-if="isLogin==false" style="text-align:center;margin-top:5%;">
            <span style="font-weight:700;font-size:large">尚未登录</span>
            <hr>
            <el-link type="primary" @click="openLoginOnDialog">登录</el-link>
            <span>或者</span>
            <el-link type="primary" @click="openRegisterDialog">免费注册</el-link>
          </div>
          <div style="position: absolute;bottom:5px;left:15px;">
            <el-button type="primary" icon="el-icon-caret-left" circle @click="collapse" size="small"></el-button>
            <el-tooltip placement="bottom" v-if="isLogin" style="margin-left:40px;">
              <div slot="content">登录ID:{{this.$store.state.user_id}}<br>用户名:{{this.$store.state.user_name}}<br/>权限类型:{{formatPermission(this.$store.state.permission)}}</div>
              <el-link icon="el-icon-place" style="color:#606266;font-weight: 600">已登录</el-link>
            </el-tooltip>
            <span class="drop-out-line"></span>
            <el-link @click="dropOut" style="color:#909399" class="drop-out">退出</el-link>
          </div>
        </div>
      </el-aside>
      <el-aside v-else style="width: 50px;" class="el-aside-two">
        <div>
          <el-button type="primary" icon="el-icon-caret-right" circle @click="collapse"></el-button>
        </div>
      </el-aside>
      <el-container>
        <el-header class="app-header" style="z-index:100">
          <city-picker></city-picker>
          <div class="app-header-input">
            <el-input placeholder="请输入内容" v-model="keyWord" class="input-with-select">
              <el-select v-model="field" slot="prepend" placeholder="请选择">
                <el-option label="景点" value=0></el-option>
                <el-option label="酒店" value=1></el-option>
                <el-option label="游记" value=2></el-option>
              </el-select>
              <el-button slot="append" icon="el-icon-search" @click="searchItem"></el-button>
            </el-input>
          </div>
          <span class="app-header-service" style="margin-left:5px;"><i class="el-icon-phone-outline"></i>客服电话：17606536285</span>

        </el-header>

        <el-main class="app-body">
          <template>
            <router-view v-if="isRouterAlive"/>
          </template>
        </el-main>
      </el-container>
    </el-container>
    <login-on-dialog :dialogVisible="loginOnDialogVisible" @on-cancel="cancelLoginOn" @on-confirm="confirmLoginOn"></login-on-dialog>
    <register-dialog :dialogVisible="registerDialogVisible" @on-cancel="cancelRegister" @on-confirm="confirmRegister"></register-dialog>
  </div>
</template>

<script>
  import cityPicker from '@/components/common/CityPicker'
  import loginOnDialog from '@/components/common/LoginOnDialog'
  import registerDialog from '@/components/common/RegisterDialog'
  export default {
    name: 'Container',
    provide () {
      return {
        reload: this.reload
      }
    },
    components:{
      cityPicker,
      loginOnDialog,
      registerDialog
    },
    data() {
      return {
        keyWord:'',
        isLogin:false,
        field:'',
        loginOnDialogVisible:false,
        registerDialogVisible:false,
        asideIfCollapse:false,
        isRouterAlive: true,
        userStatus:{
          user_id:'',
          user_name:'',
          permission:''
        },

      }
    },
    methods: {
      formatPermission(num){
        if(num==0){
          return '普通用户'
        }else{
          return '管理员'
        }
      },
      dropOut(){
        this.isLogin = false
        this.$store.commit('dropOut')
        this.$router.push('/')
      },
      reload () {
        this.isRouterAlive = false
        this.$nextTick(function () {
          this.isRouterAlive = true
        })
      },
      collapse(){
        this.asideIfCollapse = (this.asideIfCollapse)?false:true
      },
      cancelLoginOn(){
        this.loginOnDialogVisible = false
      },
      cancelRegister(){
        this.registerDialogVisible = false
      },
      confirmLoginOn(data){
        /*
        关闭对话框 =》 深拷贝结果到this.userStatus(显示不同用户登录样式)=>显示登录成功信息
         */
        this.loginOnDialogVisible = false
        this.userStatus = this.common.deepClone(data)
        this.$store.commit('logOn',data)
        this.$message({
          message: '恭喜你，登录成功',
          type: 'success'
        });
        this.isLogin = true
      },
      confirmRegister(data){
        this.registerDialogVisible = false
        this.$confirm('是否直接用此账号登录?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.confirmLoginOn(data)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消直接登录'
          });
        });
      },
      openLoginOnDialog(){
        this.loginOnDialogVisible = true
      },
      openRegisterDialog(){
        this.registerDialogVisible = true
      },
      searchItem(){
        if(this.field==0||this.field==1){
          this.$router.push({name:'search',query: {field:this.field,kw:this.keyWord}})
        }else if(this.field==2){
          this.$router.push({name:'searchLog',query: {field:this.field,kw:this.keyWord}})
        }
      },
      autoLogOn(){
        /*
                检查session(session在页面被关闭后会失去)=>如果没有，检查cookie是否存在=》如果存在则三天内免登录(刷新页面自己检查cookie登录) =》覆盖cookie
         */
        if(sessionStorage.getItem("user_id")!==null){
          let data = {
            user_id:sessionStorage.getItem("user_id"),
            user_name:sessionStorage.getItem("user_name"),
            permission:sessionStorage.getItem("permission")
          }
          this.confirmLoginOn(data)
        }
        if(this.$cookies.get("user_id")!==null){
          let data = {
            user_id:this.$cookies.get("user_id"),
            user_name:this.$cookies.get("user_name"),
            permission:this.$cookies.get("permission")
          }
          this.confirmLoginOn(data)
        }
        else{
          this.loginOnDialogVisible = true
        }

      }
    },
    created() {

    },
    mounted(){
      this.autoLogOn()
    }
  }
</script>

<style>
  .el-select .el-input {
    width: 130px;
  }
  .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }
  .el-aside-two{
     width:25px;
     background: #F2F6FC;
   }
  .el-aside-two div{
    text-align: center;
    top:45%;
    position: relative;
  }
  .drop-out-line{
    width: 0;
    height:50px;
    border-left:2px solid #909399;
    margin-right:2px;
  }
</style>
