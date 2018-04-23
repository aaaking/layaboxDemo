/*
* @author seacole
* 日历
*/
class DateUI extends ui.matchSign.date.DateUI {
    constructor() {
        super();

        this._day = new DateScroll();
        this._day.centerX = -180;
        this._day.y = 120;

        this.addChild(this._day);

        this._hour = new DateScroll();
        this._hour.centerX = 0;
        this._hour.y = 120;
        this._hour.date = this.getHourDate();
        this.addChild(this._hour);

        this._min = new DateScroll();
        this._min.centerX = 180;
        this._min.y = 120;
        this._min.date = this.getMinDate();
        this.addChild(this._min);

        this._labCancel.hitArea=new Laya.Rectangle(-20,-15,100,60);
        this._labConfirm.hitArea=new Laya.Rectangle(-20,-15,100,60);

        this._labCancel.on(Laya.Event.CLICK, this, this.onTouch);
        this._labConfirm.on(Laya.Event.CLICK, this, this.onTouch);
    }

     public getDate(): void {
        this._day.date = this.getDayDate();
    }

    private _days: Array<number>;
    private _hours: Array<number>;
    private _mins: Array<number>;

    private getDayDate(): Array<string> {
        var now: number = new Date().getTime();
        var tmpDate: Date = new Date(now);
        now = now - tmpDate.getHours() * 60 * 60 * 1000 - tmpDate.getMinutes() * 60 * 1000 - tmpDate.getSeconds() * 1000;
        this._days = [];
        var tmp: Array<string> = [];
        for (var i: number = 0; i < 4; i++) {
            var d: Date = new Date(now + 1000 * 60 * 60 * 24 * i);
            this._days.push(d.getTime());
            if (i == 0)
                tmp.push(StringUtils.format(GameConfig.language.today, ""));
            else if (i == 1)
                tmp.push(StringUtils.format(GameConfig.language.tomorrow, ""));
            else
                tmp.push(StringUtils.format(GameConfig.language.format_m_d, "", d.getMonth() + 1, d.getDate()));
        }
        tmp = tmp.concat(tmp);
        this._days = this._days.concat(this._days);
        return tmp;
    }

    private getHourDate(): Array<string> {
        this._hours = [];
        var tmp: Array<string> = [];
        for (var i: number = 0; i < 24; i++) {
            this._hours.push(i);
            if (i < 10)
                tmp.push("0" + i);
            else
                tmp.push("" + i);
        }
        return tmp;
    }

    private getMinDate(): Array<string> {
        this._mins = [];
        var tmp: Array<string> = [];
        for (var i: number = 0; i < 60; i++) {
            this._mins.push(i);
            if (i < 10)
                tmp.push("0" + i);
            else
                tmp.push("" + i);
        }
        return tmp;
    }

    private _day: DateScroll;
    private _hour: DateScroll;
    private _min: DateScroll;

    public start(): void {
        var now: Date = new Date();
        this._day.start(0);
        this._hour.start(now.getHours());
        this._min.start(now.getMinutes() + 5);
    }

    public stop(): void {
        this._day.stop();
        this._hour.stop();
        this._min.stop();
    }

    public getTime(): number {
        var dayIdx: number = this._day.getIndex();
        var hourIdx: number = this._hour.getIndex();
        var minIdx: number = this._min.getIndex();
        return this._days[dayIdx] + hourIdx * 60 * 60 * 1000 + minIdx * 60 * 1000;
    }

    private onTouch(e: Laya.Event): void {
        switch (e.currentTarget) {
            case this._labCancel:
                Dispatcher.dispatch(EventNames.MATCH_CREATE_TIME_CHANGE, 0);
                break;

            case this._labConfirm:
                Dispatcher.dispatch(EventNames.MATCH_CREATE_TIME_CHANGE, 1);
                break;
        }
    }
}