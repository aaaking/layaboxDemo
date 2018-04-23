/*
 * @author seacole
 * 顶层弹窗 大厅中
*/
class AlertMenuCtrl extends AlertCtrl {
    constructor(){
        super();
    }

    protected static _instance: AlertMenuCtrl;
    public static get instance(): AlertMenuCtrl {
        if (!this._instance)
            this._instance = new AlertMenuCtrl();
        return this._instance;
    }
}