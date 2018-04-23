/*
* @author seacole
* 事件表;
*/
class EventNames {
    constructor() {

    }

    public static REMOVE_EFFECT: string = "REMOVE_EFFECT";
    public static REMOVE_EFFECT_BY_ID: string = "REMOVE_EFFECT_BY_ID";
    public static REMOVE_EFFECT_BY_INDEX: string = "REMOVE_EFFECT_BY_INDEX";
    public static REMOVE_FONT: string = "REMOVE_FONT";
    public static REMOVE_MASK: string = "REMOVE_MASK";
    public static REMOVE_LINE_RENDERER: string = "REMOVE_LINE_RENDERER";

    public static UNAUTHORIZED: string = "unauthorized";
    public static CONNECT_SERVER: string = "CONNECT_SERVER";
    public static SERVER_ERROR: string = "SERVER_ERROR";
    public static SHOW_DISCONNECT: string = "SHOW_DISCONNECT";
    public static UPDATE_GOLD: string = "REFRESH_GOLD";//同步玩家金币
    public static REFRESH_GOLD: string = "REFRESH_GOLD";//游戏中的同步金币
    public static ALERT_CHECK: string = "ALERT_CHECK";
    public static ENTER_GAME: string = "ENTER_GAME";
    public static PLAYER_DATA_CHANGED: string = "PLAYER_DATA_CHANGED";
    public static REFRESH_ROLE_INFO: string = "REFRESH_ROLE_INFO";
    public static BACK_TO_LOGIN: string = "BACK_TO_LOGIN";
    public static POKER_SELECTED_CHANGE: string = "POKER_SELECTED_CHANGE";
    public static POKER_OVER_CHANGE: string = "POKER_OVER_CHANGE";
    public static TIME_CHANGE: string = "TIME_CHANGE";
    public static PING_CHANGE: string = "PING_CHANGE";
    public static PLAY_RECORD: string = "PLAY_RECORD";
    public static PLAY_RECORD_END: string = "PLAY_RECORD_END";
    public static KEYBOARD_NUM: string = "KEYBOARD_NUM";
    public static CHECK_READY: string = "CHECK_READY";
    public static HIDE_RULE: string = "HIDE_RULE";
    public static MENU_CHECK: string = "MENU_CHECK";
    public static MENU_TOUCH: string = "MENU_TOUCH";
    public static REALTIME_MIC: string = "REALTIME_MIC_ON";
    public static REALTIME_SPEAKER: string = "REALTIME_SPEAKER";
    public static BATTERY_CHANGE: string = "BATTERY_CHANGE";
    public static VOICE_CHANGE: string = "VOICE_CHANGE";
    public static SHOP_CFG_GET: string = "SHOP_CFG_GET";
    public static MATCH_LIST_CHANGE: string = "MATCH_LIST_CHANGE";
    public static MATCH_RULE_CHANGE: string = "MATCH_RULE_CHANGE";
    public static MATCH_CREATE_TIME_CHANGE: string = "MATCH_CREATE_TIME_CHANGE";
    public static MATCH_NEW_LIST: string = "MATCH_NEW_LIST";
    public static MATCH_START_WARN: string = "MATCH_START_WARN";
    public static UPDATE_MY_CLUB_LIST: string = "UPDATE_MY_CLUB_LIST";
    public static CLUB_CREATE_SUCC: string = "CLUB_CREATE_SUCC";
    public static CLUB_JOIN_SUCC: string = "CLUB_JOIN_SUCC";
    public static CLUB_SEARCH_SUCC: string = "CLUB_SEARCH_SUCC";
    public static UPDATE_MY_CLUB_GAMES_LIST: string = "UPDATE_MY_CLUB_GAMES_LIST";
    public static UPDATE_MY_CLUB_RESULTS_LIST: string = "UPDATE_MY_CLUB_RESULTS_LIST";
    public static UPDATE_MY_CLUB_MEMBERS_LIST: string = "UPDATE_MY_CLUB_MEMBERS_LIST";
    public static UPDATE_MY_CLUB_DIAMOND: string = "UPDATE_MY_CLUB_DIAMOND";
    public static CLUB_RENAME_SUCC: string = "CLUB_RENAME_SUCC";
    public static CLUB_QUIT_SUCC: string = "CLUB_QUIT_SUCC";
    public static CLUB_DELETE_SUCC: string = "CLUB_DELETE_SUCC";
    public static CLUB_PAY_TYPE_CHANGE: string = "CLUB_PAY_TYPE_CHANGE";
    public static CLUB_KICK_OUT_SUCC: string = "CLUB_KICK_OUT_SUCC";
    public static CLUB_RECHARGE_SUCC: string = "CLUB_RECHARGE_SUCC";
    public static CREATE_MATCH_SUCC: string = "CREATE_MATCH_SUCC";
    public static CREATE_ROOM_SUCC: string = "CREATE_ROOM_SUCC";

