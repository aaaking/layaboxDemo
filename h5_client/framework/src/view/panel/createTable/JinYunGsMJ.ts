class JinYunGsMJ {
    public static createInfo = [
            {"name": "countSelect", "title": "局数", "key": "max_hand_cnt", "texts":"8局,16局,24局","values":[8,16,24], "value":8,"cost":1, "des":["8局","16局","24局"],"matchvalue":8},
            {"name": "countSelect", "title": "人数", "key": "max_player", "texts":"4人,3人,2人","values":[4,3,2], "value":4, "costDivide":1, "des":["4人","3人","2人"], "changeDispatch":true,"matchvalue":4},
            {"name": "gps","key": "gps", "texts":"开启防作弊功能","values":[0,1], "value":0, "des":["","防作弊"],"matchvalue":0},
         {"name": "chooseAndSelect", "line":1, "title": "可选", "info":[
                                                            {"name": "choose", "title": "玩法选择", "key": "special_double", "texts":"特殊牌型翻倍","values":[0,1], "value":0, "des":["","特殊牌型翻倍"]},
                                                            {"name": "choose", "title": "玩法选择", "key": "qgh_bg", "texts":"抢杠胡包杠","values":[0,1], "value":0, "des":["","抢杠胡包杠"]},
                                                            {"name": "choose", "title": "玩法选择", "key": "gangkai_bg", "texts":"杠上开花包杠","values":[0,1], "value":0, "des":["","杠上开花包杠"]},
                                                           ], "space" : 2 },
        {"name": "chargeSelect", "title": "收费方式", "key": "charge_type", "texts":["房主支付","AA支付"],"values":[0,1], "value":0, "des":["房主支付","AA支付"],"matchvalue":0,"discount":1},                                            
                                                            ]
    public static cost = 0
    public static costDivide = 4                                              
    public static costs = [2,4,6]                                                           
    public static ruleKey = ["tableid","totalHandCount","gps","special_double", "qgh_bg", "gangkai_bg"]
    public static ruleValue = [[],[],["","防作弊"],["","特殊牌型翻倍"],["","抢杠胡包杠"],["","杠上开花包杠"]]
    
}
