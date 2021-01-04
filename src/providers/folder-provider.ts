import { Injectable } from '@angular/core';
import { Storage } from "@ionic/storage";
import { Observable } from "rxjs/Rx";

import { Folder } from '../models/folder';
import { File } from '../models/file';

@Injectable()
export class FolderProvider {

    static userData: string = 'user_data'

    folders: Array<Folder> = new Array<Folder>();

    constructor(public storage: Storage) {
    }

    loadFolders(): Observable<any> {
        return Observable.fromPromise(this.storage.get(FolderProvider.userData));
    }

    getFolders(): Array<Folder> {
        return this.folders;
    }

    setFolders(folders: Array<Folder>): void {
        this.folders = folders;
    }

    addFolder(folder: Folder): Observable<any> {
        this.folders.push(folder);
        return Observable.fromPromise(this.storage.set(FolderProvider.userData, this.folders));
    }

    removeFolder(folderName: string): Observable<any> {
        let newFolders = this.folders.filter((fldr) => {
            return fldr.name != folderName;
        })
        this.folders = newFolders;
        return Observable.fromPromise(this.storage.set(FolderProvider.userData, this.folders));
    }

    getFiles(folderName: string): Array<File> {
        for (let i = 0; i < this.folders.length; i++)
            if (this.folders[i].name == folderName) {
                if (typeof this.folders[i].files == 'undefined')
                    this.folders[i].files = new Array<File>();
                return this.folders[i].files;
            }
        return new Array<File>();
    }

    addFile(file: File, folderName: string): Observable<any> {
        for (let i = 0; i < this.folders.length; i++)
            if (this.folders[i].name == folderName) {
                if (typeof this.folders[i].files == 'undefined')
                    this.folders[i].files = new Array<File>();
                this.folders[i].files.push(file);
                break;
            }
        return Observable.fromPromise(this.storage.set(FolderProvider.userData, this.folders));
    }

    replaceFile(file: File, folderName: string, index: number): Observable<any> {
        for (let i = 0; i < this.folders.length; i++)
            if (this.folders[i].name == folderName) {
                this.folders[i].files[index] = file;
                break;
            }

        return Observable.fromPromise(this.storage.set(FolderProvider.userData, this.folders));
    }

    replaceFolder(folder: Folder, index: number): Observable<any> {
        this.folders[index] = folder;
        return Observable.fromPromise(this.storage.set(FolderProvider.userData, this.folders));
    }

    replaceFolders(folders: Array<Folder>): Observable<any> {
        this.setFolders(folders);
        return Observable.fromPromise(this.storage.set(FolderProvider.userData, this.folders));
    }

    removeFile(folderName: string, index: number): Observable<any> {
        for (let i = 0; i < this.folders.length; i++) {
            if (this.folders[i].name == folderName) {
                this.folders[i].files.splice(index, 1);
                break;
            }
        }
        return Observable.fromPromise(this.storage.set(FolderProvider.userData, this.folders));
    }

    checkFolder(folderName: string): boolean {
        for (let folder of this.folders)
            if (folder.name.trim().toLowerCase() == folderName.trim().toLowerCase())
                return true;
        return false;
    }

    checkFile(folderName: string, fileName: string): boolean {
        for (let folder of this.folders)
            if (folder.name.trim().toLowerCase() == folderName.trim().toLowerCase())
                if (typeof folder.files != 'undefined')
                    for (let file of folder.files)
                        if (file.key.trim().toLowerCase() == fileName.trim().toLowerCase())
                            return true;
        return false;
    }
}
