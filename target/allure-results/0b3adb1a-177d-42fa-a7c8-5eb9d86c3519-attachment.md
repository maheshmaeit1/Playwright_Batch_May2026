# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: loginTest.spec.ts >> Login test case for app -1
- Location: tests\loginTest.spec.ts:30:5

# Error details

```
Error: A snapshot doesn't exist at C:\Users\mahes\Desktop\NeuralQA\Playwright_Batch_27_April\Wokspace\Playwright_POM_Framework\tests\loginTest.spec.ts-snapshots\Login-test-case-for-app--1-1-firefox-win32.png, writing actual.
```

# Page snapshot

```yaml
- generic [ref=e2]:
  - generic [ref=e3]:
    - generic [ref=e4]:
      - link "Tricentis Demo Web Shop" [ref=e6] [cursor=pointer]:
        - /url: /
        - img "Tricentis Demo Web Shop" [ref=e7]
      - list [ref=e10]:
        - listitem [ref=e11]:
          - link "Register" [ref=e12] [cursor=pointer]:
            - /url: /register
        - listitem [ref=e13]:
          - link "Log in" [ref=e14] [cursor=pointer]:
            - /url: /login
        - listitem [ref=e15]:
          - link "Shopping cart (0)" [ref=e16] [cursor=pointer]:
            - /url: /cart
            - generic [ref=e17]: Shopping cart
            - generic [ref=e18]: (0)
        - listitem [ref=e19]:
          - link "Wishlist (0)" [ref=e20] [cursor=pointer]:
            - /url: /wishlist
            - generic [ref=e21]: Wishlist
            - generic [ref=e22]: (0)
      - generic [ref=e24]:
        - textbox [ref=e25]: Search store
        - button "Search" [ref=e26] [cursor=pointer]
    - list [ref=e28]:
      - listitem [ref=e29]:
        - link "Books" [ref=e30] [cursor=pointer]:
          - /url: /books
      - listitem [ref=e31]:
        - link "Computers" [ref=e32] [cursor=pointer]:
          - /url: /computers
      - listitem [ref=e33]:
        - link "Electronics" [ref=e34] [cursor=pointer]:
          - /url: /electronics
      - listitem [ref=e35]:
        - link "Apparel & Shoes" [ref=e36] [cursor=pointer]:
          - /url: /apparel-shoes
      - listitem [ref=e37]:
        - link "Digital downloads" [ref=e38] [cursor=pointer]:
          - /url: /digital-downloads
      - listitem [ref=e39]:
        - link "Jewelry" [ref=e40] [cursor=pointer]:
          - /url: /jewelry
      - listitem [ref=e41]:
        - link "Gift Cards" [ref=e42] [cursor=pointer]:
          - /url: /gift-cards
    - generic:
      - generic [ref=e43]:
        - generic [ref=e44]:
          - strong [ref=e46]: Categories
          - list [ref=e48]:
            - listitem [ref=e49]:
              - link "Books" [ref=e50] [cursor=pointer]:
                - /url: /books
            - listitem [ref=e51]:
              - link "Computers" [ref=e52] [cursor=pointer]:
                - /url: /computers
            - listitem [ref=e53]:
              - link "Electronics" [ref=e54] [cursor=pointer]:
                - /url: /electronics
            - listitem [ref=e55]:
              - link "Apparel & Shoes" [ref=e56] [cursor=pointer]:
                - /url: /apparel-shoes
            - listitem [ref=e57]:
              - link "Digital downloads" [ref=e58] [cursor=pointer]:
                - /url: /digital-downloads
            - listitem [ref=e59]:
              - link "Jewelry" [ref=e60] [cursor=pointer]:
                - /url: /jewelry
            - listitem [ref=e61]:
              - link "Gift Cards" [ref=e62] [cursor=pointer]:
                - /url: /gift-cards
        - generic [ref=e63]:
          - strong [ref=e65]: Manufacturers
          - list [ref=e67]:
            - listitem [ref=e68]:
              - link "Tricentis" [ref=e69] [cursor=pointer]:
                - /url: /tricentis
        - generic [ref=e70]:
          - strong [ref=e72]: Popular tags
          - generic [ref=e73]:
            - list [ref=e75]:
              - listitem [ref=e76]:
                - link "apparel" [ref=e77] [cursor=pointer]:
                  - /url: /producttag/4/apparel
              - listitem [ref=e78]:
                - link "awesome" [ref=e79] [cursor=pointer]:
                  - /url: /producttag/8/awesome
              - listitem [ref=e80]:
                - link "book" [ref=e81] [cursor=pointer]:
                  - /url: /producttag/10/book
              - listitem [ref=e82]:
                - link "camera" [ref=e83] [cursor=pointer]:
                  - /url: /producttag/13/camera
              - listitem [ref=e84]:
                - link "cell" [ref=e85] [cursor=pointer]:
                  - /url: /producttag/12/cell
              - listitem [ref=e86]:
                - link "compact" [ref=e87] [cursor=pointer]:
                  - /url: /producttag/9/compact
              - listitem [ref=e88]:
                - link "computer" [ref=e89] [cursor=pointer]:
                  - /url: /producttag/6/computer
              - listitem [ref=e90]:
                - link "cool" [ref=e91] [cursor=pointer]:
                  - /url: /producttag/3/cool
              - listitem [ref=e92]:
                - link "digital" [ref=e93] [cursor=pointer]:
                  - /url: /producttag/16/digital
              - listitem [ref=e94]:
                - link "jeans" [ref=e95] [cursor=pointer]:
                  - /url: /producttag/14/jeans
              - listitem [ref=e96]:
                - link "jewelry" [ref=e97] [cursor=pointer]:
                  - /url: /producttag/11/jewelry
              - listitem [ref=e98]:
                - link "nice" [ref=e99] [cursor=pointer]:
                  - /url: /producttag/1/nice
              - listitem [ref=e100]:
                - link "shirt" [ref=e101] [cursor=pointer]:
                  - /url: /producttag/5/shirt
              - listitem [ref=e102]:
                - link "shoes" [ref=e103] [cursor=pointer]:
                  - /url: /producttag/7/shoes
              - listitem [ref=e104]:
                - link "TCP" [ref=e105] [cursor=pointer]:
                  - /url: /producttag/19/tcp
            - link "View all" [ref=e107] [cursor=pointer]:
              - /url: /producttag/all
      - generic [ref=e108]:
        - generic [ref=e109]:
          - strong [ref=e111]: Newsletter
          - generic [ref=e113]:
            - text: "Sign up for our newsletter:"
            - textbox [ref=e115]
            - button "Subscribe" [ref=e117] [cursor=pointer]
        - generic [ref=e118]:
          - strong [ref=e120]: Community poll
          - generic [ref=e122]:
            - strong [ref=e123]: Do you like nopCommerce?
            - list [ref=e124]:
              - listitem [ref=e125]:
                - radio "Excellent" [ref=e126]
                - text: Excellent
              - listitem [ref=e127]:
                - radio "Good" [ref=e128]
                - text: Good
              - listitem [ref=e129]:
                - radio "Poor" [ref=e130]
                - text: Poor
              - listitem [ref=e131]:
                - radio "Very bad" [ref=e132]
                - text: Very bad
            - button "Vote" [ref=e134] [cursor=pointer]
      - generic [ref=e137]:
        - generic:
          - generic:
            - link:
              - /url: https://www.tricentis.com/speed/
            - link:
              - /url: https://academy.tricentis.com
        - generic [ref=e138]:
          - heading "Welcome to our store" [level=2] [ref=e140]
          - generic [ref=e141]:
            - paragraph [ref=e142]: Welcome to the new Tricentis store!
            - paragraph [ref=e143]: Feel free to shop around and explore everything.
        - generic [ref=e144]:
          - strong [ref=e146]: Featured products
          - generic [ref=e148]:
            - link "Picture of $25 Virtual Gift Card" [ref=e150] [cursor=pointer]:
              - /url: /25-virtual-gift-card
              - img "Picture of $25 Virtual Gift Card" [ref=e151]
            - generic [ref=e152]:
              - heading "$25 Virtual Gift Card" [level=2] [ref=e153]:
                - link "$25 Virtual Gift Card" [ref=e154] [cursor=pointer]:
                  - /url: /25-virtual-gift-card
              - generic "911 review(s)" [ref=e155]
              - generic [ref=e158]:
                - generic [ref=e160]: "25.00"
                - button "Add to cart" [ref=e162] [cursor=pointer]
          - generic [ref=e164]:
            - link "Picture of 14.1-inch Laptop" [ref=e166] [cursor=pointer]:
              - /url: /141-inch-laptop
              - img "Picture of 14.1-inch Laptop" [ref=e167]
            - generic [ref=e168]:
              - heading "14.1-inch Laptop" [level=2] [ref=e169]:
                - link "14.1-inch Laptop" [ref=e170] [cursor=pointer]:
                  - /url: /141-inch-laptop
              - generic "1712 review(s)" [ref=e171]
              - generic [ref=e174]:
                - generic [ref=e176]: "1590.00"
                - button "Add to cart" [ref=e178] [cursor=pointer]
          - generic [ref=e180]:
            - link "Picture of Build your own cheap computer" [ref=e182] [cursor=pointer]:
              - /url: /build-your-cheap-own-computer
              - img "Picture of Build your own cheap computer" [ref=e183]
            - generic [ref=e184]:
              - heading "Build your own cheap computer" [level=2] [ref=e185]:
                - link "Build your own cheap computer" [ref=e186] [cursor=pointer]:
                  - /url: /build-your-cheap-own-computer
              - generic "924 review(s)" [ref=e187]
              - generic [ref=e190]:
                - generic [ref=e192]: "800.00"
                - button "Add to cart" [ref=e194] [cursor=pointer]
          - generic [ref=e196]:
            - link "Picture of Build your own computer" [ref=e198] [cursor=pointer]:
              - /url: /build-your-own-computer
              - img "Picture of Build your own computer" [ref=e199]
            - generic [ref=e200]:
              - heading "Build your own computer" [level=2] [ref=e201]:
                - link "Build your own computer" [ref=e202] [cursor=pointer]:
                  - /url: /build-your-own-computer
              - generic "432 review(s)" [ref=e203]
              - generic [ref=e206]:
                - generic [ref=e208]: "1200.00"
                - button "Add to cart" [ref=e210] [cursor=pointer]
          - generic [ref=e212]:
            - link "Picture of Build your own expensive computer" [ref=e214] [cursor=pointer]:
              - /url: /build-your-own-expensive-computer-2
              - img "Picture of Build your own expensive computer" [ref=e215]
            - generic [ref=e216]:
              - heading "Build your own expensive computer" [level=2] [ref=e217]:
                - link "Build your own expensive computer" [ref=e218] [cursor=pointer]:
                  - /url: /build-your-own-expensive-computer-2
              - generic "440 review(s)" [ref=e219]
              - generic [ref=e222]:
                - generic [ref=e224]: "1800.00"
                - button "Add to cart" [ref=e226] [cursor=pointer]
          - generic [ref=e228]:
            - link "Picture of Simple Computer" [ref=e230] [cursor=pointer]:
              - /url: /simple-computer
              - img "Picture of Simple Computer" [ref=e231]
            - generic [ref=e232]:
              - heading "Simple Computer" [level=2] [ref=e233]:
                - link "Simple Computer" [ref=e234] [cursor=pointer]:
                  - /url: /simple-computer
              - generic "399 review(s)" [ref=e235]
              - generic [ref=e238]:
                - generic [ref=e240]: "800.00"
                - button "Add to cart" [ref=e242] [cursor=pointer]
  - generic [ref=e243]:
    - generic [ref=e244]:
      - generic [ref=e245]:
        - heading "Information" [level=3] [ref=e246]
        - list [ref=e247]:
          - listitem [ref=e248]:
            - link "Sitemap" [ref=e249] [cursor=pointer]:
              - /url: /sitemap
          - listitem [ref=e250]:
            - link "Shipping & Returns" [ref=e251] [cursor=pointer]:
              - /url: /shipping-returns
          - listitem [ref=e252]:
            - link "Privacy Notice" [ref=e253] [cursor=pointer]:
              - /url: /privacy-policy
          - listitem [ref=e254]:
            - link "Conditions of Use" [ref=e255] [cursor=pointer]:
              - /url: /conditions-of-use
          - listitem [ref=e256]:
            - link "About us" [ref=e257] [cursor=pointer]:
              - /url: /about-us
          - listitem [ref=e258]:
            - link "Contact us" [ref=e259] [cursor=pointer]:
              - /url: /contactus
      - generic [ref=e260]:
        - heading "Customer service" [level=3] [ref=e261]
        - list [ref=e262]:
          - listitem [ref=e263]:
            - link "Search" [ref=e264] [cursor=pointer]:
              - /url: /search
          - listitem [ref=e265]:
            - link "News" [ref=e266] [cursor=pointer]:
              - /url: /news
          - listitem [ref=e267]:
            - link "Blog" [ref=e268] [cursor=pointer]:
              - /url: /blog
          - listitem [ref=e269]:
            - link "Recently viewed products" [ref=e270] [cursor=pointer]:
              - /url: /recentlyviewedproducts
          - listitem [ref=e271]:
            - link "Compare products list" [ref=e272] [cursor=pointer]:
              - /url: /compareproducts
          - listitem [ref=e273]:
            - link "New products" [ref=e274] [cursor=pointer]:
              - /url: /newproducts
      - generic [ref=e275]:
        - heading "My account" [level=3] [ref=e276]
        - list [ref=e277]:
          - listitem [ref=e278]:
            - link "My account" [ref=e279] [cursor=pointer]:
              - /url: /customer/info
          - listitem [ref=e280]:
            - link "Orders" [ref=e281] [cursor=pointer]:
              - /url: /customer/orders
          - listitem [ref=e282]:
            - link "Addresses" [ref=e283] [cursor=pointer]:
              - /url: /customer/addresses
          - listitem [ref=e284]:
            - link "Shopping cart" [ref=e285] [cursor=pointer]:
              - /url: /cart
          - listitem [ref=e286]:
            - link "Wishlist" [ref=e287] [cursor=pointer]:
              - /url: /wishlist
      - generic [ref=e288]:
        - heading "Follow us" [level=3] [ref=e289]
        - list [ref=e290]:
          - listitem [ref=e291]:
            - link "Facebook" [ref=e292] [cursor=pointer]:
              - /url: http://www.facebook.com/nopCommerce
          - listitem [ref=e293]:
            - link "Twitter" [ref=e294] [cursor=pointer]:
              - /url: https://twitter.com/nopCommerce
          - listitem [ref=e295]:
            - link "RSS" [ref=e296] [cursor=pointer]:
              - /url: /news/rss/1
          - listitem [ref=e297]:
            - link "YouTube" [ref=e298] [cursor=pointer]:
              - /url: http://www.youtube.com/user/nopCommerce
          - listitem [ref=e299]:
            - link "Google+" [ref=e300] [cursor=pointer]:
              - /url: https://plus.google.com/+nopcommerce
    - generic [ref=e301]:
      - text: Powered by
      - link "nopCommerce" [ref=e302] [cursor=pointer]:
        - /url: http://www.nopcommerce.com/
    - generic [ref=e303]: Copyright © 2026 Tricentis Demo Web Shop. All rights reserved.
```

