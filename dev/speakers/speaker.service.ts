import {Injectable} from "angular2/core";
import {SPEAKERS} from "./mock-speakers";
import {Speaker} from './speaker';
import {Http} from "angular2/http";
import {Observable} from "rxjs/Rx";

@Injectable()

export class SpeakerService {

    constructor(private _http:Http) {
    }

    speakers:Speaker[]

    getSpeakers() {
        if (!this.speakers || this.speakers.length == 0) {
            return this.loadSpeakers().then((speakers: Speaker[])=> {
                this.speakers = this.sortSpeakers(speakers);
                return speakers;
            });
        } else {
            console.log('Cached');
            return Promise.resolve(this.speakers)
        }
    }

    loadSpeakers() {
        var observer = this._http.get('http://local.connfa/api/v2/getSpeakers')
            .map(response => response.json())
            .catch(error => {
                console.log(error);
                return Observable.throw(error.json());
            });

        return new Promise(function (resolve, reject) {
            observer.subscribe(function (res) {
                resolve(res.speakers);
            });
        })

    }

    getSpeaker(id) {
        return new Promise((resolve, reject) => {
            this.getSpeakers().then((speakers: Speaker[]) => {
                speakers.forEach(item => {
                    if (item.speakerId == id) {
                        resolve(item);
                    }
                })
            });
        })
    }

    private sortSpeakers(speakers) {
        // speakers
        return speakers.sort((a, b) => {
            return a.firstName.localeCompare(b.firstName);
        });
    }
}