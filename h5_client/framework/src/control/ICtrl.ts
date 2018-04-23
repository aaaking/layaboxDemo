/*
* @author seacole
* Ctrl接口
*/
interface ICtrl {
    start(loadData:any): void;   
    /**
     * 未创建场景时预调度
     */
    beforeShow(): void;
    /**
     * 进入场景调度
     */
    onShow(type:number): void;
    /**
     * 离开时调度
     */
    afterShow(): void;
} 