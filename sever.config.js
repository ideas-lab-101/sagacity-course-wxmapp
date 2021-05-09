//配置文件
const Environment = 'production'
const version = '2.0.1'

const host = Environment === 'development' ? "http://dev.linestorm.ltd/" : "https://xiaode.ideas-lab.cn/"

const resourseUrl = host + 'resource/'
const qiniuUploadUrl= 'https://up-z2.qbox.me'
const qiniuDomain= 'http://cloud-course.ideas-lab.cn/'

module.exports = {
    host: host,
    resourseUrl: resourseUrl,
    qiniuUploadUrl: qiniuUploadUrl,
    qiniuDomain: qiniuDomain
}
