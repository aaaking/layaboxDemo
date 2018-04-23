class WaKeng {
     public static createInfo = [{"key":"max_player","value":3},
            {"name": "countSelect", "title": "局数", "key": "max_hand_cnt", "texts":"8局,16局","values":[8,16], "value":8, "cost":1, "des":["8局","16局"]},
            {"name": "gps","key": "gps", "texts":"开启防作弊功能","values":[0,1], "value":1, "des":["","防作弊"]},
            {"name": "chooseAndSelect", "title": "玩法", "info":[
                                                                {"name": "select", "title": "玩法", "key": "black_call", "texts":"叫分,黑挖","values":[0,1], "value":0, "des":["叫分","黑挖"]},
                                                                {"name": "choose", "title": "玩法选择", "key": "no_3_double", "texts":"无3翻倍","values":[0,1], "value":0, "des":["","无3翻倍"]},
                                                                ], "space" : 2, },
            {"name": "select", "title": "炸弹", "key": "has_boom", "texts":"不带炸弹,带炸弹","values":[0,1], "value":0, "des":["不带炸弹","带炸弹"]},
            {"name": "countSelect", "title": "炸弹倍数", "key": "boom_max", "texts":"3炸,不限","values":[3,999], "value":3, "des":["3炸","不限"]},
            {"name": "chargeSelect", "title": "收费方式", "key": "charge_type", "texts":["房主支付","AA支付"],"values":[0,1], "value":0, "des":["房主支付","AA支付"]},  
        ]
                                                      
      public static cost = 0 
      public static costDivide = 3                                              
      public static costs = [0,48]                                                      
         
}