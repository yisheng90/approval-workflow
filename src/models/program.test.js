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

    describe('#approve', () => {
        it(`should update program status to ${Statuses.Approved} if current status is ${Statuses.Pending} or ${Statuses.Rejected}`, async () => {
            const pendingProgram = new Program({...programData, status: Statuses.Pending})
            const rejectedProgram = new Program({...programData, status: Statuses.Rejected})
            const savedPendingProgram = await pendingProgram.save()
            const savedRejectedProgram = await rejectedProgram.save()

            expect(savedPendingProgram.status).toBe(Statuses.Pending)
            expect(savedPendingProgram.approve()).toBe(true)
            expect(savedPendingProgram.status).toBe(Statuses.Approved)

            expect(savedRejectedProgram.status).toBe(Statuses.Rejected)
            expect(savedRejectedProgram.approve()).toBe(true)
            expect(savedRejectedProgram.status).toBe(Statuses.Approved)
        })

        it(`should return false if current status is not ${Statuses.Pending} or ${Statuses.Rejected}`, async () => {
            const approvedProgram = new Program({...programData, status: Statuses.Approved})
            const savedApprovedProgram = await approvedProgram.save()

            expect(savedApprovedProgram.status).toBe(Statuses.Approved)
            expect(savedApprovedProgram.approve()).toBe(false)
        })
    })

    describe('#reject', () => {
        it(`should update program status to ${Statuses.Rejected} if current status is ${Statuses.Pending} or ${Statuses.Approved}`, async () => {
            const pendingProgram = new Program({...programData, status: Statuses.Pending})
            const approvedProgram = new Program({...programData, status: Statuses.Approved})
            const savedPendingProgram = await pendingProgram.save()
            const savedApprovedProgram = await approvedProgram.save()

            expect(savedPendingProgram.status).toBe(Statuses.Pending)
            expect(savedPendingProgram.reject()).toBe(true)
            expect(savedPendingProgram.status).toBe(Statuses.Rejected)

            expect(savedApprovedProgram.status).toBe(Statuses.Approved)
            expect(savedApprovedProgram.reject()).toBe(true)
            expect(savedApprovedProgram.status).toBe(Statuses.Rejected)
        })

        it(`should return false if current status is not ${Statuses.Pending} or ${Statuses.Approved}`, async () => {
            const rejectedProgram = new Program({...programData, status: Statuses.Rejected})
            const savedRejectedProgram = await rejectedProgram.save()

            expect(savedRejectedProgram.status).toBe(Statuses.Rejected)
            expect(savedRejectedProgram.reject()).toBe(false)
        })
    })

    describe('#hold', () => {
        it(`should update program status to ${Statuses.Pending} if current status is ${Statuses.Approved} or ${Statuses.Rejected}`, async () => {
            const rejectedProgram = new Program({...programData, status: Statuses.Rejected})
            const approvedProgram = new Program({...programData, status: Statuses.Approved})
            const savedRejectedProgram = await rejectedProgram.save()
            const savedApprovedProgram = await approvedProgram.save()

            expect(savedRejectedProgram.status).toBe(Statuses.Rejected)
            expect(savedRejectedProgram.hold()).toBe(true)
            expect(savedRejectedProgram.status).toBe(Statuses.Pending)

            expect(savedApprovedProgram.status).toBe(Statuses.Approved)
            expect(savedApprovedProgram.hold()).toBe(true)
            expect(savedApprovedProgram.status).toBe(Statuses.Pending)
        })

        it(`should return false if current status is not ${Statuses.Approved} or ${Statuses.Rejected}`, async () => {
            const rejectedProgram = new Program({...programData, status: Statuses.Pending})
            const savedRejectedProgram = await rejectedProgram.save()


            expect(savedRejectedProgram.status).toBe(Statuses.Pending)
            expect(savedRejectedProgram.hold()).toBe(false)
        })
    })

    describe('#transitions', () => {
        it(`should return [${TransitionActions.Approve}, ${TransitionActions.Reject}] if current status is ${Statuses.Pending}`, async () => {
            const program = new Program({...programData, status: Statuses.Pending})
            const savedProgram = await program.save()

            expect(savedProgram.transitions()).toEqual([TransitionActions.Approve, TransitionActions.Reject])
        })

        it(`should return [${TransitionActions.Hold}, ${TransitionActions.Reject}] if current status is ${Statuses.Approved}`, async () => {
            const program = new Program({...programData, status: Statuses.Approved})
            const savedProgram = await program.save()

            expect(savedProgram.transitions()).toEqual([TransitionActions.Hold, TransitionActions.Reject])
        })

        it(`should return [${TransitionActions.Hold}, ${TransitionActions.Approve}] if current status is ${Statuses.Rejected}`, async () => {
            const program = new Program({...programData, status: Statuses.Rejected})
            const savedProgram = await program.save()

            expect(savedProgram.transitions()).toEqual([TransitionActions.Hold, TransitionActions.Approve])
        })
    })
})