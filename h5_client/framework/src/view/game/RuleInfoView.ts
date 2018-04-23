class RuleInfoView extends ui.components.RuleInfoUI {
     constructor(rule) {
        super();
		this.init(rule)
    }
    private texts = {}
    private textKey  
    private textValue 
    private _listData = []
    private init(rule){
        if(GameConfig.IS_MATCH){
            this._info.visible = false
        }else{
            this._info.visible = true
        }
        this._wanfa.text = GameDef.RULE_TITLE_MJ[BaseGameData.gameType]
        if(BaseGameData.gameType == GameDef.GAME_TYPE.SHANGQIU_MJ){
            this.textKey = ShangQiuMJ.ruleKey
            this.textValue = ShangQiuMJ.ruleValue
        }else if(BaseGameData.gameType == GameDef.GAME_TYPE.SHANXI_MJ){
            this.textKey = ShanxiMJ.ruleKey
            this.textValue = ShanxiMJ.ruleValue
        }else if(BaseGameData.gameType == GameDef.GAME_TYPE.JINYUN_MJ || BaseGameData.gameType == GameDef.GAME_TYPE.JINYUN_HZ_MJ){
            this.textKey = JinYunMJ.ruleKey
            this.textValue = JinYunMJ.ruleValue
        }else if(BaseGameData.gameType == GameDef.GAME_TYPE.JINYUN_GS_MJ){
            this.textKey = JinYunGsMJ.ruleKey
            this.textValue = JinYunGsMJ.ruleValue
        }
        this._listData = [
            {"name": BaseGameData.totalHandCount+"局"},
            {"name": BaseGameData.maxPlayer+"人"}
        ]

        for(var k in rule){
            let value = rule[k]
            if(this.textKey[value.name-1] == "red_joker" && value.value == 1){
                BaseGameData.SHIFTER_NUM = 72
            }else{
                BaseGameData.SHIFTER_NUM = -1
            }
            if(this.textKey[value.name-1] == "fold_type"){
                BaseFoldCardManager.instance._foldType = value.value
            }
            if(value.name > 2){
                this.texts[this.textKey[value.name-1]] = this.textValue[value.name-1][value.value]
                if(this.textValue[value.name-1][value.value] && this.textValue[value.name-1][value.value] != ""){
                    this._listData.push({"name": this.textValue[value.name-1][value.value]})
                }  
            }else{
                if(value.name == 1){
                    BaseGameData.tableid = value.value
                }else if(value.name == 2){
                    BaseGameData.totalHandCount = value.value
                }
            }
        }
        if(BaseGameData.divide){
            this._divide.text = "AA支付"
        }else{
            this._divide.text = "房主支付"
        }
        this._divide.visible = !GameConfig.IS_MATCH
        this._list.array =  this._listData
        if (this._listData.length > 1){
            this._ruleBg.height = 180 + (this._listData.length-2)*40
            this._list.height = this._listData.length*40
            this._list.repeatY = this._listData.length
        }
        this._list.scrollBar.visible = false;
        this._list.itemRender = ruleRender;
        this._list.scrollBar.visible = false;
        this._list.renderHandler = new Laya.Handler(this, this.updateList);
        // this._playRule.text = this.texts["dian_pao"] 
        this._code.text = "邀请码:"+BaseGameData.tableid
        this._round.text = "第"+BaseGameData.currHandCount+"/"+BaseGameData.totalHandCount+"局"
        Dispatcher.on(EventNames.TIME_CHANGE, this, this.onTimeChange);
        this.onTimeChange();
        
        // this._playRule.on(Laya.Event.CLICK,this,this.onClick)
        this._ruleBtn.on(Laya.Event.CLICK, this, this.onClick)
        this.on(Laya.Event.CLICK,this,this.close)
        this.mouseThrough = true
    }

    public updateRound(){
        this._round.text = "第"+BaseGameData.currHandCount+"/"+BaseGameData.totalHandCount+"局"
    }

    private onTimeChange(){
        this._time.text = TimeUtils.getSystemTimeHM(true)
    }

    private onClick(){
        this._rule.visible = !this._rule.visible
    }

    public hideRule(){
        this._rule.visible = false
    }

    private close(e){
        let rect = this._ruleBtn.getBounds()
        if(rect.contains(e.currentTarget.mouseX,e.currentTarget.mouseY)){
            return
        }
        this._rule.visible = false
    }

    public updateLeftCount(){
        if(this._leftCard.visible == false){
            this._leftCard.visible = true
        }
        this._leftLabel.text = String(BaseGameData.leftCard)
    }

    /***渲染单元格时的回调方法***/
    private updateList(cell: ruleRender, index: number): void {
        if(index == this._listData.length - 1){
            cell.updata(true);
        }else{
            cell.updata(false);
        }
        
    }
}

class ruleRender extends ui.mj.RuleRenderItemUI {
    public updata(index){
         this._text.text = this.dataSource.name
         if(index) this._line.visible = false
    }
}