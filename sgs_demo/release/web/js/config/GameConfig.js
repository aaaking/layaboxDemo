var GameConfig=function(){function e(){}return e.getCfg=function(){e.cfgHero=Laya.loader.getRes("config/hero.json")},e.getCfgHeroById=function(f){for(var o in e.cfgHero)if(e.cfgHero[o].id==f)return e.cfgHero[o]},e.RPC_ADDRESS="0xbbf97981efee7214874c304d7fed9788203cfa33",e.RPC_URL="http://127.0.0.1:8500",e.BASE_COIN="0xb398fd7be01eb6b9aca4288a8675be80568f9c4a",e.BASE_PASS="00",e}();