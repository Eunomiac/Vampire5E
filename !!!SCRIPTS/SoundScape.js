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
        STATE.REF.isSoundscapeActive = STATE.REF.isSoundscapeActive !== false;
        STATE.REF.activeSounds = STATE.REF.activeSounds || [];
        STATE.REF.VOLUME = Object.assign({}, C.SOUNDVOLUME, STATE.REF.VOLUME || {});
        STATE.REF.SoundscapeLog = STATE.REF.SoundscapeLog || [];
        initSoundLog();

        STATE.REF.soundsFading = STATE.REF.soundsFading || {};
        STATE.REF.fadeStepTime = STATE.REF.fadeStepTime || 500;
        STATE.REF.fadeDuration = STATE.REF.fadeDuration || 5000;
        STATE.REF.fadeLeadTime = STATE.REF.fadeLeadTime || 5000;
        STATE.REF.maxFadeStep = STATE.REF.maxFadeStep || 1;

        STATE.REF.scoreOverride = "ScoreMain";
        D.Flag("Score Override: ScoreMain");

        for (const [trackKey, fadeData] of Object.entries(STATE.REF.soundsFading))
            fadeTrackObj(trackKey, fadeData.targetVol, fadeData.startVol);

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
                if (args[0] === "casaloma") { // !sound inc casaloma <scoreVolMult> <delayTillFade> <targetVol>
                    args.shift();
                    CASALOMASOUNDS.CLGreatHall.activeSounds.ScoreCasaLoma = D.Float(args.shift(), 2);
                    C.SITES.CLGreatHall.onEntryCall = null;
                    Media.ToggleText("HubAspectsNotice", true);
                    Media.ToggleText("HubAspectsTitle", true);
                    syncSoundscape();
                    if (args.length) {
                        const [delayTimeArg, targetVolArg] = args.map((x) => D.Float(x, 2));
                        const playlistData = getPlaylistData("ScoreCasaLoma");
                        const trackKey = [...playlistData.currentTracks, ...playlistData.trackSequence, ...playlistData.trackKeys][0];
                        let trackObj = getTrackObj(trackKey);
                        if (isTrackObjPlaying(trackObj)) {
                            fadeTrackObj(trackObj, targetVolArg, undefined, delayTimeArg * 1000);
                        } else {
                            playSound("ScoreCasaLoma");
                            trackObj = getTrackObj(getPlaylistData("ScoreCasaLoma").currentTracks[0]);
                            fadeTrackObj(trackObj, targetVolArg, undefined, (delayTimeArg + 3) * 1000);
                        }
                        CASALOMASOUNDS.CLGreatHall.activeSounds.ScoreCasaLoma = 1;
                        CASALOMASOUNDS.CLVestibule.activeSounds.ScoreCasaLoma = 0.5;
                    }
                } else if (args[0]) {
                    const baseVolume = STATE.REF.VOLUME[args[0]] || STATE.REF.VOLUME.base;
                    const newVolume = Math.min(baseVolume + 10, baseVolume * 2);
                    setVolumeData(args[0], newVolume);
                    updateVolume(args[0]);
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
                    updateVolume(args[0]);
                    D.Alert(`Volume of <b>${D.JS(args[0])}</b>: ${baseVolume} >>> ${newVolume}`, "Decrease Volume");
                }
                break;
            }
            case "get": {
                switch (D.LCase((call = args.shift()))) {
                    case "log": printSoundLog(); break;
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
            case "reset": case "clear": {
                if (args[0] === "log") {
                    clearSoundLog();
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
                SoftIndoor: 1,
                ScoreCasaLoma: 0.5
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
                                    isPlayingAll: ["s", "b"].includes(v),
                                    isOverloopOK: v === "a"
                                };
                            default:
                                return v;
                        }
                    }
                );
                DB({xData}, "importFromJukebox");
                const listTags = ((xData.name.match(/\[([^\]]*)\]$/u) || []).pop() || "").split(/, ?/gu);
                for (const listTag of listTags)
                    switch (listTag) {
                        // for PLAYLISTS: {isRandom, isTogether, isLooping, isPlayingAll}
                        // isRandom:                             Plays one track randomly, then stops. (= "Play Once" in jukeboxData)
                        // isRandom + isLooping:                 Plays one track chosen at random repeatedly. (= Playlist Tags include "RandomOnce")
                        // isRandom + isPlayingAll:              Plays each track once in a random order, then stops. (= Playlist Tags include "ShuffleOnce")
                        // isRandom + isLooping + isPlayingAll:  Plays each track once in a random order, then repeats. (= "Shuffle" in jukeboxData)
                        // isLooping:                            Sets all contained tracks to loop when manually selected. (= Playlist Tags include "LoopEach")
                        // isLooping + isPlayingAll:             Plays each track in sequence, then repeats. (= "Loop" in jukeboxData)
                        // isPlayingAll:                         Plays each track in sequence, then stops. (= Playlist Tags include "Sequence")
                        // isTogether:                           Plays all tracks simultaneously once. (= "Simulplay" in jukeboxData)
                        // isOverloopOK:                         OK for more than one track to play at a time (i.e. won't stop a sound just because another was played). (= Playlist Tags include "Overloop")
                        case "LoopEach": {
                            Object.assign(xData.playModes, {isLooping: true, isPlayingAll: false});
                            break;
                        }
                        case "Sequence": {
                            Object.assign(xData.playModes, {isRandom: false, isTogether: false, isPlayingAll: true});
                            break;
                        }
                        case "RandomOnce": {
                            Object.assign(xData.playModes, {isLooping: true, isRandom: true, isTogether: false, isPlayingAll: false});
                            break;
                        }
                        case "ShuffleOnce": {
                            Object.assign(xData.playModes, {isLooping: false, isRandom: true, isTogether: false, isPlayingAll: true});
                            break;
                        }
                        case "Overloop": {
                            Object.assign(xData.playModes, {isOverloopOK: true});
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
    const getTrackKey = (soundRef, isGettingAllTracks = false, isGettingAllPlayingTracks = false) => {
        const funcID = ONSTACK();
        if (isTrack(soundRef))
            return OFFSTACK(funcID) && getSoundKey(soundRef);
        else if (isPlaylist(soundRef))
            if (isGettingAllTracks)
                return OFFSTACK(funcID) && getSoundData(soundRef).trackKeys;
            else if (isGettingAllPlayingTracks)
                return OFFSTACK(funcID) && getSoundData(soundRef).currentTracks;
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
    const getTrackObjs = (soundRef, isPlayingOnly = true) => _.flatten([getTrackKey(soundRef, !isPlayingOnly, isPlayingOnly)]).map((x) => getTrackObj(x));
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
    const log = (logData) => {
        if (STATE.REF.SoundscapeLog.length > 300)
            STATE.REF.SoundscapeLog.length = 200;
        const logIndex = STATE.REF.SoundscapeLog.length;
        STATE.REF.SoundscapeLog[logIndex] = {
            time: (new Date()).getTime() - 1000 * 60 * 60 * 4,
            content: D.JS(logData).replace(/^("|&quot;)*/gu, "").replace(/("|&quot;)*$/gu, "")
        };
    };
    const initSoundLog = () => {
        STATE.REF.SoundscapeLog.push({
            time: (new Date()).getTime() - 1000 * 60 * 60 * 4,
            content: "FRESHREBOOT"
        });
    };
    const printSoundLog = () => {
        let lastTimeStamp = 0;
        const logStrings = [];
        for (let i = 0; i < STATE.REF.SoundscapeLog.length; i++) {
            const {time, content} = STATE.REF.SoundscapeLog[i];
            const dateObj = new Date(new Date(time).toLocaleString("en-US", {timezone: "America/New_York"}));
            const secs = dateObj.getSeconds();
            if ((time - lastTimeStamp) > 8 * 60 * 60 * 1000)
                logStrings.push(`<h2 style="background-color: rgb(150, 150, 150); border-top: 1px solid black; border-bottom: 1px solid black;">${TimeTracker.FormatDate(dateObj, true)}</h2>`);
            else if ((time - lastTimeStamp) > 60 * 60 * 1000 || content === "FRESHREBOOT")
                logStrings.push(`<h3>${TimeTracker.FormatTime(dateObj, false)}</h3>`);
            lastTimeStamp = time;
            if (content !== "FRESHREBOOT")
                logStrings.push(`<div style="display: block; background-color: rgba(0, 0, 0, ${i % 2 === 0 ? "0" : "0.2"}); border-bottom: 1px solid rgb(200, 200, 200);">[${
                    TimeTracker.FormatTime(dateObj, false).replace(/ /u, `:${secs} `)
                }]<br>${
                    content
                }</div>`);
        }
        Handouts.Make("Soundscape Log", null, logStrings.join(""), false, false, true);
    };
    const clearSoundLog = () => {
        printSoundLog();
        STATE.REF.SoundscapeLog = [];
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
        // isOverloopOK:                         OK for more than one track to play at a time (i.e. won't stop a sound just because another was played).
        const soundKey = getSoundKey(soundRef);
        if (isTrack(soundKey)) {
            const trackData = getTrackData(soundKey);
            const trackObj = getTrackObj(soundKey);
            Object.assign(trackData.playModes, C.SOUNDMODES[soundKey] || C.SOUNDMODES.TrackDefault, trackData.playModes, playModes);
            trackObj.set({loop: Boolean(trackData.playModes.isLooping)});
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
    const setVolumeData = (soundRef, volume) => {
        if (soundRef === "base") {
            STATE.REF.VOLUME.base = D.Float(volume, 3);
            syncSoundscape();
        } else {
            const soundKey = getSoundKey(soundRef);
            if (soundKey) {
                STATE.REF.VOLUME[soundKey] = D.Float(volume, 3);
                updateVolume(soundRef);
            }
        }
    };
    const setMasterVolumeMult = (volumeMult) => {
        STATE.REF.VOLUME.MasterVolumeMult = D.Float(volumeMult, 2);
        syncSoundscape();
    };
    const setInsideMult = (soundRef, volumeMult) => {
        if (soundRef === "base") {
            STATE.REF.VOLUME.MULTS.Inside.base = D.Float(volumeMult, 2);
            syncSoundscape();
        } else {
            const soundKey = getSoundKey(soundRef);
            if (soundKey) {
                STATE.REF.VOLUME.MULTS.Inside[soundKey] = D.Float(volumeMult, 2);
                updateVolume(soundRef);
            }
        }
    };
    const setRainMult = (soundRef, volumeMult) => {
        if (soundRef === "base") {
            STATE.REF.VOLUME.MULTS.Raining.base = D.Float(volumeMult, 2);
            syncSoundscape();
        } else {
            const soundKey = getSoundKey(soundRef);
            if (soundKey) {
                STATE.REF.VOLUME.MULTS.Raining[soundKey] = D.Float(volumeMult, 2);
                updateVolume(soundRef);
            }
        }
    };
    // #endregion

    // #region CONTROLLERS: Playing & Stopping Sounds, Playing Next Sound
    const playSound = (soundRef, masterSound, isCyclingToNext = false) => {
        // Initializes any playlist as if playing it for the first time. To preserve sequences, use playNextSound()
        if (STATE.REF.isSoundscapeActive !== false) {
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
            const logPackage = {};
            log({"~~PARAMS~~": {soundRef, masterSound, soundKey}});
            if (isPlaylist(soundKey)) {
                logPackage.soundType = "PLAYLIST";
                const playlistData = getPlaylistData(soundKey);
                const {trackKeys} = playlistData;
                logPackage.playlistData = {fullData: D.Clone(playlistData)};
                // First, check to see if this playlist has any currentTracks playing:
                if (playlistData.currentTracks.length) {
                    const [topSound, ...otherSounds] = playlistData.currentTracks;
                    logPackage.playlistData.topSound = topSound;
                    logPackage.playlistData.otherSounds = D.Clone(otherSounds);
                    // If MORE THAN ONE currentTrack in a playlist that can't do that, fix the problem.
                    if (otherSounds.length && !playlistData.playModes.isOverloopOK) {
                        logPackage["!!!STOPPING EXCESS SOUNDS!!!"] = ["ERROR: TOO MANY TRACKS PLAYING! STOPPING EXCESS...", ...otherSounds];
                        otherSounds.forEach((x) => stopSound(playlistData.name, x));
                    }
                    // If isCyclingToNext, stop all current tracks then recur so a new one can be chosen.
                    if (isCyclingToNext) {
                        logPackage["!!!CYCLING TO NEXT: RECURRING after STOPPING ALL PLAYING TRACKS!!!"] = D.Clone(playlistData.currentTracks);
                        playlistData.currentTracks.forEach((x) => stopSound(playlistData.name, x));
                        log(logPackage);
                        return playSound(soundKey, masterSound);
                    } else {
                        // Check to see if any of the sounds that are supposed to be playing aren't.
                        const soundsToPlay = playlistData.currentTracks.filter((x) => !isTrackObjPlaying(getTrackObj(x)));
                        logPackage["!!!PLAYLIST ALREADY PLAYING and NOT CYCLING TO NEXT: RECURRING THROUGH ACTIVE SOUNDS THAT AREN'T PLAYING!!!"] = [...soundsToPlay];
                        soundsToPlay.forEach((x) => playSound(x, playlistData.name));
                        // Finally, if Overlooping is okay, proceed to play another track. Otherwise, return without changing anything else.
                        if (!playlistData.playModes.isOverloopOK) {
                            logPackage["###-RETURN-### NOT CYCLING & OVERLOOP NOT OKAY; CURRENTTRACK SHOULD ONE, AND BE ENOUGH!"] = [...playlistData.currentTracks];
                            log(logPackage);
                            return false;
                        }
                    }
                }
                logPackage["PROCEEDING TO TRACKSEQUENCE: CURRENTTRACKS SHOULD BE OKAY"] = {
                    ShouldBePlaying: [...playlistData.currentTracks],
                    ShouldBeLength: playlistData.playModes.isOverloopOK ? "Overloop OK" : "ZERO"
                };
                if (!playlistData.trackSequence.length) {
                    logPackage.playlistData["TRACK SEQUENCE EMPTY"] = "REGENERATING...";
                    if (playlistData.playModes.isRandom) {
                        logPackage.playlistData.playMode = "RANDOM";
                        playlistData.trackSequence = _.shuffle(trackKeys).filter((x) => !playlistData.currentTracks.includes(x)); // OK for only one UNLESS "isTogether"
                    } else {
                        logPackage.playlistData.playMode = "NOT RANDOM";
                        playlistData.trackSequence = D.Clone(trackKeys).filter((x) => !playlistData.currentTracks.includes(x)); // OK for only one UNLESS "isTogether"
                    }
                    if (playlistData.trackSequence.length === 0) {
                        logPackage.playlistData["###-RETURN-### ERROR: ALL TRACKS ALREADY PLAYING! UNABLE TO PLAY SOUND!"] = {
                            currentTracks: D.Clone(playlistData.currentTracks),
                            trackKeys: D.Clone(trackKeys)
                        };
                        log(logPackage);
                        return false;
                    }
                    logPackage.playlistData["NEW TRACK SEQUENCE OKAY!"] = [...playlistData.trackSequence];
                    logPackage["###-RETURN-### !!!RECURRING with FULL TRACKSEQUENCE!!!"] = {soundRef: playlistData.name, masterSound};
                    log(logPackage);
                    return playSound(playlistData.name, masterSound);
                }
                if (playlistData.playModes.isTogether) {
                    logPackage.playlistData.playMode = "TOGETHER";
                    logPackage["!!!RECURRING THROUGH ALL TO PLAY TOGETHER!!!"] = playlistData.trackKeys.map((x) => ({soundRef: x, masterSound: playlistData.name}));
                    playlistData.trackKeys.map((x) => playSound(x, playlistData.name));
                } else {
                    logPackage.playlistData.playMode = "NOT TOGETHER";
                    logPackage.playlistData["!!!RECURRING THROUGH NEXT SOUND: PUSH TO CURRENTTRACKS!!!"] = {soundRef: playlistData.trackSequence[0], masterSound: playlistData.name};
                    playlistData.currentTracks.push(playSound(playlistData.trackSequence.shift(), playlistData.name));
                }
                playlistData.isPlaying = true;
                logPackage["###-RETURN-### true"] = true;
                log(logPackage);
                return true;
            } else if (isTrack(soundKey)) {
                logPackage.soundType = "TRACK";
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
                const trackObj = getTrackObj(soundKey);
                if (trackObj) {
                    const trackVolume = isTrackObjPlaying(trackObj) ? trackObj.get("volume") : 0;
                    fadeTrackObj(trackObj, getVolume(soundKey));
                }
                STATE.REF.activeSounds = _.uniq([...STATE.REF.activeSounds, masterSound || soundKey]);
                logPackage["###-RETURN-### soundKey"] = soundKey;
                log(logPackage);
                return soundKey;
            }
        }
        log(`SOUNDSCAPE INACTIVE: IGNORING PLAYSOUND(${D.JS(soundRef)})`);
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
                curTracks.forEach((x) => stopSound(x));
            }
        } else if (isTrack(soundKey)) {
            const trackData = getTrackData(soundKey);
            if (trackData.masterPlaylist && REGISTRY.Playlists[trackData.masterPlaylist].currentTracks.includes(soundKey)) {
                stopSound(trackData.masterPlaylist, soundKey);
            } else {
                trackData.isPlaying = false;
                trackData.masterPlaylist = false;
                fadeTrackObj(trackData.name, 0);
            }
        }
    };
    const updateVolume = (soundRef) => {
        const volume = getVolume(soundRef);
        const trackObjs = [];
        if (isPlaylist(soundRef))
            trackObjs.push(...getPlaylistData(soundRef).currentTracks.map((x) => getTrackObj(x)));
        else if (isTrack(soundRef))
            trackObjs.push(getTrackObj(soundRef));
        for (const trackObj of trackObjs)
            fadeTrackObj(trackObj, volume);
    };
    const clearFade = (trackKey) => {
        if (trackKey && (trackKey in STATE.REF.soundsFading))
            delete STATE.REF.soundsFading[trackKey];
    };
    const fadeTrackObj = (soundRef, targetVol, startVol, fadeLeadTime) => {
        const trackObj = getTrackObj(soundRef);
        const trackKey = getTrackKey(soundRef);
        const logPackage = {
            [`### fadeTrackObj(${D.JS(soundRef)}, ${D.JS(targetVol)}, ${D.JS(startVol)}, ${D.JS(fadeLeadTime)}) ###`]: {
                trackKey,
                currentVolume: trackObj.get("volume"),
                targetVol,
                startVol
            }
        };
        if (trackKey && trackObj) {
            const curVol = D.Float(trackObj.get("volume"), 2);
            startVol = (startVol || startVol === 0) ? startVol : curVol;
            const isSoundFading = trackKey in STATE.REF.soundsFading && STATE.REF.soundsFading.timer;
            STATE.REF.soundsFading[trackKey] = {targetVol, startVol};
            // If trackObj is ALREADY PLAYING:
            if (isTrackObjPlaying(trackObj)) {
                // First check to see if a fade is even necessary.  If not, stop sound and delete from fade registry.
                if (curVol === targetVol) {
                    logPackage["NO FADE NEEDED: curVol === targetVol"] = {curVol, targetVol};
                    if (targetVol === 0) {
                        trackObj.set({playing: false, softstop: false});
                        logPackage["STOPPING SOUND"] = D.JS(trackObj);
                    }
                    clearFade(trackKey);
                    log(logPackage);
                    return false;
                }
                // Second, check to see if the sound is already being faded.  If so, just change the fade registry data so
                // the fadeStep function will update on its next iteration with the new data.
                // Clear the timer, and set a new timer with a lead time equal to the standard step so it continues smoothly.
                if (isSoundFading) {
                    logPackage["SOUND ALREADY FADING: UPDATING STATE DATA, RESETTING FADE"] = {startVol: trackObj.get("volume"), targetVol, curVol};
                    STATE.REF.soundsFading[trackKey] = {
                        targetVol,
                        startVol: trackObj.get("volume")
                    };
                    fadeLeadTime = STATE.REF.fadeStepTime;
                } else {
                    // If CHANGING VOLUME (i.e. not going to zero), SKIP the default lead time UNLESS one was specified in parameters.
                    if (targetVol > 0)
                        fadeLeadTime = fadeLeadTime || 0;
                    else // OTHERWISE, apply ONE THIRD the default lead time if none specified in parameters.
                        fadeLeadTime = (fadeLeadTime || fadeLeadTime === 0) ? fadeLeadTime : (STATE.REF.fadeLeadTime / 3);
                }
            } else {
                // If trackObj is NOT PLAYING ...
                if (targetVol > 0) {
                    // ... and the target volume is greater than zero, START IT at MINIMAL VOLUME
                    trackObj.set({playing: true, softstop: false, volume: 0.1});
                    startVol = 0.1;
                    STATE.REF.soundsFading[trackKey].startVol = startVol;
                    // ... and set the lead time to the default, unless one specified
                    fadeLeadTime = (fadeLeadTime || fadeLeadTime === 0) ? fadeLeadTime : STATE.REF.fadeLeadTime;
                } else {
                    // OTHERWISE, it's not playing and the target volume is zero: No fade necessary.
                    clearFade(trackKey);
                    log(logPackage);
                    return false;
                }
            }
            const fadeStep = (fadeID) => {
                // Can't log timers to state. So, must create a random fadeID, log that, and pass it through each fadeStep timer.
                // FadeStep checks state to see if its ID is the one set for the active timer.
                // If not, it stops and does nothing.
                if (trackKey && trackObj && (trackKey in STATE.REF.soundsFading)) {
                    if (!fadeID) {
                        fadeID = D.RandomString(10);
                        STATE.REF.soundsFading[trackKey].timer = fadeID;
                    }
                    if (STATE.REF.soundsFading[trackKey].timer === fadeID) {
                        const cVol = D.Float(trackObj.get("volume"), 2);
                        targetVol = STATE.REF.soundsFading[trackKey].targetVol;
                        startVol = STATE.REF.soundsFading[trackKey].startVol;
                        const fullDeltaVol = targetVol - startVol;
                        const deltaVolStep = Math.min(fullDeltaVol / (STATE.REF.fadeDuration / STATE.REF.fadeStepTime), STATE.REF.maxFadeStep);
                        if (deltaVolStep > 0 && cVol < targetVol) {
                            log(`... [${fadeID}] Fading ${trackKey}: ${cVol} -> ${cVol + deltaVolStep}`);
                            trackObj.set({volume: Math.min(targetVol, cVol + deltaVolStep)});
                        } else if (deltaVolStep < 0 && cVol > targetVol) {
                            log(`... [${fadeID}] Fading ${trackKey}: ${cVol} -> ${cVol + deltaVolStep}`);
                            trackObj.set({volume: Math.max(targetVol, cVol + deltaVolStep)});
                        } else { // Either cVol equals targetVol OR fade has overstepped: Either way, end the fade.
                            if (targetVol === 0) {
                                log(`... [${fadeID}] ${trackKey} Fade Complete! (cVol = ${cVol}) : Stopping Track`);
                                trackObj.set({playing: false, softstop: false});
                            } else if (cVol !== targetVol) {
                                log(`... [${fadeID}] ${trackKey} Fade Overstepped? (cVol = ${cVol}, tVol = ${targetVol}, sVol = ${startVol}, fDVol = ${fullDeltaVol}, vStep = ${deltaVolStep}) : Setting Volume to ${targetVol}`);
                                trackObj.set({volume: targetVol});
                            }
                            clearFade(trackKey);
                            return false;
                        }
                        // Fade is continuing; set timer.
                        setTimeout(() => fadeStep(fadeID), STATE.REF.fadeStepTime);
                        return true;
                    } else {
                        log(`... [${fadeID}] ID Mismatch: This Timer No Longer Valid, Replaced by ${STATE.REF.soundsFading[trackKey].timer}`);
                    }
                }
                log(`... [${fadeID || "(NEW)"}] ${D.JS(trackKey)} Invalid or Not Registered in STATE.`);
                return false;
            };
            logPackage[`INITIALIZING FADE in ${D.Float(fadeLeadTime / 1000, 2)} SECONDS`] = {startVol, targetVol, curVol};
            log(logPackage);
            if (fadeLeadTime > 0)
                setTimeout(fadeStep, fadeLeadTime);
            else
                fadeStep();
            return true;
        }
        logPackage["... TRACK NOT FOUND"] = [D.JS(trackKey), D.JS(trackObj, true)];
        clearFade(trackKey);
        log(logPackage);
        return false;
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
            const trackObj = getTrackObj(soundKey);
            if (!isTrackObjPlaying(trackObj)) {
                if (isPlaylist(soundKey))
                    playSound(trackObj, getPlaylistKey(soundKey));
                else
                    playSound(trackObj);
            }
            updateVolume(soundKey);
            volumeChanges.push({soundKey, trackObj: getTrackKey(soundKey), realVolume: getTrackObj(soundKey).get("volume")});
        }
        if (D.WatchList.includes("syncWatch"))
            sendVolumeAlert();
        log([
            {
                volumeChanges: D.JS(volumeChanges.map((x) => D.JS(x))),
                CasaLoma: Session.IsCasaLomaActive,
                outsideOverride: STATE.REF.outsideOverride,
                volumeMults: STATE.REF.volumeMults
            },
            {activeSounds, soundsToStop, soundsToPlay, soundsToCheck}
        ]);
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
        const logPackage = {};
        if (STATE.REF.isSoundscapeActive !== false) {
            const trackData = getSoundData(trackRef);
            logPackage[`PLAYNEXTSOUND(${VAL({obj: trackRef}) ? getSoundKey(trackRef) : D.JS(trackRef)})`] = D.Clone(trackData);
            if (trackData.playModes.isLooping && STATE.REF.activeSounds.includes(trackData.name)) {
                logPackage.PLAYING = "Sound Is Looping AND Active";
                log(logPackage);
                playSound(trackData.name, undefined, true);
            } else {
                const playlistData = getPlaylistData(trackData.name);
                logPackage.playlistData = D.Clone(playlistData);
                if (playlistData && STATE.REF.activeSounds.includes(playlistData.name)) {
                    if ((playlistData.playModes.isPlayingAll && playlistData.trackSequence.length) || playlistData.playModes.isLooping) {
                        logPackage.PLAYINGLIST = "Playlist isPlayingAll OR isLooping";
                        log(logPackage);
                        playSound(playlistData.name, undefined, true);
                    } else {
                        logPackage.STOPPINGLIST = "Playlist NOT isPlayingAll AND NOT isLooping";
                        log(logPackage);
                        stopSound(playlistData.name, trackData.name);
                    }
                } else {
                    logPackage.STOPPING = "Sound Not Looping, Not Looping Playlist";
                    log(logPackage);
                    stopSound(trackData.name);
                }
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
