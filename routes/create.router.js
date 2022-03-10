const puppeteer = require("puppeteer");
const router = require("express").Router();
const hbs = require("handlebars");
const path = require("path");
const fs = require("fs-extra");

//hbs compiler for dynamic pdf
const complile = async (tmp, data) => {
  const tmppath = path.join(process.cwd(), "templates", `${tmp}.hbs`);
  const html = await fs.readFile(tmppath, "utf-8");
  return hbs.compile(html)(data);
};
hbs.registerHelper("add", (a, b) => {
  return parseInt(a) + parseInt(b);
});
hbs.registerHelper("percentage", (a, b) => {
  return parseInt((parseInt(a) / (parseInt(a) + parseInt(b))) * 100);
});
//pdf generator
const getPdf = async (data) => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const content = await complile("attendance", data);
    await page.setContent(content);
    // await page.emulate()
    await page.pdf({
      path: __dirname + "/test.pdf",
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
  } catch (error) {
    console.log(error);
  }
};
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
//api route
router.get("/", (req, res) => res.status(200).send("Method not allowed"));
router.post("/", (req, res) => {
  const data = req.body;
  try {
    getPdf(data).then(() => {
      const path = `${__dirname}\\test.pdf`;
      return res.status(200).download(path);
    });
  } catch (error) {
    console.log(error);
    return res.status(404);
  }
});
module.exports = router;
