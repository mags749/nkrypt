import { Component } from '@angular/core'
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular'

import { CredPage } from "../cred/cred";
import { ContentPage } from "../content/content";

@IonicPage()
@Component({
    selector: 'setting-page',
    templateUrl: 'setting.html'
})
export class SettingPage {

    constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController) {
    }

    ionViewWillEnter() {
    }

    ionViewDidLoad() {
    }

    changePassword() {
        this.navCtrl.push(CredPage, { 'changePassword' : true });
    }
    
    appInfo() {
        this.navCtrl.push(ContentPage, { 'showInfo' : true });
    }

    legalInfo() {
        this.navCtrl.push(ContentPage, { 'showInfo' : false });
    }
}