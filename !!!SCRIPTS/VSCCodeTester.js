const SCRIPTNAME = "TimeTracker"; // <-- SET THIS BEFORE TESTING OR STATE.REF CALLS WON'T WORK

const state = {
    TimeTracker: {
        // dateObj: 
        SessionDate: {
            start: [0, 19, 30],
            end: [0, 22, 30]
        }
    }
};

// #region SPOOFING TO MAKE CODE WORK
const STATE = {
    get REF() {
        return state[SCRIPTNAME];
    }
};
const VAL = (varList, funcName, isArray = false) => {
    console.log(`VALIDATE TEST RETURNING TRUE FOR:\n${varList}`);
    return true;
};
const DB = (msg, funcName) => true;
const LOG = (msg, funcName) => true;
const THROW = (msg, funcName, errObj) => false;
const ONSTACK = () => true; // (isThrottlingStackLog = false) => D.ONSTACK(ONSTACK, isThrottlingStackLog);
const OFFSTACK = () => true; // (funcID) => D.OFFSTACK(funcID);

const D = {
    Cycle: (num, minVal, maxVal) => {
        while (num > maxVal)
            num -= maxVal - minVal;
        while (num < minVal)
            num += maxVal - minVal;
        return num;
    },
    Pad: (num, numDigitsLeft, numDigitsRight) => {
        let [leftDigits, rightDigits] = `${num}`.split(".");
        leftDigits = `${"0".repeat(Math.max(0, numDigitsLeft - leftDigits.length))}${leftDigits}`;
        rightDigits = !isNaN(rightDigits) ? rightDigits : "";
        if (!isNaN(numDigitsRight))
            rightDigits = `.${rightDigits}${"0".repeat(Math.max(0, numDigitsRight - rightDigits.length))}`;
        return `${leftDigits}${rightDigits}`;
    },
    PullOut: (array,
              checkFunc = (_v = true, _i = 0, _a = []) => {
                  checkFunc(_v, _i, _a);
              }) => {
        const index = array.findIndex((v, i, a) => checkFunc(v, i, a));
        return index !== -1 && array.splice(index, 1).pop();
    }
    // pullIndex: (array, index) => pullElement(array, (v, i) => i === index)
};

// #endregion

