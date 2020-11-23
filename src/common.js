const EditorSectionType = {
    SET_BG: 'set_bg',
    MUTATE_ROLES: 'mutate_roles',
    SET_LINE: 'set_line',
}

const InstructionHead = {
    EXIT: 0x00,
    JUMP: 0x01,
    SET_LINE: 0x02,
    SET_SPEAKER: 0x03,
    SET_BG: 0x11,
    SET_BGM: 0x12,
    ADD_ROLE: 0x21,
    DEL_ROLE: 0x22,
    ADD_OPTION: 0x31,
}

export {
    EditorSectionType,
    InstructionHead,
}