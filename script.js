const fs = require('fs');
const axios = require('axios');
const http = require('http');
const url = require('url');


const urlClients = 'https://gist.githubusercontent.com/josejbocanegra/986182ce2dd3e6246adcf960f9cda061/raw/f013c156f37c34117c0d4ba9779b15d427fb8dcd/clientes.json';
const urlProviders = 'https://gist.githubusercontent.com/josejbocanegra/d3b26f97573a823a9d0df4ec68fef45f/raw/66440575649e007a9770bcd480badcbbc6a41ba7/proveedores.json';

const index= 'index.html';
const clientsFile = 'clients.html';
const providersFile = 'providers.html';

function showClients(data, callback){
    fs.readFile(index,'utf8',(error,dataRead)=>{
        if (error) console.error(error);
        else{
            let content = dataRead.toString();
            content = content.replace('Escoja los datos que quiere visualizar', 'Lista de clientes');
           
            
            let show = '';
            data.forEach((client)=>{
                show+= `<tr>\n\
                <th scope="row">${client.idCliente}</th> \n\
                <td>${client.NombreCompania}</td> \n\
                <td>${client.NombreContacto}</td> \n\
                </tr> \n`
            });
            content = content.replace('{{data}}',show);
            fs.writeFile(clientsFile, content, (error) => {
                if (error) console.log(err, "Escritura errónea");
              });
            callback(content);
        }
    });
}

function showProviders(data, callback){
    fs.readFile(index,'utf8',(error,dataRead)=>{
        if (error) console.error(error);
        else{
            let content = dataRead.toString();
            content = content.replace('Escoja los datos que quiere visualizar', 'Lista de Proveedores');
            let show = '';
            data.forEach((client)=>{
                show+= `<tr>\n\
                <th scope="row">${client.idproveedor}</th> \n\
                <td>${client.nombrecompania}</td> \n\
                <td>${client.nombrecontacto}</td> \n\
                </tr> \n`
            });
            content = content.replace('{{data}}',show);
            fs.writeFile(providersFile, content, (error) => {
                if (error) console.log(err, "Escritura errónea");
              });
            callback(content);
        }
    });
}




const requestListener = function (req, res) {
    let q = url.parse(req.url);
    if (q.pathname === "/api/clientes") {
      axios.get(urlClients).then((response) => {
        showClients(response.data, (dataFinal) => {
          res.writeHead(200, { "Content-Type": "text/html" });
          res.end(dataFinal);
        });
      });
    } else if (q.pathname === "/api/proveedores") {
      axios.get(urlProviders).then((response) => {
        showProviders(response.data, (dataFinal) => {
          res.writeHead(200, { "Content-Type": "text/html" });
          res.end(dataFinal);
        });
      });
    }
    else{
        res.writeHead(200, { "Content-Type": "text/html" });
          res.end();
    }

}

const server = http.createServer(requestListener);
server.listen(8081);

