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
        console.log('TRACKING INSTANTIATED!');
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
        this.saveProperty('last activity', nowString);
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
}