const app = getApp()
Page({
  data: {
    relaying: [],
    dialogHeightArr: [],
  },
  onLoad: function (options) {
    console.log(options)
    this.setData({
      'user_id': options.user_id,
      'shop_id': options.shop_id,
      'contact_id': options.contact_id
    })
    this.getDetailInfo()
    this.getAllRects()
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
  getDetailInfo(user_id, shop_id, contact_id) {
    let self = this, url = app.baseUrl + '/Api/Read_station/relay_detail', data = {}
    data = {
      'user_id': self.data.user_id,
      'shop_id': self.data.shop_id,
      'contact_id': self.data.contact_id,
      'open_id': app.globalData.openId
    }
    app.wxRequest(url, data, function (res) {
      console.log('接力详情', res)
      if (res.data.code == 1) {
        self.setData({
          'relaying': res.data.data
        })
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    })
  },
  // 获取所有对话框的高度
  getAllRects: function () {
    let self = this
    wx.createSelectorQuery().selectAll('.dialog2').boundingClientRect(function (rects) {
      let hArr = []
      rects.forEach(function (rect) {
        hArr.push(rect.height)
      })
      self.setData({
        dialogHeightArr: hArr
      })
      // console.log(hArr)
      for (let i = 0; i < self.data.relaying.length; ++i) {
        for (let j = 0; j < self.data.dialogHeightArr.length; ++j) {
          if (i == j) {
            self.data.relaying[i].dialogHeight = self.data.dialogHeightArr[j]
          }
        }
      }
      // console.log(self.data.relaying)
      self.setData({
        'relaying': self.data.relaying
      })
    }).exec()
  },
  // 关注按钮
  subscribeBtnClick(e) {
    // let sucIdx = e.currentTarget.dataset.sucIdx
    // for (let i = 0; i < this.data.relaying.length; ++i) {
    //   if (sucIdx == i) {
    //     this.data.relaying[i].sucState = !this.data.relaying[i].sucState
    //   }
    // }
    // this.setData({
    //   'relaying': this.data.relaying
    // })
    let self = this, url = app.baseUrl + '/interface/Personal_center/whether_attention', data = {}
    let sucIdx = e.currentTarget.dataset.sucIdx, item = e.currentTarget.dataset.item, focus = 0
    if (item.is_focus == 1) {
      focus = 0
    } else {
      focus = 1
    }
    for (let i = 0; i < this.data.relaying.length; ++i) {
      if (sucIdx == i) {
        data = {
          'openid': app.globalData.openId,
          'id': item.user_info.id,
          'type': focus// 1关注 0取消关注
        }
        app.wxRequest(url, data, function (res) {
          console.log('关注按钮', res.data.msg)
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 1000
          })
          // 更新页面数据
          let url2 = app.baseUrl + '/Api/Read_station/relay_detail', data = {}
          data = {
            'user_id': self.data.user_id,
            'shop_id': self.data.shop_id,
            'contact_id': self.data.contact_id,
            'open_id': app.globalData.openId
          }
          wx.showLoading()
          app.wxRequest(url2, data, function (res) {
            console.log('局部刷新关注', res)
            if (res.data.code == 1) {
              for (let i = 0; i < res.data.data.length; ++i) {
                self.data.relaying[i].is_focus = res.data.data[i].is_focus
              }
              self.setData({
                'relaying': self.data.relaying
              })
              wx.hideLoading()
            }
          })
        })
      }
    }
  },
  btn_preview: function (e) {
    console.log(e)
    let itemUrl = e.currentTarget.dataset.itemUrl,
      itemArr = e.currentTarget.dataset.itemArr
    itemArr = [app.ossImgUrl + itemArr]
    wx.previewImage({
      current: app.ossImgUrl + itemUrl,
      urls: itemArr,
    })
  },
  // 跳转用户信息页面
  btn_person_information: function (e) {
    var self = this
    var item = e.currentTarget.dataset.item
    var parameterStrng = '?id=' + item.user_info.id
    app.navigateWx(self, '/pages/personalInformation/personalInformation', parameterStrng)
  },
})