const fs = require('fs');
const indexHtmlPath = __dirname + '/storybook-static/index.html';

fs.readFile(indexHtmlPath, (err, indexHtml) => {
    if (err) {
      throw err; 
    }
    if (indexHtml) {
        const content = extractContent(indexHtml);
        updateIndexHtml(content);
    }
    else {
        console.log('Unable to find index.html file');
    }
});

function extractContent(indexHtml) {
    const content = indexHtml.toString().match(/<head>(?<head>.*?)<\/head><body>(?<body>.*?)<\/body>/s);
    const head = content.groups.head.replace(/<title>.*?<\/title>|<meta.*\/>/s, '');
    const body = content.groups.body;
    return createHugoTemplate(head, body);
}

function updateIndexHtml(content) {
    fs.writeFile(indexHtmlPath, content, (err) => {
        if (err) {
            throw err;
        }
        console.log('index.html updated!');
    });
}

function createHugoTemplate(headerContent, bodyContent) {
    return `{{ define "header" }}
{{ partial "header.html" . }}
${headerContent}
{{ end }}


{{ define "main" }}
{{ partial "navbarSticky.html" . }}

${bodyContent}

{{ block "footer" . -}}{{ end }}
{{- partial "analytics.html" . }}
{{- if templates.Exists "partials/extra-foot.html" -}}
{{ partial "extra-foot.html" . }}
{{- end }}

{{ end }}`;
}