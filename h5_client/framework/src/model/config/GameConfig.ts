/*
* @author seacole
* 游戏配置;
*/
class GameConfig {
    constructor() {

    }
    public static VERSION: string;//版本号
    public static RES_VER: string = "";
    public static APP_VER: string;
    public static WEB_SERVICE_URL: string;//web服务器地址
    public static RESOURCE_URL: string;
    public static GAME_URL: string;//当前游戏访问地址
    public static WX_URL: string;//当前游戏访问地址
    public static SERVER_URL: Array<string>;//游戏服务器地
    public static GAMES: Array<string>;//具体哪几个游戏
    public static MATCHS: Array<string>;
    public static SHOW_GAME
    public static APPNAME: string;//分享用
    public static APPDESC: string;//分享用
    public static APPAREA: string;
    public static pid: number;
    public static BIG_CARD: boolean;

    public static IS_TEST: boolean;
    public static IS_IOS_EXAMINE: boolean;
    public static IS_BANSHU: boolean;
    public static IS_MATCH: boolean;

    public static GAME_TYPE_MJ: string = "1";
    public static GAME_TYPE_POKER: string = "2";
    public static GAME_TYPE_CONFIG: Array<string> = [GameConfig.GAME_TYPE_MJ, GameConfig.GAME_TYPE_POKER];

    private static currentServerIdx: number;

    public static WX_APPID: string;//微信APPID
    public static language: any;
    public static cfgAudio: any;
    public static cfgGameList: any;
    public static cfgShop: any;

    public static CP_TRAN_NO: string = "cpTranNo";
    public static DESC = {}

    /**
    * 初始化
    */
    static init(): void {
        this.language = Laya.loader.getRes(ResourceConfig.LANG);
        this.cfgAudio = Laya.loader.getRes(ResourceConfig.CONFIG_AUDIO);
        this.cfgGameList = Laya.loader.getRes(ResourceConfig.CONFIG_GAME_LIST);
        this.DESC = {}
    }

    /**
     * 读取配置URL
     */
    static getGamePage(name) {
        switch (name) {
            case "shanxi_mj":
                BaseGameData.gameType = GameDef.GAME_TYPE.SHANXI_MJ;
                WxWeb.instance.onShare();
                return ShanXiMjPage
            case "wakeng":
                BaseGameData.gameType = GameDef.GAME_TYPE.WAKENG;
                WxWeb.instance.onShare();
                return WaKengPage
            case "shisanshui":
                BaseGameData.gameType = GameDef.GAME_TYPE.SHISANSHUI;
                WxWeb.instance.onShare();
                return ShiSanShuiPage
            case "jinyun_mj":
                BaseGameData.gameType = GameDef.GAME_TYPE.JINYUN_MJ;
                WxWeb.instance.onShare();
                return JinYunMjPage
            case "jinyun_gs_mj":
                BaseGameData.gameType = GameDef.GAME_TYPE.JINYUN_GS_MJ;
                WxWeb.instance.onShare();
                return JinYunGsMjPage//zhc测试代码 JinYunGsMjPage
            case "jinyun_hz_mj":
                BaseGameData.gameType = GameDef.GAME_TYPE.JINYUN_HZ_MJ;
                WxWeb.instance.onShare();
                return JinYunHzMjPage//zhc测试代码 JinYunHzMjPage
            case "shangqiu_mj":
                BaseGameData.gameType = GameDef.GAME_TYPE.SHANGQIU_MJ;
                WxWeb.instance.onShare();
                return ShangQiuMjPage//zhc测试代码 ShangQiuMjPage
            case "guanpai":
                BaseGameData.gameType = GameDef.GAME_TYPE.GUANPAI;
                WxWeb.instance.onShare();
                return GuanPaiPage
        }

    }

    static set bigcard(value: number) {
        localStorage.setItem('bigcard', value + "");
    }

