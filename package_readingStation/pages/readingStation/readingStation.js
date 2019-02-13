const app = getApp()
Page({
  data: {
    region: ['请选择区域'],
    location: null,
    receive_coin_num: 0,
    bookId: -1,
    mainImgUrl: '',
    rankList: [], // 排行列表
    hideDushuhui: true,
    dushuhuiList: [] // 读书会列表
  },
  onLoad: function (options) {
    this.getLocationInfo()
  },
  onReady: function () {

  },
  onShow: function () {
    
  },
  onHide: function () {

  },
  onUnload: function () {

  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {

  },
  onShareAppMessage: function () {

  },
  getLocationInfo() {
    let self = this
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        self.setData({
          'location.lat': res.latitude,
          'location.lng': res.longitude
        })
        let url = 'https://apis.map.qq.com/ws/geocoder/v1/?location=' + res.latitude + ',' + res.longitude + '&key=EDUBZ-AMNW3-H2A3K-YK3ZK-XNSRQ-E3BVZ'
        wx.request({
          method: 'GET',
          url: url,
          data: {},
          success: function (ops) {
            if (ops.data.status == 0) {
              let location = ops.data.result.address_component
              self.data.region = []
              self.data.region.push(location.province, location.city, location.district)
              console.log('逆解析地址', self.data.region)
              self.setData({
                'region': self.data.region
                // 'region': ['浙江省', '绍兴市', '柯桥区'] // 测试定位数据
              })
              self.getDushuhuiList()
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
  // 地理位置选择
  bindRegionChange(e) {
    this.setData({
      'region': e.detail.value
    })
    this.getDushuhuiList()
  },
  // 获取读书会列表
  getDushuhuiList() {
    wx.showLoading({
      title: '加载中',
    })
    let self = this, url = app.baseUrl + '/Api/Read_station/all_small_station', data = {}
    console.log(175, this.data.region, this.data.location)
    data = {
      'province': this.data.region[0],
      'city': this.data.region[1],
      'area': this.data.region[2],
      'lat': this.data.location.lat,
      'lng': this.data.location.lng,
      'openid': app.globalData.openId
    }
    console.log('传递参数', data)
    app.wxRequest(url, data, function (res) {
      wx.hideLoading()
      console.log('阅读小站', res)
      if (res.data.code == 1) {
        let dushuhuiList = []
        for (let i = 0; i < res.data.data.book_detail.length; ++i) { // 统计该地区所有的读书会活动
          if (res.data.data.book_detail[i].active_lists) {
            for (let j = 0; j < res.data.data.book_detail[i].active_lists.length; ++j) {
              dushuhuiList.push(res.data.data.book_detail[i].active_lists[j])
            }
          }
        }
        console.log(dushuhuiList)
        // if (dushuhuiList.length == 0) {
        //   wx.showModal({
        //     title: '提示',
        //     content: '当前区域没有任何读书会活动哦',
        //   })
        // }
        self.setData({
          'bookId': res.data.data.book_detail[0].book_id,
          'mainImgUrl': res.data.data.common_info.pic,
          'receive_coin_num': res.data.data.common_info.weidare,
          'rankList': res.data.data.welfare_lists,
          'hideDushuhui': false,
          'dushuhuiList': dushuhuiList
        })
      } else {
        self.setData({
          'rankList': [],
          'dushuhuiList': []
        })
      }

    })
  },
  // 跳转读书会详情
  toRaDetail(e) {
    console.log(e)
    wx.navigateTo({
      url: '/package_readingStation/pages/readingStation/readingActivityDetail/readingActivityDetail?activityId=' + e.currentTarget.dataset.activityId + '&bookId=' + this.data.bookId,
    })
  },
  // 跳转读书会页面
  toDushuhui(e) {
    wx.navigateTo({
      url: '/package_readingStation/pages/dushuhui/dushuhui?bookId=' + e.currentTarget.dataset.bookId + '&lat=' + this.data.location.lat + '&lng=' + this.data.location.lng,
    })
  },
  btn_person_information(e) {
    var self = this
    var item = e.currentTarget.dataset.item
    var parameterStrng = '?id=' + item.userinfo.id
    // app.navigateWx(self, '/pages/personalInformation/personalInformation', parameterStrng)
    app.navigateWx(self, '/pages/personalHomepage/personalHomepage', parameterStrng)
  },
})