// TypeScript file
class PlaySheet {
    constructor() {
        this["name"]="PlaySheet";
    }
    private static _instance: PlaySheet;
    public netmsgs: Array<any>;
    public sheetInfo: any;
    public speed;
    public startTime;
    public pauseTargets;
    updateHandler;
    playerCount;
    public first = true;
    nextMsgId;
    totalTime;
    timer;
    turns;
    updateCB;

    public static get instance(): PlaySheet {
        if (this._instance == undefined) {
            this._instance = new PlaySheet();
        }
        return this._instance;
    }
    // public loadData(){
    //     var testPath ="http://10.10.10.100:8888/history/video?vid=8ba9b6cdf26ffee97e74b62563234044";
    //     Laya.loader.load(testPath, Laya.Handler.create(this,this.init), null, Laya.Loader.BUFFER)
    // }

    public init(sheetData) {
        this.stop();
        this.netmsgs = []
        //    var testPath ="res/t.bin";
        //     sheetData = Laya.Loader.getRes(testPath);
        //     console.log(sheetData)

        var bytes: Laya.Byte = new Laya.Byte();
        bytes.writeArrayBuffer(sheetData);
        bytes.pos = 0;
        bytes.endian = Laya.Socket.BIG_ENDIAN;
        console.log(bytes.getUint8Array(bytes.pos, 4))
        console.log(bytes.getUint8Array(bytes.pos, 4))
        console.log(bytes.getUint8Array(bytes.pos, 4))//time
        // console.log(bytes.getUint8Array(bytes.pos,4))//uid


        this.packageDecode(bytes)
        // this.netmsgs = msg.data;
        // BaseGameData.selfSeatid = msg.uid
        //this.netmsgs = msginfo;
        if (!this.netmsgs) {
            return
        }

        console.info(this.netmsgs)
        this.initSheetInfo();
        //  for (var k in msginfo) {
        //      this.netmsgs.push(msginfo[k]);
        //  }



        this.pauseTargets = null;
        this.updateHandler = null;

        var msg = this.netmsgs[1];
        if (!msg) return

        this.startTime = msg.time;
        this.speed = 1;
        BaseGameData.maxPlayer = this.netmsgs[1].msg.players.length;
        var offsetTime = 0;
        // if (this.first) {
        //     for (var k in this.netmsgs) {
        //         var info = this.netmsgs[k]
        //         info.time += offsetTime;
        //         switch (info.name) {
        //             case "game.GameStartNtf":
        //                 // offsetTime += 0.09 * this.playerCount;
        //                 break;
        //             case "game.AddCardNtf":
        //                 offsetTime += 0.18 * this.playerCount;
        //                 break;
        //             case "game.PoolBetNtf":
        //                 offsetTime += 0.5;
        //                 break;
        //             case "game.PoolCardsNtf":
        //                 offsetTime += 0.5;
        //                 break;
        //             case "game.BetNtf":
        //                 offsetTime += 0.3;
        //                 break;
        //             case "game.FoldNtf":
        //                 offsetTime += 0.5;
        //                 break;
        //             case "game.PlayerOptNtf":
        //                 if (offsetTime >= 0 && (this.netmsgs[parseInt(k) + parseInt("1")].time - info.time) > 15) {
        //                     offsetTime = offsetTime - this.netmsgs[parseInt(k) + parseInt("1")].time + info.time + 15
        //                 };
        //                 break;
        //         }

        //     }
        // }
        this.first = false;
        EventManager.instance.registerOnObject(this, this, "nextStep", this, this.gotoNextStep);
        var len = this.netmsgs.length - 1;
        this.totalTime = Math.ceil(this.netmsgs[len].time - this.startTime + 5.5);
        var ruleMsg = this.netmsgs[0]
        var startMsg = this.netmsgs[1];
        this.nextMsgId = 2;
        // Dispatcher.dispatch(msg.name,msg.msg);
        DialogManager.instance.removeDialog("gameend")
        Laya.timer.frameOnce(1, this, function () {
            server.dispatchMessage(startMsg.name, startMsg.msg)
            server.dispatchMessage(ruleMsg.name, ruleMsg.msg)
        })


    }

