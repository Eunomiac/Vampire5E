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
