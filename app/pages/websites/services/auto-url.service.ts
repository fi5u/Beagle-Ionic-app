import {Injectable} from 'angular2/core';
import {Http} from 'angular2/http';
import {Config} from 'ionic-angular';
import 'rxjs/add/operator/map';

@Injectable()
export class AutoUrlService {
    http: any;

    constructor(http: Http, private config: Config) {
        this.http = http;
        this.config = config;
    }

    fetchUrl(url) {
        const fetchPath = this.config.get('pathAutoLocal') + '?url=' + encodeURI(url);
        return this.http.get(fetchPath).map(res => res.json());
    }
}