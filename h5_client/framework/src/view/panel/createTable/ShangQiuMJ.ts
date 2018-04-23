class ShangQiuMJ {
    public static createInfo = [{"key":"ting","value":1},
            {"name": "countSelect", "title": "局数", "key": "max_hand_cnt", "texts":"8局,16局,24局","values":[8,16,24], "value":8,"cost":1, "des":["8局","16局","24局"],"matchvalue":8},
            {"name": "countSelect", "title": "人数", "key": "max_player", "texts":"4人,3人,2人","values":[4,3,2], "value":4, "costDivide":1, "des":["4人","3人","2人"], "changeDispatch":true,"matchvalue":4},
            {"name": "gps","key": "gps", "texts":"开启防作弊功能","values":[0,1], "value":0, "des":["","防作弊"],"matchvalue":0},
        //     {"name":"chooseSelect","key":"ting","texts":"报听","values":[0,1], "value":0, "des":["","报听"],"changeDispatch":true,
        //             "info":[ {"name":"select","key":"ting_hu","texts":"不听管胡,不听不胡","values":[0,1], "value":0, "des":["不听管胡","不听不胡"],"changeOn":{"ting":{"disabled":{0:false,1:true}}}}]},
            // {"name":"select","title": "报听","key":"ting_hu","texts":"不听管胡,不听不胡","values":[0,1], "value":0, "des":["不听管胡","不听不胡"]},        
            {"name": "chooseAndSelect", "line":1, "title": "可选", "info":[
                                                            {"name": "choose", "title": "玩法选择", "key": "ting_hu", "texts":"不听不胡","values":[0,1], "value":0, "des":["","不听不胡"]},
                                                            {"name": "choose", "title": "玩法选择", "key": "dian_pao", "texts":"可点炮胡","values":[0,1], "value":0, "des":["","可点炮胡"]}], "space" : 2 },
            {"name": "chooseAndSelect", "line":1, "title": "可选", "info":[
                                                            {"name": "choose", "title": "玩法选择", "key": "que_men", "texts":"缺门","values":[0,1], "value":0, "des":["","缺门"]},
                                                            {"name": "choose", "title": "玩法选择", "key": "ankou", "texts":"杠卡","values":[0,1], "value":0, "des":["","暗扣"]},
                                                            {"name": "choose", "title": "玩法选择", "key": "qia_zhang", "texts":"掐张","values":[0,1], "value":0, "des":["","掐张"]},
                                                            {"name": "choose", "title": "玩法选择", "key": "bian_zhang", "texts":"边张","values":[0,1], "value":0, "des":["","边张"]},
                                                            {"name": "choose", "title": "玩法选择", "key": "men_qing", "texts":"门清","values":[0,1], "value":0, "des":["","门清"]},
                                                            {"name": "choose", "title": "玩法选择", "key": "seven_pairs", "texts":"胡七对","values":[0,1], "value":0, "des":["","可胡七对"]}
                                                            ], "space" : 3 },
        {"name": "chargeSelect", "title": "收费方式", "key": "charge_type", "texts":["房主支付","AA支付"],"values":[0,1], "value":0, "des":["房主支付","AA支付"],"matchvalue":0,"discount":1},                                            
                                                            ]
    public static cost = 0
    public static costDivide = 4                                              
    public static costs = [2,4,6]                                                          
    public static ruleKey = ["tableid","totalHandCount","gps","ting","ting_hu", "que_men", "ankou", "qia_zhang", "men_qing", "seven_pairs", "dian_pao","bian_zhang"]
    public static ruleValue = [[],[],["","防作弊"],["","报听"],["不听管胡","不听不胡"],["","缺门"],["","杠卡"],["","掐张"],["","门清"],["","可胡七对"],["","可点炮胡"],["","边张"]]
    
}
