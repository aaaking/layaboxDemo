/*
* @author seacole
* 比赛列表Renderer;
*/
module matchSign {
    export class MatchSignMatchListRenderer extends ui.matchSign.MatchSignMatchListRendererUI {
        constructor() {
            super();
        }

        //  matchmode, title, cost, playercnt, starttime
        public updata(): void {
            if (this.dataSource) {
                this._btnSign.on(Laya.Event.CLICK, this, this.onTouch);
                this._btnCancelSign.on(Laya.Event.CLICK, this, this.onTouch);
                this._btnReturnMatch.on(Laya.Event.CLICK, this, this.onTouch);
                this.stopTimer();
                this._imgIcon.skin = "res/gameIcon/gameIcon_" + this.dataSource.gtype + ".png";
                this._imgIcon2.skin = "res/gameIcon/gameIcon_match_" + this.dataSource.gtype + ".png";
                var matchrule: any = this.dataSource.mrule;
                this._labTitle.text = matchrule.title;
                if (Number(matchrule.cost) == 0) {
                    this._labCost.text = "";
                    this._labFree.visible = true;
                    this._imgDiamond.visible = false;
                }
                else {
                    this._labCost.text = matchrule.cost;
                    this._labFree.visible = false;
                    this._imgDiamond.visible = true;
                }

                //管理按钮
                if (this.dataSource.hasOwnProperty("status")) {
                    var isSignin: boolean;
                    if (this.dataSource.hasOwnProperty("signin"))
                        isSignin = Number(this.dataSource.signin) != 0;
                    else
                        isSignin = false;
                    if (MatchConfig.isMatchStart(this.dataSource.status)) {
                        this._btnReturnMatch.visible = isSignin;
                        this._imgAlreadyStart.visible = !isSignin;
                        this._btnSign.visible = false;
                        this._btnCancelSign.visible = false;

                    }
                    else {
                        this._btnSign.visible = !isSignin;
                        this._btnCancelSign.visible = isSignin;
                        this._btnReturnMatch.visible = false;
                        this._imgAlreadyStart.visible = false;
                    }
                }
                else {
                    this._btnSign.visible = false;
                    this._btnCancelSign.visible = false;
                    this._btnReturnMatch.visible = false;
                    this._imgAlreadyStart.visible = false;
                }

                if (MatchConfig.isModeTime(matchrule.matchmode)) {
                    this._boxMember.visible = true;
                    this._labMemberCount.text = this.dataSource.cnt ? this.dataSource.cnt : 0;
                    var now: number = server.serverTime ? server.serverTime * 1000 : new Date().getTime();
                    var starttime = Number(matchrule.starttime) * 1000;
                    var leftTime: number = starttime - now;
                    var d: Date = new Date(starttime);
                    //未开赛 
                    // if (leftTime > 0) {
                    // 距离开赛时间30分钟以内
                    if (leftTime > 0 && leftTime < (30 * 60 * 1000)) {
                        this._imgLeftTimeBack.visible = true;
                        this.startTimer();
                        this._labInfo.text = "";
                    }
                    else {
                        this._imgLeftTimeBack.visible = false;
                        this._labLeftTime.text = "";
                        if (leftTime < 0 && !MatchConfig.isMatchStart(this.dataSource.status))
                            this._labInfo.text = this._labInfo.text = StringUtils.format(GameConfig.language.matchsign_member_count, matchrule.min_player ? matchrule.min_player : 0);
                        else {
                            var hour: number = d.getHours();
                            var min: number = d.getMinutes();
                            if (TimeUtils.isToday(starttime, now))
                                this._labInfo.text = StringUtils.format(GameConfig.language.matchsign_start_time_2, hour < 10 ? "0" + hour : hour, min < 10 ? "0" + min : min);
                            else if (TimeUtils.isTomorrow(starttime, now))
                                this._labInfo.text = StringUtils.format(GameConfig.language.matchsign_start_time_3, hour < 10 ? "0" + hour : hour, min < 10 ? "0" + min : min);
                            else
                                this._labInfo.text = StringUtils.format(GameConfig.language.matchsign_start_time, "", d.getMonth() + 1, d.getDate(), hour < 10 ? "0" + hour : hour, min < 10 ? "0" + min : min);
                        }
                    }
                    // }
                    // else {
                    //     this._imgLeftTimeBack.visible = false;
                    //     this._labLeftTime.text = "";
                    //     var hour: number = d.getHours();
                    //     var min: number = d.getMinutes();
                    //     this._labInfo.text = StringUtils.format(GameConfig.language.matchsign_start_time, "", d.getMonth() + 1, d.getDate(), hour < 10 ? "0" + hour : hour, min < 10 ? "0" + min : min);
                    // }
                }
                else {
                    this._boxMember.visible = true;
                    this._imgLeftTimeBack.visible = false;
                    this._labLeftTime.text = "";
                    this._labInfo.text = StringUtils.format(GameConfig.language.matchsign_member_count, matchrule.playercnt);
                    this._labMemberCount.text = this.dataSource.cnt ? this.dataSource.cnt : 0;
                }
            }
        }

