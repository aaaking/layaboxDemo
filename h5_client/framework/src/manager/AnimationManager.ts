class AnimationManager{
   private static STATE_IDLE = 1
   private static STATE_BUSY = 2
   private state:Number
   private animation_queue_:Array<any> = []


    constructor() {
        this.animation_queue_ = []
	    this.state = AnimationManager.STATE_IDLE
    }

    private static _instance: AnimationManager;
    public static get instance(): AnimationManager {
        if (!this._instance) {
            this._instance = new AnimationManager();
        }
        return this._instance;
    }


 

    public animationOver(){
        var animation = this.animation_queue_[0]
        if (!animation){
            this.state = AnimationManager.STATE_IDLE
            return
        }
        this.animation_queue_.shift()
        this.checkQueue()
    }

    private clearQueue(){
        for (var k in this.animation_queue_){
            let animation = this.animation_queue_[k]
            animation = null
        }
        this.animation_queue_ = []
    }

    public endAnimations(){
        if (this.state == AnimationManager.STATE_IDLE){
            return
        }


        let animation = this.animation_queue_[0]
        if (!animation){
            this.state = AnimationManager.STATE_IDLE
            return
        }

        if (animation.clearFunc){
            animation.clearFunc()
        }

        this.clearQueue()
        this.state = AnimationManager.STATE_IDLE

    }

    //动画的方法和清除方法
    public addAnimation(animFunc, clearFunc){
        let animation = {animFunc : animFunc, clearFunc : clearFunc}
        this.animation_queue_.push(animation)
        if (this.state == AnimationManager.STATE_BUSY){
            return
        }
        this.checkQueue()
    }

    private checkQueue(){
        let animation = this.animation_queue_[0]
        if (!animation){
            this.state = AnimationManager.STATE_IDLE
            return
        }
        this.state = AnimationManager.STATE_BUSY

        animation.animFunc()
    }


}