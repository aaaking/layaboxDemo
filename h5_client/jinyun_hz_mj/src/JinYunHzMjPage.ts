class JinYunHzMjPage extends JinYunMjPage{
    constructor(){
        super()
        this.name = "JinYunHzMjPage";
         this._loadDatas = this._loadDatas.concat([
            { url: "res/config/jinyun_mj.json", type: Laya.Loader.JSON },
         {url: ResourceConfig.SHEET_JINYUN_MJ_CHAT, type: Laya.Loader.ATLAS}
       ]);
        AppPage.register(JinYunHzMjPage, this._loadDatas);
        
    }
    
}