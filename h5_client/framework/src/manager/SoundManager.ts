/*
* @author seacole
*音效管理
*/
class SoundManager {
    constructor() {

    }

    //哪几个音乐是不循环的
    private _noLoop = [SoundConfig.MUSIC_FISH_ARRAY];
    private static _instance: SoundManager;
    public static get instance(): SoundManager {
        if (this._instance == undefined) {
            this._instance = new SoundManager();
        }
        return this._instance;
    }

    private _musicRes: string;
    //之前的背景音乐
    private _oldMusicRes: string;
    private _musicPlaying: boolean;
    private _language: number = 0;

    public set language(type) {
        this._language = type
    }

    public play(id: number, isSelf: boolean = true): void {
        //  var cfg: any = GameConfig.cfgSound[id];
        // if (cfg) {
        //     //if (cfg.type == 1)
        //     //是否区分自己跟他人
        //     if(!cfg.bPlayWhenOtherPlayerPlay && !isSelf)
        //     {
        //        return;
        //     }
        //     if (cfg.type == "music")
        //     {

        //        //判断该背景音乐是否循环
        //        var loop = this._noLoop.indexOf(id) == -1?0:1;
        //         this.playMusic("res/"+cfg.path+".mp3",false,loop);
        //          Laya.SoundManager.setMusicVolume(cfg.volume);
        //     }
        //     else
        //         this.playEffect("res/"+cfg.path+".mp3",1,false,cfg.volume);
        // }
    }

    public playBg(name: string = null, goon: boolean = false, loopNum: number = 0): void {
        if (name) {
            var res: string;
            if (Native.instance.isNative)
                res = "res/audio/";
            else
                res = "res/audioweb/";
            if (BaseGameData.gameType == GameDef.GAME_TYPE.JINYUN_HZ_MJ || BaseGameData.gameType == GameDef.GAME_TYPE.JINYUN_GS_MJ || BaseGameData.gameType == GameDef.GAME_TYPE.JINYUN_MJ || BaseGameData.gameType == GameDef.GAME_TYPE.SHANGQIU_MJ || BaseGameData.gameType == GameDef.GAME_TYPE.SHANXI_MJ)
                res += "mj/";
            else if (BaseGameData.gameType == GameDef.GAME_TYPE.WAKENG)
                res += "poker/";
            else if (BaseGameData.gameType == GameDef.GAME_TYPE.GUANPAI)
                res += "guanpai/";
            else if (BaseGameData.gameType == GameDef.GAME_TYPE.SHISANSHUI)
                res += "shisanshui/"
            else if (!BaseGameData.gameType)
                res += "menu/"
            res += "bg/" + GameConfig.cfgAudio[name];
            if (!Native.instance.isNative)
                res = res.replace(".ogg", ".mp3");
            this.playMusic(res, goon, loopNum);
        }
        else
            this.playMusic(null, goon, loopNum);
        Laya.SoundManager.setMusicVolume(SoundManager.instance.musicVolume);
    }

    /**
     * 播放音乐
     */
    private playMusic(res: string = null, goon: boolean = false, loopNum: number = 0): void {
        if (this._musicRes == res)
            return;

        this._oldMusicRes = this._musicRes;

        if (!goon)
            this._musicRes = res;
        this._musicPlaying = true;
        if (this.musicMute)
            return;
        this.stopMusic(true);
        if (!this._musicRes)
            return;
        log("playMusic");
        if (loopNum == 0) {
            Laya.SoundManager.playMusic(this._musicRes, loopNum);
        }
        else {
            Laya.SoundManager.playMusic(this._musicRes, loopNum, new laya.utils.Handler(this, this.playMusic, [this._oldMusicRes, false, 0]));
        }
        Laya.timer.clear(this, this.tweenMusicVolume);
        Laya.SoundManager.setMusicVolume(SoundManager.instance.musicVolume);
    }

    /**
     * 关闭音乐
     */
    public stopMusic(mute: boolean = false): void {
        log("stopMusic");
        Laya.SoundManager.setMusicVolume(0);
        if (!mute) {
            this._musicRes = null;
            this._musicPlaying = false;
        }
        Laya.SoundManager.stopMusic();
    }

    /**
     * 切换音乐开关
     */
    public switchMusic(): void {
        this.musicMute = !this.musicMute;
        if (this._musicRes) {
            if (this.musicMute) {
                this.stopMusic(true)
            } else {
                if (this._musicPlaying)
                    this.playMusic(null, true);
            }
        }
    }

    /**
     * 获取音乐开关状态 true表示关
     */
    public get musicMute(): boolean {
        let mm: string = localStorage.getItem('musicMute_2');
        return mm ? mm == '1' : false;
    }

    /**
     * 设置音乐开关状态 true表示关
     */
    public set musicMute(value: boolean) {
        localStorage.setItem('musicMute_2', value ? '1' : '0');
    }


    _effectRes: string;
    _effectChannel: Laya.SoundChannel;
    /**
     * 播放音效
     */
    // private playEffect(res: string = null, loop: number = 1, musicConflict: boolean = false,volume:number = 1): void {
    //     if (res) {
    //         this._effectRes = res;
    //     }
    //     if (this.effectMute) {
    //         return;
    //     }
    //     if (musicConflict) {
    //         Laya.SoundManager.setMusicVolume(0);
    //         Laya.timer.clear(this,this.tweenMusicVolume);

