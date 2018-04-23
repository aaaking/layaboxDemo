/**
 * @author db
 * Native 接口包装
 */
/**
 GV_ON_JOINROOM_SUCC = 1;
 GV_ON_JOINROOM_TIMEOUT = 2;
 GV_ON_JOINROOM_SVR_ERR = 3;
 GV_ON_JOINROOM_UNKNOWN = 4;
 GV_ON_NET_ERR = 5;
 GV_ON_QUITROOM_SUCC = 6;
 GV_ON_MESSAGE_KEY_APPLIED_SUCC = 7;
 GV_ON_MESSAGE_KEY_APPLIED_TIMEOUT = 8;
 GV_ON_MESSAGE_KEY_APPLIED_SVR_ERR = 9;
 GV_ON_MESSAGE_KEY_APPLIED_UNKNOWN = 10;
 GV_ON_UPLOAD_RECORD_DONE = 11;
 GV_ON_UPLOAD_RECORD_ERROR = 12;
 GV_ON_DOWNLOAD_RECORD_DONE = 13;
 GV_ON_DOWNLOAD_RECORD_ERROR = 14;
 GV_ON_STT_SUCC = 15;
 GV_ON_STT_TIMEOUT = 16;
 GV_ON_STT_APIERR = 17;
 GV_ON_RSTT_SUCC = 18;
 GV_ON_RSTT_TIMEOUT = 19;
 GV_ON_RSTT_APIERR = 20;
 GV_ON_PLAYFILE_DONE = 21;
 GV_ON_ROOM_OFFLINE = 22;
 GV_ON_UNKNOWN = 23;
 GV_ON_ROLE_SUCC = 24;
 GV_ON_ROLE_TIMEOUT = 25;
 GV_ON_ROLE_MAX_AHCHOR = 26;
 GV_ON_ROLE_NO_CHANGE = 27;
 GV_ON_ROLE_SVR_ERROR = 28;
 */

class NativeHelper {
    private static _instance: NativeHelper;
    private deeplinkCb: Function;
    private voiceStatusCb: Function;
    private batteryChangedCb: Function;
    private enterBackGround: Function;

    private static recordPermissionCb : Function;

    constructor() {

    }

    public static get instance(): NativeHelper {
        if (this._instance == undefined) {
            this._instance = new NativeHelper();
        }
        return this._instance;
    }

    public init(): void {
        if (this.isIOS) {
            let call = Laya.PlatformClass.createClass("NativeHelper");
            call.call("jsLoadFinish");
        } else if (this.isAndroid) {
            let call = Laya.PlatformClass.createClass("com.vendor.NativeHelper");
            call.call("jsLoadFinish")
        }
    }

    get isIOS(): boolean {
        return Laya.Browser.window.conchConfig && Laya.Browser.window.conchConfig.getOS() == "Conch-ios";
    }

    get isAndroid(): boolean {
        return Laya.Browser.window.conchConfig && Laya.Browser.window.conchConfig.getOS() == "Conch-android";
    }

    private callNative(method: string, ...args) {
        if (this.isIOS) {
            let call = Laya.PlatformClass.createClass("NativeHelper");
            // call.call("setOrientationPortrait");
        } else if (this.isAndroid) {
            let call = Laya.PlatformClass.createClass("com.vendor.voice.");
        }
    }

    public setOrientationPortrait(): void {
        if (Laya.Browser.window.conchConfig) {
            Laya.Browser.window.conchConfig.setScreenOrientation(1);
            if (this.isIOS) {
                let call = Laya.PlatformClass.createClass("NativeHelper");
                call.call("rotationBugfix");
            }
        }
    }

    public setOrientationLandscape(): void {
        if (Laya.Browser.window.conchConfig) {
            Laya.Browser.window.conchConfig.setScreenOrientation(0);
            if (this.isIOS) {
                let call = Laya.PlatformClass.createClass("NativeHelper");
                call.call("rotationBugfix");
            }
        }
    }

