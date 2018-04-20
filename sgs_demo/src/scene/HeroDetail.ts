class HeroDetail extends Laya.View {
    skeleton: Laya.Skeleton
    templet: Laya.Templet
    constructor(sourceView: any, sourceX: number, sourceY: number) {
        super()
        var bg: Laya.Text = new Laya.Text()
        bg.alpha = 0.6
        bg.size(Laya.stage.width, Laya.stage.height)
        bg.bgColor = "#000000"
        this.addChild(bg)
        Laya.stage.addChild(this)
        this.templet = new Laya.Templet();
        this.templet.on(Laya.Event.COMPLETE, this, this.parseComplete);
        this.templet.on(Laya.Event.ERROR, this, this.onError);
        this.templet.loadAni("spine/119.sk");
    }
    parseComplete() {
        var x = 300
        var y = 250
        var skeletonI: Laya.Skeleton = this.templet.buildArmature(0);
        for (var animIndex = 0; animIndex < 1; animIndex++) {
            var row: number = Math.floor(animIndex / 6)
            var column = Math.floor(animIndex % 6)
            skeletonI.pos(x * 2, y * 2);
            skeletonI.showSkinByIndex(1);
            skeletonI.play("skill2", true);
            this.addChild(skeletonI)
        }
        for (var animIndex = 0; animIndex < this.templet.getAnimationCount(); animIndex++) {
            var txtView: Laya.Text = new Laya.Text()
            var txtStr = this.templet.getAniNameByIndex(animIndex)
            txtView.text = animIndex + ":" + txtStr
            txtView.fontSize = 25
            txtView.pos(20, 15 + animIndex * 35)
            txtView.color = "#ff0000"
            txtView.on("click", this, function (txtStrP: string) {
                skeletonI.stop()
                skeletonI.play(txtStrP, true);
            }, [txtStr])
            this.addChild(txtView)
        }
        // //创建第一个动画
        // var skeleton0: Laya.Skeleton;
        // //从动画模板创建动画播放对象
        // skeleton0 = this.templet.buildArmature(0);
        // skeleton0.pos(200, 700);
        // this.addChild(skeleton0);
        // //切换动画皮肤
        // // skeleton0.showSkinByIndex(1);
        // //播放
        // skeleton0.play(0, true);
        // //创建第二个动画
        // var skeleton1: Laya.Skeleton;
        // skeleton1 = this.templet.buildArmature(0);
        // skeleton1.pos(300, 700);
        // // skeleton1.showSkinByIndex(1);
        // skeleton1.play("skill2", true);
        // Laya.stage.addChild(skeleton1);
        // this.addChild(skeleton1);

        // this.skeletonI.on(Laya.Event.LABEL, this, this.onEvent);
        // this.skeletonI.on(Laya.Event.STOPPED, this, this.completeHandler);

        var backBtn: Laya.Text = new Laya.Text()
        backBtn.fontSize = 30
        backBtn.text = LangMgr.back
        backBtn.bold = true
        backBtn.color = "#ff0000"
        backBtn.pos(Laya.stage.width - 180, 10)
        backBtn.on("click", this, function () { this.removeSelf() })
        this.addChild(backBtn)
        // //test spine
        // var skeleton: Laya.Skeleton = new Laya.Skeleton();
        // Laya.stage.addChild(skeleton);
        // skeleton.pos(800, 1000);
        // var index = 0
        // skeleton.load("res/spine/119.sk", new Laya.Handler(this, function () {
        //     // for (var index = 0; index < skeleton.getAnimNum(); index++) {
        //     // }
        //     skeleton.play("skill2", false, false, 0, 3000, true)
        //     skeleton.on(Laya.Event.COMPLETE, this, function () {
        //         index++
        //         if (index >= skeleton.getAnimNum()) {
        //             index = 0
        //         }
        //         console.log("skeleton.on(Laya.Event.COMPLETE")
        //         // skeleton.play(index, false, true)
        //     })
        //     // skeleton.play(2, true, true)
        //     // console.log("skeleton.numChildren: " + skeleton.numChildren + "  skeleton.getAnimNum:" + skeleton.getAnimNum())
        // }));//通过加载直接创建动画
    }

    // private completeHandler(): void {
    //     this.play();
    // }
    // private play(): void {
    //     this.mCurrIndex++;
    //     if (this.mCurrIndex >= this.skeletonI.getAnimNum()) {
    //         return
    //         // this.mCurrIndex = 0;
    //     }
    //     this.skeletonI.play(this.mCurrIndex, false);
    // }
    // private onEvent(e): void {
    //     // var tEventData: EventData = e as EventData;
    //     // Laya.stage.addChild(this.mLabelSprite);
    //     // this.mLabelSprite.x = this.mStartX;
    //     // this.mLabelSprite.y = this.mStartY;
    //     // this.mLabelSprite.graphics.clear();
    //     // this.mLabelSprite.graphics.fillText(tEventData.name, 0, 0, "20px Arial", "#ff0000", "center");
    //     // Laya.Tween.to(this.mLabelSprite, { y: this.mStartY - 200 }, 1000, null, Handler.create(this, this.playEnd))
    //     console.log(e)
    //     alert(e)
    // }

    // private playEnd(): void {
    // }

    onError() {
        console.log("hero detail parse error");
    }
    //销毁spine销毁骨骼动画
    // public function destroy():void {
    //     mArmature.stop();//停止龙骨动画播放
    //     removeEvent();//移除事件
    //     mArmature.removeSelf();//从显示列表移除龙骨动画本身
    //     mArmature.removeChildren();//从显示列表移除龙骨动画子对象
    //     mArmature.destroy(true);//从显存销毁龙骨动画及其子对象
    //     mFactory.destroy();//释放动画模板类下的纹理数据
    //     mFactory.releaseResource(true);//释放龙骨资源
    // }
    // public function removeEvent(): void {
    //     mFactory.off(Event.COMPLETE, this, parseComplete);
    //     mArmature.off(Event.STOPPED, this, completeHandler);
    // }
}