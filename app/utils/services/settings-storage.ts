import {Injectable} from 'angular2/core';
import {Config, Events, SqlStorage, Storage} from 'ionic-angular';
import {Device} from 'ionic-native';
import 'rxjs/add/operator/map';

@Injectable()
export class SettingsStorageService {
    data: Array<Object>;
    storage: any;

    constructor(
        private config: Config,
        private events: Events
        ) {
        this.storage = new Storage(SqlStorage);
    }

    initializeSettingsStorage() {
        this.storage.query(`CREATE TABLE IF NOT EXISTS settings (name TEXT PRIMARY KEY, value TEXT)`).then((data) => {
            console.log('SETTINGS TABLE CREATED / SETTINGS TABLE EXISTS -> ' + JSON.stringify(data.res));
            this.getStoredSettings();
        }, (error) => {
            console.log('ERROR -> ' + JSON.stringify(error.err));
        });
    }

    getStoredSettings() {
        this.storage.query(`SELECT * FROM settings`).then((data) => {
            this.data = [];
            if(data.res.rows.length > 0) {
                for(var i = 0; i < data.res.rows.length; i++) {
                    this.config.set(data.res.rows.item(i).name, data.res.rows.item(i).value);
                    console.log('just set config:' + data.res.rows.item(i).name + ' to: ' + data.res.rows.item(i).value);
                }
            }
            else {
                console.log('No stored settings');
            }
            let localStoredUUID = this.config.get('localStoredUUID');
            if(!localStoredUUID) {
                console.log('no locally stored uuid, trying to get device id');
                let deviceUUID = this.getDeviceID();
                if(deviceUUID) {
                    console.log('got device id, saving to storage and to config');
                    this.saveSetting('localStoredUUID', deviceUUID);
                }
                else {
                    console.log('device id not found, fetching useragent and date');
                    let localUUID = this.getLocalUUID();
                    this.saveSetting('localStoredUUID', localUUID);
                }
            }
            else {
                this.events.publish('settings:localStoredUUID:fetched', localStoredUUID);
            }
        }, (error) => {
            console.log(error);
        });
    }

    getDeviceID() {
        if(Device.device && Device.device.uuid) {
            return Device.device.uuid;
        }
        return '';
    }

    saveSetting(name, value) {
        // Save to storage
        this.storage.query(`INSERT OR REPLACE INTO settings (name, value) VALUES ("${name}", "${value}")`)
        // Save to config
        this.config.set(name, value);
        this.events.publish('settings:' + name + ':fetched', value);
    }

    getLocalUUID() {
        const userAgent = navigator.userAgent;
        const d = new Date();
        return userAgent + '__' + d.toString();
    }
}