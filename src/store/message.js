const MAX_MESSAGE_COUNT = 10;

function appendMessage(state, text) {
    state.messages.push({time: Date.now(), text});
    if (state.messages.length > MAX_MESSAGE_COUNT) {
        state.messages.splice(0, state.messages.length - MAX_MESSAGE_COUNT);
    }
}

export {
    appendMessage,
}