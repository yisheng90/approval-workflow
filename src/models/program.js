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


programSchema.post('init', function () {
    this.stateMachine = StateMachine({
        init: this.status,
        transitions: stateTransitions
    })
})

programSchema.pre('save', function (next) {
    if (this.isNew && !this.logs) {
        this.logs = [{
            state: this.status,
            date: new Date()
        }]
    }

    next()
})

programSchema.methods.transition = function (action) {
    if (!this.stateMachine) {
        this.stateMachine = StateMachine({
            init: this.status,
            transitions: stateTransitions
        })
    }

    if (this.stateMachine.can(action) && this.stateMachine[action]) {
        this.stateMachine[action]()

        this.status = this.stateMachine.state()
        this.logs.push({
            status: this.status,
            date: new Date()
        })
        return true
    }

    return false
}

export const Program = mongoose.model('Program', programSchema)