    static get bigcard(): number {
        let mm: string = localStorage.getItem('bigcard');
        return mm ? Number(mm) : 1;
    }
    // static getUrl(callback: Function): void {
    //     log("try to get geturl.php");
    //     Ajax.GET(GameConfig.language.CONFIG_URLS + 'getfishurl.php', null, (response: any) => {
    //         log("get geturl.php successful");
    //         var data: any = JSON.parse(response);
    //         if (GameConfig.language.debug != "true") {
    //             GameConfig.WEB_SERVICE_URL = data.WEB_SERVICE_URL;
    //         }
    //         log('WEB_SERVICE_URL:' + GameConfig.WEB_SERVICE_URL);
    //         log('RESOURCE_URL:' + GameConfig.RESOURCE_URL);
    //         callback(data);
    //     }, () => {
    //         log('delay 5s to geturl');
    //         setTimeout(() => {
    //             GameConfig.getUrl(callback);
    //         }, 5000);
    //     });
    // }

    static setServerUrl(url: string): void {
        // url = "10.10.10.162:51001"
        GameConfig.SERVER_URL = url.split(";");
        if (GameConfig.SERVER_URL.length) {
            if (GameConfig.SERVER_URL[GameConfig.SERVER_URL.length - 1] == "")
                GameConfig.SERVER_URL.pop();
            GameConfig.currentServerIdx = Math.floor(Math.random() * GameConfig.SERVER_URL.length);
            log('SERVER_URL:' + url);
        }
        else
            console.warn("setServerUrl error: " + url);
    }

    static nextServerUrlIdx(): void {
        log("nextServerUrlIdx");
        GameConfig.currentServerIdx++;
        if (GameConfig.currentServerIdx >= GameConfig.SERVER_URL.length)
            GameConfig.currentServerIdx = 0;
    }

    static get currentServerUrl(): string {
        return "ws://" + GameConfig.SERVER_URL[GameConfig.currentServerIdx] + "/ws";
    }

    static getGameCfgByGameType(gameType: number): any {
        for (var idx in GameConfig.cfgGameList) {
            if (GameConfig.cfgGameList[idx].game_id == gameType)
                return GameConfig.cfgGameList[idx];
        }
        return null;
    }

    static joinTable(response, showMenu: boolean = false) {
        if (MatchConfig.isMatch(response.game_mode)) {
            matchSign.MatchSignData.setInfo(response.game_code, response.game_name, response.game_rule, response.match_rule, response.game_mode);
            if (!AppControl.getInstance().currentPage || AppControl.getInstance().currentPage instanceof LoginPage)
                AppControl.getInstance().showPage(MenuPage, { match_code: response.game_code });
            else
                matchSign.MatchSignInfoCtrl.instance.show(response.game_code);
        }
        else {
            BaseGameData.voiceRoomName = response.voice_roomid
            if (response.is_sitdown && response.is_sitdown == 1) {
                if (!AppControl.getInstance().currentPage || AppControl.getInstance().currentPage instanceof LoginPage)
                    AppControl.getInstance().showPage(MenuPage, { room_code: response.game_code });
                else {
                    AlertInGameCtrl.instance.show(StringUtils.format(GameConfig.language.alreadySeat, response.game_code), (code: number) => {
                        if (code == AlertCtrl.CONFIRM) {
                            server.code = response.game_code;
                            GameConfig.IS_MATCH = false;
                            AppControl.getInstance().showPage(GameConfig.getGamePage(response.game_name));
                        } else {
                            if (showMenu) {
                                AppControl.getInstance().showPage(MenuPage);
                            }
                        }
                    });
                }
            }
            else {
                server.code = response.game_code;
                // response.game_name = "shisanshui"
                GameConfig.IS_MATCH = false;
                AppControl.getInstance().showPage(GameConfig.getGamePage(response.game_name));
            }
        }
    }

