function mutateWatcher(contentKey, ...keys) {
    return keys.reduce((p, k) => (p[k] = function(newVal, oldVal) {
        if (contentKey) {
            this[contentKey][k] = newVal;
        }
        if (newVal !== oldVal) {
            this.$emit('mutate');
        }
    }, p), {});
}

export {
    mutateWatcher,
}