    /**
     * 实时语音加入房间 
     * 
     * @author DB
     * @param {string} roomName 房间名称
     * @param {Function} callback 结果回调
     * @memberof NativeHelper
     */
    public voiceJoinRoom(roomName: string, callback: Function): void {
        if (!Laya.Browser.window.conchConfig) {
            return;
        }

        log("voiceJoinRoom:" + roomName);
        let cb = function (result) {
            log(result);
            let response: any = JSON.parse(result);
            if (callback) {
                callback(response);
            }
        }

        if (this.isIOS) {
            let call = Laya.PlatformClass.createClass("GVoiceMgr");
            call.callWithBack(cb, "joinRoom:", roomName);
        } else if (this.isAndroid) {
            let call = Laya.PlatformClass.createClass("com.vendor.voice.ApolloVoice");
            call.callWithBack(cb, "joinRoom", roomName);
        }
    }

    /**
     * 退出语音房间
     * 
     * @author DB
     * @param {string} roomName 
     * @param {Function} callback 
     * @memberof NativeHelper
     */
    public voiceQuitRoom(roomName: string, callback: Function): void {
        if (!Laya.Browser.window.conchConfig) {
            return;
        }

        log("voiceQuitRoom:" + roomName);
        let cb = function (result) {
            log(result);
            if (callback) {
                let response: any = JSON.parse(result);
                callback(response);
            }
        }

        if (this.isIOS) {
            let call = Laya.PlatformClass.createClass("GVoiceMgr");
            call.callWithBack(cb, "quitRoom:", roomName);
        } else if (this.isAndroid) {
            let call = Laya.PlatformClass.createClass("com.vendor.voice.ApolloVoice");
            call.callWithBack(cb, "quitRoom", roomName);
        }
    }

    /**
     * 开启喇叭
     * 
     * @author DB
     * @param {Function} callback 
     * @memberof NativeHelper
     */
    public voiceOpenSpeaker(callback: Function): void {
        if (this.isIOS) {
            let call = Laya.PlatformClass.createClass("GVoiceMgr");
            call.callWithBack(function (result) {
                if (callback) {
                    let response: any = JSON.parse(result);
                    callback(response.result);
                }
            }, "openSpeaker");

        } else if (this.isAndroid) {
            let call = Laya.PlatformClass.createClass("com.vendor.voice.ApolloVoice");
            let result = call.call("openSpeaker");
            if (callback) {
                callback(result);
            }
        }
    }

    /**
     * 关闭喇叭
     * 
     * @author DB
     * @param {Function} callback 
     * @memberof NativeHelper
     */
    public voiceCloseSpeaker(callback: Function): void {
        if (this.isIOS) {
            let call = Laya.PlatformClass.createClass("GVoiceMgr");
            call.callWithBack(function (result) {
                if (callback) {
                    let response: any = JSON.parse(result);
                    callback(response.result);
                }
            }, "closeSpeaker");

        } else if (this.isAndroid) {
            let call = Laya.PlatformClass.createClass("com.vendor.voice.ApolloVoice");
            let result = call.call("closeSpeaker");
            if (callback) {
                callback(result);
            }
        }
    }

    /**
     * 开启麦克风
     * 
     * @author DB
     * @param {Function} callback 
     * @memberof NativeHelper
     */
    public voiceOpenMic(callback: Function): void {
        if (this.isIOS) {
            let call = Laya.PlatformClass.createClass("GVoiceMgr");
            call.callWithBack(function (result) {
                if (callback) {
                    let response: any = JSON.parse(result);
                    callback(response.result);
                }
            }, "openMic");

        } else if (this.isAndroid) {
            let call = Laya.PlatformClass.createClass("com.vendor.voice.ApolloVoice");
            let result = call.call("openMic");
            if (callback) {
                callback(result);
            }
        }
    }

    /**
     * 关闭麦克风
     * 
     * @author DB
     * @param {Function} callback 
     * @memberof NativeHelper
     */
    public voiceCloseMic(callback: Function): void {
        if (this.isIOS) {
            let call = Laya.PlatformClass.createClass("GVoiceMgr");
            call.callWithBack(function (result) {
                if (callback) {
                    let response: any = JSON.parse(result);
                    callback(response.result);
                }
            }, "closeMic");

        } else if (this.isAndroid) {
            let call = Laya.PlatformClass.createClass("com.vendor.voice.ApolloVoice");
            let result = call.call("closeMic");
            if (callback) {
                callback(result);
            }
        }
    }

