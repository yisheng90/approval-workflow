import mongoose from 'mongoose'

import {generateUuid} from '../utils/helpers/uuid-helpers'
import {StateMachine} from '../utils/services/state-machine'

export const Statuses = Object.freeze({
    Pending: 'pending',
    Approved: 'approved',
    Rejected: 'rejected'
})

export const TransitionActions = Object.freeze({
    Hold: 'hold',
    Approve: 'approve',
    Reject: 'reject'
})

const stateTransitions = [{
    name: TransitionActions.Hold,
    from: [Statuses.Approved, Statuses.Rejected],
    to: Statuses.Pending
}, {
    name: TransitionActions.Approve,
    from: [Statuses.Pending, Statuses.Rejected],
    to: Statuses.Approved
}, {
    name: TransitionActions.Reject,
    from: [Statuses.Approved, Statuses.Pending],
    to: Statuses.Rejected
}]

const programSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: generateUuid,
    },
    title: {
        type: String,
    },
    status: {
        type: String,
        enum: Object.values(Statuses),
        default: Statuses.Pending,
    },
    logs: [{
        status: {
            type: String,
            enum: Object.values(Statuses),
        },
        date: {
            type: Date
        },
    }]
}, {timestamps: {createdAt: true}})

programSchema.pre('save', function (next) {
    let program = this
    const logs = program.logs || []

    if (logs.length === 0 || program.status !== logs[logs.length -1].status) {
        logs.push({
            status: program.status,
            date: Date.new
        })
    }

    program.logs = logs

    next()
})

programSchema.methods.approve = function () {
    const stateMachine = StateMachine({
        init: this.status,
        transitions: stateTransitions
    })

    if (stateMachine.approve()) {
        this.status = stateMachine.state()
        this.save()
        return true
    }

    return false
}

programSchema.methods.reject = function () {
    const stateMachine = StateMachine({
        init: this.status,
        transitions: stateTransitions
    })

    if (stateMachine.reject()) {
        this.status = stateMachine.state()
        this.save()
        return true
    }

    return false
}

programSchema.methods.hold = function () {
    const stateMachine = StateMachine({
        init: this.status,
        transitions: stateTransitions
    })

    if (stateMachine.hold()) {
        this.status = stateMachine.state()
        this.save()
        return true
    }

    return false
}

programSchema.methods.transitions = function () {
    return StateMachine({
        init: this.status,
        transitions: stateTransitions
    }).transitions()
}

export const Program = mongoose.model('Program', programSchema)

