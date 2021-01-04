import { Component } from '@angular/core'
import { Platform, ViewController, ToastController, NavParams } from 'ionic-angular'
import { Clipboard } from "@ionic-native/clipboard";

@Component({
    selector: 'content-page',
    templateUrl: 'content.html'
})
export class ContentPage {
    showInfo: boolean = true;

    constructor(public platform: Platform, public viewCtrl: ViewController, public toastCtrl: ToastController, 
        public clipboard: Clipboard, public navParams: NavParams) {
        this.showInfo = navParams.get('showInfo');
    }

    copyContent(): void {
        this.clipboard.copy('yogiraj.pujari@gmail.com');
        let toast = this.toastCtrl.create({
            message: 'Email address copied to clipboard',
            position: 'middle',
            duration: 2000
        });
        toast.present();
    }
}