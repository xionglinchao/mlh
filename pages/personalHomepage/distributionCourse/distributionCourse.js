Page({
  data: {
    isRuleIntroHide: false, // 是否隐藏弹窗
    isHideChooseDot: true, // 是否隐藏选择按钮
    // isHideSelected: true, // 是否隐藏选中点
    isChooseMyCourse: true, // 是否选择我的课程内容


    // 我的视频课程列表
    videoCourseList: [{
      'videoCoursePic': '/images/dushuhui/bgPic.jpg', // 视频图片
      'videoIconType': '1', // 视频语音Icon类型 1 视频 2 语音
      'courseTitle': '我是一个神奇的系列组，10节课让你爱上美丽剧啊10节课让你爱上美丽剧啊', // 课程标题
      'updateNum': '5', // 已更新课程
      'studyNum': '1000', // 参与学习人数
      'coursePrice': '0', // 价格
      'isHideSelected': true, // 是否隐藏选中点
    },
    {
      'videoCoursePic': '/images/dushuhui/bgPic.jpg', // 视频图片
      'videoIconType': '2', // 视频语音Icon类型 1 视频 2 语音
      'courseTitle': '我是一个神奇的系列组，10节课让你爱上美丽剧啊', // 课程标题
      'updateNum': '5', // 已更新课程
      'studyNum': '1000', // 参与学习人数
      'coursePrice': '180.00', // 价格
      'isHideSelected': true, // 是否隐藏选中点
    },
    ],
    // 已购视频列表
    videoCourseList2: [{
      'videoCoursePic': '/images/dushuhui/bgPic.jpg', // 视频图片
      'videoIconType': '1', // 视频语音Icon类型 1 视频 2 语音
      'courseTitle': '我是一个神奇的系列组，10节课让你爱上美丽剧啊10节课让你爱上美丽剧啊', // 课程标题
      'updateNum': '5', // 已更新课程
      'studyNum': '1000', // 参与学习人数
      'coursePrice': '0', // 价格
      'isHideSelected': true, // 是否隐藏选中点
    },
    {
      'videoCoursePic': '/images/dushuhui/bgPic.jpg', // 视频图片
      'videoIconType': '2', // 视频语音Icon类型 1 视频 2 语音
      'courseTitle': '我是一个神奇的系列组，10节课让你爱上美丽剧啊', // 课程标题
      'updateNum': '5', // 已更新课程
      'studyNum': '1000', // 参与学习人数
      'coursePrice': '180.00', // 价格
      'isHideSelected': true, // 是否隐藏选中点
    },
    {
      'videoCoursePic': '/images/dushuhui/bgPic.jpg', // 视频图片
      'videoIconType': '2', // 视频语音Icon类型 1 视频 2 语音
      'courseTitle': '我是一个神奇的系列组，10节课让你爱上美丽剧啊', // 课程标题
      'updateNum': '5', // 已更新课程
      'studyNum': '1000', // 参与学习人数
      'coursePrice': '180.00', // 价格
      'isHideSelected': true, // 是否隐藏选中点
    },
    ],
  },
  onLoad: function (options) {

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
  // 编辑
  editBtnClick() {
    this.setData({
      'isHideChooseDot': !this.data.isHideChooseDot
    })
  },
  // 取消选择
  cancelBtnClick() {
    this.setData({
      'isHideChooseDot': true,
    })
  },
  // 全选
  allChooseClick() {
    this.setData({

    })
  },
  // 我的课程单个选择
  singleClick(e) {
    let idx = e.currentTarget.dataset.idx;
    for (var i = 0; i < this.data.videoCourseList.length; ++i) {
      if (idx == i) { // 判断当前是哪个按钮
        this.data.videoCourseList[i].isHideSelected = !this.data.videoCourseList[i].isHideSelected
      }
    }
    this.setData({
      'videoCourseList': this.data.videoCourseList
    })
  },

  // 已购课程单个选择
  singleClick2(e) {
    let idx = e.currentTarget.dataset.idx;
    for (var i = 0; i < this.data.videoCourseList2.length; ++i) {
      if (idx == i) { // 判断当前是哪个按钮
        this.data.videoCourseList2[i].isHideSelected = !this.data.videoCourseList2[i].isHideSelected
      }
    }
    this.setData({
      'videoCourseList2': this.data.videoCourseList2
    })
  },

  // 我的课程点击事件
  myCourseClick() {
    this.setData({
      'isChooseMyCourse': true,
    })
  },
  // 已购课程点击事件
  buyCourseClick() {
    this.setData({
      'isChooseMyCourse': false,
    })
  }
})