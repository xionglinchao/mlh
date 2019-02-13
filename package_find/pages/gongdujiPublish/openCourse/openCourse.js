const app = getApp()
Page({
  data: {
    isCheckedHide: true, // 是否隐藏同意协议
    // 课程特色服务
    listBox: [],
    // 如何进行开课
    listBox2: [],
    info:'',
  },
  onLoad: function(options) {
    this.getMessage()
    this.setData({
      'u_sweep_id': options.u_sweep_id || null
    })
  },
  onReady: function() {

  },
  onShow: function() {

  },
  onHide: function() {

  },
  onUnload: function() {

  },
  onPullDownRefresh: function() {

  },
  onReachBottom: function() {

  },
  onShareAppMessage: function() {

  },
  
  // 获取课程信息
  getMessage () {
    var that = this
    var url = app.baseUrl + '/interface/Reading/open_course',data={}
    app.wxRequest(url, data, function (res) {
      console.log('推广大使', res)
      if(res.data.code == 1){
        let info = res.data.data
        res.data.data.open_course_cover = app.ossImgUrl + res.data.data.open_course_cover
        that.setData({
          info: info
        })
      }
    })
  },

  // 即刻加入
  openCourseClick: function () {
    let self = this, url = `${app.baseUrl}/interface/Pay/to_be_ambassadors`, data = {}
    data = {
      'openid': app.globalData.openId,
      'u_sweep_id': self.data.u_sweep_id ? self.data.u_sweep_id:''
    }
    app.wxRequest(url, data, (res) => {
      console.log('加入推广大使',res)
      if(res.data.code == 1) {
        var item = res.data.msg.config
        wx.requestPayment({
          'timeStamp': item.timestamp,
          'nonceStr': item.nonceStr,
          'package': item.package,
          'signType': item.signType,
          'paySign': item.paySign,
          'success': function (result) {
            // wx.navigateTo({
            //   url: '/package_find/pages/gongdujiPublish/ambassador/ambassador',
            // })
            wx.navigateBack({
              delta: 1
            })
          },
          'fail': function (result) {
            console.log(result, 3132131312313131)
          }
        })
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 1000,
        })
      }
    })
  },
})