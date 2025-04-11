export class Order {
    id: number;
    productId: number;
    quantity: number;
    userId: number;
    createdAt: any;

    logOrderInfos(): void {
        console.log(this.id + " " + this.productId + " " + this.quantity + " " + this.userId + " " + this.createdAt);
    }

    constructor(id: number, productId: number, quantity: number, userId: number, createdAt: any) {
        this.id = id;
        this.productId = productId;
        this.quantity = quantity;
        this.userId = userId;
        this.createdAt = createdAt;
    }
}