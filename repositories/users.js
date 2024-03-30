const fs = require('fs');
const crypto = require('crypto');
const util = require('util');
const scrypt = util.promisify(crypto.scrypt);

class UsersRepository{
    constructor(filename){
        if(!filename){
            throw new Error('Creating a repository requires a filename.');
        }

        this.filename = filename;
        try{
            fs.accessSync(filename);
        }catch(err){
            fs.writeFileSync(filename, '[]');
        }
    }

    async getAll(){
        return JSON.parse(await fs.promises.readFile(this.filename, {
            encoding: 'utf8'
        }));
    }

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

    async writeAll(users){
        await fs.promises.writeFile(this.filename, JSON.stringify(users, null, 2));
    }

    randomId(){
        return crypto.randomBytes(4).toString('hex');
    }

    async getOne(id){
        const users = await this.getAll();
        return users.find(user => user.id === id);
    }

    async delete(id){
        const users = await this.getAll();
        const filteredUsers = users.filter(user => user.id !== id);
        await this.writeAll(filteredUsers);
    }

    async update(id, attrs){
        const users = await this.getAll();
        const user = users.find(user => user.id === id);
        
        if(!user){
            throw new Error(`User with id ${id} not found!`);
        }

        Object.assign(user, attrs);
        await this.writeAll(users);
    }

    async getOneBy(filters){
        const users = await this.getAll();

        for(let user of users){
            let found = true;

            for(let key in filters){
                if(user[key] !== filters[key]){
                    found = false;
                    break;
                }
            }

            if(found){
                return user;
            }
        }
    }

    async comparePasswords(passwordFromDb, passwordFromUser){
        const [hashFromDb, salt] = passwordFromDb.split('.');
        const hashFromUser = (await scrypt(passwordFromUser, salt, 64)).toString('hex');
        return hashFromDb === hashFromUser
    }
}

module.exports = new UsersRepository('users.json');

