/**
* @author seacole
 *数字键盘
 */
class KeyBoardNumUI extends ui.components.keyboard.KeyBoardNumUI {
    private _type: number;
    //1 最后是回退 2最后是搜索
    constructor(type: number = 1) {
        super();
        this._type = type;
        var fontData1: FontData = new FontData();
        fontData1.init(FontConfig.FONT_JOIN_TABLE_1, Laya.loader.getRes(ResourceConfig.BITMAP_FONT_JOINTABLE1_JSON),
            Laya.loader.getRes(ResourceConfig.BITMAP_FONT_JOINTABLE1_PNG), 178, BPFont.CENTER);
        var fontData2: FontData = new FontData();
        fontData2.init(FontConfig.FONT_JOIN_TABLE_1, Laya.loader.getRes(ResourceConfig.BITMAP_FONT_JOINTABLE2_JSON),
            Laya.loader.getRes(ResourceConfig.BITMAP_FONT_JOINTABLE2_PNG), 178, BPFont.CENTER);
        for (var i: number = 1; i <= 12; i++) {
            var renderer: ui.components.keyboard.KeyBoardRendererUI = new ui.components.keyboard.KeyBoardRendererUI();
            renderer.name = i.toString();

            var bpFont1: BPFont = FontManager.instance.addFont(fontData1);
            bpFont1.text = this.getBpStr(i);
            renderer.addChild(bpFont1);
            bpFont1.pos(0, 20);

            var bpFont2: BPFont = FontManager.instance.addFont(fontData2);
            bpFont2.text = this.getBpStr(i);
            renderer.addChild(bpFont2);
            bpFont2.pos(0, 20);



            if (this._type == 2 && this.getBpStr(i)=="搜索")
                (renderer.getChildAt(0) as component.BaseButton).skin = "joinTable/joinTable_keyBoard_btn_2.png";

            renderer.x = 2 + 181 * ((i - 1) % 3);
            renderer.y = 2 + 72 * Math.floor((i - 1) / 3);
            renderer.on(Laya.Event.CLICK, this, this.onTouch);
            renderer.on(Laya.Event.MOUSE_OVER, this, this.onTouch);
            renderer.on(Laya.Event.MOUSE_OUT, this, this.onTouch);
            renderer.on(Laya.Event.MOUSE_DOWN, this, this.onTouch);
            renderer.on(Laya.Event.MOUSE_UP, this, this.onTouch);
            this.addChild(renderer);
        }
    }

    private onTouch(e: Laya.Event): void {
        switch (e.type) {
            case Laya.Event.CLICK:
                Dispatcher.dispatch(EventNames.KEYBOARD_NUM, e.currentTarget.name);
                break;

            case Laya.Event.MOUSE_OVER:
            case Laya.Event.MOUSE_DOWN:
                (e.currentTarget.getChildAt(1) as BPFont).visible = true;
                (e.currentTarget.getChildAt(2) as BPFont).visible = false;
                break;

            case Laya.Event.MOUSE_OUT:
            case Laya.Event.MOUSE_UP:
                (e.currentTarget.getChildAt(1) as BPFont).visible = false;
                (e.currentTarget.getChildAt(2) as BPFont).visible = true;
                break;
        }

    }

    private getBpStr(value: number): string {
        if (value == 10)
            return "重输";
        else if (value == 11)
            return "0";
        else if (value == 12) {
            if (this._type == 1)
                return "退";
            else if (this._type == 2)
                return "搜索";
        }
        else
            return value + "";
    }
}