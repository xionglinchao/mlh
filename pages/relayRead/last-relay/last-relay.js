const app = getApp()
Page({
  data: {
    form: {
      donateMsg: '',
      receivePeople: '',
      telephone: '',
      address: ''
    },
    content: [
      '您可以将数据捐赠给学校或者社区图书馆，请填写您的捐赠信息，以便我们核实。',
    ],
    tempUrlArr: [] // 上传照片的临时地址
  },
  onLoad: function (options) {
    console.log(options)
    this.setData({
      'com_id': options.com_id
    })
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
  getInputMsg(e) {
    let id = Number(e.currentTarget.id)
    switch (id) {
      case 0:
        this.setData({ 'form.donateMsg': e.detail.value })
        break
      case 1:
        this.setData({ 'form.receivePeople': e.detail.value })
        break
      case 2:
        this.setData({ 'form.telephone': e.detail.value })
        break
      case 3:
        this.setData({ 'form.address': e.detail.value })
        break
      default: ;
    }
  },
  // 添加照片
  chooseImage() {
    let self = this, imgArr = this.data.tempUrlArr
    wx.chooseImage({
      count: 1,
      success: function (res) {
        console.log(res)
        self.setData({
          'tempUrlArr': res.tempFilePaths
        })
      },
    })
  },
  // 提交信息
  submitInfo() {
    console.log(this.data.form)
    let self = this, form = this.data.form
    if (form.donateMsg == '') {
      this.showNotice(0)
      return false
    } else if (form.receivePeople == '') {
      this.showNotice(1)
      return false
    } else if (form.telephone === '' || !(/^1[34578]\d{9}$/.test(form.telephone))) {
      this.showNotice(2)
      return false
    } else if (form.address == '') {
      this.showNotice(3)
      return false
    }
    console.log(app.globalData.urlApi.upLoadImage, self.data.tempUrlArr)
    wx.showLoading({
      'title': '正在努力提交中'
    })
    wx.uploadFile({
      url: app.globalData.urlApi.upLoadImage,
      filePath: self.data.tempUrlArr[0],
      name: 'file',// 这里根据自己的实际情况改
      success: (res) => {
        console.log('图片上传成功', res)
        let dataName = JSON.parse(JSON.stringify(self.trimKong(res.data))), pic = []
        pic.push(dataName.data)
        let url = app.baseUrl + '/Api/Last_stick/add', data = {}
        data = {
          'com_id': self.data.com_id,
          'name': self.data.form.receivePeople,
          'phone': self.data.form.telephone,
          'address': self.data.form.address,
          'content': self.data.form.donateMsg,
          // 'litpic': pic,
          'litpic': pic.length > 0 ? JSON.stringify(pic) : '',
          'openid': app.globalData.openId,
        }
        console.log(data)
        app.wxRequest(url, data, function (res) {
          wx.hideLoading()
          console.log('提交结果', res)
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
          if (res.data.code == 1) {
            setTimeout(() => {
              wx.navigateBack({
                delta: 1
              })
            }, 2000)
          }
        })
      },
      fail: (err) => {
        console.log('图片上传失败', err)
      }
    })
  },
  // 图片删除
  btn_delete: function (e) {
    console.log(e)
    var that = this
    var index = e.target.dataset.index
    var pics = that.data.tempUrlArr
    for (var i = 0; i < pics.length; i++) {
      if (i == index) {
        pics.splice(i, 1)
        break
      }
    }
    that.setData({
      'tempUrlArr': pics
    })
  },
  // 图片预览
  btn_preview: function (e) {
    console.log(e)
    let itemUrl = e.currentTarget.dataset.itemUrl,
      itemArr = e.currentTarget.dataset.itemArr
    for (let i = 0; i < itemArr.length; ++i) {
      itemArr[i] = itemArr[i]
    }
    wx.previewImage({
      current: itemUrl,
      urls: itemArr,
    })
  },
  // 错误提示
  showNotice(idx) {
    let cnt
    switch (idx) {
      case 0:
        cnt = '请填写您的捐赠信息'
        break
      case 1:
        cnt = '请填写接受对象'
        break
      case 2:
        cnt = '请填写正确的手机号'
        break
      case 3:
        cnt = '请填写详细地址'
        break
      default: ;
    }
    wx.showToast({
      title: cnt,
      icon: 'none'
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
  },
})