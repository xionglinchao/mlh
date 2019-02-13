var WxParse = require('../../wxParse/wxParse.js')
var innerAudioContext1 // 引导录音管理

const app = getApp()
Page({
  data: {
    'jingxuanId': -1,
    'pinglunType': -1,
    'detailName': '',
    'activtiy_img': '', // 活动图片
    'publishTime': '',
    'detailContent': '',
    'publishList': [],
    'releaseFocus': false, // 回复框
  },
  onLoad: function (options) {
    console.log('1111111111',options)
    this.setData({
      'jingxuanId': options.id
    })
    innerAudioContext1 = wx.createInnerAudioContext()
  },
  onReady: function () {
    
  },
  onShow: function () {
    this.get_is_login(this)
    this.getPageBasicInfo()
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
  getPageBasicInfo() {
    let self = this, url = app.baseUrl + '/Api/Read_station/find_comment', data = {}, jxType
    data = {
      'id': this.data.jingxuanId,
      'openid': app.globalData.openId
    }
    app.wxRequest(url, data, function (res) {
      console.log('获取精选详情', res)
      if (res.data.code == 1) {
        for (let i = 0; i < res.data.data.comment.length; ++i) {
          res.data.data.comment[i].isPlaying = false
        }
        let article = res.data.data.content
        WxParse.wxParse('article', 'html', article, self, 5)
        switch (Number(res.data.data.type)) {
          case 1: 
            jxType = '图文征集'
            break
          case 2:
            jxType = '文字征集'
            break
          case 3:
            jxType = '语音征集'
            break
          case 4:
            jxType = '视频征集'
            break
          case 5:
            jxType = '招募征集'
            break
        }
        self.setData({
          'pinglunType': res.data.data.type,
          'detailName': res.data.data.name,
          'detailContent': res.data.data.content,
          'activtiy_img': app.ossImgUrl + res.data.data.litpic,
          'publishTime': res.data.data.time,
          'publishList': res.data.data.comment,
          'jxType': jxType
        })
      }
    })
  },
  // 关注按钮
  subscribeBtnClick(e) {
    let self = this, url = app.baseUrl + '/interface/Personal_center/whether_attention', data = {}
    let sucIdx = e.currentTarget.dataset.sucIdx, item = e.currentTarget.dataset.item, focus = 0
    if (item.is_focus == 1) {
      focus = 0
    } else {
      focus = 1
    }
    for (let i = 0; i < this.data.publishList.length; ++i) {
      if (sucIdx == i) {
        data = {
          'openid': app.globalData.openId,
          'id': item.u_id,
          'type': focus// 1关注 0取消关注
        }
        app.wxRequest(url, data, function (res) {
          console.log('关注按钮', res.data.msg)
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 1000
          })
          // 更新页面数据
          let url2 = app.baseUrl + '/Api/Read_station/find_comment', data = {}
          data = {
            'id': self.data.jingxuanId,
            'openid': app.globalData.openId
          }
          wx.showLoading()
          app.wxRequest(url2, data, function (res) {
            console.log('局部刷新关注', res)
            if (res.data.code == 1) {
              for (let i = 0; i < res.data.data.comment.length; ++i) {
                self.data.publishList[i].is_focus = res.data.data.comment[i].is_focus
              }
              self.setData({
                'publishList': self.data.publishList
              })
              wx.hideLoading()
            }
          })
        })
      }
    }
  },
  // 播放评论声音
  playCommentAudio(e) {
    let self = this, audioIdx = e.currentTarget.dataset.audioIdx, audioPath = app.ossImgUrl + e.currentTarget.dataset.audio
    console.log(audioPath)
    // let audioIdx = e.currentTarget.dataset.audioIdx, audioPath = e.currentTarget.dataset.audio
    for (let i = 0; i < self.data.publishList.length; ++i) {
      if (audioIdx == i) {
        self.data.publishList[i].isPlaying = true
        self.setData({ 'publishList': self.data.publishList })
        innerAudioContext1.autoplay = true
        innerAudioContext1.src = audioPath
        innerAudioContext1.play()
        innerAudioContext1.onPlay(() => {
          innerAudioContext1.offPlay()          
          console.log('开始播放评论声音')
        })
        innerAudioContext1.onEnded(() => {
          console.log('引导录音播放完毕')
          innerAudioContext1.offEnded()
          self.data.publishList[i].isPlaying = false
          self.setData({ 'publishList': self.data.publishList })
        })
        innerAudioContext1.onError((res) => { // 音频播放失败
          console.log(res.errMsg)
          console.log(res.errCode)
        })
      } else {
        self.data.publishList[i].isPlaying = false
        self.setData({ 'publishList': self.data.publishList })
      }
    }
  },
  // 点赞按钮事件
  likeBtnClick(e) {
    let self = this, url = app.globalData.urlApi.setChioceLikes, data = {}
    let likedIdx = e.currentTarget.dataset.likedIdx, item = e.currentTarget.dataset.item, like = 0
    if (item.whether_like == 1) {
      like = -1
    } else {
      like = 1
    }
    for (let i = 0; i < this.data.publishList.length; ++i) {
      if (likedIdx == i) { // 判断当前点击的是那个按钮
        data = {
          'openid': app.globalData.openId,
          'id': item.id, // 单个评论所在列表中的id
          'type': like // 1点赞 0取消点赞
        }
        app.wxRequest(url, data, function (res) {
          console.log('点赞按钮', res.data.msg)
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 1000
          })
          // 更新页面数据
          let url2 = app.globalData.urlApi.getChioceComment, data = {}
          data = {
            'id': self.data.jingxuanId,
            'openid': app.globalData.openId
          }
          wx.showLoading()
          app.wxRequest(url2, data, function (res) {
            console.log('局部刷新点赞', res)
            if (res.data.code == 1) {
              for (let j = 0; j < res.data.data.comment.length; ++j) {
                self.data.publishList[i].likes = res.data.data.comment[i].likes
                self.data.publishList[i].whether_like = res.data.data.comment[i].whether_like
              }
              self.setData({
                'publishList': self.data.publishList
              })
              wx.hideLoading()
            }
          })
        })
      }
    }
  },
  // 征集按钮
  btn_zhengji(e) {
    let plType = Number(e.currentTarget.dataset.type)
    if (this.data.isLogin == 1) {
      if (plType == 1 || plType == 2) {
        var parameterStrng = '?typeNum=' + plType + '&id=' + this.data.jingxuanId + '&typeInfo=0'
        app.navigateWx(this, '/pages/choiceRecruitComment/choiceRecruitComment', parameterStrng)
      } else if (plType == 3) {
        wx.navigateTo({
          url: '/pages/pinglunzhengji/yuyinzhengji/yuyinzhengji?com_id=' + this.data.jingxuanId,
        })
      } else if (plType == 4) {
        wx.navigateTo({
          url: '/pages/pinglunzhengji/videozhengji/videozhengji?com_id=' + this.data.jingxuanId,
        })
      }
    } else {
      wx.navigateTo({
        url: '/pages/forceLogin/forceLogin',
      })
    }
  },
  // 二级评论按钮
  btn_erjipinglun(e) {
    let item = e.currentTarget.dataset.item
    if (this.data.isLogin == 1) {
      var parameterStrng = '?typeNum=' + 5 + '&typeInfo=' + item.id + '&id=' + this.data.jingxuanId
      app.navigateWx(this, '/pages/choiceRecruitComment/choiceRecruitComment', parameterStrng)
    } else {
      wx.navigateTo({
        url: '/pages/forceLogin/forceLogin',
      })
    }
  },
  // 精选详情单张图片预览
  btn_preview: function (e) {
    console.log(e)
    let itemUrl = e.currentTarget.dataset.itemUrl,
      itemArr = e.currentTarget.dataset.itemArr
    itemArr = [itemArr]
    wx.previewImage({
      current: app.ossImgUrl + itemUrl,
      urls: itemArr,
    })
  },
  // 多张图预览
  btn_preview2(e) {
    console.log(e)
    let itemUrl = e.currentTarget.dataset.itemUrl,
      itemArr = e.currentTarget.dataset.itemArr
    for (let i = 0; i < itemArr.length; ++i) {
      itemArr[i] = app.ossImgUrl + itemArr[i]
    }
    wx.previewImage({
      current: app.ossImgUrl + itemUrl,
      urls: itemArr,
    })
  },
  // 视频播放
  videoPlay(e) {
    console.log(e)
    var self = this
    var videoName = e.currentTarget.dataset.video
    var parameterStrng = '?videoPlay=' + videoName
    app.navigateWx(self, '/pages/videoPlay/videoPlay', parameterStrng)
  },
  btn_person_information(e) {
    var self = this
    var item = e.currentTarget.dataset.item
    var parameterStrng = '?id=' + item.u_id
    app.navigateWx(self, '/pages/personalInformation/personalInformation', parameterStrng)
  },
  // 判断是否登录
  get_is_login: function (self) {
    wx.request({
      url: app.globalData.urlApi.getExist,
      data: {
        openid: app.globalData.openId
      },
      success: function (res) {
        console.log(res)
        if (res.data.code == 1) {
          self.setData({
            isLogin: 1
          })
        } else {
          self.setData({
            isLogin: -1
          })
        }
      }
    })
  },
})