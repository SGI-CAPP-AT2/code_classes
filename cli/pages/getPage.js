import fs from "fs";
export const getPage = (page, obj) => {
  let textInPage = fs.readFileSync(page, "utf8");
  for (const key in obj) {
    textInPage = textInPage.replace(`%${key.toUpperCase()}%`, obj[key]);
  }
  return textInPage;
};
