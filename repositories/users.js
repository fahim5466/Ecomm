const fs = require('fs');
const crypto = require('crypto');

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
        const users = await this.getAll();
        users.push(user);
        await this.writeAll(users);
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
}

module.exports = new UsersRepository('users.json');

