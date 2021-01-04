import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";
import { Observable } from "rxjs/Rx";

@Injectable()
export class SessionProvider {
    key: string;
    static user_cred: string = "user_cred";
    static term_acceptance: string = "term_acceptance";

    constructor(public storage: Storage) { }

    getUserCred(): Observable<any> {
        return Observable.fromPromise(this.storage.get(SessionProvider.user_cred));
    }

    setUserCred(encValue: string): Observable<any> {
        return Observable.fromPromise(this.storage.set(SessionProvider.user_cred, encValue));
    }

    isTermAccepted(): Observable<any> {
        return Observable.fromPromise(this.storage.get(SessionProvider.term_acceptance));
    }

    setTermAcceptance(condition: boolean): Observable<any> {
        return Observable.fromPromise(this.storage.set(SessionProvider.term_acceptance, condition));
    }

}