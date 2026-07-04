import { LoginPage } from '../pages/LoginPage';
import { HomePage } from '../pages/HomePage';

// Importing Json file for users login data : default import
import data from "../data/userLogin.json";
import {test} from "../hooks/hooks.ts";
import { expect } from '@playwright/test';

// Annotation => hooks in playwright
/**
 * 1. BeforeAll : Executes once before all testcases
 * 2. BeforeEach : Executes before every testcase
 * 3. Test : 
 * 4. AfterEach : Executes after every testcase
 * 5. AfterAll : Executes once after all testcases
*/
test("Login test case for app", async({page}) =>{
    const loginPageObj = new LoginPage(page);
    await loginPageObj.loginToApp(data.users[0].username, data.users[0].password);
    await expect(page).toHaveURL("https://demowebshop.tricentis.com/");
    const homePage = new HomePage(page);
    await expect(homePage.emailLabelLocator).toHaveText(data.users[0].username);
});

test.afterEach("Logout",async({page}) => {
    const homePage = new HomePage(page);
    await homePage.logout();
});

test("Login test case for app -1", async({page}) =>{
    const loginPageObj = new LoginPage(page);
    await loginPageObj.loginToApp(data.users[0].username, data.users[0].password);
    await expect(page).toHaveURL("https://demowebshop.tricentis.com/");
    const homePage = new HomePage(page);
    await expect(homePage.emailLabelLocator).toHaveText(data.users[0].username);

    // Visual Assertion
   // await expect(page).toHaveScreenshot();

    const laptopImg = page.locator("(//a[@title='Show details for Build your own cheap computer']/img)[1]");
    await expect(laptopImg).toHaveScreenshot('laptopLogo-chromium-win32.png');

});
