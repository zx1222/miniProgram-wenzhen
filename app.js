//app.js
var Promise = require('plugins/es6-promise.js');

App({
    onLaunch: function () {
        //调用API从本地缓存中获取数据
        var logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs)
    },
    Promise: null,
    getUserInfo: function () {
        var that = this
        if (this.globalData.userInfo) {
            typeof cb == "function" && cb(that.globalData.userInfo)
        } else {
            wx.login({
                success: function () {
                    wx.getUserInfo({
                        success: function (res) {
                            that.globalData.userInfo = res.userInfo
                            typeof cb == "function" && cb(that.globalData.userInfo)
                        }
                    })
                }
            })
        }
    },
    getOpenid: function () {
        var that = this
        var promise = new Promise(function (resolve, reject) {
            wx.login({
                success: function (res) {
                    var code = res.code
                    var appid = 'wx66e4ec7b580c2658'
                    var secret = 'd96fa2a84185d0eb2d782a38533fd850'
                    if (res.code) {
                        var data = {
                            appid: appid,
                            secret: secret,
                            code: code,
                            grant_type: 'authorization_code'
                        }
                        // 用户登录凭证发送
                        wx.request({
                            //获取openid接口
                            url: 'http://192.168.0.189/net_sindcorp_anniuhuodong/web/anniuwenzhen/api/index',
                            data: data,
                            method: 'GET',
                            success: function (res) {
                                resolve(res.data.openid)
                            }
                        })
                    }
                    else {
                        console.log('获取用户登录态失败：' + res.errMsg);
                    }
                },
            })
        });
        return promise;
    },
    globalData: {
        userInfo: null
    }
})