        private startTimer(): void {

            Laya.timer.loop(1000, this, this.onTimer);
            this.onTimer();
        }

        public stopTimer(): void {
            // this._btnSign.off(Laya.Event.CLICK, this, this.onTouch);
            // this._btnCancelSign.off(Laya.Event.CLICK, this, this.onTouch);
            // this._btnReturnMatch.off(Laya.Event.CLICK, this, this.onTouch);
            Laya.timer.clear(this, this.onTimer);
        }

        private onTimer(): void {
            if (this.dataSource) {
                var now: number = server.serverTime ? server.serverTime * 1000 : new Date().getTime();
                if (this.dataSource.mrule.starttime * 1000 > now)
                    this._labLeftTime.text = StringUtils.format(GameConfig.language.left_time, TimeUtils.timeFormat(this.dataSource.mrule.starttime - Math.floor(now * 0.001)));
                else {
                    this.stopTimer();
                    Laya.timer.once(1000,this,this.updata);
                    // this.updata();
                    
                }
            }
            else
                this.stopTimer();
        }

        private onTouch(e: Laya.Event): void {
            switch (e.currentTarget) {
                case this._btnSign:
                    var str: string;
                    if (this.dataSource.mrule.cost && Number(this.dataSource.mrule.cost) > 0)
                        str = StringUtils.format(GameConfig.language.match_signin_2, this.dataSource.mrule.cost);
                    else
                        str = GameConfig.language.match_signin;
                    AlertInGameCtrl.instance.show(str, (value: number) => {
                        if (value == AlertCtrl.CONFIRM) {
                            matchSignService.matchSignin(this.dataSource.code, (response: any) => {
                                if (response.code == 0) {
                                    if (response.result == 0) {
                                        MatchSignData.setSignin(this.dataSource.code, 1);
                                        GameLogic.selfData.getInfo(true);
                                        var desc: string;
                                        if (MatchConfig.isModeTime(this.dataSource.mrule.matchmode)) {
                                            var now: number = server.serverTime ? server.serverTime * 1000 : new Date().getTime();
                                            var starttime = Number(this.dataSource.mrule.starttime) * 1000;
                                            if (now > starttime && this.dataSource.mrule.min_player)
                                                desc = StringUtils.format(GameConfig.language.matchsign_member_count, this.dataSource.mrule.min_player);
                                            else {
                                                var d: Date = new Date(starttime);
                                                var hour: number = d.getHours();
                                                var min: number = d.getMinutes();
                                                if (TimeUtils.isToday(starttime, now))
                                                    desc = StringUtils.format(GameConfig.language.matchsign_start_time_2, hour < 10 ? "0" + hour : hour, min < 10 ? "0" + min : min);
                                                else if (TimeUtils.isTomorrow(starttime, now))
                                                    desc = StringUtils.format(GameConfig.language.matchsign_start_time_3, hour < 10 ? "0" + hour : hour, min < 10 ? "0" + min : min);
                                                else
                                                    desc = StringUtils.format(GameConfig.language.matchsign_start_time, "", d.getMonth() + 1, d.getDate(), hour < 10 ? "0" + hour : hour, min < 10 ? "0" + min : min);
                                            }
                                        }
                                        else
                                            desc = StringUtils.format(GameConfig.language.matchsign_member_count, this.dataSource.mrule.playercnt);
                                        AlertInGameCtrl.instance.show(StringUtils.format(GameConfig.language.match_signin_3, this.dataSource.mrule.title, desc), null, 0, false, "tongyong/tongyong_tishi_2.png", null, ["tongyong/tongyong_btn_zhidao.png"]);
                                    }
                                    else {
                                        var str: string = GameConfig.language.match_signin_fail[response.result];
                                        if (!str)
                                            str = GameConfig.language.match_signin_fail[-1];
                                        AlertInGameCtrl.instance.show(str, null, 0, false);
                                    }

                                    MatchSignData.getStatus();
                                }
                            })
                        }
                    });
                    break;

                case this._btnCancelSign:
                    AlertInGameCtrl.instance.show(GameConfig.language.match_signout, (value: number) => {
                        if (value == AlertCtrl.CONFIRM) {
                            matchSignService.matchSignout(this.dataSource.code, (response: any) => {
                                if (response.code == 0) {
                                    if (response.result == 0) {
                                        MatchSignData.setSignin(this.dataSource.code, 0);
                                        GameLogic.selfData.getInfo(true);
                                    }
                                    else
                                        AlertInGameCtrl.instance.show(GameConfig.language.match_signout_fail, null, 0, false);
                                }
                            })
                        }
                    });

                    break;

                case this._btnReturnMatch:

                    break;
            }
        }
    }
}