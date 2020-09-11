import ExportToText from '../components/dialogs/TextExport';

function openDialog(state, type) {
    switch (type) {
        case 'export-to-text': 
            state.dialog = {
                component: ExportToText,
            };
            break;
    }
}

function closeDialog(state) {
    state.dialog = null;
}

export {
    openDialog,
    closeDialog,
}