import {Injectable} from 'angular2/core';
import {Headers, Http, RequestOptions} from 'angular2/http';
import {Device} from 'ionic-native';
import {Config} from 'ionic-angular';
import 'rxjs/add/operator/map';

@Injectable()
export class TrackingService {
    user: any;
    trackingSchedule: any;
    trackingData: Array<Object>;

    constructor(private http: Http, private config: Config) {
        this.http = http;
        this.user = this.getUser();
        this.trackingSchedule = window.setInterval(() => {
            this.scheduleTracking();
        }, 30000);
        this.trackingData = [];
    }

    saveEvent(event, value) {
        const now = new Date();
        const nowString = now.toISOString();
        this.trackingData.push({ type: 'event', user: this.user, event: event, value: value, timestamp: nowString });
    }

    saveProperty(property, value) {
        this.trackingData.push({ type: 'prop', user: this.user, prop: property, value: value });
        console.log('saving');
    }

    scheduleTracking() {
        console.log('schedule now');

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

    getUser() {
        if(Device.device && Device.device.uuid) {
            return Device.device.uuid;
        }
        else {
            console.log('No device ID found');
            return 'noid';
        }
    }
}