class JinYunHzMJ {
    public static createInfo = [
            {"name": "countSelect", "title": "局数", "key": "max_hand_cnt", "texts":"8局,16局,24局","values":[8,16,24], "value":8,"cost":1, "des":["8局","16局","24局"],"matchvalue":8},
            {"name": "countSelect", "title": "人数", "key": "max_player", "texts":"4人,3人,2人","values":[4,3,2], "value":4, "costDivide":1, "des":["4人","3人","2人"], "changeDispatch":true,"matchvalue":4},
            {"name": "gps","key": "gps", "texts":"开启防作弊功能","values":[0,1], "value":0, "des":["","防作弊"],"matchvalue":0},
         {"name": "chooseAndSelect", "line":1, "title": "可选", "info":[
                                                            {"name": "choose", "title": "玩法选择", "key": "qghu_bao", "texts":"抢杠胡包","values":[0,1], "value":0, "des":["","抢杠胡包"]},
                                                            {"name": "choose", "title": "玩法选择", "key": "zh4_bao", "texts":"最后四张包","values":[0,1], "value":0, "des":["","最后四张包"]},
                                                            {"name": "choose", "title": "玩法选择", "key": "ying_seven", "texts":"硬板七对","values":[0,1], "value":0, "des":["","硬板七对"]},
                                                            {"name": "choose", "title": "玩法选择", "key": "xia_zhuang", "texts":"50根下庄","values":[0,1], "value":0, "des":["","50根下庄"],"matchvalue":0},
                                                            {"name": "choose", "title": "玩法选择", "key": "qizi", "texts":"7字","values":[0,1], "value":0, "des":["","7字"]},
                                                            {"name": "choose", "title": "玩法选择", "key": "gen_pai", "texts":"跟牌","values":[0,1], "value":0, "des":["","跟牌"], "changeOn":{"max_player":{"visible":{4:true,3:false,2:false}}}}], "space" : 3 },
        {"name": "select", "title": "摆牌方式", "key": "fold_type", "texts":"独立摆放,合并摆放","values":[0,1], "value":1,"des":["独立摆放","合并摆放"],"matchvalue":1},
        {"name": "chargeSelect", "title": "收费方式", "key": "charge_type", "texts":["房主支付","AA支付"],"values":[0,1], "value":0, "des":["房主支付","AA支付"],"matchvalue":0,"discount":1},                                            
                                                            ]
    public static cost = 0
    public static costDivide = 4                                              
    public static costs = [2,4,6]                                                         
    public static ruleKey = ["tableid","totalHandCount","gps","qghu_bao", "zh4_bao", "ying_seven", "xia_zhuang", "qizi", "gen_pai","fold_type"]
    public static ruleValue = [[],[],["","防作弊"],["","抢杠胡包"],["","最后四张包"],["","硬板七对"],["","50根下庄"],["","7字"],["","跟牌"],["独立摆放","合并摆放"]]
    
}
