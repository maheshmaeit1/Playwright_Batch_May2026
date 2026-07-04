import { Locator, Page } from "@playwright/test";

export class ProductDetailsPage{
    readonly page:Page;
    private readonly addToCartButton:Locator;

    constructor(pageFromTest:Page){
        this.page = pageFromTest;
        this.addToCartButton = this.page.locator("//div[@class='add-to-cart']//input[@value = 'Add to cart']");
    }

    async clickOnAddtoCart(){
        await this.addToCartButton.click();
    }
    
}