# Test source

```ts
  1  | import { LoginPage } from '../pages/LoginPage';
  2  | import { HomePage } from '../pages/HomePage';
  3  | 
  4  | // Importing Json file for users login data : default import
  5  | import data from "../data/userLogin.json";
  6  | import {test} from "../hooks/hooks.ts";
  7  | import { expect } from '@playwright/test';
  8  | 
  9  | // Annotation => hooks in playwright
  10 | /**
  11 |  * 1. BeforeAll : Executes once before all testcases
  12 |  * 2. BeforeEach : Executes before every testcase
  13 |  * 3. Test : 
  14 |  * 4. AfterEach : Executes after every testcase
  15 |  * 5. AfterAll : Executes once after all testcases
  16 | */
  17 | test("Login test case for app", async({page}) =>{
  18 |     const loginPageObj = new LoginPage(page);
  19 |     await loginPageObj.loginToApp(data.users[0].username, data.users[0].password);
  20 |     await expect(page).toHaveURL("https://demowebshop.tricentis.com/");
  21 |     const homePage = new HomePage(page);
  22 |     await expect(homePage.emailLabelLocator).toHaveText(data.users[0].username);
  23 | });
  24 | 
  25 | test.afterEach("Logout",async({page}) => {
  26 |     const homePage = new HomePage(page);
  27 |     await homePage.logout();
  28 | });
  29 | 
  30 | test("Login test case for app -1", async({page}) =>{
  31 |     const loginPageObj = new LoginPage(page);
  32 |     await loginPageObj.loginToApp(data.users[0].username, data.users[0].password);
  33 |     await expect(page).toHaveURL("https://demowebshop.tricentis.com/");
  34 |     const homePage = new HomePage(page);
  35 |     await expect(homePage.emailLabelLocator).toHaveText(data.users[0].username);
> 36 |      await expect(page).toHaveScreenshot();
     |      ^ Error: A snapshot doesn't exist at C:\Users\mahes\Desktop\NeuralQA\Playwright_Batch_27_April\Wokspace\Playwright_POM_Framework\tests\loginTest.spec.ts-snapshots\Login-test-case-for-app--1-1-firefox-win32.png, writing actual.
  37 | });
  38 | 
```