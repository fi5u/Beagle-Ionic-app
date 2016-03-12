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
        let fetchPath;
        if(this.config.get('isProduction')) {
            fetchPath = this.config.get('pathAutoRemote');
        }
        else {
            fetchPath = this.config.get('pathAutoLocal');
        }
        const compiledFetchPath = fetchPath + '?url=' + encodeURI(url);
        return this.http.get(compiledFetchPath).map(res => res.json());
    }

    getUrlTemplate() {

    }
}