import {Injectable} from 'angular2/core';
import {Events, Platform, Storage, SqlStorage} from 'ionic-angular';


@Injectable()
export class WebsiteStorageService {
    tableName: string;
    storage: any;
    data: Array<{id: number, title: string, url: string, spaceSymbol: string}>;
    Storage: any;
    SqlStorage: any;

    constructor(
        private events: Events
    ) {
        this.tableName = 'websites';
        this.storage = new Storage(SqlStorage);
    }

    initializeStorage() {
        this.storage.query(`CREATE TABLE IF NOT EXISTS ${this.tableName} (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, url TEXT, spaceSymbol TEXT)`).then((data) => {
            console.log('TABLE CREATED / TABLE EXISTS -> ' + JSON.stringify(data.res));
        }, (error) => {
            console.log('ERROR -> ' + JSON.stringify(error.err));
        });
    }

    getItems() {
        this.storage.query(`SELECT * FROM ${this.tableName}`).then((data) => {
            this.data = [];
            if (data.res.rows.length > 0) {
                for (var i = 0; i < data.res.rows.length; i++) {
                    this.data.push({ id: data.res.rows.item(i).id, title: data.res.rows.item(i).title, url: data.res.rows.item(i).url, spaceSymbol: data.res.rows.item(i).spaceSymbol });
                }
            }
            this.events.publish('websites:all', this.data);
        }, (error) => {
            console.log(error);
        });
    }

    setItem(item) {
        this.storage.query(`INSERT INTO ${this.tableName} (title, url, spaceSymbol) VALUES ("${item.title}", "${item.url}", "${item.spaceSymbol}")`).then((data) => {
            this.events.publish('website:added', item);
        }, (error) => {
            console.log(error);
        });
    }

    updateItem(item) {
        this.storage.query(`UPDATE ${this.tableName} SET title = "${item.title}", url = "${item.url}", spaceSymbol = "${item.spaceSymbol}" WHERE id = "${item.id}"`).then((data) => {

        }, (error) => {
            console.log(error);
        });
    }

    deleteItem(id) {
        this.storage.query(`DELETE FROM ${this.tableName} WHERE id = "${id}"`).then((data) => {
            this.events.publish('website:deleted', id);
        }, (error) => {
            console.log(error);
        });
    }
}