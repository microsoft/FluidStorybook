const fs = require('fs');
const inputPath = __dirname + '/storybook-static/index.html';
const outputPath = __dirname + '/storybook-static/playground.html';

fs.readFile(inputPath, (err, inputContent) => {
    if (err) {
      throw err; 
    }
    if (inputContent) {
        extractAndGenerateContent(inputContent);
    }
    else {
        console.log('Unable to find index.html file');
    }
});

function extractAndGenerateContent(inputContent) {
    let stylesheetLinks = '';
    let body = '';
    const content = inputContent.toString().match(/<head>(?<head>.*?)<\/head>\s*<body>(?<body>.*?)<\/body>/s);
    const stylesheetLinksContent = content.groups.head.match(/<link\s+rel="stylesheet".*?(>|\/>|<\/link>)/gs);

    if (stylesheetLinksContent && stylesheetLinksContent.length && content.groups) {
        stylesheetLinks = stylesheetLinksContent.join('\n');
        // Remove any unnecessary white space (not required - but easier to read output)
        body = content.groups.body.replace(/\n|\s{2,}/gs, '');
    }
    else {
        const errorMsg = 'Error finding stylesheets or body content!';
        console.log(errorMsg);
        throw new Error(errorMsg);
    }

    const outputContent = createHugoTemplate(stylesheetLinks, body);
    fs.writeFile(outputPath, outputContent, (err) => {
        if (err) {
            throw err;
        }
        console.log(`UPDATED: ${outputPath}`);
    });
}

function createHugoTemplate(stylesheetLinks, bodyContent) {
    return `{{ define "header" }}
{{ partial "header.html" . }}
{{ end }}
     
{{ define "main" }}
{{ partial "navbarSticky.html" . }}
${stylesheetLinks}
${bodyContent}
{{ block "footer" . -}}{{ end }}
{{- partial "analytics.html" . }}
{{- if templates.Exists "partials/extra-foot.html" -}}
{{ partial "extra-foot.html" . }}
{{- end }}
 
{{ end }}`;
}