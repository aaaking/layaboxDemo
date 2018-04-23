/*
* @author seacole
* 微信web;
*/
class WxWeb {
    constructor() {

    }
    private static _instance: WxWeb;
    public static get instance(): WxWeb {
        if (this._instance == undefined) {
            this._instance = new WxWeb();
        }
        return this._instance;
    }


    private BMap = Laya.Browser.window.BMap;
    private wx = Laya.Browser.window.wx;


    private _records: Array<any> = [];
    private _lastRecords: Array<any> = [];
    private _isRecordPlaying: boolean;
    wxConfig(response: any): void {
        if (!Native.instance.isNative) {
            log("开始微信签名");
            this.wx.config({
                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: response.appId, // 必填，公众号的唯一标识
                timestamp: response.timestamp, // 必填，生成签名的时间戳
                nonceStr: response.nonceStr, // 必填，生成签名的随机串
                signature: response.signature,// 必填，签名，见附录1
                jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'startRecord', 'stopRecord', 'onVoiceRecordEnd', 'playVoice', 'pauseVoice',
                    'stopVoice', 'onVoicePlayEnd', 'uploadVoice', 'downloadVoice', 'getLocation'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            });
            this.wx.ready(function () {
                log("微信签名成功");
                WxWeb.instance.onShare();
                // WxWeb.instance.getLocation();
                // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
            });
            this.wx.error(function (res) {
                log("微信签名失败");
                // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
            });
        }
    }

    onShare() {
        if (!Native.instance.isNative && Native.instance.isWeiXin) {
            var data: any = Native.instance.getShareInfo();//{link,desc,title,imgUrl}
            this.wx.onMenuShareTimeline({
                title: data.title, // 分享标题
                link: data.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                imgUrl: data.imgUrl, // 分享图标
                success: function () {
                    // 用户确认分享后执行的回调函数
                    HintCtrl.instance.show(GameConfig.language.wx_share_succ);
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                    // callback({code:1});
                },
                fail: function () {
                    HintCtrl.instance.show(GameConfig.language.wx_share_fail);
                },
                trigger: function () {

                },
            });
            this.wx.onMenuShareAppMessage({
                title: data.title, // 分享标题
                desc: data.desc, // 分享描述
                link: data.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                imgUrl: data.imgUrl, // 分享图标
                type: '', // 分享类型,music、video或link，不填默认为link
                dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                success: function () {
                    // 用户确认分享后执行的回调函数
                    HintCtrl.instance.show(GameConfig.language.wx_share_succ);
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                    //  callback({code:1});
                },
                fail: function () {
                    HintCtrl.instance.show(GameConfig.language.wx_share_fail);
                },
                trigger: function () {
                }
            });
        }
    }

    onShareInfo(type: number = 1, pos: number = 0, title: string = "", subTitle: string = "", info?){
        if (!Native.instance.isNative && Native.instance.isWeiXin) {
            let data = Native.instance.getMatchRankInfo(info,type, title, subTitle)
            this.wx.onMenuShareTimeline({
                title: data.title, // 分享标题
                link: data.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                imgUrl: data.imgUrl, // 分享图标
                success: function () {
                    // 用户确认分享后执行的回调函数
                    HintCtrl.instance.show(GameConfig.language.wx_share_succ);
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                    // callback({code:1});
                },
                fail: function () {
                    HintCtrl.instance.show(GameConfig.language.wx_share_fail);
                },
                trigger: function () {

                },
            });
            this.wx.onMenuShareAppMessage({
                title: data.title, // 分享标题
                desc: data.desc, // 分享描述
                link: data.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                imgUrl: data.imgUrl, // 分享图标
                type: '', // 分享类型,music、video或link，不填默认为link
                dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                success: function () {
                    // 用户确认分享后执行的回调函数
                    HintCtrl.instance.show(GameConfig.language.wx_share_succ);
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                    //  callback({code:1});
                },
                fail: function () {
                    HintCtrl.instance.show(GameConfig.language.wx_share_fail);
                },
                trigger: function () {
                }
            });
        }
    }

    startRecord(callback: any): void {
        this.wx.startRecord({
            success: function () {
                callback();
            }
        });
    }

    stopRecord(needSend: boolean, seatid: number, nickname: string, time: number = 0): void {
        this.wx.stopRecord({
            success: function (res) {
                if (needSend) {
                    WxWeb.instance._records.unshift({ localId: res.localId, seatid: seatid, nickname: nickname, time: time });
                    WxWeb.instance.uploadVoice(res.localId, time);//fuck wx!这玩意一定要写在播放前，不热监听不到播放结束！！！
                    WxWeb.instance.playVoice(); // 返回音频的本地ID
                    // WxWeb.instance.uploadVoice(res.localId);
                }
            }
        });
    }

