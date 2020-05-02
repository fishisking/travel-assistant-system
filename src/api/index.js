import axios from 'axios'
var conf = {
  apikey:'w9SJFPtGTXjLKLd2phP5ML5EamVQBUbFHS6B3cs2mw060BoTzZnHDyfoMpEc6zAp',
}
var mapConf = {
  ak : 'LyYzakDwfjW6csEw300aEdFcnbU6kekf',
  region : '杭州',
  output : 'json'
}
var weatherConf = {
  appkey:'c89cb4ba91051cf1',
}
function initParams(type){
  let params = {}
  if(type=='hotel'){
    params.apikey = conf.apikey
  }else if(type=='place'){
    params.ak = mapConf.ak
    params.region = mapConf.region
    params.output = mapConf.output
  }else if(type=='weather'){
    params.appkey = weatherConf.appkey
  }
  return params;
}
export default{
  getHotelByParameter(params){
    params.apikey = conf.apikey
    if(params.sortByField=='综合排序'){
      delete params.sortByField
    }
    return new Promise((resolve,reject)=>{
      axios.post('/hotel','',{
        params
      })
        .then((res)=>{
          resolve(res.data.data);
        })
        .catch((error)=>{
          reject(error)
        })
    })
  },
  getPopularHotels(city){
    let params = initParams('hotel')
    params.city = city
    return new Promise((resolve,reject)=>{
      axios.post('/hotel','',{
        params
      })
        .then((res)=>{
          resolve(res.data.data);
        })
        .catch((error)=>{
          reject(error)
        })
    })
  },
  getHotelDetailByName(kw,city){
    let params = initParams('hotel')
    params.kw = kw
    params.city = city
    return new Promise((resolve,reject)=>{
      axios.post('/hotel','',{
        params
      })
        .then((res)=>{
          resolve(res.data.data);
        })
        .catch((error)=>{
          reject(error)
        })
    })
  },
  getPlaceDetailByKeyWord(kw){
    let params = initParams('place')
    params.query = kw
    return new Promise((resolve,reject)=>{
      axios.get('/map/search',{
        params
      })
        .then((res)=>{
          resolve(res.data.results);
        })
        .catch((error)=>{
          reject(error)
        })
    })
  },
  getPlaceSuggestionByKeyWord(kw){
    let params = initParams('place')
    params.query = kw
    return new Promise((resolve,reject)=>{
      axios.get('/map/suggestion',{
        params
      })
        .then((res)=>{
          resolve(res.data.result);
        })
        .catch((error)=>{
          reject(error)
        })
    })
  },
  getPlaceByKeyWord(kw,pageNumber){
    let params = initParams('place')
    if(pageNumber){
      params.page_num = pageNumber
    }
    params.query = kw
    return new Promise((resolve,reject)=>{
      axios.get('/map/search',{
        params
      })
        .then((res)=>{
          resolve(res.data.results);
        })
        .catch((error)=>{
          reject(error)
        })
    })
  },
  getPlaceDetailById(id){
    let params = initParams('place')
    params.uid = id
    params.scope = 2
    return new Promise((resolve,reject)=>{
      axios.get('/map/detail',{
        params
      })
        .then((res)=>{
          resolve(res.data.result);
        })
        .catch((error)=>{
          reject(error)
        })
    })
  },
  getWeatherByCity(city){
    let params = initParams('weather')
    params.city = city
    return new Promise((resolve,reject)=>{
      axios.post('/weather/query', '',{
        params
      })
        .then((res)=>{
          resolve(res.data.result);
        })
        .catch((error)=>{
          reject(error)
        })
    })
  },
  getPopularScenes(){
    return new Promise((resolve,reject)=>{
      axios.post('/api/getPopularScene', '',{

      })
        .then((res)=>{
          resolve(res.data);
        })
        .catch((error)=>{
          reject(error)
        })
    })
  },
  getAllScene(){
    return new Promise((resolve,reject)=>{
      axios.post('/api/getAllScene', '',{

      })
        .then((res)=>{
          resolve(res.data);
        })
        .catch((error)=>{
          reject(error)
        })
    })
  },
  getSceneById(params){
    return new Promise((resolve,reject)=>{
      axios.post('/api/getSceneById','',{
        params
      })
        .then((res)=>{
          resolve(res.data);
        })
        .catch((error)=>{
          reject(error)
        })
    })
  },
  getAllCustomPlace(user_id){
    return new Promise((resolve,reject)=>{
      let params = {
        user_id
      }
      axios.post('/api/getAllCustomPlace', '',{
        params
      })
        .then((res)=>{
          resolve(res.data);
        })
        .catch((error)=>{
          reject(error)
        })
    })
  },
  insertCustomPlace(custom_place){
    return new Promise((resolve,reject)=>{
      axios.post('/api/insertCustomPlace', custom_place)
        .then((res)=>{
          resolve(res.data);
        })
        .catch((error)=>{
          reject(error)
        })
    })
  },
  deleteCustomPlace(custom_place){
    return new Promise((resolve,reject)=>{
      axios.post('/api/deleteCustomPlace', custom_place)
        .then((res)=>{
          resolve(res.data);
        })
        .catch((error)=>{
          reject(error)
        })
    })
  },
  updateCustomPlace(custom_place){
    return new Promise((resolve,reject)=>{
      axios.post('/api/updateCustomPlace', custom_place)
        .then((res)=>{
          resolve(res.data);
        })
        .catch((error)=>{
          reject(error)
        })
    })
  },
  getAllPlaceCollection(user_id){
    return new Promise((resolve,reject)=>{
      let params = {
        user_id
      }
      axios.post('/api/getAllPlaceCollection', '',{
        params
      })
        .then((res)=>{
          resolve(res.data);
        })
        .catch((error)=>{
          reject(error)
        })
    })
  },
  insertPlaceCollection(PlaceCollection){
    return new Promise((resolve,reject)=>{
      axios.post('/api/insertPlaceCollection', PlaceCollection)
        .then((res)=>{
          resolve(res.data);
        })
        .catch((error)=>{
          reject(error)
        })
    })
  },
  deletePlaceCollection(PlaceCollection){
    return new Promise((resolve,reject)=>{
      axios.post('/api/deletePlaceCollection', PlaceCollection)
        .then((res)=>{
          resolve(res.data);
        })
        .catch((error)=>{
          reject(error)
        })
    })
  },
  getItineraryByDate(params){
    return new Promise((resolve,reject)=>{
      axios.post('/api/getItineraryByDate', '',{params})
        .then((res)=>{
          resolve(res.data);
        })
        .catch((error)=>{
          reject(error)
        })
    })
  },
  getAllItinerary(params){
    return new Promise((resolve,reject)=>{
      axios.post('/api/getAllItinerary', params)
        .then((res)=>{
          resolve(res.data);
        })
        .catch((error)=>{
          reject(error)
        })
    })
  },
  insertItinerary(params){
    return new Promise((resolve,reject)=>{
      axios.post('/api/insertItinerary',params)
        .then((res)=>{
          resolve(res);
        })
        .catch((error)=>{
          reject(error)
        })
    })
  },
  getSceneByIds(ids){
    return new Promise((resolve,reject)=>{
      axios.post('/api/getSceneByIds',ids)
        .then((res)=>{
          resolve(res.data);
        })
        .catch((error)=>{
          reject(error)
        })
    })
  },
  getCustomPlaceByIds(ids){
    return new Promise((resolve,reject)=>{
      axios.post('/api/getCustomPlaceByIds',ids)
        .then((res)=>{
          resolve(res.data);
        })
        .catch((error)=>{
          reject(error)
        })
    })
  },
  deleteItinerary(params){
    return new Promise((resolve,reject)=>{
      axios.post('/api/deleteItinerary',params)
        .then((res)=>{
          resolve(res.data);
        })
        .catch((error)=>{
          reject(error)
        })
    })
  },
  doPost(url,params){
    return new Promise((resolve,reject)=>{
      axios.post('/api/'+url, '',{params})
        .then((res)=>{
          resolve(res.data);
        })
        .catch((error)=>{
          reject(error)
        })
    })
  },
  doPostBean(url,bean){
    return new Promise((resolve,reject)=>{
      axios.post('/api/'+url, bean)
        .then((res)=>{
          resolve(res.data);
        })
        .catch((error)=>{
          reject(error)
        })
    })
  },
  getSentimentClassify(params){
    params.access_token = '24.e31123e9fc06a77b01bfa4a0097aeb00.2592000.1584833798.282335-18536088'
    //params.charset = 'UTF-8'
    return new Promise((resolve,reject)=>{
      axios({
        headers:{

        },
        method:'get',
        url: 'https://aip.baidubce.com/rpc/2.0/nlp/v1/sentiment_classify'+'?access_token=' + params.access_token,

      })
        .then((res)=>{
          resolve(res.data);
        })
        .catch((error)=>{
          reject(error)
        })
    })
  },
}
