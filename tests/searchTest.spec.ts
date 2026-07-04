import {test} from "../hooks/hooks.ts";
import { LoginPage } from "../pages/LoginPage.ts";
import data from "../data/userLogin.json";
import { expect } from "@playwright/test";
import { HomePage } from "../pages/HomePage.ts";
import { ProductDetailsPage } from "../pages/ProductDetailsPage.ts";

test("Search for kwyword", async({page}) =>{
    const loginPageObj = new LoginPage(page);
    await loginPageObj.loginToApp(data.users[0].username, data.users[0].password);
    await expect(page).toHaveURL("https://demowebshop.tricentis.com/");

    const homePage = new HomePage(page);
    await homePage.searchForKeyword("Computer");
    await expect(await homePage.searchResultsList.first()).toBeVisible();
    await expect(await homePage.searchResultsList.count()).toBeGreaterThan(1);
    await homePage.clickOnProductFromSearchResults("Simple Computer");

    const productDetailsPage = new ProductDetailsPage(page);    
    await productDetailsPage.clickOnAddtoCart();

});