    private playVoice(): void {
        if (!WxWeb.instance._isRecordPlaying && WxWeb.instance._records.length) {
            if (Native.instance.OS == OSConfig.ANDROID_WEB)
                SoundManager.instance.stopMusic(true);
            WxWeb.instance._isRecordPlaying = true;
            var tmp: any = WxWeb.instance._records.shift();
            // WxWeb.instance.addToLastRecords(tmp);
            var localId: string = tmp.localId;
            Dispatcher.dispatch(EventNames.PLAY_RECORD, [tmp.seatid, tmp.nickname]);
            this.wx.playVoice({
                localId: localId // 需要播放的音频的本地ID，由stopRecord接口获得
            });
            // Laya.timer.clear(this, WxWeb.instance.onVoicePlayEnd);
            Laya.timer.once(Number(tmp.time) + 1500, this, WxWeb.instance.onVoicePlayEnd);
        }
    }

    private onVoicePlayEnd(): void {
        // this.wx.onVoicePlayEnd({
        //     complete: function (res) {
        //         log("onVoicePlayEnd");
        //         // var localId = res.localId; // 返回音频的本地ID
        //         WxWeb.instance._isRecordPlaying = false;
        //         Dispatcher.dispatch(EventNames.PLAY_RECORD_END);
        //         WxWeb.instance.playVoice();
        //     }
        // });
        if (Native.instance.OS == OSConfig.ANDROID_WEB)
            SoundManager.instance.playBg(null, true);
        WxWeb.instance._isRecordPlaying = false;
        Dispatcher.dispatch(EventNames.PLAY_RECORD_END);
        WxWeb.instance.playVoice();
    }

    private uploadVoice(recordId, time: number): void {
        this.wx.uploadVoice({
            localId: recordId, // 需要上传的音频的本地ID，由stopRecord接口获得
            isShowProgressTips: 0, // 默认为1，显示进度提示
            success: function (res) {
                var serverId = res.serverId; // 返回音频的服务器端ID
                server.playerChatReq(3, time + ";" + serverId);
            }
        });
    }

    downloadVoice(serverId: string, seatid: number = 0, nickname: string = "", time: number = 0): void {
        log("downloadVoice:" + nickname);
        this.wx.downloadVoice({
            serverId: serverId, // 需要下载的音频的服务器端ID，由uploadVoice接口获得
            isShowProgressTips: 0, // 默认为1，显示进度提示
            success: function (res) {
                WxWeb.instance._records.push({ localId: res.localId, seatid: seatid, nickname: nickname, time: time });
                WxWeb.instance.playVoice(); // 返回音频的本地ID
            }
        });
    }

    private addToLastRecords(record: any): void {
        if (this._lastRecords.indexOf(record) == -1) {
            for (var i: number = 0; i < this._lastRecords.length; i++) {
                if (this._lastRecords[i].seatid == record.seatid) {
                    this._lastRecords.splice(i, 1, record);
                    break;
                }
            }
        }
    }

    public clearRecord(): void {
        this._records = [];
        this._lastRecords = [];
        this._isRecordPlaying = false;
    }

    private getLocation(): void {
        this.wx.getLocation({
            type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
            success: function (res) {
                var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                var speed = res.speed; // 速度，以米/每秒计
                var accuracy = res.accuracy; // 位置精度
                server.latitude = latitude;
                server.longitude = longitude;
                log("getLocation:" + latitude + "," + longitude + "," + speed + "," + accuracy);
                WxWeb.instance.getAddress(longitude, latitude);
            }
        });
    }

    // getLocation(): void {
    //     var map = new BMap.Map("allmap");
    //     var gc = new BMap.Geolocation();
    //     gc.getCurrentPosition((res) => {
    //         var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
    //         var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。          
    //         server.latitude = latitude;
    //         server.longitude = longitude;
    //         log("getLocation:" + latitude + "," + longitude);
    //         WxWeb.instance.getAddress(longitude, latitude);
    //     });
    // }

    private getAddress(longitude, latitude) {
        if (longitude && latitude) {
            //通过baiduMap API获取街道名称
            var map = new this.BMap.Map("allmap");
            var point = new this.BMap.Point(longitude, latitude);
            var gc = new this.BMap.Geocoder();
            gc.getLocation(point, function (rs) {
                var addComp = rs.addressComponents;
                server.address = addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber;
                log("address:" + server.address);
                server.uploadInfoReq();
            });
        }
    }


}