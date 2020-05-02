let switchScene_type = function(type_id){
  switch(type_id){
    case 0:
      return '自然风光'
    case 1:
      return '文化古迹'
    case 2:
      return '农家度假'
    case 3:
      return '游乐场'
    case 4:
      return '户外运动'
    case 5:
      return '展馆表演'
    case 6:
      return '公园'
    case 7:
      return '运动健身'
    case 8:
      return '城市观光'
    case 9:
      return '水活动'
  }
}
let switchType = ((type_id)=>{
  switch(type_id){
    case 0:
      return '景点'
    case 1:
      return '酒店'
    case 2:
      return '自定义地点'
  }
})
let switchBehaviourType = ((type_id)=>{
  switch(type_id){
    case 0:
      return '评论'
    case 1:
      return '点赞'
    case -1:
      return '点负赞'
    case 2:
      return '收藏'
    case -2:
      return '取消收藏'
  }
})
export {switchScene_type,switchType,switchBehaviourType}
