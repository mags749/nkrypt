import { Component } from '@angular/core'
import { Platform, IonicPage, NavController, NavParams, ModalController, ActionSheetController } from 'ionic-angular'

import { Folder } from '../../models/folder'
import { Category } from "../../models/category";

import { FilesPage } from '../files/files'
import { SettingPage } from "../setting/setting";
import { FolderModal } from '../folder-modal/foldermodal'

import { CategoryProvider } from "../../providers/category-provider";
import { FolderProvider } from '../../providers/folder-provider'
import { SessionProvider } from "../../providers/session-provider";

@IonicPage()
@Component({
    selector: 'folders-page',
    templateUrl: 'folders.html'
})
export class FoldersPage {
    categories: Array<Category>;
    items = new Array<Folder>();

    constructor(public platform: Platform, public navCtrl: NavController, public navParams: NavParams,
        public modalCtrl: ModalController, public actionSheetCtrl: ActionSheetController,
        private folderProvider: FolderProvider, public sessionProvider: SessionProvider, public categoryProvider: CategoryProvider) {
        this.navCtrl.remove(0, 1);
        this.categories = categoryProvider.getCategories();
    }

    ionViewWillEnter() {
        this.folderProvider.loadFolders().subscribe(val => {
            if (val != null) {
                this.items = val;
                this.categories = this.categoryProvider.getCategories();
                this.folderProvider.setFolders(this.items);
            }
            if (this.items == null || this.items.length == 0)
                this.openCreateModal();
        });
    }

    ionViewDidLoad() {
        this.items = this.folderProvider.getFolders();
        this.categories = this.categoryProvider.getCategories();
    }

    ionViewWillLeave() {
        this.categories = new Array<Category>();
    }

    openCreateModal() {
        this.modalCtrl.create(FolderModal, { 'shouldEdit': false }).present();
    }

    goToFiles(folder: string) {
        this.navCtrl.push(FilesPage, { folder })
    }

    categoryPresent(category: string): boolean {
        this.items = this.folderProvider.getFolders();
        let list = this.items.filter((folder) => {
            return folder.category == category;
        });
        return list.length > 0;
    }

    filterByCategory(category: string): Array<Folder> {
        this.items = this.folderProvider.getFolders();
        let list = this.items.filter((folder) => {
            return folder.category == category;
        });
        return list;
    }

    presentActionSheet() {
        let actionSheet = this.actionSheetCtrl.create({
            buttons: [
                {
                    text: 'Create Folder',
                    icon: !this.platform.is('ios') ? 'add-circle' : null,
                    handler: () => {
                        this.openCreateModal()
                    }
                },
                {
                    text: 'Setting',
                    icon: !this.platform.is('ios') ? 'settings' : null,
                    handler: () => {
                        this.navCtrl.push(SettingPage);
                    }
                },
                {
                    text: 'Cancel',
                    role: 'cancel', // will always sort to be on the bottom
                    icon: !this.platform.is('ios') ? 'close-circle' : null,
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                }
            ]
        });
        actionSheet.present();
    }

    editFolder(folderName: string): void {
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].name == folderName) {
                let folder = this.items[i];
                this.modalCtrl.create(FolderModal, { 'folder': folder, 'shouldEdit': true, 'indexToEdit': i }).present();
            }
        }
    }
}