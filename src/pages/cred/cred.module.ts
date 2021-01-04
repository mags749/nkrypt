import { NgModule } from '@angular/core'
import { IonicPageModule } from 'ionic-angular'
import { CredPage } from './cred'

@NgModule({
    declarations: [
        CredPage
    ],
    imports: [
        IonicPageModule.forChild(CredPage)
    ]
})
export class CredPageModule { }