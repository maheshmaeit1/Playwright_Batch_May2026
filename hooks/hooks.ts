import {test as base} from "@playwright/test";

const test = base.extend({});

test.beforeEach("Before Test Case",async({page})=>{
     await page.goto("https://demowebshop.tricentis.com/login");
});

test.afterEach("After Test Case",async({page}, testInfo) => {
    // If test fails then take screenshot
    // testInfo : Object has a metadata about the test [testExecutiontime, testcasename, test]

    if(testInfo.status === 'failed'){
        await page.screenshot(
            {
                path : `target/screenshot/${testInfo.title}.png`,
                fullPage: true
            }
        )
    }
});

export {test};
