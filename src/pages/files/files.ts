import { Component, ViewChild } from '@angular/core'
import { Platform, IonicPage, NavParams, ModalController, ToastController, ActionSheetController, Content, AlertController } from 'ionic-angular'
import { Clipboard } from "@ionic-native/clipboard";

import { File } from '../../models/file'

import { FileModal } from '../file-modal/filemodal'

import { FolderProvider } from '../../providers/folder-provider';
import { SessionProvider } from '../../providers/session-provider'
import { CryptProvider } from "../../providers/crypt-provider";

@IonicPage()
@Component({
    selector: 'files-page',
    templateUrl: 'files.html'
})
export class FilesPage {
    @ViewChild(Content) content: Content;
    encKey: string = '';
    folderName: string;
    showPwd: boolean = false;
    contentValue: string = '';
    items = new Array<File>();
    copyVal: boolean = false;

    constructor(public platform: Platform, public navParams: NavParams, public modalCtrl: ModalController, public clipboard: Clipboard,
        public toastCtrl: ToastController, public actionSheetCtrl: ActionSheetController, public alertCtrl: AlertController,
        private folderProvider: FolderProvider, private sessionProvider: SessionProvider, private cryptProvider: CryptProvider) {
        this.folderName = navParams.get('folder');
    }

    ionViewDidLoad(): void {
        this.items = this.folderProvider.getFiles(this.folderName);
        if (this.items.length == 0)
            this.openFileModal();
    }

    openFileModal(): void {
        this.modalCtrl.create(FileModal, { 'folder': this.folderName, 'shouldEdit': false }).present();
    }

    showEncValue(item: File): void {
        this.encKey = item.encValue;
        this.promptPassword();
    }

    presentActionSheet() {
        let actionSheet = this.actionSheetCtrl.create({
            buttons: [
                {
                    text: 'Create File',
                    icon: !this.platform.is('ios') ? 'add-circle' : null,
                    handler: () => {
                        this.openFileModal()
                    }
                },
                {
                    text: 'Cancel',
                    role: 'cancel',
                    icon: !this.platform.is('ios') ? 'close-circle' : null,
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                }
            ]
        });
        actionSheet.present();
    }

    editFile(index: number): void {
        this.modalCtrl.create(FileModal, { 'folder': this.folderName, 'shouldEdit': true, 'indexToEdit': index }).present();
    }

    copyValue(item: File): void {
        this.copyVal = true;
        this.encKey = item.encValue;
        this.promptPassword();
    }

    promptPassword(): void {
        let alert = this.alertCtrl.create({
            title: 'Pass Key',
            message: 'Enter pass key to proceed',
            inputs: [
                {
                    name: 'passkey',
                    type: 'password',
                    placeholder: 'Pass Key'
                }
            ],
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: data => {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: this.copyVal ? 'Copy' : 'Show',
                    handler: data => {
                        if (typeof data.passkey == 'undefined' || data.passkey.length == 0) {
                            let toast = this.toastCtrl.create({
                                message: 'Please enter the Key',
                                position: 'middle',
                                duration: 2000
                            });
                            toast.present();
                            return false;
                        } else if (data.passkey == this.sessionProvider.key) {
                            this.contentValue = this.cryptProvider.decrypt(data.passkey, this.encKey);
                            if (!this.copyVal) {
                                this.showPwd = true;
                                let yOffset = document.getElementById('vlInfo').offsetTop;
                                this.content.scrollTo(0, yOffset, 1000);
                                setTimeout(() => {
                                    this.showPwd = false;
                                    this.contentValue = '';
                                }, 2000);
                            } else {
                                this.clipboard.copy(this.contentValue);
                                this.contentValue = '';
                                this.copyVal = false;
                                let toast = this.toastCtrl.create({
                                    message: 'Password ready to paste.',
                                    position: 'middle',
                                    duration: 2000
                                });
                                toast.present();
                            }
                        } else {
                            let toast = this.toastCtrl.create({
                                message: 'Key entered is wrong',
                                position: 'middle',
                                duration: 2000
                            });
                            toast.present();
                        }
                        this.encKey = '';
                    }
                }
            ]
        });
        alert.present();
    }
}