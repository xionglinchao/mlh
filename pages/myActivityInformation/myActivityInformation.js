// pages/myActivityInformation/myActivityInformation.js
const app = getApp()
const url = require('../../utils/url.js')
Page({
  data: {
    sw: 0,
    id: '',
    pics: [],
    nameItem: {},
    isShowToast: true,
    toastData: '',
    dataPro: {},
    isPerson: false,
    isDisbled: false,
    isLoading: false,
    isUpload: true
  },
  onLoad: function(options) {
    let that = this
    wx.getSystemInfo({
        success: function(res) {
          that.setData({
            sw: res.windowWidth,
            id: options.id
          })
        },
      }),
      console.log(options.id)
    that.getActivitySummary(options.id)
  },
  onShow: function() {

  },
  getActivitySummary: function(id) {
    let that = this
    wx.request({
      url: app.globalData.urlApi.getActivitySumary,
      data: {
        id: id
      },
      success: function(res) {
        if (res.data.code == 1) {
          that.setData({
            dataPro: res.data.data,
            isUpload: false,
            isLoading: true,
          })
        }
      }
    })
  },
  uploadimg1: function(data) {
    let that = this,
      i = data.i ? data.i : 0,
      success = data.success ? data.success : 0,
      fail = data.fail ? data.fail : 0
    let namePics = data.namePics ? data.namePics : []
    console.log(data.path[i])
    wx.uploadFile({
      url: data.url,
      filePath: data.path[i],
      name: 'file', //这里根据自己的实际情况改
      success: (resp) => {
        let dataName = JSON.parse(JSON.stringify(that.trimKong(resp.data)))
        if (dataName.code == 1) {
          success++
          namePics.push(dataName.data)
          i++
          if (i == data.path.length) { //当图片传完时，停止调用          
            let typeName = that.data.typeName
            that.publishActivity(namePics)
          } else { //若图片还没有传完，则继续调用函数
            console.log(i)
            data.i = i
            data.success = success
            data.fail = fail
            data.namePics = namePics
            that.uploadimg1(data)
          }
        }
        //这里可能有BUG，失败也会执行这里,所以这里应该是后台返回过来的状态码为成功时，这里的success才+1
      },
      fail: (res) => {
        fail++
      }
    })
  },
  uploadimg: function() { //这里触发图片上传的方法
    let pics = this.data.pics
    this.uploadimg1({
      url: app.globalData.urlApi.upLoadImage, //这里是你图片上传的接口
      path: pics //这里是选取的图片的地址数组
    })
  },
  btn_image: function() { //这里是选取图片的方法
    let that = this,
      pics = this.data.pics
    if (pics.length < 9) {
      wx.chooseImage({
        count: 9 - pics.length,
        success: function(res) {
          console.log(res)
          let imgsrc = res.tempFilePaths
          pics = pics.concat(imgsrc)
          that.setData({
            pics: pics
          })

          // that.uploadimg(pics)
        },
        fail: function() {
          // fail
        },
        complete: function() {
          // complete
        }
      })
    } else {
      that.setData({
        isShowToast: false,
        toastData: '只能上传9张图片',
      })

      setTimeout(function() {
        that.setData({
          isShowToast: true,
        })


      }, 2000)
    }


  },
  trimKong: function(s) {
    return JSON.parse(trim(s))
    function trim(str) {
      str = str.replace(/^(\s|\u00A0)+/, '')
      for (let i = str.length - 1; i >= 0; i--) {
        if (/\S/.test(str.charAt(i))) {
          str = str.substring(0, i + 1)
          break
        }
      }
      return str
    }
  },
  btn_submit: function(e) {
    let that = this,
      item = e.detail.value,
      pics = that.data.pics
    that.setData({
      isDisbled: true
    })
    if (item.name == '') {
      that.setData({
        isShowToast: false,
        toastData: '请输入活动详情',
        isDisbled: false
      })
      setTimeout(function() {
        that.setData({
          isShowToast: true,
        })
      }, 2000)
    } else if (pics.length == 0) {
      that.setData({
        isShowToast: false,
        toastData: '请上传活动图片',
        isDisbled: false
      })
      setTimeout(function() {
        that.setData({
          isShowToast: true,
        })
      }, 2000)
    } else {
      that.setData({
        nameItem: item,
        isLoading: false,
        isUpload: true
      })
      that.uploadimg(pics)
    }
  },
  publishActivity: function(namePics) {
    let that = this,
      nameItem = that.data.nameItem,
      id = that.data.id
    wx.request({
      url: app.globalData.urlApi.addActivitySuary,
      data: {
        content: nameItem.name,
        id: id,
        litpic: JSON.stringify(namePics)
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      success: function(res) {
        console.log(res)
        if (res.data.code == 1) {
          that.setData({
            isShowToast: false,
            toastData: res.data.msg,
          })
          setTimeout(function() {
            that.setData({
              isShowToast: true,
              isDisbled: false,
              isLoading: true,
              isUpload: false
            })
            that.getActivitySummary(id)
          }, 2000)
        } else {
          that.setData({
            isShowToast: false,
            toastData: res.data.msg,
            isDisbled: false,
            isLoading: true,
            isUpload: false
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
  btn_go_personal: function() {
    let that = this
    that.setData({
      isPerson: true
    })
  },
  btn_go_back: function() {
    let that = this
    that.setData({
      isPerson: false
    })
  }
})