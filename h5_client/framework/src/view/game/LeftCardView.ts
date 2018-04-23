class LeftCardView extends ui.mj.PaiduiUI{
    constructor(){
        super()
    }

    public updateLeftCount(){
        if(this._left.visible == false){
            this._left.visible = true
        }
        this._left.text = String(BaseGameData.leftCard)
    }

    public updateShifter(){
        this._card._back.visible = false
        this._card._bg.skin = "card/1/"+BaseGameData.SHIFTER_NUM+".png"
    }
}