// #region TIMETRACKER
const getDateObj = (dateRef) => {
    const funcID = ONSTACK(); // Takes almost any date format and converts it into a Date object.
    let returnDate;
    const curDateString = formatDateString(new Date(STATE.REF.dateObj));
    DB(
        {
            dateRef,
            stateCurDate: STATE.REF.dateObj,
            curDate: new Date(STATE.REF.dateObj),
            curDateString: formatDateString(new Date(STATE.REF.dateObj))
        },
        "parseToDateObj"
    );
    if (VAL({dateObj: dateRef})) {
        DB({["DATE OBJECT!"]: dateRef, isItReally: dateRef instanceof Date}, "parseToDateObj");
        return OFFSTACK(funcID) && dateRef;
    } else if (VAL({string: dateRef})) {
        if (!String(dateRef).match(/\D/gu)) {
            // if everything is a number, assume it's a seconds-past-1970 thing
            DB({["SECS-PAST-1970 STRING!"]: dateRef}, "parseToDateObj");
            return OFFSTACK(funcID) && new Date(parseInt(dateRef));
        }
        if (dateRef !== "") {
            DB({["OTHER STRING!"]: dateRef}, "parseToDateObj");
            // first, see if it includes a time stamp and separate that out:
            const [dateString, timeString] = Object.assign(
                [curDateString, ""],
                dateRef
                    .match(/([^:\n\r]+\d{2}?(?!:))?\s?(\S*:{1}.*)?/u)
                    .slice(1)
                    .map((x, i) => (i === 0 && !x ? curDateString : x))
            );
            const parsedDateString = _.compact(
                dateString.match(
                    /^(?:([\d]*)-?(\d*)-?(\d*)|(?:([\d]+)?(?:[^\w\d])*?([\d]+)?[^\w\d]*?(?:([\d]+)|(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec))?\w*?[^\w\d]*?([\d]+){1,2}\w*?[^\w\d]*?(\d+)))$/imuy
                )
            ).slice(1);
            let month, day, year;
            while (parsedDateString.length)
                switch (parsedDateString.length) {
                    case 3: {
                        year = D.PullOut(parsedDateString, (v) => v > 31);
                        month = D.PullOut(
                            parsedDateString,
                            (v) => VAL({string: v}) || (v <= 12 && parsedDateString.filter((x) => x <= 12).length === 1)
                        );
                        if (parsedDateString.length === 3)
                            [month, day, year] = parsedDateString;
                        break;
                    }
                    case 2: {
                        year = year || D.PullOut(parsedDateString, (v) => v > 31);
                        month
                            = month
                            || D.PullOut(parsedDateString, (v) => VAL({string: v}) || (v <= 12 && parsedDateString.filter((x) => x <= 12).length === 1));
                        if (VAL({number: year}))
                            day = day || D.PullOut(parsedDateString, (v) => v > 12);
                        if (parsedDateString.length === 2) {
                            month = month || parsedDateString.shift();
                            day = day || parsedDateString.shift();
                            year = year || (parsedDateString.length && parsedDateString.shift());
                        }
                        break;
                    }
                    case 1: {
                        year = year || parsedDateString.pop();
                        month = month || parsedDateString.pop();
                        day = day || parsedDateString.pop();
                        break;
                    }
                    // no default
                }
            if (!["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"].includes(month.toLowerCase()))
                month = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"][month - 1];
            if (`${year}`.length < 3)
                year = parseInt(year) + 2000;
            day = parseInt(day);
            returnDate = new Date([
                year,
                ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"].indexOf(month.toLowerCase()) + 1,
                day
            ]);

            // Now, the time component (if any)
            if (VAL({dateObj: returnDate, string: timeString})) {
                const [time, aMpM] = (timeString.match(/([^A-Z\s]+)(?:\s+)?(\S+)?/u) || [false, false, false]).slice(1);
                const [hour, min, sec] = `${D.JSL(time)}`.split(":").map((v) => D.Int(v));
                const totalSeconds = (hour + (D.LCase(aMpM).includes("p") && 12)) * 60 * 60 + min * 60 + sec;
                returnDate.setUTCSeconds(returnDate.getUTCSeconds() + totalSeconds);
                DB(
                    {
                        ["OTHER STRING!"]: dateRef,
                        dateString,
                        timeString,
                        parsedDateString,
                        day,
                        month,
                        year,
                        time,
                        aMpM,
                        hour,
                        min,
                        sec,
                        totalSeconds,
                        returnDate
                    },
                    "parseToDateObj"
                );
            } else {
                DB({["OTHER STRING!"]: dateRef, dateString, timeString, parsedDateString, day, month, year, returnDate}, "parseToDateObj");
            }
            return OFFSTACK(funcID) && returnDate;
        }
    } else {
        if (!_.isDate(dateRef))
            returnDate = new Date(dateRef);
        if (!_.isDate(returnDate))
            returnDate = new Date(D.Int(dateRef));
        if (!_.isDate(returnDate) && VAL({string: returnDate}))
            return OFFSTACK(funcID) && getDateObj(returnDate);
    }
    return OFFSTACK(funcID) && false;
};
const getRealDateObj = (dateRef) => {
    // const dateObj = dateRef ? getDateObj(dateRef) : new Date();
    const dateObj = dateRef || new Date();
    return convertToLocalTime(dateObj);
};
const convertToLocalTime = (dateRef) => {
    // const dateObj = dateRef ? getDateObj(dateRef) : new Date();
    const dateObj = dateRef || new Date();
    const offset = dateObj.getTimezoneOffset() / 60;
    const hours = dateObj.getHours();
    const newDateObj = new Date(dateObj.getTime() + dateObj.getTimezoneOffset() * 60 * 1000);
    newDateObj.setHours(hours - offset);
    return newDateObj;
};
const convertToUTCTime = (realDateObj) => new Date(realDateObj.getTime() - realDateObj.getTimezoneOffset() * 60 * 1000);
const getNextSessionDate = () => {
    // const funcID = ONSTACK();
    const realDateObj = getRealDateObj();
    // const [startDay, startHour, startMin] = STATE.REF.SessionDate.start;
    const sessTests = [
        [0, 19, 30],
        [6, 2, 30],
        [6, 1, 0]
    ];
    for (const testData of sessTests) {
        const [startDay, startHour, startMin] = testData;
        let daysOut = D.Cycle(startDay - realDateObj.getUTCDay(), 0, 7);
        // console.log(`Days Out: ${daysOut}`);
        if (daysOut === 0) {
            const dayMins = realDateObj.getUTCHours() * 60 + realDateObj.getUTCMinutes();
            const startMins = startHour * 60 + startMin;
            if (dayMins >= startMins)
                daysOut = 7;
            // console.log(`Day: ${realDateObj.getUTCHours()}*60 + ${realDateObj.getUTCMinutes()}\nStart: ${startHour}*60 + ${startMin}\nnewDaysOut: ${daysOut}`);
        }
        // const [endDay, endHour, endMin] = STATE.REF.SessionDate.end;
        const sessDateObj = getRealDateObj();
        sessDateObj.setUTCDate(realDateObj.getUTCDate() + daysOut);
        sessDateObj.setUTCHours(startHour);
        sessDateObj.setUTCMinutes(startMin);
        console.log(formatDateString(sessDateObj, true));
    }
    // return sessDateObj;
};
const formatTimeString = (date, isReturningSeconds = false) => {
    // const funcID = ONSTACK();
    const [hours, minutes, seconds] = [date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds()];
    if (hours === 0 || hours === 12)
        return /* OFFSTACK(funcID) && */ `12:${D.Pad(minutes, 2)}${isReturningSeconds ? `:${D.Pad(seconds, 2)}` : ""} ${hours === 0 ? "A.M." : "P.M."}`;
    else if (hours > 12)
        return /* OFFSTACK(funcID) && */ `${hours - 12}:${D.Pad(minutes, 2)}${isReturningSeconds ? `:${D.Pad(seconds, 2)}` : ""} P.M.`;
    else
        return /* OFFSTACK(funcID) && */ `${hours}:${D.Pad(minutes, 2)}${isReturningSeconds ? `:${D.Pad(seconds, 2)}` : ""} A.M.`;
};
const formatDateString = (date, isIncludingTime = false) =>
    // const funcID = ONSTACK();
    // date = (VAL({dateObj: date}) && date) || getDateObj(date);
    (
        // OFFSTACK(funcID) &&
        `${
            ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][date.getMonth()]
        } ${date.getUTCDate()}, ${date.getUTCFullYear()}${isIncludingTime ? `, ${formatTimeString(date).replace(/:(\d\s)/gu, ":0$1")}` : ""}`
    );
getNextSessionDate();

// #endregion
