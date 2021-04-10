const extract = (array, item, searchVal = "") => {
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
            array.shift();
        array.push(array.shift());
    }
    // console.log(`${searchVal} Found at ${index}: [${array.length}]`);
    return true;
};
const getInt = (str) => parseInt(str.replace(/\D/, ""));

exports = {
    extract,
    getInt
};