    //         this._effectChannel = Laya.SoundManager.playSound(this._effectRes, loop, Laya.Handler.create(this, () => {
    //             Laya.timer.loop(50,this,this.tweenMusicVolume);
    //         }));
    //     }
    //     else
    //     {
    //         this._effectChannel = Laya.SoundManager.playSound(this._effectRes, loop);
    //         if(this._effectChannel)
    //             this._effectChannel.volume = volume;

    //     }            
    // }


    /**
     * 播放音效
     * @param name 配置中的name
     * @param sex 性别 默认男性
     * @param loop 播放次数 默认1次
     * @param musicConflict 是否和音乐冲突 默认false
     * @param volume 音量 默认1
     * @param isPublic 是否是公用资源 默认false
     */
    public playEffect(name: string = null, sex: number = 3, loop: number = 1, musicConflict: boolean = false, volume: number = 1, isPublic: boolean = false): void {
        if (!GameConfig.cfgAudio[name])
            return;

        var sexUrl: string = "";
        // if (sex != 3)
        sexUrl = sex != 2 ? "male/" : "female/";
        if (Native.instance.isNative)
            this._effectRes = "res/audio/";
        else
            this._effectRes = "res/audioweb/";
        if (isPublic) {
            this._effectRes += "public/";
            this._effectRes += GameConfig.cfgAudio[name];
        }
        else {
            // if (BaseGameData.gameType == GameDef.GAME_TYPE.JINYUN_MJ)
            //     this._effectRes += "jinyun_mj/";
            // else if (BaseGameData.gameType == GameDef.GAME_TYPE.SHANXI_MJ)
            //     this._effectRes += "shanxi_mj/";
            // else if (BaseGameData.gameType == GameDef.GAME_TYPE.WAKENG)
            //     this._effectRes += "wakeng/";
            this._effectRes += GameDef.GAME_NAME[parseInt(BaseGameData.gameType) - 1] + "/" + this._language + "/" + sexUrl + GameConfig.cfgAudio[name];
        }
        if (!Native.instance.isNative)
            this._effectRes = this._effectRes.replace(".ogg", ".mp3");

        if (this.effectMute) {
            return;
        }
        this.playEffectNow(loop, musicConflict, volume);
    }

    public playBtnEffect(type: number): void {
        var url: string = ButtonSoundEffect.types[type];
        if (url) {
            if (Native.instance.isNative)
                this._effectRes = "res/audio/button/";
            else
                this._effectRes = "res/audioweb/button/";
            this._effectRes += url;
            if (!Native.instance.isNative)
                this._effectRes = this._effectRes.replace(".ogg", ".mp3");
            if (this.effectMute) {
                return;
            }
            this.playEffectNow();
        }
    }

    private playEffectNow(loop: number = 1, musicConflict: boolean = false, volume: number = 1): void {
        Laya.SoundManager.setSoundVolume(SoundManager.instance.soundVolume);
        if (musicConflict) {
            Laya.SoundManager.setMusicVolume(0);
            Laya.timer.clear(this, this.tweenMusicVolume);

            this._effectChannel = Laya.SoundManager.playSound(this._effectRes, loop, Laya.Handler.create(this, () => {
                Laya.timer.loop(50, this, this.tweenMusicVolume);
            }));
        }
        else {
            this._effectChannel = Laya.SoundManager.playSound(this._effectRes, loop);
            // if (this._effectChannel)
            //     this._effectChannel.volume = volume;
        }
    }



    private tweenMusicVolume(): void {
        var volume: number = Laya.SoundManager.musicVolume;
        volume += 0.05;
        Laya.SoundManager.setMusicVolume(volume);
        if (volume >= SoundManager.instance.musicVolume) {
            Laya.SoundManager.setMusicVolume(SoundManager.instance.musicVolume);
            Laya.timer.clear(this, this.tweenMusicVolume);
        }
    }

    public set musicVolume(value: number) {
         if (value <= 0) {
            SoundManager.instance.musicMute=true;
            SoundManager.instance.stopMusic(true);
        }
        else{
             SoundManager.instance.musicMute=false;
            if ( Laya.SoundManager.musicVolume<=0)
                SoundManager.instance.playMusic(null,true);
            
        }
        Laya.SoundManager.setMusicVolume(value);
        localStorage.setItem('musicVolume', value + "");       
    }

    public get musicVolume(): number {
        let mm: string = localStorage.getItem('musicVolume');
        return mm ? Number(mm) : 1;
    }

    public set soundVolume(value: number) {
        Laya.SoundManager.setSoundVolume(value);
        localStorage.setItem('soundVolume', value + "");
    }

    public get soundVolume(): number {
        let mm: string = localStorage.getItem('soundVolume');
        return mm ? Number(mm) : 1;
    }

    /**
     * 暂停音效
     */
    public stopEffect(): void {
        Laya.SoundManager.stopAllSound();
        /*if (this._effectChannel) {
            this._effectChannel.stop();
        }
        */
    }
    /**
     * 设置音效开关状态 true表示关
     */
    switchEffect(): void {
        this.effectMute = !this.effectMute;
    }
    /**
    * 获取音效开关状态 true表示关
    */
    get effectMute(): boolean {
        let mm: string = localStorage.getItem('effectMute_2');
        return mm ? mm == '1' : false;
    }
    /**
    * 获取音效开关状态 true表示关
    */
    set effectMute(value: boolean) {
        localStorage.setItem('effectMute_2', value ? '1' : '0');
    }
}