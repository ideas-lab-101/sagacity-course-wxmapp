const { fetch } = require('./fetch')

/**
 * 系统方法调用
 * */
// 登陆接口
export function login(data) { // username password
  return fetch({
    url: 'wxmanager/system/v2/login',
    data: data || {},
    method: 'POST'
  })
}


// 注销接口
export function logout(data) { // token
  return fetch({
    url: 'wxmanager/system/v2/logout',
    data: data || {},
    method: 'POST'
  })
}


// 检查用户（在小程序打开中调用，可检查用户登陆过程状态，以及新消息通知）
export function checkUser(data) { // token
  return fetch({
    url: 'wxmanager/system/v2/checkUser',
    data: data || {},
    method: 'GET'
  })
}


// 修改密码
export function changePassword(data) { // token oldPwd newPwd
  return fetch({
    url: 'wxmanager/system/v2/changePassword',
    data: data || {},
    method: 'POST'
  })
}

// 扫码登陆
export function scanLogin(data) { // token key
  return fetch({
    url: 'wxmanager/system/v2/scanLogin',
    data: data || {},
    method: 'POST'
  })
}
