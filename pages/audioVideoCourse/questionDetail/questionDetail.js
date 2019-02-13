const app = getApp()

Page({
  data: {
    hideAnswerBtn: true, // 是否隐藏底部回答按钮
    isHideMoreCom: true, // 是否隐藏更多评论
  },
  onLoad: function(options) {
    this.setData({
      'quesId': options.quesId || null,
      'courseId': options.courseId || null
    })
  },
  onReady: function() {

  },
  onShow: function() {
    this.getQuestionDetailInfo()
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

  // 获取提问详情页面信息
  getQuestionDetailInfo() {
    let self = this,
      url = `${app.baseUrl}/interface/Course/get_column_audio_detail`,
      data = {}
    data = {
      id: self.data.quesId,
      openid: app.globalData.openId
    }
    app.wxRequest(url, data, (res) => {
      console.log('提问详情', res)
      if (res.data.err_code == 1) {
        for (let i = 0; i < res.data.data.question.litpic.length; ++i) {
          res.data.data.question.litpic[i] = app.ossImgUrl + res.data.data.question.litpic[i]
        }
        if (res.data.data.answer) {
          for (let j = 0; j < res.data.data.answer.length; ++j) {
            res.data.data.answer[j].is_follow = res.data.data.answer[j].is_follow
            let commentArr = res.data.data.answer[j].answer
            if (commentArr.length > 3) {
              let newComArr = commentArr.slice(0, 3)
              res.data.data.answer[j].newComArr = newComArr
            }
          }
        }
        res.data.data.question.is_follow = res.data.data.question.is_follow
        self.setData({
          'replyNum': res.data.data.number,
          'quesCont': res.data.data.question,
          'answer': res.data.data.answer || null,
          'userInfo': res.data.data.question.user
        })
      }
    })
  },
  //显示对话框
  showModal: function(e) {
    let u_id = e.currentTarget.dataset.item.u_id
    let answer_id = e.currentTarget.dataset.item.com_id
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true,
      u_id: u_id,
      answer_id: answer_id,
    })
    setTimeout(function() {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  //隐藏对话框
  hideModal: function() {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function() {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
  },

  // 更多评论点击
  moreCommentClick() {
    this.setData({
      'isHideMoreCom': false
    })
  },

  // 二级评论回复点击事件
  replyBtnClick() {
    this.setData({
      'hideAnswerBtn': false,
      'showModalStatus': false
    })
  },
  sendSecComment() {
    let self = this,
      url = `${app.baseUrl}/interface/Course/column_audio_answer`,
      data = {}
    data = {
      'id': self.data.u_id,
      'open_id': app.globalData.openId,
      'content': self.data.inputValue,
      'answer_id': self.data.answer_id
    }
    app.wxRequest(url, data, (res) => {
      console.log('发布二级评论', res)
      if (res.data.err_code == 1) {
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 1000
        })
        // 更新页面数据
        self.getQuestionDetailInfo()
      }
    })
  },

  // 失去光标事件
  loseFocus(e) {
    let inputValue = e.detail.value
    if (inputValue == '') {
      this.setData({
        'hideAnswerBtn': true
      })
    } else {
      this.setData({
        'inputValue': inputValue
      })
    }
  },
  // 回答页面跳转
  toReplyPage() {
    wx.navigateTo({
      url: '/pages/audioVideoCourse/replyQuestion/replyQuestion?quesId=' + this.data.quesId + '&courseId=' + this.data.courseId,
    })
  },
  // 个人主页跳转
  toTopPersonalPage(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/personalHomepage/personalHomepage?id=' + id,
    })
  },
  toAnswerPersonalPage(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/personalHomepage/personalHomepage?id=' + id,
    })
  },
  // 提问者关注
  subscribeBtnClick(e) {
    // console.log(e)
    let self = this,
      url = app.baseUrl + '/interface/Personal_center/whether_attention',
      data = {}
    let item = e.currentTarget.dataset.item,
      focus = 0
    if (item.is_follow == 0) {
      focus = 1
    } else {
      focus = 0
    }
    data = {
      'openid': app.globalData.openId,
      'id': item.u_id,
      'type': focus // 1关注 0取消关注
    }
    app.wxRequest(url, data, function(res) {
      console.log('关注按钮', res.data.msg)
      wx.showToast({
        title: res.data.msg,
        icon: 'none',
        duration: 1000
      })
      // 更新页面数据
      self.getQuestionDetailInfo()
    })
  },
  // 回答者关注
  answerUserFocus(e) {
    let self = this,
      url = app.baseUrl + '/interface/Personal_center/whether_attention',
      data = {}
    let idx = e.currentTarget.dataset.idx,
      item = e.currentTarget.dataset.item,
      focus = 0
    if (item.is_follow == 0) {
      focus = 1
    } else {
      focus = 0
    }
    for (let i = 0; i < self.data.answer.length; ++i) {
      if (idx == i) { // 判断当前是哪个按钮
        data = {
          'openid': app.globalData.openId,
          'id': item.u_id,
          'type': focus // 1关注 0取消关注
        }
        app.wxRequest(url, data, function(res) {
          console.log('关注按钮', res.data.msg)
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 1000
          })
          // 更新页面数据
          self.getQuestionDetailInfo()
        })
      }
    }
  },
  // 图片预览
  previewImage(e) {
    // console.log(e)
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
  previewImage_answer(e) {
    console.log(e)
    let itemUrl = e.currentTarget.dataset.itemUrl,
      itemArr = e.currentTarget.dataset.itemArr
    for (let i = 0; i < itemArr.length; ++i) {
      itemArr[i] = app.ossImgUrl + itemArr[i]
    }
    wx.previewImage({
      current: itemUrl,
      urls: itemArr,
    })
  },
})