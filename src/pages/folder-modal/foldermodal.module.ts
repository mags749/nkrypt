import { NgModule } from '@angular/core'
import { IonicPageModule } from 'ionic-angular'
import { FolderModal } from './foldermodal'

@NgModule({
    declarations: [
        FolderModal
    ],
    imports: [
        IonicPageModule.forChild(FolderModal)
    ]
})
export class FolderModalModule { }