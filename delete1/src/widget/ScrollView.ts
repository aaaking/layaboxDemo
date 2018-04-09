// https://blog.csdn.net/honey199396/article/details/79716679 这是这个demo的方案
// https://blog.csdn.net/wuqilianga/article/details/52583988 这是第二个方案

class ScrollView extends Laya.Box implements Laya.IRender, Laya.IItem {
    private _array: Array<any>;// 数据源
    private _renderHandler: Laya.Handler;// 单元格渲染处理器 
    private _mouseHandler: Laya.Handler;// 单元格鼠标事件处理器
    private _selectHandler: Laya.Handler;// 改变List的选择项时执行的处理器 
    // 是否已经渲染过单元格
    private _hadRender: boolean = false;
    private _hadInit: boolean = false;
    private _hadInitItem: boolean = false;
    private _isSensitive: boolean = true;// 抬起鼠标是否继续滑动
    private _cellWidth: number;// 单元格宽
    private _cellHeight: number;// 单元格高
    private _leftAlign: number = 0;// 左边距
    private _rightAlign: number = 0;// 右边距
    // 单元格集合
    private _cells: Array<any>;
    private _itemRender: any;
    public space: number = 0;//两个单元格之间的间隔
    constructor() {
        super()
        this.mouseEnabled = true;
        this.on(Laya.Event.MOUSE_DOWN, this, this.mouseDown);
        this.on(Laya.Event.MOUSE_UP, this, this.mouseUp, [Laya.Event.MOUSE_UP]);
        this.on(Laya.Event.MOUSE_MOVE, this, this.mouseMove);
        this.on(Laya.Event.MOUSE_OUT, this, this.mouseUp, [Laya.Event.MOUSE_OUT]);
    }

    public set array(arr: Array<any>) {//set original data
        this._array = arr;
        this.init();
    }
    public get array(): Array<any> {
        return this._array;
    }
    public set itemRender(itemRender: any) {
        this._itemRender = itemRender;
        this.init();
    }
    public set renderHandler(hander: Laya.Handler) {
        this._renderHandler = hander;
        this.init();
    }
    public set mouseHandler(hander: Laya.Handler) {
        this._mouseHandler = hander;
    }
    public set selectHandler(hander: Laya.Handler) {
        this._selectHandler = hander;
    }
    public set cellWidth(cellWidth: number) {
        this._cellWidth = cellWidth;
    }
    public get cellWidth(): number {
        return this._cellWidth;
    }
    public set cellHeight(cellHeight: number) {
        this._cellHeight = cellHeight;
    }
    public get cellHeight(): number {
        return this._cellHeight;
    }
    /**
     * 左边界
     */
    public set leftAlign(leftAlign: number) {
        this._leftAlign = leftAlign;
    }
    public get leftAlign(): number {
        return this._leftAlign;
    }
    /**
     * 右边界
     */
    public set rightAlign(rightAlign: number) {
        this._rightAlign = rightAlign;
    }
    public get rightAlign() {
        return this._rightAlign;
    }
    public addItem(): void {

    }
    public getItemByIndex(index: number): any {
        return this._cells[index];
    }
    public getItemIndex(cell: any): number {
        for (var i = 0; i < this._cells.length; i++) {
            if (cell == this._cells[i]) {
                return i;
            }
        }
        return -1;
    }

    private init(): void {
        if (!this._hadInit) {
            this.initItems();// 初始化单元格
            this.initRender();// 初始化渲染
            if (this._hadInitItem && this._hadRender) {
                this._hadInit = true;
            }
        }
    }
    /**
     * 单元格响应事件
     */
    private onCellEvent(event: Event, cell: any) {
        var index = this.getItemIndex(cell);
        if (index == -1) {
            return;
        }
        if (this._selectHandler) {
            this._selectHandler.runWith([event, index]);
        }
    }
    /**
     * 初始化所有的Item
     */
    public initItems(): void {
        if (!this._hadInitItem && this._itemRender != null && this._array != null && this._array.length > 0) {
            this._cells = new Array<any>()
            for (var i = 0; i < this._array.length; i++) {
                let item = new this._itemRender(this._cellWidth, this._cellHeight);
                this._cells.push(item);
                this.addChild(item);
            }
            this._hadInitItem = true;
            this.refreshCellsPos();
        }
    }
    private initRender(): void {
        if (!this._hadRender && this._renderHandler != null && this._array != null && this._array.length > 0) {
            for (var i = 0; i < this._array.length; i++) {
                this._renderHandler.runWith([this._cells[i], i]);
            }
            this._hadRender = true;
        }
    }
    /**
     * 刷新ScrollView下Cell的位置 
     */
    private refreshCellsPos() {
        var cellCount = this._cells.length;
        for (var i = 0; i < cellCount; i++) {
            let cell: Laya.Box = this._cells[i] as Laya.Box;
            let posX: number = this.getCellPosByIndex(i);
            cell.pos(posX, this.height / 2);
        }
        this.width = this._leftAlign + cellCount * this._cellWidth + (cellCount - 1) * this.space + this._rightAlign;
    }
    /**
     * 单个单元格执行渲染
     */
    private doSingleRender(index: number): void {
        if (!this._hadRender) {
            this.initRender();
            return;
        }
        if (this._renderHandler != null) {
            this._renderHandler.runWith([this._cells[index], index]);
        }
    }
    /**
     * 根据单元格索引获取单元格位置
     * @param index 
     */
    public getCellPosByIndex(index: number): number {
        return this._leftAlign + (index + 0.5) * this._cellWidth + index * this.space;
    }
    // ----------------------- mouse event start ------------------------
    private mouseDown() {
        if (this._mouseHandler != null) {
            var e: Event = new Event(Laya.Event.MOUSE_DOWN);
            this._mouseHandler.runWith([e]);
        }
    }
    private mouseUp(event: string) {
        if (this._mouseHandler != null) {
            var e: Event = new Event(Laya.Event.MOUSE_UP);
            this._mouseHandler.runWith([e]);
        }
    }
    private mouseMove() {
        if (this._mouseHandler != null) {
            var e: Event = new Event(Laya.Event.MOUSE_MOVE);
            this._mouseHandler.runWith([e]);
        }
    }
}