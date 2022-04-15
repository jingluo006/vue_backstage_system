// 邮箱校验规则
const checkEmail = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('邮箱名不能为空'))
  }
  const emailRegExp = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
  if (!emailRegExp.test(value)) {
    return callback(new Error('邮箱名格式错误'))
  }
  callback()
}
// 手机号校验规则
const checkMobile = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('手机号不能为空'))
  }
  const mobileRegExp = /^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/
  if (!mobileRegExp.test(value)) {
    return callback(new Error('手机号格式错误'))
  }
  callback()
}

export { checkEmail, checkMobile }
