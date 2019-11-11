const express = require('express')
const app = express()
const path = require('path')
const bodyParser = require('body-parser')
const GoogleSpreadsheet = require('google-spreadsheet')
const credentials = require('./bugtracker.json')
const { promisify } = require('util')
const sgMail = require('@sendgrid/mail')
require('dotenv/config')

app.set('view engine', 'ejs')
app.set('views', path.resolve(__dirname, 'views'))

app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res)=> {
    res.render('home')
})
app.post('/', async(req, res) => {
    try {
        const doc = new GoogleSpreadsheet(process.env.docId)
        await promisify(doc.useServiceAccountAuth)(credentials)
        console.log('planilha aberta')
        const info = await promisify(doc.getInfo)()
        const worksheet = info.worksheets[process.env.worksheetIndex]
        await promisify(worksheet.addRow)({ 
            name: req.body.name,
            email: req.body.email,
            classificacao: req.body.issueType,
            source: req.body.source || 'direct',
            reproduzirError: req.body.howToReproduce,
            saidaEsperada: req.body.expectedOuput,
            saidaRecebida: req.body.receiveOuput,
            userAgent: req.body.userAgent,
            userDate: req.body.userDate,
            userSo: req.body.userSo
        })
        // se for critico
        if(req.body.issueType === 'CRITICAL') {
            sgMail.setApiKey(process.env.sendGridKey);
            const msg = {
            to: 'jhonleandres.silva@gmail.com',
            from: 'jhonleandres.silva@gmail.com',
            subject: 'BUG Critico reportado',
            text: `
                O usário ${req.body.name} reportou um problema.
            `,
            html: `O usário ${req.body.name} reportou um problema.`,
            };
            await sgMail.send(msg);
        }

        res.render('sucesso')
    } catch(err){
        res.render('erro')
        console.log(err)
    }
})


app.listen(3000, (err)=> {
    if (err) {
        console.log('aconteceu um erro', err)
    } else {
        console.log('bugtracker rodando na porta 3000')
    }
})