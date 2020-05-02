var common = {
  deepClone:function(obj){
    if(typeof obj!== 'object'||obj==null){
      //obj是null或者不是对象和数组，直接返回
      return obj;
    }
    let result;//判断数组和对象
    if(obj instanceof Array){
      result = []
    }else{
      result = {}
    }
    for(let key in obj){
      //保证key不是原型的属性
      if(obj.hasOwnProperty(key)){
        //递归调用
        result[key] = this.deepClone(obj[key])
      }
    }
    return result;
  },
  formatSex:function(cellValue) {
    if(cellValue==1){
      return '男'
    }else if(cellValue==2){
      return '女'
    }
  },
  formatTravelStyle:function(cellValue) {
    if(cellValue==1){
      return '自然风光'
    }else if(cellValue==2){
      return '户外休闲'
    }else if(cellValue==3){
      return '城市生活'
    }else if(cellValue==4){
      return '热爱运动'
    }else if(cellValue==5){
      return '展馆演出'
    }else if(cellValue==6){
      return '其他'
    }
  },
  formatPermission:function(cellValue) {
    if(cellValue==0){
      return '用户'
    }else {
      return '管理员'
    }
  },
  abc:function(){
    return 'abc'
  }
}
export default common;
