/*
* @author seacole
* ClubWebService;
*/
class ClubWebService extends WebService {
	constructor() {
		super();
	}

	// match_router: post("/create", club_create)
	// match_router: post("/delete", club_delete)
	// match_router: post("/join", club_join)
	// match_router: post("/quit", club_quit)
	// match_router: post("/kick", club_kick)
	// match_router: post("/members", club_members)
	// match_router: post("/list", club_clublist)
	// match_router: post("/gamelist", club_gamelist)
	// match_router: post("/resultlist", club_resultlist)
	// match_router: post("/search", club_search)
	// match_router: post("/setpaytype", club_paytype)
	// match_router: post("/info", club_info)
	// match_router: post("/rename", club_rename)

	/**
	 * 创建俱乐部
	 */
	public createClub(title: string, callback: any): void {
		LoadingUI.instance.show(LoadingUI.TYPE_NO_BG_DELAY, null, null, null, 5000);
		this.startDelayCall();
		this.callApi('club', 'create', (response) => {
			LoadingUI.instance.hide();
			this.clearDelayCall();
			callback(response);
		}, { title });
	}

	/**
	 * 搜索俱乐部
	 */
	public searchClub(cid: number, callback: any): void {
		LoadingUI.instance.show(LoadingUI.TYPE_NO_BG_DELAY, null, null, null, 5000);
		this.startDelayCall();
		this.callApi('club', 'search', (response) => {
			LoadingUI.instance.hide();
			this.clearDelayCall();
			callback(response);
		}, { cid });
	}

	/**
	 * 加入俱乐部
	 */
	public joinClub(cid: number, callback: any): void {
		LoadingUI.instance.show(LoadingUI.TYPE_NO_BG_DELAY, null, null, null, 5000);
		this.startDelayCall();
		this.callApi('club', 'join', (response) => {
			LoadingUI.instance.hide();
			this.clearDelayCall();
			callback(response);
		}, { cid });
	}

	/**
	 * 加入俱乐部
	 */
	public getMyClub(callback: any): void {
		LoadingUI.instance.show(LoadingUI.TYPE_NO_BG_DELAY, null, null, null, 5000);
		this.startDelayCall();
		this.callApi('club', 'list', (response) => {
			LoadingUI.instance.hide();
			this.clearDelayCall();
			callback(response);
		}, {});
	}

	/**
	 * 获取游戏列表
	 */
	public getGameList(cid: number, page: number, callback: any): void {
		LoadingUI.instance.show(LoadingUI.TYPE_NO_BG_DELAY, null, null, null, 5000);
		this.startDelayCall();
		this.callApi('club', 'gamelist', (response) => {
			LoadingUI.instance.hide();
			this.clearDelayCall();
			callback(response);
		}, { cid, page });
	}

	/**
	 * 获取战绩列表
	 */
	public getResultList(cid: number, page: number, callback: any): void {
		this.callApi('club', 'resultlist', (response) => {
			callback(response);
		}, { cid, page });
	}

	/**
	 * 获取俱乐部信息 钻石数量，开房支付方式
	 */
	public getClubInfo(cid: number, callback: any): void {
		this.callApi('club', 'info', (response) => {
			callback(response);
		}, { cid });
	}

	/**
	 * 获取成员列表
	 */
	public getMembersList(cid: number, page: number, callback: any): void {
		this.callApi('club', 'members', (response) => {
			callback(response);
		}, { cid, page });
	}

	/**
	 * 修改俱乐部名字
	 */
	public renameClub(cid: number, title: string, callback: any): void {
		LoadingUI.instance.show(LoadingUI.TYPE_NO_BG_DELAY, null, null, null, 5000);
		this.startDelayCall();
		this.callApi('club', 'rename', (response) => {
			LoadingUI.instance.hide();
			this.clearDelayCall();
			callback(response);
		}, { cid, title });
	}

	/**
	 * 退出俱乐部
	 */
	public quitClub(cid: number, callback: any): void {
		LoadingUI.instance.show(LoadingUI.TYPE_NO_BG_DELAY, null, null, null, 5000);
		this.startDelayCall();
		this.callApi('club', 'quit', (response) => {
			LoadingUI.instance.hide();
			this.clearDelayCall();
			callback(response);
		}, { cid });
	}

	/**
	 * 修改俱乐部支付方式
	 */
	public setClubPaytype(cid: number, paytype: number, callback: any): void {
		this.callApi('club', 'setpaytype', (response) => {
			callback(response);
		}, { cid, paytype });
	}

	/**
	 * 解散俱乐部
	 */
	public deleteClub(cid: number, callback: any): void {
		LoadingUI.instance.show(LoadingUI.TYPE_NO_BG_DELAY, null, null, null, 5000);
		this.startDelayCall();
		this.callApi('club', 'delete', (response) => {
			LoadingUI.instance.hide();
			this.clearDelayCall();
			callback(response);
		}, { cid });
	}

	/**
	 * 俱乐部踢人
	 */
	public kick(cid: number, uid: number, callback: any): void {
		LoadingUI.instance.show(LoadingUI.TYPE_NO_BG_DELAY, null, null, null, 5000);
		this.startDelayCall();
		this.callApi('club', 'kick', (response) => {
			LoadingUI.instance.hide();
			this.clearDelayCall();
			callback(response);
		}, { cid, uid });
	}

	/**
	 * 俱乐部充值
	 */
	public clubRecharge(cid: number, cnt: number, callback: any): void {
		LoadingUI.instance.show(LoadingUI.TYPE_NO_BG_DELAY, null, null, null, 5000);
		this.startDelayCall();
		this.callApi('club', 'recharge', (response) => {
			LoadingUI.instance.hide();
			this.clearDelayCall();
			callback(response);
		}, { cid, cnt });
	}

}
var clubWebService = new ClubWebService();