    public static randomNum: number;
    public static getCfg(): void {
        var urls: any = Laya.loader.getRes(ResourceConfig.URL_CONFIG);//+"?v="+GameConfig.randomNum
        GameConfig.WEB_SERVICE_URL = urls.WEB_SERVICE_URL;
        GameConfig.GAME_URL = urls.GAME_URL;
        GameConfig.WX_URL = urls.WX_URL;
        GameConfig.VERSION = urls.version;
        if (Native.instance.isNative) {
            GameConfig.WX_APPID = urls.WX_OPEN_APPID;
            GameConfig.APP_VER = NativeHelper.instance.getAppVersion();
        }
        else {
            GameConfig.WX_APPID = urls.WX_APPID;
            GameConfig.APP_VER = "";
        }
        if (urls.hasOwnProperty("RES_VER"))
            GameConfig.RES_VER = urls.RES_VER || "";

        if (urls.hasOwnProperty("IS_TEST"))
            GameConfig.IS_TEST = urls.IS_TEST == "true";
        if (urls.hasOwnProperty("IS_BANSHU"))
            GameConfig.IS_BANSHU = urls.IS_BANSHU == "true";
        GameConfig.APPNAME = urls.APPNAME;
        GameConfig.APPDESC = urls.APPDESC;
        GameConfig.SHOW_GAME = urls.SHOW_GAME
        GameConfig.APPAREA = urls.APPAREA

        GameConfig.GAMES = [];
        GameConfig.MATCHS = [];
        for (var item in GameConfig.SHOW_GAME) {
            if (item == "jinyun_mj")
                GameConfig.MATCHS.push(item);
            else if (item == "shangqiu_mj")
                GameConfig.MATCHS.push(item);
            GameConfig.GAMES.push(item);
        }
        GameConfig.checkIsIosExamine();

        if (GameConfig.IS_TEST) {
            var labVer: Laya.Label = new Laya.Label(urls.version);
            labVer.mouseEnabled = false;
            labVer.mouseThrough = true;
            labVer.color = "#00ff00";
            labVer.fontSize = 20;
            labVer.x = 20;
            labVer.top = 20;
            AppControl.getInstance().addToLoading(labVer);
        }
    }

    private static checkIsIosExamine(): void {
        if (Native.instance.isIOS) {
            var appVersion: string = NativeHelper.instance.getAppVersion();
            // appVersion="1.0.1";
            var appArr: Array<string> = appVersion.split(".");
            var localArr: Array<string> = GameConfig.VERSION.split(".");
            if (appArr.length == 3 && localArr.length == 3) {
                var appNum: number = Number(appArr[0]) * 1000 * 1000 + Number(appArr[1]) * 1000 + Number(appArr[2]);
                var localNum: number = Number(localArr[0]) * 1000 * 1000 + Number(localArr[1]) * 1000 + Number(localArr[2]);
                if (appNum > localNum)
                    GameConfig.IS_IOS_EXAMINE = true;
            }
        }
    }

    public static getShopCfg(): void {
        webService.getShopCfg((response) => {
            if (response.code == 0) {
                GameConfig.cfgShop = response.data;
                Dispatcher.dispatch(EventNames.SHOP_CFG_GET);
            }
        });
    }

    public static getGameRule(game_name, game_rule: string, isMatch: boolean, diamond: number = -1, paytype: number = 0): string {
        if (game_rule) {
            let desc = ""
            let rule = JSON.parse(game_rule)
            for (var k in rule) {
                let v = rule[k]

                if ((k == "max_hand_cnt" || k == "charge_type" || k == "max_player") && isMatch)
                    continue;

                let splitDes;
                if (k == "charge_type" && diamond != -1) {
                    if (diamond == 0)
                        splitDes = "免费";
                    else {
                        if (paytype)
                            splitDes = GameDef.SHARE_DESC[game_name][k][paytype]
                        else
                            GameDef.SHARE_DESC[game_name][k][v]
                    }
                }
                else
                    splitDes = GameDef.SHARE_DESC[game_name][k][v]

                if (splitDes && splitDes != "") {
                    desc = desc + splitDes + ","
                }
            }
            if (desc.length)
                desc = desc.substr(0, desc.length - 1);
            return desc;
        }
    }

}