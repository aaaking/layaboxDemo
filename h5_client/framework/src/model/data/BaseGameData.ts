/*
* @author seacole
* 游戏基础数据
*/
class BaseGameData {
    constructor() {

    }

    public static tablelayout = {
        "PLAY_SOUND_LAYOUT": {},
        "SSYY_LAYOUT": {},
        "CHAT_LAYOUT": {},
        "MENU_LAYOUT": {},
        "LOGO_LAYOUT": {},
        "BG_LAYOUT": {},
        "CHAT_CONTENT_LAYOUT": {},
        "MATCH_RECORD_LAYOUT": {},
        "SSYY_TIP_LAYOUT":{},
        "SEAT_LAYOUT":{},
        "GAME_START_SEAT_LAYOUT":{}

    };
    public static playerDataPool: ObjectPool;

    public static gameType: string;
    public static tableid: number;
    public static startTime: number;//开始时间
    public static maxPlayer: number;
    public static owner: number;
    public static btnSeatid: number;  	//庄
    public static leftCard: number; 	//剩余牌数
    public static dices: Array<number>;			//骰子
    public static lastSeatid: number;	//操作的上家
    public static lastCard: number;	//操作的上家的牌
    public static currHandCount: number;
    public static totalHandCount: number;	//总局数
    public static duration: number;	//总时间
    public static baseScore: number;
    public static divide: number;
    public static isRecord: number;//是否录像
    public static selfSeatid: number;
    public static isGameing: boolean;//是否在单局中
    public static isTableStart: boolean;//桌子是否已开始
    public static moveCard;
    public static optSeatid: number;
    public static offset: number;
    public static winCard: number;
    public static winSeatid: number;
    public static winDetailArr = [];
    public static winDetailObj = {};
    public static loseDetailArr = [];
    public static loseDetailObj = {};
    public static tingInfo = {}
    public static tingCards = []
    public static tableEndInfo = []
    public static SHIFTER_NUM = -1
    public static voiceRoomName: string; //游戏语音房间号
    public static isVoiceJoined: boolean;
    public static voiceMemberID: number//游戏语音id
    public static isFreeMatch:boolean;
    public static matchTitle
    public static matchReward
    public static globalInfo:string;
    public static discards

    public static selfNickname: string;
    // public static waKengCallScore: number;//协议外数据 挖坑叫分
    // public static waKengHasBoom: boolean;//协议外数据 挖坑是否有炸弹
    // public static waKengHasBlackDug: boolean;//协议外数据 挖坑是否有黑挖
    // public static waKengBoomMultiply: boolean;//协议外数据 挖坑炸弹倍数


    public static matchInfo:any = {}

    public static players: Array<PlayerData> = [];

    public static init(): void {
        if (!BaseGameData.playerDataPool)
            BaseGameData.playerDataPool = ObjectPool.getInstance("PlayerData", Laya.ClassUtils.getClass(PlayerData));
        BaseGameData.tableid = 0;
        BaseGameData.startTime = 0;
        BaseGameData.maxPlayer = 4;
        BaseGameData.owner = 0;
        BaseGameData.btnSeatid = 0;  	//庄
        BaseGameData.leftCard = 0; //剩余牌数
        BaseGameData.dices = []; 			//骰子
        BaseGameData.lastSeatid = 0; 	//操作的上家
        BaseGameData.lastCard = 0; 	//操作的上家的牌
        BaseGameData.currHandCount = 1;
        BaseGameData.totalHandCount = 0; 	//总局数
        BaseGameData.duration = 0; 	//总时间
        BaseGameData.baseScore = 0;
        BaseGameData.divide = 0;
        BaseGameData.isRecord = 0;
        BaseGameData.selfSeatid = 0;
        BaseGameData.selfNickname = "";
        BaseGameData.offset = 0;
        BaseGameData.winCard = 0;
        BaseGameData.tableEndInfo = []
        BaseGameData.matchInfo = {}
        BaseGameData.isGameing = false;
        BaseGameData.isTableStart = false;
        BaseGameData.discards = []
        while (BaseGameData.players.length) {
            console.log("return BaseGameData.players")
            BaseGameData.playerDataPool.returnObject(BaseGameData.players.shift());
        }
    }

