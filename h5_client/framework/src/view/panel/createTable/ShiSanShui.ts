class ShiSanShui {
     public static createInfo = [
        {"name": "countSelect", "title": "局数", "key": "max_hand_cnt", "texts":"12局,24局,48局","values":[12,24,48], "value":12, "cost":1, "des":["12局","24局","48局"]},
         {"name": "countSelect", "title": "人数", "key": "max_player", "texts":"4人,3人,2人","values":[4,3,2], "value":4, "costDivide":1, "des":["4人","3人","2人"]},
        {"name": "gps","key": "gps", "texts":"开启防作弊功能","values":[0,1], "value":0, "des":["","防作弊"]},
        {"name": "select", "title": "玩法", "key": "game_type", "texts":"普通模式,大小王百变","values":[0,1], "value":0, "des":["普通模式","大小王百变"]},
        {"name": "chargeSelect", "title": "收费方式", "key": "charge_type", "texts":["房主支付","AA支付"],"values":[0,1], "value":0, "des":["房主支付","AA支付"]},
        ]
      public static cost = 0
      public static costDivide = 4                                              
      public static costs = [2,4,8]                                                              
}