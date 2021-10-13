const puppeteer = require("puppeteer");
var log4js = require("log4js");
log4js.configure({
  appenders: { cheese: { type: "file", filename: "log/debug.log" } },
  categories: { default: { appenders: ["cheese"], level: "debug" } },
});
var logger = log4js.getLogger("cheese");

var loginURL = "http://www.albaji-academy.com/Login";
var presenceURL = "http://www.albaji-academy.com/Espace-Etudiant/Presence/";

(async () => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(loginURL);
    await page.waitForSelector("#login-form-username");
    logger.debug("Current URL : " + page.url());
    await page.screenshot({ path: "./screenshot1.png", fullPage: true });

    await page.type("#login-form-username", "armachi.mehdi@gmail.com");
    await page.type("#login-form-password", "16199.Mehdiway");
    console.log("filled form...");
    logger.debug("filled form...");
    await page.screenshot({ path: "./screenshot2.png", fullPage: true });

    logger.debug("1");
    await page.click("#submit-button");
    logger.debug("2");

    await page.waitForSelector("a.si-facebook");
    logger.debug("3");
    logger.debug("Current URL : " + page.url());
    logger.debug("4");
    await page.screenshot({ path: "./screenshot3.png", fullPage: true });
    logger.debug("5");
    await page.goto(presenceURL);
    logger.debug("6");
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

      await page.screenshot({ path: "./screenshot5.png", fullPage: true });
      await page.click("#submit-form");
    } else {
      logger.debug("Number of options : " + nbOfOptions + ". Exiting.");

      await page.screenshot({ path: "./screenshot6.png", fullPage: true });
    }

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
