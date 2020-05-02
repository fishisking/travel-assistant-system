<template>
  <div>
    <el-page-header @back="goBack" content="文章页面">
    </el-page-header>
    <div style="margin-top:5px;"><el-tag type="success" size="small" effect="plain">{{data.scene_name}}</el-tag></div>
    <div style="width: 100%;text-align: center">
      <h1 style="font-size:24px;margin: 0 auto;" v-html="data.log_title"></h1>
    </div>
    <div>
      <div style="text-indent: 2em;margin-top:5px;" v-html="data.log_content"></div>
      <div class="demo-image__preview" style="margin-top:25px;">
        <el-image
          style="width: 100px; height: 100px;margin-right:15px;"
          v-for="(img) in data.img_src.split(' ')"
          :src="img"
          :preview-src-list="data.img_src.split(' ')">
        </el-image>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
      methods:{
        goBack(){
          this.$router.go(-1)
        },
        onSubmit(){
          //调发评论接口
        }
      },
      data(){
        return {
          data:{}
        }
      },
      created(){
        this.data = this.$route.params.data
      }
    }
</script>

<style scoped>

</style>
