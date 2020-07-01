const fs = require('fs')
const path = require('path')
const express = require('express')
const multer = require('multer')
const upload = multer({dest: 'upload/'})

let app = express()

let filePath = './upload/'
let dir = fs.existsSync(path.resolve(filePath))
!dir && fs.mkdirSync(path.resolve(filePath))

app.get('/', function(req, res, next) {
  res.send('Hello World')
})

// Upload single file
app.post('/uploadSingleFile', upload.single('singleFile'), async function( req, res, next) {
  if (req.file.length === 0) {
    res.render('error', {message: '上传文件不能为空！'})
    return 
  } else {
    let file = req.file
    let fileInfo = await readFiles([file])
    res.set({
      'content-type': 'application/json; charset=utf-8'
    })
    res.end(JSON.stringify(fileInfo))
  }
})

// Upload multiple files
app.post('/uploadMultiFiles', upload.array('multiFiles'), async function(req, res, next) {
  if (req.files.length === 0) {
    res.render('error', {message: '上传文件不能为空！'})
    return 
  } else {
    let files = req.files
    let fileInfos = await readFiles(files)
    console.log('fileInfos', fileInfos)
    res.set({
      'content-type': 'application/json; charset=utf-8'
    })
    res.end(JSON.stringify(fileInfos))
  }
})

// Read uploadFile.html and display in browser 
app.get('/form', function(req, res, next){
  let form = fs.readFileSync('./index.html', {encoding: 'utf8'});
  res.send(`<div>${form}</div>`);
});

app.listen(8000, function(){
  console.log('Listening on port 8000')
})


function readFiles(files) {
  let fileInfos = []
  for (let i=0; i<files.length; i++) {
    let file = files[i]
    let fileInfo = {}

    fs.renameSync(`./upload/${file.filename}`, `./upload/${file.originalname}`)
    fileInfo.mimetype = file.mimetype
    fileInfo.originalname = file.originalname
    fileInfo.size = file.size
    fileInfo.path = file.path

    fileInfos.push(fileInfo)
  }

  
  return fileInfos
}