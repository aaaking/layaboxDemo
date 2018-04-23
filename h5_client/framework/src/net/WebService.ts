/*
 * @author seacole
* WebService;
*/
class WebService {
    constructor() {

    }
    uuid: string;

    /**
	 * 调用API
	 * @param module
	 * @param action
	 * @param callback
	 * @param params
	 * @param method
	 */
    callApi(module: string, action: string, callback: Function = null, params: any = null, method: string = 'post', header: any[] = []): void {
        if (!params) {
            params = {};
        }
        // params.pf = 4;
        let url: string = GameConfig.WEB_SERVICE_URL + '/' + module + '/' + action;
        let m: Function = method == 'post' ? Ajax.POST : Ajax.GET;
        let uid: string = GameLogic.userData.getItem('uid');
        let token: string = GameLogic.userData.getItem('token');
        if (uid)
            header.push("uid", uid);
        if (token)
            header.push("tk", token);
        header.push("os", Native.instance.OS);
        m.call(Ajax, url, params, (content: any) => {
            log('get:' + content);
            if (callback) {
                let response: any = JSON.parse(content);
                if (response && response.hasOwnProperty("code") && response.code == 401) {
                    console.warn("401");
                    Dispatcher.dispatch(EventNames.UNAUTHORIZED);
                }
                else
                    callback(response);
            }
        }, null, header);
    }


    regist(uname: string, upwd: string, nickname: string, callback: Function): void {
        this.callApi('user', 'reg', (response) => {
            callback(response);
        }, { uname, upwd, nickname });
    }


    /**
     * 游客登录
     */
    touristLogin(uuid: string, callback: any): void {
        this.startDelayCall(1);
        this.callApi('user', 'tourist_login', (response) => {
            this.clearDelayCall();
            callback(response);
        }, { uuid });
    }

    /**
     * 通行证登录
     */
    passportLogin(uname: string, upwd: string, callback: any): void {
        this.startDelayCall(1);
        this.callApi('user', 'login', (response) => {
            this.clearDelayCall();
            callback(response);
        }, { uname, upwd });
    }

    /**
     * 微信登录
     */
    loginByWxFromWechat(code, callback): void {
        this.callApi('user', 'wxlogin', (response) => {
            callback(response);
        }, { wxid: GameConfig.WX_APPID, code });
    }

    /**
     * 开房
     */
    createTable(cid: number, type: string, name: string, hand_cnt: string, max_player: string, info: string, callback: any): void {
        this.startDelayCall();
        LoadingUI.instance.show(LoadingUI.TYPE_NO_BG_DELAY, null, null, null, 5000);
        this.callApi('game', 'create', (response) => {
            this.clearDelayCall();
            LoadingUI.instance.hide();
            callback(response);
        }, { cid, type, name, hand_cnt, max_player, info, callback });
    }

    test(cid: number, callback): void {
        LoadingUI.instance.show(LoadingUI.TYPE_NO_BG_DELAY, null, null, null, 5000);
        this.callApi('game', 'create', (response) => {
            LoadingUI.instance.hide();
            callback(response);
        }, { cid, "type": "3", "name": "jinyun_mj", "hand_cnt": 8, "max_player": 4, "info": "{\"max_hand_cnt\":8,\"max_player\":4,\"gps\":0,\"qghu_bao\":0,\"zh4_bao\":0,\"ying_seven\":0,\"xia_zhuang\":0,\"qizi\":0,\"gen_pai\":0,\"charge_type\":0}" });

    }

    test2(cid: number, callback): void {
        LoadingUI.instance.show(LoadingUI.TYPE_NO_BG_DELAY, null, null, null, 5000);
        this.callApi('match', 'create', (response) => {
            LoadingUI.instance.hide();
            callback(response);
        }, { cid, "type": "3", "name": "jinyun_mj", "hand_cnt": "0", "max_player": 4, "info": "{\"max_player\":4,\"qghu_bao\":0,\"zh4_bao\":0,\"ying_seven\":0,\"qizi\":0,\"gen_pai\":0,\"xia_zhuang\":0,\"gps\":0,\"charge_type\":0,\"max_hand_cnt\":8}", "matchrule": "{\"matchmode\":101,\"title\":\"zhc137的比赛\",\"cost\":\"0\",\"starttime\":\"1516083360\"}}" });

    }




    /**
     * 开房
     */
    joinTable(code: string, callback: any): void {
        this.startDelayCall();
        LoadingUI.instance.show(LoadingUI.TYPE_NO_BG_DELAY, null, null, null, 5000);
        this.callApi('game', 'join', (response) => {
            this.clearDelayCall();
            LoadingUI.instance.hide();
            if (response.game_rule) {
                let desc = ""
                let rule = JSON.parse(response.game_rule)
                for (var k in rule) {
                    let v = rule[k]

                    if ((k == "max_hand_cnt" || k == "charge_type" || k == "max_player") && MatchConfig.isMatch(response.game_mode))
                        continue;

                    let splitDes = GameDef.SHARE_DESC[response.game_name][k][v]
                    if (splitDes && splitDes != "") {
                        desc = desc + splitDes + ","
                    }
                }
                if (desc.length)
                    desc = desc.substr(0, desc.length - 1);
                GameConfig.DESC[response.game_code] = desc
            }
            callback(response);
        }, { code });
    }

