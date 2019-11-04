import mongoose from 'mongoose'
import {Program, Statuses, TransitionActions} from '../models/program'
import {mockRequest, mockRespose} from '../utils/helpers/interceptor'

import {getAllPrograms, createProgram, updateProgramStatus} from './program'

describe('Program Controller', () => {
    beforeAll(async () => {
        const url = 'mongodb://127.0.0.1/jest'
        await mongoose.connect(url, {useNewUrlParser: true, useCreateIndex: true}, (err) => {
            if (err) {
                console.error(err)
                process.exit(1)
            }
        })
    })

    afterAll(async () => {
        await Program.deleteMany()
    })

    describe('#getAllPrograms', () => {
        it('should return 200 with list of all programs', async () => {
            const validProgram = new Program({status: Statuses.Pending})
            await validProgram.save()
            const res = mockRespose()
            const req = mockRequest()

            await getAllPrograms(req, res)
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledTimes(1)

        })
    })

    describe('#createProgram', () => {
        it('should return 200 with program id if program is created', async () => {
            const res = mockRespose()
            const req = mockRequest()
            req.body.title = 'Testing 123'
            req.body.status = Statuses.Pending

            await createProgram(req, res)
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalled()
        })

        it('should return 500 if error occurred', async () => {
            const res = mockRespose()
            const req = mockRequest()
            req.body.status = '123'

            await createProgram(req, res)
            expect(res.status).toHaveBeenCalledWith(500)
        })
    })

    describe('#updateProgramStatus', () => {
        it('should return 200 with success equal true if program is successfully transited', async () => {
            const validProgram = new Program({status: Statuses.Pending})
            const savedProgram = await validProgram.save()
            const res = mockRespose()
            const req = mockRequest()
            req.params.id = savedProgram._id
            req.query.action = TransitionActions.Approve

            await updateProgramStatus(req, res)
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledWith({data: {success: true}})
        })

        it('should return 200 with success equal false if program is not successfully transited', async () => {
            const validProgram = new Program({status: Statuses.Approved})
            const savedProgram = await validProgram.save()
            const res = mockRespose()
            const req = mockRequest()
            req.params.id = savedProgram._id
            req.query.action = TransitionActions.Approve

            await updateProgramStatus(req, res)
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledWith({data: {success: false}})
        })

    })

})