    public static PRELOADING_FINISH: string = "PRELOADING_FINISH";


    public static GAME_HEARTBEAT_NTF: string = 'game.HeartbeatNtf';
    public static GAME_JOIN_TABLE_REQ: string = 'game.JoinTableReq';
    public static GAME_JOIN_TABLE_REP: string = 'game.JoinTableRep';


    public static GAME_SITDOWN_REQ: string = 'game.SitdownReq';
    public static GAME_SITDOWN_REP: string = 'game.SitdownRep';
    public static GAME_SITDOWN_NTF: string = 'game.SitdownNtf';
    public static GAME_STANDUP_REQ: string = 'game.StandupReq';
    public static GAME_STANDUP_REP: string = 'game.StandupRep';
    public static GAME_STANDUP_NTF: string = 'game.StandupNtf';
    public static GAME_START_TABLE_REQ: string = 'game.StartTableReq';
    public static GAME_START_TABLE_REP: string = 'game.StartTableRep';
    public static GAME_START_TABLE_NTF: string = 'game.StartTableNtf';
    public static GAME_TABLE_END_REQ: string = 'game.TableEndReq';
    public static GAME_TABLE_WILL_END_NTF: string = 'game.TableWillEndNtf';
    public static GAME_PLAYER_READY_REQ: string = 'game.PlayerReadyReq';
    public static GAME_PLAYER_READY_REP: string = 'game.PlayerReadyRep';
    public static GAME_PLAYER_READY_NTF: string = 'game.PlayerReadyNtf';
    public static GAME_EMOTICON_REQ: string = 'game.EmoticonReq';
    public static GAME_EMOTICON_NTF: string = 'game.EmoticonNtf';
    public static GAME_USE_GOODS_REQ: string = 'game.UseGoodsReq';
    public static GAME_USE_GOODS_REP: string = 'game.UseGoodsRep';
    public static GAME_USE_GOODS_NTF: string = 'game.UseGoodsNtf';
    public static GAME_TABLE_INFO_NTF: string = 'game.TableInfoNtf';
    public static GAME_PLAYER_OPT_NTF: string = 'game.PlayerOptNtf';
    public static GAME_PLAYER_OPT_REQ: string = 'game.PlayerOptReq';
    public static GAME_PLAYER_OPT_REP: string = 'game.PlayerOptRep';
    public static GAME_CARD_MOVE_NTF: string = 'game.CardMoveNtf';
    public static GAME_GAME_START_NTF: string = 'game.GameStartNtf';
    public static GAME_GAME_END_NTF: string = 'game.GameEndNtf';
    public static GAME_SHOW_CARDS_NTF: string = 'game.ShowCardsNtf';
    public static GAME_REAL_TIME_RECORD_REQ: string = 'game.RealTimeRecordReq';
    public static GAME_REAL_TIME_RECORD_REP: string = 'game.RealTimeRecordRep';
    public static GAME_TABLE_END_NTF: string = 'game.TableEndNtf';
    public static GAME_PLAYER_TABLE_STATUS_REQ: string = 'game.PlayerTableStatusReq';
    public static GAME_PlAYER_TABLE_STATUS_NTF: string = 'game.PlayerTableStatusNtf';
    public static GAME_OFFLINE_NTF: string = 'game.OfflineNtf';
    public static GAME_RECONNECT_INFO: string = 'game.ReconnectInfo';
    public static GAME_SHOW_INFO_NTF: string = 'game.ShowInfoNtf';
    public static GAME_PLAYER_CHAT_REQ: string = 'game.PlayerChatReq';
    public static GAME_PLAYER_CHAT_NTF: string = 'game.PlayerChatNtf';
    public static GAME_SET_DECK_CARDS: string = 'game.SetDeckCards';
    public static GAME_UPLOAD_INFO_REQ: string = 'game.UploadInfoReq';
    public static GAME_DETAIL_NTF: string = 'game.DetailNtf';
    public static GAME_USER_INFO_REQ: string = 'game.UserInfoReq';
    public static GAME_USER_INFO_REP: string = 'game.UserInfoRep';
    public static GAME_VOTE_REQ: string = 'game.VoteReq';
    public static GAME_VOTE_REP: string = 'game.VoteRep';
    public static GAME_VOTE_NTF: string = 'game.VoteNtf';
    public static GAME_HISTORY_REQ: string = 'game.HistoryReq';
    public static GAME_TABLE_DATA_REQ: string = 'game.TableDataReq';
    public static GAME_TABLE_DATA_NTF: string = 'game.TableDataNtf';
    public static GAME_MATCH_HALL_STATUS_REQ: string = 'game.MatchHallStatusReq';
    public static GAME_MATCH_HALL_STATUS_REP: string = 'game.MatchHallStatusRep';
    public static GAME_MATCH_HALL_WILL_START_NTF: string = 'game.MatchHallWillStartNtf';
    public static GAME_MATCH_HALL_START_NTF: string = 'game.MatchHallStartNtf';
    public static GAME_MATCH_HALL_USER_LIST_REQ: string = 'game.MatchHallUserListReq';
    public static GAME_MATCH_HALL_USER_LIST_REP: string = 'game.MatchHallUserListRep';
    public static GAME_MATCH_HALL_SIGNIN_NTF: string = 'game.MatchHallSigninNtf';
    public static GAME_MATCH_HALL_STATUS_NTF: string = 'game.MatchHallStatusNtf';
    public static GAME_MATCH_SIGNUP_REQ: string = 'game.MatchSignupReq';
    public static GAME_MATCH_SIGNUP_REP: string = 'game.MatchSignupRep';
    public static GAME_MATCH_SIGNOUT_REQ: string = 'game.MatchSignoutReq';
    public static GAME_MATCH_SIGNOUT_REP: string = 'game.MatchSignoutRep';
    public static GAME_MATCH_REWARD_LIST_REQ: string = 'game.MatchRewardListReq';
    public static GAME_MATCH_REWARD_LIST_REP: string = 'game.MatchRewardListRep';



    public static MATCH_JOIN: string = 'game.MatchJoinReq'
    public static MATCH_START: string = 'game.MatchStartNtf'
    public static MATCH_INFO: string = 'game.MatchInfoNtf'
    public static MATCH_RANK: string = 'game.MatchUpdateRankNtf'
    public static MATCH_KICK_OUT: string = 'game.MatchKickOutNtf'
    public static MATCH_OVER: string = 'game.MatchOverNtf'
    public static MATCH_RECORD_REQ: string = 'game.MatchRecordReq'
    public static PLAYER_BACK_REQ: string = "game.PlayerBackReq"
    public static MATCH_RECORD_REP: string = 'game.MatchRecordRep'
    public static MATCH_MSG_INFO: string = 'game.MsgMatchInfoNtf'
    public static MATCH_SCORE_NTF: string = "game.MatchBaseScoreNtf"


    public static FONT_BITMMAP: string = 'font.Bitmap';
}