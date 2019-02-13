const app = getApp()
Page({
  data: {
    pics: [],
    nameItem: {},
    isShowToast: true,
    toastData: '',
    isDisabled: false
  },
  onLoad: function (options) {

  },
  onShow: function () {

  },
  btn_image: function () {
    var that = this, pics = this.data.pics
    if (pics.length == 0) {
      wx.chooseImage({
        count: 1,
        success: function (res) {
          console.log(res)
          var imgsrc = res.tempFilePaths
          pics = pics.concat(imgsrc)
          that.setData({
            pics: pics
          })
        }
      })
    } else {
      that.setData({
        isShowToast: false,
        toastData: '只能上传一张图片',
      })
      setTimeout(function () {
        that.setData({
          isShowToast: true,
        })
      }, 2000)
    }
  },
  uploadimg: function () { // 这里触发图片上传的方法
    var pics = this.data.pics
    this.uploadimg1({
      url: app.globalData.urlApi.upLoadImage, // 这里是你图片上传的接口
      path: pics // 这里是选取的图片的地址数组
    })
  },
  uploadimg1: function (data) {
    var that = this,
      i = data.i ? data.i : 0,
      success = data.success ? data.success : 0,
      fail = data.fail ? data.fail : 0
    var namePics = data.namePics ? data.namePics : []
    wx.uploadFile({
      url: data.url,
      filePath: data.path[i],
      name: 'file', // 这里根据自己的实际情况改
      success: (resp) => {
        var dataName = JSON.parse(JSON.stringify(that.trimKong(resp.data)))
        if (dataName.code == 1) {
          success++
          namePics.push(dataName.data)
          i++
          if (i == data.path.length) { // 当图片传完时，停止调用          
            that.publishActivity(namePics)
          } else { // 若图片还没有传完，则继续调用函数
            data.i = i
            data.success = success
            data.fail = fail
            data.namePics = namePics
            that.uploadimg1(data)
          }
        } else {
          that.setData({
            isDisabled: false
          })
        }
      },
      fail: (res) => {
        fail++
      }
    })
  },
  btn_delete: function (e) {
    let that = this, index = e.target.dataset.index, pics = that.data.pics
    for (let i = 0; i < pics.length; i++) {
      if (i == index) {
        pics.splice(i, 1);
        break;
      }
    }
    that.setData({
      pics: pics
    })
  },
  btn_submit: function (e) {
    let that = this, item = e.detail.value, pics = that.data.pics
    that.setData({
      isDisabled: true
    })
    if (item.name == '') {
      that.setData({
        isShowToast: false,
        toastData: '请输亲子趣事',
        isDisabled: false
      })
      setTimeout(function () {
        that.setData({
          isShowToast: true,
        })
      }, 2000)
    } else if (pics.length == 0) {
      that.setData({
        isShowToast: false,
        toastData: '请上传1张图片',
        isDisabled: false
      })
      setTimeout(function () {
        that.setData({
          isShowToast: true,
        })
      }, 2000)
    } else {
      that.setData({
        nameItem: item
      })
      that.uploadimg(pics)
    }
  },
  publishActivity: function (namePics) {
    let that = this, nameItem = that.data.nameItem
    wx.request({
      url: app.globalData.urlApi.getUserInfoSignIn,
      data: {
        openid: app.globalData.openId,
        content: nameItem.name,
        litpic: JSON.stringify(namePics)
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      success: function (res) {
        setTimeout(function () {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
          wx.navigateBack({
            delta: 1
          })
        }, 2000)
      }
    })
  },
  trimKong: function (s) {
    return JSON.parse(trim(s))
    function trim(str) {
      str = str.replace(/^(\s|\u00A0)+/, '')
      for (var i = str.length - 1; i >= 0; i--) {
        if (/\S/.test(str.charAt(i))) {
          str = str.substring(0, i + 1)
          break
        }
      }
      return str
    }
  }
})