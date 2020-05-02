export const success = (that,text) => that.$message({
  message: '成功',
  type: 'success'
})
export const danger = that => that.$message({
  message: '失败',
  type: 'error'
})
export const warning = that => that.$message({
  message: '警告',
  type: 'warning'
})
export const info = that => that.$message({
  message: '你已评价',
})