    public static resetData(){
        
    }

    /**
    * 通过玩家seatid获取玩家数据
    */
    public static getPlayerDataBySeatid(seatid: number): PlayerData {
        for (var i: number = 0; i < BaseGameData.players.length; i++) {
            if (BaseGameData.players[i].seatid == seatid)
                return BaseGameData.players[i];
        }
        return null;
    }

    /**
     * 通过玩家uid获取玩家数据
     */
    public static getPlayerDataByUid(uid: number): PlayerData {
        for (var i: number = 0; i < BaseGameData.players.length; i++) {
            if (BaseGameData.players[i].uid == uid)
                return BaseGameData.players[i];
        }
        return null;
    }

     /**
     * 通过玩家voiceMemberid获取玩家数据
     */
    public static getPlayerDataByVoiceMemberid(memberid: number): PlayerData {
        for (var i: number = 0; i < BaseGameData.players.length; i++) {
            if (BaseGameData.players[i].voiceMemberID == memberid)
                return BaseGameData.players[i];
        }
        return null;
    }

    public static onTableDataNtfHandler(msg: any): void {
        if (msg.dataType==1)
        {
            for (var i:number=0;i<msg.tableData.length;i++)
            {
                var player:PlayerData=BaseGameData.getPlayerDataByUid(msg.tableData[i].uid);
                if (player)
                    player.voiceMemberID=msg.tableData[i].data1;
            }
        }
    }

    /**
   * 桌子信息
   */
    public static onTableInfoNtfHandler(msg: any): void {
        while (BaseGameData.players.length) {
            console.log("return BaseGameData.players")
            BaseGameData.playerDataPool.returnObject(BaseGameData.players.shift());
        }
        Utils.injectProp(this, msg);
        if (BaseGameData.startTime>0)
            BaseGameData.isTableStart=true;
    }

    /**
     * 玩家信息
     */
    public static onPlayerInfoNtfHandler(msg: any): void {
        var player: PlayerData = BaseGameData.getPlayerDataByUid(msg.uid);
        if (!player) {
            player = BaseGameData.playerDataPool.borrowObject() as PlayerData;
            player.clear();
            BaseGameData.players.push(player);
            let response = RoleManager.getRole(msg.uid)
            if(!response){
                BaseGameData.getPlayerInfo(msg.uid);
            }else{
                Utils.injectProp(player, response);
                    if (response.nickname) {
                        player.showname = Utils.getFitNickName(response.nickname, 10)
                    }
                    if (GameLogic.selfData.uid == player.uid) {
                        GameLogic.selfData.diamond = response.diamond
                    }
                    Dispatcher.dispatch(EventNames.PLAYER_DATA_CHANGED, player.uid);
            }
        }
        Utils.injectProp(player, msg);

        if (player.uid == server.uid) {
            BaseGameData.selfSeatid = player.seatid;
            if (BaseGameData.isVoiceJoined && BaseGameData.isRecord != 1)
                RealTimeSpeechManager.instance.setMic();
            // server.tableDataReq(1,BaseGameData.voiceMemberID);

            BaseGameData.resetPos()
            BaseGameData.offset = player.seatid - 1;
        }
        player.dir = Utils.getDir(player.seatid)
        
    }

    /**
     * 玩家坐下
     */
    public static onSitdownNtfHandler(msg: any): void {
        var player: PlayerData = BaseGameData.getPlayerDataByUid(msg.uid);
        if (!player) {
            player = BaseGameData.playerDataPool.borrowObject() as PlayerData;
            player.clear();
            BaseGameData.players.push(player);
            let response = RoleManager.getRole(msg.uid)
            if (!response){
                BaseGameData.getPlayerInfo(msg.uid);
            }else{
                Utils.injectProp(player, response);
                    if (response.nickname) {
                        player.showname = Utils.getFitNickName(response.nickname, 10)
                    }
                    if (GameLogic.selfData.uid == player.uid) {
                        GameLogic.selfData.diamond = response.diamond
                    }
                    Dispatcher.dispatch(EventNames.PLAYER_DATA_CHANGED, player.uid);
            }
        }
        Utils.injectProp(player, msg);
        if (player.uid == server.uid) {
            BaseGameData.selfSeatid = player.seatid;
            if (BaseGameData.voiceMemberID)
                server.tableDataReq(1, BaseGameData.voiceMemberID);
            if (BaseGameData.isVoiceJoined && BaseGameData.isRecord != 1)
                RealTimeSpeechManager.instance.setMic();
            BaseGameData.resetPos()
            BaseGameData.offset = player.seatid - 1;
        }
        player.dir = Utils.getDir(player.seatid)
    }

