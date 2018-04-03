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
    GameConfig.RPC_ADDRESS = "0xbbf97981efee7214874c304d7fed9788203cfa33";
    GameConfig.RPC_URL = "http://10.225.20.161:8118";
    GameConfig.BASE_COIN = "0xb398fd7be01eb6b9aca4288a8675be80568f9c4a";
    GameConfig.BASE_PASS = "00";
    return GameConfig;
}());
//# sourceMappingURL=GameConfig.js.map