    /**
     * 获取人物信息
     */
    getUserInfo(uid: number, callback: any): void {
        var params: any;
        if (GameConfig.pid)
            params = { uid, pid: GameConfig.pid };
        else
            params = { uid }
        this.callApi('user', 'info', (response) => {
            GameConfig.pid = 0;
            if(response.code == 0){
                RoleManager.addRoleByInfos([response])
            }
            callback(response);
        }, params);
    }

    /**
     * 获取人物信息
     */
    getUserInfos(uids: Array<number>, callback: any): void {
        var params: any;
        this.callApi('user', 'infos', (response) => {
            if (callback)
                if(response.code == 0){
                    RoleManager.addRoleByInfos(response)
                }
                callback(response);
        }, { uids });
    }

    getHistoryList(page: number, limit_day: number = 3, callback: any): void {
        this.callApi('history', 'list', (response) => {
            callback(response);
        }, { page, limit_day });
    }

    getHistoryProfit(callback): void {
        this.callApi("history", 'profit', (response) => {
            callback(response);
        })
    }

    getHistoryMatch(gid: number, page, gtype: number, title: string, player: number, time: number, rank: number, callback: any): void {
        this.callApi("history", 'item', (response) => {
            callback(response, gid, gtype, title, player, time, rank);
        }, { gid, page, gtype: 1 })
    }

    getHistoryNoraml(gid: number, gtype: number, callback: any): void {
        this.callApi('history', 'item', (response) => {
            callback(response, gid, gtype);
        }, { gid, gtype: 0 });
    }


    getVideoDetail(vid: string, gtype: number, callback: any): void {
        this.callApi('history', 'video', (response) => {
            callback(response, gtype);
        }, { vid }, "get");
    }

    getWxLoginUrl(): string {
        let redirect_uri = GameConfig.GAME_URL + "index.html" + Laya.Browser.window.location.search
        redirect_uri = encodeURIComponent(redirect_uri);
        return "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + GameConfig.WX_APPID + "&redirect_uri=" + redirect_uri + "&response_type=code&scope=snsapi_userinfo&state=wx#wechat_redirect";
    }

    getWxConfig(callback: any): void {
        if (!Native.instance.isNative && Native.instance.isWeiXin) {
            this.callApi('config', 'wx-jssdk', (response) => {
                callback(response);
            }, { wxid: GameConfig.WX_APPID, url: encodeURIComponent(Laya.Browser.window.location.href.split('#')[0]) });
        }
    }

    reportor(params: any): void {
        this.callApi('config', 'log', (response) => {
            // callback(response);
        }, params);
    }

    // $uid = $this ->_request ->getPost('uid');
    // $group_id = $this ->_request ->getPost('group_id');   //按应用来区别ID
    // $platform_id = $this ->_request ->getPost('platform_id'); //应用还是H5
    // $os_id = $this ->_request ->getPost('os_id'); //IOS1,Android2,其他3
    // $goods_id = $this ->_request ->getPost('goods_id'); //道具ID
    rechagre(id: number, group_id: number, cburl: string, callback: any): void {
        LoadingUI.instance.show(LoadingUI.TYPE_NO_BG_ATONCE, null, null, null, 5000);
        this.callApi('pay/cqilai', 'order', (response) => {
            LoadingUI.instance.hide();
            callback(response);
        }, { uid: server.uid, group_id: group_id, platform_id: Native.instance.isNative ? 1 : 2, os_id: Native.instance.OS, goods_id: id, cburl: cburl, openid: server.openid });
    }

    query(order: string, callback: any): void {
        this.callApi('pay/cqilai', 'qorder', (response) => {
            callback(response);
        }, { uid: server.uid, order: order });
    }

    getShopCfg(callback): void {
        this.callApi('pay/cqilai', 'qgoods', (response) => {
            callback(response);
        }, {});
    }

    checkUpdata(callback): void {
        var flag: boolean;
        var appver: string = NativeHelper.instance.getAppVersion();
        var tmp: Array<string> = appver.split(".");
        if (tmp.length == 3) {
            if (!isNaN(Number(tmp[0])) && !isNaN(Number(tmp[1])) && !isNaN(Number(tmp[2])))
                flag = true;
        }
        if (flag) {
            this.callApi('config', 'update', (response) => {
                callback(response);
            }, { "appver": appver });
        }
        else
            callback({ code: -1 });
    }

    getAnnounce(callback): void {
        this.callApi('config', 'marquee', (response) => {
            callback(response);
        }, {});
    }

    /**
     * 苹果内购下单
     * @param id 
     * @param group_id 
     * @param callback 
     */
    iapOrder(id: number, group_id: number, callback: any): void {
        this.callApi('pay/iap', 'order', (response) => {
            callback(response);
        }, { uid: server.uid, group_id: group_id, goods_id: id });
    }

    protected clearDelayCall(): void {
        Laya.timer.clear(this, this.delayCall);
    }

    protected startDelayCall(type: number = 2): void {
        this.clearDelayCall();
        Laya.timer.once(5000, this, this.delayCall, [type]);
    }

    private delayCall(type: number): void {
        var str: string = "";
        if (type == 1)
            str = "登录失败,请检查网络连接";
        else
            str = "网络连接失败，请重试";
        AlertInGameCtrl.instance.show(str, null, 0, false);
    }
}
var webService = new WebService();