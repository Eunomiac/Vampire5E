var Roller = (function () {
  

  // #region CONFIGURATION: Image Links, Color Schemes
  const POSITIONS = {
    diceFrame: { top: 207, left: 175 },
    bloodCloudFX: {top: 185, left: 74.75 },
    bloodBoltFX: { top: 185, left: 74.75 },
    smokeBomb: { top: 301, left: 126 }
  }
  const IMAGES = {
    dice: {
      blank:    'https://s3.amazonaws.com/files.d20.io/images/63990142/MQ_uNU12WcYYmLUMQcbh0w/thumb.png?1538455511',
      selected: 'https://s3.amazonaws.com/files.d20.io/images/64173198/T0qdnbmLUCnrs9WlxoGwww/thumb.png?1538710883',
      Bf:       'https://s3.amazonaws.com/files.d20.io/images/64173205/DOUwwGcobI4eyu1Wb8ZDxg/thumb.png?1538710883',
      Bs:       'https://s3.amazonaws.com/files.d20.io/images/64173203/ZS04TJE6VRI8_Q-HaJ0r4g/thumb.png?1538710883',
      Bc:       'https://s3.amazonaws.com/files.d20.io/images/64173206/Fbt_6j-k_1oRKPxTKdnIWQ/thumb.png?1538710883',
      BcL:      'https://s3.amazonaws.com/files.d20.io/images/64173208/cIP4B1Y14gVdYrS3YPYNbQ/thumb.png?1538710883',
      BcR:      'https://s3.amazonaws.com/files.d20.io/images/64173199/1thrJQz9Hmzv0tQ6awSOGw/thumb.png?1538710883',
      Hb:       'https://s3.amazonaws.com/files.d20.io/images/64173201/mYkpkP6l9WX9BKt5fjTrtw/thumb.png?1538710883',
      Hf:       'https://s3.amazonaws.com/files.d20.io/images/64173204/AacOfDpF2jMCn1pYPmqlUQ/thumb.png?1538710882',
      Hs:       'https://s3.amazonaws.com/files.d20.io/images/64173209/D_4ljxj59UYXPNmgXaZbhA/thumb.png?1538710883',
      Hc:       'https://s3.amazonaws.com/files.d20.io/images/64173202/xsEkLc9DcOslpQoUJwpHMQ/thumb.png?1538710883',
      HcL:      'https://s3.amazonaws.com/files.d20.io/images/64173200/cBsoLkAu15XWexFSNUxoHA/thumb.png?1538710883',
      HcR:      'https://s3.amazonaws.com/files.d20.io/images/64173207/Se7RHT2fJDg2qMGo_x5UhQ/thumb.png?1538710883'
    },
    blank:      'https://s3.amazonaws.com/files.d20.io/images/63990142/MQ_uNU12WcYYmLUMQcbh0w/thumb.png?1538455511',
    diffFrame:  'https://s3.amazonaws.com/files.d20.io/images/64184544/CnzRwB8CwKGg-0jfjCkT6w/thumb.png?1538736404',
    frontFrame: 'https://s3.amazonaws.com/files.d20.io/images/64756368/mUTW1L_8xESxARXGKBm6cw/thumb.png?1539408973',
    topMids:    ['https://s3.amazonaws.com/files.d20.io/images/64683716/nPNGOLxzJ8WU0BzLNisuwg/thumb.png?1539327926', 'https://s3.amazonaws.com/files.d20.io/images/64683714/VPzeYN8xpO_cPmqg1rgFRQ/thumb.png?1539327926', 'https://s3.amazonaws.com/files.d20.io/images/64683715/xUCVS7pOmfS3ravsS2Vzpw/thumb.png?1539327926'],
    bottomMids: ['https://s3.amazonaws.com/files.d20.io/images/64683769/yVNOcNMVgUjGybRBVq3rTQ/thumb.png?1539328057', 'https://s3.amazonaws.com/files.d20.io/images/64683709/8JFF_j804fT92-JBncWJyw/thumb.png?1539327927', 'https://s3.amazonaws.com/files.d20.io/images/64683711/upnHr36sBnFYuQpkxoVm_A/thumb.png?1539327926'],
    topEnd:     'https://s3.amazonaws.com/files.d20.io/images/64683713/4IwPjcY7x5ZCLJ9ey2lICA/thumb.png?1539327926',
    bottomEnd:  'https://s3.amazonaws.com/files.d20.io/images/64683710/rJDVNhm6wMNhmQx1uIp13w/thumb.png?1539327926'
  }
  const STATECATS = {
    dice:    ['diceList', 'bigDice'],
    graphic: ['imgList', 'diceList', 'bigDice'],
    text:    ['textList'],
    path:    ['shapeList']
  }
  const COLORS = {
    white:        'rgb(255, 255, 255)',
    brightgrey:   'rgb(175, 175, 175)',
    grey:         'rgb(130, 130, 130)',
    darkgrey:     'rgb(80, 80, 80)',
    brightred:    'rgb(255, 0, 0)',
    red:          'rgb(200, 0, 0)',
    darkred:      'rgb(150, 0, 0)',
    green:        'rgb(0, 200, 0)',
    yellow:       'rgb(200, 200, 0)',
    orange:       'rgb(200, 100, 0)',
    brightpurple: 'rgb(200, 0, 200)',
    purple:       'rgb(150, 0, 150)',
    darkpurple:   'rgb(100, 0, 100)',
    brightblue:   'rgb(150, 150, 255)',
    blue:         'rgb(100, 100, 255)',
    darkblue:     'rgb(50, 50, 150)',
    cyan:         'rgb(0, 255, 255)'
  }
  const COLORSCHEMES = {
    project: {
      rollerName:  COLORS.white,
      mainRoll:    COLORS.white,
      posMods:     COLORS.white,
      negMods:     COLORS.brightred,
      summary:     COLORS.white,
      difficulty:  COLORS.white,
      resultCount: COLORS.white,
      margin:      {
        good: COLORS.white,
        bad:  COLORS.brightred
      },
      outcome: {
        best:  COLORS.white,
        good:  COLORS.white,
        bad:   COLORS.orange,
        worst: COLORS.brightred
      },
      subOutcome: {
        best:  COLORS.white,
        good:  COLORS.white,
        bad:   COLORS.orange,
        worst: COLORS.brightred
      }
    },
    trait: {
      rollerName:  COLORS.white,
      mainRoll:    COLORS.white,
      posMods:     COLORS.white,
      negMods:     COLORS.brightred,
      summary:     COLORS.white,
      difficulty:  COLORS.white,
      resultCount: COLORS.white,
      margin:      {
        good: COLORS.white,
        bad:  COLORS.brightred
      },
      outcome: {
        best:  COLORS.white,
        good:  COLORS.white,
        bad:   COLORS.orange,
        worst: COLORS.brightred
      }
    },
    willpower: {
      rollerName:  COLORS.white,
      mainRoll:    COLORS.white,
      posMods:     COLORS.white,
      negMods:     COLORS.brightred,
      summary:     COLORS.white,
      difficulty:  COLORS.white,
      resultCount: COLORS.white,
      margin:      {
        good: COLORS.white,
        bad:  COLORS.brightred
      },
      outcome: {
        best:  COLORS.white,
        good:  COLORS.white,
        bad:   COLORS.orange,
        worst: COLORS.brightred
      }
    },
    humanity: {
      rollerName:  COLORS.white,
      mainRoll:    COLORS.white,
      posMods:     COLORS.white,
      negMods:     COLORS.brightred,
      summary:     COLORS.white,
      difficulty:  COLORS.white,
      resultCount: COLORS.white,
      margin:      {
        good: COLORS.white,
        bad:  COLORS.brightred
      },
      outcome: {
        best:  COLORS.white,
        good:  COLORS.white,
        bad:   COLORS.orange,
        worst: COLORS.brightred
      }
    },
    frenzy: {
      rollerName:  COLORS.white,
      mainRoll:    COLORS.white,
      posMods:     COLORS.white,
      negMods:     COLORS.brightred,
      summary:     COLORS.white,
      difficulty:  COLORS.white,
      resultCount: COLORS.white,
      outcome:     {
        best:  COLORS.white,
        good:  COLORS.white,
        bad:   COLORS.orange,
        worst: COLORS.brightred
      }
    },
    remorse: {
      rollerName:  COLORS.white,
      mainRoll:    COLORS.white,
      summary:     COLORS.white,
      difficulty:  COLORS.white,
      resultCount: COLORS.white,
      outcome:     {
        best:  COLORS.white,
        good:  COLORS.white,
        bad:   COLORS.orange,
        worst: COLORS.brightred
      }
    },
    rouse: {
      rollerName: COLORS.white,
      mainRoll:   COLORS.white,
      outcome:    {
        best:  COLORS.white,
        good:  COLORS.white,
        bad:   COLORS.brightred,
        worst: COLORS.brightred
      }
    },
    rouse2: {
      rollerName: COLORS.white,
      mainRoll:   COLORS.white,
      outcome:    {
        best:  COLORS.white,
        good:  COLORS.white,
        bad:   COLORS.brightred,
        worst: COLORS.brightred
      }
    },
    check: {
      rollerName: COLORS.white,
      mainRoll:   COLORS.white,
      outcome:    {
        best:  COLORS.white,
        good:  COLORS.white,
        bad:   COLORS.brightred,
        worst: COLORS.brightred
      }
    }
  }
  const CHATSTYLES = {
    fullBox:           "<div style=\"display: block; width: 250px; padding: 5px 5px; margin-left: -38px; margin-top: -22px; margin-bottom: -5px; color: white; font-variant: small-caps; font-family: 'Bodoni SvtyTwo ITC TT'; text-align: left; font-size: 16px;  border: 3px outset darkred; background: url('https://imgur.com/kBl8aTO.jpg') center no-repeat; z-index: 100; position: relative;\">",
    space10:           '<span style="display: inline-block; width: 10px;"></span>',
    space30:           '<span style="display: inline-block; width: 30px;"></span>',
    space40:           '<span style="display: inline-block; width: 40px;"></span>',
    rollerName:        '<div style="display: block; width: 100%; font-size: 16px; height: 10px; padding: 3px 0px; border-bottom: 1px solid white;">',
    mainRoll:          '<div style="display: block; width: 100%; height: auto; padding: 3px 0px; border-bottom: 1px solid white;"><span style="display: block; height: 16px; line-height: 16px; width: 100%; font-size: 12px; font-variant: none;">',
    mainRollSub:       '<span style="display: block; height: 12px; line-height: 12px; width: 100%; margin-left: 24px; font-size: 10px; font-variant: italic;">',
    check:             '<div style="display: block; width: 100%; height: auto; padding: 3px 0px; border-bottom: 1px solid white;"><span style="display: block; height: 20px;  line-height: 20px; width: 100%; margin-left: 10%;">',
    summary:           '<div style="display: block; width: 100%; padding: 3px 0px; height: auto; "><span style="display: block; height: 16px; width: 100%; margin-left: 5%; line-height: 16px; font-size: 14px;">',
    resultCount:       '<span style="display: inline-block; font-weight: normal; font-family: Verdana; text-shadow: none; height: 24px; line-height: 24px; vertical-align: middle; width: 30px; text-align: right; margin-right: 10px; font-size: 12px;">',
    margin:            '<span style="display: inline-block; font-weight: normal; font-family: Verdana; text-shadow: none; height: 24px; line-height: 24px; vertical-align: middle; width: 30px; text-align: left; margin-left: 10px; font-size: 12px;">',
    outcomeRed:        "<div style=\"display: block; width: 100%; height: 20px; line-height: 20px; text-align: center; font-weight: bold;\"><span style=\"color: red; display: block; width: 100%;  font-size: 22px; font-family: 'Bodoni SvtyTwo ITC TT';\">",
    outcomeRedSmall:   "<div style=\"display: block; width: 100%; margin-top: 5px; height: 14px; line-height: 14px; text-align: center; font-weight: bold;\"><span style=\"color: red; display: block; width: 100%;  font-size: 14px; font-family: 'Bodoni SvtyTwo ITC TT';\">",
    outcomeOrange:     "<div style=\"display: block; width: 100%; height: 20px; line-height: 20px; text-align: center; font-weight: bold;\"><span style=\"color: orange; display: block; width: 100%;  font-size: 22px; font-family: 'Bodoni SvtyTwo ITC TT';\">",
    outcomeWhite:      "<div style=\"display: block; width: 100%; height: 20px; line-height: 20px; text-align: center; font-weight: bold;\"><span style=\"color: white; display: block; width: 100%;  font-size: 22px; font-family: 'Bodoni SvtyTwo ITC TT';\">",
    outcomeWhiteSmall: "<div style=\"display: block; margin-top: 5px; width: 100%; height: 14px; line-height: 14px; text-align: center; font-weight: bold;\"><span style=\"color: white; display: block; width: 100%;  font-size: 14px; font-family: 'Bodoni SvtyTwo ITC TT';\">",
    subOutcomeRed:     "<div style=\"display: block; width: 100%; height: 10px; line-height: 10px; text-align: center; font-weight: bold;\"><span style=\"color: red; display: block; width: 100%;  font-size: 12px; font-family: 'Bodoni SvtyTwo ITC TT';\">",
    subOutcomeOrange:  "<div style=\"display: block; width: 100%; height: 20px; line-height: 20px; text-align: center; font-weight: bold;\"><span style=\"color: orange; display: block; width: 100%;  font-size: 12px; font-family: 'Bodoni SvtyTwo ITC TT';\">",
    subOutcomeWhite:   "<div style=\"display: block; width: 100%; height: 10px; line-height: 10px; text-align: center; font-weight: bold;\"><span style=\"color: white; display: block; width: 100%;  font-size: 12px; font-family: 'Bodoni SvtyTwo ITC TT';\">",
    resultDice:        { // ♦◊
      start:     '<div style="display: block; width: 120%; margin-left: -10%; height: 24px; line-height: 20px; text-align: center; font-weight: bold; text-shadow: 0px 0px 2px white, 0px 0px 2px white, 0px 0px 2px white, 0px 0px 2px white; margin-bottom: 5px;">',
      lineBreak: '</div><div style="display: block; width: 120%; margin-left: -10%; margin-top: -8px; height: 24px; line-height: 20px; text-align: center; font-weight: bold; text-shadow: 0px 0px 2px white, 0px 0px 2px white, 0px 0px 2px white, 0px 0px 2px white; margin-bottom: 5px;">',
      BcL:       "<span style=\"margin-right: 2px; width: 10px; text-align: center; height: 22px; vertical-align: middle; color: white; display: inline-block; font-size: 18px; font-family: 'Arial';\">♦</span><span style=\"width: 10px; text-align: center; height: 20px; vertical-align: middle; color: white; display: inline-block; font-size: 16px; font-family: 'Arial'; margin-left: -5px; text-shadow: none; \">+</span>",
      BcR:       "<span style=\"width: 10px; text-align: center; height: 20px; vertical-align: middle; color: white; display: inline-block; font-size: 16px; font-family: 'Arial'; margin-left: -5px; margin-right: -3px; text-shadow: none; \">+</span><span style=\"margin-right: 2px; width: 10px; text-align: center; height: 22px; vertical-align: middle; color: white; display: inline-block; font-size: 18px; font-family: 'Arial';\">♦</span>",
      HcL:       "<span style=\"margin-right: 2px; width: 10px; text-align: center; height: 22px; vertical-align: middle; color: red; display: inline-block; font-size: 18px; font-family: 'Arial';\">♦</span><span style=\"width: 10px; text-align: center; height: 20px; vertical-align: middle; color: red; display: inline-block; font-size: 16px; font-family: 'Arial'; margin-left: -5px; text-shadow: none; \">+</span>",
      HcR:       "<span style=\"width: 10px; text-align: center; height: 20px; vertical-align: middle; color: red; display: inline-block; font-size: 16px; font-family: 'Arial'; margin-left: -5px; margin-right: -3px; text-shadow: none; \">+</span><span style=\"margin-right: 2px; width: 10px; text-align: center; height: 22px; vertical-align: middle; color: red; display: inline-block; font-size: 18px; font-family: 'Arial';\">♦</span>",
      Bc:        "<span style=\"margin-right: 2px; width: 10px; text-align: center; height: 22px; vertical-align: middle; color: white; display: inline-block; font-size: 18px; font-family: 'Arial';\">♦</span>",
      Hc:        "<span style=\"margin-right: 2px; width: 10px; text-align: center; height: 22px; vertical-align: middle; color: red; display: inline-block; font-size: 18px; font-family: 'Arial';\">♦</span>",
      Bs:        "<span style=\"margin-right: 2px; width: 10px; text-align: center; height: 24px; vertical-align: middle; color: white; display: inline-block; font-size: 18px; font-family: 'Arial';\">■</span>",
      Hs:        "<span style=\"margin-right: 2px; width: 10px; text-align: center; height: 24px; vertical-align: middle;color: red; display: inline-block; font-size: 18px; font-family: 'Arial';\">■</span>",
      Bf:        "<span style=\"margin-right: 2px; width: 10px; text-align: center; height: 24px; vertical-align: middle;color: white; display: inline-block; font-size: 18px; font-family: 'Arial'; text-shadow: none;\">■</span><span style=\"margin-right: 2px; width: 10px; text-align: center; height: 24px; vertical-align: middle;color: black; display: inline-block; margin-left: -12px; font-size: 18px; font-family: 'Arial'; margin-bottom: -4px; text-shadow: none;\">×</span>",
      Hf:        "<span style=\"margin-right: 2px; width: 10px; text-align: center; height: 24px; vertical-align: middle;color: red; display: inline-block; font-size: 18px; font-family: 'Arial'; text-shadow: none;\">■</span><span style=\"margin-right: 2px; width: 10px; text-align: center; height: 24px; vertical-align: middle;color: black; display: inline-block; margin-left: -12px; font-size: 18px; font-family: 'Arial'; margin-bottom: -4px; text-shadow: none;\">×</span>",
      Hb:        "<span style=\"margin-right: 2px; width: 10px; text-align: center; color: black; height: 24px; vertical-align: middle; display: inline-block; font-size: 18px; font-family: 'Arial'; text-shadow: 0px 0px 2px red, 0px 0px 2px red, 0px 0px 2px red, 0px 0px 2px red, 0px 0px 2px red, 0px 0px 2px red, 0px 0px 2px red, 0px 0px 2px red, 0px 0px 2px red, 0px 0px 2px red, 0px 0px 2px red, 0px 0px 2px red; line-height: 22px;\">♠</span>"
    },
    secret: {
      topLineStart:       '<div style="display: block; width: 100%; font-size: 18px; height: 16px; padding: 3px 0px; border-bottom: 1px solid white;">',
      traitLineStart:     '<div style="width: 100%; height: 20px; line-height: 20px; display: block; text-align: center; color: white; font-variant: small-caps; border-bottom: 1px solid white;">',
      diceStart:          '<div style="display: block ; width: 100% ; margin-left: 0% ; height: 20px ; line-height: 20px ; text-align: center ; font-weight: bold ; text-shadow: 0px 0px 2px white , 0px 0px 2px white , 0px 0px 2px white , 0px 0px 2px white ; margin-bottom: 0px">',
      blockStart:         '<div style="width: 100%; display: block; text-align: center;">',
      startBlock:         '<div style="display: inline-block; width: 48%; margin: 0% 1%; text-align: center;">',
      blockNameStart:     '<div style="display: block; width: 100%; font-size: 13px; margin-bottom: -5px; margin-top: 10px;">',
      lineStart:          '<div style="display: block; width: 100%; font-size: 12px;">',
      startPlayerBlock:   "<div style=\"display: block; width: 280px; padding: 45px 5px; margin-left: -58px; margin-top: -22px; margin-bottom: -5px; color: white; font-family: 'Percolator Text'; text-align: left; font-size: 16px; background: url('https://t4.ftcdn.net/jpg/00/78/66/11/240_F_78661103_aowhE8PWKrHRtoCUogPvkfWs22U54SuU.jpg') center no-repeat; background-size: 100% 100%; z-index: 100; position: relative;\">",
      playerTopLineStart: "<div style=\"display: block; margin-left: 28px;  width: 100%; font-size: 24px; font-family: 'Percolator Text'; height: 12px; padding: 3px 0px; text-align: left; margin-bottom: 10px; margin-top: -16px;\">",
      playerBotLineStart: '<div style="width: 100%; margin-left: 48px; height: auto; line-height: 15px; display: block;  text-align: left; color: white;">',
      grey:               '<span style="color: #A0A0A0; font-size: 24px; font-weight: bold;">',
      greyS:              '<span style="color: #A0A0A0; display: inline-block; line-height: 14px; vertical-align: top; margin-right: 5px; margin-left: -5px;">',
      white:              '<span style="color: white; font-size: 24px; font-weight: bold;">',
      whiteB:             '<span style="color: white; font-size: 40px; font-weight: bold;">',
      greyPlus:           '<span style="color: #A0A0A0; font-weight: bold; display: inline-block; text-align: right; margin: 0px 5px; vertical-align: top; line-height: 14px;"> + </span>',
      greyMinus:          '<span style="color: #A0A0A0; font-weight: bold; display: inline-block; text-align: right; margin: 0px 5px; vertical-align: top; line-height: 14px;"> - </span>'
    }
  }
  var isRerollFXOn = false
  var rerollFX
  // #endregion

  // #region Build Dice Frame
  const initFrame = function () {
    var imageList = []
    imageList.push(makeImg(
      'frontFrame',
      IMAGES.frontFrame,
      POSITIONS.diceFrame.top,
      POSITIONS.diceFrame.left,
      333,
      300))
    for (var i = 0; i < 9; i++) {
      imageList.push(makeImg(
        'topMid' + i,
        IMAGES.topMids[i - 3 * Math.floor(i / 3)],
        POSITIONS.diceFrame.top - 116.5,
        POSITIONS.diceFrame.left + 75 + 75 * i,
        101,
        300))
      imageList.push(makeImg(
        'bottomMid' + i,
        IMAGES.bottomMids[i - 3 * Math.floor(i / 3)],
        POSITIONS.diceFrame.top + 45,
        POSITIONS.diceFrame.left + 75 + 75 * i,
        101,
        300))
    }
    imageList.push(makeImg(
      'topEnd',
      IMAGES.topEnd,
      POSITIONS.diceFrame.top - 116.5,
      POSITIONS.diceFrame.left + 75 + 75 * 9,
      101,
      300))
    imageList.push(makeImg(
      'bottomEnd',
      IMAGES.bottomEnd,
      POSITIONS.diceFrame.top + 45,
      POSITIONS.diceFrame.left + 75 + 75 * 9,
      223,
      300))
    imageList.reverse()
    // log(JSON.stringify(imageList));
    // return;
    for (var j = 0; j < imageList.length; j++) 
      toBack(imageList[j])
    
    toBack(getObj('graphic', state[D.GAMENAME].Roller.imgList.Background.id))
  }

  const scaleFrame = function (row, width) {
    var stretchWidth = Math.max(width, 120)
    var imgs = [getObj('graphic', state[D.GAMENAME].Roller.imgList[row + 'End'].id)]
    var blanks = []
    var midCount = 0
    while (stretchWidth > 225 * (imgs.length - 1)) {
      imgs.push(getObj('graphic', state[D.GAMENAME].Roller.imgList[row + 'Mid' + midCount].id))
      midCount++
      if (midCount >= IMAGES[row + 'Mids'].length * 3) {
        // D.Alert("Need " + (midCount - imgs.length + 2) + " more mid sections for " + row);
        break
      }
    }
    while (midCount < IMAGES[row + 'Mids'].length * 3) {
      blanks.push(getObj('graphic', state[D.GAMENAME].Roller.imgList[row + 'Mid' + midCount].id))
      midCount++
    }
    var stretchPer = stretchWidth / imgs.length
    D.DB(row + ' stretchWidth: ' + stretchWidth + ', imgs Length: ' + imgs.length + ', x225 ' + imgs.length * 225 + ', stretch per: ' + stretchPer, 'SCALEFRAME()', 4)
    D.DB(row + ' midCount: ' + midCount + ', blanks length: ' + blanks.length)
    var endImg = imgs.shift()
    var left = POSITIONS.diceFrame.left + 120
    D.DB(row + 'Start at ' + POSITIONS.diceFrame.left + ', + 120 to ' + left, 'SCALEFRAME()', 4)
    for (var i = 0; i < imgs.length; i++) {
      D.DB('Setting ' + row + 'Mid' + i + ' to ' + left, 'SCALEFRAME()', 4)
      imgs[i].set({
        left:   left,
        imgsrc: IMAGES[row + 'Mids'][i - 3 * Math.floor(i / 3)]
      })
      left += stretchPer
    }
    D.DB('Setting ' + row + 'End to ' + left, 'SCALEFRAME()', 4)
    endImg.set('left', left)
    for (var j = 0; j < blanks.length; j++) {
      D.DB('Blanking Img #' + imgs.length + j, 'SCALEFRAME()', 4)
      blanks[j].set('imgsrc', IMAGES.blank)
    }
  }
  // #endregion

  // #region Graphic & Text Control
  const makeImg = function (name, imgsrc, top, left, height, width) {
    var img = createObj('graphic', {
      _pageid:   D.PAGEID(),
      imgsrc:    imgsrc,
      top:       top,
      left:      left,
      width:     width,
      height:    height,
      layer:     'map',
      isdrawing: true
    })
    registerImg(img, name)
    toFront(img)
    return img
  }

  const reposition = function (sel) {
    if (sel == null) return 
    _.each(sel, function (s) {
      let obj = findObjs({ _id: s._id })[0]
      _.find(_.pick(state[D.GAMENAME].Roller, STATECATS[obj.get('type')]), function (v1, k1) {
        return _.find(v1, function (v2, k2) {
          if (v2.id === obj.id) {
            state[D.GAMENAME].Roller[k1][k2].left = obj.get('left')
            state[D.GAMENAME].Roller[k1][k2].top = obj.get('top')
            state[D.GAMENAME].Roller[k1][k2].height = obj.get('height')
            state[D.GAMENAME].Roller[k1][k2].width = obj.get('width')
            D.Alert("Repositioned '" + obj.id + "' at [" + D.JS(k1) + '/' + D.JS(k2) + '] to: ' + D.JS(state[D.GAMENAME].Roller[k1][k2]), 'ROLLER: reposition()')
            return true
          } return false 
        })
      })
    })
  }

  const registerDie = function (obj, category, isResetting) {
    category = category || 'diceList'
    state[D.GAMENAME].Roller[category] = isResetting ? [] : state[D.GAMENAME].Roller[category] || []
    if (obj == null) return 
    obj.set({
      imgsrc:       IMAGES.dice.blank,
      layer:        'map',
      isdrawing:    true,
      name:         'rollerDie_' + state[D.GAMENAME].Roller[category].length + '_' + category,
      controlledby: ''
    })
    state[D.GAMENAME].Roller[category].push({
      id:    obj.id,
      top:   obj.get('top'),
      left:  obj.get('left'),
      width: obj.get('width')
    })
    WigglePads.MakePad(obj, 'selectDie', 'height:-28 width:-42 x:0 y:0')
    D.Alert('Registered die #' + state[D.GAMENAME].Roller[category].length + ': ' + D.JS(state[D.GAMENAME].Roller[category]) + ', Added WigglePad #' + _.values(state[D.GAMENAME].WigglePads.byPad).length, 'ROLLER: registerDie()')
  }

  const registerText = function (obj, objName, params) {
    params = params || {}
    state[D.GAMENAME].Roller.textList = params.isResetting ? {} : state[D.GAMENAME].Roller.textList || {}
    if (obj == null) return 
    obj.set({
      layer:        'map',
      name:         'rollerText_' + objName,
      controlledby: ''
    })
    state[D.GAMENAME].Roller.textList[objName] = {
      id:     obj.id,
      top:    obj.get('top'),
      left:   obj.get('left'),
      height: obj.get('height'),
      width:  obj.get('width')
    }
    D.Alert("Registered text box '" + objName + ': ' + D.JS(state[D.GAMENAME].Roller.textList), 'ROLLER: registerText()')
  }

  const registerImg = function (obj, objName, params) {
    params = params || {}
    if (_.isString(params)) {
      let kvpairs = params.split(',')
      params = { images: [] }
      _.each(kvpairs, function (kvp) {
        if (kvp.includes('|')) {
          let kv = kvp.split('|')
          params[kv[0]] = kv[1]
        } else {params.images.push(kvp)} 
      })
    }
    if (state[D.GAMENAME].Roller.imgList[objName]) {
      let remObj = getObj('graphic', state[D.GAMENAME].Roller.imgList[objName].id)
      if (remObj) remObj.remove() 
    }
    if (obj == null) return 
    obj.set({
      layer:        'map',
      name:         'rollerImage_' + objName,
      controlledby: ''
    })
    state[D.GAMENAME].Roller.imgList[objName] = {
      id:     obj.id,
      top:    obj.get('top'),
      left:   obj.get('left'),
      height: obj.get('height'),
      width:  obj.get('width'),
      imgsrc: params.images && params.images[0] || obj.get('imgsrc'),
      images: params.images || [obj.get('imgsrc')]
    }
    D.Alert("Registered image '" + objName + ': ' + D.JS(state[D.GAMENAME].Roller.imgList), 'ROLLER: registerImg()')
  }

  const registerShape = function (obj, objName, params) {
    params = params || {}
    state[D.GAMENAME].Roller.shapeList = params.isResetting ? {} : state[D.GAMENAME].Roller.shapeList || {}
    if (obj == null) return 
    obj.set({
      layer:        'map',
      name:         'rollerShape_' + objName,
      controlledby: ''
    })
    state[D.GAMENAME].Roller.shapeList[objName] = {
      id:      obj.id,
      type:    obj.get('_type'),
      subType: params.subType || 'line',
      top:     obj.get('top'),
      left:    obj.get('left'),
      height:  obj.get('height'),
      width:   obj.get('width')
    }
    D.Alert("Registered shape '" + objName + ': ' + D.JS(state[D.GAMENAME].Roller.shapeList), 'ROLLER: registerShape()')
  }

  const setDie = function (dieNum, dieCat, dieVal, params) {
    params = params || {}
    dieCat = dieCat || 'diceList'
    var dieParams = {
      id: state[D.GAMENAME].Roller[dieCat][dieNum].id
    }
    var die = getObj('graphic', dieParams.id)
    if (!die) 
      return D.ThrowError('ROLLER: SETDIE(' + dieNum + ', ' + dieCat + ', ' + dieVal + ') >> No die registered.')
    
    if (dieVal !== 'selected') {
      state[D.GAMENAME].Roller[dieCat][dieNum].value = dieVal
      state[D.GAMENAME].Roller.selected[dieCat] = _.without(state[D.GAMENAME].Roller.selected[dieCat], dieNum)
    }
    if (dieVal === 'blank' || dieVal.includes('H') || params.type && params.type !== 'trait') { WigglePads.Set(dieParams.id, { layer: 'map' }) } else WigglePads.Set(dieParams.id, { layer: 'objects' }) 
    dieParams.imgsrc = IMAGES.dice[dieVal]
    _.each(['top', 'left', 'width'], function (dir) {
      if (die.get(dir) !== state[D.GAMENAME].Roller[dieCat][dieNum][dir] || params.shift && params.shift[dir]) dieParams[dir] = state[D.GAMENAME].Roller[dieCat][dieNum][dir] + (params.shift && params.shift[dir] ? params.shift[dir] : 0) 
    })
    // D.DB("Setting '" + D.JSL(dieVal) + "' in " + D.JSL(dieCat) + " to '" + D.JSL(dieParams) + "'", "ROLLER: setDie()", 4);
    die.set(dieParams)
    return die
  }

  const selectDie = function (dieNum, dieCat) {
    if (state[D.GAMENAME].Roller.selected[dieCat].includes(dieNum)) {
      setDie(dieNum, dieCat, state[D.GAMENAME].Roller[dieCat][dieNum].value)
      state[D.GAMENAME].Roller.selected[dieCat] = _.without(state[D.GAMENAME].Roller.selected[dieCat], dieNum)
    } else {
      setDie(dieNum, dieCat, 'selected')
      state[D.GAMENAME].Roller.selected[dieCat].push(dieNum)
      if (state[D.GAMENAME].Roller.selected[dieCat].length > 3) selectDie(state[D.GAMENAME].Roller.selected[dieCat][0], dieCat) 
    }
    if (state[D.GAMENAME].Roller.selected[dieCat].length > 0 && !isRerollFXOn) {
      isRerollFXOn = true
      D.RunFX('bloodCloud', POSITIONS.bloodCloudFX)
      rerollFX = setInterval(D.RunFX, 1800, 'bloodCloud', POSITIONS.bloodCloudFX)
    } else if (state[D.GAMENAME].Roller.selected[dieCat].length === 0) {
      isRerollFXOn = false
      clearInterval(rerollFX)
      rerollFX = null
    }
  }

  const setImg = function (objName, image) {
    let obj = getObj('graphic', state[D.GAMENAME].Roller.imgList[objName].id)
    if (!obj) return D.ThrowError('ROLLER: SETIMG(' + objName + ') >> No such image registered.') 
    // D.DB("Setting image '" + D.JSL(objName) + "' to " + D.JSL(image) + " = '" + D.JSL(IMAGES[image]) + "'", "ROLLER: setImg()", 4);
    obj.set('imgsrc', IMAGES[image])
  }

  const setText = function (objName, params) {
    params = params || {}
    if (!state[D.GAMENAME].Roller.textList[objName]) return D.ThrowError("No text object registered with name '" + D.JS(objName) + "'.", 'ROLLER: setText()') 
    let obj = getObj('text', state[D.GAMENAME].Roller.textList[objName].id)
    if (!obj) return D.ThrowError("Failure to recover object '" + D.JS(objName) + "': " + D.JS(state[D.GAMENAME].Roller.textList), 'ROLLER: setText()') 
    var width = state[D.GAMENAME].Roller.textList[objName].width
    var left = state[D.GAMENAME].Roller.textList[objName].left
    if (params.justified && params.justified === 'left') {
      params.width = D.GetTextWidth(obj, params.text)
      params.left = left + params.width / 2 - width / 2
    } else if (params.justified && params.justified === 'center') {params.left = left} 
    if (params.shift && params.shift.anchor) {
      let anchorObj = getObj('text', state[D.GAMENAME].Roller.textList[params.shift.anchor].id)
      let anchorWidth = parseInt(anchorObj.get('width'))
      let anchorLeft = parseInt(anchorObj.get('left'))
      switch (params.shift.anchorSide) {
        case 'right':
          params.left = anchorLeft + 0.5 * anchorWidth + 0.5 * params.width + parseInt(params.shift.amount)
          // D.DB("Shifting " + D.JSL(objName) + " right by " + D.JSL(params.shift.amount) + " from " + D.JSL(anchorLeft) + " to " + D.JSL(params.left), "ROLLER: setText()", 2);
          break
        case 'top':
          break
      }
    } else {
      // _.each(["top", "left"], function (dir) {
      //    params[dir] = state[D.GAMENAME].Roller.textList[objName][dir] + (params.shift ? params.shift[dir] || 0 : 0);
      // });
    }
    if (_.isNaN(params.left) || _.isNaN(params.width)) return D.ThrowError("Bad left or width given for '" + D.JS(objName) + "': " + D.JS(params), 'ROLLER: setText()') 
    obj.set(_.omit(params, ['justified', 'shift']))
    return params
  }

  const setColor = function (line, type, params, level) {
    if (!COLORSCHEMES[type]) { D.ThrowError("No Color Scheme for type '" + D.JS(type) + "'") } else if (!COLORSCHEMES[type][line]) { D.ThrowError("No Color Scheme for line '" + D.JS(line) + "' in '" + D.JS(type) + "'") } else if (level && !COLORSCHEMES[type][line][level]) { D.ThrowError("No Level '" + D.JS(level) + "' for '" + D.JS(line) + "' in '" + D.JS(type) + "'") } else if (!level && !_.isString(COLORSCHEMES[type][line])) { D.ThrowError("Must provide Level for '" + D.JS(line) + "' in '" + D.JS(type) + "'") } else params.color = level ? COLORSCHEMES[type][line][level] : COLORSCHEMES[type][line] 
    return params
  }

  // #endregion

  // #region Getting Information (Specialty)
  //   const getSpecialty = function (charObj, skillName) {
  //     const attrTypeObjs = filterObjs(function (obj) {
  //       if (obj.get('_type') === 'attribute' &&
  // obj.get('_characterid') === charObj.id &&
  // obj.get('name').includes('spec') &&
  // obj.get('name').includes(skillName)) { return true } else return false
  //     })
  //     let attrLabels = []
  //     if (attrTypeObjs.length === 0) { return false } else {
  //       _.each(attrTypeObjs, function (attrTypeObj) {
  //         attrLabels.push(filterObjs(function (obj) {
  //           if (obj.get('_type') === 'attribute' &&
  // obj.get('_characterid') == charObj.id &&
  // obj.get('name').includes(attrTypeObj.get('name').replace('type', 'label'))) { return true } else return false
  //         })[0].get('current'))
  //       })
  //     }
  //     // D.DB("Spec AttrLabels = " + D.JSL(attrLabels) + ", Returning: '" + D.JSL(attrLabels.join("sss|").split("|")) + "'", "ROLLER: getSpecialty()", 3);
  //     return attrLabels.join('sss|').split('|')
  //   }

  const parseFlags = function (charObj, rollType, params) {
    params = params || {}
    params.data = params.data || []
    let gN = params.groupNum || ''
    let flagData = {
      posFlagLines: [],
      negFlagLines: [],
      flagDiceMod:  0
    }
    if (['rouse', 'rouse2', 'remorse', 'check', 'project', 'secret'].includes(rollType)) return flagData 
    if (parseInt(getAttrByName(charObj.id, 'applySpecialty')) > 0) {
      // if (traitData.flags.includes("S")) {
      //    _.each(getSpecialty(charObj, trt), function (spec) {
      //        specialties.push(spec);
      //    });
      // }
      flagData.posFlagLines.push('Specialty (●)')
      flagData.flagDiceMod++
    }
    if (parseInt(getAttrByName(charObj.id, 'applySpecialty')) > 0) {
      flagData.posFlagLines.push('Resonance (●)')
      flagData.flagDiceMod++
    }
    if (parseInt(getAttrByName(charObj.id, gN + 'applyBloodSurge')) > 0) {
      let bonus = D.BLOODPOTENCY[parseInt(getAttrByName(charObj.id, gN + 'BloodPotency')) || 0].bloodSurge
      flagData.posFlagLines.push('Blood Surge (' + (bonus > 0 ? '●'.repeat(bonus) : '~') + ')')
      flagData.flagDiceMod += bonus
    }
    if (parseInt(getAttrByName(charObj.id, gN + 'applyDiscipline')) > 0) {
      let bonus = D.BLOODPOTENCY[parseInt(getAttrByName(charObj.id, gN + 'BloodPotency')) || 0].bloodDiscBonus
      flagData.posFlagLines.push('Discipline (' + (bonus > 0 ? '●'.repeat(bonus) : '~') + ')')
      flagData.flagDiceMod += bonus
    }
    if (params.groupNum) {
      params.data[5] = _.map(params.data[5].split(','), function (flag) {
        return flag.split(':')[0] + ':-' + Math.abs(parseInt(flag.split(':')[1]))
      }).join(',')
    }
    let traitList = _.map(params.groupNum ? params.data[1].split(',') : params[0].split(','), function (trt) { return trt.replace(/:\d+/g, '').replace(/_/g, ' ') })
    // D.Log(D.JSL(getAttrByName(charObj.id, gN + "incapacitation")), "INCAPACITATION");
    // D.Log("PARAMS: " + D.JSL(params), "PARAMS");
    // D.Log("PARAMS DATA: " + D.JSL(params.data), "PARAMS DATA");
    // return;
    // D.Log(D.JSL(params.data[4]), "PARAMS DATA 4");
    _.each(_.compact(_.flatten([
      getAttrByName(charObj.id, gN + 'incapacitation') ? getAttrByName(charObj.id, gN + 'incapacitation').split(',') : [],
      params.data.length > 4 ? params.data[4].split(',') : '',
      params.data.length > 4 ? params.data[5].split(',') : ''
    ])), function (flag) {
      if (flag === 'Health' && _.intersection(traitList, _.flatten([D.ATTRIBUTES.physical, D.SKILLS.physical])).length > 0) {
        flagData.negFlagLines.push('Injured (●●)')
        flagData.flagDiceMod -= 2
      } else if (flag === 'Willpower' && _.intersection(traitList, _.flatten([D.ATTRIBUTES.mental, D.ATTRIBUTES.social, D.SKILLS.mental, D.SKILLS.social])).length > 0) {
        flagData.negFlagLines.push('Exhausted (●●)')
        flagData.flagDiceMod -= 2
      } else if (flag === 'Humanity') {
        flagData.negFlagLines.push('Despairing (●●)')
        flagData.flagDiceMod -= 2
      } else if (flag.includes(':')) { // Custom Flags of form Compulsion (Arrogance):psmd:-3 OR Compulsion (Arrogance):-3
        var customFlag = _.compact(flag.split(':'))
        let mod = parseInt(customFlag[customFlag.length - 1])
        if (customFlag.length === 2 || customFlag.length === 3 && (
          customFlag[1].includes('p') && _.intersection(traitList, _.flatten([D.ATTRIBUTES.physical, D.SKILLS.physical])).length > 0 ||
customFlag[1].includes('m') && _.intersection(traitList, _.flatten([D.ATTRIBUTES.mental, D.SKILLS.mental])).length > 0 ||
customFlag[1].includes('s') && _.intersection(traitList, _.flatten([D.ATTRIBUTES.social, D.SKILLS.social])).length > 0 ||
customFlag[1].includes('d') && _.intersection(traitList, D.DISCIPLINES).length > 0
        )
        
        ) {
          if (mod >= 0) { flagData.posFlagLines.push(customFlag[0] + ' (' + (mod > 0 ? '●'.repeat(mod) : '~') + ')') } else if (mod < 0) flagData.negFlagLines.push(customFlag[0] + ' (' + '●'.repeat(Math.abs(mod)) + ')') 
          flagData.flagDiceMod += mod
        }
      }
    })
    return flagData
  }

  const parseTraits = function (charObj, rollType, params) {
    let traits = _.compact(params.groupNum ? params.data[1].split(',') : params[0].split(','))
    let gN = params.groupNum || ''
    if (!params.groupNum) {
      if (rollType === 'frenzy') traits = ['Humanity', 'Willpower'] 
      if (rollType === 'humanity' || rollType === 'remorse') traits = ['Humanity'] 
      if (rollType === 'willpower') traits = ['Willpower'] 
    }

    let traitData = {
      traitList:    _.map(traits, function (trt) { return trt.replace(/:\d+/g, '') }),
      traitData:    {},
      traitDiceMod: 0
    }

    _.each(traits, function (trt) {
      if (trt.includes(':')) {
        let tData = trt.split(':')
        traitData.traitData[tData[0]] = {
          display: tData[0],
          value:   parseInt(tData[1])
        }
        if (rollType === 'frenzy' && tData[0] === 'Humanity') {
          traitData.traitData.Humanity.display = '⅓ Humanity'
          traitData.traitData.Humanity.value = Math.floor(traitData.traitData.Humanity.value / 3)
        } else if (rollType === 'remorse' && tData[0] === 'Humanity') {traitData.traitData.Humanity.display = 'Human Potential'} 
      } else {
        traitData.traitData[trt] = {
          display: D.IsIn(trt) || D.IsIn(getAttrByName(charObj.id, gN + trt + '_name')),
          value:   parseInt(getAttrByName(charObj.id, gN + trt)) || 0
        }
        if (rollType === 'frenzy' && trt === 'Humanity') {
          traitData.traitData.Humanity.display = '⅓ Humanity'
          traitData.traitData.Humanity.value = Math.floor(traitData.traitData.Humanity.value / 3)
        } else if (rollType === 'remorse' && trt === 'Humanity') {
          traitData.traitData.Humanity.display = 'Human Potential'
          traitData.traitData.Humanity.value = 10 - traitData.traitData.Humanity.value - (parseInt(getAttrByName(charObj.id, gN + 'Stains')) || 0)
        } else if (!traitData.traitData[trt].display) {
          D.Chat(D.GetPlayerID(charObj), "Error determining NAME of trait '" + D.JS(trt) + "'.", 'ERROR: Dice Roller')
          return false
        }
      }
    })
    return traitData
  }

  const getRollData = function (charObj, rollType, params) {
    // DUMMY RESULTS:
    /*
return {
groupNum: "",
charID: "-LN4P73XRfqCcI8U6c-t",
type: "project",
hunger: 0,
posFlagLines: [],
negFlagLines: [],
dicePool: 0,
traits: ["Politics", "Resources"],
traitData: {
Politics: {
display: "Politics",
value: 5
},
Resources: {
display: "Resources",
value: 5
}
},
diffMod: 1,
prefix: "repeating_project_-LQSF9eezKZpUhKBodBR_",
charName: "Kingston \"King\" Black",
mod: 0,
diff: 3
};         */
    if (!params) return D.ThrowError('No parameters supplied!') 
    let flagData = parseFlags(charObj, rollType, params)
    let traitData = parseTraits(charObj, rollType, params)
    let gN = params.groupNum || ''
    var rollData = {
      groupNum:     gN,
      charID:       charObj.id,
      type:         rollType,
      hunger:       parseInt(getAttrByName(charObj.id, gN + 'Hunger')),
      posFlagLines: flagData.posFlagLines,
      negFlagLines: flagData.negFlagLines,
      dicePool:     flagData.flagDiceMod + traitData.traitDiceMod,
      traits:       traitData.traitList,
      traitData:    traitData.traitData,
      diffMod:      0,
      prefix:       ''
    }
    if (params.groupNum) {
      rollData.charName = params.data[0]
      rollData.diff = parseInt(params.data[2]) || 0
      rollData.mod = parseInt(params.data[3]) || 0
    } else {
      rollData.charName = D.GetName(charObj)
      switch (rollType) {
        case 'project':
          rollData.mod = parseInt(params[2])
          rollData.diffMod = parseInt(params[3])
          rollData.prefix = ['repeating', 'project', D.GetRepIDCase(params[4]), ''].join('_')
          D.Log('PREFIX: ' + D.JSL(rollData.prefix))
          // falls through
        case 'frenzy':
          rollData.diff = parseInt(params[1]) || parseInt(getAttrByName(charObj.id, 'rollDiff'))
          break
        case 'secret':
          rollData.diff = params[2] ? parseInt(params[2]) || 0 : 0
          rollData.mod = params[1] ? parseInt(params[1]) || 0 : 0
          break
        default:
          rollData.diff = parseInt(getAttrByName(charObj.id, 'rollDiff'))
          rollData.mod = parseInt(getAttrByName(charObj.id, 'rollMod'))
          break
      }
    }
    switch (rollType) {
      case 'remorse':
        rollData.diff = 0
        rollData.mod = 0
        // falls through
      case 'project':
      case 'humanity':
      case 'frenzy':
      case 'willpower':
        rollData.hunger = 0
        break
    }
    return rollData
  }
  // #endregion

  // #region Rolling Dice & Formatting Result
  const makeSheetRoll = function (charObj, rollType, params) {
    D.DB('RECEIVED PARAMS: ' + D.JSL(params), 'ROLLER: makeSheetRoll()', 2)

    var rollData = getRollData(charObj, rollType, params)
    D.DB('ROLL DATA: ' + D.JSL(rollData), 'ROLLER: makeSheetRoll()', 2)

    rollData = buildDicePool(rollData)
    D.DB('BUILD POOL: ' + D.JSL(rollData), 'ROLLER: makeSheetRoll()', 2)

    var rollResults = rollDice(rollData)
    D.DB('ROLL RESULTS: ' + D.JSL(rollResults), 'ROLLER: makeSheetRoll()', 2)

    applyRoll(rollData, rollResults)
  }

  const buildDicePool = function (rollData) {
    /* MUST SUPPLY:
[Rouse & Checks]        [Others]
rollData = { type }      { type, mod, << traits: [], traitData: { value, display }, hunger >> }
*/

    //  DUMMY RESULTS:
    /*
return {
groupNum: "",
charID: "-LN4P73XRfqCcI8U6c-t",
type: "project",
hunger: 0,
posFlagLines: [],
negFlagLines: [],
dicePool: 10,
traits: ["Politics", "Resources"],
traitData: {
Politics: {
display: "Politics",
value: 5
},
Resources: {
display: "Resources",
value: 5
}
},
diffMod: 1,
prefix: "repeating_project_-LQSF9eezKZpUhKBodBR_",
charName: "Kingston \"King\" Black",
mod: 0,
diff: 3,
basePool: 10,
hungerPool: 0
};         */
    rollData.hunger = rollData.hunger || 0
    rollData.basePool = 0
    rollData.hungerPool = 0
    rollData.dicePool = rollData.dicePool || 0
    switch (rollData.type) {
      case 'rouse2':
        rollData.dicePool++
        rollData.hungerPool++
        // falls through
      case 'rouse':
        rollData.hungerPool++
        rollData.basePool--
        // falls through
      case 'check':
        rollData.dicePool++
        rollData.basePool++
        return rollData
      default:
        _.each(_.values(rollData.traitData), function (tData) {
          rollData.dicePool += tData.value
        })
        rollData.dicePool += rollData.mod
        break
    }
    if (rollData.traits.length === 0 && rollData.dicePool <= 0) {
      D.Chat(D.GetPlayerID(D.GetChar(rollData.charID)), 'You have no dice to roll!', 'ERROR: Dice Roller')
      return false
    }
    rollData.hungerPool = Math.min(rollData.hunger, Math.max(1, rollData.dicePool))
    rollData.basePool = Math.max(1, rollData.dicePool) - rollData.hungerPool
    return rollData
    // var specialties = [];
    // _.each(rollData.traits, function (trt) {
    // rollData.traitData[trt] = {
    // display: D.IsIn(trt) || D.IsIn(getAttrByName(charObj.id, trt + "_name")),
    // value: parseInt(getAttrByName(charObj.id, trt)) || 0
    // };
    // if (rollData.type == "frenzy" && trt == "Humanity") {
    // rollData.traitData.Humanity.display = "⅓ Humanity";
    // rollData.traitData.Humanity.value = Math.floor(rollData.traitData.Humanity.value / 3);
    // } else if (rollData.type == "remorse" && trt == "Humanity") {
    // rollData.traitData.Humanity.display = "Human Potential";
    // rollData.traitData.Humanity.value = 10 - rollData.traitData.Humanity.value - (parseInt(getAttrByName(charObj.id, "Stains")) || 0);
    // } else {
    // if (rollData.flags.includes("S")) {
    // _.each(getSpecialty(charObj, trt), function (spec) {
    // specialties.push(spec);
    // });
    // }
    // if (!rollData.traitData[trt].display) {
    // D.Chat(D.GetPlayerID(charObj), "Error determining NAME of trait '" + D.JS(trt) + "'.", "ERROR: Dice Roller");
    // return false;
    // };
    // };
    // rollData.dicePool += rollData.traitData[trt].value;
    // });
    // if (specialties.length > 0) {
    // rollData.posFlagLines.push("Specialty: " + specialties.join(", ") + " (●)");
    // rollData.dicePool++;
    // }
    // _.each(rollData.flags, function (flag) {
    //    return;
    // });
    // rollData.dicePool = Math.max(0, rollData.dicePool);
  }

  const rollDice = function (rollData, addVals) {
    /* MUST SUPPLY:
rollData = { type, diff, basePool, hungerPool, << diffmod >> }  OR  { type, diff, rerollAmt }  */

    // DUMMY RESULTS:
    /*
return {
total: 10,
critPairs: {
bb: 1,
hb: 0,
hh: 0
},
B: {
crits: 0,
succs: 6,
fails: 2
},
H: {
crits: 0,
succs: 0,
fails: 0,
botches: 0
},
rolls: [
"B7",
"B5",
"B7",
"B10",
"B8",
"B8",
"B7",
"B7",
"B5",
"B10"
],
diceVals: [
"BcL",
"BcR",
"Bs",
"Bs",
"Bs",
"Bs",
"Bs",
"Bs",
"Bf",
"Bf"
],
margin: 5,
commit: 0
};
*/

    // D.DB("RECEIVED ROLL DATA: " + D.JSL(rollData), "ROLLER: rollDice()", 3);
    D.DB('RECEIVED ADDED VALS: ' + D.JSL(addVals), 'ROLLER: rollDice()', 3)
    var rollResults = {
      total:     0,
      critPairs: { bb: 0, hb: 0, hh: 0 },
      B:         { crits: 0, succs: 0, fails: 0 },
      H:         { crits: 0, succs: 0, fails: 0, botches: 0 },
      rolls:     [],
      diceVals:  []
    }

    var roll = function (dtype) {
      let d10 = randomInteger(10)
      rollResults.rolls.push(dtype + d10)
      switch (d10) {
        case 10:
          rollResults[dtype].crits++
          rollResults.total++
          break
        case 9:
        case 8:
        case 7:
        case 6:
          rollResults[dtype].succs++
          rollResults.total++
          break
        case 5:
        case 4:
        case 3:
        case 2:
          rollResults[dtype].fails++
          break
        case 1:
          switch (dtype) {
            case 'B':
              rollResults.B.fails++
              break
            case 'H':
              rollResults.H.botches++
              break
          }
          break
      }
    }

    if (rollData.rerollAmt) {
      for (var i = 0; i < rollData.rerollAmt; i++) 
        roll('B')
      
    } else {
      _.each({ B: rollData.basePool, H: rollData.hungerPool }, function (val, dtype) {
        for (var i = 0; i < parseInt(val); i++) 
          roll(dtype)
        
      })
    }

    _.each(addVals, function (val) {
      var dtype = val.slice(0, 1)
      switch (val.slice(1, 2)) {
        case 'c':
          rollResults[dtype].crits++
          rollResults.total++
          break
        case 's':
          rollResults[dtype].succs++
          rollResults.total++
          break
        case 'f':
          rollResults[dtype].fails++
          break
        case 'b':
          rollResults[dtype].botches++
          break
      }
    })

    D.DB('PRE-SORT RESULTS: ' + D.JSL(rollResults), 'ROLLER: rollDice()', 3)
    // D.Alert(rollResults, "PRESORT ROLL RESULTS");

    var sortBins = []
    switch (rollData.type) {
      case 'secret':
      case 'trait':
      case 'frenzy':
        sortBins.push('H')
        // falls through
      case 'remorse':
      case 'humanity':
      case 'willpower':
      case 'project':
        sortBins.push('B')
        while (rollResults.B.crits + rollResults.H.crits >= 2) {
          rollResults.commit = 0
          while (rollResults.H.crits >= 2) {
            rollResults.H.crits -= 2
            rollResults.critPairs.hh++
            rollResults.total += 2
            rollResults.diceVals.push('HcL')
            rollResults.diceVals.push('HcR')
          }
          if (rollResults.B.crits > 0 && rollResults.H.crits > 0) {
            rollResults.B.crits--
            rollResults.H.crits--
            rollResults.critPairs.hb++
            rollResults.total += 2
            rollResults.diceVals.push('HcL')
            rollResults.diceVals.push('BcR')
          }
          while (rollResults.B.crits >= 2) {
            rollResults.B.crits -= 2
            rollResults.critPairs.bb++
            rollResults.total += 2
            rollResults.diceVals.push('BcL')
            rollResults.diceVals.push('BcR')
          }
        }
        _.each(['crits', 'succs', 'fails', 'botches'], function (bin) {
          _.each(sortBins, function (rType) {
            for (var i = 0; i < rollResults[rType][bin]; i++) 
              rollResults.diceVals.push(rType + bin.slice(0, 1))
            
          })
        })
        if (rollData.diff !== 0 || rollData.diffMod > 0) rollResults.margin = rollResults.total - rollData.diff 
        break
      case 'rouse2':
      case 'rouse':
        rollResults.diceVals = _.map(rollResults.rolls, function (roll) {
          return parseInt(roll.slice(1)) < 6 ? 'Hb' : 'Bs'
        })
        if (rollResults.diceVals[1] && rollResults.diceVals[0] !== rollResults.diceVals[1]) rollResults.diceVals = ['Hb', 'Bs'] 
        break
      case 'check':
        rollResults.diceVals = _.map(rollResults.rolls, function (roll) {
          return parseInt(roll.slice(1)) < 6 ? 'Hf' : 'Bs'
        })
        break
    }
    if (!(rollResults.commit && rollResults.commit === 0)) {
      let scope = rollData.diff - rollData.diffMod - 2
      rollResults.commit = Math.max(1, scope + 1 - rollResults.margin)
    }
    return rollResults
  }

  const formatDiceLine = function (rollData, rollResults, splitAt) {
    /* MUST SUPPLY:
(rollData = { << isReroll, isGMMod >> })
rollResults = { diceVals = [], total, << margin >> }
*/
    rollData = rollData || {}
    splitAt = splitAt || 999
    let logLine = ''
    let counter = 0
    if (rollData.isReroll) 
      {_.each(rollResults)}
     else if (rollData.isGMMod) {

    } else {
      _.each(rollResults.diceVals, function (val) {
        if (counter === splitAt) {
          counter = 0
          logLine += CHATSTYLES.resultDice.lineBreak
        }
        logLine += CHATSTYLES.resultDice[val]
        counter++
      })
      return logLine
    }
  }

  const applyRoll = function (rollData, rollResults) {
    /* MUST SUPPLY:
[ALL]
rollData = { type, charName, charID }
rollResults = { total, diceVals: [] }
[ALL Non-Checks]
rollData = { mod, dicePool, traits: [], traitData: { value, display }, << diff, groupNum >> }
rollResults = { H: { botches }, critPairs: {hh, hb, bb}, << margin >> }
[TRAIT ONLY]
rollData = { posFlagLines, negFlagLines }
*/
    state[D.GAMENAME].Roller.lastRoll = {
      data:    rollData,
      results: rollResults
    }
    let gNum = rollData.groupNum || ''
    var deltaAttrs = {}
    var rollLines = {
      rollerName:     { text: '', justified: 'left' },
      mainRoll:       { text: '', justified: 'left' },
      mainRollShadow: { text: '', justified: 'left' }
    }
    var logLines = {
      fullBox:     CHATSTYLES.fullBox,
      rollerName:  '',
      mainRoll:    '',
      mainRollSub: '',
      difficulty:  '',
      resultDice:  '',
      margin:      '',
      outcome:     '',
      subOutcome:  ''
    }
    var yShift = 0

    switch (rollData.type) {
      case 'project':
        rollLines.subOutcome = { text: '' }
        // falls through
      case 'trait':
        if (rollData.posFlagLines.length > 0) {
          rollLines.posMods = {
            text:      '+ ' + rollData.posFlagLines.join(' + ') + '          ',
            justified: 'left'
          }
        } else {
          rollLines.posMods = {
            text:      '  ',
            justified: 'left'
          }
        }
        if (rollData.negFlagLines.length > 0) {
          rollLines.negMods = {
            text:      '- ' + rollData.negFlagLines.join(' - '),
            justified: 'left',
            shift:     {
              anchor:     'posMods',
              anchorSide: 'right',
              amount:     0
            }
          }
        }
        // falls through
      case 'willpower':
      case 'humanity':
        rollLines.margin = { text: '' }
        // falls through
      case 'frenzy':
        rollLines.difficulty = { text: '' }
        // falls through
      case 'remorse':
      case 'rouse2':
      case 'rouse':
      case 'check':
        setImg('diffFrame', 'blank')
        rollLines.summary = { text: '' }
        rollLines.summaryShadow = { text: '' }
        rollLines.resultCount = { text: '' }
        rollLines.resultCountShadow = { text: '' }
        rollLines.outcome = { text: '', justified: 'left' }
        break
    }

    _.each(_.keys(rollLines), function (line) {
      if (_.isString(COLORSCHEMES[rollData.type][line])) rollLines[line] = setColor(line, rollData.type, rollLines[line]) 
    })

    var blankLines = _.keys(_.omit(state[D.GAMENAME].Roller.textList, _.keys(rollLines)))

    D.DB('ROLL LINES: ' + D.JSL(rollLines), 'ROLLER: applyRoll()', 3)
    // D.DB("BLANKING LINES: " + D.JSL(blankLines), "ROLLER: applyRoll()", 3);

    var p = (s) => rollData.prefix + s

    _.each(rollLines, function (content, name) {
      // playerTop: { text: "", justified: "center" },
      // playerMid: { text: "", justified: "center" },
      // playerBot: { text: "", justified: "center" },
      // mainRoll: { text: "", justified: "left" },
      // mainRollSub: { text: "", justified: "center" },
      // summary: { text: "", justified: "center" },
      // outcome: { text: "", justified: "center" }
      // D.DB("Parsing " + D.JSL(name) + " = '" + D.JSL(content) + "'", "ROLLER: applyRoll()", 4);
      switch (name) {
        case 'mainRoll':
          var [introPhrase, logPhrase] = [null, null]
          var [mainRollParts, mainRollLog] = [[], []]
          var total, margin
          switch (rollData.type) {
            case 'remorse':
              introPhrase = introPhrase || 'Does ' + rollData.charName + ' feel remorse?'
              logPhrase = logPhrase || ' rolls remorse:'
              // falls through
            case 'frenzy':
              introPhrase = introPhrase || rollData.charName + ' and the Beast wrestle for control...'
              logPhrase = logPhrase || ' resists frenzy:'
              // falls through
            case 'project':
              introPhrase = introPhrase || rollData.charName + ' launches a Project (Scope ' + (rollData.diff - rollData.diffMod - 2) + '):'
              logPhrase = logPhrase || ' launches a Project (Scope ' + (rollData.diff - rollData.diffMod - 2) + '):'
              // falls through
            case 'trait':
            case 'willpower':
            case 'humanity':
              introPhrase = introPhrase || rollData.charName + ' rolls: '
              logPhrase = logPhrase || ' rolls:'
              _.each(rollData.traits, function (trt) {
                var dotline = '●'.repeat(rollData.traitData[trt].value)
                switch (trt) {
                  case 'Stains':
                    dotline = ''
                    // falls through
                  case 'Humanity':
                    var stains = Math.max(parseInt(getAttrByName(rollData.charID, 'Stains') || 0), 0)
                    var maximum = 10
                    if (rollData.type === 'frenzy') {
                      stains = Math.max(stains === 0 ? 0 : 1, Math.floor(stains / 3))
                      maximum = 4
                    }
                    if (rollData.type === 'remorse') { dotline = '◌'.repeat(Math.max(maximum - dotline.length - stains, 0)) + dotline + '◌'.repeat(stains) } else dotline += '◌'.repeat(Math.max(maximum - dotline.length - (stains || 0)), 0) + '‡'.repeat(stains || 0) 
                    break
                  case 'Willpower': // stains
                    dotline += '◌'.repeat(Math.max(0, parseInt(getAttrByName(rollData.charID, 'willpower_max')) - parseInt(rollData.traitData[trt].value)))
                    break
                  default:
                    if (rollData.traitData[trt].value === 0) dotline = '~' 
                    break
                }
                if (trt !== 'Stains') {
                  mainRollParts.push(rollData.traitData[trt].display + ' (' + dotline + ')')
                  mainRollLog.push(rollData.traitData[trt].display + ' (' + rollData.traitData[trt].value + ')')
                }
              })
              // logLines.rollerName += logPhrase;
              rollLines.rollerName.text = introPhrase
              rollLines.mainRoll.text = mainRollParts.join(' + ')
              logLines.mainRoll = CHATSTYLES.mainRoll + mainRollLog.join(' + ')
              if (rollData.mod !== 0) {
                if (rollData.traits.length === 0 && rollData.mod > 0) {
                  rollLines.mainRoll.text = rollData.mod + ' Dice'
                  logLines.mainRoll = rollData.mod + ' Dice'
                } else {
                  logLines.mainRoll += (rollData.mod < 0 ? ' - ' : ' + ') + Math.abs(rollData.mod)
                  rollLines.mainRoll.text += (rollData.mod < 0 ? ' - ' : ' + ') + Math.abs(rollData.mod)
                }
              }
              if (rollData.dicePool <= 0) {
                logLines.mainRollSub = CHATSTYLES.mainRollSub + '(One Die Minimum)</span>'
                rollData.dicePool = 1
                rollLines.mainRoll.text += ' (One Die Minimum)'
              }
              break
            case 'rouse2':
              rollLines.mainRoll.text = ' (Best of Two)'
              logLines.mainRollSub = CHATSTYLES.mainRollSub + '(Best of Two)</span>'
              // falls through
            case 'rouse':
              introPhrase = introPhrase || rollData.charName + ':'
              logPhrase = logPhrase || ':'
              logLines.mainRoll = CHATSTYLES.check + 'Rouse Check'
              rollLines.mainRoll.text = 'Rouse Check' + rollLines.mainRoll.text
              break
            case 'check':
              introPhrase = introPhrase || rollData.charName + ':'
              logPhrase = logPhrase || ':'
              logLines.mainRoll = CHATSTYLES.check + 'Simple Check'
              rollLines.mainRoll.text = 'Simple Check'
              break
            case 'default':
              introPhrase = introPhrase || rollData.charName + ':'
              logPhrase = logPhrase || ':'
          }
          logLines.rollerName = logPhrase
          rollLines.rollerName.text = introPhrase || ''
          rollLines.mainRollShadow.text = rollLines.mainRoll.text
          break
        case 'summary':
          rollLines.summary.text = JSON.stringify(rollData.dicePool)
          rollLines.summaryShadow.text = rollLines.summary.text
          break
        case 'difficulty':
          if (rollData.diff === 0 && rollData.diffMod === 0) {
            rollLines.difficulty.text = ' '
            setImg('diffFrame', 'blank')
            break
          }
          setImg('diffFrame', 'diffFrame')
          rollLines.difficulty = { text: D.JS(rollData.diff) }
          logLines.difficulty = ' vs. ' + D.JS(rollData.diff)
          break
        case 'resultCount':
          rollLines.resultCount.text = JSON.stringify(rollResults.total)
          rollLines.resultCountShadow.text = rollLines.resultCount.text
          break
        case 'margin':
          margin = rollResults.margin
          if (!margin) {
            rollLines.margin.text = ' '
            break
          }
          rollLines.margin.text = (margin > 0 ? '+' : margin === 0 ? '' : '-') + Math.abs(margin)
          logLines.margin = ' (' + (margin > 0 ? '+' : margin === 0 ? '' : '-') + Math.abs(margin) + ')' + logLines.margin
          rollLines.margin = setColor('margin', rollData.type, rollLines.margin, margin >= 0 ? 'good' : 'bad')
          break
        case 'outcome':
          total = rollResults.total
          margin = rollResults.margin
          switch (rollData.type) {
            case 'project':
              rollLines.outcome.shift = { top: -10 }
              if (total === 0) {
                logLines.outcome = CHATSTYLES.outcomeRed + 'TOTAL FAILURE!</span></div>'
                logLines.subOutcome = CHATSTYLES.subOutcomeRed + 'Enemies Close In</span></div>'
                rollLines.outcome.text = 'TOTAL FAILURE!'
                rollLines.subOutcome.text = 'Your Enemies Close In...'
                rollLines.outcome = setColor('outcome', rollData.type, rollLines.outcome, 'worst')
                rollLines.subOutcome = setColor('subOutcome', rollData.type, rollLines.subOutcome, 'worst')
                deltaAttrs[p('projectlaunchresults')] = 'TOTAL FAIL'
                deltaAttrs[p('projectlaunchresultsmargin')] = "You've Angered Someone..."
                deltaAttrs[p('projectlaunchdiffmod')] = 0
                deltaAttrs[p('projectlaunchrollToggle')] = 2
              } else if (margin < 0) {
                logLines.outcome = CHATSTYLES.outcomeOrange + 'FAILURE!</span></div>'
                logLines.subOutcome = CHATSTYLES.subOutcomeOrange + '+1 Difficulty to Try Again</span></div>'
                rollLines.outcome.text = 'FAILURE!'
                rollLines.subOutcome.text = '+1 Difficulty to Try Again'
                rollLines.outcome = setColor('outcome', rollData.type, rollLines.outcome, 'bad')
                rollLines.subOutcome = setColor('subOutcome', rollData.type, rollLines.subOutcome, 'bad')
                deltaAttrs[p('projectlaunchresults')] = 'FAILURE'
                deltaAttrs[p('projectlaunchdiffmod')] = rollData.diffMod + 1
                deltaAttrs[p('projectlaunchdiff')] = rollData.diff + 1
              } else if (rollResults.critPairs.bb > 0) {
                logLines.outcome = CHATSTYLES.outcomeWhite + 'CRITICAL WIN!</span></div>'
                logLines.subOutcome = CHATSTYLES.subOutcomeWhite + 'No Commit Needed!</span></div>'
                rollLines.outcome.text = 'CRITICAL WIN!'
                rollLines.subOutcome.text = 'No Commit Needed!'
                rollLines.outcome = setColor('outcome', rollData.type, rollLines.outcome, 'best')
                rollLines.subOutcome = setColor('subOutcome', rollData.type, rollLines.subOutcome, 'best')
                deltaAttrs[p('projectlaunchresults')] = 'CRITICAL WIN!'
                deltaAttrs[p('projectlaunchresultsmargin')] = 'No Stake Needed!'
                deltaAttrs[p('projectlaunchdiffmod')] = 0
                deltaAttrs[p('projectlaunchrollToggle')] = 2
              } else {
                logLines.outcome = CHATSTYLES.outcomeWhite + 'SUCCESS!</span></div>'
                logLines.subOutcome = CHATSTYLES.subOutcomeWhite + 'Stake ' + rollResults.commit + ' Dots</span></div>'
                rollLines.outcome.text = 'SUCCESS!'
                rollLines.subOutcome.text = 'Stake ' + rollResults.commit + ' Dots'
                rollLines.outcome = setColor('outcome', rollData.type, rollLines.outcome, 'best')
                rollLines.subOutcome = setColor('subOutcome', rollData.type, rollLines.subOutcome, 'best')
                deltaAttrs[p('projectlaunchresults')] = 'SUCCESS!'
                deltaAttrs[p('projectlaunchresultsmargin')] = 'Stake ' + rollResults.commit + ' Dots (' + rollResults.commit + ' to go)'
                deltaAttrs[p('projectlaunchdiffmod')] = 0
                deltaAttrs[p('projectlaunchrollToggle')] = 2
                deltaAttrs[p('projectstakesToggle')] = 1
                deltaAttrs[p('projecttotalstake')] = rollResults.commit
              }
              break
            case 'trait':
              if ((total === 0 || margin < 0) && rollResults.H.botches > 0) {
                rollLines.outcome.text = 'BESTIAL FAILURE!'
                logLines.outcome = CHATSTYLES.outcomeRed + 'BESTIAL FAILURE!</span></div>'
                rollLines.outcome = setColor('outcome', rollData.type, rollLines.outcome, 'worst')
                break
              } else if (margin >= 0 && rollResults.critPairs.hb + rollResults.critPairs.hh > 0) {
                rollLines.outcome.text = 'MESSY CRITICAL!'
                logLines.outcome = CHATSTYLES.outcomeRed + 'MESSY CRITICAL!</span></div>'
                rollLines.outcome = setColor('outcome', rollData.type, rollLines.outcome, 'worst')
                break
              }
              // falls through
            case 'willpower':
            case 'humanity':
              if (total === 0) {
                rollLines.outcome.text = 'TOTAL FAILURE!'
                logLines.outcome = CHATSTYLES.outcomeRed + 'TOTAL FAILURE!</span></div>'
                rollLines.outcome = setColor('outcome', rollData.type, rollLines.outcome, 'worst')
              } else if (margin < 0) {
                logLines.outcome = CHATSTYLES.outcomeOrange + 'COSTLY SUCCESS?</span></div>'
                rollLines.outcome.text = 'COSTLY SUCCESS?'
                rollLines.outcome = setColor('outcome', rollData.type, rollLines.outcome, 'bad')
              } else if (rollResults.critPairs.bb > 0) {
                logLines.outcome = CHATSTYLES.outcomeWhite + 'CRITICAL WIN!</span></div>'
                rollLines.outcome.text = 'CRITICAL WIN!'
                rollLines.outcome = setColor('outcome', rollData.type, rollLines.outcome, 'best')
              } else {
                logLines.outcome = CHATSTYLES.outcomeWhite + 'SUCCESS!</span></div>'
                rollLines.outcome.text = 'SUCCESS!'
                rollLines.outcome = setColor('outcome', rollData.type, rollLines.outcome, 'good')
              }
              break
            case 'frenzy':
              if (total === 0 || margin < 0) {
                rollLines.outcome.text = 'YOU FRENZY!'
                logLines.outcome = CHATSTYLES.outcomeRed + 'FRENZY!</span></div>'
                rollLines.outcome = setColor('outcome', rollData.type, rollLines.outcome, 'worst')
              } else if (rollResults.critPairs.bb > 0) {
                rollLines.outcome.text = 'RESISTED!'
                logLines.outcome = CHATSTYLES.outcomeWhite + 'RESISTED!</span></div>'
                rollLines.outcome = setColor('outcome', rollData.type, rollLines.outcome, 'best')
              } else {
                rollLines.outcome.text = 'RESTRAINED...'
                logLines.outcome = CHATSTYLES.outcomeWhite + 'RESTRAINED...</span></div>'
                rollLines.outcome = setColor('outcome', rollData.type, rollLines.outcome, 'good')
              }
              break
            case 'remorse':
              deltaAttrs[gNum + 'deltaStains'] = -1 * parseInt(getAttrByName(rollData.charID, gNum + 'Stains') || 0)
              if (rollResults.total === 0) {
                rollLines.outcome.text = 'YOUR HUMANITY FADES...'
                logLines.outcome = CHATSTYLES.outcomeRed + 'DEGENERATION</span></div>'
                deltaAttrs[gNum + 'deltaHumanity'] = -1
                rollLines.outcome = setColor('outcome', rollData.type, rollLines.outcome, 'bad')
              } else {
                rollLines.outcome.text = 'YOU FIND ABSOLUTION!'
                logLines.outcome = CHATSTYLES.outcomeWhite + 'ABSOLUTION</span></div>'
                rollLines.outcome = setColor('outcome', rollData.type, rollLines.outcome, 'good')
              }
              break
            case 'rouse':
            case 'rouse2':
              if (rollResults.total > 0) {
                rollLines.outcome.text = 'RESTRAINED...'
                logLines.outcome = CHATSTYLES.outcomeWhite + 'RESTRAINED</span></div>'
                rollLines.outcome = setColor('outcome', rollData.type, rollLines.outcome, 'good')
              } else {
                rollLines.outcome.text = 'HUNGER ROUSED!'
                logLines.outcome = CHATSTYLES.outcomeRed + 'ROUSED!</span></div>'
                rollLines.outcome = setColor('outcome', rollData.type, rollLines.outcome, 'worst')
                deltaAttrs[gNum + 'Hunger'] = parseInt(getAttrByName(rollData.charID, gNum + 'Hunger')) + 1
              }
              break
            case 'check':
              if (rollResults.total > 0) {
                rollLines.outcome.text = 'PASS'
                logLines.outcome = CHATSTYLES.outcomeWhite + 'PASS</span></div>'
                rollLines.outcome = setColor('outcome', rollData.type, rollLines.outcome, 'good')
              } else {
                rollLines.outcome.text = 'FAIL'
                logLines.outcome = CHATSTYLES.outcomeRed + 'FAIL</span></div>'
                rollLines.outcome = setColor('outcome', rollData.type, rollLines.outcome, 'worst')
              }
              break
          }
          break
      }
    })

    logLines.rollerName = CHATSTYLES.rollerName + rollData.charName + logLines.rollerName + '</div>'
    logLines.mainRoll = logLines.mainRoll + logLines.difficulty + '</span>' + logLines.mainRollSub + '</div>'
    logLines.resultDice = CHATSTYLES.resultDice.start + CHATSTYLES.resultCount + rollResults.total + ':</span>' + formatDiceLine(rollData, rollResults) + CHATSTYLES.margin + (rollResults.margin ? ' (' + (rollResults.margin >= 0 ? '+' : '-') + Math.abs(rollResults.margin) + ')' : ' ') + '</span></div>'

    var logString = logLines.fullBox + logLines.rollerName + logLines.mainRoll + logLines.resultDice + logLines.outcome + logLines.subOutcome + '</div>'
    D.DB('LOGLINES: ' + D.JS(logLines), 'LOG LINES', 2)

    D.SendMessage('Storyteller', logString, ' ')
    // D.Alert(logString);

    D.DB('... Complete.', 'ROLLER: applyRolls()', 4)

    _.each(blankLines, function (line) {
      rollLines[line] = { text: ' ' }
    })

    var diceCats = _.clone(STATECATS.dice)
    switch (rollData.type) {
      case 'rouse2':
      case 'rouse':
      case 'check':
        diceCats = diceCats.reverse()
        break
    }
    var diceObjs = []
    // D.DB("Processing '" + D.JSL(diceCats[0]) + "' (length = " + D.JSL(state[D.GAMENAME].Roller[diceCats[0]].length) + "): " + D.JSL(state[D.GAMENAME].Roller[diceCats[0]]), "ROLLER: applyRoll()", 2);
    for (var i = 0; i < state[D.GAMENAME].Roller[diceCats[0]].length; i++) diceObjs.push(setDie(i, diceCats[0], rollResults.diceVals[i] || 'blank', { type: rollData.type, shift: { top: yShift } })) 
    // D.DB("Dice Objects List: '" + D.JSL(diceObjs) + "'", "ROLLER: applyRoll()", 2);

    var bookends = [diceObjs[0], diceObjs[rollResults.diceVals.length - 1]]

    if (!bookends || bookends.length < 2 || _.isUndefined(bookends[0]) || _.isUndefined(bookends[1])) return D.ThrowError('Bookends Not Found.  DiceObjs.length is ' + diceObjs.length + ', rollResults.diceVals is ' + rollResults.diceVals.length + ': ' + D.JSL(diceObjs)) 

    var spread = bookends[1].get('left') - bookends[0].get('left')

    scaleFrame('bottom', spread)
    for (var j = 0; j < state[D.GAMENAME].Roller[diceCats[1]].length; j++) 
      setDie(j, diceCats[1], 'blank')
    

    var txtWidths = {}
    _.each(rollLines, function (params, name) {
      var pars = setText(name, params)
      txtWidths[name] = pars.width
    })
    spread = txtWidths.posMods || 0 + txtWidths.negMods || 0
    spread += txtWidths.posMods && txtWidths.negMods ? 50 : 0
    spread = Math.max(spread, txtWidths.mainRoll)
    scaleFrame('top', spread)

    D.RunFX('bloodBolt', POSITIONS.bloodBoltFX)
    if (_.values(deltaAttrs).length > 0) {
      // D.Alert(D.JS(deltaAttrs), "DELTA ATTRS");
      setAttrs(rollData.charID, deltaAttrs)
    }
  }

  const wpReroll = function (dieCat) {
    isRerollFXOn = false
    clearInterval(rerollFX)
    rerollFX = null
    let rollData = state[D.GAMENAME].Roller.lastRoll.data
    rollData.rerollAmt = state[D.GAMENAME].Roller.selected[dieCat].length
    var rolledDice = _.mapObject(_.omit(state[D.GAMENAME].Roller[dieCat], function (data, dieNum) {
      return data.value === 'blank' || state[D.GAMENAME].Roller.selected[dieCat].includes(parseInt(dieNum))
    }), function (data) { return data.value })
    // D.DB("UNSELECTED VALUES: " + D.JSL(rolledDice), "ROLLER: wpReroll()", 3);
    var rollResults = rollDice(rollData, _.values(rolledDice))

    applyRoll(rollData, rollResults)
  }

  const changeRoll = function (deltaDice) {
    let rollResults = state[D.GAMENAME].Roller.lastRoll.results
    let rollData = state[D.GAMENAME].Roller.lastRoll.data
    if (parseInt(deltaDice) < 0) {
      _.shuffle(rollResults.diceVals)
      for (var i = 0; i > deltaDice; i--) {
        let cutIndex = _.findIndex(rollResults.diceVals, function (val) {
          return val.slice(0, 1) === 'B'
        })
        if (cutIndex === -1) return D.ThrowError('Not enough base dice to remove in: ' + D.JSL(rollResults.diceVals), 'ROLLER: changeRoll()') 
        rollResults.diceVals.splice(cutIndex, 1)
      }
    }
    rollResults = rollDice({ type: 'trait', rerollAmt: parseInt(deltaDice) > 0 ? parseInt(deltaDice) : 0, diff: rollData.diff }, rollResults.diceVals)
    state[D.GAMENAME].Roller.lastRoll.data.dicePool += parseInt(deltaDice)
    state[D.GAMENAME].Roller.lastRoll.data.basePool = Math.max(1, rollData.dicePool) - rollData.hungerPool
    applyRoll(state[D.GAMENAME].Roller.lastRoll.data, rollResults)
  }
  // #endregion

  // #region Getting Random Resonance Based On District/Site Parameters
  var getResonance = function (posRes, negRes, isDoubleAcute) {
    var resProbs
    posRes = (posRes || '').toLowerCase()
    negRes = (negRes || '').toLowerCase()
    var resonances = ['Choleric', 'Melancholic', 'Phlegmatic', 'Sanguine']
    _.each(resonances, function (res) {
      if (posRes.includes(res.toLowerCase().charAt(0))) {
        resonances = _.without(resonances, res)
        resonances.unshift(res)
      }
      if (negRes.includes(res.toLowerCase().charAt(0))) {
        resonances = _.without(resonances, res)
        resonances.push(res)
      }
    })
    switch (posRes.length + negRes.length) {
      case 3:
        if (posRes.length === 2) 
          if (posRes.charAt(0) === posRes.charAt(1)) { resProbs = D.RESPROBS.pos2neg } else { resProbs = D.RESPROBS.posposneg }
         else
        if (negRes.charAt(0) === negRes.charAt(1)) { resProbs = D.RESPROBS.neg2pos } else resProbs = D.RESPROBS.posnegneg 
        break
      case 2:
        if (posRes.length === 2) { resProbs = D.RESPROBS.pospos } else if (negRes.length === 2) { resProbs = D.RESPROBS.negneg } else resProbs = D.RESPROBS.posneg 
        break
      case 1:
        resProbs = posRes.length === 1 ? D.RESPROBS.pos : D.RESPROBS.neg
        break
      case 0:
        resProbs = D.RESPROBS.norm
        break
    }
    resProbs = _.flatten(_.map(resProbs, function (ra) { return _.values(ra) }))
    if (isDoubleAcute) {
      for (var i = 0; i < 4; i++) {
        resProbs[i * 4 + 0] = resProbs[i * 4 + 0] - resProbs[i * 4 + 2] / 2 - resProbs[i * 4 + 3] / 2
        resProbs[i * 4 + 1] = resProbs[i * 4 + 1] - resProbs[i * 4 + 2] / 2 - resProbs[i * 4 + 3] / 2
        resProbs[i * 4 + 2] = resProbs[i * 4 + 2] * 2
        resProbs[i * 4 + 3] = resProbs[i * 4 + 3] * 2
      }
    }
    var randNum = Math.random()
    do 
      randNum -= resProbs.shift()
     while (randNum > 0)

    let res = resonances.reverse()[Math.floor(resProbs.length / 4)]
    // let res = resonances[3 - Math.floor(resProbs.length / 4)];
    let temp = ['Negligible', 'Fleeting', 'Intense', 'Acute'][3 - resProbs.length % 4]
    return [temp, res]
    // return ["Acute", "Choleric"];
  }

  // #endregion

  // #region Secret Dice Rolling Macro
  var makeSecretRoll = function (chars, params, isSilent, isHidingTraits) {
    var rollData = buildDicePool(getRollData(chars[0], 'secret', params))
    var dicePool = rollData.dicePool
    var traitLine, playerLine
    var blocks = []

    if (isHidingTraits || rollData.traits.length === 0) { playerLine = CHATSTYLES.space30 + CHATSTYLES.secret.greyS + '... rolling </span>' + CHATSTYLES.secret.whiteB + dicePool + '</span>' + CHATSTYLES.space10 + CHATSTYLES.secret.greyS + (dicePool === 1 ? ' die ' : ' dice ') + '...</span>' + CHATSTYLES.space40 } else {
      playerLine = CHATSTYLES.secret.greyS + 'rolling </span>' + CHATSTYLES.secret.white + _.map(_.keys(rollData.traitData), k => k.toLowerCase()).join('</span><br>' + CHATSTYLES.space30 + CHATSTYLES.secret.greyPlus + CHATSTYLES.secret.white) + '</span>'
      if (rollData.mod !== 0) playerLine += (rollData.mod > 0 ? CHATSTYLES.secret.greyPlus : '') + (rollData.mod < 0 ? CHATSTYLES.secret.greyMinus : '') + CHATSTYLES.secret.white + Math.abs(rollData.mod) + '</span>' 
    }

    if (rollData.traits.length > 0) {
      traitLine = _.keys(rollData.traitData).join(' + ')
      if (rollData.mod !== 0) traitLine += (dicePool > 0 ? ' + ' : '') + (dicePool < 0 ? ' - ' : '') + Math.abs(rollData.mod) 
    } else {traitLine = rollData.mod + (rollData.mod === 1 ? ' Die' : ' Dice')} 

    _.each(chars, function (char) {
      rollData = getRollData(char, 'secret', params)
      rollData.isSilent = isSilent || false
      rollData.isHidingTraits = isHidingTraits || false
      rollData = buildDicePool(rollData)
      var rollResults = rollDice(rollData)
      var total = rollResults.total
      var margin = rollResults.margin
      var outcomeLine = ''
      if ((total === 0 || margin < 0) && rollResults.H.botches > 0) { outcomeLine = CHATSTYLES.outcomeRedSmall + 'BESTIAL FAIL!' } else if (margin >= 0 && rollResults.critPairs.hb + rollResults.critPairs.hh > 0) { outcomeLine = CHATSTYLES.outcomeWhiteSmall + 'MESSY CRIT! (' + (rollData.diff > 0 ? '+' + margin : total) + ')' } else if (total === 0) { outcomeLine = CHATSTYLES.outcomeRedSmall + 'TOTAL FAILURE!' } else if (margin < 0) { outcomeLine = CHATSTYLES.outcomeRedSmall + 'FAILURE' + (rollData.diff > 0 ? ' (' + margin + ')' : '') } else if (rollResults.critPairs.bb > 0) { outcomeLine = CHATSTYLES.outcomeWhiteSmall + 'CRITICAL! (' + (rollData.diff > 0 ? '+' + margin : total) + ')' } else outcomeLine = CHATSTYLES.outcomeWhiteSmall + 'SUCCESS! (' + (rollData.diff > 0 ? '+' + margin : total) + ')' 
      blocks.push(CHATSTYLES.secret.startBlock + CHATSTYLES.secret.blockNameStart + rollData.charName + '</div>' +
CHATSTYLES.secret.diceStart + formatDiceLine(rollData, rollResults, 9).replace(/text-align: center; height: 20px/g, 'text-align: center; height: 20px; line-height: 25px').replace(/margin-bottom: 5px;/g, 'margin-bottom: 0px;').replace(/color: black; height: 24px/g, 'color: black; height: 18px').replace(/height: 24px/g, 'height: 20px').replace(/height: 22px/g, 'height: 18px') + '</div>' +
CHATSTYLES.secret.lineStart + outcomeLine + '</div></div></div>')
      if (!rollData.isSilent) sendChat('Storyteller', '/w ' + D.GetName(char).split(' ')[0] + ' ' + CHATSTYLES.secret.startPlayerBlock + CHATSTYLES.secret.playerTopLineStart + 'you are being tested ...' + '</div>' + CHATSTYLES.secret.playerBotLineStart + playerLine + '</div></div>') 
    })
    var resultLine = CHATSTYLES.fullBox + CHATSTYLES.secret.topLineStart + (rollData.isSilent ? 'Silently Rolling' : 'Secretly Rolling') + (rollData.isHidingTraits ? ' (Traits Hidden)' : ' ...') + '</div>' + CHATSTYLES.secret.traitLineStart + traitLine + (rollData.diff > 0 ? ' vs. ' + rollData.diff : '') + '</div>' + blocks.join('') + '</div></div>'
    sendChat('Storyteller', '/w Storyteller ' + resultLine)
  }
  // #endregion

  // #region Event Handlers (handleInput)
  var handleInput = function (msg) {
    if (msg.type !== 'api') return 
    if (msg.content.includes('!gRoll')) {
      let preArgs = msg.content.split(/\s+/)
      preArgs.shift()
      let newArgs = preArgs.join(' ').split('|')
      let rollType = newArgs.shift()
      let groupName = newArgs.shift()
      let groupNum = newArgs.shift()
      let params = {
        groupNum:  groupNum,
        groupName: groupName,
        data:      newArgs
      }
      let charObj = D.GetChar(params.groupName)
      makeSheetRoll(charObj, rollType, params)
      return
    }
    let args = msg.content.split(/\s+/)
    var rollType = null
    var name = ''
    var isSilent, isHidingTraits
    let rollString = args.shift()
    switch (rollString) { //! traitroll @{character_name}|Strength,Resolve|3|5|0|ICompulsion:3,IPhysical:2
      case '!frenzyroll': //! projectroll @{character_name}|Politics:3,Resources:2|mod|diff;
        rollType = 'frenzy'
        args = (state[D.GAMENAME].Roller.frenzyRoll + '|' + args[0]).split(' ')
        D.DB('NEW ARGS: ' + D.JSL(args), '!frenzyroll', 2)
        // falls through
      case '!frenzyinitroll':
        rollType = rollType || 'frenzyInit'
        // falls through
      case '!traitroll':
        rollType = rollType || 'trait'
        // falls through
      case '!rouseroll':
        rollType = rollType || 'rouse'
        // falls through
      case '!rouse2roll':
        rollType = rollType || 'rouse2'
        // falls through
      case '!checkroll':
        rollType = rollType || 'check'
        // falls through
      case '!willpowerroll':
        rollType = rollType || 'willpower'
        // falls through
      case '!humanityroll':
        rollType = rollType || 'humanity'
        // falls through
      case '!remorseroll':
        rollType = rollType || 'remorse'
        // falls through
      case '!projectroll': {
        rollType = rollType || 'project'
        D.Log('Received Roll: ' + D.JSL(rollString) + ' ' + args.join(' '))
        let params = args.join(' ').split('|')
        name = params.shift()
        let charObj = D.GetChars(name)[0]
        if (!charObj) return D.ThrowError('!' + rollType + 'roll: No character found with name ' + D.JS(name)) 
        if (rollType === 'frenzyInit') {
          state[D.GAMENAME].Roller.frenzyRoll = name + '|' + params.join('|')
          sendChat('ROLLER', "/w Storyteller <br/><div style='display: block; background: url(https://i.imgur.com/kBl8aTO.jpg); text-align: center; border: 4px crimson outset;'><br/><span style='display: block; font-size: 16px; text-align: center; width: 100%'>[Set Frenzy Diff](!&#13;#Frenzy)</span><span style='display: block; text-align: center; font-size: 12px; font-weight: bolder; color: white; font-variant: small-caps; margin-top: 4px; width: 100%'>~ for ~</span><span style='display: block; font-size: 14px; color: red; text-align: center; font-weight: bolder; font-variant: small-caps; width: 100%'>" + name + '</span><br/></div>')
          return
        }
        makeSheetRoll(charObj, rollType, params)
        delete state[D.GAMENAME].Roller.frenzyRoll
        break
      } case '!buildFrame':
        initFrame()
        break
      case '!showDice':
        _.each(state[D.GAMENAME].Roller.diceList, function (data, dieNum) {
          var thisDie = setDie(dieNum, 'diceList', 'Hs')
          if (_.isObject(thisDie)) {
            thisDie.set('layer', 'objects')
            thisDie.set('isdrawing', false)
          }
        })
        _.each(state[D.GAMENAME].Roller.bigDice, function (data, dieNum) {
          var thisDie = setDie(dieNum, 'bigDice', 'Bs')
          if (_.isObject(thisDie)) {
            thisDie.set('layer', 'objects')
            thisDie.set('isdrawing', false)
          }
        })
        break
      case '!resetDice':
        _.each(STATECATS.dice, function (dieCat) {
          state[D.GAMENAME].Roller[dieCat] = []
        })
        break
      case '!reg':
      case '!register':
        switch (args.shift()) {
          case 'die':
            if (!msg.selected || !msg.selected[0]) return D.ThrowError('!register die: Select a Graphic!') 
            registerDie(getObj('graphic', msg.selected[0]._id), args.shift())
            break
          case 'text':
            if (!msg.selected || !msg.selected[0]) return D.ThrowError('register text: Select a Text Object!') 
            registerText(getObj('text', msg.selected[0]._id), args.shift())
            break
          case 'shape':
            if (!msg.selected || !msg.selected[0]) return D.ThrowError('register text: Select a Path Object!') 
            name = args.shift()
            registerShape(getObj('path', msg.selected[0]._id), name, args.shift())
            break
          case 'image':
          case 'img':
            if (!msg.selected || !msg.selected[0]) return D.ThrowError('register img: Select an Image!') 
            name = args.shift()
            registerImg(getObj('graphic', msg.selected[0]._id), name, args.join(','))
            break
          case 'repo':
          case 'reposition':
            if (!msg.selected || !msg.selected[0]) return D.ThrowError('reposition: Select one or more objects to reposition!') 
            reposition(msg.selected)
            break
        }
        break
      case '!changeRoll':
        changeRoll(parseInt(args.shift()))
        break
      case '!resCheck':
        if (args[0] === 'x') args[0] = '' 
        if (args[1] === 'x') args[1] = '' 
        let thisRes = getResonance(args[0], args[1], args[2] === '2')
        sendChat('ROLLER', "/w Storyteller <br/><div style='display: block; background: url(https://i.imgur.com/kBl8aTO.jpg); text-align: center; border: 4px crimson outset;'><br/><span style='display: block; font-weight: bold; color: red; font-size: 16px; text-align: center; width: 100%'>" + thisRes[0].toUpperCase() + ' ' + thisRes[1].toUpperCase() + '</span><br/></div>')
        break
      case '!nxsroll':
      case '!xnsroll':
      case '!xsroll':
      case '!sxroll':
      case '!snxroll':
      case '!sxnroll':
      case '!nsroll':
      case '!snroll':
      case '!sroll': {
        rollType = 'secret'
        let params = args.join(' ').split('|')
        isSilent = rollString.includes('x')
        isHidingTraits = rollString.includes('n')
        let chars
        if (!msg.selected || !msg.selected[0]) { chars = Chars.GetAll() } else chars = D.GetChars(msg) 
        if (params.length < 1 || params.length > 3) return D.ThrowError('Syntax Error: ![x][n]sroll: <trait1>[,<trait2>]|[<mod>]|[<diff>] (' + D.JSL(params) + ')') 
        makeSecretRoll(chars, params, isSilent, isHidingTraits)
        break
      } default:
        break
    }
  }
  // #endregion

  // #region Public Functions: registerEventHandlers
  const registerEventHandlers = function () {
    on('chat:message', handleInput)
  }

  const checkInstall = function () {
    state[D.GAMENAME] = state[D.GAMENAME] || {}
    state[D.GAMENAME].Roller = state[D.GAMENAME].Roller || {}
    state[D.GAMENAME].Roller.selected = state[D.GAMENAME].Roller.selected || { diceList: [], bigDice: [] }
    state[D.GAMENAME].Roller.imgList = state[D.GAMENAME].Roller.imgList || {}
  }

  return {
    RegisterEventHandlers: registerEventHandlers,
    CheckInstall:          checkInstall,
    Select:                selectDie,
    Reroll:                wpReroll
  }
  // #endregion
})()

on('ready', function () {
  
  Roller.RegisterEventHandlers()
  Roller.CheckInstall()
  D.Log('Roller: Ready!')
})
