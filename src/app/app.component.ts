import { Component, ViewChild } from '@angular/core';
import { Platform, ModalController, Nav } from 'ionic-angular';
import { StatusBar } from "@ionic-native/status-bar";

import { SplashPage } from "../pages/splash/splash";

import { SessionProvider } from "../providers/session-provider";

@Component({
  templateUrl: 'app.html',
  providers: []
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;

  constructor(public platform: Platform, public modalCtrl: ModalController, public statusBar: StatusBar,
              private sessionProvider: SessionProvider) {
    if (this.platform.is('ios'))
      this.statusBar.overlaysWebView(false);
    this.statusBar.backgroundColorByHexString('#FDFEFF');
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.sessionProvider.getUserCred().subscribe(val => {
        if (val != null)
          this.sessionProvider.key = val;
        this.rootPage = SplashPage;
      });
    });
  }
}