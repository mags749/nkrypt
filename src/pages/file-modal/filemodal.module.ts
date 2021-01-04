import { NgModule } from '@angular/core'
import { IonicPageModule } from 'ionic-angular'
import { FileModal } from './filemodal'

@NgModule({
    declarations: [
        FileModal
    ],
    imports: [
        IonicPageModule.forChild(FileModal)
    ]
})
export class FileModalModule { }