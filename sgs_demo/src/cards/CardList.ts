class CardList extends ui.cards.BaseCardListUI {
    static LIST_SPACE = 25
    static CARD_WIDTH = 196
    static CARD_HEIGHT = 274
    _columeCount: number;
    constructor() {
        super()
        this._list.scrollBar.visible = false;
        this.initBackBtn()
        this.initBalance()
        this.initTab()
        Laya.stage.on(Laya.Event.RESIZE, this, this.onResize);
    }

    private initBackBtn() {
        this._btnBack.anchorX = this._btnBack.anchorY = 0.5
        this._btnBack.x = this._btnBack.x + (this._btnBack.width >> 1)
        this._btnBack.y = this._btnBack.y + (this._btnBack.height >> 1)
    }

    private initBalance() {
        var image: Laya.Image = new Laya.Image("menu/menu_icon_balance.png")
        var box: Laya.Box = new Laya.Box()
        box.pos(Laya.stage.width - image.width - 16, 16)
        box.size(image.width, image.height)
        box.addChild(image)
        this.addChild(box)
        var label: Laya.Label = new Laya.Label(Utils.toNumberUnit(parseInt(localStorage.getItem('balance'))))
        label.fontSize = 18
        label.color = "#ffffff"
        label.centerY = label.centerX = 0
        box.addChild(label)
    }

    onResize(e: Laya.Event = null): void {
        this.width = Laya.stage.width;
        this.height = Laya.stage.height;
        this._list.width = this.width - 10 - 10 - 20 - this._tab.width - 100
        this._columeCount = Math.floor((this._list.width - 190 - MyCard.CARD_WIDTH) / (MyCard.CARD_WIDTH + MyCard.LIST_SPACE));
        this._list.scrollBar.value = 0;
        this._list.x = (this.width - this._tab.width - 10) - this._list.width + MyCard.LIST_SPACE >> 1;
        this.setList(this._tab.selectedIndex + 1);
        this._btnBack.on(Laya.Event.CLICK, this, this.onTouch);
    }

    private initTab() {
        this._tab.removeChildren();
        this._tab.initItems();
        for (var i: number = 0; i < 5; i++) {
            var btn: Laya.Button = new runtime.RuntimeClickBtn();
            btn.skin = "menu/icon_camp_" + (i + 1) + ".png";
            btn.anchorX = btn.anchorY = 0.5
            btn.stateNum = 2;
            btn.labelColors = "#e2eff7,#e2eff7,#e2eff7,#e2eff7";
            btn.labelSize = 30;
            btn.name = "item" + i;
            this._tab.addItem(btn);
            btn.x = btn.width >> 1
            btn.y = (btn.height) * i + (btn.height >> 1)
        }
        this._tab.selectHandler = new Laya.Handler(this, this.checkTab);
        this._tab.selectedIndex = 4;
        this.checkTab();
    }

    private checkTab(): void {
        this.setList(this._tab.selectedIndex + 1);
    }

    setList(camp: number): void {
    }

    private onTouch(e: Laya.Event): void {
        switch (e.currentTarget) {
            case this._btnBack:
                this.removeSelf();
                break;
        }
    }
}