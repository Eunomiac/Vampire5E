void MarkStart("SoundScape")

/* eslint-disable eqeqeq */
/* eslint-disable camelcase */
/* eslint-disable prefer-const */
const SoundScape = (() => {
    // ************************************** START BOILERPLATE INITIALIZATION & CONFIGURATION **************************************
    let SCRIPTNAME = "SoundScape",
          
    // #region COMMON INITIALIZATION
        STATE = {get REF() { return C.RO.OT[SCRIPTNAME] }},	// eslint-disable-line no-unused-vars
        VAL = (varList, funcName, isArray = false) => D.Validate(varList, funcName, SCRIPTNAME, isArray), // eslint-disable-line no-unused-vars
        DB = (msg, funcName) => D.DBAlert(msg, funcName, SCRIPTNAME), // eslint-disable-line no-unused-vars
        LOG = (msg, funcName) => D.DB(msg, funcName, SCRIPTNAME, funcName), // eslint-disable-line no-unused-vars
        THROW = (msg, funcName, errObj) => D.ThrowError(msg, funcName, SCRIPTNAME, errObj), // eslint-disable-line no-unused-vars
    
        checkInstall = () => {
            C.RO.OT[SCRIPTNAME] = C.RO.OT[SCRIPTNAME] || {}
            initialize()
        },
    // #endregion

    // #region LOCAL INITIALIZATION
        initialize = () => {
            STATE.REF.trackregistry = STATE.REF.trackregistry || {}
            STATE.REF.playlistregistry = STATE.REF.playlistregistry || {}
            STATE.REF.masterVolume = STATE.REF.masterVolume || 50 // The mastervolume, all volumes are multiplied by this before being applied to the actual track. Maximum/Minimum volume levels applicable to tracks are 0-100, the multiplied final volume is set to the boundary if it is outside the range.
            STATE.REF.activeLoops = STATE.REF.activeLoops || []
        },
        registerEventHandlers = () => {
            on("chat:message", (msg) => {
                if (msg.content.startsWith("!roll20AM"))
                    inputHandler(msg)
            })
            on("change:jukeboxtrack", OLD_changeHandler)
        },
    // #endregion
 
    // #region EVENT HANDLERS: (HANDLEINPUT, HANDLECHANGE, HANDLEDESTROY)
        onChatCall = (call, args, objects, msg) => { /* eslint-disable-line no-unused-vars */
            switch (call) {
                case "get": {
                    switch (D.LCase(call = args.shift())) {
                        case "playing": {

                            break
                        }
                        case "looping": {

                            break
                        }
                        // no default
                    }
                    break
                }
                case "reset": {
                    if (args[0] === "ALL") {
                        removeJukebox(true)
                        importJukebox(true, true)
                        D.Alert("SoundScape has been reinitialized with tracks contained in the jukebox.", "SoundScape Reset")                
                        break
                    }
                }
                // no default
            }
        },
        OnJukeboxChange = (jukeBoxObj, prevData) => { /* eslint-disable-line no-unused-vars */ // INVOKED when a track finishes in Jukebox.
            if (jukeBoxObj.get("softstop") === true && prevData.softstop === false) { // IF track just finished, softstop will change from false to true
                const trackData = getTrackData(jukeBoxObj.id),
                    listData = trackData && Object.values(REGISTRY.Playlists).find(x => x.isPlaying && x.currentTracks.includes(trackData.name))
                if (listData && listData.isPlaying && trackData.isPlaying) {
                    trackData.isPlaying = false                    
                    DB({trackFinished: trackData.name, inList: listData.name, listMode: listData.mode}, "OnJukeboxChange")
                    if (["loop", "randomLoop", "shuffle"].includes(listData.mode))
                        playPlaylist(listData.name)
                    else
                        stopPlaylist(listData.name)
                } else {
                    trackData.isPlaying = false
                    if (trackData.mode === "loop")
                        playTrack(trackData.name)
                    else
                        stopTrack(trackData.name)
                }
            }
        },

        //* *****************************************************************************************************************************
        // Handler Functions	
        // - RegisterEventHandlers drives this entire process.  These are events detected by roll20 outside of this script.  
        //    - chat message invokes inputHandler
        //    - Jukebox track finishes invokes changeHandler
        //    - Adding a new track to Jukebox updates STATE.REF 
        //    - Deleting a jukebox track updates STATE.REF
        // - inputHandler receives the SoundScape command,parses it and processes it
        // - commandHandler processed input commands using setTimeout and Delay Time (if any)
        // - listHandler processes list related funcs
        // - trackHandler processes track related funcs
        // - editHandler processes list and track related edit funcs
        // - configHandler processes configuration related funcs, some send output to chat window
        //* *****************************************************************************************************************************   
        inputHandler = (origMsg) => { // INVOKED on !roll20AM chat commands
            // must be roll20AM to start all this
            if (origMsg.content.indexOf("!roll20AM") !== 0)
                return
            const listHandler = (cmdDetails, listDetails) => {
                    DB({SUBFUNC: "listHandler", cmdDetails, listDetails}, "inputHandler")
                    if (listDetails.trackids.length == 0) {
                        D.Alert("Cannot launch PlayLists.  No Tracks assigned.", "listHandler")
                        return
                    }
                    if (cmdDetails.details.play)
                        playPlaylist(listDetails, null)
                    else if (cmdDetails.details.stop)
                        stopPlaylist(listDetails) 

                    if (cmdDetails.details.increase)
                        increaseListVolume(listDetails)
                    else if (cmdDetails.details.decrease)
                        decreaseListVolume(listDetails)                    
                },
                trackHandler = (cmdDetails, trackDetails) => {
                    DB({SUBFUNC: "trackHandler", cmdDetails, trackDetails}, "inputHandler")
                    if (cmdDetails.details.play) {
                        if (trackDetails.mode == "loop")
                            playTrack(trackDetails.id, trackDetails.volume, "loop")
                        if (trackDetails.mode == "single")
                            playTrack(trackDetails.id, trackDetails.volume, null)
                    } else if (cmdDetails.details.stop) {
                        if (!cmdDetails.details.ignore)
                            stopTrack(trackDetails.id)
                    }
                    if (cmdDetails.details.increase)
                        increaseTrackVolume(trackDetails.id)
                    else if (cmdDetails.details.decrease)
                        decreaseTrackVolume(trackDetails.id)
                }, args = origMsg.content.split(/\s+--/)

            if (args[0] === "!roll20AM")
                if (args[1]) {
                    _.each(_.rest(args, 1), (cmd) => {
                        // Extract Commands
                        let vars, tracks
                        const cmdDets = {details: {}}
                        DB(`Extracted Command String:${cmd}`, "editHandler")

                        // split the commands from the tracks or playLists
                        const raw = cmd.split("|"),
                            command = raw[0]
                        tracks = decodeURIComponent(raw[1])

                        // split multiple tracks into array
                        if (tracks)
                            tracks = tracks.split(",")

                        DB(`Extracted Command Tracks:${tracks}`, "editHandler")

                        cmdDets.tracks = _.map(tracks, (t) => {
                            return t.trim()
                        })

                        // find the action and set the cmdSep Action
                        cmdDets.action = command.match(/audio|config|edit/)
                        // the ./ is an escape within the URL so the hyperlink works.  Remove it
                        command.replace("./", "")
                        // split additional command actions
                        _.each(command.replace(`${cmdDets.action},`, "").split(","), (d) => {
                            vars = d.match(/(volTick|time|volume|delay|level|menu|mode|restrict|tag|API|access|tag|tag1|tag2|tag3|tag4|tag5|set|unset|filter|delayed|viewBy|display|)(?::|=)([^,]+)/) || null
                            if (vars)
                                [ , , cmdDets.details[vars[1]]] = vars
                            else
                                cmdDets.details[d] = d

                        })

                        DB(cmdDets, "editHandler")

                        const tracklists = [], playLists = []

                        // cmdDetails.tracks holds tracks/playLists, everything after the |.  If playList push into array
                        _.each(cmdDets.tracks, (listName) => {
                            if (REGISTRY.Playlists[listName])
                                playLists.push(listName)

                        })
                        // if track, pushing into array
                        _.each(cmdDets.tracks, (trackTitle) => {
                            if (REGISTRY.Tracks[trackTitle])
                                tracklists.push(trackTitle)

                        })
                        DB({action: cmdDets.action, playLists, tracklists}, "editHandler")

                        // prevent players from doing things they shouldn't.  PlayList level actions and edit commands
                        DB("Command Handler", "editHandler")
                        if (cmdDets.action == "audio") {
                            if (playLists.length > 0)
                                _.each(playLists, (listName) => {
                                    listHandler(cmdDets, getPlayListData(listName))
                                })

                            if (tracklists.length > 0)
                                _.each(tracklists, (trackTitle) => {
                                    trackHandler(cmdDets, getTrackData(getTrackID(trackTitle)))
                                })

                            if (cmdDets.details.stop)
                                if (playLists.length == 0 && tracklists.length == 0) {
                                    stopAll()
                                }

                            // edit commands    
                        } else if (cmdDets.action == "edit") {
                            if (playLists.length > 0)
                                _.each(playLists, (listName) => {
                                    editSound(cmdDets, getPlayListData(listName), null)
                                })

                            if (tracklists.length > 0)
                                _.each(tracklists, (trackTitle) => {
                                    editSound(cmdDets, null, getTrackData(getTrackID(trackTitle)))
                                })

                            if (tracklists.length == 0 && playLists.length == 0)
                                editSound(cmdDets, null, null)

                            // config commands    
                        } else {
                            D.Alert("Invalid SoundScape Command.  Valid commands are --audio, --edit", "inputHandler")
                        }
                    })
                }
        },
        OLD_changeHandler = (obj, prev) => { // INVOKED when a track finishes in Jukebox.  
            let listFound = false, trackDetails, trackFound = false
            // we receive the track object from jukebox.  softstop is set to true upon finish
            if (obj.get("softstop") === true && prev.softstop === false) {
                trackDetails = getTrackData(obj.get("_id"))
                // [R] Setting the jukeboxtrackObj to baseline non-playing status ({playing: false, softstop: false})
                obj.set({playing: false, softstop: false})

                DB({trackFinished: trackDetails.name, trackID: trackDetails.id}, "changeHandler")
                // find out of a playList is currently playing
                _.each(REGISTRY.Playlists, (list) => {
                    if (list.isPlaying)
                        // check if this track in this playList, if so, continue with playList based on mode
                        if (list.currentTracks.indexOf(trackDetails.id) > -1) {
                            if (trackDetails.isPlaying) {
                                listFound = true
                                trackDetails.isPlaying = false
                                DB({trackTitle: trackDetails.name, inList: list.name, listMode: list.mode}, "changeHandler")
                                if (["loop", "randomLoop", "shuffle"].includes(list.mode))
                                    playPlaylist(list, null)
                                else
                                    list.isPlaying = false                                
                            }
                        }
                })


                // if track wasn't found in active playList, set ROLL20AM state to not playing and output menu so icon changes from play to stop
                if (!listFound) {
                    _.each(REGISTRY.Tracks, track => {
                        if (track.isPlaying)
                            trackFound = true
                    })
                    if (!listFound && !trackFound)
                        return

                    trackDetails.isPlaying = false
                    // if a track is launched within a playList, set playList to off
                    _.each(REGISTRY.Playlists, list => {
                        if (list.trackids.indexOf(trackDetails.id) > -1)
                            list.isPlaying = false
                    })
                    if (trackDetails.mode == "loop")
                        playTrack(trackDetails.id, trackDetails.volume, null)
                }
            }
        },
    // #endregion
    // *************************************** END BOILERPLATE INITIALIZATION & CONFIGURATION ***************************************

    //* **** CONFIGURATION ***************************************************
    // #region Variable Declarations    
        REGISTRY = {
            get Tracks() { return REGISTRY.Tracks }, /*      Registry by trackName containing these properties:
                                                                        - name: trackName; same as the key
                                                                        - id: the id of the jukebox object
                                                                        - volume: the tracks individual volume; is multiplied by the masterVolume to set the jukebox volume
                                                                        - mode: either "single" or "loop"
                                                                        - delays: number of unresolved delays involving this track */
            get Playlists() { return REGISTRY.Playlists } /* Registry by playlistName containing these properties:
                                                                        - name: playlistName; same as the key
                                                                        - tracks: array of contained trackNames
                                                                        - playingTracks = array of currently-playing trackNames
                                                                        - orderedTracks = array of tracks to play next
                                                                        - isPlaying: true/false
                                                                        - mode: 
                                                                        - delays: The number of times this playList has been delayed. 
                                                                            - Incremented in handleInput, decremented in delayHandler
                                                                            - Actions are not completed if there are no delays to support them. */          
        },
    // #endregion
    // #region Control & Registration Functions    
        editSound = (cmdDetails, listDetails, trackDetails) => {
            let mode
            DB({cmdDetails, listDetails, trackDetails}, "editSound")
            if (cmdDetails.details.mode)
                if (cmdDetails.details.random) {
                    if (cmdDetails.details.single)
                        mode = "randomSingle"
                    else if (cmdDetails.details.loop)
                        mode = "randomLoop"
                } else if (cmdDetails.details.single) {
                    mode = cmdDetails.details.single
                } else if (cmdDetails.details.loop) {
                    mode = cmdDetails.details.loop
                } else if (cmdDetails.details.shuffle) {
                    mode = cmdDetails.details.shuffle
                } else {
                    mode = cmdDetails.details.together
                }
            if (!listDetails && !trackDetails) {
                if (cmdDetails.details.volume)
                    changeVolumeMaster(cmdDetails.details.level)
            } else if (listDetails) {
                if (cmdDetails.details.volume)
                    changeVolumeList(listDetails, cmdDetails.details.level)
                if (cmdDetails.details.mode)
                    listDetails.mode = mode || listDetails.mode
                if (cmdDetails.details.remove)
                    delete REGISTRY.Playlists[listDetails.name]
            } else if (trackDetails) {
                if (cmdDetails.details.volume)
                    changeVolumeTrack(trackDetails.id, cmdDetails.details.level)
                if (cmdDetails.details.mode)
                    trackDetails.mode = mode || trackDetails.mode
                if (cmdDetails.details.remove) {
                    delete REGISTRY.Tracks[trackDetails.id]
                    _.each(REGISTRY.Playlists, (listData) => {
                        listData.trackids.splice(listData.trackids.indexOf(trackDetails.id), 1)
                    })
                }
            }
        },
    // #endregion
    // #region Importing Data from Jukebox & Configuring Default Modes
        importJukebox = (isSettingModes = true, isSilent = false) => {
            const playlistImport = JSON.parse(Campaign().get("jukeboxfolder"))
            let trackObj, trackTitle, trackID
            _.each(findObjs({type: "jukeboxtrack"}), (track) => {
                trackTitle = track.get("title")
                trackID = track.get("_id")
                if (!(trackTitle in REGISTRY.Tracks))
                    REGISTRY.Tracks[trackTitle] = {
                        id: trackID,
                        name: trackTitle,
                        playing: false,
                        mode: "single",
                        volume: STATE.REF.masterVolume
                    }
            })
            _.each(playlistImport, list => {
                if (list.n) {
                    importList(list.n)
                    _.each(list.i, (t) => {
                        trackObj = getTrackObj(t)
                        if (trackObj) {
                            trackTitle = trackObj.get("title")
                            trackID = getTrackID(trackTitle)
                            if ("trackids" in REGISTRY.Playlists[list.n] && REGISTRY.Playlists[list.n].trackids.indexOf(trackID) == -1)
                                REGISTRY.Playlists[list.n].trackids.push(trackID)
                        }
                    })
                }
            })
            importList("Tag1")
            importList("Tag2")
            importList("Tag3")
            importList("Tag4")
            if (isSettingModes)
                setSoundMode()
            if (!isSilent)
                D.Alert("All PlayLists and Tracks have been imported", "importJukebox")
        },
        importList = (listName) => {
            DB(`Importing List:${listName}`, "importList")
            if (!REGISTRY.Playlists[listName])
                REGISTRY.Playlists[listName] = {
                    name: listName,
                    trackids: [],
                    shuffleIds: [],
                    playing: false,
                    currentTracks: [],
                    lastTrack: null,
                    mode: "loop",
                    delay: 0,
                    volume: STATE.REF.masterVolume,
                }
        },
        removeJukebox = (isSilent = false) => {
            REGISTRY.Playlists = {}
            REGISTRY.Tracks = {}
            if (!isSilent)
                D.Alert("All PlayLists and Tracks have been removed from SoundScape", "SoundScape")
        },
        setSoundMode = (soundRef, mode) => {
            if (soundRef) {                
                const [isPlayList, isTrack] = [isPlayList(soundRef), isTrack(soundRef)],
                    modeDetails = {details: {mode: true}}
                if (isPlayList || isTrack) {
                    mode = mode || (C.SOUNDMODES[isPlayList && getPlayListName(soundRef) || getTrackName(soundRef)] || C.SOUNDMODES.defaults).mode
                    switch (D.LCase(mode)) {
                        case "randomsingle": {
                            modeDetails.details.random = isPlayList
                            modeDetails.details.single = "single"
                            break
                        }
                        case "randomloop": {
                            modeDetails.details.random = isPlayList
                            modeDetails.details.loop = "loop"
                            break
                        }
                        case "single": {
                            modeDetails.details.single = "single"
                            break
                        }
                        case "loop": {
                            modeDetails.details.loop = "loop"
                            break
                        }
                        case "shuffle": {
                            if (isPlayList)
                                modeDetails.details.shuffle = "shuffle"
                            else
                                D.Alert(`Can't set TRACK '${soundRef}' to PLAYLIST MODE 'shuffle'`, "SoundScape: SetSoundMode")
                            break
                        }
                        case "together": {
                            if (isPlayList)
                                modeDetails.details.together = "together"
                            else
                                D.Alert(`Can't set TRACK '${soundRef}' to PLAYLIST MODE 'together'`, "SoundScape: SetSoundMode")
                            break
                        }
                        // no default
                    }
                    editSound(modeDetails, getPlayListName(soundRef), getTrackData(getTrackID(soundRef)))
                    if (isPlayList)
                        for (const trackName of getPlayListTracks(soundRef))
                            setSoundMode(trackName, (C.SOUNDMODES[soundRef] || C.SOUNDMODES.defaults).innerMode || C.SOUNDMODES.defaults.innerMode)
                } else {
                    for (const listName of Object.keys(REGISTRY.Playlists))
                        setSoundMode(listName)
                    for (const trackName of _.intersection(Object.keys(C.SOUNDMODES), Object.keys(REGISTRY.Playlists)))
                        setSoundMode(trackName)
                }
            }
        },
    // #endregion

    //* **** DATA RETRIEVAL & CONVERSION ********************************************
    // #region GETTERS: PlayLists (According to SoundScape's Data)
        /* PLAYLIST MODES: {
            single: Plays the first track in the playlist and stops.
            randomSingle: Plays a random track in the playlist and stops.
            loop: Plays each track in order in a continuous loop.
            randomLoop: Plays tracks in a random order in a continuous loop.
            shuffle: Plays each track once, in a random order, then stops.
            together: Plays all tracks simultaneously. (THIS IS WHERE TRACK DELAYS CAN MATTER)
        } */    
        getPlayListName = (playListRef) => {
            if (VAL({string: playListRef}) && REGISTRY.Playlists[playListRef])
                return playListRef
            if (VAL({list: playListRef}) && playListRef.name && REGISTRY.Playlists[playListRef.name]) 
                return playListRef.name
            if (isTrack(playListRef)) {
                const trackID = getTrackID(playListRef)
                return _.findKey(REGISTRY.Playlists, v => v.trackids.includes(trackID))
            }
            return false
        },
        isPlayList = (playListRef) => Boolean(getPlayListName(playListRef)),
        getPlayListData = (playListRef) => {
            const playListKey = getPlayListName(playListRef)
            return VAL({string: playListKey}) && REGISTRY.Playlists[playListKey]
        },
        getPlayListTracks = (playListRef, isReturningIDs = false) => isPlayList(playListRef) && getPlayListData(playListRef).trackids.map(x => isReturningIDs && x || getTrackName(x)),
        isTrackInPlayList = (trackRef, playListRef) => isPlayList(playListRef) && getPlayListTracks(playListRef).includes(getTrackName(trackRef)),
        getPlayListMode = (playListRef) => isPlayList(playListRef) && getPlayListData(playListRef).mode,
        isPlayListPlaying = (playListRef) => STATE.REF.activeLoops.includes(getPlayListName(playListRef)),
        isPlayListLooping = (playListRef) => isPlayListPlaying(playListRef) && ["loop", "randomLoop", "shuffle"].includes(getPlayListMode(playListRef)),
    // #endregion
    // #region GETTERS: Tracks (According to SoundScape's Data)
        getTrackName = (trackRef) => {
            if (VAL({string: trackRef})) {
                if (REGISTRY.Tracks[trackRef])
                    return trackRef
                return (_.findWhere(REGISTRY.Tracks, {id: trackRef}) || {name: false}).name
            } else if (VAL({object: trackRef})) {
                return getTrackName(trackRef.id)
            }
            return false
        },     
        isTrack = (trackRef) => Boolean(getTrackName(trackRef)),   
        getTrackData = (trackRef) => {
            const trackKey = getTrackName(trackRef)
            return VAL({string: trackKey}) && REGISTRY.Tracks[trackKey]
        },
        getTrackID = (trackRef) => {
            if (VAL({object: trackRef}) && trackRef.get("_type") === "jukeboxtrack")
                return trackRef.id
            const trackData = getTrackData(trackRef)
            if (VAL({list: trackData}))
                return trackData.id            
            if (VAL({string: trackRef}))
                return getObj("jukeboxtrack", trackRef) || false
            return false
        },
        getTrackObj = (trackRef) => {
            if (VAL({object: trackRef}) && trackRef.get("_type") === "jukeboxtrack")
                return trackRef
            return getObj("jukeboxtrack", getTrackID(trackRef))
        },
    // #endregion
    // #region GETTERS: Jukebox Objects ("Real" Object Status)        
        getJukeboxObjs = () => _.uniq(findObjs({_type: "jukeboxtrack"})),
        isJukeboxObjPlaying = (jukeboxObj, playListRef) => VAL({object: jukeboxObj}) && jukeboxObj.get("playing") && !jukeboxObj.get("softstop") && (!playListRef || isTrackInPlayList(jukeboxObj.id, playListRef)),
        isJukeboxObjLooping = (jukeboxObj, isCheckingPlaylist = true, playListRef) => VAL({object: jukeboxObj}) && 
                                                                            isJukeboxObjPlaying(jukeboxObj.id, playListRef) &&
                                                                            (jukeboxObj.get("loop") || isCheckingPlaylist && isPlayListLooping(jukeboxObj.id)),
        getPlayingJukeboxObjs = (playListRef) => getJukeboxObjs().filter(x => isJukeboxObjPlaying(x, playListRef)),
        getLoopingJukeboxObjs = (isCheckingPlaylist = true, playListRef) => getJukeboxObjs().filter(x => isJukeboxObjLooping(x, isCheckingPlaylist, playListRef)),
    // #endregion

    //* **** SOUNDSCAPE CONTROL ***************************************************
    // #region Determining SoundScape
        setScore = (scoreMode, volume) => {
            const scoreName = scoreMode && `Score${D.Capitalize(scoreMode)}` || STATE.REF.currentScore,
                scoreVolume = VAL({number: volume}) ? volume : VAL({string: scoreName}) && getPlayListData(scoreName).volume
            if (STATE.REF.currentScore !== scoreName) {
                stopLooping(STATE.REF.currentScore)
                STATE.REF.currentScore = scoreName
                startLooping(scoreName, scoreVolume)
            } else if (VAL({number: volume}) && getPlayListData(scoreName).volume !== volume) {
                setPlayListVolume(scoreName, volume)
            }
        },
        getLocationSounds = () => { },
        getWeatherSounds = () => { },
        getScoreSounds = () => { },
    // #endregion
    // #region Setting SoundScape
        updateSoundScape = () => { },        
        startLooping = (soundRef, volume) => {
            const soundName = getTrackName(soundRef) || getPlayListName(soundRef)
            if (STATE.REF.activeLoops.includes(soundName)) {
                return false
            } else {
                STATE.REF.activeLoops.push(soundName)
                if (isPlayList(soundName))
                    playPlaylist(soundRef, volume)
                else
                    playTrack(soundRef, volume)
                return STATE.REF.activeLoops
            }
        },
        stopLooping = (soundRef) => {
            const soundName = getTrackName(soundRef) || getPlayListName(soundRef)
            if (STATE.REF.activeLoops.includes(soundName)) {
                STATE.REF.activeLoops = _.without(STATE.REF.activeLoops, soundName)
                if (isPlayList(soundName))
                    stopPlaylist(soundRef)
                else
                    stopTrack(soundRef)
                return STATE.REF.activeLoops
            } else {
                return false
            }
        },
    // #endregion
    // #region Verifying & Fixing SoundScape
        
    // #endregion
    // #region Stopping ALL Music
        stopAll = () => {
            DB("Stopping All Tracks", "stopAll")
            _.each(REGISTRY.Playlists, (list) => {
                if (list.isPlaying) {
                    DB(`Stopping List:${list}`, "stopAll")

                    list.isPlaying = false
                    list.currentTracks = []
                }
            })
            _.each(REGISTRY.Tracks, (track) => {
                if (track.isPlaying) {
                    DB(`Stopping Track:${track.id}`, "stopAll")

                    stopTrack(track.id)
                }
            })
        },
    // #endregion
    // #region Configure Default Volume, Fade, Delay
        //* *****************************************************************************
        // Edit Master Functions 	
        // - Modify the master volume, playLists and tracks assigned to playList
        //    - Volume, Fade In, Fade Out, Fade Time
        //    - Update the approprate element
        //* *****************************************************************************	
        changeVolumeMaster = (level) => {
            DB(`Change Master Volume:${level}`, "changeVolumeMaster")

            STATE.REF.masterVolume = parseInt(level)
            _.each(REGISTRY.Playlists, (list) => {
                changeVolumeList(list, parseInt(level))
            })
        },
        changeDelayMaster = (level) => {
            DB(`Change Delay Seconds:${level}`, "changeDelayMaster")

            STATE.REF.masterDelay = level
            _.each(REGISTRY.Playlists, (list) => {
                changeDelayList(list, level)
            })
        },
    // #endregion

    //* **** TRACK CONTROL **********************************************************
    // #region Playing & Stopping Tracks
        playTrack = (trackRef, level) => {
            const trackData = getTrackData(trackRef),
                trackID = trackData.id,
                trackObj = getTrackObj(trackID)
            level = level || trackData.volume
                
                // set playing to true in Track Details, get Jukebox Object and set to playing
            DB({track: getTrackName(trackObj.id), volume: level}, "playTrack")
            _.each(REGISTRY.Playlists, list => {
                if (list.trackids.indexOf(trackObj.id) >= 0)
                    list.isPlaying = true

            })
            trackData.isPlaying = true
            trackObj.set({playing: true, softstop: false, volume: level})
        },
        // stops the track.  Either Track ID or Track name will come into this func
        stopTrack = (trackRef) => {
            const trackData = getTrackData(trackRef),
                trackID = trackData.id,
                trackObj = getTrackObj(trackID)

            _.each(REGISTRY.Playlists, list => {
                if (list.isPlaying)
                    if (list.trackids.indexOf(trackID) >= 0) {
                        list.isPlaying = false
                    }

            })
                // set playing to true in Track Details, get Jukebox Object and set to playing
            trackData.isPlaying = false
            trackObj.set({playing: false, softstop: false, loop: false})
        },
    // #endregion
    // #region Volume Control
        increaseTrackVolume = (trackID) => {
            const trackDetails = getTrackData(trackID), level = Number(trackDetails.volume) + 5, jbTrack = getTrackObj(trackID)
            DB(`Increase Track:${trackDetails.name}`, "increaseTrackVolume")

            
            trackDetails.volume = level
            jbTrack.set({volume: level})
        },
        decreaseTrackVolume = (trackID) => {
            const trackDetails = getTrackData(trackID), level = Number(trackDetails.volume) - 5, jbTrack = getTrackObj(trackID)

            DB(`Increase Track:${trackDetails.name}`, "decreaseTrackVolume")

            trackDetails.volume = level
            jbTrack.set({volume: level})
        },
        setTrackVolume = (trackRef, volume) => {
            const trackData = getTrackData(trackRef),
                trackObj = getTrackObj(trackData.id)
            trackData.volume = volume
            trackObj.set({volume})
        },
    // #endregion
    // #region Configure Default Volume, Fade, Delay
        //* *****************************************************************************
        // Edit Track Functions 	
        // - Modify the volume in the trackDetails and in some cases, the Jukebox Track
        //    - Volume, Fade In, Fade Out, Fade Time, Increase, Decrease
        //    - Pull the details from REGISTRY.Tracks and sometimes Jukebox
        //    - Update the approprate element
        //* *****************************************************************************
        changeVolumeTrack = (trackID, level) => {
            const trackDetails = getTrackData(trackID)
            DB({track: getTrackName(trackID), volume: level}, "changeVolumeTrack")
            trackDetails.volume = level
        },
    // #endregion

    //* **** PLAYLIST CONTROL *******************************************************
    // #region Playing & Stopping PlayLists
        playPlaylist = (playListRef, startVolume = null) => {
            const {name, mode} = getPlayListData(playListRef)
            switch (D.LCase(mode)) {
                case "single":
                case "loop": {
                    playListInOrder(name, startVolume)
                    break
                }
                case "randomsingle":
                case "randomloop": {
                    playListRandom(name, startVolume)
                    break
                }
                case "shuffle": {
                    playListShuffle(name, startVolume)
                    break
                }
                case "together": {
                    playListTogether(name, startVolume)
                    break
                }
                // no default
            }
        },
        // One func for each playList mode:
        // plays tracks in sequential order
        playListInOrder = (list, startVolume) => {
            DB(`Playing List (In Order):${list.name}`, "playListInOrder")

            // Set list playing to true, used later to determine lists that are active
            list.isPlaying = true
            if (isPlayListLooping(list))
                Media.LoopingSounds = list.name
            playNextTrack(list, list.trackids, startVolume)
        },
        // plays tracks randomly
        playListRandom = (list, startVolume) => {
            DB(`Playing Random List:${list.name}`, "playListRandom")
                // Set list playing to true, used later to determine lists that are active.  Since random, we aren't tracking current played tracks
            list.isPlaying = true
            if (isPlayListLooping(list))
                Media.LoopingSounds = list.name
            list.currentTracks = []
            const trackID = list.trackids[randomInteger(list.trackids.length) - 1]
            playNextTrack(list, [trackID], startVolume)
        },
        // plays tracks randomly
        playListShuffle = (list, startVolume) => {
            DB(`Playing Shuffle List:${list.name}`, "playListShuffle")

                // Set list playing to true, used later to determine lists that are active
            list.isPlaying = true
            if (isPlayListLooping(list))
                Media.LoopingSounds = list.name
            if (list.shuffleIds.length == 0) {
                DB("Creating Shuffle", "playListShuffle")

                    // Copy trackids into shuffe tracks
                _.each(list.trackids, (t) => {
                    list.shuffleIds.push(t)
                })
                    // Use Durstenfeld method of shuffling list
                for (let i = list.shuffleIds.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1)),
                        temp = list.shuffleIds[i]
                    list.shuffleIds[i] = list.shuffleIds[j]
                    list.shuffleIds[j] = temp
                }
            }
            playNextTrack(list, list.shuffleIds, startVolume)
        },
        // plays tracks together
        playListTogether = (list, startVolume) => {
            DB(`Playing Together List:${list.name}`, "playListTogether")

            let volume
                // Set list playing to true, used later to determine lists that are active
            list.isPlaying = true
                // Set start volume
            if (startVolume != 0)
                volume = list.volume
            else
                volume = startVolume

            DB(`Start Volume:${volume}`, "playListTogether")

                // Play all songs at once.  Push all songs into currentTracks 
            _.each(list.trackids, (id) => {
                list.currentTracks.push(id)
                playTrack(id, volume, null)
            })
        },
        // ... plus the func that actually plays the track triggered by the above four funcs
        playNextTrack = (list, listTracks, startVolume) => {
            DB(`Playing Next Track List:${list.name}`, "playNextTrack")

                // initialize
            let found = false, nexttrackID, volume
                // find next track to play    
            if (list.currentTracks.length > 0)
                    // get each track from the playList tracks
                _.each(listTracks, (id) => {
                        // if the track isn't in the current playListm play it, Found switch makes next track is used
                    if (list.currentTracks.indexOf(id) == -1)
                        if (!found) {
                            nexttrackID = id
                            DB(`Next Track:${nexttrackID}`, "playNextTrack")
                            found = true
                        }

                })

                // if entire play tracks are in current tracks, all have played, wipe out current tracks and get first one                
            if (!found) {
                list.currentTracks = [];
                [nexttrackID] = listTracks
                DB(`First Track:${nexttrackID}`, "playNextTrack")

            }
                // push this track into the current track list
            list.currentTracks.push(nexttrackID)
                // volume may have been set to 0 by fading, reset to playList or master volume.  For fade in, we want start volume at 0
            if (startVolume != 0)
                volume = list.volume
            else
                volume = startVolume

            playTrack(nexttrackID, volume, null)
        },
        // stops the playList
        stopPlaylist = (playListRef) => {
            const playListData = getPlayListData(playListRef)
            DB(`Stopping:${playListData.name}`, "stopList")

                // stop list and clear current tracks
            playListData.isPlaying = false
            Media.StopLooping(playListRef.name)
            _.each(playListData.currentTracks, (trackID) => {
                DB(`Stopping:${trackID}`, "stopList")
                stopTrack(trackID)
            })
            playListData.currentTracks = []
        },        
    // #endregion
    // #region Volume Control
        increaseListVolume = (list) => {
            DB(`Increase List:${list.name}`, "increaseListVolume")
            const level = Number(list.volume) + 5
            list.volume = level

            _.each(list.trackids, (trackID) => {
                increaseTrackVolume(trackID)
            })
        },
        decreaseListVolume = (list) => {
            const newVolume = Number(list.volume) - 5
            list.volume = newVolume
            DB({list: list.name, volume: newVolume}, "decreaseListVolume")

            _.each(list.trackids, (trackID) => {
                decreaseTrackVolume(trackID)
            })
        },
        setPlayListVolume = (playListRef, volume) => {
            const playListData = getPlayListData(playListRef)
            playListData.volume = volume
            for (const trackID of playListData.trackids)
                setTrackVolume(trackID, volume)
        },
    // #endregion   
    // #region Configure Default Volume, Fade, Delay
        //* *************************************************************************
        // Edit List Functions 	
        // - Modify the volume in the playLists and tracks assigned to playList
        //    - Volume, Fade In, Fade Out, Fade Time
        //    - Update the approprate element
        //* *************************************************************************	
        changeVolumeList = (list, level) => {
            DB({list: list.name, volume: level}, "changeVolumeList")
            list.volume = level
            _.each(list.trackids, (trackID) => {
                changeVolumeTrack(trackID, level)
            })
        },
    // #endregion


    //* **** SOUNDSCAPE VERIFICATION & CHECKING ***************************************
    // #region Loop Tracking// #endregion
    // #region Confirmation & Validation of Soundscape
        validatePlayList = (playListRef) => { /* Checks to make sure one (and only one) track from the playlist is ACTUALLY playing in the jukebox. "true" if okay, "false" if nothing playing, "array of playing tracks" if more than one playing. */ },
        verifySoundScape = () => { /* Use the above functions to compare what SHOULD be playing with what IS playing. */ }
    // #endregion

    return {
        CheckInstall: checkInstall,
        RegisterEventHandlers: registerEventHandlers
    }
})()


on("ready", () => {
    SoundScape.CheckInstall()
    SoundScape.RegisterEventHandlers()
})