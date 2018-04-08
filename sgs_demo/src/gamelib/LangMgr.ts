class LangMgr {
    static LANG_ZH = "res/lang/zh.lang"
    static LANG_ZH_TW = "res/lang/zh-TW.lang"
    static LANG_EN = "res/lang/en.lang"
    static mLang = LangMgr.LANG_ZH
    private static _instance: LangMgr
    public static get instance(): LangMgr {
        if (!this._instance) {
            this._instance = new LangMgr()
        }
        return this._instance
    }
    constructor() {
        var obj: Object = Laya.loader.getRes(LangMgr.mLang);
        Laya.Text.langPacks = obj;
    }
    static changeLang(langP: string) {
        LangMgr.mLang = langP
    }
    static back = "back"
}