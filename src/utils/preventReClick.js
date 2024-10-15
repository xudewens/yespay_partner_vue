import Vue from 'vue'
import { Message } from 'element-ui'
// 在vue上挂载一个指量 preventReClick
// vue防止按钮重复点击
const preventReClick = Vue.directive('preventReClick', {
  inserted: function(el, binding) {
    let isClicking = false
    el.addEventListener('click', (event) => {
      if (isClicking) {
        event.stopImmediatePropagation() // 阻止执行其他点击事件
        Message.error('请勿重复点击')
      } else {
        isClicking = true
        setTimeout(() => {
          isClicking = false
        }, binding.value || 2000)
      }
    }, true) // 在捕获阶段处理点击事件，这样可以更早地处理事件并阻止
  }
})

export { preventReClick }
