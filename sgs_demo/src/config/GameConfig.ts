/*
* name;
*/
class GameConfig {
    constructor() {

    }

    private static cfgHero: any;

    public static getCfg(): void {
        GameConfig.cfgHero = Laya.loader.getRes("config/hero.json")
    }

    public static getCfgHeroById(id: number): any {
        for (var item in GameConfig.cfgHero) {
            if (GameConfig.cfgHero[item].id == id)
                return GameConfig.cfgHero[item];
        }
        return null
    }
    public static RPC_ADDRESS = "0xbbf97981efee7214874c304d7fed9788203cfa33"
    public static RPC_URL = "http://10.50.23.60:8118"
    public static BASE_COIN = "0xb398fd7be01eb6b9aca4288a8675be80568f9c4a"
    public static BASE_PASS = "00"

}