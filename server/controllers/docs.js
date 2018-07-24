'use strict';

const fs = require('fs');
const marked = require('marked');
const hljs = require('highlight.js');

const renderer = new marked.Renderer();

renderer.code = (code, language) => {
    const validLang = !!(language && hljs.getLanguage(language));
    const highlighted = validLang ? hljs.highlight(language, code).value : code;

    return `<pre><code class="hljs ${language}">${highlighted}</code></pre>`;
};

marked.setOptions({ renderer });

module.exports = (req, res, next) => {
    let page = req.params.page;

    if (!/^(api|socket)$/.test(page)) return res.redirect('/docs/api');

    fs.readFile('./docs/index.html', 'utf8', (err, data) => {
        if (err) return res.status(400).send(`Oops! Something went pretty darn wrong! :(<br><br><pre>${err.message}</pre>`);

        let markdown = data.replace('PAGE_CONTENT', (match, fileName) => {
            let fileData = null;

            try {
                fileData = fs.readFileSync(`./docs/${page}.md`, 'utf8');
            } catch (error) {}

            if (!fileData) return '404';

            return marked(fileData);
        });

        markdown = markdown.replace('ACTIVE_PAGE', page);

        res.send(markdown);
    });
};
