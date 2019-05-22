const { fetch } = require('./fetch')

/**
 * 文档数据类型调用
 * */
// 获得文档列表
export function getInfoList(data) { // 分页参数
  return fetch({
    url: 'wxmanager/info/getInfoList',
    data: data || {},
    method: 'GET'
  })
}

// 获得文档详情
export function getInfoContent(data) {  // infoID token
  return fetch({
    url: 'wxmanager/info/getInfoContent',
    data: data || {},
    method: 'GET'
  })
}
