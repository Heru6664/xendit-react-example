const initialState = {
    msg: 'hello, world!'
}

export default function(state = initialState, actions) {
    switch (actions.type) {
        case '':
            return state;
        default:
            return state;
    }
}
