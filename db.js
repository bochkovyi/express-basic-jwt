let path = require('path');
let fs = require('fs');

const FILENAME = 'db.json';
function userExists (email) {
    return getAllUsers().then(users => {
        const userFiltered = users.filter(item => item.email === email);
        return userFiltered.length > 0;
    });
};

function createUser(data) {
    return getAllUsers().then(users => {
        const nextId = users.length === 0 ? 1 : users[users.length - 1].id + 1;
        const newUser = {...data, id: nextId};
        users.push(newUser);
        return writeNewDb(users, newUser);
    });
};

function writeNewDb(data, meta = true) {
    return new Promise((resolve, reject) => {
        fs.writeFile(`./storage/${FILENAME}`, JSON.stringify(data, null, 2), 'utf8', function (err) {
            if (err) {
                return reject(err);
            }
            resolve(meta);
        });
    });
}

function getAllUsers() {
    return new Promise((resolve, reject) => {
        fs.readFile(`./storage/${FILENAME}`, 'utf8', (err, data) => {
            if (err) {
                return reject(err);
            }
            resolve(JSON.parse(data));
        });
    });
}

function removeUserById(userId) {
    return this.getAllUsers().then(users => {
        let userIndex = -1;
        let userObject = null;
        users.forEach((item, index) => {
            if (item.id === userId) {
                userIndex = index;
                userObject = item;
            }
        });
        if (userIndex === -1) {
            return Promise.reject(false);
        }
        users.splice(userIndex, 1);
        return writeNewDb(users, userObject);
    });
}

function patchUserById(userId, newUserData) {
    return this.getAllUsers().then(users => {
        let userIndex = -1;
        let userObject = null;
        users.forEach((item, index) => {
            if (item.id === userId) {
                userIndex = index;
                userObject = item;
            }
        });
        if (userIndex === -1) {
            return Promise.reject(false);
        }
        userObject = {...userObject, ...newUserData}
        users[userIndex] = userObject;
        return writeNewDb(users, userObject);
    });
}

function init() {
    ensureDatabaseExists(`./storage/${FILENAME}`);
}

function ensureDirectoryExistence(filePath, isFolderPath = false) {
    var dirname = !isFolderPath ? path.dirname(filePath) : filePath;
    if (fs.existsSync(dirname)) {
      return true;
    }
    ensureDirectoryExistence(dirname);
    fs.mkdirSync(dirname);
  }

  function ensureDatabaseExists(path) {
    if (!fs.existsSync(path)) {
        ensureDirectoryExistence(path);
        fs.writeFileSync(path, '[]', 'utf8'); // Empty database
    }
  }

module.exports = {
    init,
    userExists,
    createUser,
    getAllUsers,
    removeUserById,
    patchUserById
};