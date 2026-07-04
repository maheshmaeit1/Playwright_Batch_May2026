import { Locator, Page } from "@playwright/test";

export class HomePage{
    readonly page:Page;
    private readonly emailLabel:Locator;
    readonly logoutLink:Locator;
    readonly searchInput:Locator;
    readonly searchButton:Locator;
    readonly searchResultsList:Locator;
 
    constructor(pageFromTest:Page){
        this.page = pageFromTest;
        this.emailLabel = this.page.locator('.header-links .account');
        this.logoutLink = this.page.getByRole('link', {name : 'Log out'});
        this.searchInput = this.page.locator('//input[@id="small-searchterms"]');
        this.searchButton = this.page.locator('.button-1.search-box-button');
        this.searchResultsList=this.page.locator('.product-grid .product-item');
    }
    
    // Getter [fetch the value of veriable] and Setter [set the value of veriable] methods
    get emailLabelLocator(){
        return this.emailLabel;
    }
   
    async logout(){
        if(await this.logoutLink.isVisible()){
            await this.logoutLink.click();
        }else{
            console.log("Logout link not displayed, skipping logout");
        }
    }

    async searchForKeyword(searchKeyword:string){
       await this.searchInput.fill(searchKeyword);
       await this.searchButton.click();
    }

    async clickOnProductFromSearchResults(productName:string){
        const addToCartLoc=`//a[text()='${productName}']/parent::h2/following-sibling::div//input`;
        this.page.locator(addToCartLoc).click();
    }

}