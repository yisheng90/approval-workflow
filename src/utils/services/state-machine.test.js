import {StateMachine} from './state-machine'

const mockTransitions = [
    {name: 'approve', from: ['pending', 'rejected'], to: 'approved'},
    {name: 'hold', from: ['rejected', 'approved'], to: 'pending'},
    {name: 'reject', from: ['pending', 'approved'], to: 'rejected'},
]

describe('StateMachine', () => {
    describe('Initialization', () => {
        it('should throw an error if initial state is not provided', () => {
            expect(() => StateMachine({})).toThrow('Initial state is required')
        })

        it('should throw an error if no transitions are not provided', () => {
            expect(() => StateMachine({init: 'pending'})).toThrow('At least one transition is needed')
        })

        it('should throw an error if there is clashing transitions', () => {
            expect(() => StateMachine({
                init: 'pending',
                transitions: [{name: 'state', from: ['pending'], to: 'approved'}]
            })).toThrow()
        })

        it('should return and object with correct properties', () => {
            const resultState = StateMachine({
                init: 'pending',
                transitions: mockTransitions
            })

            expect(resultState).toHaveProperty('state')
            expect(resultState).toHaveProperty('can')
            expect(resultState).toHaveProperty('is')
            expect(resultState).toHaveProperty('transitions')
            mockTransitions.forEach(({name}) => {
                expect(resultState).toHaveProperty(name)
            })
        })

    })

    describe('Methods', () => {
        describe('#state', () => {
            it('should return the current state', () => {
                const stateMachine = StateMachine({
                    init: 'pending',
                    transitions: mockTransitions
                })
                expect(stateMachine.state()).toEqual('pending')
                stateMachine.approve()
                expect(stateMachine.state()).toEqual('approved')
            })
        })

        describe('#can', () => {
            it('should return true if current state can undergo the given transition', () => {
                const stateMachine = StateMachine({
                    init: 'pending',
                    transitions: mockTransitions
                })
                expect(stateMachine.can('approve')).toBe(true)
                expect(stateMachine.can('reject')).toBe(true)
                expect(stateMachine.can('hold')).not.toBe(true)
            })

            it('should return false if current state cannot undergo the given transition', () => {
                const stateMachine = StateMachine({
                    init: 'pending',
                    transitions: mockTransitions
                })
                expect(stateMachine.can('approve')).not.toBe(false)
                expect(stateMachine.can('reject')).not.toBe(false)
                expect(stateMachine.can('hold')).toBe(false)
            })
        })

        describe('#is', () => {
            it('should return true if current state is equal to the given state', () => {
                const stateMachine = StateMachine({
                    init: 'pending',
                    transitions: mockTransitions
                })

                expect(stateMachine.is('pending')).toBe(true)
                expect(stateMachine.is('approved')).not.toBe(true)
                expect(stateMachine.is('rejected')).not.toBe(true)
            })

            it('should return false if current state is not equal to the given state', () => {
                const stateMachine = StateMachine({
                    init: 'pending',
                    transitions: mockTransitions
                })

                expect(stateMachine.is('pending')).not.toBe(false)
                expect(stateMachine.is('approved')).toBe(false)
                expect(stateMachine.is('rejected')).toBe(false)
            })
        })

        describe('#transitions', () => {
            it('should return an array of possible transitions for current state', () => {
                const stateMachine = StateMachine({
                    init: 'pending',
                    transitions: mockTransitions
                })

                expect(stateMachine.transitions()).toEqual(['approve', 'reject'])
                stateMachine.approve()
                expect(stateMachine.transitions()).toEqual(['hold', 'reject'])
                stateMachine.reject()
                expect(stateMachine.transitions()).toEqual(['approve', 'hold'])
            })
        })

    })

    describe('Transition Methods', () => {
        it('should return true upon successful transition', () => {
            const stateMachine = StateMachine({
                init: 'pending',
                transitions: mockTransitions
            })

            expect(stateMachine.approve()).toBe(true)
        })

        it('should return false upon unsuccessful transition', () => {
            const stateMachine = StateMachine({
                init: 'pending',
                transitions: mockTransitions
            })

            expect(stateMachine.hold()).toBe(false)
        })
    })
})