import { Component } from '@angular/core'
import { ViewController, NavParams, ToastController, AlertController } from 'ionic-angular'

import { FolderProvider } from '../../providers/folder-provider'
import { CryptProvider } from "../../providers/crypt-provider";
import { SessionProvider } from "../../providers/session-provider";

import { File } from '../../models/file';

@Component({
    selector: 'file-modal',
    templateUrl: 'filemodal.html'
})
export class FileModal {
    folderName: string;
    fileName: string;
    encValue: string;
    showValue: boolean = false;
    shouldEdit: boolean = false;
    indexToEdit?: number = 0;
    shouldDeleteFile: boolean = false;
    oriFileName?: string;

    constructor(public viewCtrl: ViewController, public toastCtrl: ToastController, public navParams: NavParams, public alertCtrl: AlertController,
        private folderProvider: FolderProvider, private sessionProvider: SessionProvider, private cryptProvider: CryptProvider) {
        this.folderName = navParams.get('folder');
        this.shouldEdit = navParams.get('shouldEdit');
        if (this.shouldEdit)
            this.indexToEdit = navParams.get('indexToEdit');
    }

    ionViewDidLoad() {
        if (this.shouldEdit) {
            let folders = this.folderProvider.getFolders();
            for (let folder of folders) {
                if (folder.name == this.folderName) {
                    this.fileName = folder.files[this.indexToEdit].key;
                    this.oriFileName = folder.files[this.indexToEdit].key;
                    break;
                }
            }
        }
    }

    validateForm(): boolean {
        return (this.fileName == null || this.fileName == '')
            || (this.encValue == null || this.encValue == '');
    }

    showContent(): void {
        this.showValue = !this.showValue;
        setTimeout(() => {
            this.showValue = false;
        }, 3000);
    }

    addFile(): void {
        if (!this.shouldEdit) {
            if (this.folderProvider.checkFile(this.folderName, this.fileName)) {
                let alertMessage = 'File ' + this.fileName + ' is already present in ' + this.folderName + ' folder';
                let toast = this.toastCtrl.create({
                    message: alertMessage,
                    duration: 2000
                });
                toast.present();
                return;
            }
            let encrypted = this.cryptProvider.encrypt(this.sessionProvider.key, this.encValue);
            let file = new File(this.fileName, encrypted);
            this.folderProvider.addFile(file, this.folderName).subscribe(val => {
                let fileAdded = false;
                if (null != fileAdded)
                    fileAdded = true;
                let alertMessage = 'File added to folder ' + this.folderName;
                if (!fileAdded)
                    alertMessage = 'Unable to add the file to folder ' + this.folderName;
                let toast = this.toastCtrl.create({
                    message: alertMessage,
                    duration: 2000
                });
                toast.present();
                this.dismiss();
            });
        } else {
            if(this.oriFileName != this.fileName) {
                if (this.folderProvider.checkFile(this.folderName, this.fileName)) {
                    let alertMessage = 'File ' + this.fileName + ' is already present in ' + this.folderName + ' folder';
                    let toast = this.toastCtrl.create({
                        message: alertMessage,
                        duration: 2000
                    });
                    toast.present();
                    return;
                }
            }
            this.promptPassword();
        }
    }

    deleteFile(): void {
        this.shouldDeleteFile = true;
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
                    text: 'Save',
                    handler: data => {
                        if (this.sessionProvider.key == data.passkey) {
                            if (!this.shouldDeleteFile) {
                                let encrypted = this.cryptProvider.encrypt(this.sessionProvider.key, this.encValue);
                                let file = new File(this.fileName, encrypted);
                                this.folderProvider.replaceFile(file, this.folderName, this.indexToEdit).subscribe(val => {
                                    let fileAdded = false;
                                    if (null != fileAdded)
                                        fileAdded = true;
                                    let alertMessage = 'File edited successfully';
                                    if (!fileAdded)
                                        alertMessage = 'Unable to edit the file';
                                    let toast = this.toastCtrl.create({
                                        message: alertMessage,
                                        duration: 2000
                                    });
                                    toast.present();
                                    this.dismiss();
                                });
                            } else {
                                this.folderProvider.removeFile(this.folderName, this.indexToEdit).subscribe(val => {
                                    let fileRemoved = false;
                                    if (null != fileRemoved)
                                        fileRemoved = true;
                                    let alertMessage = 'File deleted successfully';
                                    if (!fileRemoved)
                                        alertMessage = 'Unable to delete the file';
                                    let toast = this.toastCtrl.create({
                                        message: alertMessage,
                                        duration: 2000
                                    });
                                    toast.present();
                                    this.dismiss();
                                });
                            }
                        } else {
                            let alertMessage = 'Pass Key entered is wrong!';
                            let toast = this.toastCtrl.create({
                                message: alertMessage,
                                duration: 2000
                            });
                            toast.present();
                            return false;
                        }
                    }
                }
            ]
        });
        alert.present();
    }

    dismiss(): void {
        this.viewCtrl.dismiss();
    }
}