// This is login page class for my first page object
// Login to Application =>  function for login
// Reset Password =>
// New user Registration

import { Locator, Page } from "@playwright/test";

export class LoginPage{
    readonly page:Page;
    readonly emailInputField:Locator;
    readonly passwordInputField:Locator;
    readonly loginButton : Locator;

    constructor(pageFromTest : Page){
        this.page = pageFromTest;
        this.emailInputField =  this.page.locator('#Email');
        this.passwordInputField = this.page.locator('#Password');
        this.loginButton = this.page.locator('.button-1.login-button');  
    }

    /**
     * Function is to open the application and login
     */
    async loginToApp(userName:string, password:string){
        await this.emailInputField.fill(userName);
        await this.passwordInputField.fill(password);
        await this.loginButton.click();
    }

    async resetPassword(){
        
    }

    async registerUser(){
        
    }

}


