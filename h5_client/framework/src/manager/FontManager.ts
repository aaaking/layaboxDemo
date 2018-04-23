/*
* @author seacole
* name;
*/
class FontManager {
    private _fontPools: Object;
    private _fonts: Array<BPFont>;
    constructor() {

    }

    private static _instance: FontManager;
    public static get instance(): FontManager {
        if (!this._instance) {
            this._instance = new FontManager();
        }
        return this._instance;
    }

    public init(): void {
        this._fontPools = new Object();
        this._fonts = [];

        Dispatcher.on(EventNames.REMOVE_FONT, this, this.onRemoveFont);
    }

    /**
    *添加美术字
    */
    public addFont(fontData: FontData): BPFont {
        if (!this._fontPools[fontData.id]) {
            var pool: ObjectPool;
            if (fontData.type == FontData.TYPE_NORMAL)
                pool = ObjectPool.getInstance("BPFont" + fontData.id, Laya.ClassUtils.getClass(Font1));
            else
                pool = ObjectPool.getInstance("BPFont" + fontData.id, Laya.ClassUtils.getClass(TimerFont));

            this._fontPools[fontData.id] = pool;
        }

        var bpFont: BPFont = this._fontPools[fontData.id].borrowObject() as BPFont;
        bpFont.setInfo(fontData);
        this._fonts.push(bpFont);
        return bpFont;
    }
    /**
     *移除美术字
     */
    private onRemoveFont(bpFont: BPFont): void {
        this._fontPools[bpFont.id].returnObject(bpFont);
        bpFont.removeSelf();
        var idx: number = this._fonts.indexOf(bpFont);
        if (idx != -1)
            this._fonts.splice(idx, 1);
    }

    /**
    *移除所有美术字
    */
    public clearAll(): void {
        if (!this._fonts)
            this._fonts = [];
        while (this._fonts.length) {
            this.onRemoveFont(this._fonts[0]);
        }
    }

}