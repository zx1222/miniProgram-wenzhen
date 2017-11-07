// index.js
var app = getApp()
Page({
    data: {
        userInfo: {},
        openid: null,
        before: false,
        after: false,
        month: '',
        day: '',
        preciseTime: '',
        flip: false
    },
    bindViewTap: function () {
        wx.navigateTo({
            url: '../logs/logs'
        })
    },
    onLoad: function () {
        var that = this
        // openid
        var openid = wx.getStorageSync('openid')
        this.setData({
            openid: openid
        })
        app.getUserInfo(function (userInfo) {
            //更新数据
            that.setData({
                userInfo: userInfo,
            })
        })
        console.log(this.data.openid)
    },
    konw: function () {
        this.setData({
            shadeShow: false
        })
    },
    enter: function () {
        console.log('enter')
    }
    ,
    //判断登录用户是否存在于现在时段的分组中 
    checkLogin: function () {
        var that = this
        wx.request({
            url: 'http://192.168.0.189/net_sindcorp_anniutingwenzhen/web/anniu/list/index',
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                //全部时间分组
                var data = res.data;
                //获取当前时间戳
                var timestamp = Date.parse(new Date()) / 1000;
                //获取最早的开始时间
                var min_start_at = data[0].start_at
                //获取最晚的结束时间
                var max_end_at = data[0].end_at
                for (var i = 0; i < data.length; i++) {
                    if (min_start_at > data[i].start_at) {
                        min_start_at = data[i].start_at
                    }
                    else if (max_end_at < data[i].end_at) {
                        max_end_at = data[i].end_at
                    }
                }

                // 用户openid数组
                var userArr = []
                for (var i = 0; i < data.length; i++) {
                    for (var j = 0; j < data[i].user_list.length; j++) {
                        userArr.push(data[i].user_list[j].user.openid)
                    }
                }
                console.log(userArr.indexOf(that.data.openid))
                if (userArr.indexOf(that.data.openid) != -1) {
                    console.log('有这个用户')
                    for (var i = 0; i < data.length; i++) {
                        for (var j = 0; j < data[i].user_list.length; j++) {
                            if (that.data.openid == data[i].user_list[j].user.openid) {
                                // 用戶存在且在当前时段
                                if (data[i].start_at <= timestamp && timestamp <= data[i].end_at) {
                                    console.log('这个用户问诊时间在当前时段')
                                    that.setData({
                                        flip: true,
                                        before:false
                                    })
                                }
                                // 还未开始
                                else if (timestamp < min_start_at) {
                                    console.log('所有诊时间未开始')
                                    wx.showModal({
                                        title: '提示',
                                        content: '问诊尚未开始 请耐心等待',
                                        success: function (res) {
                                            if (res.confirm) {
                                                console.log('用户点击确定')
                                            } else {
                                                console.log('用户点击取消')
                                            }
                                        }
                                    })
                                }
                                // 全部结束
                                else if (timestamp > max_end_at) {
                                    console.log('所有问诊时间都结束')
                                    wx.showModal({
                                        title: '提示',
                                        content: '问诊已经全部结束 感谢您的参与',
                                        success: function (res) {
                                            if (res.confirm) {
                                                console.log('用户点击确定')
                                            } else {
                                                console.log('用户点击取消')
                                            }
                                        }
                                    })
                                }
                                // 用户存在但是其时段已经结束
                                else if (timestamp >data[i].end_at) {
                                    console.log('aaa')
                                    that.setData({
                                        after:true
                                    })
                                    console.log('用户问诊开始是:' + preciseTime)
                                    let month = new Date(data[i].start_at * 1000).getMonth() + 1;
                                    let day = new Date(data[i].start_at * 1000).getDate();
                                    let preciseTime = new Date(data[i].start_at * 1000).getHours() + ":" + new Date(data[i].start_at * 1000).getMinutes() + ":" + new Date(data[i].start_at * 1000).getSeconds()
                                    that.setData({
                                        month: month,
                                        day: day,
                                        preciseTime: preciseTime
                                    })
                                    that.setData({
                                        shadeShow: true
                                    })
                                }
                                 // 用户存在但是其时段还未开始
                                else if (timestamp < data[i].start_at) {
                                    console.log('bb')
                                    that.setData({
                                        before: true,
                                        after:false
                                    })
                                    console.log('用户问诊开始是:' + preciseTime)
                                    let month = new Date(data[i].start_at * 1000).getMonth() + 1;
                                    let day = new Date(data[i].start_at * 1000).getDate();
                                    let preciseTime = new Date(data[i].start_at * 1000).getHours() + ":" + new Date(data[i].start_at * 1000).getMinutes() + ":" + new Date(data[i].start_at * 1000).getSeconds()
                                    that.setData({
                                        month: month,
                                        day: day,
                                        preciseTime: preciseTime
                                    })
                                    that.setData({
                                        shadeShow: true
                                    })
                                }
                            }
                        }
                    }
                }
                // 不存在该用户
                else {
                    console.log('用户不存在')
                    wx.showModal({
                        title: '提示',
                        content: '很抱歉您并未报名或者未通过筛选 感谢参与 ',
                        success: function (res) {
                            if (res.confirm) {
                                console.log('用户点击确定')
                            } else {
                                console.log('用户点击取消')
                            }
                        }
                    })
                }
            }
        })
    },
    know:function(){
        this.setData({
            before:false,
            after:false
        })
    }
})