const {run} = require("rollTesting.js");

const runFunc = () => {
    const code = document.getElementsByClassName("code-results")[0];
    const results = run();
    code.innerHTML = `<pre>${JSON.stringify(results, null, 4)}</pre>`;
};
