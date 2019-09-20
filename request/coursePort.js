const { fetch } = require('./fetch')

/**
 * course
 * */
// 获得小组课程列表
export function getCourseList(data) { // teamID state(选)
  return fetch({
    url: 'wxmanager/course/v2/getCourseList',
    data: data || {},
    method: 'GET'
  })
}


// 获得课程章节
export function GetLessonList(data) { // courseID page orderType(ASC|DESC)
  return fetch({
    url: 'wxmanager/course/v2/GetLessonList',
    data: data || {},
    method: 'GET'
  })
}
