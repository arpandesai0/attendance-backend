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
// hbs.registerHelper("add", (a, b) => {
//   return parseInt(a) + parseInt(b);
// });
// hbs.registerHelper("percentage", (a, b) => {
//   return parseInt((parseInt(a) / (parseInt(a) + parseInt(b))) * 100);
// });
// hbs.registerHelper("issafe", (a, b) => {
//   const ans =
//     parseInt((parseInt(a) / (parseInt(a) + parseInt(b))) * 100) > 75
//       ? true
//       : false;
//   return ans;
// });
//pdf generator
const getPdf = async (data) => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const content = await complile("attendance", data);
    await page.setContent(content);
    // await page.emulate()
    await page.pdf({
      path: `${data.name.replace(" ", "")}.pdf`,
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
  return;
};

//api route
router.get("/", (req, res) => res.status(200).send("Method not allowed"));
router.post("/", (req, res) => {
  const data = req.body;
  for (let i = 0; i < data.statslist.length; i++) {
    const p = parseInt(data.statslist[i].totPresentee);
    const a = parseInt(data.statslist[i].totAbsentee);
    const percentage = parseInt((p / (a + p)) * 100);
    const issafe = percentage > 75 ? false : true;
    data.statslist[i].totalClasses = p + a;
    data.statslist[i].percentage = percentage;
    data.statslist[i].issafe = issafe;
  }
  try {
    getPdf(data).then(() => {
      const path = `${data.name.replace(" ", "")}.pdf`;
      return res.status(200).download(path);
    });
  } catch (error) {
    console.log(error);
    return res.status(404);
  }
});
module.exports = router;
