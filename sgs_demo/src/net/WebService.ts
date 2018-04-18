/*
 * @author seacole
* WebService;
*/
class WebService {
    constructor() {

    }
    uuid: string;

    /**
	 * 调用API
	 * @param module
	 * @param action
	 * @param callback
	 * @param params
	 * @param method
	 */
    callApi(module: string, action: string, callback: Function = null, params: any = null, method: string = 'post', header: any[] = []): void {
        if (!params) {
            params = {};
        }
       
        // let url: string = GameConfig.WEB_SERVICE_URL + '/' + module + '/' + action;
        // let m: Function = method == 'post' ? Ajax.POST : Ajax.GET;
        // let uid: string = GameLogic.userData.getItem('uid');
        // let token: string = GameLogic.userData.getItem('token');
        // if (uid)
        //     header.push("uid", uid);
        // if (token)
        //     header.push("tk", token);
        // header.push("os", Native.instance.OS);
        // m.call(Ajax, url, params, (content: any) => {
        //     log('get:' + content);
        //     if (callback) {
        //         let response: any = JSON.parse(content);
        //         if (response && response.hasOwnProperty("code") && response.code == 401) {
        //             console.warn("401");
        //             Dispatcher.dispatch(EventNames.UNAUTHORIZED);
        //         }
        //         else
        //             callback(response);
        //     }
        // }, null, header);
    }


    regist(uname: string, upwd: string, nickname: string, callback: Function): void {
        this.callApi('user', 'reg', (response) => {
            callback(response);
        }, { uname, upwd, nickname });
    }


  
}
var webService = new WebService();