    private packageDecode(data) {
        if (data.length - data.pos < 6) {
            return
        }
        let time = data.getInt32()
        let len = data.getInt16()
        let cmd = data.getInt16()
        let netData = data.getUint8Array(data.pos, len - 2)
        let msg = server.onSheetData(cmd, netData)
        this.netmsgs.push({ time: time, name: msg.name, msg: msg.msg })
        this.packageDecode(data)
    }



    private initSheetInfo() {
        // var msg = this.netmsgs[0]
        // if (msg.name != "game.RecordInfo") return

        // var startMsg = this.netmsgs[1];
        // var table_index =  msg.msg.table_index || 0;
        // if (msg.msg.table_index) table_index = msg.msg.table_index;
        // var sheetNetMsg = {playerinfo : [], maxplayer : msg.msg.maxplayer || 9, tableIndex : table_index};
        // var sheetInfoMsg = {name : "game.SheetInfo", time : startMsg.time, msg : sheetNetMsg};
        // for (var k in startMsg.msg.playerinfo) {
        //     var p = startMsg.msg.playerinfo[k];
        //     var info = {};
        //     info["uid"] = p.uid;
        //     info["seatid"] = p.seatid;
        //     info["gold"] = p.gold;
        //     info["bet"] = p.bet;
        //     info["ranking"] = p.ranking;

        //     sheetNetMsg.playerinfo[k] = p;
        // }

        // this.netmsgs[0] = sheetInfoMsg;
        // this.sheetInfo = msg.msg;
        // this.sheetInfo.ante_mode = 0;

        // this.sheetInfo.sblinds = msg.msg.sblinds;
        // this.sheetInfo.game_mode = msg.msg.game_mode;
        // this.sheetInfo.titl_mode = msg.msg.insure_mode;
        // this.play();
    }

    public play() {
        this.timer = 0;
        // this.gotoNextStep();
        // this.unschedule(this.update);
        // this.schedule(this.update, 0.1);


        Laya.timer.loop(100, this, this.update);
    }

    public update() {
        this.timer = this.timer + 0.1;
        this.checkNextMsgTime();
        // this.gotoNextStep();
        if (this.updateCB) {
            this.updateCB(this.timer)
        }
    }

    public pause() {
        // var actionManager = cc.director.getActionManager();
        // this.pauseTargets = actionManager.pauseAllRunningActions();

        // this.unschedule(this.update)
        // Laya.stage.renderingEnabled = false
        Laya.timer.clearAll(this)

    }

    public restart() {
        // Laya.stage.renderingEnabled = true
        // if (this.pauseTargets) {
        //     var actionManager = cc.director.getActionManager();

        //     for (var k in this.pauseTargets) {
        //         var v = this.pauseTargets[k];
        //         actionManager.resumeTarget(v);
        //     }

        //     this.pauseTargets = null;
        // }

        // this.unschedule(this.update);
        // this.update();
        this.gotoNextStep();
        // this.schedule(this.update, 0.1);
        Laya.timer.loop(100, this, this.update);
    }

    public resume() {
        this.update()
        Laya.timer.loop(100, this, this.update);
    }
    public stop() {
        Laya.timer.clearAll(this)
    }

    public setSpeed(speed) {
        this.speed = speed;
    }

    public getTotalTime() {
        return this.totalTime
    }

    public getRelativeTime(i) {
        var msg = this.netmsgs[i];
        if (!msg) {
            return
        }

        return msg.time - this.startTime;
    }

    public gotoLast() {
        if (this.pauseTargets) return;
        this.nextMsgId = this.nextMsgId - 1 > 1 ? this.nextMsgId - 1 : 1
        if (!this.nextMsgId || !this.netmsgs[this.nextMsgId]) {
            return;
        }

        this.stopAndGoToMsg(this.nextMsgId)
    }

