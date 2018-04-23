/*
*  @author seacole
* 商场 每个商品
*/
class ShopRenderer extends ui.components.shop.GoodsRendererUI {
    constructor() {
        super();

        this._fontData = new FontData();
        this._fontData.init(FontConfig.FONT_SHOP_1, Laya.loader.getRes(ResourceConfig.BITMAP_FONT_SHOP1_JSON),
            Laya.loader.getRes(ResourceConfig.BITMAP_FONT_SHOP_PNG), 0, BPFont.LEFT);
        // this._fontData.text = "10";
        this._bpFont = FontManager.instance.addFont(this._fontData);
        this._bpFont.padding=2;
        this._box.addChild(this._bpFont);
        this._bpFont.pos(30, 1);
        this._bpFont.centerY=0;
    }

    private _bpFont: BPFont;
    private _fontData: FontData;

    // "money": 20,
    // "diamond": 200,
    // "extra": 0,
    // "icon": "0"
    public updata(): void {
        if (this.dataSource) {
            this._labName.text = StringUtils.format(GameConfig.language.shop_diamond, this.dataSource.diamond);
            this._bpFont.text = this.dataSource.money+"";//StringUtils.format(GameConfig.language.shop_money, this.dataSource.money);
            this._bpFont.width=this._bpFont.width+10;
            this._imgIcon.source = Laya.loader.getRes("shop/shop_goods_" + this._dataSource.icon + ".png");
            this._box.width=this._bpFont.x+this._bpFont.width-10;
            // this._dataSource.extra=Math.floor(Math.random()*20);
            if (this._dataSource.hasOwnProperty("extra") && this._dataSource.extra>0){
                this._labExtra.visible=this._imgExtra.visible=true;
                this._labExtra.text=this._dataSource.extra;
            }
            else
                this._labExtra.visible=this._imgExtra.visible=false;
        }
    }
}