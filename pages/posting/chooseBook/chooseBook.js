// pages/posting/chooseBook/chooseBook.js
const app = getApp()
Page({
  data: {
    bookPro: [],
  },
  input_search: function(e) {
    let that = this,
      requestData = {
        name: e.detail.value
      }
    app.requestPost(that, app.globalData.urlApi.search_for, requestData, function(res) {
      if (res.data.code == 1) {
        that.setData({
          bookPro: res.data.data
        })
      } else {
        that.setData({
          bookPro: []
        })
      }
    })
  },
  btn_choose_book: function(e) {
    let item = e.currentTarget.dataset.item
    app.globalData.createBookId = item.id
    app.globalData.createBookName = item.name
    wx.navigateBack({
      delta: 1
    })
  }
})