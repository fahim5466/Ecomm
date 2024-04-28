const fs = require('fs');
const crypto = require('crypto');

module.exports = class Repository{
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

    async writeAll(items){
        await fs.promises.writeFile(this.filename, JSON.stringify(items, null, 2));
    }

    randomId(){
        return crypto.randomBytes(4).toString('hex');
    }

    async create(item){
        item.id = this.randomId();

        const items = await this.getAll();
        items.push(item);
        await this.writeAll(items);

        return item;
    }

    async getOne(id){
        const items = await this.getAll();
        return items.find(item => item.id === id);
    }

    async delete(id){
        const items = await this.getAll();
        const filteredItems = items.filter(item => item.id !== id);
        await this.writeAll(filteredItems);
    }

    async update(id, attrs){
        const items = await this.getAll();
        const item = items.find(item => item.id === id);
        
        if(!item){
            throw new Error(`Item with id ${id} not found!`);
        }

        Object.assign(item, attrs);
        await this.writeAll(items);
    }

    async getOneBy(filters){
        const items = await this.getAll();

        for(let item of items){
            let found = true;

            for(let key in filters){
                if(item[key] !== filters[key]){
                    found = false;
                    break;
                }
            }

            if(found){
                return item;
            }
        }
    }
}