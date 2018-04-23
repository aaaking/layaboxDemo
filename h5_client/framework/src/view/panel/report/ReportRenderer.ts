/*
*  @author seacole
* 结算 每个人的信息
*/
class ReportRenderer extends ui.components.report.ReportRenderUI {
    constructor() {
        super();
        this._list.itemRender = ReportDescRenderer;
        this._list.scrollBar.visible = false;
        this._list.renderHandler = new Laya.Handler(this, this.updateItem);
        this._head = new HeadUI();
        this._head.scale(0.8,0.8);
        this._head.centerX = 0;
        this._head.y = 12;
        this.addChildAt(this._head, 1);
    }

    private _head: HeadUI;

    // {uid,info,score}
    public updata(): void {
        if (this.dataSource && this.dataSource.info.length) {
            this._labScore.text = this.dataSource.score;
            var tmp: any[] = [];
            for (var i: number = 0; i < this.dataSource.info.length; i += 2) {
                tmp.push({ key: this.dataSource.info[i], value: this.dataSource.info[i + 1] });
            }
            this._list.array = tmp;
            this._head.getInfo(this.dataSource.uid);
        }
    }

    /***渲染单元格时的回调方法***/
    private updateItem(cell: ReportDescRenderer, index: number): void {
        //用获得的数据给图片更换皮肤
        cell.updata();
        // cell.img.skin = cell.dataSource;
    }
}