    private static getPlayerInfo(uid: number): void {
        webService.getUserInfo(uid, (response) => {
            if (response.code == 0) {
                var player: PlayerData = BaseGameData.getPlayerDataByUid(response.uid);
                if (player) {
                    Utils.injectProp(player, response);
                    if (response.nickname) {
                        player.showname = Utils.getFitNickName(response.nickname, 10)
                    }
                    if (GameLogic.selfData.uid == player.uid) {
                        GameLogic.selfData.diamond = response.diamond
                    }
                    Dispatcher.dispatch(EventNames.PLAYER_DATA_CHANGED, player.uid);
                }
            }
        });
    }

    /**
     * 玩家站起
     */
    public static onStandupNtfHandler(msg: any): void {
        var player: PlayerData = BaseGameData.getPlayerDataByUid(msg.uid);
        if (player) {
            player.seatid = 0;
            if (player.uid == server.uid) {
                BaseGameData.selfSeatid = 0;
                if (BaseGameData.isVoiceJoined && BaseGameData.isRecord != 1)
                    RealTimeSpeechManager.instance.passiveCloseMic();
            }
        }
    }

    /**
     * 玩家准备
     */
    public static onPlayerReadyNtfHandler(msg: any): void {
        var player: PlayerData = BaseGameData.getPlayerDataBySeatid(msg.seatid);
        if (player) {
            player.status = 1;
            Dispatcher.dispatch(EventNames.PLAYER_DATA_CHANGED, player.uid);
        }

    }

    /**
     * 游戏开始
     */
    public static onGameStartNtfHandler(msg: any): void {
        BaseGameData.currHandCount = msg.currHandCount;
        BaseGameData.btnSeatid = msg.btnSeatid;
        BaseGameData.leftCard = msg.leftCard;
        BaseGameData.baseScore = msg.baseScore;
        for (var i: number = 0; i < msg.players.length; i++) {
            BaseGameData.onSitdownNtfHandler(msg.players[i]);
            var player: PlayerData = BaseGameData.getPlayerDataBySeatid(msg.players[i].seatid);
            if (player)
                player.status = 2;
            Dispatcher.dispatch(EventNames.PLAYER_DATA_CHANGED, msg.players[i].uid);
        }
        BaseGameData.isGameing = true;
        BaseGameData.isTableStart = true;
        BaseGameData.clearPlayData()
    }

    /**
     * 结算 积分结算这里处理,下面两项游戏自己处理逻辑
     */
    public static onGameEndNtfHandler(msg: any): void {
        BaseGameData.isGameing = false;
        for (var i = 0; i < msg.scores.length; i++) {
            var player: PlayerData = BaseGameData.getPlayerDataBySeatid(msg.scores[i].seatid);
            if (player) {
                player.reset();
                Utils.injectProp(player, msg.scores[i]);
                Dispatcher.dispatch(EventNames.PLAYER_DATA_CHANGED, player.uid);
            }
        }
    }

    /**
     * 实时战绩，已将info保存到每个玩家
     */
    public static onRealTimeRecordRepHandler(msg: any): void {
        for (var i = 0; i < msg.playerInfo.length; i++) {
            var player: PlayerData = BaseGameData.getPlayerDataByUid(msg.playerInfo[i].uid);
            if (player)
                Utils.injectProp(player, msg.playerInfo[i]);
        }
    }

    public static onOfflineNtfHandler(msg: any): void {
        var player: PlayerData = BaseGameData.getPlayerDataByUid(msg.uid);
        if (player) {
            player.offline = msg.offline;
            Dispatcher.dispatch(EventNames.PLAYER_DATA_CHANGED, player.uid);
        }
    }

