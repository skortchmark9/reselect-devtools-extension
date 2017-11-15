function evalPromise(str) {
  return new Promise((resolve, reject) => {
    chrome.devtools.inspectedWindow.eval(str, (result, err) => {
      if (err && err.isException) {
        console.error(err.value);
        reject(err.value);
      } else {
        resolve(result);
      }
    });
  });
}

export function checkSelector(name) {
  const str = `(function() {
    const __reselect_last_check = window.__RESELECT_TOOLS__.checkSelector('${name}');
    console.log(__reselect_last_check);
    return __reselect_last_check;
  })()`;
  return evalPromise(str);
}

export function selectorGraph() {
  const str = 'window.__RESELECT_TOOLS__.selectorGraph()';
  return evalPromise(str);
}
