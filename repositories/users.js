const crypto = require('crypto');
const util = require('util');
const scrypt = util.promisify(crypto.scrypt);
const Repository = require('./repository');

class UsersRepository extends Repository{
    async create(user){
        user.id = this.randomId();
        
        const salt = crypto.randomBytes(8).toString('hex');
        const hash = (await scrypt(user.password, salt, 64)).toString('hex');
        user.password = `${hash}.${salt}`;

        const users = await this.getAll();
        users.push(user);

        await this.writeAll(users);

        return user;
    }

    async comparePasswords(passwordFromDb, passwordFromUser){
        const [hashFromDb, salt] = passwordFromDb.split('.');
        const hashFromUser = (await scrypt(passwordFromUser, salt, 64)).toString('hex');
        return hashFromDb === hashFromUser
    }
}

module.exports = new UsersRepository('users.json');

