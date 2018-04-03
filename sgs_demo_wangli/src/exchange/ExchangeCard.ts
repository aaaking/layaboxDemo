/*
* name;
*/
class ExchangeCard extends Card {
    private _btnBuy:Laya.Button
    constructor() {
        super();
        this._imgName = new Laya.Image();
        this._imgName.pos(14, 70);
        this.addChild(this._imgName);

        this._labCount = new Laya.Label();
        this._labCount.right = 20;
        this._labCount.bottom = 20;
        this._labCount.fontSize = 30;
        this._labCount.color = "#ffffff";
        this._labCount.stroke = 5;
        this._labCount.strokeColor = "0000000";
        this.addChild(this._labCount);
        this._btnBuy = new Laya.Button("menu/btn_buy.png")
        this._btnBuy.stateNum = 1
        this.addChild(this._btnBuy)
        this._btnBuy.centerX = 0
        this._btnBuy.y = 282
        this.height = 360
        this._labPrice = new Laya.Label("200")
        this._btnBuy.addChild(this._labPrice)
        this._labPrice.color = "#ffffff"
        this._labPrice.fontSize = 20
        this._labPrice.stroke = 2
        this._labPrice.strokeColor = "#000000"
        this._labPrice.pos(80,30)
        this._btnBuy.on(Laya.Event.CLICK,this, this.buyCard)
    }
    private _imgName: Laya.Image;
    private _labCount: Laya.Label;
    private _labPrice: Laya.Label;
    public updata(): void {
        super.updata();
            this._icon.skin = "cards/" + this.dataSource.cfg.icon + ".png";
        
            this._imgName.visible = true;
            this._imgName.skin = "cardsname/" + this.dataSource.cfg.icon + ".png";
        this._labPrice.text = this.dataSource.price;
        if(this.dataSource.isself){
            this._btnBuy.skin = "menu/btn_cancel.png"
            this._labPrice.visible = false
        }else{
            this._btnBuy.skin = "menu/btn_buy.png"
        }
    }

    public buyCard(){
        let baseID = "0000000000000000000000000000000000000000000000000000000000000000"
        let param = baseID.substring(0,64-this.dataSource.id.toString(16).length)+this.dataSource.id.toString(16)
        Ajax.callNet(GameConfig.RPC_URL, { "jsonrpc": "2.0", "method": "personal_unlockAccount", "params": [localStorage.getItem('uuid'), "", null
                ], "id": 67 }, "POST", null, function (data) {
                    console.info(data)
                    Ajax.callNet(GameConfig.RPC_URL, { "jsonrpc": "2.0", "method": "eth_sendTransaction", "params": [{"from":localStorage.getItem('uuid'), "to": GameConfig.RPC_ADDRESS, "data": "0xc70f5eaa"+param, "value":"0x"+parseInt(this.dataSource.price).toString(16) }], "id": 67 }, "POST", null, function (data) {
                        console.info(data)
                        var info = JSON.parse(data)
                        Laya.timer.loop(10000,this,function(){
                            Ajax.callNet(GameConfig.RPC_URL, { "jsonrpc": "2.0", "method": "eth_getTransactionReceipt", "params": [info.result], "id": 67 }, "POST", null, function (data) {
                            console.info(data)
                                let cardsinfo = JSON.parse(data)
                                if(cardsinfo.result){
                                    Laya.timer.clearAll(this)
                                    Dispatcher.dispatch("updateInfo");  

                                }
                            }.bind(this))
                        })
                    }.bind(this))
                }.bind(this))
    }
}