    public static onPlayerTableStatusNtfHandler(msg: any): void {

        var player: PlayerData = BaseGameData.getPlayerDataByUid(msg.uid);

        if (player) {
            player.tableStatus = msg.status
            Dispatcher.dispatch(EventNames.PLAYER_DATA_CHANGED, player.uid);
        }

    }
    /**
     * 桌子结束
     */
    public static onTableEndNtfHandler(msg: any): void {
        BaseGameData.isGameing = false;
        BaseGameData.isTableStart = false;
        BaseGameData.tableEndInfo = msg.playerInfo
        BaseGameData.currHandCount = msg.totalHandCount;

        for (var i = 0; i < msg.playerInfo.length; i++) {
            var player: PlayerData = BaseGameData.getPlayerDataByUid(msg.playerInfo[i].uid);
            if (player)
                Utils.injectProp(player, msg.playerInfo[i]);
        }
    }

    public static setMaster(seatid: number): void {
        BaseGameData.btnSeatid = seatid;
        for (var i: number = 0; i < BaseGameData.players.length; i++) {
            var player: PlayerData = BaseGameData.players[i];
            Dispatcher.dispatch(EventNames.PLAYER_DATA_CHANGED, player.uid);
        }
    }

    public static onReconnectInfoHandler(msg: any): void {
        var i: number;
        Utils.injectProp(this, msg);
        BaseGameData.lastSeatid = msg.lastSeatid
        BaseGameData.btnSeatid = msg.btnSeatid
        BaseGameData.leftCard = msg.leftCard
        BaseGameData.isGameing = true;
        BaseGameData.discards = msg.cards
        //如果有人已准备 表示刚好一局结束的状态
        for (i = 0; i < BaseGameData.players.length; i++) {
            if (BaseGameData.players[i].status == 1) {
                BaseGameData.isGameing = false;
                break;
            }
        }

        BaseGameData.isTableStart = true;
        BaseGameData.currHandCount = msg.currHandCount
        for (var k in msg.gameplayer) {
            let info = msg.gameplayer[k]
            
            let player = BaseGameData.getPlayerDataByUid(info.uid)
            if (player.uid == server.uid) {
                BaseGameData.selfSeatid = player.seatid;
                if (BaseGameData.isVoiceJoined && BaseGameData.isRecord != 1)
                    RealTimeSpeechManager.instance.setMic();
                // server.tableDataReq(1,BaseGameData.voiceMemberID);

                BaseGameData.resetPos()
                BaseGameData.offset = player.seatid - 1;
            }
            for (var j in info.cards) {
                let cardSet = info.cards[j]
                cardSet.opttype = cardSet.opttype || 0
                cardSet.cards = cardSet.cards || []
                if (cardSet.opttype == GameDef.OptType.MJ_DISCARD) {
                    player.foldCards = player.foldCards.concat(cardSet.cards)
                } else if (cardSet.opttype == GameDef.OptType.MJ_DRAW) {
                    if (cardSet.cards.length > 0) {
                        player.handCards = player.handCards.concat(cardSet.cards)
                    } else {
                        for (var i = 0; i < cardSet.count; i++) {
                            player.handCards.push(0);
                        }
                        player.handCardCount = cardSet.count;
                    }
                } else if (cardSet.opttype == GameDef.OptType.MJ_FLOWER) {
                    player.flowerCards = player.flowerCards.concat(cardSet.cards)
                } else if (cardSet.opttype > GameDef.OptType.MJ_DRAW) {
                    player.holdCards.push(cardSet)
                }
            }
            // PlayerManager.instance.changeSeatToPlayer(player.uid, player.seatid)
            Dispatcher.dispatch(EventNames.PLAYER_DATA_CHANGED, player.uid);
        }
    }

    public static setHandCardCount(msg: any) {
        for (var i: number = 1; i <= BaseGameData.maxPlayer; i++) {
            let seatinfo = BaseGameData.getPlayerDataBySeatid(i);
            seatinfo.handCardCount = msg.info[i - 1];
            Dispatcher.dispatch(EventNames.PLAYER_DATA_CHANGED, seatinfo.uid);
        }

    }

