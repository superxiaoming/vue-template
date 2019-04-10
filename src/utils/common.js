// 深克隆
export function deepClone(obj) {
  const objClone = Array.isArray(obj) ? [] : {}
  if (obj && typeof obj === 'object') {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        // 判断ojb子元素是否为对象，如果是，递归复制
        if (obj[key] && typeof obj[key] === 'object') {
          objClone[key] = deepClone(obj[key])
        } else {
          // 如果不是，简单复制
          objClone[key] = obj[key]
        }
      }
    }
  }
  return objClone
}

// 获取label值
export function getLabel(param, Objects) {
  for (let i = 0; i < Objects.length; i++) {
    var status = 0
    var value = null
    if (param === Objects[i].value) {
      status = 1
      value = Objects[i].label
    }
    if (status === 0) {
      continue
    } else {
      return value
    }
  }
}

// 数组转字符串，以逗号隔开
export function arrayToString(array) {
  let string = ''
  for (let i = 0; i < array.length; i++) {
    string = string + array[i] + ','
  }
  return string
}

// 邮箱验证
export function mailValidate(val) {
  const reg = /[a-zA-Z0-9_\-.]+@(qq.com|foxmail.com|189.cn|corp.21cn.com)/
  if (reg.test(val)) {
    return true
  } else {
    return false
  }
}

// 特殊字符验证
export function specialValidate(val) {
  const regEn = /[`~!@#$%^&*()_+<>?:"{},\/;'[\]]/
  const regCn = /[·！#￥（——）：；“”‘、，|《》？、【】[\]]/

  if (regEn.test(val) || regCn.test(val)) {
    return false
  } else {
    return true
  }
}

// 特殊字符验证
export function ruleValue(val) {
  const regCn = /^[0-9]*[1-9][0-9]*$/

  if (regCn.test(val)) {
    return true
  } else {
    return false
  }
}

// 数组去重
export function uniq(array) {
  var temp = [] // 一个新的临时数组
  for (var i = 0; i < array.length; i++) {
    if (temp.indexOf(array[i]) === -1) {
      temp.push(array[i])
    }
  }
  return temp
}
