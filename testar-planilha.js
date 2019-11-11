const GoogleSpreadsheet = require('google-spreadsheet')
const credentials = require('./bugtracker.json')
const { promisify } = require('util')


const addRowToSheet = async() => {
    const doc = new GoogleSpreadsheet('1fz5N-ZvCAT5YVZgiYCGMo3qRSkXx7EaIVMuy-h_7WcQ')
    await promisify(doc.useServiceAccountAuth)(credentials)
    console.log('Planilha aberta')
    const info = await promisify(doc.getInfo)()
    const worksheet = info.worksheets[0]
    await promisify(worksheet.addRow)({ name: 'Jhonleandres', email: 'teste' })
}

addRowToSheet()

/*
const doc = new GoogleSpreadsheet('1fz5N-ZvCAT5YVZgiYCGMo3qRSkXx7EaIVMuy-h_7WcQ')

doc.useServiceAccountAuth(credentials, (err) => {
    if (err) {
        console.log('nao foi possivel abrir a planilha')
    } else {
        console.log('planilha aberta')
        doc.getInfo((err, info) =>{
            const worksheet = info.worksheets[0]
            worksheet.addRow({ 
                name: 'Jhonleandrrs',
                email: 'teste@teste.com',
                classificacao: 'teste class',
                reproduzirError: 'rep',
                saidaEsperada: 'esperado',
                saidaRecebida: 'saida muito agardada' }, err => {
                console.log('linha inserida')
            })
        })
    }
})
*/