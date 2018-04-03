/*
* name;
*/
class GameConfig{
    constructor(){

    }

    private static cfgHero:any;

    public static getCfg():void{
        GameConfig.cfgHero= Laya.loader.getRes("config/hero.json");
    }

    public static getCfgHeroById(id:number):any{
        for(var item in GameConfig.cfgHero){
            if (GameConfig.cfgHero[item].id==id)
                return GameConfig.cfgHero[item];
        }
    }
    // public static RPC_ADDRESS = "0x10339a4314ad986c995aa7e8d76b04f796945a7e"
     
    // public static RPC_URL = "http://10.225.21.5:8118"
    
    // public static BASE_COIN = "0x8321042a47ec4aa8330bf63d074e79d0e30642c7"
    
    // public static BASE_PASS = "00"
    public static RPC_ADDRESS = "0x20d5e904b2344a75189d000497e6af82210066b8"
    public static RPC_URL = "http://10.225.20.161:8118"
    public static BASE_COIN = "0xb398fd7be01eb6b9aca4288a8675be80568f9c4a"
    public static BASE_PASS = "00"

}