const app = getApp()
Page({
  data: {
    sw: 0,
    isLoading: false,
    dataRead: [],
    imageHead: '',
    isViewDisabled: true
  },
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sw: res.windowWidth
        })
      },
    })
  },
  onShow: function () {
    var that = this;
    that.getData();
    that.setData({
      isViewDisabled: true
    })
  },
  btn_infomartion: function (e) {
    this.setData({
      isViewDisabled: false
    })
    wx.navigateTo({
      url: '../relayInformation/relayInformation?id=' + e.currentTarget.dataset.info.s_id + '&line=' + e.currentTarget.dataset.info.line,
    })
  },
  getData: function () {
    var that = this;
    wx.request({
      url: app.globalData.urlApi.getReayBook,
      success: function (res) {
        if (res.data.code == 1) {
          that.setData({
            isLoading: true,
            dataRead: res.data.data.read_result,
            imageHead: res.data.data.photo
          })
        } else {
          that.setData({
            isLoading: true
          })
        }
      }
    })
  }
})