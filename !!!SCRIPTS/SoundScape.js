void MarkStart("Soundscape");
const Soundscape = (() => {
    // ************************************** START BOILERPLATE INITIALIZATION & CONFIGURATION **************************************
    const SCRIPTNAME = "Soundscape";

    // #region COMMON INITIALIZATION
    const STATE = {
        get REF() {
            return C.RO.OT[SCRIPTNAME];
        }
    };
    const VAL = (varList, funcName, isArray = false) => D.Validate(varList, funcName, SCRIPTNAME, isArray);
    const DB = (msg, funcName) => D.DBAlert(msg, funcName, SCRIPTNAME);
    const LOG = (msg, funcName) => D.Log(msg, funcName, SCRIPTNAME);
    const THROW = (msg, funcName, errObj) => D.ThrowError(msg, funcName, SCRIPTNAME, errObj);
    const ONSTACK = () => D.ONSTACK(ONSTACK);
    const OFFSTACK = (funcID) => D.OFFSTACK(funcID);

    const checkInstall = () => {
        C.RO.OT[SCRIPTNAME] = C.RO.OT[SCRIPTNAME] || {};
        initialize();
    };
    // #endregion

    // #region LOCAL INITIALIZATION
    const initialize = () => {
        STATE.REF.trackregistry = STATE.REF.trackregistry || {};
        STATE.REF.playlistregistry = STATE.REF.playlistregistry || {};
        STATE.REF.isSoundscapeActive = VAL({bool: STATE.REF.isSoundscapeActive}) ? STATE.REF.isSoundscapeActive : true;
        STATE.REF.activeSounds = STATE.REF.activeSounds || [];
        STATE.REF.VOLUME = Object.assign({}, C.SOUNDVOLUME, STATE.REF.VOLUME || {});
        STATE.REF.playSoundLog = STATE.REF.playSoundLog || [];
        STATE.REF.playSoundLog.push("~~~ NEW INITIALIZATION ~~~");

        STATE.REF.scoreOverride = "ScoreMain";
        D.Flag("Score Override: ScoreMain");

        // syncSoundscape(true);
    };
    // #endregion

    // #region EVENT HANDLERS: (HANDLEINPUT)
    const onChatCall = (call, args, objects, msg) => {
        switch (call) {
            case "initialize":
                importFromJukebox();
                break;
            case "sync":
                syncSoundscape();
                break;
            case "start":
                startSoundscape(args[0] === "reset");
                break;
            case "play":
                playSound(args[0]);
                break;
            case "stop":
                if (args[0])
                    stopSound(args[0]);
                else
                    stopSoundscape();
                break;
            case "inc":
            case "increase": {
                if (args[0] === "casaloma") {
                    CASALOMASOUNDS.CLGreatHall.activeSounds.ScoreCasaLoma = D.Float(args[1], 2);
                    C.SITES.CLGreatHall.onEntryCall = null;
                    Media.ToggleText("HubAspectsNotice", true);
                    Media.ToggleText("HubAspectsTitle", true);
                    syncSoundscape();
                    if (args[4]) {
                        const delayTimeArg = D.Float(args[2] || 10, 2);
                        const numStepsArg = D.Float(args[3] || 5, 2);
                        const targetVol = D.Float(args[4] || 4, 3);
                        const durationArg = D.Float(args[5] || 5, 2);
                        const fadeOut = (soundRef, duration, delayTime, numSteps = 5, targetVolume = 0) => {
                            duration = duration < 60 ? duration * 1000 : duration;
                            delayTime = delayTime < 60 ? delayTime * 1000 : delayTime;
                            const trackObj = getTrackObj(soundRef);
                            const startVolume = trackObj.get("volume");
                            const stepTime = D.Float(duration / numSteps, 3);
                            const deltaVol = D.Float((targetVolume - startVolume) / numSteps, 4);
                            let intervalTimer;
                            setTimeout(() => {
                                DB({"Timeout Started": [
                                    `Starting Volume Decrease from ${startVolume} to ${targetVolume}`,
                                    `Delay: ${delayTime}, Duration: ${duration}`,
                                    `StepTime: ${stepTime}, DeltaVol: ${deltaVol}`
                                ]}, "fadeOut");
                                intervalTimer = setInterval(() => {
                                    const curVol = trackObj.get("volume");
                                    const newVol = D.Float(Math.max(targetVolume, curVol + deltaVol), 3);
                                    trackObj.set({volume: newVol});
                                    DB({step: newVol, target: targetVolume, realVol: trackObj.get("volume")}, "fadeOut");
                                    if (newVol === targetVolume) {
                                        clearInterval(intervalTimer);
                                        intervalTimer = null;
                                    }
                                }, stepTime);
                            }, delayTime);
                        };
                        fadeOut("ScoreCasaLoma", durationArg, delayTimeArg, numStepsArg, targetVol);
                        CASALOMASOUNDS.CLGreatHall.activeSounds.ScoreCasaLoma = 1;
                        CASALOMASOUNDS.CLVestibule.activeSounds.ScoreCasaLoma = 0.5;
                    }
                } else if (args[0]) {
                    const baseVolume = STATE.REF.VOLUME[args[0]] || STATE.REF.VOLUME.base;
                    const newVolume = Math.min(baseVolume + 10, baseVolume * 2);
                    setVolumeData(args[0], newVolume);
                    D.Alert(`Volume of <b>${D.JS(args[0])}</b>: ${baseVolume} >>> ${newVolume}`, "Increase Volume");
                }
                break;
            }
            case "dec":
            case "decrease": {
                if (args[0] === "casaloma") {
                    CASALOMASOUNDS.CLGreatHall.activeSounds.ScoreCasaLoma = D.Float(args[1]) || 1.5;
                    syncSoundscape();
                } else if (args[0]) {
                    const baseVolume = STATE.REF.VOLUME[args[0]] || STATE.REF.VOLUME.base;
                    const newVolume = Math.max(baseVolume - 10, baseVolume / 2);
                    setVolumeData(args[0], newVolume);
                    D.Alert(`Volume of <b>${D.JS(args[0])}</b>: ${baseVolume} >>> ${newVolume}`, "Decrease Volume");
                }
                break;
            }
            case "get": {
                switch (D.LCase((call = args.shift()))) {
                    case "tracks": {
                        D.Alert([
                            "<h3>Tracks Playing:</h3>",
                            getPlayingTrackObjs().map((x) => D.JS(x, true)).join("<br>")
                        ]);
                        break;
                    }
                    case "volume":
                        break;
                    // no default
                }
                if (call !== "volume")
                    break;
            }
            // falls through
            case "set": {
                switch (D.LCase((call = args.shift()))) {
                    case "volume":
                        setVolumeData(...args);
                        break;
                    case "mult": {
                        switch (D.LCase((call = args.shift()))) {
                            case "master":
                                setMasterVolumeMult(args.shift());
                                break;
                            case "rain":
                                setRainMult(...args);
                                break;
                            case "indoor":
                            case "inside":
                                setInsideMult(...args);
                                break;
                            // no default
                        }
                    }
                    // no default
                }
                sendVolumeAlert();
                break;
            }
            case "reset": {
                if (args[0] === "log") {
                    STATE.REF.playSoundLog = [];
                } else if (args[0] === "volume") {
                    STATE.REF.VOLUME = D.Clone(C.SOUNDVOLUME);
                } else if (args[0]) {
                    stopSound(args[0]);
                    playSound(args[0]);
                } else {
                    syncSoundscape(true);
                }
                break;
            }
            // no default
        }
    };
    const onTrackChange = (trackObj, prevData) => {
        if (trackObj.get("softstop") && !prevData.softstop) {
            DB(
                {
                    trackName: `${trackObj.get("title")}<br>`,
                    playing: `${prevData.playing} >> ${trackObj.get("playing")}<br>`,
                    looping: `${prevData.loop} >> ${trackObj.get("loop")}<br>`,
                    softstop: `${prevData.softstop} >> ${trackObj.get("softstop")}<br>`
                },
                "onTrackChange"
            );
            playNextSound(trackObj);
        }
    };
    // #endregion
    // *************************************** END BOILERPLATE INITIALIZATION & CONFIGURATION ***************************************

    // #region CONFIGURATION
    const REGISTRY = {
        get Tracks() {
            return STATE.REF.trackregistry;
        },
        set Tracks(v) {
            STATE.REF.trackregistry = D.Clone(v);
        },
        get Playlists() {
            return STATE.REF.playlistregistry;
        },
        set Playlists(v) {
            STATE.REF.playlistregistry = D.Clone(v);
        }
    };
    const CASALOMASOUNDS = {
        blank: {
            activeSounds: {
                ScoreCasaLoma: 0.5, // Volume multipliers ON TOP of normal ones.
                SoftIndoor: 1
            },
            isOutside: false
        },
        CLVestibule: {
            activeSounds: {
                SoftIndoor: 1
            },
            isOutside: false
        },
        CLGreatHall: {
            activeSounds: {
                ScoreCasaLoma: 1.5 // Volume multipliers ON TOP of normal ones.
            },
            isOutside: false
        },
        CLGallery: {
            activeSounds: {
                ScoreCasaLoma: 0.5, // Volume multipliers ON TOP of normal ones.
                SoftIndoor: 1,
                TinkleAmbient: 1
            },
            isOutside: false
        },
        CLDrawingRoom: {
            activeSounds: {
                ScoreCasaLoma: 0.25, // Volume multipliers ON TOP of normal ones.
                FastClock: 1
                // Fireplace: 1
            },
            isOutside: false
        },
        CLOverlook: {
            activeSounds: {
                ScoreCasaLoma: 0.5 // Volume multipliers ON TOP of normal ones.
            },
            isOutside: false
        },
        CLLibrary: {
            activeSounds: {
                ScoreCasaLoma: 0.25,
                Fireplace: 1
            },
            isOutside: false
        },
        CLTerrace: {
            activeSounds: {
                ScoreCasaLoma: 0.25, // Volume multipliers ON TOP of normal ones.
                EerieForest: 1,
                LowWindAmbient: 1
            },
            isOutside: true
        }
    };
    // #endregion

    // #region INITIALIZATION: Importing Sounds
    const importFromJukebox = () => {
        REGISTRY.Tracks = [];
        REGISTRY.Playlists = [];
        const trackObjs = _.uniq(findObjs({_type: "jukeboxtrack"}));
        for (const trackObj of trackObjs)
            regTrack(trackObj);
        const jukeboxData = _.compact(JSON.parse(Campaign().get("_jukeboxfolder")).map((x) => {
            if (VAL({list: x})) {
                const xData = D.KeyMapObj(
                    x,
                    (k) => {
                        switch (k) {
                            case "i":
                                return "trackKeys";
                            case "n":
                                return "name";
                            case "s":
                                return "playModes";
                            default:
                                return k;
                        }
                    },
                    (v, k) => {
                        switch (k) {
                            case "i":
                                return v.map((xx) => parseKeyFromTitle(xx));
                            case "s":
                                return {
                                    isLooping: ["s", "b"].includes(v),
                                    isRandom: ["s", "o"].includes(v),
                                    isTogether: v === "a",
                                    isPlayingAll: ["s", "b"].includes(v)
                                };
                            default:
                                return v;
                        }
                    }
                );
                DB({xData}, "importFromJukebox");
                switch ((xData.name.match(/\[([^\]]*)\]$/u) || []).pop()) {
                    case "LoopEach": {
                        xData.playModes = {
                            isLooping: true,
                            isRandom: false,
                            isTogether: false,
                            isPlayingAll: false
                        };
                        break;
                    }
                    case "Sequence": {
                        xData.playModes = {
                            isLooping: false,
                            isRandom: false,
                            isTogether: false,
                            isPlayingAll: true
                        };
                        break;
                    }
                    case "RandomOnce": {
                        xData.playModes = {
                            isLooping: true,
                            isRandom: true,
                            isTogether: false,
                            isPlayingAll: false
                        };
                        break;
                    }
                    case "ShuffleOnce": {
                        xData.playModes = {
                            isLooping: false,
                            isRandom: true,
                            isTogether: false,
                            isPlayingAll: true
                        };
                    }
                    // no default
                }
                return xData;
            }
            return false;
        }));
        for (const playlistData of jukeboxData)
            regPlaylist(parseKeyFromTitle(playlistData.name), playlistData.trackKeys, playlistData.playModes);
    };
    // #endregion

    // #region GETTERS: Track & Playlist Data
    const parseKeyFromTitle = (trackRef) => {
        const origTrackRef = trackRef;
        trackRef
            = (D.IsID(trackRef) && (getObj("jukeboxtrack", trackRef) || {get: () => false}).get("title"))
            || (VAL({obj: trackRef}) && trackRef.get("title"))
            || (VAL({string: trackRef}) && trackRef)
            || false;
        DB({origTrackRef, trackRef}, "parseKeyFromTitle");
        return VAL({string: trackRef}) && trackRef.replace(/\s*[([{].*[)\]}]\s*/gu, "").replace(/[^A-Za-z0-9]*/gu, "");
    };
    const getSoundKey = (soundRef) => {
        const funcID = ONSTACK();
        if (VAL({string: soundRef})) {
            if (soundRef in REGISTRY.Tracks || soundRef in REGISTRY.Playlists)
                return OFFSTACK(funcID) && soundRef;
            if (D.IsID(soundRef)) {
                const jukeObj = getObj("jukeboxtrack", soundRef);
                if (VAL({object: jukeObj}))
                    return OFFSTACK(funcID) && parseKeyFromTitle(jukeObj.get("title"));
            }
        } else if (VAL({object: soundRef})) {
            return OFFSTACK(funcID) && parseKeyFromTitle(soundRef.get("title"));
        }
        return OFFSTACK(funcID) && false;
    };
    // getSoundKeys = (soundRefs) => _.flatten([soundRefs || []]).map(x => getSoundKey(x)),
    const getSoundData = (soundRef) => {
        const funcID = ONSTACK();
        const soundKey = getSoundKey(soundRef);
        return (OFFSTACK(funcID) && REGISTRY.Tracks[soundKey]) || REGISTRY.Playlists[soundKey];
    };
    const isTrack = (soundRef) => getSoundKey(soundRef) in REGISTRY.Tracks;
    const isPlaylist = (soundRef) => getSoundKey(soundRef) in REGISTRY.Playlists;
    const getTrackKey = (soundRef, isGettingAllTracks = false) => {
        const funcID = ONSTACK();
        if (isTrack(soundRef))
            return OFFSTACK(funcID) && getSoundKey(soundRef);
        else if (isPlaylist(soundRef))
            if (isGettingAllTracks)
                return OFFSTACK(funcID) && getSoundData(soundRef).trackKeys;
            else
                return OFFSTACK(funcID) && getSoundData(soundRef).currentTracks[0]; // OK for only one UNLESS "isTogether"
        return OFFSTACK(funcID) && false;
    };
    const getPlaylistKey = (soundRef) => {
        const funcID = ONSTACK();
        if (isTrack(soundRef)) {
            const trackKey = getTrackKey(soundRef);
            return (
                OFFSTACK(funcID)
                && ((Object.values(REGISTRY.Playlists).find((x) => x.trackKeys.includes(trackKey)) || {name: false}).name
                    || getTrackData(trackKey).playlists[0]
                    || false)
            );
        } else if (isPlaylist(soundRef)) {
            return OFFSTACK(funcID) && getSoundKey(soundRef);
        }
        return OFFSTACK(funcID) && false;
    };
    const getTrackData = (soundRef) => getSoundData(getTrackKey(soundRef));
    const getPlaylistData = (soundRef) => getSoundData(getPlaylistKey(soundRef));
    const getTrackObj = (soundRef) => getObj("jukeboxtrack", (getTrackData(soundRef) || {id: false}).id);
    const getVolumeData = (soundRef, isIgnoringLocation = false) => {
        const trackKey = getTrackKey(soundRef);
        const playlistKey = getPlaylistKey(soundRef);
        const returnData = {
            playlist: playlistKey,
            track: trackKey,
            volume: {}
        };
        let baseVolKey = "startVol";
        if (trackKey in STATE.REF.VOLUME)
            baseVolKey += "-T";
        else if (playlistKey in STATE.REF.VOLUME)
            baseVolKey += "-L";
        else
            baseVolKey += "-B";
        returnData.volume[baseVolKey] = STATE.REF.VOLUME[trackKey] || STATE.REF.VOLUME[playlistKey] || STATE.REF.VOLUME.base;

        const volumeMults = {
            M: STATE.REF.VOLUME.MasterVolumeMult,
            Cust: STATE.REF.volumeMults[trackKey] || STATE.REF.volumeMults[playlistKey] || 1
        };
        if (!isIgnoringLocation) {
            let indoorMultKey = (STATE.REF.outsideOverride === null && !Session.IsOutside && "in")
                                || (STATE.REF.outsideOverride === false && "inO");
            if (indoorMultKey) {
                if (trackKey in STATE.REF.VOLUME.MULTS.Inside)
                    indoorMultKey += "-T";
                else if (playlistKey in STATE.REF.VOLUME.MULTS.Inside)
                    indoorMultKey += "-L";
                else
                    indoorMultKey += "-B";
                volumeMults[indoorMultKey] = STATE.REF.VOLUME.MULTS.Inside[trackKey] || STATE.REF.VOLUME.MULTS.Inside[playlistKey] || STATE.REF.VOLUME.MULTS.Inside.base;
            } else if (TimeTracker.IsRaining) {
                let rainMultKey = "rain";
                if (trackKey in STATE.REF.VOLUME.MULTS.Raining)
                    rainMultKey += "-T";
                else if (trackKey in STATE.REF.VOLUME.MULTS.Raining)
                    rainMultKey += "-L";
                else
                    rainMultKey += "-B";
                volumeMults[rainMultKey] = STATE.REF.VOLUME.MULTS.Raining[trackKey] || STATE.REF.VOLUME.MULTS.Raining[playlistKey] || STATE.REF.VOLUME.MULTS.Raining.base;
            }
        }
        returnData.volume.mults = volumeMults;
        returnData.volume.finalVol = D.Float(Object.values(volumeMults).filter((x) => VAL({number: x})).reduce((tot, x) => tot * x, returnData.volume[baseVolKey]), 5);
        return returnData;
    };
    const getVolume = (soundRef) => {
        const volumeData = getVolumeData(soundRef, Session.Mode === "Inactive");
        DB({volumeData, finalVol: volumeData.volume.finalVol}, "getVolume");
        return volumeData.volume.finalVol;
        // const trackKey = getTrackKey(soundRef);
        // const playlistKey = getPlaylistKey(soundRef);
        // const volumeMult = STATE.REF.volumeMults[trackKey] || STATE.REF.volumeMults[playlistKey] || 1;
        // const volumeMults = [STATE.REF.VOLUME.MasterVolumeMult, volumeMult];
        // const baseVolume = STATE.REF.VOLUME[trackKey] || STATE.REF.VOLUME[playlistKey] || STATE.REF.VOLUME.base;
        // const isOutside = STATE.REF.outsideOverride === null ? Session.IsOutside : STATE.REF.outsideOverride;
        // if (Session.Mode === "Inactive")
        //     return D.Float(volumeMults.filter((x) => VAL({number: x})).reduce((tot, x) => tot * x, baseVolume), 2);
        // if (!isOutside)
        //     volumeMults.push(
        //         STATE.REF.VOLUME.MULTS.Inside[trackKey] || STATE.REF.VOLUME.MULTS.Inside[playlistKey] || STATE.REF.VOLUME.MULTS.Inside.base
        //     );
        // else if (TimeTracker.IsRaining)
        //     volumeMults.push(
        //         STATE.REF.VOLUME.MULTS.Raining[trackKey] ||
        //             STATE.REF.VOLUME.MULTS.Raining[playlistKey] ||
        //             STATE.REF.VOLUME.MULTS.Raining.base
        //     );
        // DB({trackKey, playlistKey, volumeMults, baseVolume, reduction: D.Int(volumeMults.reduce((tot, x) => tot * x, baseVolume))}, "getVolume");
        // return D.Int(volumeMults.filter((x) => VAL({number: x})).reduce((tot, x) => tot * x, baseVolume));
    };
    const isTrackObjPlaying = (trackObj) => VAL({obj: trackObj}) && trackObj.get("playing") && !trackObj.get("softstop");
    const isTrackObjLooping = (trackObj) => isTrackObjPlaying(trackObj) && trackObj.get("looping");
    const getPlayingTrackObjs = (isLoopingOnly = false) => _.uniq(findObjs({_type: "jukeboxtrack"})).filter((x) => (isLoopingOnly ? isTrackObjLooping(x) : isTrackObjPlaying(x)));
    // getPlayingPlaylists = () => Object.keys(REGISTRY.Playlists).filter(x => REGISTRY.Playlists[x].isPlaying),
    // getPlayingTracks = (isExcludingPlaylists = false) => Object.values(REGISTRY.Tracks).filter(x => x.isPlaying && (!isExcludingPlaylists || !x.masterPlaylist)).map(x => x.name),
    const getScore = () => STATE.REF.scoreOverride || C.SOUNDSCORES[Session.Mode][0];
    const getWeatherSounds = (isForcingOutside = false) => {
        const funcID = ONSTACK();
        const weatherCode = TimeTracker.WeatherCode;
        const weatherSounds = [];
        if (Session.Mode === "Inactive" || (!Session.IsOutside && !isForcingOutside))
            return OFFSTACK(funcID) && [];

        // RAIN:
        switch (weatherCode.charAt(0)) {
            case "w":
                weatherSounds.push("RainLight");
                break;
            case "d":
            case "t":
                weatherSounds.push("RainHeavy");
                break;
            // no default
        }

        // WIND:
        const windPrefix = `Wind${TimeTracker.TempC <= 0 ? "Winter" : ""}`;
        if (weatherCode.charAt(0) === "b")
            weatherSounds.push(`${windPrefix}Max`);
        else
            switch (weatherCode.charAt(4)) {
                case "b":
                    weatherSounds.push(`${windPrefix}Low`);
                    break; // Breezy / Biting Wind
                case "w":
                case "g":
                    weatherSounds.push(`${windPrefix}Med`);
                    break; // Blustery / High Winds, High Winds / Driving Winds
                case "h":
                case "v":
                    weatherSounds.push(`${windPrefix}Max`);
                    break; // Howling Winds, Roaring Winds
                // no default
            }
        return OFFSTACK(funcID) && weatherSounds;
    };
    const getLocationSounds = () => {
        const funcID = ONSTACK();
        const dist = (Session.District && C.LOCATIONS[Session.District]) || {soundScape: ["(NONE)"]};
        const site = (Session.Site && C.LOCATIONS[Session.Site]) || {soundScape: ["(NONE)"]};
        const locSounds = {
            District: dist.soundScape[0],
            Site: site.soundScape[0]
        };
        if (Session.Mode === "Inactive")
            return OFFSTACK(funcID) && false;
        if (Object.values(locSounds).includes("(TOTALSILENCE)"))
            return OFFSTACK(funcID) && "TOTALSILENCE";
        if (locSounds.Site && locSounds.Site !== "(NONE)")
            return OFFSTACK(funcID) && locSounds.Site;
        if (locSounds.District && locSounds.District !== "(NONE)" && Session.IsOutside)
            return OFFSTACK(funcID) && locSounds.District;
        return OFFSTACK(funcID) && false;
    };
    const sendVolumeAlert = () => {
        const trackObjs = getPlayingTrackObjs();
        const volSettingsKeys = [];
        const playingVolumeData = [];
        for (const trackObj of getPlayingTrackObjs()) {
            const volumeData = getVolumeData(trackObj, Session.Mode === "Inactive");
            volSettingsKeys.push(volumeData.playlist, volumeData.track);
            DB({volumeData}, "getVolumeData");
            const startKey = Object.keys(volumeData.volume).find((x) => x.startsWith("startVol"));
            const [startMainKey, startSubKey] = startKey.split("-");
            const volLine = [`<b>[<u>${volumeData.volume[startKey]}</u>]</b> (${startSubKey})`];
            const multLine = [];
            for (const [multKey, mult] of Object.entries(volumeData.volume.mults))
                multLine.push(`${mult} (${multKey})`);
            volLine.push(multLine.join(" × "));
            volLine.push(`<b>[<u>${volumeData.volume.finalVol}</u> ?= <u>${trackObj.get("volume")}</u>]</b>`);
            playingVolumeData.push(`<h5>${volumeData.playlist}: ${volumeData.track}</h5>`);
            playingVolumeData.push(`${volLine.join(" ► ")}<br>`);
        }
        const volumeSettingsData = _.pick(STATE.REF.VOLUME, "base", "MasterVolumeMult", "MULTS", ...volSettingsKeys);
        if (playingVolumeData.join("").includes("(in"))
            volumeSettingsData.MULTS.Inside = _.pick(volumeSettingsData.MULTS.Inside, "base", ...volSettingsKeys);
        else
            volumeSettingsData.MULTS = _.omit(volumeSettingsData.MULTS, "Inside");
        if (playingVolumeData.join("").includes("(rain"))
            volumeSettingsData.MULTS.Raining = _.pick(volumeSettingsData.MULTS.Raining, "base", ...volSettingsKeys);
        else
            volumeSettingsData.MULTS = _.omit(volumeSettingsData.MULTS, "Raining");
        if (_.isEmpty(volumeSettingsData.MULTS))
            delete volumeSettingsData.MULTS;
        D.Alert(
            [
                "<h3>VOLUME SETTINGS</h3>",
                D.JS(volumeSettingsData, true, true),
                "<h3>PLAYING TRACK VOLUME</h3>",
                playingVolumeData.join(""),
                "<h3>SYNTAX</h3>",
                "<b>!sound inc (track/list)</b><br>",
                "<b>!sound dec (track/list)</b><br>",
                "<b>!sound set volume base (baseVolume)</b><br>",
                "<b>!sound set volume (track/list) (volume)</b><br>",
                "<b>!sound set mult master (masterMult)</b><br>",
                "<b>!sound set mult rain (track/list) (rainMult)</b><br>",
                "<b>!sound set mult indoor (track/list) (indoorMult)</b>"
            ].join(""),
            "Current Volume"
        );
    };
    // #endregion

    // #region SETTERS: Registration & Setting Parameters
    const regTrack = (trackObj) => {
        if (VAL({obj: trackObj})) {
            const trackKey = parseKeyFromTitle(trackObj);
            if (trackKey in REGISTRY.Tracks) {
                D.Alert(
                    `Attempt to overwrite already-registered track: ${D.JS(trackKey)}<br><br>Track names must be unique in jukebox!`,
                    "regTrack"
                );
            } else {
                REGISTRY.Tracks[trackKey] = {
                    id: trackObj.id,
                    name: trackKey,
                    playlists: [],
                    playModes: {},
                    isPlaying: false,
                    masterPlaylist: false
                };
                setPlayModes(trackObj);
            }
        }
    };
    const regPlaylist = (playlistKey, trackRefs = [], playModes = {}) => {
        REGISTRY.Playlists[playlistKey] = {
            name: playlistKey,
            trackKeys: trackRefs.map((x) => getTrackKey(x)),
            playModes,
            currentTracks: [],
            isPlaying: false,
            trackSequence: []
        };
        for (const trackKey of REGISTRY.Playlists[playlistKey].trackKeys)
            REGISTRY.Tracks[trackKey].playlists.push(playlistKey);
        setPlayModes(playlistKey);
    };
    const setPlayModes = (soundRef, playModes = {}) => {
        // for TRACKS: {isLooping}
        // for PLAYLISTS: {isRandom, isTogether, isLooping, isPlayingAll}
        // isRandom:                             Plays one track randomly, then stops. (= "Play Once" in jukeboxData)
        // isRandom + isLooping:                 Plays one track chosen at random repeatedly. (= Playlist Name ends with "[RandomOnce]")
        // isRandom + isPlayingAll:              Plays each track once in a random order, then stops. (= Playlist Name ends with "[ShuffleOnce]")
        // isRandom + isLooping + isPlayingAll:  Plays each track once in a random order, then repeats. (= "Shuffle" in jukeboxData)
        // isLooping:                            Sets all contained tracks to loop when manually selected. (= Playlist Name ends with "[LoopEach]")
        // isLooping + isPlayingAll:             Plays each track in sequence, then repeats. (= "Loop" in jukeboxData)
        // isPlayingAll:                         Plays each track in sequence, then stops. (= Playlist Name ends with "[SequenceOnce]")
        // isTogether:                           Plays all tracks simultaneously once. (= "Simulplay" in jukeboxData)
        const soundKey = getSoundKey(soundRef);
        if (isTrack(soundKey)) {
            const trackData = getTrackData(soundKey);
            const trackObj = getTrackObj(soundKey);
            Object.assign(trackData.playModes, C.SOUNDMODES[soundKey] || C.SOUNDMODES.TrackDefault, trackData.playModes, playModes);
            trackObj.set({loop: Boolean(trackData.playModes.isLooping), volume: getVolume(trackData.name)});
        } else if (isPlaylist(soundKey)) {
            const playlistData = getPlaylistData(soundKey);
            playlistData.playModes = Object.assign(
                {},
                C.SOUNDMODES[soundKey] || C.SOUNDMODES.PlaylistDefault,
                playlistData.playModes,
                playModes
            );
            if (playlistData.playModes.isLooping && !playlistData.playModes.isPlayingAll)
                playlistData.trackKeys.map((x) => setPlayModes(x, {isLooping: true}));
        }
    };
    const updateVolume = (soundRef) => {
        const volume = getVolume(soundRef);
        const trackObjs = [];
        if (isPlaylist(soundRef))
            trackObjs.push(...getPlaylistData(soundRef).trackKeys.map((x) => getTrackObj(x)));
        else if (isTrack(soundRef))
            trackObjs.push(getTrackObj(soundRef));
        for (const trackObj of trackObjs)
            trackObj.set({volume});
    };
    const setVolumeData = (soundRef, volume) => {
        if (soundRef === "base") {
            STATE.REF.VOLUME.base = D.Float(volume, 3);
        } else {
            const soundKey = getSoundKey(soundRef);
            if (soundKey)
                STATE.REF.VOLUME[soundKey] = D.Float(volume, 3);
        }
        syncSoundscape();
    };
    const setMasterVolumeMult = (volumeMult) => {
        STATE.REF.VOLUME.MasterVolumeMult = D.Float(volumeMult, 2);
        syncSoundscape();
    };
    const setInsideMult = (soundRef, volumeMult) => {
        if (soundRef === "base") {
            STATE.REF.VOLUME.MULTS.Inside.base = D.Float(volumeMult, 2);
        } else {
            const soundKey = getSoundKey(soundRef);
            if (soundKey)
                STATE.REF.VOLUME.MULTS.Inside[soundKey] = D.Float(volumeMult, 2);
        }
        syncSoundscape();
    };
    const setRainMult = (soundRef, volumeMult) => {
        if (soundRef === "base") {
            STATE.REF.VOLUME.MULTS.Raining.base = D.Float(volumeMult, 2);
        } else {
            const soundKey = getSoundKey(soundRef);
            if (soundKey)
                STATE.REF.VOLUME.MULTS.Raining[soundKey] = D.Float(volumeMult, 2);
        }
        syncSoundscape();
    };
    // #endregion

    // #region CONTROLLERS: Playing & Stopping Sounds, Playing Next Sound
    const playSound = (soundRef, masterSound) => {
        // Initializes any playlist as if playing it for the first time. To preserve sequences, use playNextSound()
        if (STATE.REF.isSoundscapeActive) {
            const soundKey = getSoundKey(soundRef);
            // DB(
            //     {
            //         soundRef,
            //         masterSound,
            //         volume: getVolume(soundKey),
            //         realVolume: (getTrackObj(soundKey) || {get: () => false}).get("volume")
            //     },
            //     "playSound"
            // );
            if (STATE.REF.playSoundLog.length > 100)
                STATE.REF.playSoundLog.shift();
            const logIndex = STATE.REF.playSoundLog.length;
            STATE.REF.playSoundLog.push({"~~PARAMS~~": {soundRef, masterSound, soundKey}});
            STATE.REF.playSoundLog[logIndex].timeStamp = `${new Date().toLocaleDateString("en-US")} ${new Date().toLocaleTimeString("en-US")}`;
            if (isPlaylist(soundKey)) {
                STATE.REF.playSoundLog[logIndex].soundType = "PLAYLIST";
                const playlistData = getPlaylistData(soundKey);
                const {trackKeys} = playlistData;
                STATE.REF.playSoundLog[logIndex].playlistData = {fullData: playlistData};
                if (!playlistData.trackSequence.length) {
                    STATE.REF.playSoundLog[logIndex].playlistData.trackSequenceLength = "ZERO";
                    // if (playlistData.cur rentTracks.length === playlistData.trackKeys.length)
                    //     playlistData.cur rentTracks = [];
                    if (playlistData.playModes.isRandom) {
                        STATE.REF.playSoundLog[logIndex].playlistData.playMode = "RANDOM";
                        playlistData.trackSequence = _.shuffle(trackKeys).filter((x) => !playlistData.currentTracks.includes(x)); // OK for only one UNLESS "isTogether"
                    } else {
                        STATE.REF.playSoundLog[logIndex].playlistData.playMode = "NOT RANDOM";
                        playlistData.trackSequence = D.Clone(trackKeys).filter((x) => !playlistData.currentTracks.includes(x)); // OK for only one UNLESS "isTogether"
                    }
                    STATE.REF.playSoundLog[logIndex].playlistData.newTrackSequence = playlistData.trackSequence;
                    STATE.REF.playSoundLog[logIndex]["###-RETURN-### !!!RECURRING ONCE!!!"] = {soundRef: playlistData.name, masterSound};
                    return playSound(playlistData.name, masterSound);
                }
                if (playlistData.playModes.isTogether) {
                    STATE.REF.playSoundLog[logIndex].playlistData.playMode = "TOGETHER";
                    STATE.REF.playSoundLog[logIndex]["!!!RECURRING ALL!!!"] = playlistData.trackKeys.map((x) => ({soundRef: x, masterSound: playlistData.name}));
                    playlistData.trackKeys.map((x) => playSound(x, playlistData.name));
                } else {
                    STATE.REF.playSoundLog[logIndex].playlistData.playMode = "NOT TOGETHER";
                    STATE.REF.playSoundLog[logIndex].playlistData["!!!RECURRING ONCE - PUSH TO currentTracks!!!"] = {soundRef: playlistData.trackSequence[0], masterSound: playlistData.name};
                    playlistData.currentTracks = [playSound(playlistData.trackSequence.shift(), playlistData.name)];
                    // playlistData.cur rentTracks.push(playSound(playlistData.trackSequence.shift(), playlistData.name));
                }
                playlistData.isPlaying = true;
                STATE.REF.playSoundLog[logIndex]["###-RETURN-### true"] = true;
                return true;
            } else if (isTrack(soundKey)) {
                STATE.REF.playSoundLog[logIndex].soundType = "TRACK";
                // RE: PLAYING, LOOP, SOFTSTOP:
                //      'softstop' MUST be false for track to play at all.
                //      'softstop' will be set to TRUE when track finishes playing UNLESS 'loop' is set true.
                //      a track that is manually stopped will NOT have softstop set TRUE (only 'playing' set false)
                //  So....
                //    a playing, looping track will be {playing: true, loop: true, softstop: false} ALWAYS.
                //    a playing, NON-looping track will be {playing: true, loop: false, softstop: false} THEN {playing: false, softstop: true} when it finishes.
                //  IF...
                //    a playing track's softstop is set TRUE, it will stop immediately.
                //    a playing track's playing is set FALSE, it will stop immediately.
                const trackData = getTrackData(soundKey);
                trackData.isPlaying = true;
                trackData.masterPlaylist = masterSound || false;
                getTrackObj(soundKey).set({playing: true, softstop: false, volume: getVolume(soundKey)});
                STATE.REF.activeSounds = _.uniq([...STATE.REF.activeSounds, masterSound || soundKey]);
                STATE.REF.playSoundLog[logIndex]["###-RETURN-### soundKey"] = soundKey;
                return soundKey;
            }
        }
        return false;
    };
    const stopSound = (soundRef, trackKey) => {
        DB({soundRef}, "stopSound");
        const soundKey = getSoundKey(soundRef);
        STATE.REF.activeSounds = _.without(STATE.REF.activeSounds, soundKey);
        if (isPlaylist(soundKey)) {
            const playlistData = getPlaylistData(soundKey);
            const curTracks = [...playlistData.currentTracks];
            if (trackKey) {
                playlistData.currentTracks = _.without(playlistData.currentTracks, trackKey);
                playlistData.isPlaying = Boolean(playlistData.currentTracks.length);
                stopSound(trackKey);
            } else {
                playlistData.currentTracks = [];
                playlistData.isPlaying = false;
                curTracks.map((x) => stopSound(x));
            }
        } else if (isTrack(soundKey)) {
            const trackData = getTrackData(soundKey);
            if (trackData.masterPlaylist && REGISTRY.Playlists[trackData.masterPlaylist].currentTracks.includes(soundKey)) {
                stopSound(trackData.masterPlaylist, soundKey);
            } else {
                trackData.isPlaying = false;
                trackData.masterPlaylist = false;
                getTrackObj(soundKey).set({playing: false, softstop: false});
            }
        }
    };
    const syncSoundscape = (isResetting = false) => {
        if (Session.Mode === "Complications")
            return;
        if (isResetting) {
            [...Object.keys(REGISTRY.Playlists), ...Object.keys(REGISTRY.Tracks)].map((x) => stopSound(x));
            STATE.REF.activeSounds = [];
        }
        let activeSounds;
        if (Session.IsCasaLomaActive) {
            DB({casaLomaActive: Session.IsCasaLomaActive}, "syncSoundscape");
            const [activeSite] = Session.Site;
            activeSounds = activeSite in CASALOMASOUNDS ? Object.keys(CASALOMASOUNDS[activeSite].activeSounds) : [];
            if (activeSounds.length) {
                STATE.REF.outsideOverride = CASALOMASOUNDS[activeSite].isOutside;
                STATE.REF.volumeMults = CASALOMASOUNDS[activeSite].activeSounds;
                if (STATE.REF.outsideOverride)
                    activeSounds.push(...getWeatherSounds(true));
            }
            activeSounds = _.compact(activeSounds);
        } else {
            STATE.REF.outsideOverride = null;
            STATE.REF.volumeMults = {};
            activeSounds = _.compact([getScore(), getLocationSounds(), ...getWeatherSounds()]);
        }
        const soundsToStop = STATE.REF.activeSounds.filter((x) => !activeSounds.includes(x));
        const soundsToPlay = activeSounds.filter((x) => !STATE.REF.activeSounds.includes(x));
        const soundsToCheck = activeSounds.filter((x) => STATE.REF.activeSounds.includes(x));
        // DB({CasaLoma: Session.IsCasaLomaActive, outsideOverride: STATE.REF.outsideOverride, activeSounds, volumeMults: STATE.REF.volumeMults, soundsToStop, soundsToPlay, soundsToCheck}, "syncSoundscape");
        soundsToStop.map((x) => stopSound(x));
        soundsToPlay.map((x) => playSound(x));
        const volumeChanges = [];
        for (const soundKey of soundsToCheck) {
            updateVolume(soundKey);
            // const trackObj = getTrackObj(soundKey);
            // const newVolume = getVolume(soundKey);
            // trackObj.set({volume: getVolume(soundKey)});
            volumeChanges.push({soundKey, trackObj: getTrackKey(soundKey), realVolume: getTrackObj(soundKey).get("volume")});
        }
        if (D.WatchList.includes("syncWatch"))
            sendVolumeAlert();
        DB({volumeChanges: D.JS(volumeChanges.map((x) => D.JS(x))), CasaLoma: Session.IsCasaLomaActive, outsideOverride: STATE.REF.outsideOverride, activeSounds, volumeMults: STATE.REF.volumeMults, soundsToStop, soundsToPlay, soundsToCheck}, "syncSoundscape");
    };
    const startSoundscape = (isResetting = false) => {
        STATE.REF.isSoundscapeActive = true;
        syncSoundscape(isResetting);
    };
    const stopSoundscape = () => {
        STATE.REF.isSoundscapeActive = false;
        for (const soundKey of STATE.REF.activeSounds)
            stopSound(soundKey);
    };
    const playNextSound = (trackRef) => {
        // Playlist must have been initialized for sequencing: First play should be with playSound()
        if (STATE.REF.isSoundscapeActive) {
            const trackData = getSoundData(trackRef);
            if (trackData.playModes.isLooping && STATE.REF.activeSounds.includes(trackData.name)) {
                playSound(trackData.name);
            } else {
                const playlistData = getPlaylistData(trackData.name);
                if (playlistData && STATE.REF.activeSounds.includes(playlistData.name))
                    if ((playlistData.playModes.isPlayingAll && playlistData.trackSequence.length) || playlistData.playModes.isLooping) {
                        playSound(playlistData.name);
                    } else {
                        stopSound(playlistData.name, trackData.name);
                    }
                else
                    stopSound(trackData.name);
            }
        }
    };
    // #endregion

    return {
        CheckInstall: checkInstall,
        OnChatCall: onChatCall,
        OnTrackChange: onTrackChange,

        Sync: syncSoundscape,
        Play: playSound,
        Stop: stopSound
    };
})();

on("ready", () => {
    Soundscape.CheckInstall();
    D.Log("Soundscape Ready!");
});
void MarkStop("Soundscape");