    public static cardMove(msg: any): void {
        let info = msg
        let seatinfo = BaseGameData.getPlayerDataBySeatid(info.toSeatid)
        if (info.areaid == GameDef.AREA_TYPE.HAND_CARD) {

            // if (seatinfo.handCards.length > 0){
            //      return 
            // }
            seatinfo.handCards = seatinfo.handCards.concat(msg.cards)
            BaseGameData.leftCard = BaseGameData.leftCard - msg.count;
            //---------------------挖坑用到--------------------
            if (seatinfo.uid != server.uid && msg.cards && msg.opttype == GameDef.OptType.SHOW_CARDS) {
                seatinfo.handCardCount += msg.cards.length;
            }
            //---------------------挖坑用到--------------------
            Dispatcher.dispatch(EventNames.PLAYER_DATA_CHANGED, seatinfo.uid);
            // for (var k in info.cards){
            //     let v = info.cards[k]
            //     seatinfo.handCards.push(v)
            //     // if (BaseGameData.isRecord == 1){
            //         BaseGameData.leftCard = BaseGameData.leftCard - 1
            //     // }
            // }
        } else if (info.areaid == GameDef.AREA_TYPE.FOLD_CARD && info.opttype != GameDef.OptType.RECONNECT) {
            BaseGameData.removeHandCard(info)
            seatinfo.foldCards.push(info.cards[0])
            BaseGameData.discards.push(info.cards[0])
        } else if (info.areaid == GameDef.AREA_TYPE.HOLD_CARD) {
            let opt = {
                opttype: info.opttype,
                cards: info.cards,
                fromSeatid: info.fromSeatid
            }
            let count = 2
            if (info.opttype == GameDef.OptType.MJ_CHI || info.opttype == GameDef.OptType.MJ_PENG) {
                count = 2
                BaseGameData.discards.pop()
            } else if (info.opttype == GameDef.OptType.MJ_MNGANG) {
                BaseGameData.discards.pop()
                count = 3
            } else if (info.opttype == GameDef.OptType.MJ_ANGANG) {
                count = 4
            } else if (info.opttype == GameDef.OptType.MJ_PENGGANG) {
                count = 1
            }

            for (var i = 0; i < count; i++) {
                let index = seatinfo.handCards.indexOf(info.cards[i])
                if (index >= 0) {
                    seatinfo.handCards.splice(index, 1)
                }
            }
            if (info.opttype < GameDef.OptType.MJ_ANGANG) {
                let fromSeatInfo = BaseGameData.getPlayerDataBySeatid(info.fromSeatid)
                let foldIndex = fromSeatInfo.foldCards.pop()
            }
            if (info.opttype != GameDef.OptType.MJ_PENGGANG) {
                seatinfo.holdCards.push(opt)
            } else {
                for (var k in seatinfo.holdCards) {
                    let v = seatinfo.holdCards[k]
                    if (v.opttype == GameDef.OptType.MJ_PENG && v.cards.indexOf(opt.cards[0])) {
                        let isPengGnag = false
                        for (var j in opt.cards) {
                            if (opt.cards[j] % 100 == v.cards[0] % 100) {
                                isPengGnag = true
                                break
                            }
                        }
                        if (isPengGnag) {
                            v = opt
                            // table.remove(self.seatsInfo[info.to_seatid].holdCards,k)
                            // table.insert(self.seatsInfo[info.to_seatid].holdCards,k,opt)
                            break
                        }
                    }
                }
            }
        } else if (info.areaid == GameDef.AREA_TYPE.FLOWER_CARD) {
            for (var k in info.cards) {
                let v = info.cards[k]
                if (seatinfo.seatid == BaseGameData.selfSeatid || BaseGameData.isRecord == 1) {
                    let index = seatinfo.handCards.indexOf(v)
                    if (index >= 0) {
                        seatinfo.handCards.splice(index, 1)
                    }
                } else {
                    seatinfo.handCards.pop()
                }
            }
            seatinfo.flowerCards = seatinfo.flowerCards.concat(info.cards)
            console.log("补花=========================================")
            console.info(seatinfo.flowerCards)
            Dispatcher.dispatch(EventNames.PLAYER_DATA_CHANGED, seatinfo.uid);
        } else if (info.areaid == GameDef.AREA_TYPE.TING_CARD) {
            let length = 0
            let i = 0
            let tingKey
            let count = 0
            let winIndex
            for (var k in info.cards) {
                let v = info.cards.info[k]
                if (k == "0" || parseInt(k) == count + length + 1) {
                    length = v
                    i = 0
                    count = parseInt(k)
                } else if (parseInt(k) < count + length + 1) {
                    if (i == 0) {
                        tingKey = v % 100
                        BaseGameData.tingCards.push(tingKey)
                        BaseGameData.tingInfo[tingKey] = []
                    } else {
                        BaseGameData.tingInfo[tingKey].push(v)
                    }
                    i++
                }
            }

        } else if (info.areaid == GameDef.AREA_TYPE.WIN_CARD) {
            BaseGameData.winCard = info.cards[0]
            BaseGameData.winSeatid = info.toSeatid
            // if(info.toSeatid == BaseGameData.selfSeatid){
            //     let player = BaseGameData.getPlayerDataBySeatid(info.toSeatid)
            //     let index = player.handCards.indexOf(BaseGameData.winCard)
            //     if (index >= 0){
            //         player.handCards.splice(index,1)
            //     }
            // }
            console.log("BaseGameData.winCard==========" + BaseGameData.winCard + "BaseGameData.winSeatid" + BaseGameData.winSeatid)
        }
    }