    /**
     * 屏蔽玩家语音
     * 
     * @author DB
     * @param {string} roomName 
     * @param {number} memberID 
     * @param {number} enable 
     * @param {Function} callback 
     * @memberof NativeHelper
     */
    public voiceForbidMemberVoice(roomName: string, memberID: number, enable: number, callback: Function): void {
        if (this.isIOS) {
            let call = Laya.PlatformClass.createClass("GVoiceMgr");
            call.callWithBack(function (result) {
                if (callback) {
                    let response: any = JSON.parse(result);
                    callback(response.result);
                }
            }, "forbidMemberVoice:enable:inRoom:", memberID, enable, roomName);
        } else if (this.isAndroid) {
            let call = Laya.PlatformClass.createClass("com.vendor.voice.ApolloVoice");
            let result = call.call("forbidMemberVoice", memberID, enable, roomName);
            if (callback) {
                callback(result);
            }
        }
    }

    /**
     * 用户信息设置，登录时必须调用
     * 
     * @author DB
     * @param {string} appID 
     * @param {string} appKey 
     * @param {string} userId 
     * @memberof NativeHelper
     */
    public voiceSetUserInfo(userId: string): void {
        userId += "";
        log("voiceSetUserInfo:" + userId);
        if (this.isIOS) {
            let call = Laya.PlatformClass.createClass("GVoiceMgr");
            call.call("setOpenID:", userId);
        } else if (this.isAndroid) {
            let call = Laya.PlatformClass.createClass("com.vendor.voice.ApolloVoice");
            call.call("setOpenID", userId);
        }
    }

    /**
     * 注册语音状态回调
     * 
     * @author DB
     * @param {Function} callback 
     * @memberof NativeHelper
     */
    public voiceMemberVoiceCallback(callback: Function): void {
        this.voiceStatusCb = callback;
    }

    /**
     * 玩家语音状态发生变化
     * 
     * @author DB
     * @param {number} memberID 玩家 id
     * @param {number} status 0:停止说话 1:开始说话 2:继续说话
     * @param {string} roomName  所在房间名
     * @memberof NativeHelper
     */
    public onMemberVoice(memberID: number, status: number, roomName: string): void {
        if (this.voiceStatusCb) {
            this.voiceStatusCb(memberID, status, roomName);
        }
    }

    public wxSetAppId(appid: string): void {
        if (this.isIOS) {
            let call = Laya.PlatformClass.createClass("NativeHelper");
            call.call("setWeixinId:", appid);
        } else if (this.isAndroid) {
            let call = Laya.PlatformClass.createClass("com.vendor.social.Social");
            call.call("setWeixinId", appid)
        }
    }

    /**
     * 微信登录
     * 
     * @author DB
     * @param {Function} callback 登录回调 function(code) 微信返回的code
     * @memberof NativeHelper
     */
    public wxLogin(callback: Function): void {
        if (!Laya.Browser.window.conchConfig) {
            return;
        }

        if (this.isIOS) {
            let call = Laya.PlatformClass.createClass("NativeHelper");
            call.callWithBack(function (json) {
                log("wxLogin callback:" + json);
                let result: any = JSON.parse(json);
                if (result.result == 0) {
                    callback(result.code);
                } else {
                    callback("");
                }
            }, "doWxAuth");

        } else if (this.isAndroid) {
            let call = Laya.PlatformClass.createClass("com.vendor.social.Social");
            call.callWithBack(function (json) {
                log("wxLogin callback:" + json);
                let result: any = JSON.parse(json);
                if (result.result == 0) {
                    callback(result.code);
                } else {
                    callback("");
                }
            }, "doWxAuth");
        }
    }

    /**
     * 微信分享图片
     * 
     * @param scene 0好友  1朋友圈
     * @param imgPath 本地文件路径
     * @param callback 分享结果回调
     */
    public wxShareImg(scene: number, imgPath: string, callback: Function): void {
        if (!Laya.Browser.window.conchConfig) {
            return;
        }

        if (this.isIOS) {
            let call = Laya.PlatformClass.createClass("NativeHelper");
            call.callWithBack(function (json) {
                log("wxShareImg callback:" + json);
                if (callback) {
                    let result: any = JSON.parse(json);
                    callback(result);
                }
            }, "doWxShareImg:withScene:", imgPath, scene);
        } else if (this.isAndroid) {
            let call = Laya.PlatformClass.createClass("com.vendor.social.Social");
            call.callWithBack(function (json) {
                log("wxShareImg callback:" + json);
                if (callback) {
                    let result: any = JSON.parse(json);
                    callback(result);
                }
            }, "doWxShareImg", scene, imgPath);
        }
    }

