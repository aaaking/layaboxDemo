var __extends=this&&this.__extends||function(){var t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,a){t.__proto__=a}||function(t,a){for(var e in a)a.hasOwnProperty(e)&&(t[e]=a[e])};return function(a,e){function n(){this.constructor=a}t(a,e),a.prototype=null===e?Object.create(e):(n.prototype=e.prototype,new n)}}(),CardPackage=function(t){function a(){var a=t.call(this)||this;return a._mask.width=Laya.stage.width,a._mask.height=Laya.stage.height,a._mask.on(Laya.Event.CLICK,a,a.onTouch),a._btnBack.on(Laya.Event.CLICK,a,a.onTouch),a._btnSortNormal.on(Laya.Event.CLICK,a,a.onTouch),a._btnSortCamp.on(Laya.Event.CLICK,a,a.onTouch),Laya.stage.on(Laya.Event.RESIZE,a,a.onResize),Dispatcher.on("showSellCards",a,a.onShowSellCards),Dispatcher.on("updateBag",a,a.updateBag),a}return __extends(a,t),Object.defineProperty(a,"instance",{get:function(){return this._instance||(this._instance=new a),this._instance},enumerable:!0,configurable:!0}),a.prototype.show=function(t){var e=this;t&&!a.instance.parent&&t.addChild(a.instance),CardPackageManager.instance.testInitCards(function(){e._list.itemRender=CardPackageCard,e._list.scrollBar.visible=!1,e._list.renderHandler=new Laya.Handler(e,e.updateList),e._list.array=CardPackageManager.instance.cards,e.onResize(null)})},a.prototype.updateBag=function(){var t=this;CardPackageManager.instance.testInitCards(function(){t._list.array=CardPackageManager.instance.cards})},a.prototype.onTouch=function(t){switch(t.currentTarget){case this._btnBack:this.removeSelf();break;case this._btnSortNormal:this.setList(0);break;case this._btnSortCamp:this.setList(1)}},a.prototype.setList=function(t){switch(this._sortType=t,this._sortType){case 0:this._list.array=CardPackageManager.instance.cards;break;case 1:this.setCamp()}},a.prototype.setCamp=function(){for(var t,a=CardPackageManager.instance.sortOnCampCards,e=1,n=0,s=0;s<a.length;)if(a[s].cfg.camp==e)n++,s++;else{e++,0!=(t=n%(this._columeCount+1))&&(t=this._columeCount+1-t),n=0;for(var i=0;i<t;i++,s++)a.splice(s,0,null)}this._list.array=a},a.prototype.updateList=function(t,a){t.updata()},a.prototype.onShowSellCards=function(t){SellCard.instance.show(this,t)},a.prototype.onResize=function(t){void 0===t&&(t=null),this.width=Laya.stage.width,this.height=Laya.stage.height,this._columeCount=Math.floor((this.width-190-196)/224),this._list.scrollBar.value=0,this._list.width=224*this._columeCount+196,this._list.x=this.width-this._list.width>>1,this.setList(this._sortType)},a}(ui.cardPackage.CardPackageUI);