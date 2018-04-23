



class BaseTingCardView extends Laya.View{
    private HEIGHT = 132
    private info
    private num
    protected bg
    constructor(info:{}) {
    super();
    this.init(info)
    }
  private init(info){
	if (!info) return 
	this.info = info
	if (this.info.length < 34){
		this.num = this.info.length
		// this.width = this.num > 4 ? 3*85 : (this.num-1)*85
		let height = this.num > 4 ? (Math.ceil(this.num/4))*this.HEIGHT : this.HEIGHT
		let width = this.num > 4 ? 4*170+100 : this.num*170+100
		this.bg = new Laya.Image("opt/card_border.png")
        this.bg.sizeGrid = "10,10,10,10,0" 
        this.addChild(this.bg)
        this.bg.width = width
        this.bg.height = height
		this.tingCard()
    }else{
		this.bg = new Laya.Image("opt/card_border.png")
        this.bg.sizeGrid = "10,10,10,10,0" 
        this.bg.width = 280
        this.bg.height = this.HEIGHT
        this.width = 280
        this.height = this.HEIGHT
        this.addChild(this.bg)
		this.tingAllCard()
	}
  }

private tingAllCard(){
   
    let hu = new Laya.Image("ting/hu.png")
    this.bg.addChild(hu)
    hu.x = 20
    hu.centerY = 0
    let view = new ui.mj.TingAllUI()
	// display.newSprite("ting/hu.png"):addTo(this.bg):pos(this.size.width/2-80,this.size.height/2)
   
    this.bg.addChild(view)
    view.pos(this.width/2-20,10)
	// display.newSprite("ting/all.png"):addTo(this.bg):pos(this.size.width/2,this.size.height/2):setScale(0.6)
	let num = 0
	for (var k in this.info){
        let v = this.info[k]
		num = num + BaseGameData.getLeftCardCount(v)
    }
	view._num.text = String(num)
    
}

public tingCard(){
	let hu = new Laya.Image("ting/hu.png")
    this.bg.addChild(hu)
    hu.x = 20
    hu.centerY = 0
    let posX = 110
    let poxY = 15 
    // :addTo(this.bg):pos(this.width+this.size.width/2-80,this.size.height/2)
    this.info.sort((a, b): number => {
        if (a < b)
            return -1;
        else
            return 1
    })
	for (var i = 0; i< this.num; i++){
		let width = i%4*160+posX
		let height = Math.floor(i/4)*this.HEIGHT + poxY
		this.addItem(this.info[i], 1, 1, width, height)
	}
}

public addItem(cardid, fanshu, num, width, height){
	let card = new ui.mj.TingItemUI()
    this.bg.addChild(card)
    card.pos(width,height)
    card._card._back.visible = false
    card._card._bg.skin = "card/"+card._card.name+"/"+cardid+".png"
    card._num.text = String(BaseGameData.getLeftCardCount(cardid))
    card._card._ting.visible = false
}

public clearUI(){
	if (this.bg){
		this.bg.removeSelf()
		this.bg = null
    }
}
}
