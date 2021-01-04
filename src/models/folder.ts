import { File } from './file'

export class Folder {
    name: string;
    category: string;
    files?: Array<File>;

    constructor(name: string, category: string) {
        this.name = name;
        this.category = category;
    }
}