/*
* name;
*/
class ProtoIDs {
	public static _protoIDs = {};

	constructor() {
	}

	static init(): void {
		let _ID_GAME = 500;
		let _ID_MATCH = 2000;
		let protoIDs = {};



		protoIDs["game.HeartbeatNtf"] = 100;
		protoIDs["game.JoinTableReq"] = 101;
		protoIDs["game.JoinTableRep"] = 102;

		protoIDs["game.SitdownReq"] = _ID_GAME + 1;
		protoIDs["game.SitdownRep"] = _ID_GAME + 2;
		protoIDs["game.SitdownNtf"] = _ID_GAME + 3;
		protoIDs["game.StandupReq"] = _ID_GAME + 4;
		protoIDs["game.StandupRep"] = _ID_GAME + 5;
		protoIDs["game.StandupNtf"] = _ID_GAME + 6;
		protoIDs["game.StartTableReq"] = _ID_GAME + 7;
		protoIDs["game.StartTableRep"] = _ID_GAME + 8;
		protoIDs["game.StartTableNtf"] = _ID_GAME + 9;
		protoIDs["game.TableEndReq"] = _ID_GAME + 10;
		protoIDs["game.TableWillEndNtf"] = _ID_GAME + 11;
		protoIDs["game.PlayerReadyReq"] = _ID_GAME + 12;
		protoIDs["game.PlayerReadyRep"] = _ID_GAME + 13;
		protoIDs["game.PlayerReadyNtf"] = _ID_GAME + 14;
		protoIDs["game.EmoticonReq"] = _ID_GAME + 15;
		protoIDs["game.EmoticonNtf"] = _ID_GAME + 16;
		protoIDs["game.UseGoodsReq"] = _ID_GAME + 17;
		protoIDs["game.UseGoodsRep"] = _ID_GAME + 18;
		protoIDs["game.UseGoodsNtf"] = _ID_GAME + 19;
		protoIDs["game.TableInfoNtf"] = _ID_GAME + 20;
		protoIDs["game.PlayerOptNtf"] = _ID_GAME + 21;
		protoIDs["game.PlayerOptReq"] = _ID_GAME + 22;
		protoIDs["game.PlayerOptRep"] = _ID_GAME + 23;
		protoIDs["game.CardMoveNtf"] = _ID_GAME + 24;
		protoIDs["game.ReconnectInfo"] = _ID_GAME + 25;
		protoIDs["game.GameStartNtf"] = _ID_GAME + 26;
		protoIDs["game.GameEndNtf"] = _ID_GAME + 27;
		protoIDs["game.ShowCardsNtf"] = _ID_GAME + 28;
		protoIDs["game.RealTimeRecordReq"] = _ID_GAME + 29;
		protoIDs["game.RealTimeRecordRep"] = _ID_GAME + 30;
		protoIDs["game.TableEndNtf"] = _ID_GAME + 31;
		protoIDs["game.PlayerTableStatusReq"] = _ID_GAME + 32;
		protoIDs["game.PlayerTableStatusNtf"] = _ID_GAME + 33;
		protoIDs["game.ShowInfoNtf"] = _ID_GAME + 34;
		protoIDs["game.PlayerChatReq"] = _ID_GAME + 35;
		protoIDs["game.PlayerChatNtf"] = _ID_GAME + 36;
		protoIDs["game.SetDeckCards"] = _ID_GAME + 37;
		protoIDs["game.DetailNtf"] = _ID_GAME + 38;
		protoIDs["game.UploadInfoReq"] = _ID_GAME + 39;
		protoIDs["game.UserInfoReq"] = _ID_GAME + 40;
		protoIDs["game.UserInfoRep"] = _ID_GAME + 41;
		protoIDs["game.VoteReq"] = _ID_GAME + 42;
		protoIDs["game.VoteRep"] = _ID_GAME + 43;
		protoIDs["game.VoteNtf"] = _ID_GAME + 44;
		protoIDs["game.HistoryReq"] = _ID_GAME + 45;
		protoIDs["game.TableDataReq"] = _ID_GAME + 46;
		protoIDs["game.TableDataNtf"] = _ID_GAME + 47;
		protoIDs["game.PlayerBackReq"] = _ID_GAME + 48,




		//===========================MATCH
		protoIDs["game.MatchSignupReq"] = _ID_MATCH + 1;
		protoIDs["game.MatchSignupRep"] = _ID_MATCH + 2;
		protoIDs["game.MatchSignoutReq"] = _ID_MATCH + 3;
		protoIDs["game.MatchSignoutRep"] = _ID_MATCH + 4;
		protoIDs["game.MatchStartNtf"] = _ID_MATCH + 5;
		protoIDs["game.MatchInfoNtf"] = _ID_MATCH + 6;
		protoIDs["game.MatchUpdateRankNtf"] = _ID_MATCH + 7;
		protoIDs["game.MatchKickOutNtf"] = _ID_MATCH + 8;
		protoIDs["game.MatchOverNtf"] = _ID_MATCH + 9;
		protoIDs["game.MatchRecordReq"] = _ID_MATCH + 10;
		protoIDs["game.MatchRecordRep"] = _ID_MATCH + 11;
		protoIDs["game.MsgMatchInfoNtf"] = _ID_MATCH + 12;
		protoIDs["game.MatchBaseScoreNtf"] = _ID_MATCH + 13;
		protoIDs["game.MatchJoinReq"] = _ID_MATCH + 14;
		protoIDs["game.MatchHallStatusReq"] = _ID_MATCH + 15;
		protoIDs["game.MatchHallStatusRep"] = _ID_MATCH + 16;
		protoIDs["game.MatchHallStartNtf"] = _ID_MATCH + 17;
		protoIDs["game.MatchHallWillStartNtf"] = _ID_MATCH + 18;
		protoIDs["game.MatchHallUserListReq"] = _ID_MATCH + 19;
		protoIDs["game.MatchHallUserListRep"] = _ID_MATCH + 20;
		protoIDs["game.MatchHallSigninNtf"] = _ID_MATCH + 21;
		protoIDs["game.MatchHallStatusNtf"] = _ID_MATCH + 22;
		protoIDs["game.MatchRewardListReq"]    = _ID_MATCH + 23;
		protoIDs["game.MatchRewardListRep"]    = _ID_MATCH + 24;



		for (var key in protoIDs) {
			ProtoIDs._protoIDs[key] = protoIDs[key];
			ProtoIDs._protoIDs[protoIDs[key]] = key;
		}

		// for (var key in ProtoIDs._protoIDs) {
		//     log(key + " = " + ProtoIDs._protoIDs[key])
		// }
	}
}