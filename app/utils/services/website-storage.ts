import {Injectable} from 'angular2/core';
import {Events, Platform, Storage, SqlStorage} from 'ionic-angular';
import {TrackingService} from '../../utils/services/tracking';

@Injectable()
export class WebsiteStorageService {
    tableName: string;
    storage: any;
    data: Array<{id: number, title: string, url: string, spaceSymbol: string}>;
    Storage: any;
    SqlStorage: any;

    constructor(
        private events: Events,
        private tracking: TrackingService
    ) {
        this.tableName = 'websites';
        this.storage = new Storage(SqlStorage);
    }

    initializeStorage() {
        this.storage.query(`CREATE TABLE IF NOT EXISTS ${this.tableName} (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, url TEXT, spaceSymbol TEXT)`).then((data) => {
            console.log('TABLE CREATED / TABLE EXISTS -> ' + JSON.stringify(data.res));
        }, (error) => {
            this.tracking.saveEvent('error', { location: 'website storage', desc: 'could not create table', error: JSON.stringify(error.err) });
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
            this.tracking.saveEvent('error', { location: 'website storage', desc: 'could not fetch stored items', error: JSON.stringify(error.err) });
            console.log(error);
        });
    }

    setItem(item) {
        this.storage.query(`INSERT INTO ${this.tableName} (title, url, spaceSymbol) VALUES ("${item.title}", "${item.url}", "${item.spaceSymbol}")`).then((data) => {
            this.events.publish('website:added', item);
            this.tracking.saveEvent('website', { action: 'add', data: { title: item.title, url: item.url, spaceSymbol: item.spaceSymbol }});
        }, (error) => {
            this.tracking.saveEvent('error', { location: 'website storage', desc: 'could not insert new item', error: JSON.stringify(error.err), data: {id: item.id, title: item.title, url: item.url, spaceSymbol: item.spaceSymbol} });
            console.log(error);
        });
    }

    updateItem(item) {
        this.storage.query(`UPDATE ${this.tableName} SET title = "${item.title}", url = "${item.url}", spaceSymbol = "${item.spaceSymbol}" WHERE id = "${item.id}"`).then((data) => {
            this.tracking.saveEvent('website', { action: 'edit', data: { title: item.title, url: item.url, spaceSymbol: item.spaceSymbol }});
        }, (error) => {
            this.tracking.saveEvent('error', { location: 'website storage', desc: 'could not insert edit item', error: JSON.stringify(error.err), data: {id: item.id, title: item.title, url: item.url, spaceSymbol: item.spaceSymbol} });
            console.log(error);
        });
    }

    deleteItem(item) {
        this.storage.query(`DELETE FROM ${this.tableName} WHERE id = "${item.id}"`).then((data) => {
            this.events.publish('website:deleted', item.id);
            this.tracking.saveEvent('website', { action: 'delete', data: { title: item.title, url: item.url, spaceSymbol: item.spaceSymbol }});
        }, (error) => {
            this.tracking.saveEvent('error', { location: 'website storage', desc: 'could not delete item', error: JSON.stringify(error.err), data: {id: item.id, title: item.title, url: item.url, spaceSymbol: item.spaceSymbol} });
            console.log(error);
        });
    }
}