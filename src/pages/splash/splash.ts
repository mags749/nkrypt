import { Component } from '@angular/core'
import { Platform, IonicPage, NavController, ToastController } from 'ionic-angular'

import { SessionProvider } from "../../providers/session-provider";
import { CredPage } from '../cred/cred';

@IonicPage()
@Component({
    selector: 'splash-page',
    templateUrl: 'splash.html'
})
export class SplashPage {

    showSplash: boolean = true;
    deviceHeight:number = 0;

    constructor(public platform: Platform, public navCtrl: NavController, public toastCtrl :  ToastController,
        private sessionProvider: SessionProvider) {
        setTimeout(() => { this.hideSplash() }, 1810);
        this.deviceHeight = platform.height() - 20;
    }

    hideSplash() {
        this.sessionProvider.isTermAccepted().subscribe(val => {
            if (val == null || (val != null && val == false))
                this.showSplash = false;
            else
                this.goToLoginPage();
        });
    }

    termApproval(isAccepted : boolean) : void {
        this.sessionProvider.setTermAcceptance(isAccepted).subscribe(val => {
            if(val == null || (val != null && val == false)) {
                if(!isAccepted) {
                    let toast = this.toastCtrl.create({
                        message: 'Please accept the condition to use the app. Application would exit now.',
                        position: 'middle',
                        duration: 2000
                    });
                    toast.present();
                    setTimeout(() => {
                        this.platform.exitApp();
                    }, 2000);
                }
            } else 
                this.goToLoginPage();
        })
    }

    goToLoginPage() {
        this.navCtrl.push(CredPage);
    }
}