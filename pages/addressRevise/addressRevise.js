// pages/addressRevise/addressRevise.js
var app = getApp();
const url = require('../../utils/url.js');
const isPhone = require('../../utils/isPhone.js');
Page({
  data: {
    typeAdress: 1,
    phone: '',
    name: '',
    capital: '',
    city: '',
    district: '',
    address: '',
    citys: [],
    topNum: 0,
    isShadow: true,
    isShadow1: true,
    typeNum: 1,
    id: '',
    isShowToast: true,
    toastData: '',
    hidden: true,
    region: ['', '', '']
  },
  onLoad: function(options) {
    var that = this;
    var dataItem = JSON.parse(options.item);
    if (options.info == 1) { //修改地址
      var region = [dataItem.province, dataItem.city, dataItem.area];
      that.setData({
        typeAdress: options.info,
        name: dataItem.name,
        phone: dataItem.phone,
        region: region,
        address: dataItem.address,
        id: dataItem.id,
      })
      wx.setNavigationBarTitle({
        title: '修改地址',
      })
    } else { //添加地址
      that.setData({
        typeAdress: options.info,

      })
      wx.setNavigationBarTitle({
        title: '添加地址',
      })
    }
  },
  onShow: function() {},
  //选择省市区
  btn_city: function(e) {
    var that = this;
    var item = e.detail.value;
    that.setData({
      region: item
    })
  },
  btn_shadow: function() {
    var that = this;
    that.setData({
      isLib: true,
      isShadow: true,
      isShadow1: true,
      hidden: true
    })
  },
  formSubmit: function(e) {
    console.log(e);
    var that = this;
    var id = that.data.id;
    var item = e.detail.value;
    var region = that.data.region;
    if (item.name == '') {
      that.setData({
        isShowToast: false,
        toastData: '请输入收货人姓名',
      })
      setTimeout(function() {
        that.setData({
          isShowToast: true,
        })
      }, 2000)
    } else if (item.phone == '') {
      that.setData({
        isShowToast: false,
        toastData: '请输入收货人电话',
      })
      setTimeout(function() {
        that.setData({
          isShowToast: true,
        })
      }, 2000)
    } else if (item.address == '') {
      that.setData({
        isShowToast: false,
        toastData: '请输入收货人地址',
      })
      setTimeout(function() {
        that.setData({
          isShowToast: true,
        })
      }, 2000)
    } else if (!isPhone.phone(item.phone)) {
      that.setData({
        isShowToast: false,
        toastData: '收货人号码格式错误',
      })
      setTimeout(function() {
        that.setData({
          isShowToast: true,
        })
      }, 2000)
    } else if (region[0] == '') {
      that.setData({
        isShowToast: false,
        toastData: '请选择省市区',
      })
      setTimeout(function() {
        that.setData({
          isShowToast: true,
        })
      }, 2000)
    } else {
      if (e.detail.target.dataset.info == 1) { //添加地址
        wx.request({
          url: app.globalData.urlApi.addAddress,
          data: {
            openid: app.globalData.openId,
            name: item.name,
            phone: item.phone,
            address: item.address,
            province: region[0],
            city: region[1],
            area: region[2]
          },
          success: function(res) {
            if (res.data.code == 1) {
              that.setData({
                isShowToast: false,
                toastData: '添加成功',
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
                toastData: '添加失败',
              })
              setTimeout(function() {
                that.setData({
                  isShowToast: true,
                })
              }, 2000)
            }
          }
        })
      } else if (e.detail.target.dataset.info == 2) { //修改地址
        wx.request({
          url: app.globalData.urlApi.editAddress,
          data: {
            id: id,
            name: item.name,
            phone: item.phone,
            address: item.address,
            province: region[0],
            city: region[1],
            area: region[2]
          },
          success: function(res) {
            if (res.data.code == 1) {
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
      } else if (e.detail.target.dataset.info == 3) {
        that.setData({
          isShadow1: false,
          hidden: false
        })
      }
    }
  },
  confirm: function() {
    var that = this;
    var id = that.data.id;
    wx.request({
      url: app.globalData.urlApi.deleteAddress,
      data: {
        id: id
      },
      success: function(res) {
        if (res.data.code == 1) {
          that.setData({
            isShowToast: false,
            toastData: '删除成功',
            isShadow1: true,
            hidden: true
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
            isShadow1: true,
            hidden: true
          })
        }
      }
    })
  },
  cancel: function() {
    var that = this;
    that.setData({
      isShadow1: true,
      hidden: true
    })
  }
})