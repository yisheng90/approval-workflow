import mongoose from 'mongoose'
import {Program, Statuses, TransitionActions} from './program'

const programData = {
    title: 'testing',
    status: Statuses.Approved
}

describe('Program Model', () => {
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

    it('should create & save program successfully', async () => {
        const validProgram = new Program(programData)
        const savedProgram = await validProgram.save()

        expect(savedProgram._id).toBeDefined()
        expect(savedProgram.title).toBe(validProgram.title)
        expect(savedProgram.status).toBe(validProgram.status)
    })

    describe('#transition', () => {
        it(`should return true if the action is ${TransitionActions.Hold} current state is ${Statuses.Approved} or ${Statuses.Pending}`, async () => {
            const program = new Program(programData)

            expect(program.transition(TransitionActions.Hold)).toBe(true)
            expect(program.status).toEqual(Statuses.Pending)
            expect(program.logs).toHaveLength(1)
        })

        it(`should return false if the action is ${TransitionActions.Hold} current state is not ${Statuses.Approved} or ${Statuses.Pending}`, async () => {
            const program = new Program({status: Statuses.Pending})

            expect(program.transition(TransitionActions.Hold)).toBe(false)
            expect(program.status).toEqual(Statuses.Pending)
            expect(program.logs).toHaveLength(0)
        })


        it(`should return true if the action is ${TransitionActions.Approve} current state is ${Statuses.Pending} or ${Statuses.Rejected}`, async () => {
            const program = new Program({status: Statuses.Pending})

            expect(program.transition(TransitionActions.Approve)).toBe(true)
            expect(program.status).toEqual(Statuses.Approved)
            expect(program.logs).toHaveLength(1)
        })

        it(`should return false if the action is ${TransitionActions.Approve} current state is not ${Statuses.Pending} or ${Statuses.Rejected}`, async () => {
            const program = new Program({status: Statuses.Approved})

            expect(program.transition(TransitionActions.Approve)).toBe(false)
            expect(program.status).toEqual(Statuses.Approved)
            expect(program.logs).toHaveLength(0)
        })

        it(`should return true if the action is ${TransitionActions.Reject} current state is ${Statuses.Pending} or ${Statuses.Approved}`, async () => {
            const program = new Program({status: Statuses.Pending})

            expect(program.transition(TransitionActions.Reject)).toBe(true)
            expect(program.status).toEqual(Statuses.Rejected)
            expect(program.logs).toHaveLength(1)
        })

        it(`should return false if the action is ${TransitionActions.Reject} current state is not ${Statuses.Pending} or ${Statuses.Approved}`, async () => {
            const program = new Program({status: Statuses.Rejected})

            expect(program.transition(TransitionActions.Reject)).toBe(false)
            expect(program.status).toEqual(Statuses.Rejected)
            expect(program.logs).toHaveLength(0)
        })
    })
})