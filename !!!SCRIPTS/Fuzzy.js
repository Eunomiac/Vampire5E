void MarkStart("Fuzzy")
/* eslint-disable no-prototype-builtins */
/* eslint-disable consistent-return */
const Fuzzy = (() => {
    // ************************************** START BOILERPLATE INITIALIZATION & CONFIGURATION **************************************
    const SCRIPTNAME = "Fuzzy",

    // #region COMMON INITIALIZATION
        STATEREF = C.ROOT[SCRIPTNAME],	// eslint-disable-line no-unused-vars
        VAL = (varList, funcName, isArray = false) => D.Validate(varList, funcName, SCRIPTNAME, isArray), // eslint-disable-line no-unused-vars
        DB = (msg, funcName) => D.DBAlert(msg, funcName, SCRIPTNAME), // eslint-disable-line no-unused-vars
        LOG = (msg, funcName) => D.Log(msg, funcName, SCRIPTNAME), // eslint-disable-line no-unused-vars
        THROW = (msg, funcName, errObj) => D.ThrowError(msg, funcName, SCRIPTNAME, errObj), // eslint-disable-line no-unused-vars

        checkInstall = () => {
            C.ROOT[SCRIPTNAME] = C.ROOT[SCRIPTNAME] || {}
            initialize()
        },
    // #endregion

    // #region LOCAL INITIALIZATION
        initialize = () => { 
            STATEREF.minMatchScore = STATEREF.minMatchScore || 0.33
        },
    // #endregion  
  
    // #region EVENT HANDLERS: (HANDLEINPUT)
        onChatCall = (call, args, objects, msg) => { 	// eslint-disable-line no-unused-vars
            switch (call) {
                case "set": {
                    switch (D.LCase(call = args.shift())) {
                        case "minmatch": default: {
                            STATEREF.minMatchScore = D.Float(args.shift()) || 0.33
                            break
                        }
                    }
                    args.unshift(call)
                }
            // falls through
                case "get": {
                    switch (D.LCase(call = args.shift())) {
                        case "minmatch": default: {
                            D.Alert(`Fuzzy Minimum Match Score is <b>${STATEREF.minMatchScore}</b><br><br>Default = 0.33; <b>!fuzzy set minmatch &lt;#&gt;</b> to change.`, "!fuzzy set minmatch")
                            break
                        }
                    }
                    break
                }
            // no default
            }
        },
    // #endregion
    // *************************************** END BOILERPLATE INITIALIZATION & CONFIGURATION ***************************************

    /* eslint-disable */
        Fix = function(dict) {
            dict = dict || []
            const fuzzyset = {
                    gramSizeLower: 2,
                    gramSizeUpper: 3,
                    useLevenshtein: true,
                    exactSet: {},
                    matchDict: {},
                    items: {}
                },
    
                levenshtein = function(str1, str2) {
                    const current = []
                    let prev, value
    
                    for (let i = 0; i <= str2.length; i++)
                        for (let j = 0; j <= str1.length; j++) {
                            if (i && j)
                                if (str1.charAt(j - 1) === str2.charAt(i - 1))
                                    value = prev
                                else
                                    value = Math.min(current[j], current[j - 1], prev) + 1
                            else
                                value = i + j
    
                            prev = current[j]
                            current[j] = value
                        }
    
                    return current.pop()
                },
    
        // return an edit distance from 0 to 1
                _distance = function(str1, str2) {
                    if (str1 === null && str2 === null) throw "Trying to compare two null values"
                    if (str1 === null || str2 === null) return 0
                    str1 = String(str1); str2 = String(str2)
    
                    const distance = levenshtein(str1, str2)
                    if (str1.length > str2.length) 
                        return 1 - distance / str1.length
                    else 
                        return 1 - distance / str2.length
            
                },
                _nonWordRe = /[^a-zA-Z0-9\u00C0-\u00FF, ]+/g,
    
                _iterateGrams = function(value, gramSize) {
                    gramSize = gramSize || 2
                    let simplified = `-${ value.toLowerCase().replace(_nonWordRe, "") }-`,
                        lenDiff = gramSize - simplified.length,
                        results = []
                    if (lenDiff > 0) 
                        for (let i = 0; i < lenDiff; ++i) 
                            simplified += "-"
                
            
                    for (let i = 0; i < simplified.length - gramSize + 1; ++i) 
                        results.push(simplified.slice(i, i + gramSize))
            
                    return results
                },
    
                _gramCounter = function(value, gramSize) {
            // return an object where key=gram, value=number of occurrences
                    gramSize = gramSize || 2
                    let result = {},
                        grams = _iterateGrams(value, gramSize),
                        i = 0
                    for (i; i < grams.length; ++i) 
                        if (grams[i] in result) 
                            result[grams[i]] += 1
                        else 
                            result[grams[i]] = 1
                
            
                    return result
                }
    
        // the main functions
            fuzzyset.get = function(value, defaultValue, minMatchScore) {
            // check for value in set, returning defaultValue or null if none found
                if (minMatchScore === undefined) 
                    minMatchScore = 0.33
            
                const result = this._get(value, minMatchScore)
                if (!result && typeof defaultValue !== "undefined") 
                    return defaultValue
            
                return result
            }
    
            fuzzyset._get = function(value, minMatchScore) {
                const normalizedValue = this._normalizeStr(value),
                    result = this.exactSet[normalizedValue]
                if (result) 
                    return [[1, result]]
            
    
                let results = []
            // start with high gram size and if there are no results, go to lower gram sizes
                for (let gramSize = this.gramSizeUpper; gramSize >= this.gramSizeLower; --gramSize) {
                    results = this.__get(value, gramSize, minMatchScore)
                    if (results && results.length > 0) 
                        return results
                
                }
                return null
            }
    
            fuzzyset.__get = function(value, gramSize, minMatchScore) {
                let normalizedValue = this._normalizeStr(value),
                    matches = {},
                    gramCounts = _gramCounter(normalizedValue, gramSize),
                    items = this.items[gramSize],
                    sumOfSquareGramCounts = 0,
                    gram,
                    gramCount,
                    index,
                    otherGramCount
    
                for (gram in gramCounts) {
                    gramCount = gramCounts[gram]
                    sumOfSquareGramCounts += Math.pow(gramCount, 2)
                    if (gram in this.matchDict) 
                        for (let i = 0; i < this.matchDict[gram].length; ++i) {
                            index = this.matchDict[gram][i][0]
                            otherGramCount = this.matchDict[gram][i][1]
                            if (index in matches) 
                                matches[index] += gramCount * otherGramCount
                            else 
                                matches[index] = gramCount * otherGramCount
                        
                        }
                
                }
    
                function isEmptyObject(obj) {
                    for(const prop in obj) 
                        if(obj.hasOwnProperty(prop))
                            return false
                
                    return true
                }
    
                if (isEmptyObject(matches)) 
                    return null
            
    
                let vectorNormal = Math.sqrt(sumOfSquareGramCounts),
                    results = [],
                    matchScore
            // build a results list of [score, str]
                for (const matchIndex in matches) {
                    matchScore = matches[matchIndex]
                    results.push([matchScore / (vectorNormal * items[matchIndex][0]), items[matchIndex][1]])
                }
                const sortDescending = function(a, b) {
                    if (a[0] < b[0]) 
                        return 1
                    else if (a[0] > b[0]) 
                        return -1
                    else 
                        return 0
                
                }
                results.sort(sortDescending)
                let newResults = []
                if (this.useLevenshtein) {
                    newResults = []
                    const endIndex = Math.min(50, results.length)
                // truncate somewhat arbitrarily to 50
                    for (let i = 0; i < endIndex; ++i) 
                        newResults.push([_distance(results[i][1], normalizedValue), results[i][1]])
                
                    results = newResults
                    results.sort(sortDescending)
                }
                newResults = []
                results.forEach(function(scoreWordPair) {
                    if (scoreWordPair[0] >= minMatchScore) 
                        newResults.push([scoreWordPair[0], this.exactSet[scoreWordPair[1]]])
                
                }.bind(this))
                DB(`Needle: ${D.JSL(value)}<br>Sorted Matches:${D.JSL(newResults.map(x => `${x[0]}: "${x[1]}"`))}`, "fuzzyMatch")
                return newResults
            }
    
            fuzzyset.add = function(value) {
                const normalizedValue = this._normalizeStr(value)
                if (normalizedValue in this.exactSet) 
                    return false
            
    
                let i = this.gramSizeLower
                for (i; i < this.gramSizeUpper + 1; ++i) 
                    this._add(value, i)
            
            }
    
            fuzzyset._add = function(value, gramSize) {
                const normalizedValue = this._normalizeStr(value),
                    items = this.items[gramSize] || [],
                    index = items.length
    
                items.push(0)
                let gramCounts = _gramCounter(normalizedValue, gramSize),
                    sumOfSquareGramCounts = 0,
                    gram, gramCount
                for (gram in gramCounts) {
                    gramCount = gramCounts[gram]
                    sumOfSquareGramCounts += Math.pow(gramCount, 2)
                    if (gram in this.matchDict) 
                        this.matchDict[gram].push([index, gramCount])
                    else 
                        this.matchDict[gram] = [[index, gramCount]]
                
                }
                const vectorNormal = Math.sqrt(sumOfSquareGramCounts)
                items[index] = [vectorNormal, normalizedValue]
                this.items[gramSize] = items
                this.exactSet[normalizedValue] = value
            }
    
            fuzzyset._normalizeStr = function(str) {
                if (Object.prototype.toString.call(str) !== "[object String]") throw "Must use a string as argument to FuzzySet functions"
                return str.toLowerCase()
            }
    
        // return length of items in set
            fuzzyset.length = function() {
                let count = 0,
                    prop
                for (prop in this.exactSet) 
                    if (this.exactSet.hasOwnProperty(prop)) 
                        count += 1
                
            
                return count
            }
    
        // return is set is empty
            fuzzyset.isEmpty = function() {
                for (const prop in this.exactSet) 
                    if (this.exactSet.hasOwnProperty(prop)) 
                        return false
                
            
                return true
            }
    
        // return list of values loaded into set
            fuzzyset.values = function() {
                let values = [],
                    prop
                for (prop in this.exactSet) 
                    if (this.exactSet.hasOwnProperty(prop)) 
                        values.push(this.exactSet[prop])
                
            
                return values
            }
    
        // initialization
            let i = fuzzyset.gramSizeLower
            for (i; i < fuzzyset.gramSizeUpper + 1; ++i) 
                fuzzyset.items[i] = []
        
        // add all the items to the set
            for (i = 0; i < dict.length; ++i) 
                fuzzyset.add(dict[i])
        
    
            return fuzzyset
        }
    /* eslint-enable */

    return {
        CheckInstall: checkInstall,
        OnChatCall: onChatCall,

        Fix
    }
} )()

on("ready", () => {
    Fuzzy.CheckInstall()
    D.Log("Fuzzy Ready!")
} )
void MarkStop("Fuzzy")