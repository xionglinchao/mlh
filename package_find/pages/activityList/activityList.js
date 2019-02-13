const app = getApp()
const time = require('./time.js')

Page({
  data: {

  },
  onLoad: function(options) {
    this.getLocationInfo()
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

  getLocationInfo() {
    let self = this
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
        self.setData({
          'location.lat': res.latitude,
          'location.lng': res.longitude
        })
        let url = 'https://apis.map.qq.com/ws/geocoder/v1/?location=' + res.latitude + ',' + res.longitude + '&key=EDUBZ-AMNW3-H2A3K-YK3ZK-XNSRQ-E3BVZ'
        wx.request({
          method: 'GET',
          url: url,
          data: {},
          success: function(ops) {
            if (ops.data.status == 0) {
              let location = ops.data.result.address_component
              self.data.region = []
              self.data.region.push(location.province, location.city, location.district)
              console.log('逆解析地址', self.data.region)
              self.setData({
                'region': self.data.region
                // 'region': ['浙江省', '绍兴市', '柯桥区'] // 测试定位数据
              })
              self.getIndexActivityInfo()
            }
          }
        })
      },
      fail() {
        wx.showModal({
          title: '提示',
          content: '您未授权获取地理信息，该功能将无法使用',
          showCancel: false,
          confirmText: '授权',
          confirmColor: '#1eac58',
          success() {
            wx.openSetting({})
          }
        })
      }
    })
  },
  // 活动详情页面跳转
  activiDetailClick(e) {
    // console.log(e)
    let activityId = e.currentTarget.dataset.id
    let activityType = e.currentTarget.dataset.type
    if (activityType == 5) {
      wx.navigateTo({
        url: '/package_find/pages/activityDetail/activityDetail?activityId=' + activityId,
      })
    } else {
      wx.navigateTo({
        url: '/package_find/pages/collectedDetail/collectedDetail?activityId=' + activityId,
      })
    }
  },

  toActivityDetail(e) {
    let activityId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/package_find/pages/collectedDetail/collectedDetail?activityId=' + activityId,
    })
  },

  // 附近活动-阅读小站跳转
  toReadingStation() {
    wx.navigateTo({
      url: '/package_readingStation/pages/readingStation/readingStation',
    })
  },

  // 获取活动信息
  getIndexActivityInfo() {
    let self = this,
      url = `${app.baseUrl}/Api/Read_station/active_index`,
      data = {}
    console.log(175, this.data.region, this.data.location)
    data = {
      'openid': app.globalData.openId,
      'province': self.data.region[0],
      'city': self.data.region[1],
      'area': self.data.region[2],
      'lat': self.data.location.lat,
      'lng': self.data.location.lng
    }
    console.log('传递参数', data)
    app.wxRequest(url, data, (res) => {
      console.log('活动信息', res)
      if (res.data.code == 1) {
        let myDate = +(new Date()); // 获取系统当前时间戳
        console.log('myDate', myDate)
        for (let i = 0; i < res.data.data.active.length; ++i) {
          let endTime1 = res.data.data.active[i].end_time.replace(/\-/g, "/")
          let endTime = +(new Date(endTime1))
          // console.log('endTime', endTime)
          res.data.data.active[i].litpic = app.ossImgUrl + res.data.data.active[i].litpic
          if (myDate < endTime) {
            res.data.data.active[i].countDownText = self.addUnique(time.calculByEndDate(res.data.data.active[i].end_time))
          }
        }
        this.setData({
          'activityList': res.data.data.active,
          'broadcast': res.data.data.broadcast,
          'recitation': res.data.data.recitation
        })
        setInterval(() => {
          for (let i = 0; i < res.data.data.active.length; ++i) {
            let endTime1 = res.data.data.active[i].end_time.replace(/\-/g, "/")
            let endTime = +(new Date(endTime1))
            if (myDate < endTime) {
              res.data.data.active[i].countDownText = self.addUnique(time.calculByEndDate(res.data.data.active[i].end_time))
            }
          }
          this.setData({
            'activityList': res.data.data.active
          })
        }, 1000)
      }
    })
  },
  /**
   * 设置 wx:key 来指定列表中项目的唯一的标识符，提高渲染效率，解决waring
   * @params {String} ct counttime字符串 "dd:hh:mm:ss"
   */
  addUnique(ct) {
    return ct = ct.split('').map((n, idx) => Object.assign({}, {
      'text': n,
      'unique': `unique_${idx}`,
    }))
  },
  // 附近活动详情跳转
  toActivDetail(e) {
    let activityId = e.currentTarget.dataset.item.id
    let bookId = e.currentTarget.dataset.item.b_id
    wx.navigateTo({
      url: '/package_readingStation/pages/readingStation/readingActivityDetail/readingActivityDetail?activityId=' + activityId + '&bookId=' + bookId,
    })
  }
})