    /**
     * 微信分享页面
     * 
     * @author DB
     * @param {number} scene 0好友  1朋友圈
     * @param {string} url 点击跳转地址
     * @param {string} iconPath 分享图标
     * @param {string} title 分享标题
     * @param {string} description 分享内容 
     * @param {Function} callback 分享结果回调
     * @returns {void} 
     * @memberof NativeHelper
     */
    public wxShareWebPage(scene: number, url: string, iconPath: string, title: string, description: string, callback: Function): void {
        if (!Laya.Browser.window.conchConfig) {
            return;
        }

        if (this.isIOS) {
            log("wxShareWebPage scene:" + scene)
            let call = Laya.PlatformClass.createClass("NativeHelper");
            call.callWithBack(function (json) {
                log("wxShareWebPage callback:" + json);
                if (callback) {
                    let result: any = JSON.parse(json);
                    callback(result);
                }
            }, "doWxShareWebPage:IconPath:Title:Desc:withScene:", url, iconPath, title, description, scene);
        } else if (this.isAndroid) {
            let call = Laya.PlatformClass.createClass("com.vendor.social.Social");
            call.callWithBack(function (json) {
                log("wxShareWebPage callback:" + json);
                if (callback) {
                    let result: any = JSON.parse(json);
                    callback(result);
                }
            }, "doWxShareWebPage", scene, url, iconPath, title, description);
        }
    }

    /**
     * app 版本更新
     * @param newVer 新版本
     * @param url 版本下载地址
     */
    public appUpdate(newVer: string, url: string): void {
        if (!Laya.Browser.window.conchConfig) {
            return;
        }

        log("appUpdate url:" + url);
        if (this.isIOS) {
            this.openURL(url);
        } else if (this.isAndroid) {
            this.openURL(url);
            // let call = Laya.PlatformClass.createClass("com.vendor.update.UpdateApkMgr");
            // call.call("startUpdateApk", "duoduo-update.apk", url);
        }
    }

    /**
     * 获取 app 版本号
     * 
     * @author DB
     * @returns {string} 
     * @memberof NativeHelper
     */
    public getAppVersion(): string {//>config 提审版本
        if (!Laya.Browser.window.conchConfig) {
            return "";
        }

        if (this.isIOS) {
            return Laya.Browser.window.conch.config.getAppVersion()
        } else if (this.isAndroid) {
            let call = Laya.PlatformClass.createClass("com.vendor.update.UpdateApkMgr");
            return call.call("getAppVersion");
        }
    }

    /**
     * 比较APP版本号
     * @param ver 
     */
    public checkAppVersion(ver: string): boolean {
        let appVer = this.getAppVersion()
        var appArr: Array<string> = appVer.split(".");
        var checkArr: Array<string> = ver.split(".");
        if (appArr.length == 3 && checkArr.length == 3) {
            var appNum: number = Number(appArr[0]) * 1000 * 1000 + Number(appArr[1]) * 1000 + Number(appArr[2]);
            var checkNum: number = Number(checkArr[0]) * 1000 * 1000 + Number(checkArr[1]) * 1000 + Number(checkArr[2]);
            return appNum >= checkNum
        }
        return false
    }

    /**
     * 获取 ios bundleId
     * 
     * @author DB
     * @param {Function} callback 
     * @returns {string} 
     * @memberof NativeHelper
     */
    public getBundleID(callback: Function): string {
        if (!Laya.Browser.window.conchConfig) {
            return "";
        }
        if (this.isIOS) {
            let call = Laya.PlatformClass.createClass("NativeHelper");
            call.callWithBack(function (bundleId) {
                if (callback) {
                    callback(bundleId)
                }
            }, "getBundleID");
        } else if (this.isAndroid) {
        }
    }

    /**
     * 外部链接拉起 app 时传入的参数
     * 
     * @author DB
     * @param {Function} callback 回调数据
     * @returns {void} 
     * @memberof NativeHelper
     */
    public deepLinkCallback(callback: Function): void {
        if (!Laya.Browser.window.conchConfig)
            return;

        this.deeplinkCb = callback;
        if (this.isIOS) {
            let call = Laya.PlatformClass.createClass("NativeHelper");
            call.call("deepLinkCallback");
        } else if (this.isAndroid) {
            let call = Laya.PlatformClass.createClass("com.vendor.NativeHelper");
            call.call("deepLinkCallback");
        }
    }

