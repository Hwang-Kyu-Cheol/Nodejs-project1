const http = require('http');
const fs = require('fs');
const url = require('url');

function makeFileList(fileArray){
    let fileList = '<ul>';
    for(let i = 0; i<fileArray.length; i++){
        fileList = fileList + `<li><a href="/?id=${fileArray[i]}">${fileArray[i]}</a></li>`
    }
    fileList = fileList + '</ul>';
    return fileList;
}

function makeHTML(title, context, fileList){
    const template = `
    <!DOCTYPE html>
    <html>
        <head>
            <title>WEB - ${title}</title>
        </head>
        <body>
            <h1><a href="/">WEB</a></h1>
            ${fileList}
            <hr>
            <h2>${title}</h2>
            <p>${context}</p>
        </body>
    </html>
    `;
    return template;
}

const app = http.createServer(function(request, response){
    const rq_url = request.url;
    const queryData = url.parse(rq_url, true).query;
    const pathname = url.parse(rq_url, true).pathname;

    if(pathname === '/'){
        if(queryData.id === undefined){
            fs.readdir('./data', function(error, fileArray){
                const title = 'Welcome';
                const context = 'Welcome to WEB';
                const fileList = makeFileList(fileArray);
                const template = makeHTML(title, context, fileList);
                response.writeHead(200);
                response.end(template); 
            });
        } else {
            fs.readdir('./data', function(error, fileArray){
                fs.readFile(`data/${queryData.id}.txt`, 'utf8', function(err, data){
                    const title = queryData.id;
                    const context = data;
                    const fileList = makeFileList(fileArray);
                    const template = makeHTML(title, context, fileList);
                    response.writeHead(200);
                    response.end(template);        
                });
            });
        }
    } else {
        response.writeHead(404);
        response.end('Not Found');          
    }
});

app.listen(3000);