import { Injectable } from "@angular/core";
import { Category } from "../models/category";

@Injectable()
export class CategoryProvider {
    categories: Array<Category> = new Array<Category>();

    constructor() {
        
    }

    getCategories(): Array<Category> {
        this.categories = new Array<Category>()
        this.categories.push(new Category("GNR","General"));
        this.categories.push(new Category("APP","Apps"));
        this.categories.push(new Category("BNK","Bank"));
        this.categories.push(new Category("CRD","Card"));
        this.categories.push(new Category("SHP","Shopping"));
        this.categories.push(new Category("SCL","Social"));
        this.categories.push(new Category("WRK","Work"));
        return this.categories; 
    }
}