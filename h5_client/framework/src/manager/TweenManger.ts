/*
* 缓动管理类;
*/
class TweenManger{
    constructor(){

    }
    /**
     * 对一堆要进行缓动的数组进行操作[{target:*,data:{scaleX:*.....},duraTion:1000,ease:*,call:{caller:this,handler:**},delay}]
     */
    public static TweenTO(arr:Array<any>)
    {
        var i:number = 0;
        var len:number = arr.length;
        for(;i<len;i++)
        {
            var ob:any = arr[i];

             if(!ob.hasOwnProperty('ease'))
            {
                ob.ease = null;
            }
            if(!ob.hasOwnProperty('delay'))
            {
                ob.delay = 0;
            }

            if(ob.hasOwnProperty('call'))
            {
                Laya.Tween.to(ob.target,ob.data,ob.duraTion,ob.ease,new Laya.Handler(ob.call.caller,ob.handler),ob.delay,true);
            }
            else
            {
                Laya.Tween.to(ob.target,ob.data,ob.duraTion,ob.ease,null,ob.delay,true);
            }

            
        }
    }
}