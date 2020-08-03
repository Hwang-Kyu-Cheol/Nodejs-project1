const http = require('http');
const fs = require('fs');
const url = require('url');

const app = http.createServer(function(request, response){
    const rq_url = request.url;
    const queryData = url.parse(rq_url, true).query;

    let title = queryData.id;

    if(rq_url === '/'){
        title = 'Welcome';
    }
    if(rq_url === '/favicon.ico'){
        return response.writeHead(404);
    }

    response.writeHead(200);
    const template = `
    <!DOCTYPE html>
    <html>
        <head>
            <title>WEB - ${title}</title>
        </head>
        <body>
            <h1>WEB</h1>
            <ul>
                <li><a href="/?id=HTML">HTML</a></li>
                <li><a href="/?id=CSS">CSS</a></li>
                <li><a href="/?id=JavaScript">JavaScript</a></li>
            </ul>
            <hr>
            <h2>${title}</h2>
            <p>Welcome to WEB World</p>
        </body>
    </html>
    `
    response.end(template);
});

app.listen(3000);