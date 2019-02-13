// pages/joinMeeting/joinMeeting.js
var app = getApp();
const isPhone = require('../../../utils/isPhone.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShowToast: true,
    toastData: '',
    id: 0,
    joinNum: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log('申请加入义工',options)
    that.setData({
      id: options.id,
      joinNum: options.type,
      bookId: options.bookId || null
    })
  },
  onShow: function () {

  },
  btn_submit: function (e) {
    console.log(e);
    var that = this;
    var item = e.detail.value;
    if (item.name == '') {
      that.setData({
        isShowToast: false,
        toastData: '请输入称呼',
      })
      setTimeout(function () {
        that.setData({
          isShowToast: true,
        })
      }, 2000)
    } else if (item.phone == '') {
      that.setData({
        isShowToast: false,
        toastData: '请输入联系电话',
      })
      setTimeout(function () {
        that.setData({
          isShowToast: true,
        })
      }, 2000)
    } else if (!isPhone.phone(item.phone)) {
      that.setData({
        isShowToast: false,
        toastData: '联系电话格式不对',
      })
      setTimeout(function () {
        that.setData({
          isShowToast: true,
        })
      }, 2000)
    } else if (item.remarks == '') {
      that.setData({
        isShowToast: false,
        toastData: '请输入加入理由',
      })
      setTimeout(function () {
        that.setData({
          isShowToast: true,
        })
      }, 2000)
    } else {
      console.log('book_id:'+that.data.bookId, 'type:'+that.data.joinNum)
      wx.request({
        url: app.globalData.urlApi.getJoinReadMeeting,
        data: {
          book_id: that.data.bookId,
          // book_id: 46,
          id: that.data.id, 
          openid: app.globalData.openId,
          username: item.name,
          weixin: '1',
          phone: item.phone,
          cause: item.remarks,
          type: that.data.joinNum
        },
        success: function (res) {
          console.log('申请加入义工', res, app.globalData.openId, that.data.bookId)
          if (res.data.code == 1) {
            that.setData({
              isShowToast: false,
              toastData: res.data.msg,
            })
            setTimeout(function () {
              that.setData({
                isShowToast: true,
              })
              wx.navigateBack({
                delta: 1
              })
            }, 2000)
          } else if (res.data.code == 2) {
            that.setData({
              isShowToast: false,
              toastData: res.data.msg,
            })
            setTimeout(function () {
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
              toastData: res.data.msg,
            })

            setTimeout(function () {
              that.setData({
                isShowToast: true,
              })
            }, 2000)
          }
        }
      })
    }
  }
})