class GameDef {
    public static OptType = {
        MJ_DISCARD: 0,
        MJ_DRAW: 1,
        MJ_CHI: 2,
        MJ_PENG: 3,
        MJ_MNGANG: 4,
        MJ_ANGANG: 5,
        MJ_PENGGANG: 6,
        MJ_TING: 7,
        MJ_HU: 8,
        MJ_QI: 9,
        MJ_MISS_HU: 10,
        MJ_FLOWER: 11,
        MJ_CHOICE: 12, //溫州麻將買底
        MJ_PIAO: 15,
        MJ_ANKOU: 16,
        MJ_DEAL: 17,
        CALL_SCORE: 18,
        CALL_SCORE2: 19,
        SHOW_CARDS: 20,
        RECONNECT: 21,
        PA_MAKE_S: 22,
        PA_MAKE_N: 23,
        POINT_OUT: 24
    }
    public static ShowInfoType = {
        SHOW_DICE: 1,
        DEAL_CARDS: 2,
        SHUFFLE_CARD: 3,
        WIN_DEATIL: 4,
        WIN_TYPE: 5,
        CALL_SCORE: 6,
        DRAW_SHIFTER: 7,
        SHOW_OPT_END: 8,
        QUAN_LEI_DA: 9,
        GEN_PAI: 10,
        ZUIHOU4: 11,
        MNGANG: 12,
        ANGANG: 13,
        PENGGANG: 14,
        CANCELGANG: 15,
        START_TIME: 16,
        START_GAME: 17,
        BAO_TING: 18
    }

    public static DETAIL_TYPE = {
        WIN_DEATIL: 1,
        SHOW_RULE: 2,
        WIN_SPECIAL: 3,
        GUN_DETAIL: 4,
        LOSE_DETAIL: 5,
        HISTORY_DETAIL: 6
    }

    public static AREA_TYPE = {
        HAND_CARD: 1,
        FOLD_CARD: 2,
        HOLD_CARD: 3,
        FLOWER_CARD: 4,
        TING_CARD: 5,
        WIN_CARD: 6
    }
    public static MJ_WIN_TYPE = {
        NO_WIN: 0,						//流局
        WIN_ALL: 1,					//自摸胡
        WIN_ONE: 2,					//点炮胡
        WIN_KONG: 3,					//抢杠胡
        DISBAND: 4,					//解散
    }
    public static WIN_TYPE = {
        MJ_DIANPAO: 1,
        MJ_HUAPAI: 2,
        MJ_ANKA: 3,
        MJ_ZIMO: 4,
        MJ_QIAZHANG: 5,
        MJ_MENQING: 6,
        MJ_QUEMEN: 7,
        MJ_BAOTING: 8,
        MJ_GANG: 9,
        WIN_258: 10,
        EYES_258: 11,
        SEVEN_PAIRS: 12,
        PURE_COLOR: 13,
        PAO: 14,
        DANDIAO: 15,
        YING_SEVEN_PAIRS: 16,
        DUIDUIHU: 17,
        SANCAI: 18,
        GANGKAI: 19,
        HAIDILAOYUE: 20,
        QUANZI: 21,
        QIANGGANG: 22,
        SHISANBUKAO: 23,
        QIZI: 24,

        TIANHU: 25,
        DIHU: 26,
        GEN_PAI: 27,
        XIAZHUANG: 28,
        HAOQI: 29,
        HAO_DUIDUIHU: 30,
        BIANZHANG : 31
    }

    public static WIN_TYPE_SYMBOL = {
        1: "+",
        2: "+",
        3: "*",
        4: "*",
        5: "*",
        6: "*",
        7: "*",
        8: "*",
        9: "+",
        10: "*",
        11: "*",
        12: "*",
        13: "*",
        14: "+"
    }

    public static WIN_TYPE_STRING = {
        1: '点炮',
        2: '花牌',
        3: '暗扣',
        4: '自摸',
        5: '掐张',
        6: '门清',
        7: '缺门',
        8: '报听',
        9: '杠分'
    }

