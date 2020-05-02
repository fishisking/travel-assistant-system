<template>
  <div>
    <div :class="['city',{'city-components-background':showCity}]">
      <div>{{selectedCity}}</div>
      <div class="to_bottom" @click="hideCityDialog" v-if="showCity"></div>
      <div class="to_top" @click="showCityDialog" v-else></div>
    </div>
    <div class="city-components" v-if="showCity">
      <div style="color:#999;margin-bottom: 5px;">热门城市</div>
      <div>
        <span v-for="(item) in hotCitys" @click="selectCity(item)" class="hot-city-item">{{item}}</span>
      </div>
      <div>
        <el-tabs v-model="activeName" @tab-click="handleClick" value="first" ref="cityTabs">
          <el-tab-pane label="ABCDE" name="0-5" >
            <div>
              <div v-for="item in pinyinCitys">
                <div style="color:#999;margin-top: 2px;">{{item.title}}</div>
                <div>
                  <span v-for="city in item.lists" class="hot-city-item" @click="selectCity(city)" >{{city}}</span>
                </div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="FGHJ" name="5-9">
            <div>
              <div v-for="item in pinyinCitys">
                <div style="color:#999;margin-top: 2px;">{{item.title}}</div>
                <div>
                  <span v-for="city in item.lists" class="hot-city-item" @click="selectCity(item)" >{{city}}</span>
                </div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="KLMNP" name="9-14">
            <div>
              <div v-for="item in pinyinCitys">
                <div style="color:#999;margin-top: 2px;">{{item.title}}</div>
                <div>
                  <span v-for="city in item.lists" class="hot-city-item" @click="selectCity(item)" >{{city}}</span>
                </div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="QRSTW" name="14-19">
            <div>
              <div v-for="item in pinyinCitys">
                <div style="color:#999;margin-top: 2px;">{{item.title}}</div>
                <div>
                  <span v-for="city in item.lists" class="hot-city-item" @click="selectCity(item)" >{{city}}</span>
                </div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="XYZ" name="20-22">
            <div>
              <div v-for="item in pinyinCitys">
                <div style="color:#999;margin-top: 2px;">{{item.title}}</div>
                <div>
                  <span v-for="city in item.lists" class="hot-city-item" @click="selectCity(item)" >{{city}}</span>
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>

  </div>
</template>

<script type="text/javascript">
  import data from '../../../static/data/city'
  export default {
    data () {
      return {
        selectedCity:'杭州',
        showCity: false,
        hotCitys:[
          '杭州','上海','天津','北京','南京','苏州','成都','广州','郑州','武汉'
        ],
        activeName:'',
        pinyinCitys:''
      }
    },
    methods: {
      hideCityDialog(){
        this.showCity = false;
        this.activeName = ''
      },
      showCityDialog(){
        this.activeName = '0-5'
        this.showCity = true;
      },
      selectCity(item){
        this.selectedCity = item
        this.showCity = false
        this.$store.state.city = this.selectedCity
      },
      handleClick(tab) {
        this.activeName = tab.name
      }
    },
    watch:{
      activeName(val){
        var arr = val.split('-')
        var min = Number(arr[0])
        var max = Number(arr[1])
        this.pinyinCitys = data.city.slice(min,max)
      }
    },
  }
</script>

<style scoped>
  .city {
    flex-direction:row;
    display:flex;
    padding:5px;
    z-index: 1000;
  }
  .city-components{
    position: absolute;
    width: 400px;
    border:1px solid #dedede;
    padding: 12px 21px;
    z-index:-111;
    background: #eee;
  }
  .city-components-background{
    border:1px solid #dedede;
    border-bottom:none;
  }
  .to_bottom {
    width: 0;
    height: 0;
    border-top: 10px solid skyblue;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    margin-left:5px;
    margin-top:5px;
  }
  .to_top {
    width: 0;
    height: 0;
    border-bottom: 10px solid skyblue;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    margin-left:5px;
    margin-top:5px;
  }
  .hot-city-item{
    margin:10px 10px 10px 0px;
  }
  .hot-city-item:hover{
    cursor: pointer;
    color:#409EFF;
    text-decoration: underline;

  }
</style>
