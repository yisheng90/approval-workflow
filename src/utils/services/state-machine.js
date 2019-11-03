const validateClashingMethods = (transitions) => {
    const clashingMethodsName = transitions.filter(({name}) => ['can', 'is', 'state', 'transitions'].includes(name)).map(({name}) => name)

    if (clashingMethodsName.length > 0) {
        throw Error(`${clashingMethodsName.length} transition methods (${clashingMethodsName.join(', ')}) clashed with default method `)
    }
}

const validateInitialDataFormat = ({init, transitions = []}) => {
    if (!init) {
        throw Error('Initial state is required')
    }

    if (transitions.length === 0) {
        throw Error('At least one transition is needed')
    }
}


export const StateMachine = ({init, transitions = []}) => {
    validateInitialDataFormat({init, transitions})
    validateClashingMethods(transitions)

    let currentState = init
    const transitionMethods = {}

    if (transitions.length > 0) {
        transitions.forEach(({name, from, to}) => {
            transitionMethods[name] = () => {
                if (from.includes(currentState)) {
                    currentState = to
                    return true
                }
                return false
            }
        })
    }

    const getPossibleTransition = () => transitions
        .filter(({from}) => from.includes(currentState))
        .map(({name}) => name)


    const isCurrentState = (state) => state === currentState

    const canTransit = (transition) => {
        const targetTransition = transitions.find(({name}) => name === transition)
        if (targetTransition) {
            return targetTransition.from.includes(currentState)
        }
        return false
    }

    return {
        state: () => currentState,
        ...transitionMethods,
        transitions: getPossibleTransition,
        is: isCurrentState,
        can: canTransit,
    }
}
