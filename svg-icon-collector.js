const fs = require("fs");

const paths = ["./path_to_project",];

const BASE_PATH = "./destination_path";

const PATH_TO_INDEX = "./destination_path/__index.js";

var walk = function(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = `${dir}/${file}`;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.includes(".svg")) results.push(file);
  });
  return results;
};

fs.mkdirSync(BASE_PATH);

let svgFilesByPlatform = paths.map(path => walk(path));

svgFilesByPlatform.forEach((path, index) => {
  path.forEach(file => {
    let filename = file.match(/\w+\.svg/g)[0].replace(".svg", "");
    filename = `${filename}${index === 0 ? "D" : "M"}`;
    const count = 1;
    while (fs.existsSync(`${BASE_PATH}/${filename}.svg`)) {
      filename += count;
    }

    fs.writeFileSync(
      `${BASE_PATH}/${filename}.svg`,
      fs.readFileSync(file),
      function(err) {
        if (err) return console.log(err);
        console.log("Hello World > helloworld.txt");
      }
    );
  });
});

svgFilesByPlatform = walk(BASE_PATH);
// generate index.ts
let imports = "";
svgFilesByPlatform.forEach(file => {
  const filename = file.match(/\w+\.svg/g)[0].replace(".svg", "");
  imports += `import * as ${filename.replace(
    ".svg",
    ""
  )} from './${filename}.svg';\n`;
});

let exportsFiles = "";
svgFilesByPlatform.forEach(file => {
  const filename = file.match(/\w+\.svg/g)[0].replace(".svg", "");
  exportsFiles += `${filename.replace(".svg", "")},\n`;
});

const index = `
${imports}

export const ICONS = {
${exportsFiles}
}
`;

fs.writeFileSync(
  PATH_TO_INDEX,
  index,
  function(err) {
    if (err) return console.log(err);
    console.log("Hello World > helloworld.txt");
  }
);
