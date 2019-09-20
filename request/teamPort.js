const { fetch } = require('./fetch')
//const { postPay } = require('./payPort')
const { host } = require('../sever.config')

/**
 * 小组方法调用
 * */
// 获得管理的小组列表
export function getTeamList(data) { //token
  return fetch({
    url: 'wxmanager/team/v2/getTeamList',
    data: data || {},
    method: 'GET'
  })
}

// 获得小组信息
export function getTeamInfo(data) { //token teamID
  return fetch({
    url: 'wxmanager/team/v2/getTeamInfo',
    data: data || {},
    method: 'GET'
  })
}


// 获得小组资源列表
export function getResourceList(data) { //teamID
  return fetch({
    url: 'wxmanager/team/v2/getResourceList',
    data: data || {},
    method: 'GET'
  })
}


// 设置小组资源启用状态
export function setResourceState(data) { //resourceID state(0|1)
  return fetch({
    url: 'wxmanager/team/v2/setResourceState',
    data: data || {},
    method: 'POST'
  })
}

// 获得小组学生列表（分页）
export function getTeamProfile(data) { //teamID page
  return fetch({
    url: 'wxmanager/team/v2/getTeamProfile',
    data: data || {},
    method: 'GET'
  })
}

// 修改小组信息（名称+介绍）
export function setTeamInfo(data) { //teamID formData(name|desc)
  return fetch({
    url: 'wxmanager/team/v2/setTeamInfo',
    data: data || {},
    method: 'POST'
  })
}


// 获得小组作业列表（分页）
export function getTeamRecordGroup(data) { //teamID page
  return fetch({
    url: 'wxmanager/team/v2/getTeamRecordGroup',
    data: data || {},
    method: 'GET'
  })
}

// 获得指定作业的统计信息
export function getRecordSummary(data) { //teamID dataID
  return fetch({
    url: 'wxmanager/team/v2/getRecordSummary',
    data: data || {},
    method: 'GET'
  })
}

// 将用户踢出组
export function removeTeamMember(data) { //teamID userID
  return fetch({
    url: 'wxmanager/team/v2/removeTeamMember',
    data: data || {},
    method: 'POST'
  })
}

// 设置作业星标
export function setRecordMark(data) { //state submitID
  return fetch({
    url: 'wxmanager/team/v2/setRecordMark',
    data: data || {},
    method: 'POST'
  })
}

// 发布小组任务
export function addTeamTask(data) { //teamID content validTime(没设置为空) dataIDs(格式为[253,255])
  return fetch({
    url: 'wxmanager/team/v2/addTeamTask',
    data: data || {},
    method: 'POST'
  })
}

// 设置小组任务
export function setTeamTaskState(data) { //taskID state
  return fetch({
    url: 'wxmanager/team/v2/setTeamTaskState',
    data: data || {},
    method: 'POST'
  })
}

// 获得小组任务列表
export function getTeamTaskList(data) { //teamID page
  return fetch({
    url: 'wxmanager/team/v2/getTeamTaskList',
    data: data || {},
    method: 'GET'
  })
}

// 获得小组任务的统计信息
export function getTaskSummary(data) { //teamID taskID
  return fetch({
    url: 'wxmanager/team/v2/getTaskSummary',
    data: data || {},
    method: 'GET'
  })
}

// 提醒小组任务提醒
export function remindSubmit(data) { //taskID profileID
  return fetch({
    url: 'wxmanager/team/v2/remindSubmit',
    data: data || {},
    method: 'POST'
  })
}

// 删除小组任务
export function removeTeamTask(data) { //taskID
  return fetch({
    url: 'wxmanager/team/v2/removeTeamTask',
    data: data || {},
    method: 'POST'
  })
}
