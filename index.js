const puppeteer = require("puppeteer");
var log4js = require("log4js");
require("dotenv").config();

log4js.configure({
  appenders: { LOG: { type: "file", filename: "log/debug.log" } },
  categories: { default: { appenders: ["LOG"], level: "debug" } },
});
var logger = log4js.getLogger("LOG");

var loginURL = "http://www.albaji-academy.com/Login";
var presenceURL = "http://www.albaji-academy.com/Espace-Etudiant/Presence/";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

(async () => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(loginURL);
    await page.waitForSelector("#login-form-username");
    logger.debug("Current URL : " + page.url());
    await page.screenshot({ path: "./screenshot1.png", fullPage: true });

    logger.debug("Filling login form...");
    console.log(
      "Filling login form...",
      process.env.ALBAJI_USERNAME,
      process.env.ALBAJI_PASSWORD
    );
    await page.type("#login-form-username", process.env.ALBAJI_USERNAME);
    await page.type("#login-form-password", process.env.ALBAJI_PASSWORD);
    await page.screenshot({ path: "./screenshot2.png", fullPage: true });

    logger.debug("Click submit button...");
    console.log("Click submit button...");
    await page.click("#submit-button");

    await page.waitForSelector("a.si-facebook");
    logger.debug("Current URL : " + page.url());
    await page.screenshot({ path: "./screenshot3.png", fullPage: true });
    logger.debug("Go to : " + presenceURL);
    await page.goto(presenceURL);
    await page.waitForSelector("#template-contactform-seance");
    logger.debug("Current URL : " + page.url());
    await page.screenshot({ path: "./screenshot4.png", fullPage: true });

    var nbOfOptions = await page.$eval(
      "#template-contactform-seance",
      (select) => select.options.length
    );
    if (nbOfOptions > 1) {
      logger.debug("Number of options : " + nbOfOptions + "");
      var optionValue = await page.$eval(
        "#template-contactform-seance",
        (select) => select.options[1].value
      );
      logger.debug("Module to select : " + optionValue);
      await page.select("#template-contactform-seance", optionValue);

      page.on("dialog", async (dialog) => {
        logger.debug("Dialog popup : " + dialog.message());
        console.log("Dialog popup : " + dialog.message());
        logger.debug("URL : " + page.url());
        console.log("URL : " + page.url());
        delay(1000);
        await dialog.dismiss();
        delay(1000);
      });

      await page.screenshot({ path: "./screenshot5.png", fullPage: true });
      await page.waitForSelector("#submit-button");
      console.log("Click submit button...");
      await Promise.all([
        page.waitForNavigation(),
        page.click("#submit-button"),
      ]);
      await page.screenshot({ path: "./screenshot6.png", fullPage: true });
    } else {
      logger.debug("Number of options : " + nbOfOptions + ". Exiting.");
      await page.screenshot({ path: "./screenshot7.png", fullPage: true });
    }

    logger.debug("Current URL : " + page.url());
    console.log("Current URL : " + page.url());
    await browser.close();
  } catch (e) {
    console.log(e);
    logger.fatal("APP CRASH");
    logger.fatal(e);
    log4js.shutdown(() => {
      process.exit(1);
    });
  }
})();