    public static CHAT_MESSAGE = {
        1: ["不要木讷了，克里马擦些",
            "你咋回事呢？出牌这么慢",
            "还让不让我摸牌了，一个劲碰",
            "打张让我碰下啊",
            "没将没将，打两一样",
            "炸得忒色，廖咋咧",
            "来来来，我看你还能打个啥",
            " 臭水平，打的啥牌嘛",
            "都不要点炮，我要扣炸弹",
            "伙计，不要碰了，上碰下炸，你小心点",
            "哎呀，手气真是好"
        ],
        2: ["你太牛啦！",
            "手气真好！",
            "快点出牌啊",
            "今天真高兴",
            "你放炮，我不胡",
            "你家里是开银行的吧",
            "不好意思，我有事要先走一步啦",
            "你的牌打得太好啦"

        ],
        3: ["跟你们玩真有意思",
            "哥哥姐姐你们哪里人啊",
            "打快点啊，睡去了",
            "还给不给人摸牌了",
            "想要什么牌就来什么牌",
            "全部都是卡牌怎么打打哦",
            "都是些不搭牌",
            "你的麻将打的缙云第一名",
            "暗杠都被你碰没了",
            "别吵别吵，吵什么",
            "赢的人今天晚上请吃夜宵",
            "一直输，短裤都输没了"
        ],
        4: ["很高兴见到各位",
            "这把牌真好，要全垒打了",
            "今天手气真差",
            "给我来点好牌吧",
            "快点啊，等好久了",
            "为什么总是我中枪",
            "我要打枪了",
            "特殊牌，来个特殊牌",
            "别急，先让我想想",
            "哈喽，快摊牌了",
            "大家快穿好防弹衣",
            "这把牌输惨了"
        ],
        5: ["跟你们玩真有意思",
            "哥哥姐姐你们哪里人啊",
            "打快点啊，睡去了",
            "还给不给人摸牌了",
            "想要什么牌就来什么牌",
            "全部都是卡牌怎么打打哦",
            "都是些不搭牌",
            "你的麻将打的缙云第一名",
            "暗杠都被你碰没了",
            "别吵别吵，吵什么",
            "赢的人今天晚上请吃夜宵",
            "一直输，短裤都输没了"
        ],
        6: ["跟你们玩真有意思",
            "哥哥姐姐你们哪里人啊",
            "打快点啊，睡去了",
            "还给不给人摸牌了",
            "想要什么牌就来什么牌",
            "全部都是卡牌怎么打打哦",
            "都是些不搭牌",
            "你的麻将打的缙云第一名",
            "暗杠都被你碰没了",
            "别吵别吵，吵什么",
            "赢的人今天晚上请吃夜宵",
            "一直输，短裤都输没了"
        ],
        7: ["你太牛了",
            "哈哈，手气真好",
            "快点出牌啊",
            "今天真高兴",
            "你放炮，我不胡",
            "你家里是开银行的吧",
            "不好意思，我有事要先走一步了",
            "你的牌打得太好了",
            "大家好，很高兴见到各位",
            "怎么又断线了，网络怎么这么差呀"
        ],
        8: ["打牌不怕炸，说明胆子大",
            "我说你能快点嘛",
            "投降输一半，骚年们，放下武器吧",
            "要快要快，不能像个老太太",
            "我到底跟你有什么仇，什么怨",
            "啊呀妈呀，太刺激了",
            "哇，你的牌打得不错啊",
            "我炸你个桃花朵朵",
            "一手臭牌，只能留着下蛋啦"

        ],
    }

