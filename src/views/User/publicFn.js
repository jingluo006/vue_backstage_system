export default {
  // 防抖
  debounce(fn, delay) {
    let timer = null
    return function () {
      if (timer) {
        clearTimeout(timer)
      }
      if (timer === null) {
        fn.apply(this, arguments)
      }
      timer = setTimeout(() => {
        timer = null
      }, delay)
    }
  },

  // 节流
  throttle(fn, delay) {
    let begin = 0
    return function () {
      const current = +new Date()
      if (current - begin > delay) {
        fn.apply(this, arguments)
        begin = current
      }
    }
  }
}
