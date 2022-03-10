const puppeteer = require("puppeteer");
const router = require("express").Router();
const hbs = require("handlebars");
const path = require("path");
const fs = require("fs-extra");
const test = {
  department: "Electrical & Electronics Engineering",
  name: "EEL201",
  semester: "6",
  statslist: [
    { rollno: "BT19EEE068", totAbsentee: 0, totPresentee: 3 },
    { rollno: "BT19EEE069", totAbsentee: 2, totPresentee: 1 },
    { rollno: "BT19EEE070", totAbsentee: 0, totPresentee: 3 },
  ],
};
const complile = async (tmp, data) => {
  const tmppath = path.join(process.cwd(), "templates", `${tmp}.hbs`);
  const html = await fs.readFile(tmppath, "utf-8");
  return hbs.compile(html)(data);
};
const getPdf = async () => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const content = await complile("attendance", test);
    await page.setContent(content);
    // await page.emulate()
    await page.pdf({
      path: "test.pdf",
      format: "A4",
      printBackground: true,
      margin: {
        top: "32px",
        bottom: "32px",
        right: "16px",
        left: "16px",
      },
    });
    console.log("Generated pdf successfully");
    await browser.close();
    process.exit();
  } catch (error) {
    console.log(error);
  }
};
getPdf();
router.get();
