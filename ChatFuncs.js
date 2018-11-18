// ChatFuncs.js, "ChatFuncs".  No exposure to other scripts in the API.
//   >>> ChatFuncs is a library of commands that can be triggered from within roll20 chat.  You can view the properties of selected objects and the state variable; run text-sizing tests to be used in scripts like Roller;   is both a library of handy resources for other scripts to use, and a master configuration file for your game.  You can find a list of all of the available methods at the end of the script.  Configuration is a bit trickier, but is contained to the CONFIGURATION and DECLARATIONS #regions.// Various commands to get information about objects in the Roll20 space.
// Strictly a utility script: Doesn't set things or return information to other API objects --- use DATA for that.

var ChatFuncs = (function () {
  'use strict'

  const HELPMESSAGE = [{
    title: 'Get Data',
    message: '<p>' +
                'Various commands to query information from the Roll20 tabletop and state variable.  <b>If a command relies on a "selected token", make sure the token is associated with a character sheet (via the token\'s setting menu).' +
                '</p>' +
                '<p>' +
                '<b>Commands</b>' +
                '<div style="padding-left:10px;">' +
                '<ul>' +
                '<li style="border-top: 1px solid #ccc;border-bottom: 1px solid #ccc;">' +
                '<b><span style="font-family: serif;">!get all</span></b> - Gets a JSON stringified list of all the object\'s properties' +
                '</li>' +
                '<li style="border-top: 1px solid #ccc;border-bottom: 1px solid #ccc;">' +
                '<b><span style="font-family: serif;">!get char</span></b> - Gets the name, character ID, and player ID represented by the selected token.' +
                '</li>' +
                '<li style="border-top: 1px solid #ccc;border-bottom: 1px solid #ccc;">' +
                '<b><span style="font-family: serif;">!get img</span></b> - Gets the graphic ID and img source of the selected graphic.' +
                '</li>' +
                '<li style="border-top: 1px solid #ccc;border-bottom: 1px solid #ccc;">' +
                '<b><span style="font-family: serif;">!get pos</span></b> - Gets the position and dimensions of the selected object, in both grid and pixel units.' +
                '</li>' +
                '<li style="border-top: 1px solid #ccc;border-bottom: 1px solid #ccc;">' +
                '<b><span style="font-family: serif;">!get attrs</span></b> - Gets all attribute objects attached to the selected character token.' +
                '</li>' +
                '<li style="border-top: 1px solid #ccc;border-bottom: 1px solid #ccc;">' +
                '<b><span style="font-family: serif;">!get prop [<id>] <property> </span></b> - Gets the contents of the specified property on the selected object, or the object ID.' +
                '</li> ' +
                '<li style="border-top: 1px solid #ccc;border-bottom: 1px solid #ccc;">' +
                '<b><span style="font-family: serif;">!get state [<namespace>]</span></b> - Gets a stringified list of all items in the given state namespace.' +
                '</li> ' +
                '</ul>' +
                '</div>' +
                '</p>'
  },
  {
    title: 'Find Objects',
    message: '<p>' +
                'Commands to search the game board for objects meeting certain characteristics.' +
                '</p>' +
                '<p>' +
                '<b>Commands</b>' +
                '<div style="padding-left:10px;">' +
                '<ul>' +
                '<li style="border-top: 1px solid #ccc;border-bottom: 1px solid #ccc;">' +
                '<b><span style="font-family: serif;">!find obj <type> <id></span></b> - Searches for a single object of the given type and with the given ID, and returns its characteristics.' +
                '</li> ' +
                '</ul>' +
                '</div>' +
                '</p>'
  }
  ]

  // #region Get Data Functions
  const getSelected = function (obj, isGettingAll) {
    if (!obj) { return false }
    D.Alert(isGettingAll ? D.JS(obj) : obj.id)
    return true
  }

  const getImg = function (obj) {
    if (!obj || obj.get('_type') !== 'graphic') { return false }
    D.Alert(['<b>ID:</b> ' + obj.id, '<b>SRC:</b> ' + obj.get('imgsrc').replace('max', 'thumb')], 'Image Data')
    return true
  }

  const getChar = function (obj) {
    D.Log(obj, 'OBJ')
    if (!obj || obj.get('_type') !== 'graphic' || obj.get('_subtype') !== 'token') { return false }
    try {
      const charObj = getObj('character', obj.get('represents'))
      D.Log(charObj, 'CHAROBJ')
      const name = charObj.get('name')
      const playerID = charObj.get('controlledby').replace('all,', '')
      D.Alert(['<b>Name:</b> ' + name, '<b>CharID:</b> ' + charObj.id, '<b>PlayerID:</b> ' + playerID], 'Character Data')
    } catch (e) {
      D.ThrowError(e)
      return false
    }
    return true
  }

  const getCharAttrs = function (obj) {
    if (!obj) { return false }
    const allAttrObjects = findObjs({
      _type: 'attribute',
      _characterid: obj.get('represents')
    })
    let allAttrs = []
    _.each(allAttrObjects, function (attrObj) {
      allAttrs.push({
        name: D.JS(attrObj.get('name')),
        current: D.JS(attrObj.get('current')).replace(/\[/g, '\\[').replace(/{/g, '\\{')
      })
    })
    const sortedAttrs = _.sortBy(allAttrs, 'name')
    let attrsLines = []
    _.each(sortedAttrs, function (attrInfo) {
      attrsLines.push('<b>' + D.JS(attrInfo.name).replace(/''/g, '') + ':</b> ' + D.JS(attrInfo.current).replace(/\\\\/g, '\\').replace(/''/g, ''))
    })
    D.Alert(attrsLines, 'Attribute Data for ' + D.GetName(obj.get('represents')))
    return true
  }

  const getPos = function (obj) {
    if (!obj) { return false }
    var gridInfo = ' <b>Center:</b> ' + (obj.get('left') / D.CELLSIZE()) + ', ' + (obj.get('top') / D.CELLSIZE()) +
            '<br/> <b>Left:</b> ' + ((obj.get('left') - 0.5 * obj.get('width')) / D.CELLSIZE()) +
            '<br/> <b>Top:</b> ' + ((obj.get('top') - 0.5 * obj.get('height')) / D.CELLSIZE()) +
            '<br/> <b>Dimensions:</b> ' + obj.get('width') / D.CELLSIZE() + ' x ' + obj.get('height') / D.CELLSIZE()
    var pixelInfo = ' Center:</b> ' + obj.get('left') + ', ' + obj.get('top') +
            '<br/> <b>Left:</b> ' + ((obj.get('left') - 0.5 * obj.get('width'))) +
            '<br/> <b>Top:</b> ' + ((obj.get('top') - 0.5 * obj.get('height'))) +
            '<br/> <b>Dimensions:</b> ' + obj.get('width') + ' x ' + obj.get('height')
    D.Alert(['<b><u>GRID</u>:</b><br/>' + gridInfo, '<b><u>PIXELS</u>:</b><br/>' + pixelInfo], 'Position Data')
    return true
  }

  const getProperty = function (obj, property) {
    if (!property || !obj) { return false }
    let propString = obj.get(property, function (p) {
      D.Alert(p, obj.get('_type').toUpperCase() + " '" + obj.get('name') + "' - " + property)
      return p
    })
    if (propString) { D.Alert(D.JS(propString), obj.get('_type').toUpperCase() + " '" + obj.get('name') + "' - " + property) }
    return true
  }

  const getStateData = function (namespace) {
    let stateInfo = state
    let title = 'state.' + namespace.join('.')
    // eslint-disable-next-line no-unmodified-loop-condition
    while (namespace && namespace.length > 0) {
      stateInfo = stateInfo[namespace.shift()]
    }
    D.Alert(D.JS(stateInfo), title)
    return true
  }

  const clearStateData = function (namespace) {
    var stateInfo = state
    let title = 'Clearing state.' + namespace.join('.')
    // eslint-disable-next-line no-unmodified-loop-condition
    while (namespace && namespace.length > 0) {
      stateInfo = stateInfo[namespace.shift()]
    }
    D.Alert('DELETED ' + D.JS(stateInfo), title)
    stateInfo = ''
    return true
  }
  // #endregion

  // #region Text Length Testing
  const prepText = function (objIDs, string) {
    for (var i = 0; i < objIDs.length; i++) {
      var char = string.charAt(i)
      var obj = findObjs({
        _id: objIDs[i]._id
      })[0]
      obj.set('text', char.repeat(20))
    };
  }

  const resolveText = function (objIDs) {
    var font, size
    for (var i = 0; i < objIDs.length; i++) {
      var obj = findObjs({
        _id: objIDs[i]._id
      })[0]
      let width = obj.get('width')
      font = obj.get('font_family').split(' ')[0]
      size = obj.get('font_size')
      var char = obj.get('text').charAt(0)
      state.DATA = state.DATA || {}
      state.DATA.CHARWIDTH = state.DATA.CHARWIDTH || {}
      state.DATA.CHARWIDTH[font] = state.DATA.CHARWIDTH[font] || {}
      state.DATA.CHARWIDTH[font][size] = state.DATA.CHARWIDTH[font][size] || {}
      state.DATA.CHARWIDTH[font][size][char] = width / 20
      // D.Alert("Total Width: " + width + ", Char Width: " + (width / 20), "Text Width of '" + character + "'");
    };
    D.Alert("Current Widths of '" + font + "' at Size " + size + ':   ' + D.JS(state.DATA.CHARWIDTH[font][size]))
  }

  const caseText = function (objIDs, textCase) {
    _.each(objIDs, function (id) {
      var obj = findObjs({
        _id: id._id
      })[0]
      if (textCase === 'upper') { obj.set('text', obj.get('text').toUpperCase()) } else if (textCase === 'lower') { obj.set('text', obj.get('text').toLowerCase()) }
    })
  }
  // #endregion

  // #region Event Handlers (handleInput)
  const handleInput = function (msg) {
    if (msg.type !== 'api' || !playerIsGM(msg.playerid)) {
      return
    }
    let args = msg.content.split(/\s+/)
    var obj
    switch (args.shift()) {
      case '!get':
        if (msg.selected && msg.selected[0]) {
          obj = findObjs({
            _id: msg.selected[0]._id
          })[0]
        } else {
          for (let i = 1; i < args.length; i++) {
            obj = findObjs({
              _id: args[i]
            })[0]
            if (obj) {
              args.splice(i, 1)
              break
            }
          }
        }
        switch (args.shift()) {
          case null:
            if (!getSelected(obj)) { D.Alert(HELPMESSAGE) }
            break
          case 'all':
            if (!getSelected(obj, true)) { D.Alert(HELPMESSAGE) }
            break
          case 'img':
            if (!getImg(obj)) { D.Alert(HELPMESSAGE) }
            break
          case 'char':
            if (!getChar(obj)) { D.Alert(HELPMESSAGE) }
            break
          case 'pos':
            if (!getPos(obj)) { D.Alert(HELPMESSAGE) }
            break
          case 'attrs':
            if (!getCharAttrs(obj)) { D.Alert(HELPMESSAGE) }
            break
          case 'prop':
          case 'property':
            if (!getProperty(obj, args.shift())) { D.Alert(HELPMESSAGE) }
            break
          case 'state':
            if (!getStateData(args)) { D.Alert(HELPMESSAGE) }
            break
          case 'page':
            D.Alert(D.JS(Campaign().get('playerpageid')), 'Page ID')
            break
          default:
            D.Alert(HELPMESSAGE)
            break
        }
        break
      case '!set':
        if (msg.selected && msg.selected[0]) {
          obj = findObjs({
            _id: msg.selected[0]._id
          })[0]
        } else {
          for (let i = 1; i < args.length; i++) {
            obj = findObjs({
              _id: args[i]
            })[0]
            if (obj) {
              args.splice(i, 1)
              break
            }
          }
        }
        switch (args.shift()) {
          case 'size':
            let [deltaX, deltaY] = [args.shift(), args.shift()]
            let [initX, initY] = [parseInt(obj.get('width')), parseInt(obj.get('height'))]
            let attrList = {
              width: deltaX.includes('x') ? (initX * parseInt(deltaX.replace(/x/g, ''))) : parseInt(deltaX),
              height: deltaY.includes('x') ? (initY * parseInt(deltaY.replace(/x/g, ''))) : parseInt(deltaY)
            }

            D.Alert('Changing ' + D.JS(initX) + ', ' + D.JS(initY) + ' ---> ' + D.JS(deltaX) + ', ' + D.JS(deltaY) + '\nSetAttrs: ' + D.JS(attrList))
            D.Alert('Replacing X: ' + D.JS(deltaX.replace(/x/g, '')))
            D.Alert('Parse Int: ' + D.JS(parseInt(deltaX.replace(/x/g, ''))))
            D.Alert('Multiplying: ' + D.JS(initX * parseInt(deltaX.replace(/x/g, ''))))
            // obj.set()
            break
        }
        break
      case '!find':
        switch (args.shift()) {
          case 'obj':
          case 'object':
            let type = args.shift()
            let id = args.shift()
            if (!type || !id) {
              D.Alert(HELPMESSAGE)
              break
            }
            D.Alert(D.JS(getObj(type, id)), 'Object(s) Found')
            break
          case 'textWidth':
            if (!msg.selected || !msg.selected[0]) { break }
            let width = D.GetTextWidth(findObjs({
              _id: msg.selected[0]._id
            })[0], args.join(' '))
            D.Alert('The text you entered should be ' + width + ' pixels wide.')
            break
          default:
            D.Alert(HELPMESSAGE)
            break
        }
        break
      case '!clearState':
        if (!clearStateData(args)) { D.Alert(HELPMESSAGE) }
        break
      case '!prepText':
        let string = args.shift()
        if (!msg.selected || !msg.selected[0]) { break }
        prepText(msg.selected, string)
        D.Alert("Move the text object around, and type '!resText' when you have.")
        break
      case '!resText':
        if (!msg.selected || !msg.selected[0]) { break }
        resolveText(msg.selected)
        break
      case '!upperText':
        if (!msg.selected || !msg.selected[0]) { break }
        caseText(msg.selected, 'upper')
        break
      case '!lowerText':
        if (!msg.selected || !msg.selected[0]) { break }
        caseText(msg.selected, 'lower')
        break
      case '!checkText':
        if (!msg.selected || !msg.selected[0]) { break }
        let thisObj = findObjs({
          _id: msg.selected[0]._id
        })[0]
        let size = thisObj.get('font_size')
        let font = thisObj.get('font_family').split(' ')[0]
        D.Alert('There are ' + _.values(state.DATA.CHARWIDTH[font][size]).length + ' entries.', D.JS(font).toUpperCase() + ' ' + D.JS(size))
        break
      default:
        break
    }
  }
  // #endregion

  // #region Public Functions: RegisterEventHandlers
  const registerEventHandlers = function () {
    on('chat:message', handleInput)
  }

  return {
    RegisterEventHandlers: registerEventHandlers
  }
  // #endregion
}())

on('ready', function () {
  'use strict'
  ChatFuncs.RegisterEventHandlers()
  log('ChatFuncs: Ready!')
})
