/*
* @author seacole
* MatchSignService;
*/
class MatchSignService extends WebService {
    constructor() {
        super();
    }


    /**
     * 创建比赛
     */
    createMatch(cid:number,type: string, name: string, hand_cnt: string, max_player: string, info: string, matchrule: string, callback: any): void {
        this.startDelayCall();
        LoadingUI.instance.show(LoadingUI.TYPE_NO_BG_DELAY, null, null, null, 5000);
        this.callApi('match', 'create', (response) => {
            this.clearDelayCall();
            LoadingUI.instance.hide();
            if (callback)
                callback(response);
        }, {cid, type, name, hand_cnt, max_player, info, matchrule });
    }

    /**
     * 
     * @param gid 
     * @param matchtype 1官方赛 2个人赛 
     * @param callback 
     */
    getMatchList(callback: any): void {
        LoadingUI.instance.show(LoadingUI.TYPE_NO_BG_DELAY, null, null, null, 5000);
        this.callApi('match', 'list', (response) => {
            LoadingUI.instance.hide();
            if (callback)
                callback(response);
        }, {});
    }

    getMatchStatus(list: Array<number>, callback: any): void {
        // LoadingUI.instance.show(LoadingUI.TYPE_NO_BG_DELAY, null, null, null, 5000);
        this.callApi('match', 'status', (response) => {
            // LoadingUI.instance.hide();
            if (callback)
                callback(response);
        }, { list });
    }

    matchSignin(code: number, callback: any): void {
        this.startDelayCall();
        LoadingUI.instance.show(LoadingUI.TYPE_NO_BG_DELAY, null, null, null, 5000);
        this.callApi('match', 'signin', (response) => {
            this.clearDelayCall();
            LoadingUI.instance.hide();
            if (callback)
                callback(response);
        }, { code });
    }

    matchSignout(code: number, callback: any): void {
        this.startDelayCall();
        LoadingUI.instance.show(LoadingUI.TYPE_NO_BG_DELAY, null, null, null, 5000);
        this.callApi('match', 'signout', (response) => {
            this.clearDelayCall();
            LoadingUI.instance.hide();
            if (callback)
                callback(response);
        }, { code });
    }
}
var matchSignService = new MatchSignService();