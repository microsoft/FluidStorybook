/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

const fs = require('fs');
const inputPath = __dirname + '/storybook-static/index.html';
const iFramePath = __dirname + '/storybook-static/iframe.html';
const outputPath = __dirname + '/storybook-static/playground.html';
const cacheScriptsPath = __dirname + '/storybook-static/cache-scripts.js';

fs.readFile(inputPath, (err, indexContent) => {
    if (err) {
      throw err; 
    }

    // Read in index.html content
    if (indexContent) {
        // Read in iframe to grab appropriate scripts to cache
        fs.readFile(iFramePath, (err, iFrameContent) => {
            if (err) {
              throw err; 
            }
            extractAndGenerateContent(indexContent, iFrameContent);
        });
    }
    else {
        console.log('Unable to find index.html file');
    }
});

function extractAndGenerateContent(indexContent, iFrameContent) {
    let stylesheetLinksContent;
    let scriptMatches;
    let iFrameScriptMatches;
    const content = indexContent.toString().match(/<head>(?<head>.*?)<\/head>\s*<body>(?<body>.*?)<\/body>/s);
    if (content && content.groups) {
        stylesheetLinksContent = content.groups.head.match(/<link\s+rel="stylesheet".*?(>|\/>|<\/link>)/gs);
        scriptMatches = Array.from(content.groups.body.matchAll(/<script\s+src="(?<src>.*?)"><\/script>/g), 
                                        match => match.groups.src);
        iFrameScriptMatches = Array.from(iFrameContent.toString().matchAll(/<script\s+src="(?<src>.*?)"><\/script>/g), 
                                        match => match.groups.src);
    }
    else {
        const errorMsg = 'Error finding content.groups used for body or head';
        console.log(errorMsg);
        throw new Error(errorMsg);
    }

    const { stylesheetLinks, body } = cleanupContent(stylesheetLinksContent, content);

    // Create playground.html
    createPlaygroundHtml(stylesheetLinks, body);

    // Create cache-script.js
    createCacheScriptsJS(scriptMatches, iFrameScriptMatches);
}

function createCacheScriptsJS(scriptMatches, iFrameScriptMatches) {
    let scripts = [];
    getScripts(scriptMatches, scripts);
    getScripts(iFrameScriptMatches, scripts);
    const cacheScript = createJSCacheScript(scripts);
    fs.writeFile(cacheScriptsPath, cacheScript, (err) => {
        if (err) {
            throw err;
        }
        console.log(`CREATED: ${cacheScriptsPath}`);
    });
}

function getScripts(scriptMatches, scripts) {
    if (scriptMatches && scriptMatches.length) {
        for (const script of scriptMatches) {
            // We're only interested in scripts that start with vendors~main. 
            // Others are pretty small and can be loaded on-demand.
            if (script.startsWith('vendors~main')) {
                scripts.push(script);
            }
        }
    }
}

function createPlaygroundHtml(stylesheetLinks, body) {
    const outputContent = createHugoTemplate(stylesheetLinks, body);
    fs.writeFile(outputPath, outputContent, (err) => {
        if (err) {
            throw err;
        }
        console.log(`CREATED: ${outputPath}`);
    });
}

function cleanupContent(stylesheetLinksContent, content) {
    let stylesheetLinks;
    let body;
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
    return { stylesheetLinks, body };
}

function createHugoTemplate(stylesheetLinks, bodyContent) {
    return `{{ define "header" }}
{{ partial "header.html" . }}
{{ end }}
     
{{ define "main" }}
{{ partial "navbarSticky.html" . }}
<script>
  var base = document.createElement('base');
  base.href = '/playground/';
  document.getElementsByTagName('head')[0].appendChild(base);
</script>
${stylesheetLinks}
${bodyContent}
{{ block "footer" . -}}{{ end }}
{{- if templates.Exists "partials/extra-foot.html" -}}
{{ partial "extra-foot.html" . }}
{{- end }}
 
{{ end }}`;
}

function createJSCacheScript(hashedBundles) {
    return `// Cache scripts for performance
if (location.href.indexOf('/playground') === -1) {
    var scripts = [ 'sb_dll/storybook_ui_dll.js', 'sb_dll/storybook_docs_dll.js', '${hashedBundles.join('\',\'')}' ];
    for (var i=0;i<scripts.length;i++) {
        var name = scripts[i];
        var path = '/playground/' + name;

        const script = document.createElement('link');
        script.id = name;
        script.href = path;
        script.rel = "prefetch";
        document.body.appendChild(script);
    }
}`;
}
