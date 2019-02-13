// pages/myFollowPersonal/myFollowPersonal.js
var app = getApp();
Page({
  data: {
    sw: 0,
    lineWidth: 0,
    sliderOffset: 0,
    followIndex: 0,
    followPersonalPro: []
  },
  onLoad: function(options) {
    var that = this;
    if (options.followIndex) {
      that.setData({
        'followIndex': options.followIndex,
        'open_id': options.open_id
      })
    } else {
      that.setData({
        'followIndex': 0,
        'open_id': options.open_id
      })
    }

    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          sw: res.windowWidth,
          lineWidth: res.windowWidth * 0.5,
        })
      },
    })
  },
  onShow: function() {
    var followIndex = this.data.followIndex;

    this.getFollowPersonData(followIndex);
  },
  btn_follow_class: function(e) {

    var that = this;
    var index = e.currentTarget.dataset.index;
    var sliderOffset = that.data.sliderOffset;
    var lineWidth = that.data.lineWidth;

    that.getFollowPersonData(index);

    that.setData({
      sliderOffset: index * lineWidth,
      followIndex: index
    })
  },
  getFollowPersonData: function(num) {
    var that = this;

    var requestData = {
      type: num == 1 ? '0' : '1',
      openid: that.data.open_id ? that.data.open_id:app.globalData.openId,
    }
    app.requestPost(that, app.globalData.urlApi.attentionPersonal, requestData, function(res) {

      if (res.data.code == 1) {

        var item = res.data.date;

        if (item.length == 0) {
          item = null;
        }

        that.setData({
          followPersonalPro: item
        })
      } else {
        that.setData({
          followPersonalPro: null
        })
      }
    })
  },
  btn_attention: function(e) {
    let that = this, url = app.baseUrl + '/interface/Personal_center/whether_attention', data = {}
    let sucIdx = e.currentTarget.dataset.sucIdx, item = e.currentTarget.dataset.item, focus = 0
    if (item.attention == 0) {
      focus = 1
    } else {
      focus = 0
    }
    for (let i = 0; i < that.data.followPersonalPro.length; ++i) {
      if (sucIdx == i) { // 判断当前是哪个按钮
        data = {
          'openid': app.globalData.openId,
          'id': item.id,
          'type': focus // 1关注 0取消关注
        }
        app.wxRequest(url, data, function (res) {
          console.log('关注按钮', res.data.msg)
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 1000
          })
          // 更新页面数据
          that.getFollowPersonData(that.data.followIndex);
        })
      }
    }
  },
  btn_person_information: function(e) {
    var that = this;
    var item = e.currentTarget.dataset.item;
    var parameterStrng = '?id=' + item.id;
    app.navigateWx(that, '/pages/personalHomepage/personalHomepage', parameterStrng);
  }
})