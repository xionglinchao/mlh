const app = getApp()

Page({
  data: {
    articleContent: [{
      'type': 1,
      'con': ''
    }], // 新增段落
    typeNum: 1,
    id: 0,
    isDisabled: false,
    pics: [],
    valueData: {},
    isLock: 0,  // 是否上锁 0未上锁 1上锁
  },
  onLoad: function(options) {

  },
  onReady: function() {

  },
  onShow: function() {
    this.getUserInfo()
  },
  onHide: function() {

  },
  onUnload: function() {

  },
  onPullDownRefresh: function() {

  },
  onReachBottom: function() {

  },
  onShareAppMessage: function() {

  },
  // 获取用户信息
  getUserInfo() {
    let self = this,
      url = `${app.baseUrl}/interface/Reading/get_info`,
      data = {}
    data = {
      'openid': app.globalData.openId,
    }
    app.wxRequest(url, data, (res) => {
      if (res.data.code == 1) {
        self.setData({
          'user': res.data.data
        })
      }
    })
  },
  // 上移
  moveUp(e) {
    let idx = e.currentTarget.dataset.idx
    let articleContent = this.data.articleContent
    this.zIndexUp(articleContent, idx, articleContent.length)
    this.setData({
      articleContent: articleContent
    })
  },
  swapArray: function(arr, index1, index2) {
    arr[index1] = arr.splice(index2, 1, arr[index1])[0];
    return arr;
  },
  zIndexUp: function(arr, index, length) {
    if (index != 0) {
      return this.swapArray(arr, index, index - 1);
    } else {
      wx.showToast({
        title: '已经处于置顶，无法上移',
        icon: 'none',
        duration: 1000,
      })
    }
  },
  // 下移
  moveDown(e) {
    let idx = e.currentTarget.dataset.idx
    let articleContent = this.data.articleContent
    this.zIndexDown(articleContent, idx, articleContent.length)
    this.setData({
      articleContent: articleContent
    })
  },
  zIndexDown: function(arr, index, length) {
    if (index + 1 != length) {
      this.swapArray(arr, index, index + 1);
    } else {
      wx.showToast({
        title: '已经处于置底，无法下移',
        icon: 'none',
        duration: 1000,
      })
    }
  },
  // 删除按钮
  deleteBtn(e) {
    // console.log(e)
    let idx = e.currentTarget.dataset.idx
    if (this.data.articleContent.length >= 2) {
      this.data.articleContent.splice(idx, 1)
    }
    this.setData({
      'articleContent': this.data.articleContent
    })
  },
  // 新建段落
  addParagraph() {
    let articleArr = this.data.articleContent
    articleArr.push({
      'type': 1,
      'con': this.data.inputValue
    })
    this.setData({
      'articleContent': articleArr
    })
  },
  // 添加图片
  btn_image: function(e) {
    let idx = e.currentTarget.dataset.idx
    let that = this;
    wx.chooseImage({
      count: 1,
      success: function(res) {
        wx.uploadFile({
          url: app.globalData.urlApi.upLoadImage,
          filePath: res.tempFilePaths[0],
          name: 'file',
          success: function(res) {
            let shopname = that.trimKong(res.data);
            if (shopname.code == 1) {
              let articleArr = that.data.articleContent
              articleArr.splice(idx + 1, 0, {
                'type': 0,
                'con': shopname.data
              })
              that.setData({
                'articleContent': articleArr
              })
            }
          }
        })
      },
    })
  },
  trimKong: function(s) {
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
  // 获取输入内容
  bindValueInput(e) {
    let inputValue = e.detail.value
    // let inputV = inputValue
    let index = e.currentTarget.dataset.index
    let dom = 'articleContent[' + index + '].con'
    // inputV = inputValue.split('\n').join('&hc')
    this.setData({
      [dom]: inputValue
    })
  },
  bindTitleValue(e) {
    let inputTitleValue = e.detail.value
    this.setData({
      inputTitleValue: inputTitleValue
    })
  },
  // 文章发布按钮
  pubArticle() {
    let self = this,
      url = `${app.baseUrl}/interface/Reading/pub_album`,
      data = {},
      flag = false;
    for (let i = 0; i < self.data.articleContent.length; ++i) {
      if (self.data.articleContent[i].type == 0) {
        flag = true;
        break;
      }
    }
    if(!flag){
      wx.showToast({
        title: '至少上传一张图片',
        icon: 'none',
        duration: 1000
      })
      return
    }
    //&hc表示换行  用于输出时候的转换
    // let stc = self.data.articleContent.split('\n').join('&hc')
    data = {
      'openid': app.globalData.openId,
      'content': JSON.stringify(self.data.articleContent),
      'type': 2,
      'title': this.data.inputTitleValue,
      'litpics': JSON.stringify(self.data.articleContent),
      'is_cable': self.data.isLock
    }
    if (!this.data.inputTitleValue) {
      wx.showToast({
        title: '请输入标题',
        icon: 'none',
        duration: 1000
      })
    } else if (self.data.articleContent.length < 1) {
      wx.showToast({
        title: '请输入内容',
        icon: 'none',
        duration: 1000
      })
    } else {
      app.wxRequest(url, data, (res) => {
        console.log('发布结果', res)
        if (res.data.code == 1) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 1000,
          })
          setTimeout(function() {
            wx.switchTab({
              url: '/pages/discover/discover',
            })
          }, 1000)
        }
      })
    }
  },
  // 设置私密按钮
  lockBtnClick() {
    if (this.data.isLock == 0) {
      var isLock = 1
    } else {
      var isLock = 0
    }
    this.setData({
      'isLock': isLock
    })
  }
})