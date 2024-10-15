exports.install = function(Vue) {
  Vue.prototype.copyTable = function(text) {
    console.log()
    if (text === '') {
      this.$message.warning('内容为空')
    } else {
      var input = document.createElement('input')
      input.value = text
      document.body.appendChild(input)
      input.select()
      document.execCommand('Copy')
      document.body.removeChild(input)
      this.$message.success('复制成功')
    }
  }
}
