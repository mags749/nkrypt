import { Component } from '@angular/core'
import { ViewController, ToastController, NavParams, AlertController } from 'ionic-angular'

import { Category } from "../../models/category";
import { Folder } from '../../models/folder'
import { File } from '../../models/file'

import { FolderProvider } from '../../providers/folder-provider'
import { SessionProvider } from '../../providers/session-provider'
import { CategoryProvider } from "../../providers/category-provider";

@Component({
    selector: 'folder-modal',
    templateUrl: 'foldermodal.html'
})
export class FolderModal {
    folderName: string;
    category: string = 'GNR';
    shouldEdit: boolean = false;
    indexToEdit?: number;
    files?: Array<File>;
    categories: Array<Category>;
    oriFolderName?: string;

    constructor(public viewCtrl: ViewController, public toastCtrl: ToastController, public navParams: NavParams,
        public alertCtrl: AlertController, private folderProvider: FolderProvider, private sessionProvider: SessionProvider,
        private categoryProvider: CategoryProvider) {
        this.categories = categoryProvider.getCategories();
        this.shouldEdit = navParams.get('shouldEdit');
        if (this.shouldEdit) {
            this.indexToEdit = navParams.get('indexToEdit');
            let folder: Folder = navParams.get('folder');
            this.folderName = folder.name;
            this.oriFolderName = folder.name;
            this.files = folder.files;
            this.category = folder.category;
        }
    }

    validateForm(): boolean {
        return (this.folderName == null || this.folderName == '');
    }

    addFolder(): void {
        if (!this.shouldEdit) {
            if (this.folderProvider.checkFolder(this.folderName)) {
                let alertMessage = 'Folder ' + this.folderName + ' is already present';
                let toast = this.toastCtrl.create({
                    message: alertMessage,
                    duration: 2000
                });
                toast.present();
                return;
            }
            let folder = new Folder(this.folderName, this.category);
            this.folderProvider.addFolder(folder).subscribe(val => {
                let folderAdded = false;
                if (null != val)
                    folderAdded = true;
                let alertMessage = 'Folder ' + this.folderName + ' added';
                if (!folderAdded)
                    alertMessage = 'Unable to add ' + this.folderName + ' folder';
                let toast = this.toastCtrl.create({
                    message: alertMessage,
                    duration: 2000
                });
                toast.present();
                this.dismiss();
            });
        } else {
            if(this.oriFolderName != this.folderName) {
                if (this.folderProvider.checkFolder(this.folderName)) {
                    let alertMessage = 'Folder ' + this.folderName + ' is already present';
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
                            let folder = new Folder(this.folderName, this.category);
                            folder.files = this.files;
                            this.folderProvider.replaceFolder(folder, this.indexToEdit).subscribe(val => {
                                let folderAdded = false;
                                if (null != folderAdded)
                                    folderAdded = true;
                                let alertMessage = 'Folder edited successfully';
                                if (!folderAdded)
                                    alertMessage = 'Unable to edit the folder';
                                let toast = this.toastCtrl.create({
                                    message: alertMessage,
                                    duration: 2000
                                });
                                toast.present();
                                this.dismiss();
                            });

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

    deleteConfirmation() {
        let confirmDialog = this.alertCtrl.create({
            title: 'Delete Folder',
            subTitle: ' Once the folder is deleted, all the contents of the folder would also be deleted. Are you sure you want to delete ' + this.folderName + ' folder.',
            buttons: [
                {
                    text: 'No',
                    handler: () => {
                        console.info('No button clicked');
                    }
                },
                {
                    text: 'Yes',
                    handler: () => {
                        this.deleteFolder();
                    }
                }
            ]
        });
        confirmDialog.present();
    }

    deleteFolder(): void {
        this.folderProvider.removeFolder(this.folderName).subscribe(val => {
            let folderDeleted = false;
            if (null != val)
                folderDeleted = true;
            let alertMessage = 'Folder ' + this.folderName + ' is deleted';
            if (!folderDeleted)
                alertMessage = 'Unable to delete ' + this.folderName + ' folder';
            let toast = this.toastCtrl.create({
                message: alertMessage,
                duration: 2000
            });
            toast.present();
            if (folderDeleted)
                this.dismiss();
        });
    }

    dismiss(): void {
        this.viewCtrl.dismiss();
    }
}