class ShiSanShuiLayOut {
    public static SEAT_LAYOUT = [[], [{ centerX: 60, bottom: 5 }, { centerX: 60, y: 50 }], [{ centerX: 60, bottom: 5 }, { right: -100, centerY: 0 }, { left: 10, centerY: 0 }], [{ centerX: 60, bottom: 5 }, { right: -120, centerY: 0 }, { centerX: 60, y: 50 }, { left: 10, centerY: 0 }]]
    public static GAME_START_SEAT_LAYOUT = [[], [{ centerX: NaN, left: 15, bottom: 20 },{centerX: NaN, left: 60, y: 130}, { centerX: NaN, left: 60, y: 130 }], [{ centerX: NaN, left: 15, bottom: 20 }, { right: -100, centerY: 126 },{left: 16, centerY: 126}, { left: 16, centerY: 126 }], [{ centerX: NaN, left: 15, bottom: 20 }, { right: -120, centerY: 126 }, { centerX: NaN, left: 100, y: 130 }, { left: 16, centerY: 126 }]]
    public static HAND_VIEW_LAYOUT = [{ centerX: -50, bottom: 55 }, { right: 70, centerY: -100 }, { left: 230, top: 10 }, { left: 10, centerY: -100 }]
    public static DEAL_VIEW_LAYOUT = [[{ x: 0, y: 0 }], [{ x: 0, y: 0 }, { x: 0, y: 0 }], [{ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }], [{ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }]]
    public static WIN_SCORE_LAYOUT = [[], [{ centerX: 0, bottom: 10 }, {}, { centerX: 0, y: 220 }], [{ centerX: 0, bottom: 10 }, { right: 120, centerY: 106 }, {}, { left: 120, centerY: 106 }], [{ centerX: 0, bottom: 10 }, { right: 120, centerY: 106 }, { left: 300, y: 220 }, { left: 120, centerY: 106 }]]
    public static typeList = {
        1: ["shisanshui/1_1.png", "shisanshui/1_1.png", "shisanshui/1_1.png"],
        2: ["shisanshui/2_1.png", "shisanshui/2_1.png", "shisanshui/2_1.png"],
        3: ["shisanshui/3_1.png", "shisanshui/3_1.png", "shisanshui/1_1.png"],
        4: ["shisanshui/4_1.png", "shisanshui/4_1.png", "shisanshui/4_3_1.png"],
        5: ["shisanshui/5_1.png", "shisanshui/5_1.png", "shisanshui/5_1.png"],
        6: ["shisanshui/6_1.png", "shisanshui/6_1.png", "shisanshui/6_1.png"],
        7: ["shisanshui/7_1.png", "shisanshui/7_2_1.png", "shisanshui/7_1.png"],
        8: ["shisanshui/8_1.png", "shisanshui/8_2_1.png", "shisanshui/8_1.png"],
        9: ["shisanshui/9_1.png", "shisanshui/9_2_1.png", "shisanshui/9_1.png"],
        10: ["shisanshui/10_1.png", "shisanshui/10_2_1.png", "shisanshui/10_1.png"],
        1000: "shisanshui/specialcard_13.png",
        1001: "shisanshui/specialcard_12.png",
        1002: "shisanshui/specialcard_11.png",
        1003: "shisanshui/specialcard_10.png",
        1004: "shisanshui/specialcard_9.png",
        1005: "shisanshui/specialcard_8.png",
        1006: "shisanshui/specialcard_7.png",
        1007: "shisanshui/specialcard_6.png",
        1008: "shisanshui/specialcard_5.png",
        1009: "shisanshui/specialcard_4.png",
        1010: "shisanshui/specialcard_3.png",
        1011: "shisanshui/specialcard_2.png",
        1012: "shisanshui/specialcard_1.png",
    }

    public static typeName = {
        1000: "三同花",
        1001: "三顺子",
        1002: "六对半",
        1003: "五对三条",
        1004: "四套三条",
        1005: "凑一色",
        1006: "全小",
        1007: "全大",
        1008: "三分天下",
        1009: "三同花顺",
        1010: "十二皇族",
        1011: "一条龙",
        1012: "至尊青龙",
    }
    public static typeScore = {
        1000: "3",
        1001: "4",
        1002: "4",
        1003: "5",
        1004: "6",
        1005: "10",
        1006: "10",
        1007: "10",
        1008: "20",
        1009: "20",
        1010: "24",
        1011: "36",
        1012: "108",
    }
    public static MENU_LAYOUT = { "x": 0, "y": 40 }
    public static HISTORY_LAYOUT = { "right": 20, "y": 40 }
    public static CHAT_LAYOUT = { "right": 0, "bottom": 250 }
    public static SSYY_LAYOUT = { "right": 10, "bottom": 10 }
    public static PLAY_SOUND_LAYOUT = { "right": 76, "bottom": 10 }
    public static SSYY_TIP_LAYOUT = { "right": 20, "bottom": 60 }
    public static BG_LAYOUT = { "centerY": NaN, "centerX": 0, "bottom": 0 }
    public static LOGO_LAYOUT = { "centerY": -150, "centerX": 0 }
    public static CHAT_CONTENT_LAYOUT = { "bottom": 80, "left": NaN, "right": 40 }
    public static MATCH_RECORD_LAYOUT = { "y": 80, "left": NaN, "right": 20 }
}