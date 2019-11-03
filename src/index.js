import 'dotenv/config'
import bodyParser from 'body-parser'
import express from 'express'
import {getAllPrograms, createProgram, approveProgram} from './controllers/approval-status'

import {connectDb} from './models'
import {deleteProgram, holdProgram, rejectProgram} from './controllers/program'

const app = express()
const PORT = process.env.PORT || 3000

app.use(bodyParser.json())

app.get('/', getAllPrograms)
app.post('/program/new', createProgram)
app.put('/program/:id/approve', approveProgram)
app.put('/program/:id/reject', rejectProgram)
app.put('/program/:id/hold', holdProgram)
app.delete('/program/:id', deleteProgram)

connectDb().then(async () => {
    app.listen(PORT, () => console.log(`Hello. You are listening on port ${PORT} 🚀`))
})
