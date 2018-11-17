// DATA.js, "DATA".  Exposed as "D" in the API sandbox.
//   >>> DATA is both a library of handy resources for other scripts to use, and a master configuration file for your game.  You can find a list of all of the available methods at the end of the script.  Configuration is a bit trickier, but is contained to the CONFIGURATION and DECLARATIONS #regions.

var D = D || (function () {
  'use strict'

  // #region CONFIGURATION: Game Name
  const GAMENAME = 'VAMPIRE'
  // #endregion

  // #region DECLARATIONS: Reference Variables
  let VALS = {
    PAGEID: () => Campaign().get('playerpageid'),
    CELLSIZE: function () { return 70 * getObj('page', Campaign().get('playerpageid')).get('snapping_increment') }
  }
  const ATTRIBUTES = {
    physical: ['Strength', 'Dexterity', 'Stamina'],
    social: ['Charisma', 'Manipulation', 'Composure'],
    mental: ['Intelligence', 'Wits', 'Resolve']
  }
  const SKILLS = {
    physical: ['Athletics', 'Brawl', 'Craft', 'Drive', 'Firearms', 'Melee', 'Larceny', 'Stealth', 'Survival'],
    social: ['Animal Ken', 'Animal_Ken', 'Etiquette', 'Insight', 'Intimidation', 'Leadership', 'Performance', 'Persuasion', 'Streetwise', 'Subterfuge'],
    mental: ['Academics', 'Awareness', 'Finance', 'Investigation', 'Medicine', 'Occult', 'Politics', 'Science', 'Technology']
  }
  const DISCIPLINES = ['Animalism', 'Auspex', 'Celerity', 'Dominate', 'Fortitude', 'Obfuscate', 'Potence', 'Presence', 'Protean', 'Blood Sorcery', 'Blood Sorcery', 'Alchemy']
  const TRACKERS = ['Willpower', 'Health', 'Humanity', 'Blood Potency']
  const BLOODPOTENCY = [
    { bloodSurge: 0, bloodDiscBonus: 0 },
    { bloodSurge: 1, bloodDiscBonus: 1 },
    { bloodSurge: 1, bloodDiscBonus: 1 },
    { bloodSurge: 2, bloodDiscBonus: 1 },
    { bloodSurge: 2, bloodDiscBonus: 2 },
    { bloodSurge: 3, bloodDiscBonus: 2 },
    { bloodSurge: 3, bloodDiscBonus: 3 },
    { bloodSurge: 4, bloodDiscBonus: 3 },
    { bloodSurge: 4, bloodDiscBonus: 4 },
    { bloodSurge: 5, bloodDiscBonus: 4 },
    { bloodSurge: 5, bloodDiscBonus: 5 }
  ]
  const RESPROBS = {
    norm: [{ neg: 0.125, fleet: 0.075, intense: 0.04, acute: 0.01 }, { neg: 0.125, fleet: 0.075, intense: 0.04, acute: 0.01 }, { neg: 0.125, fleet: 0.075, intense: 0.04, acute: 0.01 }, { neg: 0.125, fleet: 0.075, intense: 0.04, acute: 0.01 }],
    pos: [{ neg: 0.167, fleet: 0.1, intense: 0.053, acute: 0.013 }, { neg: 0.111, fleet: 0.067, intense: 0.036, acute: 0.009 }, { neg: 0.111, fleet: 0.067, intense: 0.036, acute: 0.009 }, { neg: 0.111, fleet: 0.067, intense: 0.036, acute: 0.009 }],
    neg: [{ neg: 0.136, fleet: 0.082, intense: 0.044, acute: 0.011 }, { neg: 0.136, fleet: 0.082, intense: 0.044, acute: 0.011 }, { neg: 0.136, fleet: 0.082, intense: 0.044, acute: 0.011 }, { neg: 0.091, fleet: 0.055, intense: 0.029, acute: 0.007 }],
    posneg: [{ neg: 0.167, fleet: 0.1, intense: 0.053, acute: 0.013 }, { neg: 0.121, fleet: 0.073, intense: 0.039, acute: 0.01 }, { neg: 0.121, fleet: 0.073, intense: 0.039, acute: 0.01 }, { neg: 0.091, fleet: 0.055, intense: 0.029, acute: 0.007 }],
    pospos: [{ neg: 0.124, fleet: 0.075, intense: 0.107, acute: 0.027 }, { neg: 0.111, fleet: 0.067, intense: 0.036, acute: 0.009 }, { neg: 0.111, fleet: 0.067, intense: 0.036, acute: 0.009 }, { neg: 0.111, fleet: 0.067, intense: 0.036, acute: 0.009 }],
    negneg: [{ neg: 0.15, fleet: 0.09, intense: 0.048, acute: 0.012 }, { neg: 0.15, fleet: 0.09, intense: 0.048, acute: 0.012 }, { neg: 0.15, fleet: 0.09, intense: 0.048, acute: 0.012 }, { neg: 0.05, fleet: 0.03, intense: 0.016, acute: 0.004 }],
    pos2neg: [{ neg: 0.124, fleet: 0.075, intense: 0.107, acute: 0.027 }, { neg: 0.144, fleet: 0.086, intense: 0.046, acute: 0.012 }, { neg: 0.144, fleet: 0.086, intense: 0.046, acute: 0.012 }, { neg: 0.091, fleet: 0.055, intense: 0.029, acute: 0.007 }],
    neg2pos: [{ neg: 0.196, fleet: 0.117, intense: 0.063, acute: 0.016 }, { neg: 0.13, fleet: 0.078, intense: 0.042, acute: 0.01 }, { neg: 0.13, fleet: 0.078, intense: 0.042, acute: 0.01 }, { neg: 0.043, fleet: 0.026, intense: 0.014, acute: 0.003 }],
    posposneg: [{ neg: 0.167, fleet: 0.1, intense: 0.053, acute: 0.013 }, { neg: 0.167, fleet: 0.1, intense: 0.053, acute: 0.013 }, { neg: 0.111, fleet: 0.067, intense: 0.036, acute: 0.009 }, { neg: 0.056, fleet: 0.033, intense: 0.018, acute: 0.004 }],
    posnegneg: [{ neg: 0.191, fleet: 0.115, intense: 0.061, acute: 0.015 }, { neg: 0.127, fleet: 0.076, intense: 0.041, acute: 0.01 }, { neg: 0.091, fleet: 0.055, intense: 0.029, acute: 0.007 }, { neg: 0.091, fleet: 0.055, intense: 0.029, acute: 0.007 }]
  }
  const FX = {
    bloodCloud: {
      'duration': 50,
      'maxParticles': 350,
      'size': 30,
      'sizeRandom': 5,
      'lifeSpan': 15,
      'lifeSpanRandom': 7,
      'emissionRate': 20,
      'speed': 3,
      'speedRandom': 1.5,
      'angle': 0,
      'angleRandom': 360,
      'startColour': [218, 0, 0, 1],
      'startColourRandom': [160, 0, 15, 0],
      'endColour': [35, 0, 0, 0],
      'endColourRandom': [160, 0, 15, 0]
    },
    bloodBolt: {
      'angle': 0,
      'angleRandom': 0.5,
      'duration': 1,
      'emissionRate': 5000,
      'endColour': [50, 0, 0, 0],
      'endColourRandom': [0, 0, 0, 0],
      'gravity': { 'x': 0.01, 'y': 0.01 },
      'lifeSpan': 5,
      'lifeSpanRandom': 1,
      'maxParticles': 5000,
      'size': 50,
      'sizeRandom': 0,
      'speed': 120,
      'speedRandom': 121,
      'startColour': [200, 0, 0, 1],
      'startColourRandom': [12, 12, 12, 1]
    }
  }
  // #endregion

  // #region UTILITY: String Parsing (Image Sources & JSON)
  const JSONStringify = function (obj, isLogOnly) {
    try {
      if (_.isUndefined(obj)) { return isLogOnly ? '<UNDEFINED>' : '&gt;UNDEFINED&lt;' }
      if (isLogOnly) { return JSON.stringify(obj).replace(/\"/g, '').replace(/\n/g, '').replace(/:/g, ': ').replace(/\[/g, ' [').replace(/\]/g, '] ').replace(/,/g, ', ').replace(/\{/g, ' {').replace(/\}/g, '} ') } else { return JSON.stringify(obj, null, '    ').replace(/\"/g, "'").replace(/ /g, '&nbsp;').replace(/\n/g, '<br/>').replace(/&nbsp;&nbsp;/g, '&nbsp;') }
    } catch (err) {
      formatError('Bad Stringify: ' + err)
      return '&gt;ERR&lt;'
    }
  }

  const JSONStringifyLog = function (obj) {
    return JSONStringify(obj, true)
  }

  const getTextWidth = function (obj, text) {
    var font = obj.get('font_family').split(' ')[0].replace(/[^a-zA-Z]/g, '')
    var size = obj.get('font_size')
    var chars = text.split('')
    let fontRef = state.DATA.CHARWIDTH[font]
    if (!fontRef) {
      formatError("No font reference for '" + font + "'")
      return
    }
    let charRef = fontRef[size]
    if (!charRef) {
      formatError("No character reference for '" + font + "' at size '" + size + "'")
      return
    }
    var width = 0
    var missingChars = ''
    _.each(chars, function (char) {
      if (!charRef[char] && charRef[char] != ' ' && charRef[char] != 0) {
        missingChars += char
        formatLog("... MISSING '" + char + "' in '" + font + "' at size '" + size + "'")
      } else { width += parseInt(charRef[char]) }
    })
    return width
  }

  const ordinalize = function (num) {
    switch (num.toString().slice(-1)) {
      case '1':
        return num + (num.toString().slice(-2) == '11' ? 'th' : 'st')
        break
      case '2':
        return num + (num.toString().slice(-2) == '12' ? 'th' : 'nd')
        break
      case '3':
        return num + (num.toString().slice(-2) == '13' ? 'th' : 'rd')
        break
      default:
        return num + 'th'
        break
    };
  }
  // #endregion

  // #region CHECKS
  const isIn = function (ndl, hay) {
    hay = hay || _.flatten(_.values(ATTRIBUTES)).concat(_.flatten(_.values(SKILLS))).concat(DISCIPLINES).concat(TRACKERS)
    ndl = '\\b' + ndl.replace(/^g[0-9]/, '') + '\\b'
    var result
    if (_.isArray(hay)) {
      let index = _.findIndex(_.flatten(hay), function (s) {
        return s.match(new RegExp(ndl, 'i')) !== null || s.match(new RegExp(ndl.replace(/_/g), 'i')) !== null
      })
      result = index == -1 ? false : _.flatten(hay)[index]
    } else if (_.isObject(hay)) {
      let index = _.findIndex(_.keys(hay), function (s) {
        return s.match(new RegExp(ndl, 'i')) !== null || s.match(new RegExp(ndl.replace(/_/g), 'i')) !== null
      })
      result = index == -1 ? false : _.keys(hay)[index]
    } else { result = hay.match(new RegExp(ndl, 'i')) !== null }
    return result || false
  }
  // #endregion

  // #region GETTERS: Names & IDs of Characters & Selected Objects, Players & GM; Repeating Section Info

  // Returns the first GM ID in the GM List.
  const getGMID = function () {
    return _.find(findObjs({
      _type: 'player'
    }), function (player) {
      return playerIsGM(player._id)
    })
  }

  // Returns the NAME of the Graphic, Character or Player (DISPLAYNAME) given: object or ID.
  const getName = function (value, isShort) {
    let id, obj
    if (_.isString(value)) {
      id = value
      obj = getObj('graphic', id) || getObj('character', id)
    } else {
      id = value._id
      obj = value
    }
    var name = ''
    if (obj && obj.get('name')) { name = obj.get('name') } else { name = getObj('player', id) ? getObj('player', id).get('_displayname') : null }
    if (name && isShort) {
      if (name.includes('"')) { return name.replace(/.*?["]/i, '').replace(/["].*/i, '').replace(/_/g, ' ') } else { return str.replace(/.*\s/i, '').replace(/_/g, ' ') }
    } else if (name) { return name }
    formatError('No name found for ID: ' + id, 'D.GETNAME')
    return false
  }

  // Returns an ARRAY OF CHARACTERS given: "all", a character ID, a character Name, a token object, a message with selected tokens, OR an array of such parameters.
  const getChars = function (value) {
    let searchParams = []
    if (!value) { return formatError('No Value Given!', 'D.GETCHARS') }
    if (value.who) {
      if (!value.selected || !value.selected[0]) { return formatError('Must Selected a Token!', 'D.GETCHARS') }
      let tokens = _.filter(value.selected, function (selection) {
        return getObj('graphic', selection._id) &&
                    _.isString(getObj('graphic', selection._id).get('represents')) &&
                    getObj('character', getObj('graphic', selection._id).get('represents'))
      })
      if (!tokens) { return formatError('No Valid Token Selected: ' + JSONStringify(value.selected), 'D.GETCHARS') }
      return _.map(tokens, function (token) { return getObj('character', getObj('graphic', token._id).get('represents')) })
    } else if (_.isArray(value)) { searchParams = value } else if (_.isString(value) || _.isObject(value)) { searchParams.push(value) } else { return formatError("Bad Value: '" + JSONStringify(value) + "'", 'GETCHARS') }
    let charObjs = []
    _.each(searchParams, function (v) {
      let theseCharObjs = []
      // If parameter is a CHARACTER ID:
      if (_.isString(v) && getObj('character', v)) { theseCharObjs.push(getObj('character', v)) }
      // If parameters is a TOKEN OBJECT:
      else if (_.isObject(v) && v.id && v.get('_type') === 'graphic' && v.get('_subtype') === 'token') {
        if (getObj('character', v.get('represents'))) { theseCharIDs.push(getObj('character', v.get('represents'))) } else { formatError("Token '" + JSONStringify(v.id) + "' Does Not Represent a Character.", 'D.GETCHARS') }
      }
      // If parameter is "all":
      else if (v === 'all') { theseCharObjs = findObjs({ _type: 'character' }) }
      // If parameter is a CHARACTER NAME:
      else if (_.isString(v)) { theseCharObjs = findObjs({ _type: 'character', name: v }) }
      if (theseCharObjs.length === 0) { formatError("No Characters Found for Value '" + JSONStringify(v) + "' in '" + JSONStringify(value) + "'", 'D.GETCHARS') }
      charObjs = _.uniq(_.compact(charObjs.concat(theseCharObjs)))
    })
    return charObjs
  }

  const getChar = function (value) {
    return getChars(value)[0]
  }

  const getStat = function (value, name) {
    let charObj = getChar(value)
    return findObjs({ _type: 'attribute', _characterid: charObj.id, _name: name })[0]
  }

  // Given a lower-case row ID (from sheetworker), converts it to proper case.
  const getCaseRepID = function (lowCaseID, value) {
    let charObj = getChar(value)
    let attrObjs = _.filter(findObjs(charObj ? { type: 'attribute', characterid: charObj.id } : { type: 'attribute' }), o => o.get('name').toLowerCase().includes(lowCaseID))
    if (!attrObjs || attrObjs.length == 0) { return formatError("No attributes found with id '" + JSON.stringify(lowCaseID) + (charObj ? "' for char '" + getName(charObj) : '') + "'") }
    formatLog('AttrObjs: ' + JSONStringifyLog(attrObjs), 'GETCASEREPID')
    return attrObjs[0].get('name').split('_')[2]
  }

  // Returns an ARRAY of REPEATING ATTRIBUTE OBJECTS on <value> character.  Can specify a filter array containing strings that must appear in the attribute's name.
  const getRepStats = function (value, filterArray) {
    let charObj = getChar(value)
    if (!charObj) { return false }
    let attrObjs = findObjs({ type: 'attribute', characterid: charObj.id })
    _.each(filterArray, f => attrObjs = _.filter(attrObjs, a => a.get('name').toLowerCase().includes(f.toLowerCase())))
    return attrObjs
  }

  // As getRepStats(), but only returns a single attribute object.
  const getRepStat = function (value, filterArray) {
    return getRepStats(value, filterArray)[0]
  }

  // Returns a PLAYER ID given: display name, token object, character object.
  const getPlayerID = function (value) {
    if (_.isString(value)) {
      try {
        return findObjs({ _type: 'player', _displayname: value })[0].id
      } catch (err) {
        return formatError("No player found with value '" + JSONStringify(value) + "'", 'D.GETPLAYERID')
      }
    }
    try {
      let playerID
      if (value.get('_type') === 'graphic' && value.get('_subtype') === 'token') { value = value.get('represents') }
      if (value.get('_type') === 'character') { playerID = value.get('controlledby').replace('all,', '').replace(',all', '').split(',', 1)[0] }
      if (!playerID) throw 'No player ID found controlling ' + value.get('_type') + " with ID '" + value.id + "'"
      return playerID
    } catch (err) {
      return formatError(err + " (for value '" + JSONStringify(value) + "'", 'D.GETPLAYERID')
    }
  }
  // #endregion

  // #region SETTERS:  New Repeating Section Rows
  var makeRow = function (char, secName, attrs) {
    char = _.isString(char) ? char : char.id
    var generateUUID = (function () {
      'use strict'

      var a = 0; var b = []
      return function () {
        var c = (new Date()).getTime() + 0; var d = c === a
        a = c
        for (var e = new Array(8), f = 7; f >= 0; f--) {
          e[f] = '-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz'.charAt(c % 64)
          c = Math.floor(c / 64)
        }
        c = e.join('')
        if (d) {
          for (f = 11; f >= 0 && b[f] === 63; f--) {
            b[f] = 0
          }
          b[f]++
        } else {
          for (f = 0; f < 12; f++) {
            b[f] = Math.floor(64 * Math.random())
          }
        }
        for (f = 0; f < 12; f++) {
          c += '-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz'.charAt(b[f])
        }
        return c
      }
    }())

    var makeRowID = function () {
      'use strict'
      return generateUUID().replace(/_/g, 'Z')
    }

    var rowID = makeRowID()
    var prefix = 'repeating_' + secName + '_' + rowID + '_'
    _.each(attrs, function (v, k) {
      createObj('attribute', {
        name: prefix + k,
        current: v,
        max: '',
        _characterid: char
      })
    })
    return rowID
  }
  // #endregion

  // #region SPECIAL FX
  const runFX = function (name, pos) {
    spawnFxWithDefinition(pos.left, pos.top, FX[name])
  }

  // #endregion

  // #region CHAT FUNCTIONS

  // Whispers formatted chat message to player given: display name OR player ID.
  // Message can be an array of strings OR objects, of form: { message: <message>, title: <title> }.
  const sendChatMessage = function (who, message, title) {
    let messageString = ''
    if (_.isArray(message)) {
      _.each(message, function (v) {
        if (_.isObject(v)) { sendChatMessage(who, v, title) } else { messageString += parseChatLine(v) }
      })
    } else if (_.isObject(message)) { sendChatMessage(who, message.message || '', message.title || title) } else { messageString += parseChatLine(message) }
    if (messageString !== '') {
      if (getObj('player', who)) { who = getObj('player', who).get('_displayname') }
      if (title) {
        messageString = '<div style="display: block; font-weight: bold; border-bottom: 1px solid black;">' +
                                    title +
                                '</div>' +
                                messageString
      }
      messageString = '<div style="border: 1px solid black; background-color: white; padding: 3px 3px;">' +
                    messageString +
                '</div>'
      sendChat('', '/w "' + who + '" ' + messageString)
    }
  }

  const parseChatLine = function (message) {
    return '<div style="display: block;">' +
                    '<span style="font-family:sans-serif; font-size: 10px; line-height: 10px;">' +
                        message +
                    '</span>' +
                '</div>'
  }

  // Sends specified error message to the GM.
  const formatError = function (msg, title) {
    title = title ? (': ' + title) : ''
    if (getGMID()) { sendChatMessage('Storyteller', msg, '[ERROR' + title + ']') }
    formatLog('[ERROR' + title + '] ' + msg)
    return false
  }

  // Logs a bug report, but only if DEBUGLEVEL set to the PROVIDED LEVEL or HIGHER.
  const formatDebug = function (msg, title, level) {
    level = level || 3
    state[GAMENAME].DEBUGLEVEL = state[GAMENAME].DEBUGLEVEL || 0
    if (state[GAMENAME].DEBUGLEVEL >= level) {
      formatLog(msg, title)
      if (state[GAMENAME].DEBUGLEVEL >= 10) {
        formatAlert(msg, title)
      }
    }
  }

  // Sets debug level.
  const setDebugLvl = function (lvl) {
    lvl = lvl || 0
    state[GAMENAME].DEBUGLEVEL = parseInt(lvl)
  }

  // Sends general message to the GM.
  const formatAlert = function (msg, title) {
    msg = _.isString(msg) ? msg : JSONStringify(msg)
    if (getGMID()) { msg = '/w ' + getName(getGMID()) + ' ' + msg }
    sendChatMessage('Storyteller', msg, title || '[ALERT]')
    return false
  }

  const formatLog = function (msg, title) {
    log((title ? ('[' + JSONStringify(title, true) + ']  ') : '') + JSONStringify(msg, true))
  }
  // #endregion

  return {
    GAMENAME: GAMENAME,
    GMID: getGMID,

    ATTRIBUTES: ATTRIBUTES,
    SKILLS: SKILLS,
    DISCIPLINES: DISCIPLINES,
    TRACKERS: TRACKERS,
    BLOODPOTENCY: BLOODPOTENCY,
    RESPROBS: RESPROBS,

    PAGEID: VALS.PAGEID,
    CELLSIZE: VALS.CELLSIZE,

    JS: JSONStringify, // D.JS(obj, isLog): Parses a string. If isLog, will not use HTML.
    JSL: JSONStringifyLog, // D.JSL(obj):  Parses a string, for output to the console log.
    Ordinalize: ordinalize, // D.Ordinalize(num): Returns ordinalized number (e.g. 1 -> "1st")
    Log: formatLog, // D.Log(msg, title): Formats log message, with title.
    IsIn: isIn, // D.IsIn(needle, [haystack]): Returns formatted needle if found in
    //        haystack (= all traits by default)
    GetName: getName, // D.GetName(id): Returns name of graphic, character or player's
    //        display name. If isShort, returns name without quoted parts
    //        OR only last name if no quotes.

    GetChars: getChars, // D.GetChars(val): Returns array of matching characters, given
    //        "all", a chat message with selected token(s), character ID,
    //        player ID, character name OR array of those params.
    GetChar: getChar, // D.GetChar(val): As above, but returns only the first character
    //       object found.
    GetStat: getStat, // D.GetStat(char, name):  Given any valid character value, returns the
    //        attribute object described by name.
    GetRepIDCase: getCaseRepID,
    GetRepStats: getRepStats,
    GetRepStat: getRepStat,
    GetPlayerID: getPlayerID, // D.GetPlayerID(val):  Returns player ID given: display name, token
    //       object, character object.
    GetTextWidth: getTextWidth, // D.GetTextWidth(obj, text):  Returns width of given text object if
    //       it held supplied text.
    MakeRow: makeRow, // D.MakeRow(charID/obj, secName, attrs):  Creates repeating fieldset
    //       row in secName with attrs for character given by object or ID.
    RunFX: runFX, // D.RunFX(name, {top: y, left: x}):  Runs a special effect at the given location.
    ThrowError: formatError, // D.ThrowError(err, title): Logs an error and messages GM.
    SetDebugLevel: setDebugLvl, // D.SetDebugLevel(lvl): Sets debug level to lvl.
    DB: formatDebug, // D.DB(msg, title, lvl): Logs debug if DEBUGLEVEL equal to lvl or higher.
    Alert: formatAlert, // D.Alert(msg, title): Sends alert message to GM.
    SendMessage: sendChatMessage // D.Chat(who, msg, title): Sends chat message as 'who' with
    //       message and title. Message can be an array of strings OR
    //       objects, of form: { message: <message>, title: <title> }
  }
})()
