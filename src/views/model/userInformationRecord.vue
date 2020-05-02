<template>
  <div>
    <el-row>
      <el-col :span="18">
        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
        <div style="margin: 15px 0;"></div>
        <el-checkbox-group v-model="checkedModules" @change="handleCheckedCitiesChange">
          <el-checkbox :label="index" v-for="(module,index) in modules">{{module}}</el-checkbox>
        </el-checkbox-group>
      </el-col>
      <el-col :span="6">
        <el-input placeholder="输入用户编号，支持模糊查询" v-model="filter_user_id">
          <el-button slot="append" icon="el-icon-search" @click="getfilteredData" ></el-button>
        </el-input>
      </el-col>
    </el-row>
    <el-table
      :data="tableData"
      stripe
      style="width: 100%;margin-top: 20px"
      border>

      <el-table-column
        prop="user_id"
        label="用户编号"
        fixed
        width="80px">
      </el-table-column>
      <el-table-column label="个人信息" v-if="showModules[0]">
        <el-table-column
          label="性别"
          width="80px">
          <template slot-scope="scope">
            <span>{{common.formatSex(scope.row.userInformation.sex)|fillNull}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="年龄"
          width="80px">
          <template slot-scope="scope">
            <span>{{scope.row.userInformation.age|fillNull}}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="250px"
          label="工作">
          <template slot-scope="scope">
            <span>{{scope.row.userInformation.professional|fillNull}}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="120px"
          label="收入">
          <template slot-scope="scope">
            <span>{{scope.row.userInformation.income|fillNull}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="旅游风格"
          width="200px">
          <template slot-scope="scope">
            <span >{{common.formatTravelStyle(scope.row.userInformation.style)|fillNull}}
              <el-tooltip v-if="scope.row.userInformation.style==6">
              <span slot="content">{{scope.row.userInformation.description}}</span>
              <el-icon class="el-icon-view el-icon--right"></el-icon>
            </el-tooltip>
            </span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="账户信息" v-if="showModules[1]">
        <el-table-column
          prop="account.user_name"
          label="用户名">
        </el-table-column>
        <el-table-column
          prop="account.password"
          label="密码">
        </el-table-column>
        <el-table-column
          prop="account.permission"
          label="权限">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.account.permission == 1 ? '' : 'success'"
              disable-transitions>{{common.formatPermission(scope.row.account.permission)}}</el-tag>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="长期兴趣度" v-if="showModules[2]">
        <el-table-column label="自然风光类兴趣度" prop="bothTermUserPreference[0].natural_scene_preference">
        </el-table-column>
        <el-table-column label="文化古迹类兴趣度" prop="bothTermUserPreference[0].cultural_relic_preference">
        </el-table-column>
        <el-table-column label="农家度假类兴趣度" prop="bothTermUserPreference[0].farm_vacation_preference">
        </el-table-column>
        <el-table-column label="游乐场类兴趣度" prop="bothTermUserPreference[0].amusement_park_preference">
        </el-table-column>
        <el-table-column label="户外运动类兴趣度" prop="bothTermUserPreference[0].outdoor_activity_preference">
        </el-table-column>
        <el-table-column label="展馆表演类兴趣度" prop="bothTermUserPreference[0].exhibition_preference">
        </el-table-column>
        <el-table-column label="公园类兴趣度" prop="bothTermUserPreference[0].park_preference">
        </el-table-column>
        <el-table-column label="运动健身类兴趣度" prop="bothTermUserPreference[0].sports_preference">
        </el-table-column>
        <el-table-column label="城市观光类兴趣度" prop="bothTermUserPreference[0].city_sightseeing_preference">
        </el-table-column>
        <el-table-column label="水活动兴趣度" prop="bothTermUserPreference[0].water_activity_preference">
        </el-table-column>
        <el-table-column label="更新日期" prop="bothTermUserPreference[0].update_datetime">
        </el-table-column>
      </el-table-column>
      <el-table-column label="短期兴趣度" v-if="showModules[2]">
        <el-table-column label="自然风光类兴趣度" prop="bothTermUserPreference[1].natural_scene_preference">
        </el-table-column>
        <el-table-column label="文化古迹类兴趣度" prop="bothTermUserPreference[1].cultural_relic_preference">
        </el-table-column>
        <el-table-column label="农家度假类兴趣度" prop="bothTermUserPreference[1].farm_vacation_preference">
        </el-table-column>
        <el-table-column label="游乐场类兴趣度" prop="bothTermUserPreference[1].amusement_park_preference">
        </el-table-column>
        <el-table-column label="户外运动类兴趣度" prop="bothTermUserPreference[1].outdoor_activity_preference">
        </el-table-column>
        <el-table-column label="展馆表演类兴趣度" prop="bothTermUserPreference[1].exhibition_preference">
        </el-table-column>
        <el-table-column label="公园类兴趣度" prop="bothTermUserPreference[1].park_preference">
        </el-table-column>
        <el-table-column label="运动健身类兴趣度" prop="bothTermUserPreference[1].sports_preference">
        </el-table-column>
        <el-table-column label="城市观光类兴趣度" prop="bothTermUserPreference[1].city_sightseeing_preference">
        </el-table-column>
        <el-table-column label="水活动兴趣度" prop="bothTermUserPreference[1].water_activity_preference">
        </el-table-column>
        <el-table-column label="更新日期" prop="bothTermUserPreference[1].update_datetime">
      </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-link icon="el-icon-pie-chart" @click="getUserBehaviourRadar(scope.row.user_id)">查看</el-link>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="注册兴趣度" v-if="showModules[3]">
        <el-table-column label="自然风光类兴趣度" prop="registerModelInformation.natural_scene_preference">
          <template slot-scope="scope">
            <template v-if="scope.row.registerModelInformation.model_mode!=0">
              <el-tooltip placement="top">
                <div v-html="ToBreak(scope.row.registerModelInformation.natural_scene_preference_log)" slot="content"></div>
                <span>{{scope.row.registerModelInformation.natural_scene_preference}}<el-icon class="el-icon-connection" style="margin-left: 5px"></el-icon></span>
              </el-tooltip>
            </template>
            <template v-else>
              <el-tooltip placement="top">
                <div slot="content">
                  {{'未填写用户信息,无模型'}}
                </div>
                <span>{{scope.row.registerModelInformation.natural_scene_preference}}<el-icon class="el-icon-close" style="margin-left: 5px"></el-icon></span>
              </el-tooltip>
            </template>
          </template>
        </el-table-column>
        <el-table-column label="文化古迹类兴趣度" prop="registerModelInformation.cultural_relic_preference">
          <template slot-scope="scope">
            <template v-if="scope.row.registerModelInformation.model_mode!=0">
              <el-tooltip placement="top">
                <div v-html="ToBreak(scope.row.registerModelInformation.cultural_relic_preference_log)" slot="content"></div>
                <span>{{scope.row.registerModelInformation.cultural_relic_preference}}<el-icon class="el-icon-connection" style="margin-left: 5px"></el-icon></span>
              </el-tooltip>
            </template>
            <template v-else>
              <el-tooltip placement="top">
                <div slot="content">
                  {{'未填写用户信息,无模型'}}
                </div>
                <span>{{scope.row.registerModelInformation.natural_scene_preference}}<el-icon class="el-icon-close" style="margin-left: 5px"></el-icon></span>
              </el-tooltip>
            </template>
          </template>
        </el-table-column>
        <el-table-column label="农家度假类兴趣度" prop="registerModelInformation.farm_vacation_preference">
          <template slot-scope="scope">
            <template v-if="scope.row.registerModelInformation.model_mode!=0">
              <el-tooltip placement="top">
                <div v-html="ToBreak(scope.row.registerModelInformation.farm_vacation_preference_log)" slot="content"></div>
                <span>{{scope.row.registerModelInformation.farm_vacation_preference}}<el-icon class="el-icon-connection" style="margin-left: 5px"></el-icon></span>
              </el-tooltip>
            </template>
            <template v-else>
              <el-tooltip placement="top">
                <div slot="content">
                  {{'未填写用户信息,无模型'}}
                </div>
                <span>0<el-icon class="el-icon-close" style="margin-left: 5px"></el-icon></span>
              </el-tooltip>
            </template>
          </template>
        </el-table-column>
        <el-table-column label="游乐场类兴趣度" prop="registerModelInformation.amusement_park_preference">
          <template slot-scope="scope">
            <template v-if="scope.row.registerModelInformation.model_mode!=0">
              <el-tooltip placement="top">
                <div v-html="ToBreak(scope.row.registerModelInformation.amusement_park_preference_log)" slot="content"></div>
                <span>{{scope.row.registerModelInformation.amusement_park_preference}}<el-icon class="el-icon-connection" style="margin-left: 5px"></el-icon></span>
              </el-tooltip>
            </template>
            <template v-else>
              <el-tooltip placement="top">
                <div slot="content">
                  {{'未填写用户信息,无模型'}}
                </div>
                <span>0<el-icon class="el-icon-close" style="margin-left: 5px"></el-icon></span>
              </el-tooltip>
            </template>
          </template>
        </el-table-column>
        <el-table-column label="户外运动类兴趣度" prop="registerModelInformation.outdoor_activity_preference">
          <template slot-scope="scope">
            <template v-if="scope.row.registerModelInformation.model_mode!=0">
              <el-tooltip placement="top">
                <div v-html="ToBreak(scope.row.registerModelInformation.outdoor_activity_preference_log)" slot="content"></div>
                <span>{{scope.row.registerModelInformation.outdoor_activity_preference}}<el-icon class="el-icon-connection" style="margin-left: 5px"></el-icon></span>
              </el-tooltip>
            </template>
            <template v-else>
              <el-tooltip placement="top">
                <div slot="content">
                  {{'未填写用户信息,无模型'}}
                </div>
                <span>0<el-icon class="el-icon-close" style="margin-left: 5px"></el-icon></span>
              </el-tooltip>
            </template>
          </template>
        </el-table-column>
        <el-table-column label="展馆表演类兴趣度" prop="registerModelInformation.exhibition_preference">
          <template slot-scope="scope">
            <template v-if="scope.row.registerModelInformation.model_mode!=0">
              <el-tooltip placement="top">
                <div v-html="ToBreak(scope.row.registerModelInformation.exhibition_preference_log)" slot="content"></div>
                <span>{{scope.row.registerModelInformation.exhibition_preference}}<el-icon class="el-icon-connection" style="margin-left: 5px"></el-icon></span>
              </el-tooltip>
            </template>
            <template v-else>
              <el-tooltip placement="top">
                <div slot="content">
                  {{'未填写用户信息,无模型'}}
                </div>
                <span>0<el-icon class="el-icon-close" style="margin-left: 5px"></el-icon></span>
              </el-tooltip>
            </template>
          </template>
        </el-table-column>
        <el-table-column label="公园类兴趣度" prop="registerModelInformation.park_preference">
          <template slot-scope="scope">
            <template v-if="scope.row.registerModelInformation.model_mode!=0">
              <el-tooltip placement="top">
                <div v-html="ToBreak(scope.row.registerModelInformation.park_preference_log)" slot="content"></div>
                <span>{{scope.row.registerModelInformation.park_preference}}<el-icon class="el-icon-connection" style="margin-left: 5px"></el-icon></span>
              </el-tooltip>
            </template>
            <template v-else>
              <el-tooltip placement="top">
                <div slot="content">
                  {{'未填写用户信息,无模型'}}
                </div>
                <span>0<el-icon class="el-icon-close" style="margin-left: 5px"></el-icon></span>
              </el-tooltip>
            </template>
          </template>
        </el-table-column>
        <el-table-column label="运动健身类兴趣度" prop="registerModelInformation.sports_preference">
          <template slot-scope="scope">
            <template v-if="scope.row.registerModelInformation.model_mode!=0">
              <el-tooltip placement="top">
                <div v-html="ToBreak(scope.row.registerModelInformation.sports_preference_log)" slot="content"></div>
                <span>{{scope.row.registerModelInformation.sports_preference}}<el-icon class="el-icon-connection" style="margin-left: 5px"></el-icon></span>
              </el-tooltip>
            </template>
            <template v-else>
              <el-tooltip placement="top">
                <div slot="content">
                  {{'未填写用户信息,无模型'}}
                </div>
                <span>0<el-icon class="el-icon-close" style="margin-left: 5px"></el-icon></span>
              </el-tooltip>
            </template>
          </template>
        </el-table-column>
        <el-table-column label="城市观光类兴趣度" prop="registerModelInformation.city_sightseeing_preference">
          <template slot-scope="scope">
            <template v-if="scope.row.registerModelInformation.model_mode!=0">
              <el-tooltip placement="top">
                <div v-html="ToBreak(scope.row.registerModelInformation.city_sightseeing_preference_log)" slot="content"></div>
                <span>{{scope.row.registerModelInformation.city_sightseeing_preference}}<el-icon class="el-icon-connection" style="margin-left: 5px"></el-icon></span>
              </el-tooltip>
            </template>
            <template v-else>
              <el-tooltip placement="top">
                <div slot="content">
                  {{'未填写用户信息,无模型'}}
                </div>
                <span>0<el-icon class="el-icon-close" style="margin-left: 5px"></el-icon></span>
              </el-tooltip>
            </template>
          </template>
        </el-table-column>
        <el-table-column label="水活动兴趣度" prop="registerModelInformation.water_activity_preference">
          <template slot-scope="scope">
            <template v-if="scope.row.registerModelInformation.model_mode!=0">
              <el-tooltip placement="top">
                <div v-html="ToBreak(scope.row.registerModelInformation.water_activity_preference_log)" slot="content"></div>
                <span>{{scope.row.registerModelInformation.water_activity_preference}}<el-icon class="el-icon-connection" style="margin-left: 5px"></el-icon></span>
              </el-tooltip>
            </template>
            <template v-else>
              <el-tooltip placement="top">
                <div slot="content">
                  {{'未填写用户信息,无模型'}}
                </div>
                <span>0<el-icon class="el-icon-close" style="margin-left: 5px"></el-icon></span>
              </el-tooltip>
            </template>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-link icon="el-icon-pie-chart" @click="getUserBehaviourRadar(scope.row.user_id)">查看</el-link>
          </template>
        </el-table-column>
        </el-table-column>
      <el-table-column label="用户行为次数" v-if="showModules[4]">
          <el-table-column label="一个月内">
            <el-table-column label="总数" prop="userBehaviourFrequencyRecordList[2].total">
            </el-table-column>
            <el-table-column label="评论" prop="userBehaviourFrequencyRecordList[2].comment">
            </el-table-column>
            <el-table-column label="收藏/取消收藏">
              <template slot-scope="scope">
                <span>{{scope.row.userBehaviourFrequencyRecordList[2].collection+scope.row.userBehaviourFrequencyRecordList[2].cancel_collection}}</span>
              </template>
            </el-table-column>
            <el-table-column label="点赞或负赞">
              <template slot-scope="scope">
                <span>{{scope.row.userBehaviourFrequencyRecordList[2].like+scope.row.userBehaviourFrequencyRecordList[2].dislike}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-link icon="el-icon-view el-icon--right" @click="getUserBehaviourDetail(scope.row.userBehaviourFrequencyRecordList[2],scope.row.user_id)">查看</el-link>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="一周内">
            <el-table-column label="总数" prop="userBehaviourFrequencyRecordList[1].total">
            </el-table-column>
            <el-table-column label="评论" prop="userBehaviourFrequencyRecordList[1].comment">
            </el-table-column>
            <el-table-column label="收藏/取消收藏">
              <template slot-scope="scope">
                <span>{{scope.row.userBehaviourFrequencyRecordList[1].collection+scope.row.userBehaviourFrequencyRecordList[1].cancel_collection}}</span>
              </template>
            </el-table-column>
            <el-table-column label="点赞或负赞">
              <template slot-scope="scope">
                <span>{{scope.row.userBehaviourFrequencyRecordList[1].like+scope.row.userBehaviourFrequencyRecordList[1].dislike}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-link icon="el-icon-view el-icon--right" @click="getUserBehaviourDetail(scope.row.userBehaviourFrequencyRecordList[2],scope.row.user_id)">查看</el-link>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="三天内">
            <el-table-column label="总数" prop="userBehaviourFrequencyRecordList[0].total">
            </el-table-column>
            <el-table-column label="评论" prop="userBehaviourFrequencyRecordList[0].comment">
            </el-table-column>
            <el-table-column label="收藏/取消收藏">
              <template slot-scope="scope">
                <span>{{scope.row.userBehaviourFrequencyRecordList[0].collection+scope.row.userBehaviourFrequencyRecordList[0].cancel_collection}}</span>
              </template>
            </el-table-column>
            <el-table-column label="点赞或负赞">
              <template slot-scope="scope">
                <span>{{scope.row.userBehaviourFrequencyRecordList[0].like+scope.row.userBehaviourFrequencyRecordList[0].dislike}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-link icon="el-icon-view el-icon--right" @click="getUserBehaviourDetail(scope.row.userBehaviourFrequencyRecordList[0],scope.row.user_id)">查看</el-link>
              </template>
            </el-table-column>
          </el-table-column>
      </el-table-column>
      <el-table-column label="用户行程(一年内出现次数)" v-if="showModules[5]">
        <el-table-column label="景点">
          <template slot-scope="scope">
            {{scope.row.itineraryFrequencyByYearRecord.scene_frequency+'次'}}
          </template>
        </el-table-column>
        <el-table-column label="酒店">
          <template slot-scope="scope">
            {{scope.row.itineraryFrequencyByYearRecord.hotel_frequency+'次'}}
          </template>
        </el-table-column>
        <el-table-column label="自定义地点">
          <template slot-scope="scope">
            {{scope.row.itineraryFrequencyByYearRecord.custom_place_frequency+'次'}}
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  const moduleOptions = ['个人信息', '账号信息', '长/短期兴趣度','注册兴趣度','用户行为','用户行程'];
  import http from '@/api/index'
    export default {
      name: "userInformation",
      data(){
        return {
          tableData:[],
          checkedModules:[0,3],
          modules:moduleOptions,
          checkAll:false,
          isIndeterminate: true,
          filter_user_id:''
        }
      },
      computed:{
        showModules(){
          let arr = [false,false,false,false,false];
          for(let i=0;i<this.checkedModules.length;i++){
            arr[this.checkedModules[i]] = true
          }
          return arr;
        }
      },
      methods:{
        getfilteredData(){
          this.loadData()
        },
        getUserBehaviourRadar(user_id){
          this.$router.push({
            name:'userPreference',
            params:{
              user_id
            }
          })
        },
        handleCheckedCitiesChange(value){
          let checkedCount = value.length;
          this.checkAll = checkedCount === this.modules.length;
          this.isIndeterminate = checkedCount > 0 && checkedCount < this.modules.length;
          //console.log(this.showModules)
        },
        handleCheckAllChange(val){
          this.checkedModules = val ? [0,1,2,3,4] : [];
          this.isIndeterminate = false;
        },
        async loadData(){
          let params = {
            //user_id:this.filter_user_id
          }
          let data = await http.doPost('/getUserInformationInfoByFilter',params)
          let zero = {
            interval:0,
            cancel_collection:0,
            dislike:0,
            comment:0,
            like:0,
            collection:0,
            total:0
          }
          for(let i=0;i<data.length;i++){
            if(data[i].userBehaviourFrequencyRecordList.length==0){
              data[i].userBehaviourFrequencyRecordList.push(zero)
              data[i].userBehaviourFrequencyRecordList.push(zero)
              data[i].userBehaviourFrequencyRecordList.push(zero)
            }
          }
          this.tableData = data

        },
        getUserBehaviourDetail(val_arr,user_id){
          let params = {
            interval:val_arr.interval,
            user_id
          }
          this.$router.push({
            name:'userBehaviourRecord',
            params:params
          })
        },
        ToBreak (val) {
          return val.replace(/\\n/g,"<br>");

        }
      },
      filters:{
        fillNull(value){
          if(value!=""&&value!=0&value!=null){
            return value
          }else{
            return '尚未填写'
          }
        },
        fillNullToZero(value){
          if(value!=""&&value!=0&value!=null){
            return value
          }else{
            return '0'
          }
        }
      },
      mounted(){
        this.loadData()

      }
    }
</script>

<style scoped>

</style>
