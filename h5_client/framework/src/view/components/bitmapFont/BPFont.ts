/*
* @author seacole
* 位图字体基础类;
*/
class BPFont extends Laya.Component {
    protected _fontName: string;
    private _id: number;
    // 文本内容
    protected _text: string;
    // json数据
    private _jsonData: any;
    // 图片数据
    private _imageData: Laya.Texture;
    // 文本字间距
    private _padding: number = 0;
    // 所有元素；
    private charSprites: any;
    // 位置类型
    private _posType: string;

    private _maxHeight: number;
    protected _posX: number;
    protected _posY: number;
    //  左 右 中
    public static LEFT: string = "left";
    public static RIGHT: string = "right";
    public static CENTER: string = "center";
    constructor() {
        super();
        this.on(Laya.Event.ADDED, this, this.onAddToStage);
        this.on(Laya.Event.REMOVED, this, this.onRemoveFromStage);
    }

    protected onAddToStage(e: Laya.Event): void {
        this.text = this._text;
    }

    protected onRemoveFromStage(e: Laya.Event): void {

    }

    public setInfo(fontData: FontData): void {
        this._id = fontData.id;
        this.width = fontData.width;
        this._posType = fontData.posType;
        this._jsonData = fontData.jsonData;
        this._imageData = fontData.textureData;
        this._posX = fontData.posX;
        this._posY = fontData.posY;
        this._text = fontData.text;
    }

    public get id(): number {
        return this._id;
    }

    public set padding(v: number) {
        this._padding = v;
        this.setCharsPos();
    }
    public get padding(): number {
        return this._padding;
    }

    public set text(v: string) {
        this._text = v;
        this.createBitmapFont(v);
    }
    public get text(): string {
        return this._text;
    }

    // 创建位图字体
    private createBitmapFont(v: string) {
        if (!v || v == "") {
            return;
        }
        // 移除上次绘制的内容
        for (var k = 0; k < this.numChildren; k++) {
            Laya.Pool.recover("sprite_bp" + this._id, this._childs[k]);
        }
        this.removeChildren();
        var charTotal: number = v.length;
        var charSps: Array<Laya.Sprite> = [];
        this._maxHeight = 0;
        for (var i = 0; i < charTotal; i++) {
            var targetChar = v.substr(i, 1);
            var charData: any = this._jsonData.frames[targetChar];
            if (!charData) {
                console.warn("没有找到对应的字符：" + targetChar);
                continue;
            }
            var charSp = this.drawTexture(charData);
            if (charSp.height > this._maxHeight)
                this._maxHeight = charSp.height;
            charSps.push(charSp);
        }
        this.charSprites = charSps;
        this.setCharsPos();
    }
    // 从图集上面抠图
    private drawTexture(charData) {
        var charSp: Laya.Sprite = new Laya.Sprite();
        charSp = Laya.Pool.getItemByClass("sprite_bp" + this._id, Laya.Sprite);
        charSp.graphics.clear();
        charSp.graphics.fillTexture(this._imageData, charData.x, charData.y, charData.w, charData.h, "no-repeat", new Laya.Point(-charData.x, -charData.y));
        charSp.size(charData.w, charData.h)
        charSp.scrollRect = new Laya.Rectangle(charData.x, charData.y, charData.w, charData.h);
        this.addChild(charSp);
        return charSp;
    }
    // 设置位置
    private setCharsPos() {
        switch (this._posType) {
            case BPFont.LEFT:
                this.setCharsPosOnLeft();
                break;
            case BPFont.RIGHT:
                this.setCharsPosOnRight();
                break;
            case BPFont.CENTER:
                this.setCharsPosOnCenter();
                break;
        }
    }

    // 左对齐
    private setCharsPosOnLeft() {
        if (!this.text || this.text == "") {
            return;
        }
        var sps = this.charSprites;
        var length = sps.length;
        for (var i = 0; i < length; i++) {
            sps[i].x = 0;
            sps[i].y = Math.round(this._maxHeight - sps[i].height >> 1);
        }
        for (var i = 1; i < length; i++) {
            sps[i].x += sps[i - 1].x + sps[i - 1].width + this.padding;
        }
    }
    // 右对齐
    private setCharsPosOnRight() {
        if (!this.text || this.text == "") {
            return;
        }
        var sps = this.charSprites;
        var length = sps.length;
        var width = this.width;
        for (var i = 0; i < length; i++) {
            sps[i].x = width;
            sps[i].y = Math.round(this._maxHeight - sps[i].height >> 1);
        }
        for (var i = length - 1; i >= 0; i--) {
            width -= sps[i].width + this.padding;
            sps[i].x = width;
        }
    }
    // 居中
    private setCharsPosOnCenter() {
        if (!this.text || this.text == "") {
            return;
        }
        var sps = this.charSprites;
        var length = sps.length;
        var width = this.width;
        var allCharsWidth = 0;
        for (var i = 0; i < length; i++) {
            allCharsWidth += sps[i].width;
        }
        var x = Math.round((width - allCharsWidth) / 2);
        sps[0].x = x;
        sps[0].y = this._maxHeight - sps[0].height >> 1;
        for (var i = 1; i < length; i++) {
            sps[i].x = 0;
            sps[i].x += sps[i - 1].x + sps[i - 1].width + this.padding;
            sps[i].y = Math.round(this._maxHeight - sps[i].height >> 1);
        }
    }

    public start(time: number): void {
    }

    public stop(): void {
    }

}