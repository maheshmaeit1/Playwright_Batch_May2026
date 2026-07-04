# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: loginTest.spec.ts >> Login test case for app
- Location: tests\loginTest.spec.ts:17:5

# Error details

```
Test timeout of 30000ms exceeded while running "beforeEach" hook.
```

```
Error: page.goto: Test timeout of 30000ms exceeded.
Call log:
  - navigating to "https://demowebshop.tricentis.com/login", waiting until "load"

```

# Test source

```ts
  1  | import {test as base} from "@playwright/test";
  2  | 
  3  | const test = base.extend({});
  4  | 
  5  | test.beforeEach("Before Test Case",async({page})=>{
> 6  |      await page.goto("https://demowebshop.tricentis.com/login");
     |                 ^ Error: page.goto: Test timeout of 30000ms exceeded.
  7  | });
  8  | 
  9  | test.afterEach("After Test Case",async({page}, testInfo) => {
  10 |     // If test fails then take screenshot
  11 |     // testInfo : Object has a metadata about the test [testExecutiontime, testcasename, test]
  12 | 
  13 |     if(testInfo.status === 'failed'){
  14 |         await page.screenshot(
  15 |             {
  16 |                 path : `target/screenshot/${testInfo.title}.png`,
  17 |                 fullPage: true
  18 |             }
  19 |         )
  20 |     }
  21 | });
  22 | 
  23 | export {test};
  24 | 
```