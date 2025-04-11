export class Product {
    id: number;
    name: string;
    stock: number;
    

    logProductInfos(): void {
        console.log(this.id + " " + this.name + " " + this.stock + " " );
    }

    constructor(id: number, name: string, stock: number) {
        this.id = id;
        this.name = name;
        this.stock = stock;
       
    }
}