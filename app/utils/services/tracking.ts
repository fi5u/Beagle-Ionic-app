import {Injectable} from 'angular2/core';
import {Headers, Http, RequestOptions} from 'angular2/http';
import {Device} from 'ionic-native';
import {Config, Events} from 'ionic-angular';
import 'rxjs/add/operator/map';

@Injectable()
export class TrackingService {
    user: string = '';
    trackingSchedule: any;
    trackingData: Array<Object> = [];
    unregisteredUserTracking: Array<Object> = [];

    constructor(
        private config: Config,
        private events: Events,
        private http: Http
        ) {
        this.trackingSchedule = window.setInterval(() => {
            this.scheduleTracking();
        }, 30000);
        this.events.subscribe('settings:localStoredUUID:fetched', (localStoredUUID) => {
            this.user = localStoredUUID[0];
        });
    }

    saveEvent(event, value) {
        const now = new Date();
        const nowString = now.toISOString();
        const data = { type: 'event', user: this.user, event: event, value: value, timestamp: nowString };
        if(data.user.length) {
            this.trackingData.push(data);
        }
        else {
            this.saveUnregisteredUserTracking(data);
        }
    }

    saveProperty(property, value) {
        const data = { type: 'prop', user: this.user, prop: property, value: value };
        if(data.user.length) {
            this.trackingData.push(data);
        }
        else {
            this.saveUnregisteredUserTracking(data);
        }
    }

    scheduleTracking() {
        console.log('scheduled to send tracking now');
        if(this.unregisteredUserTracking.length) {
            console.log('got unregistered user tracking to send');
            if(!this.user) {
                console.log('do not have a user yet, bailing out');
                return;
            }
            let userData = this.fillInUser(this.unregisteredUserTracking);
            this.trackingData = this.trackingData.concat(userData);
            this.unregisteredUserTracking = [];
        }
        if(Object.keys(this.trackingData).length) {
            console.log('got tracking data to save');
            console.log(this.trackingData);

            this.sendTracking(this.trackingData).subscribe(
                data => {
                    console.log(data);
                },
                err => {
                    console.log(err);
                },
                () => {
                    console.log('tracking sent');
                    this.trackingData = [];
                });
        }
    }

    sendTracking(trackingData) {
        const pathTracking = this.config.get('pathTracking');
        const fetchPath = pathTracking[this.config.get('developmentMode')]
        const compiledTrackingPath = fetchPath;
        const body = JSON.stringify(trackingData);
        const headers = new Headers({ 'Content-Type': 'application/json; charset=UTF-8' });
        const options = new RequestOptions({ headers: headers });
        return this.http.post(compiledTrackingPath, body, options).map(res => res.json());
    }

    saveUnregisteredUserTracking(data) {
        console.log('saving an unregistered user tracking');
        this.unregisteredUserTracking.push(data);
    }

    fillInUser(data) {
        for (let i of data) {
            i.user = this.user;
        }
        return data;
    }

/*    getUser() {
        if(Device.device && Device.device.uuid) {
            return Device.device.uuid;
        }
        else {
            console.log('no device id');
            const localStoredUUID = this.getLocalStoredUUID();
            if(localStoredUUID) { return localStoredUUID; }
            else {
                console.log('No device ID found');
                return 'noid';
            }
        }
    }*/

/*    getLocalStoredUUID() {
        let uuid = this.config.get('localStoredUUID');
        if(uuid) { console.log('found uuid');return uuid; }
        else {
            console.log('could not find setting for localStoredUUID');
            uuid = this.getLocalUUID();
            this.storeLocalUUID(uuid);
            return uuid;
        }
    }
*/
/*    getLocalUUID() {
        const userAgent = navigator.userAgent;
        const d = new Date();
        const uuid = userAgent + (d.toString());
        let hash = 0, chr, len;
        if(uuid.length === 0) return hash;
        for(let i = 0, len = uuid.length; i < len; i++) {
            chr = uuid.charCodeAt(i);
            hash = ((hash << 5) - hash) + chr;
            hash |= 0;
        }
        console.log(hash);
        return hash;
    }
*/
/*    storeLocalUUID(uuid) {
        this.storage.query(`INSERT OR REPLACE INTO settings (name, value) VALUES ("localStoredUUID", "${uuid}")`).then((data) => {

        }, (error) => {
            console.log(error);
        });
    }*/
}