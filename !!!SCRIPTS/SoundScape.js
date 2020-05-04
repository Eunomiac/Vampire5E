void MarkStart("Soundscape")
const Soundscape = (() => {
    // ************************************** START BOILERPLATE INITIALIZATION & CONFIGURATION **************************************
    const SCRIPTNAME = "Soundscape",

    // #region COMMON INITIALIZATION
        STATE = {get REF() { return C.RO.OT[SCRIPTNAME] }},	// eslint-disable-line no-unused-vars
        VAL = (varList, funcName, isArray = false) => D.Validate(varList, funcName, SCRIPTNAME, isArray), // eslint-disable-line no-unused-vars
        DB = (msg, funcName) => D.DBAlert(msg, funcName, SCRIPTNAME), // eslint-disable-line no-unused-vars
        LOG = (msg, funcName) => D.Log(msg, funcName, SCRIPTNAME), // eslint-disable-line no-unused-vars
        THROW = (msg, funcName, errObj) => D.ThrowError(msg, funcName, SCRIPTNAME, errObj), // eslint-disable-line no-unused-vars
        ONSTACK = () => D.ONSTACK(ONSTACK),
        OFFSTACK = (funcID) => D.OFFSTACK(funcID),

        checkInstall = () => {
            C.RO.OT[SCRIPTNAME] = C.RO.OT[SCRIPTNAME] || {}
            initialize()
        },
    // #endregion

    // #region LOCAL INITIALIZATION
        initialize = () => {
            STATE.REF.trackregistry = STATE.REF.trackregistry || {}
            STATE.REF.playlistregistry = STATE.REF.playlistregistry || {}
            STATE.REF.isSoundscapeActive = VAL({bool: STATE.REF.isSoundscapeActive}) ? STATE.REF.isSoundscapeActive : true
            STATE.REF.activeSounds = STATE.REF.activeSounds || []
            STATE.REF.VOLUME = STATE.REF.VOLUME || D.Clone(C.SOUNDVOLUME)

            syncSoundscape(true)
        },
    // #endregion	

    // #region EVENT HANDLERS: (HANDLEINPUT)
        onChatCall = (call, args, objects, msg) => { // eslint-disable-line no-unused-vars
            switch (call) {
                case "initialize": importFromJukebox(); break
                case "sync": syncSoundscape(); break
                case "start": startSoundscape(args[0] === "reset"); break
                case "play": playSound(args[0]); break
                case "stop": if (args[0]) stopSound(args[0]); else stopSoundscape(); break
                case "inc": case "increase": {
                    if (args[0]) {
                        const baseVolume = STATE.REF.VOLUME[args[0]] || STATE.REF.VOLUME.base,
                            newVolume = Math.min(baseVolume + 10, baseVolume * 2)
                        setVolume(args[0], newVolume)
                        D.Alert(`Volume of <b>${D.JS(args[0])}</b>: ${baseVolume} >>> ${newVolume}`, "Increase Volume")
                    }
                    break
                }                
                case "dec": case "decrease": {
                    if (args[0]) {
                        const baseVolume = STATE.REF.VOLUME[args[0]] || STATE.REF.VOLUME.base,
                            newVolume = Math.max(baseVolume - 10, baseVolume / 2)
                        setVolume(args[0], newVolume)
                        D.Alert(`Volume of <b>${D.JS(args[0])}</b>: ${baseVolume} >>> ${newVolume}`, "Decrease Volume")
                    }
                    break
                }
                case "get": {
                    switch (D.LCase(call = args.shift())) {
                        case "volume": break
                        // no default
                    }
                }
                // falls through
                case "set": {
                    switch (D.LCase(call = args.shift())) {
                        case "volume": setVolume(...args); break
                        case "mult": {
                            switch (D.LCase(call = args.shift())) {
                                case "master": setMasterVolumeMult(args.shift()); break
                                case "rain": setRainMult(...args); break
                                case "indoor": case "inside": setInsideMult(...args); break
                                // no default
                            }
                        }
                        // no default
                    }
                    D.Alert([
                        "<h3>VOLUME SETTINGS</h3>",
                        D.JS(STATE.REF.VOLUME, true),
                        "<h3>PLAYING TRACKS</h3>",
                        getPlayingTrackObjs().map(x => `<b>${x.get("title")}:</b> ${x.get("volume")}`).join("<br>")
                    ].join(""), "Current Volume")
                    break
                }
                case "reset": {
                    if (args[0]) {
                        stopSound(args[0])
                        playSound(args[0])
                    } else {
                        syncSoundscape(true)
                    }
                    break
                }
            // no default
            }
        },
        onTrackChange = (trackObj, prevData) => {
            if (trackObj.get("softstop") && !prevData.softstop) {
                DB({
                    trackName: `${trackObj.get("title")}<br>`,
                    playing: `${prevData.playing} >> ${trackObj.get("playing")}<br>`,
                    looping: `${prevData.loop} >> ${trackObj.get("loop")}<br>`,
                    softstop: `${prevData.softstop} >> ${trackObj.get("softstop")}<br>`
                }, "onTrackChange")
                playNextSound(trackObj)   
            }         
        },
    // #endregion
    // *************************************** END BOILERPLATE INITIALIZATION & CONFIGURATION ***************************************

    // #region CONFIGURATION 
        REGISTRY = {
            get Tracks() { return STATE.REF.trackregistry },
            set Tracks(v) { STATE.REF.trackregistry = D.Clone(v) },
            get Playlists() { return STATE.REF.playlistregistry },
            set Playlists(v) { STATE.REF.playlistregistry = D.Clone(v) }
        },
    // #endregion

    // #region INITIALIZATION: Importing Sounds
        importFromJukebox = () => {
            REGISTRY.Tracks = []
            REGISTRY.Playlists = []
            const trackObjs = _.uniq(findObjs({_type: "jukeboxtrack"}))
            for (const trackObj of trackObjs)
                regTrack(trackObj)
            const jukeboxData = JSON.parse(Campaign().get("_jukeboxfolder")).map(x => {
                const xData = D.KeyMapObj(x, k => {
                    switch (k) {
                        case "i": return "trackKeys"
                        case "n": return "name"
                        case "s": return "playModes"
                        default: return k
                    }
                }, (v, k) => {
                    switch (k) {
                        case "i": return v.map(xx => parseKeyFromTitle(xx))
                        case "s": return {
                            isLooping: ["s", "b"].includes(v),
                            isRandom: ["s", "o"].includes(v),
                            isTogether: v === "a",
                            isPlayingAll: ["s", "b"].includes(v)
                        }
                        default: return v
                    }
                })
                switch ((xData.name.match(/\[([^\]]*)\]$/u) || []).pop()) {
                    case "LoopEach": {
                        xData.playModes = {
                            isLooping: true,
                            isRandom: false,
                            isTogether: false,
                            isPlayingAll: false
                        }
                        break
                    }
                    case "Sequence": {
                        xData.playModes = {
                            isLooping: false,
                            isRandom: false,
                            isTogether: false,
                            isPlayingAll: true
                        }
                        break
                    }
                    case "RandomOnce": {
                        xData.playModes = {
                            isLooping: true,
                            isRandom: true,
                            isTogether: false,
                            isPlayingAll: false
                        }
                        break
                    }
                    case "ShuffleOnce": {
                        xData.playModes = {
                            isLooping: false,
                            isRandom: true,
                            isTogether: false,
                            isPlayingAll: true
                        }
                    }
                    // no default
                }
                return xData
            })
            for (const playlistData of jukeboxData)
                regPlaylist(parseKeyFromTitle(playlistData.name), playlistData.trackKeys, playlistData.playModes)
        },
    // #endregion

    // #region GETTERS: Track & Playlist Data
        parseKeyFromTitle = (trackRef) => {
            trackRef = D.IsID(trackRef) && (getObj("jukeboxtrack", trackRef) || {get: () => false}).get("title") ||
                       VAL({obj: trackRef}) && trackRef.get("title") ||
                       VAL({string: trackRef}) && trackRef ||
                       false
            return VAL({string: trackRef}) && trackRef.replace(/\s*[([{].*[)\]}]\s*/gu, "").replace(/[^A-Za-z0-9]*/gu, "")
        },
        getSoundKey = (soundRef) => {
            const funcID = ONSTACK()
            if (VAL({string: soundRef})) {
                if (soundRef in REGISTRY.Tracks || soundRef in REGISTRY.Playlists)
                    return OFFSTACK(funcID) && soundRef
                if (D.IsID(soundRef)) {
                    const jukeObj = getObj("jukeboxtrack", soundRef)
                    if (VAL({object: jukeObj}))
                        return OFFSTACK(funcID) && parseKeyFromTitle(jukeObj.get("title"))
                }
            } else if (VAL({object: soundRef})) {
                return OFFSTACK(funcID) && parseKeyFromTitle(soundRef.get("title"))
            }
            return OFFSTACK(funcID) && false
        },     
        // getSoundKeys = (soundRefs) => _.flatten([soundRefs || []]).map(x => getSoundKey(x)),   
        getSoundData = (soundRef) => {
            const funcID = ONSTACK(),
                soundKey = getSoundKey(soundRef)
            return OFFSTACK(funcID) && REGISTRY.Tracks[soundKey] || REGISTRY.Playlists[soundKey]
        },
        isTrack = (soundRef) => getSoundKey(soundRef) in REGISTRY.Tracks,
        isPlaylist = (soundRef) => getSoundKey(soundRef) in REGISTRY.Playlists,
        getTrackKey = (soundRef, isGettingAllTracks = false) => {
            const funcID = ONSTACK()
            if (isTrack(soundRef))
                return OFFSTACK(funcID) && getSoundKey(soundRef)
            else if (isPlaylist(soundRef))
                if (isGettingAllTracks)
                    return OFFSTACK(funcID) && getSoundData(soundRef).trackKeys
                else
                    return OFFSTACK(funcID) && getSoundData(soundRef).currentTracks[0]
            return OFFSTACK(funcID) && false
        },
        getPlaylistKey = (soundRef) => {
            const funcID = ONSTACK()
            if (isTrack(soundRef)) {
                const trackKey = getTrackKey(soundRef)
                return OFFSTACK(funcID) && (
                    (Object.values(REGISTRY.Playlists).find(x => x.currentTracks.includes(trackKey)) || {name: false}).name ||
                    getTrackData(trackKey).playlists[0] ||
                    false
                )
            } else if (isPlaylist(soundRef)) {
                return OFFSTACK(funcID) && getSoundKey(soundRef)
            }
            return OFFSTACK(funcID) && false
        },
        getTrackData = (soundRef) => getSoundData(getTrackKey(soundRef)),
        getPlaylistData = (soundRef) => getSoundData(getPlaylistKey(soundRef)),
        getTrackObj = (soundRef) => getObj("jukeboxtrack", (getTrackData(soundRef) || {id: false}).id),
        getVolume = (soundRef) => {
            const trackKey = getTrackKey(soundRef),
                playlistKey = getPlaylistKey(soundRef),
                volumeMults = [STATE.REF.VOLUME.MasterVolumeMult],
                baseVolume = STATE.REF.VOLUME[trackKey] || STATE.REF.VOLUME[playlistKey] || STATE.REF.VOLUME.base
            if (Session.Mode === "Inactive")
                return D.Int(volumeMults.filter(x => VAL({number: x})).reduce((tot, x) => tot * x, baseVolume))
            if (!Session.IsOutside)
                volumeMults.push(STATE.REF.VOLUME.MULTS.Inside[trackKey] || STATE.REF.VOLUME.MULTS.Inside[playlistKey] || STATE.REF.VOLUME.MULTS.Inside.base)
            else if (TimeTracker.IsRaining)
                volumeMults.push(STATE.REF.VOLUME.MULTS.Raining[trackKey] || STATE.REF.VOLUME.MULTS.Raining[playlistKey] || STATE.REF.VOLUME.MULTS.Raining.base)
            // DB({trackKey, playlistKey, volumeMults, baseVolume, reduction: D.Int(volumeMults.reduce((tot, x) => tot * x, baseVolume))}, "getVolume")
            return D.Int(volumeMults.filter(x => VAL({number: x})).reduce((tot, x) => tot * x, baseVolume))
        },
        isTrackObjPlaying = (trackObj) => VAL({obj: trackObj}) && trackObj.get("playing") && !trackObj.get("softstop"),
        isTrackObjLooping = (trackObj) => isTrackObjPlaying(trackObj) && trackObj.get("looping"),
        getPlayingTrackObjs = (isLoopingOnly = false) => _.uniq(findObjs({_type: "jukeboxtrack"})).filter(x => isLoopingOnly ? isTrackObjLooping(x) : isTrackObjPlaying(x)),
        // getPlayingPlaylists = () => Object.keys(REGISTRY.Playlists).filter(x => REGISTRY.Playlists[x].isPlaying),
        // getPlayingTracks = (isExcludingPlaylists = false) => Object.values(REGISTRY.Tracks).filter(x => x.isPlaying && (!isExcludingPlaylists || !x.masterPlaylist)).map(x => x.name),
        getScore = () => STATE.REF.scoreOverride || C.SOUNDSCORES[Session.Mode][0],
        getWeatherSounds = () => {
            const funcID = ONSTACK(),
                weatherCode = TimeTracker.WeatherCode,
                weatherSounds = []
            
            if (Session.Mode === "Inactive" || !Session.IsOutside)
                return OFFSTACK(funcID) && []

            // RAIN:
            switch (weatherCode.charAt(0)) {
                case "w": weatherSounds.push("RainLight"); break
                case "d": case "t": weatherSounds.push("RainHeavy"); break
                // no default
            }

            // WIND:
            const windPrefix = `Wind${TimeTracker.TempC <= 0 ? "Winter" : ""}`
            switch (weatherCode.charAt(4)) {            
                case "b": weatherSounds.push(`${windPrefix}Low`); break // Breezy / Biting Wind
                case "w": case "g": weatherSounds.push(`${windPrefix}Med`); break // Blustery / High Winds, High Winds / Driving Winds
                case "h": case "v": weatherSounds.push(`${windPrefix}Max`); break // Howling Winds, Roaring Winds
                // no default
            }
            return OFFSTACK(funcID) && weatherSounds
        },
        getLocationSounds = () => {
            const funcID = ONSTACK(),
                dist = Session.District && C.LOCATIONS[Session.District] || {soundScape: ["(NONE)"]},
                site = Session.Site && C.LOCATIONS[Session.Site] || {soundScape: ["(NONE)"]},
                locSounds = {
                    District: dist.soundScape[0],
                    Site: site.soundScape[0]
                }
            if (Session.Mode === "Inactive")
                return OFFSTACK(funcID) && false
            if (Object.values(locSounds).includes("(TOTALSILENCE)"))
                return OFFSTACK(funcID) && "TOTALSILENCE"
            if (locSounds.Site && locSounds.Site !== "(NONE)")
                return OFFSTACK(funcID) && locSounds.Site
            if (locSounds.District && locSounds.District !== "(NONE)" && Session.IsOutside)
                return OFFSTACK(funcID) && locSounds.District
            return OFFSTACK(funcID) && false
        },
    // #endregion

    // #region SETTERS: Registration & Setting Parameters
        regTrack = (trackObj) => {
            if (VAL({obj: trackObj})) {
                const trackKey = parseKeyFromTitle(trackObj)
                if (trackKey in REGISTRY.Tracks) {
                    D.Alert(`Attempt to overwrite already-registered track: ${D.JS(trackKey)}<br><br>Track names must be unique in jukebox!`, "regTrack")
                } else {
                    REGISTRY.Tracks[trackKey] = {
                        id: trackObj.id,
                        name: trackKey,
                        playlists: [],
                        playModes: {},
                        isPlaying: false,
                        masterPlaylist: false
                    }
                    setPlayModes(trackObj)
                }
            }
        },
        regPlaylist = (playlistKey, trackRefs = [], playModes = {}) => {
            REGISTRY.Playlists[playlistKey] = {
                name: playlistKey,
                trackKeys: trackRefs.map(x => getTrackKey(x)),
                playModes,
                currentTracks: [],
                isPlaying: false,
                trackSequence: []
            }
            for (const trackKey of REGISTRY.Playlists[playlistKey].trackKeys)
                REGISTRY.Tracks[trackKey].playlists.push(playlistKey)
            setPlayModes(playlistKey)
        },
        setPlayModes = (soundRef, playModes = {}) => {
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
            const soundKey = getSoundKey(soundRef)
            if (isTrack(soundKey)) {
                const trackData = getTrackData(soundKey),
                    trackObj = getTrackObj(soundKey)
                Object.assign(trackData.playModes, C.SOUNDMODES[soundKey] || C.SOUNDMODES.TrackDefault, trackData.playModes, playModes)
                trackObj.set({loop: Boolean(trackData.playModes.isLooping), volume: getVolume(trackData.name)})
            } else if (isPlaylist(soundKey)) {
                const playlistData = getPlaylistData(soundKey)
                playlistData.playModes = Object.assign({}, C.SOUNDMODES[soundKey] || C.SOUNDMODES.PlaylistDefault, playlistData.playModes, playModes)
                if (playlistData.playModes.isLooping && !playlistData.playModes.isPlayingAll)
                    playlistData.trackKeys.map(x => setPlayModes(x, {isLooping: true}))
            }
        },
        setVolume = (soundRef, volume) => {
            if (soundRef === "base") {
                STATE.REF.VOLUME.base = D.Int(volume)
            } else {
                const soundKey = getSoundKey(soundRef)
                if (soundKey)
                    STATE.REF.VOLUME[soundKey] = D.Int(volume)
            }
            syncSoundscape()
        },
        setMasterVolumeMult = (volumeMult) => { 
            STATE.REF.VOLUME.MasterVolumeMult = D.Float(volumeMult, 2)
            syncSoundscape()
        },
        setInsideMult = (soundRef, volumeMult) => {
            if (soundRef === "base") {
                STATE.REF.VOLUME.MULTS.Inside.base = D.Float(volumeMult, 2)
            } else {
                const soundKey = getSoundKey(soundRef)
                if (soundKey)
                    STATE.REF.VOLUME.MULTS.Inside[soundKey] = D.Float(volumeMult, 2)
            }
            syncSoundscape()
        },
        setRainMult = (soundRef, volumeMult) => {
            if (soundRef === "base") {
                STATE.REF.VOLUME.MULTS.Raining.base = D.Float(volumeMult, 2)
            } else {
                const soundKey = getSoundKey(soundRef)
                if (soundKey)
                    STATE.REF.VOLUME.MULTS.Raining[soundKey] = D.Float(volumeMult, 2)
            }
            syncSoundscape()
        },
    // #endregion

    // #region CONTROLLERS: Playing & Stopping Sounds, Playing Next Sound
        playSound = (soundRef, masterSound) => { // Initializes any playlist as if playing it for the first time. To preserve sequences, use playNextSound()
            if (STATE.REF.isSoundscapeActive) {
                const soundKey = getSoundKey(soundRef)
                DB({soundRef, masterSound, volume: getVolume(soundKey), realVolume: (getTrackObj(soundKey) || {get: () => false}).get("volume")}, "playSound")
                if (isPlaylist(soundKey)) {
                    const playlistData = getPlaylistData(soundKey),
                        {trackKeys} = playlistData
                    if (!playlistData.trackSequence.length) {
                        if (playlistData.playModes.isRandom)
                            playlistData.trackSequence = _.shuffle(trackKeys).filter(x => !playlistData.currentTracks.includes(x))
                        else
                            playlistData.trackSequence = D.Clone(trackKeys).filter(x => !playlistData.currentTracks.includes(x))
                        return playSound(playlistData.name, masterSound)
                    }
                    if (playlistData.playModes.isTogether)
                        playlistData.trackKeys.map(x => playSound(x, playlistData.name))
                    else
                        playlistData.currentTracks.push(playSound(playlistData.trackSequence.shift(), playlistData.name))
                    playlistData.isPlaying = true
                    return true
                } else if (isTrack(soundKey)) {
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
                    const trackData = getTrackData(soundKey)
                    trackData.isPlaying = true
                    trackData.masterPlaylist = masterSound || false
                    getTrackObj(soundKey).set({playing: true, softstop: false, volume: getVolume(soundKey)})
                    STATE.REF.activeSounds = _.uniq([...STATE.REF.activeSounds, masterSound || soundKey])
                    return soundKey
                }
            }
            return false
        },
        stopSound = (soundRef, trackKey) => {
            DB({soundRef}, "stopSound")
            const soundKey = getSoundKey(soundRef)
            STATE.REF.activeSounds = _.without(STATE.REF.activeSounds, soundKey)
            if (isPlaylist(soundKey)) {
                const playlistData = getPlaylistData(soundKey),
                    curTracks = [...playlistData.currentTracks]
                if (trackKey) {
                    playlistData.currentTracks = _.without(playlistData.currentTracks, trackKey)
                    playlistData.isPlaying = Boolean(playlistData.currentTracks.length)
                    stopSound(trackKey)
                } else {
                    playlistData.currentTracks = []
                    playlistData.isPlaying = false
                    curTracks.map(x => stopSound(x))
                }
            } else if (isTrack(soundKey)) {
                const trackData = getTrackData(soundKey)
                if (trackData.masterPlaylist && REGISTRY.Playlists[trackData.masterPlaylist].currentTracks.includes(soundKey)) {
                    stopSound(trackData.masterPlaylist, soundKey)
                } else {
                    trackData.isPlaying = false
                    trackData.masterPlaylist = false
                    getTrackObj(soundKey).set({playing: false, softstop: false})
                }
            }
        },
        syncSoundscape = (isResetting = false) => {
            if (Session.Mode === "Complications")
                return
            if (isResetting) {
                [...Object.keys(REGISTRY.Playlists), ...Object.keys(REGISTRY.Tracks)].map(x => stopSound(x))
                STATE.REF.activeSounds = []
            }
            const activeSounds = _.compact([
                    getScore(),
                    getLocationSounds(),
                    ...getWeatherSounds()
                ]),
                soundsToStop = STATE.REF.activeSounds.filter(x => !activeSounds.includes(x)),
                soundsToPlay = activeSounds.filter(x => !STATE.REF.activeSounds.includes(x)),
                soundsToCheck = activeSounds.filter(x => STATE.REF.activeSounds.includes(x))
            DB({activeSounds, soundsToStop, soundsToPlay, soundsToCheck}, "syncSoundscape")
            soundsToStop.map(x => stopSound(x))
            soundsToPlay.map(x => playSound(x))
            for (const soundKey of soundsToCheck) {
                const trackObj = getTrackObj(soundKey),
                    trackVolume = getVolume(soundKey)
                if (trackObj && D.Int(trackObj.get("volume")) !== trackVolume)
                    trackObj.set({volume: trackVolume})
            }
        },
        startSoundscape = (isResetting = false) => {
            STATE.REF.isSoundscapeActive = true
            syncSoundscape(isResetting)
        },
        stopSoundscape = () => {
            STATE.REF.isSoundscapeActive = false
            for (const soundKey of STATE.REF.activeSounds)
                stopSound(soundKey)
        },
        playNextSound = (trackRef) => { // Playlist must have been initialized for sequencing: First play should be with playSound()
            if (STATE.REF.isSoundscapeActive) {
                const trackData = getSoundData(trackRef)
                if (trackData.playModes.isLooping && STATE.REF.activeSounds.includes(trackData.name)) {
                    playSound(trackData.name)
                } else {
                    const playlistData = getPlaylistData(trackData.name)
                    if (playlistData && STATE.REF.activeSounds.includes(playlistData.name)) 
                        if (playlistData.playModes.isPlayingAll && playlistData.trackSequence.length || playlistData.playModes.isLooping) {
                            playSound(playlistData.name)
                        } else {
                            stopSound(playlistData.name, trackData.name)
                        }
                    else 
                        stopSound(trackData.name)                    
                }
            }          
        }
    // #endregion

    return {
        CheckInstall: checkInstall,
        OnChatCall: onChatCall, OnTrackChange: onTrackChange,

        Sync: syncSoundscape,
        Play: playSound, Stop: stopSound
    }
} )()

on("ready", () => {
    Soundscape.CheckInstall()
    D.Log("Soundscape Ready!")
} )
void MarkStop("Soundscape")