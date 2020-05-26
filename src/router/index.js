import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/home'
import Search from '@/views/search'
import itinerary from '@/views/travel/itinerary/itinerary'
import addItinerary from '@/views/travel/itinerary/addItinerary'
import myCustomPlace from '@/views/travel/myCustomPlace/myCustomPlace'
import updateMyCustomPlace from '@/views/travel/myCustomPlace/updateMyCustomPlace'
import addMyCustomPlace from '@/views/travel/myCustomPlace/addMyCustomPlace'
import placeCollection from '@/views/travel/placeCollection/placeCollection'
import findLog from '@/views/log/findLog'
import logDetail from '@/views/log/logDetail'
import comment from '@/views/log/comment'
import logCollection from '@/views/log/logCollection'
import searchLog from '@/views/log/searchLog'
import userPreference from '@/views/model/userPreference'
import userBehaviourRecord from '@/views/model/userBehaviourRecord'
import userInformation from '@/views/user/userInformation'
import userInformationRecord from '@/views/model/userInformationRecord'
//import flightQuery from '@/views/travel/flightQuery/flightQuery'
import flightQuery from '@/views/travel/trafficQuery/coach'
import TrafficQuery from '@/views/travel/trafficQuery/index'
import sceneReport from '@/views/model/sceneReport'
Vue.use(Router)
export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,

    },
    {
      path: '/home',
      name: 'home',
      component: Home,
    },
    {
      path: '/search/:field/:kw',
      name: 'search',
      component: Search
    },
    {
      path:'/travel',
      redirect:'/travel/itinerary'
    },
    {
      path:'/travel/itinerary',
      name:'itinerary',
      component:itinerary
    },
    {
      path:'/travel/itinerary/add',
      name:'addItinerary',
      component:addItinerary
    },
    {
      path:'/travel/myCustomPlace',
      component:myCustomPlace
    },
    {
      path:'/travel/myCustomPlace/add',
      component:addMyCustomPlace
    },
    {
      path:'/travel/myCustomPlace/update',
      component:updateMyCustomPlace
    },
    {
      path:'/travel/placeCollection',
      component:placeCollection
    },
    {
      path:'/travel/flightQuery',
      component:flightQuery
    },
    {
      path:'/travel/trafficQuery/index',
      component:TrafficQuery
    },
    {
      path:'/travel/trafficQuery/coach',
      component:flightQuery
    },
    {
      path:'/travel/trafficQuery/train',
      component:flightQuery
    },
    {
      path:'/travel/trafficQuery/flight',
      component:flightQuery
    },
    {
      path:'/log/findLog',
      component:findLog
    },
    {
      path:'/log/logDetail/:log_id',
      name:'logDetail',
      component:logDetail
    },
    {
      path:'/log/comment/:log_id',
      name:'comment',
      component:comment
    },
    {
      path:'/log/logCollection',
      name:'logCollection',
      component:logCollection
    },
    {
      path:'/log/searchLog',
      name:'searchLog',
      component:searchLog
    },
    {
      path:'/model/userPreference',
      name:'userPreference',
      component:userPreference
    },
    {
      path:'/model/userBehaviourRecord',
      name:'userBehaviourRecord',
      component:userBehaviourRecord
    },
    {
      path:'/user/userInformation',
      name:'userInformation',
      component:userInformation
    },
    {
      path:'/model/userInformationRecord',
      component:userInformationRecord
    },
    {
      path:'/model/sceneReport',
      component:sceneReport
    },

  ]
})
