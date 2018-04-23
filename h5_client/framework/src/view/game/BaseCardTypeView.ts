class BaseCardTypeView extends Laya.Sprite{
    private DIR = [[1,4,1,2],[2,3,2,1],[3,2,3,4],[4,1,4,3]]
    private RES_CARDS = [
                            [[1,1,1,1],[1,1,4,1],[1,1,1,1],[2,1,1,1]],
                            [[2,2,2,2],[2,2,1,2],[2,2,2,2],[1,2,2,2]],
                            [[3,3,3,3],[3,3,2,3],[3,3,3,3],[4,3,3,3]],
                            [[4,4,4,4],[4,4,3,4],[4,4,4,4],[1,4,4,4]]
                        ]
    private NODE_WIDTH = [[174,190,174,190],[0,55,55,55],[106,115,110,115],[0,55,55,55]]
    private NODE_HEIGHT = [[0,65,65,65],[89,103,89,103],[0,52,52,52],[88,103,88,103]]
    private SCALE_LIST = [0.85,0.5,0.5,0.5]
    private  CARD_WIDTH = 40
    private CARD_HEIGHT = 50 
    private POS = [
                        [
                            [{x:28,y:0},{x:84,y:0},{x:140,y:0},{x:84,y:22}],
                            [{x:28,y:0},{x:84,y:0},{x:148,y:-12},{x:84,y:22}],
                            [{x:28,y:0},{x:84,y:0},{x:140,y:0},{x:84,y:22}],
                            [{x:36,y:-12},{x:100,y:0},{x:156,y:0},{x:102,y:22}]
                        ],
                        [
                            [{x:0,y:16},{x:0,y:44},{x:0,y:72},{x:0,y:55}],
                            [{x:0,y:14},{x:0,y:42},{x:4,y:77},{x:0,y:53}],
                            [{x:0,y:16},{x:0,y:44},{x:0,y:72},{x:0,y:55}],
                            [{x:4,y:23},{x:0,y:60},{x:0,y:88},{x:0,y:71}]
                        ],
                        [
                            [{x:-16,y:0},{x:-49,y:0},{x:-82,y:0},{x:-49,y:12}],
                            [{x:-16,y:0},{x:-49,y:0},{x:-86,y:8},{x:-49,y:12}],
                            [{x:-16,y:0},{x:-49,y:0},{x:-82,y:0},{x:-49,y:12}],
                            [{x:-20,y:7},{x:-57,y:0},{x:-90,y:0},{x:-57,y:12}]
                        ],
                        [
                            [{x:0,y:-16},{x:0,y:-44},{x:0,y:-72},{x:0,y:-33}],
                            [{x:0,y:-16},{x:0,y:-44},{x:-4,y:-78},{x:0,y:-32}],
                            [{x:0,y:-16},{x:0,y:-44},{x:0,y:-72},{x:0,y:-33}],
                            [{x:-4,y:-26},{x:0,y:-61},{x:0,y:-89},{x:0,y:-50}]
                        ]
                    ]

    public opttype
    private cards
    private dir
    private targetdir
    private xoffset
    private yoffset
    private cardsViews:Array<any> = []


    constructor(opttype,selfdir,targetdir,cards) {
        super();
		this.init(opttype,selfdir,targetdir,cards)
    }
    



// private ALIGN_LIST = {display.BOTTOM_LEFT,display.BOTTOM_RIGHT,display.TOP_RIGHT,display.TOP_LEFT}


public init( opttype,selfdir,targetdir,cards ){
	this.width = this.NODE_WIDTH[selfdir][targetdir]
	this.height = this.NODE_HEIGHT[selfdir][targetdir]
	this.opttype = opttype
	this.cards = cards
	this.dir = selfdir
	this.targetdir = targetdir
	this.xoffset = 0
	this.yoffset = 0
	this.cardsViews = []
	if (opttype == GameDef.OptType.MJ_CHI || opttype == GameDef.OptType.MJ_PENG){
		this.initThree()
    }else if (opttype == GameDef.OptType.MJ_MNGANG){
		this.MnGang()
    }else if (opttype == GameDef.OptType.MJ_ANGANG){ 
		this.AnGang()
    }else if (opttype == GameDef.OptType.MJ_PENGGANG){
		this.MnGang()
    }
}

public getCard(v,k){
	let x
    let y
	let showFront = true
	if (this.opttype == GameDef.OptType.MJ_ANGANG){
		showFront = false
		if (k == 4 && this.dir == 1 && Utils.checkSeatid(BaseGameData.selfSeatid)){
			showFront = true
        }
    }
	var view  = new BaseCardView(v,this.dir,null)
    var scale = this.SCALE_LIST[this.dir]
    view.scale(scale, scale)
	var pos = this.POS[this.dir][this.targetdir][k]
	return {view:view,x:pos.x,y:pos.y}
}

public initThree(){
	let cards = this.cards
	let offset = 0
	for (var k in cards){
        let v = cards[k]
		let info = this.getCard(v,k)
        let view = info.view
        let x = info.x 
        let y = info.y
		let index =  parseInt(k)
		if (this.dir == 2){
			index = 5 - parseInt(k)
        }
        this.addChildAt(view, index)
        view.pos(x,y)
        this.cardsViews.push(view)
    }
}

public AnGang(){
	let card = 0
	for(var i=0;i<4;i++){
		if (i == 4){
			card = this.cards[0]
        }
        let info = this.getCard(card,i)
        let view = info.view
        let x = info.x 
        let y = info.y
		let index =  i
		if (this.dir == 2){
			index = 5 - i
			if (i == 4){ 
				index = 5
            }
		}
        this.addChildAt(view,index)
        view.pos(x,y)
        this.cardsViews.push(view)
		// view:addTo(self,index):align(ALIGN_LIST[self.dir],x,y)
		// table.insert(self.cardsViews,view)
	}
}

public showAnGang(card){
	for (var k in this.cardsViews){
        let view = this.cardsViews[k]
		view.initFront(card,this.dir,false)
		view.setUIWithShow(true)
    }
}

public MnGang(){
	for (var k in this.cards){
        let v = this.cards[k]
        let info = this.getCard(v,k)
        let view = info.view
        let x = info.x
        let y = info.y
		let index =  parseInt(k)
		if (this.dir == 2){
			index = 5 - parseInt(k)
			if (parseInt(k) == 4){
				index = 5
            }
        }
        this.addChildAt(view,index)
        view.pos(x,y)
        this.cardsViews.push(view)
	}
}

public pengGang(handcard){
    let info = this.getCard(handcard, 4)
    let view = info.view
    let x = info.x
    let y = info.y
    this.addChildAt(view, 3)
    view.pos(x,y)
	this.cardsViews.push(view)
}

public removePengGang(){
    let view = this.cardsViews[this.cardsViews.length-1]
	this.cardsViews.pop()
	view.removeSelf()
}


// public getAllChildren()
// 	local subViews = {}
// 	local children = self:getChildren()
// 	for k,v in pairs(children) do
// 		table.insert(subViews, v)
// 	end

// 	if self.front then
// 		local frontC = self.front:getChildren()
// 		for k,v in pairs(frontC) do
// 			table.insert(subViews, v)
// 		end
// 	end

// 	return subViews
// end
}