function appendMessage(state, text) {
    state.messages.push({time: Date.now(), text});
}

export {
    appendMessage,
}