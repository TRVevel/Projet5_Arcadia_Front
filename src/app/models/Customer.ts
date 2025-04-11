export class Customer {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: any;
    orders:[any];

    logOrderInfos(): void {
        console.log(this.id + " " + this.name + " " + this.email + " " + this.phone + " " + this.address + " " + this.orders);
    }

    constructor(id: number, name: string, email: string, phone: string, address: any, orders:[any]) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.address = address;
        this.orders = orders;
    }
}