    private static removeHandCard(info: any): void {
        let seatInfo = BaseGameData.getPlayerDataBySeatid(info.toSeatid);        
        seatInfo.handCardCount -= info.cards.length;
        for (var i: number = 0; i < info.cards.length; i++) {
            var index = seatInfo.handCards.indexOf(info.cards[i]);
            if (index >= 0) {
                seatInfo.handCards.splice(index, 1);
            }
        }
        Dispatcher.dispatch(EventNames.PLAYER_DATA_CHANGED, seatInfo.uid);
    }

    public static resetPos() {
        for (var k in BaseGameData.players) {
            let player = BaseGameData.players[k]
            player.dir = Utils.getDir(player.seatid)
            PlayerManager.instance._players[player.seatid].dir = player.dir
        }
    }

    public static onShowCardsNtfHandler(msg) {
        for (var k in msg.showncards) {
            let cardInfo = msg.showncards[k]
            let player = BaseGameData.getPlayerDataBySeatid(cardInfo.seatid)
            player.handCards = cardInfo.handcards
            player.holdCards = cardInfo.holdCards
            // if (player.seatid == BaseGameData.winSeatid && player.seatid != BaseGameData.selfSeatid){
            //     player.handCards = [BaseGameData.winCard].concat(player.handCards)
            //     // player.handCards.push(BaseGameData.winCard)
            // }
        }
    }

    public static saveWinDetail(data) {


        for (var k in data) {
            let info = data[k]
            BaseGameData.winDetailObj[info.seatid] = info.info
        }
    }

    public static saveLoseDetail(data) {
        for (var k in data) {
            let info = data[k]
            BaseGameData.loseDetailObj[info.seatid] = info.info
        }
    }

    public static clearPlayData() {
        for (var k in BaseGameData.players) {
            let player = BaseGameData.players[k]
            player.clearCards()
            Dispatcher.dispatch(EventNames.PLAYER_DATA_CHANGED, player.uid);
        }
        BaseGameData.tingInfo = {}
    }

