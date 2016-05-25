import {Injectable} from 'angular2/core';
import {Http} from 'angular2/http';
import {Config} from 'ionic-angular';
import 'rxjs/add/operator/map';
import {TrackingService} from '../../../utils/services/tracking';

@Injectable()
export class AutoUrlService {
    constructor(
        private http: Http,
        private config: Config,
        private tracking: TrackingService
        ) {
        this.http = http;
        this.config = config;
    }

    fetchUrl(url) {
        const pathAuto = this.config.get('pathAuto');
        const fetchPath = pathAuto[this.config.get('developmentMode')]
        const compiledFetchPath = fetchPath + '?url=' + encodeURI(url);
        this.tracking.saveEvent('auto url', { action: 'fetch', data: {url: url} });
        return this.http.get(compiledFetchPath).map(res => res.json());
    }

    getUrlTemplate(templateObj) {
        const spaceSymbol = this.getSpaceSymbol(templateObj.url, templateObj.terms);
        const url = this.processUrl(templateObj.url, templateObj.terms, spaceSymbol);
        this.tracking.saveEvent('auto url', { action: 'data fetched', data: {title: templateObj.title, url: url, spaceSymbol: spaceSymbol} });
        return {
            title: templateObj.title,
            url: url,
            spaceSymbol: spaceSymbol,
        }
    }

    getSpaceSymbol(url, terms) {
        const secondPart = url.split(terms[1], 1);
        let spaceSymbol = secondPart[0].split(terms[0])[1];
        if(spaceSymbol === ' ') { spaceSymbol = '%20';  }
        return spaceSymbol;
    }

    processUrl(url, terms, spaceSymbol) {
        let searchTerm = terms[0] + spaceSymbol + terms[1];
        if(spaceSymbol === '%20') { searchTerm = terms[0] + ' ' + terms[1]; }
        return url.replace(searchTerm, this.config.get('searchPlaceholder'));
    }
}