    public static CHAT_EMOJI = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]

    public static CHAT_TYPE = {
        QUICK_MESSAGE: 1,
        EMOJI: 2,
        RECORD: 3
    }

    public static GAME_NAME = [
        "shanxi_mj",
        "wakeng",
        "jinyun_mj",
        "shisanshui",
        "jinyun_gs_mj",
        "jinyun_hz_mj",
        "shangqiu_mj",
        "guanpai"
    ]

    public static GAME_NAME_CH = [
        "陕西麻将",
        "挖坑",
        "缙云玩法",
        "十三水",
        "广式玩法",
        "壶镇玩法",
        "商丘麻將",
        "关牌"
    ]

    public static GAME_TYPE = {

        SHANXI_MJ: "1",
        WAKENG: "2",
        JINYUN_MJ: "3",
        SHISANSHUI: "4",
        JINYUN_GS_MJ: "5",
        JINYUN_HZ_MJ: "6",
        SHANGQIU_MJ: "7",
        GUANPAI: "8"

    }

    public static CHAT_POS = [
        [],
        [2, 2],
        [2, 1, 2],
        [2, 1, 2, 2]
    ]

    public static getGameTypeByGameName(name: string): number {
        var idx: number = GameDef.GAME_NAME.indexOf(name);
        return idx + 1;
    }

    private static _currentGames: Array<number>
    public static get currentGames(): Array<number> {
        if (!GameDef._currentGames) {
            GameDef._currentGames = [];
            for (var i: number = 0; i < GameConfig.GAMES.length; i++) {
                var type: number = GameDef.getGameTypeByGameName(GameConfig.GAMES[i]);
                if (type)
                    GameDef._currentGames.push(type);
            }
            GameDef._currentGames.sort();
        }
        return GameDef._currentGames;
    }

    private static _currentMatchs: Array<number>
    public static get currentMatchs(): Array<number> {
        if (!GameDef._currentMatchs) {
            GameDef._currentMatchs = [];
            for (var i: number = 0; i < GameConfig.MATCHS.length; i++) {
                var type: number = GameDef.getGameTypeByGameName(GameConfig.MATCHS[i]);
                if (type)
                    GameDef._currentMatchs.push(type);
            }
            GameDef._currentMatchs.sort();
        }
        return GameDef._currentMatchs;
    }

    public static isMaJiang(gameType: string): boolean {
        if (gameType == GameDef.GAME_TYPE.JINYUN_GS_MJ || gameType == GameDef.GAME_TYPE.JINYUN_MJ || gameType == GameDef.GAME_TYPE.JINYUN_HZ_MJ || gameType == GameDef.GAME_TYPE.SHANGQIU_MJ || gameType == GameDef.GAME_TYPE.SHANXI_MJ)
            return true;
        else
            return false;
    }

    private static _showGames
    public static _showDes
    public static get showGames() {
        if (!GameDef._showGames) {
            GameDef._showGames = {};
            GameDef._showDes = {}
            let i = 1
            for (var k in GameConfig.SHOW_GAME) {
                var type: number = GameDef.getGameTypeByGameName(k);
                GameDef._showDes[type] = i
                if (type) {
                    if (!GameDef._showGames[type])
                        GameDef._showGames[type] = [];
                }
                let v = GameConfig.SHOW_GAME[k]
                for (let j in v) {
                    let t = GameDef.getGameTypeByGameName(v[j])
                    if (t) {
                        GameDef._showGames[type].push(t)
                    }
                }
                i++
            }
            // GameDef._currentGames.sort();
        }
        return GameDef._showGames;
    }

    public static ruleKey = ["tableid", "totalHandCount", "gps", "qghu_bao", "zh4_bao", "ying_seven", "xia_zhuang", "qizi", "gen_pai"]
    public static ruleValue = [[], [], ["GPS关", "GPS开"], ["", "抢杠胡包"], ["", "最后四张包"], ["", "硬板七对"], ["", "50根下庄"], ["", "7字"], ["", "跟牌"]]

    public static SHARE_DESC = {
        "shangqiu_mj": {
            "max_hand_cnt": { 8: "8局", 16: "16局", 24: "24局" },
            "max_player": { 4: "4人局", 3: "3人局", 2: "2人局" },
            "gps": ["", "防作弊"],
            "ting": ["", "报听"],
            "ting_hu": ["不听管胡", "不听不胡"],
            "que_men": ["", "缺门"],
            "ankou": ["", "杠卡"],
            "qia_zhang": ["", "掐张"],
            "men_qing": ["", "门清"],
            "seven_pairs": ["", "可胡七对"],
            "dian_pao": ["", "可点炮胡"],
            "charge_type": ["房主支付", "AA支付"],
            "bian_zhang": ["","边张"]
        },
        "jinyun_hz_mj": {
            "max_hand_cnt": { 8: "8局", 16: "16局", 24: "24局" },
            "max_player": { 4: "4人局", 3: "3人局", 2: "2人局" },
            "gps": ["", "防作弊"],
            "qghu_bao": ["", "抢杠胡包"],
            "zh4_bao": ["", "最后四张包"],
            "ying_seven": ["", "硬板七对"],
            "xia_zhuang": ["", "50根下庄"],
            "qizi": ["", "7字"],
            "gen_pai": ["", "跟牌"],
            "fold_type":["独立摆放","合并摆放"],
            "charge_type": ["房主支付", "AA支付"]

        },
        "jinyun_gs_mj": {
            "max_hand_cnt": { 8: "8局", 16: "16局", 24: "24局" },
            "max_player": { 4: "4人局", 3: "3人局", 2: "2人局" },
            "gps": ["", "防作弊"],
            "special_double": ["", "特殊牌型翻倍"],
            "qgh_bg": ["", "抢杠胡包杠"],
            "gangkai_bg": ["", "杠上开花包杠"],

            "charge_type": ["房主支付", "AA支付"]

        },
        "jinyun_mj": {
            "max_hand_cnt": { 8: "8局", 16: "16局", 24: "24局" },
            "max_player": { 4: "4人局", 3: "3人局", 2: "2人局" },
            "gps": ["", "防作弊"],
            "qghu_bao": ["", "抢杠胡包"],
            "zh4_bao": ["", "最后四张包"],
            "ying_seven": ["", "硬板七对"],
            "xia_zhuang": ["", "50根下庄"],
            "qizi": ["", "7字"],
            "gen_pai": ["", "跟牌"],
            "fold_type":["独立摆放","合并摆放"],
            "charge_type": ["房主支付", "AA支付", "俱乐部支付"]

        },

        "shisanshui": {
            "max_hand_cnt": { 12: "12局", 24: "24局", 36: "36局" },
            "max_player": { 4: "4人局", 3: "3人局", 2: "2人局" },
            "gps": ["", "防作弊"],
            "game_type": ["普通模式", "大小王百变"],
            "charge_type": ["房主支付", "AA支付", "俱乐部支付"]
        },

        "shanxi_mj": {
            "max_hand_cnt": { 12: "12局", 24: "24局", 36: "36局" },
            "max_player": { 4: "4人局", 3: "3人局", 2: "2人局" },
            "gps": ["", "防作弊"],
            "dian_pao": ["只炸不胡", "普通平胡"],
            "has_wind": ["", "风牌"],
            "red_joker": ["", "红中赖子"],
            "eyes_258": ["", "258硬将"],
            "win_258_double": ["", "胡258加番"],
            "eyes_258_double": ["", "将258加番"],
            "seven_pairs": ["", "7对"],
            "seven_pairs_double": ["", "7对加番"],
            "one_color": ["", "清一色加番"],
            "pao": ["0炮", "1炮", "2炮", "3炮", "4炮", "自由炮"],
            "charge_type": ["房主支付", "AA支付", "俱乐部支付"]
        },

        "wakeng": {
            "max_hand_cnt": { 12: "12局", 24: "24局", 36: "36局" },
            "max_player": { 4: "4人局", 3: "3人局", 2: "2人局" },
            "gps": ["", "防作弊"],
            "no_3_double": ["", "无3翻倍"],
            "black_call": ["叫分", "黑挖"],
            "has_boom": ["不带炸弹", "带炸弹"],
            "boom_max": ["3炸", "不限"],
            "charge_type": ["房主支付", "AA支付", "俱乐部支付"]
        },

        "guanpai": {
            "max_hand_cnt": { 12: "12局", 24: "24局", 36: "36局" },
            "max_player": { 3: "3人局", 2: "2人局" },
            "gps": ["", "防作弊"],
            "card_cnt": { 15: "15张", 16: "16张" },
            "hide_ccnt": ["", "牌数不显示"],
            "must_do": ["", "必须管"],
            "boom_reward": ["", "炸弹奖分"],
            "enabled_aaa": ["", "AAA算炸"],
            "winner_first": ["", "赢家先出"],
            "call_score": ["", "抢关"],
            "charge_type": ["房主支付", "AA支付", "俱乐部支付"]
        }
    }

    public static RULE_TITLE_MJ = {
        "1": "玩法",
        "3": "缙云玩法",
        "5": "广式玩法",
        "6": "壶镇玩法",
        "7": "商丘玩法"
    }

    public static GAME_LOGO = {
        "1": "1",
        "2": "2",
        "3": "3",
        "4": "4",
        "5": "3",
        "6": "3",
        "7": "7",
        "8": "8",
    }

    public static SCORE_BG = {
        "1": "menu/item_bg_0.png",
        "2": "menu/item_bg_2.png",
        "3": "menu/item_bg_0.png",
        "4": "menu/item_bg_1.png",
        "5": "menu/item_bg_0.png",
        "6": "menu/item_bg_0.png",
        "7": "menu/item_bg_0.png",
        "8": "menu/item_bg_2.png",
    }


}