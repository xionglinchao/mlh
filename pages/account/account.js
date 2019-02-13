// pages/account/account.js
const app = getApp()
Page({
  data: {
    isShadow: true,
    hidden: true,
    isShowToast: true,
    hiddenModal: true,
    remarks: '',
    title: '输入用户名',
    userName: '',
    userDate: '',
    userCity: '',
    userImage: '',
    name: '',
    inforPro: {},
    toastData: '',
    region: ['', '', ''],
    typeNum: 0,
  },
  onLoad: function (options) {
    let that = this
    that.getUserInformation()
  },
  onShow: function () {

  },
  btn_exit: function () {
    let that = this
    that.setData({
      isShadow: false,
      hidden: false
    })
  },
  cancel: function () {
    let that = this
    that.setData({
      isShadow: true,
      hidden: true
    })
  },
  confirm: function () {
    let that = this
    let requestData = {
      openid: app.globalData.openId
    }
    app.requestPost(that, app.globalData.urlApi.getLoinOut, requestData, function (res) {
      if (res.data.code) {
        that.setData({
          isShowToast: false,
          toastData: '退出登录成功',
        })
        setTimeout(function () {
          app.redirectWx(that, '../forceLogin/forceLogin');
        }, 2000)
      } else {
        that.setData({
          isShowToast: true,
          isShadow: true,
          hidden: true
        })
      }
    })
  },
  btn_user: function () {
    let that = this
    that.setData({
      hiddenModal: false,
      remarks: '请输入用户名',
      typeNum: 1,
      title: '输入用户名'
    })
  },
  editRemarkCancel: function () {
    this.setData({
      hiddenModal: true
    })
  },
  editRemarkConfirm: function () {
    let that = this;
    let name = that.data.name;
    let typeNum = that.data.typeNum;

    let requestData = {};

    if (typeNum == 1) {
      requestData = {
        openid: app.globalData.openId,
        username: name
      }
    } else {
      requestData = {
        openid: app.globalData.openId,
        signature: name
      }
    }
    app.requestPost(that, app.globalData.urlApi.getUserEdit, requestData, function (res) {
      if (res.data.code == 1) {
        that.setData({
          isShowToast: false,
          toastData: '修改成功',
        })
        setTimeout(function () {
          that.setData({
            isShowToast: true,
            hiddenModal: true,
            userName: name
          })
          that.getUserInformation();
        }, 2000)
      } 
    })
  },
  btn_date: function (e) {
    console.log(e);
    let that = this;
    let requestData = {
      openid: app.globalData.openId,
      hako_time: e.detail.value
    }
    app.requestPost(that, app.globalData.urlApi.getUserEdit, requestData, function (res) {
      if (res.data.code == 1) {
        that.setData({
          isShowToast: false,
          toastData: '修改成功',
        })
        setTimeout(function () {
          that.setData({
            isShowToast: true,
            hiddenModal: true,
          })
          that.getUserInformation();
        }, 2000)
      }
    })
  },
  btn_date1: function (e) {
    let that = this;
    let item = e.detail.value;
    that.setData({
      region: item
    })
    wx.request({
      url: app.globalData.urlApi.getUserEdit,
      data: {
        openid: app.globalData.openId,
        area: item[0] + item[1] + item[2]
      },
      success: function (res) {
        console.log(res);
        if (res.data.code == 1) {
          that.setData({
            isShowToast: false,
            toastData: '修改成功',
          })
          setTimeout(function () {
            that.setData({
              isShowToast: true,
              hiddenModal: true,
            })
            that.getUserInformation();
          }, 2000)
        }
      }
    })
  },
  remarkInputChange: function (e) {
    console.log(e);
    let that = this;
    that.setData({
      name: e.detail.value
    })
  },
  btn_image: function () {
    let that = this;
    wx.chooseImage({
      count: 1,
      success: function (res) {
        wx.uploadFile({
          url: app.globalData.urlApi.upLoadImage,
          filePath: res.tempFilePaths[0],
          name: 'file',
          success: function (res) {
            console.log(res);
            let shopname = that.trimKong(res.data);
            wx.request({
              url: app.globalData.urlApi.getUserEdit,
              data: {
                openid: app.globalData.openId,
                litpic: app.globalData.urlApi.ossImageUrl + shopname.data
              },
              success: function (res) {
                if (res.data.code == 1) {
                  that.getUserInformation();
                  that.setData({
                    isShowToast: false,
                    toastData: '修改成功',
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
        })
      },
    })
  },
  trimKong: function (s) {
    return JSON.parse(trim(s));
    function trim(str) {
      str = str.replace(/^(\s|\u00A0)+/, '');
      for (let i = str.length - 1; i >= 0; i--) {
        if (/\S/.test(str.charAt(i))) {
          str = str.substring(0, i + 1);
          break;
        }
      }
      return str;
    }
  },
  getUserInformation: function () {
    let that = this;
    wx.request({
      url: app.globalData.urlApi.getUserInfomation,
      data: {
        openid: app.globalData.openId
      },
      success: function (res) {
        console.log(res);
        if (res.data.code == 1) {
          that.setData({
            inforPro: res.data.data
          })
        }
      }
    })
  },
  btn_signature: function () {
    let that = this;
    that.setData({
      hiddenModal: false,
      remarks: '请输入签名',
      typeNum: 2,
      title: '输入签名'
    })
  }
})