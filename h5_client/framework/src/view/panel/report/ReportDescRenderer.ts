/*
*  @author seacole
* 结算 每个人的具体内容
*/
class ReportDescRenderer extends ui.components.report.ReportDescRendererUI {
    constructor() {
        super();
    }

    // {key value}
    public updata(): void {
        if (this.dataSource) {
            this._labKey.text = this.dataSource.key;
            this._labValue.text = this.dataSource.value;
        }
    }
}