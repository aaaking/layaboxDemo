/*
* @author seacole
* 日历滑动器
*/
class DateScroll extends ui.matchSign.date.DateScrollUI {
    constructor() {
        super();

        this._listBack.itemRender = DateLabelGrayRenderer;
        this._listBack.renderHandler = new Laya.Handler(this, this.updateHourBackList);
        this._listBack.scrollBar.visible = false;
        this._list.itemRender = DateLabelRenderer;
        this._list.renderHandler = new Laya.Handler(this, this.updateHourList);
        this._list.scrollBar.visible = false;


    }

    private _cellHeight: number = 40;
    private _lastHourScrollValue: number;
    private _dataArray: Array<any>;

    public start(index:number): void {
        if (index<2)
            index+=this._dataArray.length/3;
        this._listBack.scrollBar.value=this._cellHeight*(index-2);
        Laya.timer.frameLoop(1, this, this.onLoop);
    }

    public stop():void{
        Laya.timer.clear(this,this.onLoop);
    }

    public set date(value: Array<any>) {
        this._dataArray = value;
        this._dataArray=this._dataArray.concat(value);
        this._dataArray=this._dataArray.concat(value);
        this._list.array = this._listBack.array = this._dataArray;
    }

    /***渲染单元格时的回调方法***/
    private updateHourList(cell: DateLabelRenderer, index: number): void {
        cell.updata();

        // log(this._list.scrollBar.value);
    }

    /***渲染单元格时的回调方法***/
    private updateHourBackList(cell: DateLabelGrayRenderer, index: number): void {
        if (cell)
            cell.updata();
        if (!this._isAutoAdsorption) {
            var height: number = this._cellHeight * this._dataArray.length/3;
            if (this._listBack.scrollBar.value < height)
                this._listBack.scrollBar.value += height;
            else if (this._listBack.scrollBar.value > height * 2)
                this._listBack.scrollBar.value -= height;
        }
    }

    private onLoop(): void {
        this._list.scrollBar.value = this._listBack.scrollBar.value + this._cellHeight * 2;
        if (this._lastHourScrollValue == this._listBack.scrollBar.value) {
            this._frameCount++;
            if (this._frameCount == 5)
                this.autoAdsorption();
        }
        else {
            if (!this._isAutoAdsorption) {
                this._frameCount = 0;
            }
            if (this._lastHourScrollValue < this._listBack.scrollBar.value)
                this._direct = "ceil";
            else
                this._direct = "floor";
            this._lastHourScrollValue = this._listBack.scrollBar.value;
        }
        this.setScale();
    }

    private _frameCount: number = 0;
    private _isAutoAdsorption: boolean;
    private _direct: string;
    /**
     * 吸附
     */
    private autoAdsorption(): void {
        this._isAutoAdsorption = true;
        var value: number;
        if (this._direct == "ceil")
            value = Math.ceil(this._listBack.scrollBar.value / this._cellHeight) * this._cellHeight;
        else
            value = Math.floor(this._listBack.scrollBar.value / this._cellHeight) * this._cellHeight;

        var time: number = 500;
        if (Math.abs(this._listBack.scrollBar.value - value) / this._cellHeight > 0.8) {
            this._isAutoAdsorption = false;
            this._frameCount = 0;
        }
        else {
            Laya.Tween.clearTween(this._listBack.scrollBar);
            Laya.Tween.to(this._listBack.scrollBar, { value: value }, time); Laya.timer.once(time, this, () => {
                this._isAutoAdsorption = false;
                this._frameCount = 0;
                this.updateHourBackList(null, 0);
            });
        }
    }

    private setScale(): void {
        for (var i: number = 0; i < this._listBack.cells.length; i++) {
            var renderer: DateLabelGrayRenderer = (this._listBack.cells[i] as DateLabelGrayRenderer);
            var dis: number = Math.abs(renderer.y - this._listBack.scrollBar.value - (this._cellHeight * 2));
            var per: number = (this._cellHeight * 3 - dis) / (this._cellHeight * 3);
            renderer.scaleY = per;
        }
    }

    public getIndex():number{
        var index:number=Math.round(this._list.scrollBar.value/this._cellHeight);
        var tmp:number=this._dataArray.length/3;
        while(index>=tmp)
        {
            index-=tmp;
        }
        return index;
    }
}