    public gotoNext() {
        if (this.pauseTargets) return;
        this.nextMsgId = this.nextMsgId + 1 >= this.netmsgs.length ? this.nextMsgId : this.nextMsgId + 1
        if (!this.nextMsgId || !this.netmsgs[this.nextMsgId]) {
            return;
        }

        this.stopAndGoToMsg(this.nextMsgId)
    }


    public gotoNextStep() {
        if (this.pauseTargets) return;
        if (!this.nextMsgId || !this.netmsgs[this.nextMsgId]) {
            return;
        }

        var time = this.getRelativeTime(this.nextMsgId);

        var msg = this.netmsgs[this.nextMsgId];
        var delay = 0;
        // if ((msg.name == "game.BetNtf" || msg.name == "game.FoldNtf" || msg.name == "game.InsureNtf" || msg.name == "game.PayInsuranceNtf" || msg.name == "game.GameEndNtf" || msg.name == "game.AskInsureNtf" || msg.name == "game.PoolCardsNtf") && (time - this.timer - 0.1) > 0){
        //     delay = time - this.timer - 0.1;
        // }
        this.nextMsgId = parseInt(this.nextMsgId) + parseInt("1");
        // this.scheduleOnce(function(){

        Laya.timer.once(delay * 1000, this, function () {
            server.dispatchMessage(msg.name, msg.msg)
            // Dispatcher.dispatch(msg.name, msg.msg);
        })

    }

    public stopAndGoToMsg(id) {
        var msg = this.netmsgs[id];
        //console.info(msg);
        if (!msg) return
        Laya.timer.clearAll(this)
        BaseGameData.discards = []
        for (var i = 0; i < id; i++) {
            var msg = this.netmsgs[i];
            msg.msg.noAni = true
            // Dispatcher.dispatch(msg.name, msg.msg);
            if (msg.name == "game.TableInfoNtf" || msg.name == "game.ReconnectInfo" || msg.name == "game.OfflineNtf" || msg.name == "game.PlayerChatNtf") {
                continue
            }
            server.dispatchMessage(msg.name, msg.msg)

        }
        Laya.timer.frameOnce(1, this, function () {
            server.dispatchMessage("game.updateTable", {});
            this.timer = this.getRelativeTime(id);
            this.nextMsgId = id;
        })

        // var msg = this.netmsgs[this.nextMsgId];

        // Laya.timer.once(100, this, function(){
        //     Dispatcher.dispatch(msg.name, {name: msg.name, netmsg: msg.msg, speed: this.speed});
        // });

    }

    public stopAndGoToTime(time) {
        if (time <= 0) {
            this.stopAndGoToMsg(0)
        } else if (time > this.getRelativeTime(this.netmsgs.length - 1)) {
            this.stopAndGoToMsg(this.netmsgs.length - 1);
        } else {
            var i
            for (var k in this.netmsgs) {
                if (this.getRelativeTime(k) >= time) {
                    i = k;
                    break;
                }
            }

            var pre_time = this.getRelativeTime(i - 1);
            var after_time = this.getRelativeTime(i);
            if ((after_time - time) < (time - pre_time)) {
                this.stopAndGoToMsg(i);
            } else {
                this.stopAndGoToMsg(i - 1);
            }
        }
    }

    public checkNextMsgTime() {
        // console.info(this.netmsgs[this.nextMsgId]);
        if (!this.nextMsgId || !this.netmsgs[this.nextMsgId]) {
            return;
        }

        var msg = this.netmsgs[this.nextMsgId];

        if (msg.name == "game.TableInfoNtf" || msg.name == "game.ReconnectInfo" || msg.name == "game.OfflineNtf") {
            this.nextMsgId = parseInt(this.nextMsgId) + parseInt("1");
            return
        }

        var deltaT = this.getRelativeTime(this.nextMsgId) - this.timer
        if (deltaT <= 0) {
            console.info(msg)
            server.dispatchMessage(msg.name, msg.msg)
            this.nextMsgId = parseInt(this.nextMsgId) + parseInt("1");
            this.checkNextMsgTime();
        }
    }

    public onUpdateCallBack(callback) {
        this.updateCB = callback;
    }
}