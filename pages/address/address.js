// pages/address/address.js
var app = getApp();
Page({
  data: {
    addressPro: [],
    isLoading: false,
    isShadow: true,
    hidden: true,
    id: '',
    isShowToast: true,
    typeName: 1,
    isViewDisabled: true
  },
  onLoad: function(options) {
    var that = this;
    that.setData({
      typeName: options.info
    })
  },
  onShow: function() {
    var that = this;
    that.getAdress(that);
    that.setData({
      isViewDisabled: true
    })
  },
  btn_add: function(e) {
    var that = this;
    var dataItem = JSON.stringify(e.currentTarget.dataset.item);
    var parameterStrng = '?info=' + e.currentTarget.dataset.info + '&item=' + dataItem;
    if (that.data.typeName == 1) {
      app.navigateWx(this, '../addressRevise/addressRevise', parameterStrng);
    } else {
      app.redirectWx(this, '../addressRevise/addressRevise', parameterStrng);
    }
  },
  getAdress: function(that) {
    wx.request({
      url: app.globalData.urlApi.getAllAddress,
      data: {
        openid: app.globalData.openId
      },
      success: function(res) {
        if (res.data.code == 1) {
          that.setData({
            addressPro: res.data.data,
            isLoading: true
          })
        } else {
          that.setData({
            isLoading: true,
            addressPro: []
          })
        }
      }
    })
  },
  btn_default: function(e) {
    var that = this;
    if (that.data.typeName == 1) {
      that.setData({
        isShadow: false,
        hidden: false,
        id: e.currentTarget.dataset.item.id
      })
    } else {
      wx.request({
        url: app.globalData.urlApi.editDefaultAddress,
        data: {
          openid: app.globalData.openId,
          id: e.currentTarget.dataset.item.id
        },
        success: function(res) {
          if (res.data.code == 1) {
            that.getAdress(that);
            that.setData({
              isShowToast: false,
              toastData: '修改成功',
            })
            setTimeout(function() {
              that.setData({
                isShowToast: true,
              })
              wx.navigateBack({
                delta: 1
              })
            }, 2000)
          } else {
            that.setData({
              isShowToast: false,
              toastData: '修改失败',
            })
            setTimeout(function() {
              that.setData({
                isShowToast: true,
              })
            }, 2000)
          }
        }
      })
    }
  },
  confirm: function() {
    var that = this;
    var id = that.data.id;
    wx.request({
      url: app.globalData.urlApi.editDefaultAddress,
      data: {
        openid: app.globalData.openId,
        id: id
      },
      success: function(res) {
        console.log(res);
        if (res.data.code == 1) {
          that.getAdress(that);
          that.setData({
            isShowToast: false,
            toastData: '修改成功',
            isShadow: true,
            hidden: true
          })
          setTimeout(function() {
            that.setData({
              isShowToast: true,
            })
          }, 2000)
        } else {
          that.setData({
            isShowToast: false,
            toastData: '修改失败',
            isShadow: true,
            hidden: true,
          })
          setTimeout(function() {
            that.setData({
              isShowToast: true,
            })
          }, 2000)
        }
      }
    })
  },
  cancel: function() {
    var that = this;
    that.setData({
      isShadow: true,
      hidden: true
    })
  }
})