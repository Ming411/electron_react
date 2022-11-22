// 因为react默认都是去 node_modules中查找，加window让其支持node
const fs = window.require('fs').promises;

/* arr to obj */
// {1:{},2:{}}
export const mapArr = arr => {
  return arr.reduce((map, item) => {
    map[item.id] = item;
    return map;
  }, {});
};

/* obj to arr */
export const objToArr = obj => {
  return Object.keys(obj).map(key => obj[key]);
};

export const readFile = path => {
  return fs.readFile(path, 'utf-8');
};
export const writeFile = (path, content) => {
  return fs.writeFile(path, content, 'utf-8');
};
export const renameFile = (path, newPath) => {
  return fs.rename(path, newPath);
};
export const deleteFile = path => {
  return fs.unlink(path);
};
