/*
* @author seacole
* 电量
*/
class BatteryUI extends ui.components.table.BatteryUI {
    constructor() {
        super();

        Dispatcher.on(EventNames.BATTERY_CHANGE, this, this.onchange);
        Native.instance.onBatteryChanged(-1, -1);
    }

    // * @param {number } state 0:未知状态 1:未充电 2:充电中 3:已充满
    // * @param {number } level 电量 0-100
    private onchange(state: number, level: number): void {
        this.process = level;
        this.isCharge = state == 2;
    }

    private set process(value: number) {
        this._imgProcess.width = 39 * value / 100;
        if (value >= 20)
            this._imgProcess.source = Laya.loader.getRes("table/battery_bg1.png");
        else
            this._imgProcess.source = Laya.loader.getRes("table/battery_bg3.png");
    }

    private set isCharge(value: boolean) {
        this._imgCharge.visible = value;
        if (value)
            this._imgProcess.source = Laya.loader.getRes("table/battery_bg2.png");
    }
}