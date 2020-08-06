const http = require('http');
const fs = require('fs');
const url = require('url');
const qs = require('querystring');
const makeTemplate = require('./lib/template.js');

const app = http.createServer(function(request, response){
    const rq_url = request.url;
    const queryData = url.parse(rq_url, true).query;
    const pathname = url.parse(rq_url, true).pathname;

    if(pathname === '/'){
        if(queryData.id === undefined){
            fs.readdir('./data', function(error, fileArray){
                const title = 'Welcome';
                const context = makeTemplate.body(title, 'Welcome to WEB');
                const fileList = makeTemplate.fileList(fileArray);
                const template = makeTemplate.html(title, context, fileList, '<a href="/create">create</a>');
                response.writeHead(200);
                response.end(template); 
            });
        } else {
            fs.readdir('./data', function(error, fileArray){
                fs.readFile(`data/${queryData.id}`, 'utf8', function(err, data){
                    const title = queryData.id;
                    const context = makeTemplate.body(title, data);
                    const fileList = makeTemplate.fileList(fileArray);
                    const template = makeTemplate.html(title, context, fileList, `<a href="/create">create</a><a href="/update?id=${title}">update</a><a href="/process_delete?id=${title}">delete</a>`);
                    response.writeHead(200);
                    response.end(template);        
                });
            });
        }
    }
    else if(pathname === '/create') {
        fs.readdir('./data', function(error, fileArray){
            const title = 'Create';
            const form = `
            <form action="http://localhost:3000/process_create" method="POST">
                <p><input type="text" name="title" placeholder="title"></p>
                <p><textarea name="description" placeholder="description"></textarea></p>
                <p><input type="submit" value="OK"><p>
            </form>            
            `;
            const context = makeTemplate.body(title, form);
            const fileList = makeTemplate.fileList(fileArray);
            const template = makeTemplate.html(title, context, fileList, '');
            response.writeHead(200);
            response.end(template); 
        });
    }
    else if(pathname === '/process_create'){
        if(request.method === 'POST'){
            let body = '';
            request.on("data", function(data){
                body += data;
            });
            request.on("end", function(){
                const post = qs.parse(body);
                let title = post.title;
                let description = post.description;
                fs.writeFile(`data/${title}`, description, 'utf8', function(error){
                    if(error) throw error;
                    response.writeHead(302, {Location: `/?id=${title}`});
                    response.end();
                });
            });
        }
    }
    else if(pathname === '/update'){
        fs.readdir('./data', function(error, fileArray){
            fs.readFile(`data/${queryData.id}`, 'utf8', function(error, data){
                const title = 'Update';
                const form = `
                <form action="http://localhost:3000/process_update?id="${queryData.id}" method="POST">
                    <p><input type="text" name="title" value="${queryData.id}"></p>
                    <p><textarea name="description">${data}</textarea></p>
                    <p><input type="submit" value="OK"><p>
                </form>            
                `;
                const context = makeTemplate.body(title, form);
                const fileList = makeTemplate.fileList(fileArray);
                const template = makeTemplate.html(title, context, fileList, '');
                response.writeHead(200);
                response.end(template); 
            });
        });
    }
    else if(pathname === '/process_update'){
        if(request.method === 'POST'){
            let body = '';
            request.on('data', function(data){
                body += data;
            });
            request.on('end', function(){
                const post = qs.parse(body);
                const title = post.title;
                const description = post.description;
                fs.rename(`data/${queryData.id}`, `data/${title}`, function(){
                    fs.writeFile(`data/${title}`, description, 'utf8', function(error){
                        if(error) throw error;
                        response.writeHead(302, {Location: `/?id=${title}`});
                        response.end();
                    });
                });
            });
        }
    }
    else if(pathname === '/process_delete'){
        fs.unlink(`data/${queryData.id}`, function(error){
            response.writeHead(302, {Location: `/`});
            response.end();
        });
    }
    else {
        response.writeHead(404);
        response.end('Not Found');          
    }
});

app.listen(3000);