/*
* @author seacole
* 网络信号
*/
class NetSignalUI extends ui.components.table.NetSignalUI {
    constructor() {
        super();
        this.name = "NetSignalUI";
        Dispatcher.on(EventNames.PING_CHANGE, this, this.onNetChange);
    }

    public onNetChange(): void {
        var ping: number = server.ping;
        var type: number = Native.instance.getNet();
        if (type == 1) {
            this._wifi1.visible = ping <= 150;
            this._wifi2.visible = ping > 150 && ping <= 300;
            this._wifi3.visible = ping > 300;
            this._4g1.visible = false;
            this._4g2.visible = false;
            this._4g3.visible = false;
        }
        else {
            this._4g1.visible = ping <= 150;
            this._4g2.visible = ping > 150 && ping <= 300;
            this._4g3.visible = ping > 300;
            this._wifi1.visible = false;
            this._wifi2.visible = false;
            this._wifi3.visible = false;
        }
    }

}