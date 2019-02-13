const app = getApp()
var WxParse = require('../../../wxParse/wxParse.js');
var audioCtx;

Page({
  data: {
    tabIndex: 0, // 选项卡下标
  },
  onLoad: function(options) {
    this.setData({
      id: options.id || null
    })
    audioCtx = wx.createInnerAudioContext()
  },
  onReady: function() {

  },
  onShow: function() {
    this.getBookInfo()
  },
  onHide: function() {
    audioCtx.stop();
  },
  onUnload: function() {
    audioCtx.stop();
  },
  onPullDownRefresh: function() {

  },
  onReachBottom: function() {

  },
  onShareAppMessage: function() {

  },
  // 选项卡
  tabControlClick_1() {
    this.setData({
      'tabIndex': 0
    })
  },
  tabControlClick_2() {
    this.setData({
      'tabIndex': 1
    })
  },
  tabControlClick_3() {
    this.setData({
      'tabIndex': 2
    })
  },
  tabControlClick_4() {
    this.setData({
      'tabIndex': 3
    })
  },
  // 获取页面信息
  getBookInfo() {
    let self = this,
      url = `${app.baseUrl}/interface/Library/library_detail`,
      data = {}
    data = {
      // 'openid': "o-V8E0UkQVNqfvby-UPsLSUI2nRM",
      'openid': app.globalData.openId,
      'id': this.data.id
      // 'id': 51,
    }
    app.wxRequest(url, data, (res) => {
      console.log('书籍详情', res)
      if (res.data.code == 1) {
        let article = res.data.data.appreciation;
        WxParse.wxParse('article', 'html', article, self, 5);
        for (let i = 0; i < res.data.data.photo.length; ++i) {
          res.data.data.photo[i] = app.ossImgUrl + res.data.data.photo[i]
        }
        for (let i = 0; i < res.data.data.works_creation[0].content.length; ++i) {
          res.data.data.works_creation[0].content[i].isPlay = 0
          res.data.data.works_creation[0].content[i].whether_like = res.data.data.works_creation[0].content[i].whether_like
          res.data.data.works_creation[0].content[i].likes = res.data.data.works_creation[0].content[i].likes
        }

        this.setData({
          'bookDetail': res.data.data,
          'relativeBook': res.data.data.related_products,
          'swiperPic': res.data.data.photo,
          'work_creation': res.data.data.works_creation,
        })
      }
    })
  },
  // 播放语音
  btn_play_sound: function(e) {
    if (!app.globalData.isNetwork) {
      wx.showModal({
        title: '提示',
        content: '当前网络状态不佳，请检查您的网络',
        showCancel: false,
        confirmText: '我知道了',
        success: function(res) {}
      })
      return;
    }
    var that = this;
    var info = e.currentTarget.dataset.info;
    var index = e.currentTarget.dataset.index;
    var commentBookPro = that.data.work_creation[0].content;
    for (var i = 0; i < commentBookPro.length; i++) {
      if (i != index) {
        commentBookPro[i].isPlay = 0;
      }
    }
    if (commentBookPro[index].isPlay == 0) {
      commentBookPro[index].isPlay = 1;
      audioCtx.autoplay = true
      audioCtx.src = app.globalData.urlApi.ossImageUrl + info;
      audioCtx.play();
    } else {
      commentBookPro[index].isPlay = 0;
      audioCtx.pause();
    }
    that.setData({
      commentBookPro: commentBookPro
    })
    audioCtx.onEnded((res) => {
      var commentBookPro1 = that.data.commentBookPro;
      for (var i = 0; i < commentBookPro1.length; i++) {
        commentBookPro1[i].isPlay = 0;
      }
      that.setData({
        commentBookPro: commentBookPro1
      })
    })
  },
  // 点赞
  likeBtnClick(e) {
    let item = e.currentTarget.dataset.item;
    let likes = 0;
    if (item.whether_like == 1) {
      likes = -1;
    } else {
      likes = 1
    }
    let self = this,
      url = `${app.baseUrl}/interface/Works/creation_likes`,
      data = {}
    data = {
      id: item.id,
      openid: app.globalData.openId,
      type: likes
    }
    app.wxRequest(url, data, (res) => {
      // console.log('点赞', res)
      wx.showToast({
        title: res.data.msg,
        icon: 'none',
        duration: 1000
      })
      // 更新页面数据
      self.getBookInfo()
    })
  },
  // 发布语音
  btn_create_writing(e) {
    var that = this;
    var info = e.currentTarget.dataset.info;
    var id = that.data.id;
    var libraryInformationPro = that.data.bookDetail;
    var parameterStrng = '?typeNum=1&id=' + id + '&classId=1' + '&name=' + libraryInformationPro.name;
    app.navigateWx(that, '/pages/posting/soundRecord/soundRecord', parameterStrng);
  },
  // 视频播放跳转
  toVideoPlay(e) {
    let videoPlay = e.currentTarget.dataset.item.video
    wx.navigateTo({
      url: '/pages/videoPlay/videoPlay?videoPlay=' + videoPlay,
    })
  },
  // 个人主页跳转
  toPersonalHomepage(e) {
    // console.log(e)
    let userId = e.currentTarget.dataset.item.u_id
    wx.navigateTo({
      url: '/pages/personalHomepage/personalHomepage?id=' + userId,
    })
  },

  // 书籍详情跳转
  toBookDetail(e) {
    console.log(e)
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/newLibrary/selectedBookInfo/selectedBookInfo?id=' + id,
    })
  }
})