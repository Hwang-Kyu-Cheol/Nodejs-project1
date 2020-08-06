module.exports = {
    html: function(title, context, fileList, controls){
        const template = `
        <!DOCTYPE html>
        <html>
            <head>
                <title>WEB2 - ${title}</title>
            </head>
            <body>
                <h1><a href="/">WEB2</a></h1>
                ${fileList}
                ${controls}
                <hr>
                ${context}
            </body>
        </html>
        `;
        return template;
    },
    body: function(title, data){
        const template = `
        <h2>${title}</h2>
        <div>${data}</div>        
        `;
        return template; 
    },
    fileList: function(fileArray){
        let fileList = '<ul>';
        for(let i = 0; i<fileArray.length; i++){
            fileList = fileList + `<li><a href="/?id=${fileArray[i]}">${fileArray[i]}</a></li>`
        }
        fileList = fileList + '</ul>';
        return fileList;
    }
}