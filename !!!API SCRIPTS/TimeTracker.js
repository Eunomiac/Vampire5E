var TimeTracker = (function () {
  

  // #region Configuration
  const IMAGES = {
    day:       'https://s3.amazonaws.com/files.d20.io/images/66268397/qtmx8f4z8jcvK2sEGaxl5A/thumb.jpg?1541330279',
    night:     'https://s3.amazonaws.com/files.d20.io/images/66268396/ZI7kzQ3i8TH9dANaYBDPlA/thumb.jpg?1541330279',
    latenight: 'https://s3.amazonaws.com/files.d20.io/images/66268394/y4ITk2QTo_ifYKZWhTXiGg/thumb.jpg?1541330278',
    predawn:   [
      'https://s3.amazonaws.com/files.d20.io/images/66268399/ZCbXqDFScIhdXGwoWq8C8g/thumb.jpg?1541330279',
      'https://s3.amazonaws.com/files.d20.io/images/66268393/a3N45dEewo9234IcrNQh2Q/thumb.jpg?1541330279',
      'https://s3.amazonaws.com/files.d20.io/images/66268395/65zluFmgkw_5V2WXanLaqQ/thumb.jpg?1541330280',
      'https://s3.amazonaws.com/files.d20.io/images/66268398/_mHzoQDP6323ZTWApHnjsw/thumb.jpg?1541330279',
      'https://s3.amazonaws.com/files.d20.io/images/66268400/F5YhSKEOvgAV8ZF2HpdHUQ/thumb.jpg?1541330280'
    ],
    dawn: 'https://s3.amazonaws.com/files.d20.io/images/66268397/qtmx8f4z8jcvK2sEGaxl5A/thumb.jpg?1541330279'
  }
  const DAYSOFWEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const NIGHT = [
    ['7:44', '17:12'],
    ['7:11', '17:51'],
    ['7:22', '19:28'],
    ['6:26', '20:06'],
    ['5:48', '20:40'],
    ['5:35', '21:01'],
    ['5:54', '20:52'],
    ['5:48', '20:40'],
    ['6:26', '20:06'],
    ['7:22', '19:28'],
    ['7:11', '17:51'],
    ['7:44', '17:12']
  ]
  const HORIZONS = {
    latenight: '1:00',
    predawn:   [-90, -60, -30, -15, -5]
  }
  // #endregion

  // #region Date Functions
  var setCurrentDate = function (date, tracker, horizon) {
    tracker.set('text', DAYSOFWEEK[date.getUTCDay()] + ', ' +
        MONTHS[date.getMonth()] + ' ' +
        D.Ordinalize(date.getUTCDate()) + ', ' +
        (date.getUTCHours() % 12).toString().replace(/^0:/g, '') + ':' +
        (date.getUTCMinutes() < 10 ? '0' : '') + date.getUTCMinutes().toString() + ' ' +
        (Math.floor(date.getUTCHours() / 12) === 0 ? 'AM' : 'PM')
    )
    let lastDate = new Date(parseInt(state[D.GAMENAME].TimeTracker.currentDate))
    state[D.GAMENAME].TimeTracker.currentDate = date.getTime().toString()
    if (
      date.getUTCFullYear() !== lastDate.getUTCFullYear() ||
      date.getMonth() !== lastDate.getMonth() ||
      date.getUTCDate() !== lastDate.getUTCDate()
    ) _.each(Chars.GetAll(), char => setAttrs(char.id, { todaysdate: date.getTime().toString() })) 
    setHorizon(date, horizon)
  }

  var setHorizon = function (date, horizon) {
    let nighttime = _.map(NIGHT[date.getMonth()], t => [parseInt(t.split(':')[0]), parseInt(t.split(':')[1])])
    let dawn = new Date((new Date(date)).setUTCHours(nighttime[0][0], nighttime[0][1]))
    if (date.getUTCHours() > 10) dawn.setUTCDate(date.getUTCDate() + 1) 
    let dusk = new Date((new Date(date)).setUTCHours(nighttime[1][0], nighttime[1][1]))
    let lateNight = new Date((new Date(date)).setUTCHours(parseInt(HORIZONS.latenight.split(':')[0]), parseInt(HORIZONS.latenight.split(':')[1])))
    if (date.getUTCHours() < 14 && lateNight.getUTCHours() > 14) lateNight.setUTCDate(date.getUTCDate() - 1) 
    if (date.getUTCHours() > 14 && lateNight.getUTCHours() < 14) lateNight.setUTCDate(date.getUTCDate() + 1) 
    if (date.getUTCHours() < 14) dusk.setUTCDate(date.getUTCDate() - 1) 
    // D.Log("DAWN: " + D.JSL(dawn) + "<br>DUSK: " + D.JSL(dusk) + "<br>LATE: " + D.JSL(lateNight) + "<br>PREDAWN[0]: " + D.JSL(new Date(new Date(dawn).setUTCMinutes(dawn.getUTCMinutes() + HORIZONS.predawn[0]))) + "<br><br>CURRENT: " + D.JSL(date), "TIMETRACKER: SETHORIZON()");
    if (date < dusk || date > dawn) 
      {horizon.set('imgsrc', IMAGES.day)}
     else if (date < lateNight) 
      {horizon.set('imgsrc', IMAGES.night)}
     else if (date < new Date(dawn).setUTCMinutes(dawn.getUTCMinutes() + HORIZONS.predawn[0])) 
      {horizon.set('imgsrc', IMAGES.latenight)}
     else {
      for (var i = HORIZONS.predawn.length; i > 0; i--) {
        if (date >= new Date(dawn).setUTCMinutes(dawn.getUTCMinutes() + HORIZONS.predawn[i - 1])) {
          horizon.set('imgsrc', IMAGES.predawn[i - 1])
          break
        }
      }
    }
  }
  // #endregion

  // #region Event Handlers (handleInput)
  var handleInput = function (msg) {
    if (msg.type !== 'api' || !playerIsGM(msg.playerid)) return 
    let args = msg.content.split(/\s+/)
    switch (args.shift().toLowerCase()) {
      case '!time':
        if (!state[D.GAMENAME].TimeTracker.timeText) return D.Alert("Register a text object first, with '!reg time'", 'TIMETRACKER') 
        if (!state[D.GAMENAME].TimeTracker.horizonImage) return D.Alert("Register an image object first, with '!reg horizon'", 'TIMETRACKER') 
        var tracker = findObjs({ _id: state[D.GAMENAME].TimeTracker.timeText })[0]
        var horizon = findObjs({ _id: state[D.GAMENAME].TimeTracker.horizonImage })[0]
        var currentDate = state[D.GAMENAME].TimeTracker.currentDate
        var date
        let arg = args.shift().toLowerCase()
        var params = args.join(' ').toUpperCase()
        switch (arg) {
          case 'add':
            params = _.compact(params.split(' '))
            date = new Date(parseInt(currentDate))
            let delta = parseInt(params.shift())
            let unit = params.shift().toLowerCase()
            if (unit.slice(0, 1) === 'y') { date.setUTCFullYear(date.getUTCFullYear() + delta) } else if (unit.includes('mo')) { date.setUTCMonth(date.getMonth() + delta) } else if (unit.slice(0, 1) === 'w') { date.setUTCDate(date.getUTCDate() + 7 * delta) } else if (unit.slice(0, 1) === 'd') { date.setUTCDate(date.getUTCDate() + delta) } else if (unit.slice(0, 1) === 'h') { date.setUTCHours(date.getUTCHours() + delta) } else if (unit.includes('m')) date.setUTCMinutes(date.getUTCMinutes() + delta) 
            break
          case 'set': //   !time set 2018-07-09T01:12
            date = new Date(params)
            break
        }
        setCurrentDate(date, tracker, horizon)
        break
      case '!reg':
        if (!msg.selected || !msg.selected[0]) return D.ThrowError("Select an object, then '!reg <time/horizon>'.") 
        switch (args.shift().toLowerCase()) {
          case 'time':
            state[D.GAMENAME].TimeTracker.timeText = msg.selected[0]._id
            break
          case 'horiz':
          case 'horizon':
          case 'hor':
            state[D.GAMENAME].TimeTracker.horizonImage = msg.selected[0]._id
        }
        break
      default:
        break
    }
  }

  // #endregion

  // #region Public Functions: registerEventHandlers, tapSpite
  const registerEventHandlers = function () {
    on('chat:message', handleInput)
  }

  const checkInstall = function () {
    state[D.GAMENAME] = state[D.GAMENAME] || {}
    state[D.GAMENAME].TimeTracker = state[D.GAMENAME].TimeTracker || {}
  }

  return {
    RegisterEventHandlers: registerEventHandlers,
    CheckInstall:          checkInstall
  }
  // #endregion
})()

on('ready', function () {
  
  TimeTracker.RegisterEventHandlers()
  TimeTracker.CheckInstall()
  D.Log('TimeTracker: Ready!')
})
