/* export const whatIs = (value) => (
    {
        undefined: () => ["undefined", {undefined: true, empty: true, false: true}],
        boolean: (val) => ["boolean", {boolean: true, false: !val}],
        number: (val) => ["number", {
            number: true,
            false: val === 0,
            int: /^[0-9]+$/.test(`${val}`),
            float: /\./u.test(`${val}`)
        }],
        string: (val) => ["string", {
            string: true,
            empty: val === "",
            false: val === "",
            number: /^[0-9\.]+$/u.test(val),
            int: /^[0-9]+$/.test(val),
            float: /^[0-9]*\.[0-9]+$/u.test(val),
            boolean: /^true$|^false$/i.test(val),
            null: /^null$/i.test(val),
            undefined: /^undefined$/i.test(val)
        }],
        bigint: (val) => ["number", {
            number: true,
            false: val === 0,
            int: true,
            bigInt: true
        }],
        symbol: () => ["symbol", {symbol: true}],
        function: () => ["function", {function: true}],
        object: (val) => {
            if (val === null) {
                return ["null", {null: true, false: true, empty: true}];
            }
            const typeData = [Object.prototype.toString.call(val).slice(8, -1).toLowerCase(), {}];
            if (typeData[0] === "object") {
                typeData[0] = "list";
                typeData[1] = {list: true};
            } else {
                typeData[1] = {[typeData[0]]: true};
            }
            if (["set", "map"].includes(typeData[0])) {
                typeData[1].empty = val.size === 0;
            }
            if (["array", "list"].includes(typeData[0])) {
                typeData[1].empty = Object.values(val).length === 0;
            }
            return typeData;
        }
    }[typeof value](value));
const mutateArray = (array, checkFunc, replaceVal) => {
    const index = array.findIndex(checkFunc);
    if (index === -1) {
        return false;
    }
    if (replaceVal) {
        array[index] = replaceVal;
    } else {
        for (let i = 0; i < array.length; i++) {
            if (i === index) {                
                array.shift();
            }
            array.push(array.shift());
        }
    }
    return true;
};
export const extract = (array, searchVal) => {
    //   removes the first element found that matches the string or passes the check function
    //   mutates the array
    //   returns 'true' if array changed
    if (typeof searchVal !== "function") {
        searchVal = (elem) => elem === `${searchVal}`;
    }
    if (mutateArray(array, searchVal));
        return true;
    return false;
};
export const replace = (array, searchVal, replaceVal) => {    
    if (typeof searchVal !== "function") {
        searchVal = (elem) => elem === `${searchVal}`;
    }    
    if (mutateArray(array, searchVal, replaceVal));
        return true;
    return false;
} */





export const extract = (array, item, searchVal = "") => {
    //   removes the first element found that matches the string or passes the check function
    //   mutates the array
    //   returns 'true' if array changed
    if (typeof item === "string") {
        searchVal = item;
        item = (elem) => elem === searchVal;
    }

    const index = array.findIndex(item);
    if (index === -1) {
        console.log(`[${array.length}] ${searchVal} Not Found: [${array.length}]`);
        return false;
    }
    for (let i = 0; i < array.length; i++) {
        if (i === index)
            {array.shift();}
        array.push(array.shift());
    }
    return true;
};
export const getInt = (str) => parseInt(str.replace(/[^\d\.]/, ""));
export const getPercent = (num, total) => parseInt(num * 100 * 100 / total) / 100;
export const getAverage = (sum, runs) => parseInt(sum * 100 / runs) / 100; 
export const randBetween = (low, high) => Math.ceil(Math.random() * (high - low + 1)) + low - 1;
export const clone = (obj) => {
    let cloneObj;
    try {
        cloneObj = JSON.parse(JSON.stringify(obj));
    } catch (err) {
        cloneObj = {...obj};
    }
    return cloneObj;
};
export const merge = (target, source, {isMergingArrays = true, isOverwritingArrays = true} = {}) => {
    target = clone(target);
    const isObject = (obj) => obj && typeof obj === "object";

    if (!isObject(target) || !isObject(source))
        {return source;}

    Object.keys(source).forEach((key,) => {
        const targetValue = target[key];
        const sourceValue = source[key];

        if (Array.isArray(targetValue,) && Array.isArray(sourceValue,))
            {if (isOverwritingArrays) {
                target[key] = sourceValue;
            } else if (isMergingArrays) {
                target[key] = targetValue.map((x, i,) => (sourceValue.length <= i ? x : merge(x, sourceValue[i], {isMergingArrays, isOverwritingArrays},)),);
                if (sourceValue.length > targetValue.length)
                    {target[key] = target[key].concat(sourceValue.slice(targetValue.length,),);}
            } else {
                target[key] = targetValue.concat(sourceValue,);
            }}
        else if (isObject(targetValue,) && isObject(sourceValue,))
            {target[key] = merge({...targetValue}, sourceValue, {isMergingArrays, isOverwritingArrays},);}
        else
            {target[key] = sourceValue;}
    },);

    return target;
};