    public static getLeftCardCount(cardid) {
        let count = 4
        if(BaseGameData.gameType == GameDef.GAME_TYPE.JINYUN_MJ || BaseGameData.gameType == GameDef.GAME_TYPE.JINYUN_HZ_MJ){
            if(cardid%100 == 78){
                count = 3
            }
        }
        for (var k in BaseGameData.players) {
            let player = BaseGameData.players[k]
            for (var j in player.handCards) {
                let card = player.handCards[j]
                // if(BaseGameData.gameType == GameDef.GAME_TYPE.JINYUN_MJ || BaseGameData.gameType == GameDef.GAME_TYPE.JINYUN_HZ_MJ){
                //     if( cardid%100 == 78){
                //         if(card%100 == BaseGameData.SHIFTER_NUM%1000)
                //             count--
                //     }else if(cardid%100 == BaseGameData.SHIFTER_NUM%100){
                //         if(card%100 == 78)
                //         count--
                //     }else if (card % 100 == cardid % 100) {
                //         count--
                //     }
                // }else{
                    if (card % 100 == cardid % 100) {
                        count--
                    }
                // }
            }
            for (var j in player.foldCards) {
                let card = player.foldCards[j]
                // if(BaseGameData.gameType == GameDef.GAME_TYPE.JINYUN_MJ || BaseGameData.gameType == GameDef.GAME_TYPE.JINYUN_HZ_MJ){
                //     if( cardid%100 == 78){
                //         if(card%100 == BaseGameData.SHIFTER_NUM%1000)
                //             count--
                //     }else if(cardid%100 == BaseGameData.SHIFTER_NUM%100){
                //         if(card%100 == 78)
                //         count--
                //     }else if (card % 100 == cardid % 100) {
                //         count--
                //     }
                // }else{
                    if (card % 100 == cardid % 100) {
                        count--
                    }
                // }
            }
            for (var j in player.holdCards) {
                let cards = player.holdCards[j].cards
                if(player.holdCards[j].opttype == GameDef.OptType.MJ_ANGANG && player.seatid != BaseGameData.selfSeatid){
                    continue
                }                
                for (var m in cards) {
                    let card = cards[m]
                    //  if(BaseGameData.gameType == GameDef.GAME_TYPE.JINYUN_MJ || BaseGameData.gameType == GameDef.GAME_TYPE.JINYUN_HZ_MJ){
                    //     if( cardid%100 == 78){
                    //         if(card%100 == BaseGameData.SHIFTER_NUM%1000)
                    //             count--
                    //     }else if(cardid%100 == BaseGameData.SHIFTER_NUM%100){
                    //         if(card%100 == 78)
                    //         count--
                    //     }else if (card % 100 == cardid % 100) {
                    //         count--
                    //     }
                    // }else{
                        if (card % 100 == cardid % 100) {
                            count--
                        }
                    // }
                }
            }
        }
        return count
    }


    public static updatePao(info) {
        for (var k in BaseGameData.players) {
            let player = BaseGameData.players[k]
            player.pao = info[k]
            Dispatcher.dispatch(EventNames.PLAYER_DATA_CHANGED, player.uid);
        }
    }

    public static get nextSeatId(): number {
        if (BaseGameData.selfSeatid) {
            var seatid: number = BaseGameData.selfSeatid + 1;
            if (seatid > BaseGameData.maxPlayer)
                seatid -= BaseGameData.maxPlayer;
            return seatid;
        }
        else
            return 2;
    }

    public static get preSeatId(): number {
        if (BaseGameData.selfSeatid) {
            var seatid: number = BaseGameData.selfSeatid - 1;
            if (seatid < 1)
                seatid += BaseGameData.maxPlayer;
            return seatid;
        }
        else
            return BaseGameData.maxPlayer;
    }
    
    public static getPlayerSexBySeatid(seatid){
        let player = BaseGameData.getPlayerDataBySeatid(seatid)
        if(player)
            return player.sex
        return 1
    }

    public static _status = {
        "offline": 1 << 1,
        "leave": 2 << 2,
    }

    public static table_status

    public static set_status(name) {
        if (!this._status[name]) return

        this.table_status = this.table_status | this._status[name]
    }

    public static remove_status(name) {
        if (!this._status[name]) return
        this.table_status = this.table_status ^ this._status[name]
    }

    public static has_status(name) {
        if (!this._status[name]) return false
        return (this.table_status & this._status[name]) > 0
    }

    public static onMatchInfo(info){
        this.matchInfo.waiting = info.waiting || 0
        if (info.stage)
            this.matchInfo.matchStage = info.stage
        if (info.ranking)
            this.matchInfo.matchRank = info.ranking
        if (info.handsCnt) 
            this.matchInfo.matchHandCnt =  info.handsCnt
        if (info.rounds)
            this.matchInfo.matchRounds = info.rounds
        if (info.leftTable)
            this.matchInfo.matchLeftTable = info.leftTable
        if (info.playerCnt)
            this.matchInfo.matchPlayer = info.playerCnt
        if (info.swissPlayer && info.swissPlayer.length > 0)
            this.matchInfo.matchSwissPlayer = info.swissPlayer
        if (info.totalPlayer)
            this.matchInfo.totalPlayer = info.totalPlayer
        if (info.matchScore)
            this.matchInfo.matchScore = info.matchScore
    }

}