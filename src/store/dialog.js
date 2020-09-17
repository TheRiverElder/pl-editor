import ExportToText from '../components/dialogs/TextExport';
import TextImport from '../components/dialogs/TextImport';

function openDialog(state, type) {
    switch (type) {
        case 'export-to-text': 
            state.dialog = {
                component: ExportToText,
            };
            break;
        case 'import-from-text': 
            state.dialog = {
                component: TextImport,
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