export function paginate(arr) {
  const size = 25;
  return arr.reduce((acc, val, i) => {
    let idx = Math.floor(i / size);
    let page = acc[idx] || (acc[idx] = []);
    page.push(val);

    return acc;
  }, []);
}

export function generateRandomId() {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(8)
    .substring(1);
}
