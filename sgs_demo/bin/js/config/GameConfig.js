/*
* name;
*/
var GameConfig = /** @class */ (function () {
    function GameConfig() {
    }
    GameConfig.getCfg = function () {
        GameConfig.cfgHero = Laya.loader.getRes("config/hero.json");
    };
    GameConfig.getCfgHeroById = function (id) {
        for (var item in GameConfig.cfgHero) {
            if (GameConfig.cfgHero[item].id == id)
                return GameConfig.cfgHero[item];
        }
    };
    // public static RPC_ADDRESS = "0x10339a4314ad986c995aa7e8d76b04f796945a7e"
    // public static RPC_URL = "http://10.225.21.5:8118"
    // public static BASE_COIN = "0x8321042a47ec4aa8330bf63d074e79d0e30642c7"
    // public static BASE_PASS = "00"
    GameConfig.RPC_ADDRESS = "0xbbf97981efee7214874c304d7fed9788203cfa33";
    GameConfig.RPC_URL = "http://10.225.20.161:8118";
    GameConfig.BASE_COIN = "0xb398fd7be01eb6b9aca4288a8675be80568f9c4a";
    GameConfig.BASE_PASS = "00";
    return GameConfig;
}());
//# sourceMappingURL=GameConfig.js.map