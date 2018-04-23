class ShanxiMJ {
    public static createInfo = [{"key":"max_player","value":4},
     
            {"name": "countSelect", "title": "局数", "key": "max_hand_cnt", "texts":"8局,16局","values":[8,16], "value":8, "cost":1, "des":["8局","16局"]},
        {"name": "gps","key": "gps", "texts":"开启防作弊功能","values":[0,1], "value":0, "des":["","防作弊"]},
        {"name": "select", "title": "玩法", "key": "dian_pao", "texts":"只炸不胡,普通平胡","values":[0,1], "value":0, "des":["只炸不胡","普通平胡"]},

        {"name": "chooseAndSelect", "title": "可选", "info":[
                                                            {"name": "choose", "title": "玩法选择", "key": "has_wind", "texts":"带风牌","values":[0,1], "value":0, "des":["","带风牌"]},
                                                            {"name": "choose", "title": "玩法选择", "key": "red_joker", "texts":"红中赖子","values":[0,1], "value":0, "des":["","红中赖子"]},
                                                            {"name": "choose", "title": "玩法选择", "key": "eyes_258", "texts":"258硬将","values":[0,1], "value":0, "des":["","258硬将"]},
                                                            {"name": "choose", "title": "玩法选择", "key": "win_258_double", "texts":"胡258加番","values":[0,1], "value":0, "des":["","胡258加番"]},
                                                            {"name": "choose", "title": "玩法选择", "key": "eyes_258_double", "texts":"将258加番","values":[0,1], "value":0, "des":["","将258加番"]},
                                                            {"name": "choose", "title": "玩法选择", "key": "one_color", "texts":"清一色加番","values":[0,1], "value":0, "des":["","清一色加番"]}], "space" : 3, },
        {"name": "switchAndSelect", "info":[
                                                            {"name": "choose", "title": "玩法选择", "key": "seven_pairs", "texts":"可胡7对(不加番)","values":[0,1], "value":0, "des":["","可胡7对(不加番)"]},
                                                            {"name": "choose", "title": "玩法选择", "key": "seven_pairs_double", "texts":"可胡7对(加番)","values":[0,1], "value":0, "des":["","可胡7对(加番)"]},
                                                            ], "space" : 2, },                                                    
                                                            
        {"name": "hbuttons", "title": "炮子", "key": "pao", "texts":"0炮,1炮,2炮,3炮,4炮,自由炮","values":[0,1,2,3,4,5], "value":0,  "divide":6, "des":["0炮","1炮","2炮","3炮","4炮","自由炮"]},
        {"name": "chargeSelect", "title": "收费方式", "key": "charge_type", "texts":["房主支付","AA支付"],"values":[0,1], "value":0, "des":["房主支付","AA支付"]},                                                   
                                                            ]
    public static cost = 0
    public static costDivide = 4                                              
    public static costs = [0,48]                                                            
    public static ruleKey = ["tableid","totalHandCount","gps","dian_pao", "has_wind", "red_joker", "eyes_258", "win_258_double", "eyes_258_double", "seven_pairs", "seven_pairs_double", "one_color", "pao"]
    public static ruleValue = [[],[],["","防作弊"],["只炸不胡","普通平胡"],["","风牌"],["","红中赖子"],["","258硬将"],["","胡258加番"],["","将258加番"],["","7对"], ["","7对加番"],["","清一色加番"],["0炮","1炮","2炮","3炮","4炮","自由炮"]]
}
