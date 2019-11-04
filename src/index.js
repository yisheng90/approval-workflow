import 'dotenv/config'
import bodyParser from 'body-parser'
import express from 'express'

import {connectDb} from './models'
import {getAllPrograms, createProgram, updateProgramStatus, deleteProgram} from './controllers/program'

const app = express()
const PORT = process.env.PORT || 3000

app.use(bodyParser.json())

app.get('/', getAllPrograms)
app.post('/program/new', createProgram)
app.put('/program/:id/transition', updateProgramStatus)
app.delete('/program/:id', deleteProgram)

connectDb().then(async () => {
    app.listen(PORT, () => console.log(`Hello. You are listening on port ${PORT} 🚀`))
})
