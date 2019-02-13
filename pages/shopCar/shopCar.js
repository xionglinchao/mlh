var app = getApp();
Page({
  data: {
    carPro: [],
    isCheck: false,
    shopMoney: 0,
    shopNum: 0,
    carGoodsPro: []
  },
  onLoad: function(options) {
    var that = this;
    var carPro = app.globalData.goodsPro;
    var shopMoney = 0;
    var shopNum = 0;
    var carGoodsPro = [];
    for (var i in carPro) {
      if (carPro[i].isSelect) {
        shopMoney += carPro[i]['moneys'] * 100 * carPro[i]['num'];
        shopNum += carPro[i]['num'];
        carGoodsPro.push(carPro[i]);
      }
    }
    that.setData({
      shopMoney: shopMoney,
      shopNum: shopNum,
      carPro: carPro,
      carGoodsPro: carGoodsPro
    })
  },
  onShow: function() {

  },
  btn_select: function(e) {
    console.log(e);
    var that = this;
    var carPro = that.data.carPro;
    var isCheck = that.data.isCheck;
    var shopMoney = that.data.shopMoney;
    var shopNum = that.data.shopNum;
    var item = e.currentTarget.dataset.item;
    var carGoodsPro = that.data.carGoodsPro;

    for (var i in carPro) {
      if (item.id == carPro[i].id) {
        if (item.isSelect) {
          carPro[i].isSelect = false;
          shopMoney -= carPro[i]['moneys'] * 100 * carPro[i]['num'];
          shopNum -= carPro[i]['num'];
          for (var j = 0; j < carGoodsPro.length; j++) {
            if (carPro[i].id == carGoodsPro[j].id) {
              carGoodsPro.splice(j, 1);
            }
          }
        } else {
          carPro[i].isSelect = true;
          shopMoney += carPro[i]['moneys'] * 100 * carPro[i]['num'];
          shopNum += carPro[i]['num'];
          carGoodsPro.push(carPro[i]);
        }
      }
    }

    if (shopMoney < 0) {
      shopMoney = 0;
      shopNum = 0;
    }

    app.globalData.goodsPro = carPro;
    app.globalData.goodsNum = shopNum;

    that.setData({
      carPro: carPro,
      shopNum: shopNum,
      shopMoney: shopMoney,
      carGoodsPro: carGoodsPro
    })

  },
  btn_all_select: function() {
    var that = this;
    var carPro = that.data.carPro;
    var isCheck = that.data.isCheck;
    var shopMoney = that.data.shopMoney;
    var shopNum = that.data.shopNum;
    var carGoodsPro = that.data.carGoodsPro;

    for (var i in carPro) {

      if (isCheck) {
        carPro[i]['isSelect'] = false;
        shopMoney -= carPro[i]['moneys'] * 100 * carPro[i]['num'];
        shopNum -= carPro[i]['num'];
        carGoodsPro = [];

      } else {

        if (!carPro[i]['isSelect']) {
          carPro[i]['isSelect'] = true;
          shopMoney += carPro[i]['moneys'] * 100 * carPro[i]['num'];
          shopNum += carPro[i]['num'];
          carGoodsPro.push(carPro[i]);
        }
      }
    }

    if (shopMoney < 0) {
      shopMoney = 0;
      shopNum = 0;
    }
    app.globalData.goodsPro = carPro;
    app.globalData.goodsNum = shopNum;

    that.setData({
      carPro: carPro,
      shopNum: shopNum,
      shopMoney: shopMoney,
      isCheck: !isCheck,
      carGoodsPro: carGoodsPro
    })
  },
  // 去结算
  btn_send: function() {
    var that = this;
    var carGoodsPro = that.data.carGoodsPro;
    var shopMoney = that.data.shopMoney;
    if (carGoodsPro.length == 0) {
      return;
    }
    var parameterStrng = '?typeNum=3&dataPro=' + JSON.stringify(carGoodsPro) + '&money=' + shopMoney
      app.redirectWx(that, '../send/send', parameterStrng, true, 'pages/send/send');
  },

  btn_clear: function(e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var item = e.currentTarget.dataset.item;
    var carPro = that.data.carPro;
    var isCheck = that.data.isCheck;
    var shopMoney = that.data.shopMoney;
    var shopNum = that.data.shopNum;
    var carGoodsPro = that.data.carGoodsPro;

    console.log(index);
    for (var i in carPro) {

      if (i == index) {

        delete(carPro[i]);
      }
    }

    for (var z = 0; z < carGoodsPro.length; z++) {

      if (item.id == carGoodsPro[z].id) {

        shopMoney -= item['moneys'] * 100 * item['num'];
        shopNum -= item['num'];
        carGoodsPro.splice(z, 1);
      }
    }



    app.globalData.goodsPro = carPro;
    app.globalData.goodsNum = shopNum;
    that.setData({
      carPro: carPro,
      shopNum: shopNum,
      shopMoney: shopMoney,
      carGoodsPro: carGoodsPro
    })
  },
  btn_add: function(e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var item = e.currentTarget.dataset.item;
    var carPro = that.data.carPro;
    var isCheck = that.data.isCheck;
    var shopMoney = that.data.shopMoney;
    var shopNum = that.data.shopNum;
    var carGoodsPro = that.data.carGoodsPro;
    console.log(carPro);
    for (var i in carPro) {

      if (i == index) {
        carPro[i]['num'] += 1;
      }
    }
    for (var z = 0; z < carGoodsPro.length; z++) {
      if (item.id == carGoodsPro[z].id) {
        shopNum += 1;
        shopMoney += item['moneys'] * 100;
        carGoodsPro[z]['num'] += 1;
      }
    }
    app.globalData.goodsPro = carPro;
    app.globalData.goodsNum = shopNum;
    that.setData({
      carPro: carPro,
      shopNum: shopNum,
      shopMoney: shopMoney,
      carGoodsPro: carGoodsPro
    })
  },
  btn_sub: function(e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var item = e.currentTarget.dataset.item;
    var carPro = that.data.carPro;
    var isCheck = that.data.isCheck;
    var shopMoney = that.data.shopMoney;
    var shopNum = that.data.shopNum;
    var carGoodsPro = that.data.carGoodsPro;
    console.log(carPro);
    for (var i in carPro) {
      if (i == index) {
        if (carPro[i]['num'] > 1) {
          carPro[i]['num'] -= 1;
        } else {
          delete(carPro[i]);
        }

      }
    }
    for (var z = 0; z < carGoodsPro.length; z++) {
      if (item.id == carGoodsPro[z].id) {
        shopMoney -= item['moneys'] * 100;
        shopNum -= 1;
        if (carGoodsPro[z]['num'] > 1) {
          carGoodsPro[z]['num'] -= 1;
        } else {
          carGoodsPro.splice(z, 1);
        }
      }
    }
    app.globalData.goodsPro = carPro;
    app.globalData.goodsNum = shopNum;

    that.setData({
      carPro: carPro,
      shopNum: shopNum,
      shopMoney: shopMoney,
      carGoodsPro: carGoodsPro
    })
  }
})