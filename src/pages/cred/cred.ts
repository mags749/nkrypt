import { Component } from '@angular/core'
import { IonicPage, Platform, ViewController, ToastController, NavController, NavParams, LoadingController } from 'ionic-angular'

import { SessionProvider } from '../../providers/session-provider';
import { CryptProvider } from "../../providers/crypt-provider";
import { FolderProvider } from "../../providers/folder-provider";

import { FoldersPage } from "../folders/folders";

@IonicPage()
@Component({
    selector: 'cred-page',
    templateUrl: 'cred.html'
})
export class CredPage {
    keyPhrase: string;
    rekeyPhrase: string;
    keyPass: string;
    rekeyPass: string;
    valuePresent: boolean = false;
    value?: string;
    oldKey?: string;
    showValue: boolean = false;
    changePwd: boolean = false;
    attempts: number = 0;
    oriValue?: string;

    constructor(public viewCtrl: ViewController, public platform: Platform, public toastCtrl: ToastController,
        public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController,
        private sessionProvider: SessionProvider, private cryptProvider: CryptProvider, private folderProvider: FolderProvider) {
        this.navCtrl.remove(0, 1);
        if (typeof navParams.get('changePassword') != undefined)
            this.changePwd = navParams.get('changePassword');
        if (this.sessionProvider.key != null) {
            this.valuePresent = true;
            if (this.changePwd)
                this.sessionProvider.getUserCred().subscribe((val) => {
                    this.value = val;
                    this.oriValue = val;
                });
            else
                this.value = this.sessionProvider.key;
        }
    }

    checkContent(): boolean {
        const fieldsEmpty = (this.keyPhrase == null || this.keyPhrase == '')
            || (this.rekeyPhrase == null || this.rekeyPhrase == '')
            || (this.keyPass == null || this.keyPass == '')
            || (this.rekeyPass == null || this.rekeyPass == '');
        return fieldsEmpty || this.keyPhrase != this.rekeyPhrase || this.keyPass != this.rekeyPass;
    }

    validateForm(): boolean {
        return (this.keyPhrase == null || this.keyPhrase == '')
            || (this.keyPass == null || this.keyPass == '')
    }

    showContent(): void {
        this.showValue = !this.showValue;
        setTimeout(() => {
            this.showValue = false;
        }, 3000);
    }

    ionViewWillEnter(): void {
        this.viewCtrl.showBackButton(false);
    }

    saveCredentials(): void {
        let encrypted = this.cryptProvider.encrypt(this.keyPhrase, this.keyPass);
        if (this.valuePresent) {
            if (encrypted == this.value) {
                if (!this.changePwd) {
                    this.sessionProvider.key = this.keyPass;
                    this.dismiss();
                } else {
                    this.keyPhrase = '';
                    this.oldKey = this.keyPass;
                    this.keyPass = '';
                    this.valuePresent = false;
                }
            } else {
                this.attempts++;
                let alertMessage = '';
                if (this.attempts == 1)
                    alertMessage = 'Credentials entered are wrong.';
                else if (this.attempts == 2)
                    alertMessage = 'This is last attempt. After wrong attempt, app will close.';
                else if (this.attempts == 3)
                    this.platform.exitApp();
                let toast = this.toastCtrl.create({
                    message: alertMessage,
                    duration: 2000
                });
                toast.present();
            }
        } else {
            let loading;
            if (this.changePwd) {
                if (this.oriValue == encrypted) {
                    const alertMessage = 'Please use different credentials';
                    let toast = this.toastCtrl.create({
                        message: alertMessage,
                        duration: 2000
                    });
                    toast.present();
                    return;
                }
                loading = this.loadingCtrl.create({
                    content: 'Please wait...'
                });
                loading.present();
            }
            this.sessionProvider.setUserCred(encrypted).subscribe(val => {
                if (val != null) {
                    this.sessionProvider.key = this.keyPass;
                    const alertMessage = 'Credentials saved successfully.';
                    let toast = this.toastCtrl.create({
                        message: alertMessage,
                        duration: 2000
                    });
                    if (this.changePwd) {
                        let folders = this.folderProvider.getFolders();
                        for (let folder of folders)
                            if (typeof folder.files != 'undefined')
                                for (let file of folder.files) {
                                    let pwd = this.cryptProvider.decrypt(this.oldKey, file.encValue);
                                    file.encValue = this.cryptProvider.encrypt(this.keyPass, pwd);
                                }
                        this.oldKey = '';
                        this.folderProvider.replaceFolders(folders).subscribe(newVal => {
                            if (newVal != null) {
                                loading.dismiss();
                                toast.present();
                                this.navCtrl.pop();
                            }
                        });
                    } else {
                        toast.present();
                        this.dismiss();
                    }
                }
            })
        }
    }

    dismiss(): void {
        this.navCtrl.push(FoldersPage);
    }
}