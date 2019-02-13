// pages/createReadyClub/createReadyClub.js
var app = getApp();
const isPhone = require('../../utils/isPhone.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShowToast: true,
    toastData: '',
    addressObj1: {},
    addressObj2: {},
    clubId: 0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.globalData.addressObj = {};
    var that = this;
    if (options.clubId){
      that.setData({
        clubId: options.clubId
      })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    that.setData({
      addressObj1: app.globalData.addressObj,
      addressObj2: app.globalData.addressObj1
    })
  },
  btn_ready_club_address1:function(){
    var that = this;
    wx.navigateTo({
      url: '../editor/editor?info=2&item=' + JSON.stringify(that.data.addressObj2),
    })
  },
  btn_submit:function(e){
    var that = this;
    var item = e.detail.value;
    var addressObj1 = that.data.addressObj1;
    var addressObj2 = that.data.addressObj2;
    var clubId = that.data.clubId;
    if (item.clubName == '') {
      that.setData({
        isShowToast: false,
        toastData: '请输入阅读会名称',
      })
      setTimeout(function () {
        that.setData({
          isShowToast: true,
        })
      }, 2000)
    } else if (item.name == '') {
      that.setData({
        isShowToast: false,
        toastData: '请输入您的名称',
      })
      setTimeout(function () {
        that.setData({
          isShowToast: true,
        })
      }, 2000)
    } else if (item.phone == '') {
      that.setData({
        isShowToast: false,
        toastData: '请输入您的手机号码',
      })
      setTimeout(function () {
        that.setData({
          isShowToast: true,
        })
      }, 2000)
    } else if (item.phone.length != 11) {
      that.setData({
        isShowToast: false,
        toastData: '手机格式不对',
      })
      setTimeout(function () {
        that.setData({
          isShowToast: true,
        })
      }, 2000)
    } else if (item.capital == '') {
      that.setData({
        isShowToast: false,
        toastData: '请输入读书会详细地址',
      })
      setTimeout(function () {
        that.setData({
          isShowToast: true,
        })
      }, 2000)
    }else{
      wx.request({
        url: app.globalData.urlApi.createBookClub,
        data:{
          openid: app.globalData.openId,
          name: item.clubName,
          signals: '',
          username: item.name,
          address: item.capital,
          phone: item.phone,
          acceptance_name: '',
          acceptance_phone: '',
          acceptance_province: '',
          acceptance_city: '',
          acceptance_area: '',
          acceptance_address: '',
          id: clubId
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST",
        success:function(res){
          console.log('创建读书会',res)
            that.setData({
              isShowToast: false,
              toastData: res.data.msg,
            })
            setTimeout(function () {
              that.setData({
                isShowToast: true,
              })
              if(res.data.code == 1){
                app.globalData.addressObj1 = {};
                wx.navigateBack({
                  delta: 1
                })
              }
            }, 2000)
        }
      })
    }
  }
})