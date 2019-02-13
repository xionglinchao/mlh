const app = getApp()
const time = require('./time.js')
var WxParse = require('../../../wxParse/wxParse.js')

Page({
  data: {
    isTabControlHide: 1, // 选项卡内容是否隐藏
    isFocused: false, // 是否关注
  },
  onLoad: function(options) {
    this.setData({
      activityId: options.activityId || null
    })
  },
  onReady: function() {

  },
  onShow: function() {
    this.getBasicInfo()
    this.getCommentInfo()
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
  // 选项卡点击事件
  tabClickBtn1: function() {
    this.data.isTabControlHide = 1
    this.setData({
      'isTabControlHide': this.data.isTabControlHide
    })
  },
  tabClickBtn2: function() {
    this.data.isTabControlHide = 2
    this.setData({
      'isTabControlHide': this.data.isTabControlHide
    })
  },
  tabClickBtn3: function() {
    this.data.isTabControlHide = 3
    this.setData({
      'isTabControlHide': this.data.isTabControlHide
    })
  },
  // 获取页面信息
  getBasicInfo() {
    let self = this,
      url = app.baseUrl + '/interface/Find/activity_detail',
      data = {}
    data = {
      'openid': app.globalData.openId,
      'id': this.data.activityId
    }
    app.wxRequest(url, data, (res) => {
      console.log('征集详情', res)
      if (res.data.code == 1) {
        res.data.data.litpic = app.ossImgUrl + res.data.data.litpic
        res.data.data.countDownText = self.addUnique(time.calculByEndDate(res.data.data.end_time))
        let article = res.data.data.content
        WxParse.wxParse('article', 'html', article, self, 5)
        let article2 = res.data.data.mom
        WxParse.wxParse('article2', 'html', article2, self, 5)
        this.setData({
          'activityDetail': res.data.data,
          'countDownText': res.data.data.countDownText,
        })
        setInterval(() => {
          res.data.data.countDownText = self.addUnique(time.calculByEndDate(res.data.data.end_time))
          this.setData({
            'countDownText': res.data.data.countDownText
          })
        }, 1000)
      }
    })
  },
  /**
   * 设置 wx:key 来指定列表中项目的唯一的标识符，提高渲染效率，解决waring
   * @params {String} ct counttime字符串 "dd:hh:mm:ss"
   */
  addUnique(ct) {
    return ct = ct.split('').map((n, idx) => Object.assign({}, {
      'text': n,
      'unique': `unique_${idx}`,
    }))
  },
  // 首页跳转
  toHomePage() {
    wx.reLaunch({
      url: '/pages/homepage/homepage',
    })
  },
  // 评价页面跳转
  toCommentPage(e) {
    let id = e.currentTarget.dataset.item.id
    wx.navigateTo({
      url: '/package_find/pages/choiceRecruitComment/choiceRecruitComment?id=' + id + '&typeNum=6' + '&typeInfo=0',
    })
  },
  // 历史评价
  getCommentInfo(page = 1, limit = 10) {
    let self = this, url = `${app.baseUrl}/interface/Find/active_reply`, data = {}
    data = {
      'id': self.data.activityId,
      'openid': app.globalData.openId,
      'per_page': page,
      'limit': limit
    }
    app.wxRequest(url, data, (res) => {
      console.log('历史评价',res)
      if(res.data.code == 1){
        for(let i = 0; i < res.data.data.length; ++i) {
          res.data.data[i].whether_like = res.data.data[i].whether_like
          res.data.data[i].likes = res.data.data[i].likes
        }
        self.setData({
          'comment': res.data.data
        })
      }
    })
  },

  // 关注
  subscribeBtnClick(e) {
    console.log(e)
    let self = this,
      url = app.baseUrl + '/interface/Personal_center/whether_attention',
      data = {}
    let sucIdx = e.currentTarget.dataset.sucIdx,
      item = e.currentTarget.dataset.item,
      focus = 0
    if (item.is_focus == 1) {
      focus = 0
    } else {
      focus = 1
    }
    for (let i = 0; i < this.data.comment.length; ++i) {
      if (sucIdx == i) {
        data = {
          'openid': app.globalData.openId,
          'id': item.u_id,
          'type': focus // 1关注 0取消关注
        }
        app.wxRequest(url, data, function (res) {
          console.log('关注按钮', res.data.msg)
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 1000
          })
          // 更新页面数据
          self.getCommentInfo()
        })
      }
    }
  },
  // 点赞
  likeBtnClick(e) {
    let self = this,
      url = app.globalData.urlApi.setChioceLikes,
      data = {}
    let likedIdx = e.currentTarget.dataset.likedIdx,
      item = e.currentTarget.dataset.item,
      like = 0
    if (item.whether_like == 1) {
      like = -1
    } else {
      like = 1
    }
    for (let i = 0; i < self.data.comment.length; ++i) {
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
          self.getCommentInfo()
        })
      }
    }
  },
  // 二级评论按钮
  btn_erjipinglun(e) {
    let item = e.currentTarget.dataset.item
    var parameterStrng = '?typeNum=' + 5 + '&typeInfo=' + item.id + '&id=' + this.data.activityId
    app.navigateWx(this, '/package_find/pages/choiceRecruitComment/choiceRecruitComment', parameterStrng)
  },
  // 申请成为故事妈妈点击事件
  applyStoryMomClick() {
    wx.navigateTo({
      url: '/package_find/pages/activityDetail/registrationInfo/registrationInfo?id=' + this.data.activityId,
    })
  },
})