    /**
     * 外部链接 native 层回调
     * 
     * @author DB
     * @param {string} json 
     * @memberof NativeHelper
     */
    public onDeepLink(json: string, url: string) {
        log("onDeepLink:" + json + " url:" + url);
        if (this.deeplinkCb) {
            this.deeplinkCb(json, url);
        }
    }

    /**
     * 设置电池信息回调
     * 
     * @author DB
     * @param {Function} callback 
     * @memberof NativeHelper
     */
    public setBatteryCallback(callback: Function = null): void {
        this.batteryChangedCb = callback;
        if (this.isIOS) {
            let call = Laya.PlatformClass.createClass("NativeHelper");
            call.call("startBatteryMonitor");
        } else if (this.isAndroid) {
            let call = Laya.PlatformClass.createClass("com.vendor.NativeHelper");
            call.call("startBatteryMonitor");
        }
    }

    /**
     * 电池电量变化
     * 
     * @author DB
     * @param {number} state 0:未知状态 1:未充电 2:充电中 3:已充满
     * @param {number} level 电量 0-100
     * @memberof NativeHelper
     */
    public onBatteryChanged(state: number, level: number): void {
        log("onBatteryChanged state:" + state + " level:" + level);
        if (this.batteryChangedCb) {
            this.batteryChangedCb(state, level)
        }
    }

    public openURL(url: string): void {
        if (this.isIOS) {
            let call = Laya.PlatformClass.createClass("NativeHelper");
            call.call("openUrl:", url);
        } else if (this.isAndroid) {
            let call = Laya.PlatformClass.createClass("com.vendor.NativeHelper");
            call.call("openUrl", url);
        }
    }

     public setGroundCallback(callback: Function = null): void {
        this.enterBackGround = callback;
     }

    public appWillEnterForeground(): void {
        log("appWillEnterForeground");
         if (this.enterBackGround)
            this.enterBackGround(false);
    }

    public appDidEnterBackground(): void {
        log("appDidEnterBackground");
        if (this.enterBackGround)
            this.enterBackGround(true);

    }

    public clipboardCopy(text: string): void {
        if (this.isIOS) {
            let call = Laya.PlatformClass.createClass("NativeHelper");
            call.call("clipboardCopy:", text);
        } else if (this.isAndroid) {
            let call = Laya.PlatformClass.createClass("com.vendor.NativeHelper");
            call.call("clipboardCopy", text);
        }
    }

/**
 * 
 * @param cb 检查录音权限的回调
 */
    public checkRecordPermission(cb : Function) : void {
        if (NativeHelper.recordPermissionCb) {
            //如果已经在等待回调就直接return
            return;
        }

        NativeHelper.recordPermissionCb = cb;
        if (this.isIOS) {
            if (this.checkAppVersion("1.0.3")) {
                let ocClass = Laya.PlatformClass.createClass("NativeHelper");
                ocClass.call("checkRecordPermission");
            } else {
                cb(1);
                NativeHelper.recordPermissionCb = null;
                log("checkRecordPermission low AppVersion:" + this.getAppVersion())
            }
            
        } else if (this.isAndroid) {
            if (this.checkAppVersion("1.0.1")) {
                let javaClass = Laya.PlatformClass.createClass("com.vendor.NativeHelper");
                javaClass.call("checkRecordPermission")
            } else {
                cb(1);
                NativeHelper.recordPermissionCb = null;
                log("checkRecordPermission low AppVersion:" + this.getAppVersion())
            }
        }
    }

/**
 *
 * @param permission 0:没有权限 1:有权限
 */
    public static onRequestRecordPermission(permission : number) : void {
        if (!NativeHelper.recordPermissionCb) {
            return;
        }

        console.log("onRequestRecordPermission: " + permission.toString());
        NativeHelper.recordPermissionCb(permission);
        NativeHelper.recordPermissionCb = null;
    }

    public openPermissionSetting() {
        if (this.isIOS) {
            let ocClass = Laya.PlatformClass.createClass("NativeHelper");
            ocClass.call("openSetting");
        } else if (this.isAndroid) {
            let javaClass = Laya.PlatformClass.createClass("com.vendor.NativeHelper");
            javaClass.call("openSetting")
        }
    }
}