const fs = require('fs');

const content = fs.readFileSync('docs.html', 'utf8');

// We need to extract the 'pages' object from the JS code
// Since it's a JS object literal, we can use eval or Function after a bit of parsing.
const pagesMatch = content.match(/const pages = (\{[\s\S]*?\n    \});/);
if (!pagesMatch) {
  console.error("Could not find pages object");
  process.exit(1);
}

let pagesCode = pagesMatch[1];
// We need to evaluate this safely
const pages = eval('(' + pagesCode + ')');

let htmlOutput = '';

for (const [key, page] of Object.entries(pages)) {
    // Skip introduction since it's already there? Actually, let's regenerate it properly wrapped
    htmlOutput += `      <section id="${key}" class="doc-section"${key !== 'introduction' ? ' style="display: none;"' : ''}>\n`;
    htmlOutput += `        <div class="breadcrumb">${page.breadcrumb || ''}</div>\n`;
    htmlOutput += `        <h1 class="page-title">${page.title}</h1>\n`;
    if (page.subtitle) {
        htmlOutput += `        <div class="page-subtitle">${page.subtitle}</div>\n`;
    }
    htmlOutput += page.content;
    htmlOutput += `\n      </section>\n`;
}

fs.writeFileSync('static_sections.html', htmlOutput);
console.log("Written static sections to static_sections.html");
