import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { BrowserModule } from "@angular/platform-browser";
import { IonicApp, IonicModule } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';

import { Clipboard } from "@ionic-native/clipboard";
import { StatusBar } from "@ionic-native/status-bar";

import { MyApp } from './app.component';

import { SplashPage } from "../pages/splash/splash";
import { FoldersPage } from "../pages/folders/folders";
import { FilesPage } from "../pages/files/files";
import { CredPage } from "../pages/cred/cred";
import { SettingPage } from "../pages/setting/setting";
import { ContentPage } from "../pages/content/content";
import { FolderModal } from "../pages/folder-modal/foldermodal";
import { FileModal } from "../pages/file-modal/filemodal";

import { FolderProvider } from "../providers/folder-provider";
import { SessionProvider } from "../providers/session-provider";
import { CryptProvider } from "../providers/crypt-provider";
import { CategoryProvider } from "../providers/category-provider";

@NgModule({
  declarations: [
    MyApp,
    FoldersPage,
    FilesPage,
    CredPage,
    FolderModal,
    FileModal,
    SplashPage,
    SettingPage,
    ContentPage
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    BrowserModule,
    HttpModule,
    IonicStorageModule.forRoot({
      name: 'kryptdb',
      driverOrder: [
        'sqlite',
        'indexdb',
        'websql'
      ]
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    FoldersPage,
    FilesPage,
    CredPage,
    FolderModal,
    FileModal,
    SplashPage,
    SettingPage,
    ContentPage
  ],
  providers: [
    FolderProvider,
    SessionProvider,
    CryptProvider,
    CategoryProvider,
    Clipboard,
    StatusBar
  ]
})
export class AppModule { }
