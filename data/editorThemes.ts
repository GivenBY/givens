export interface EditorTheme {
    value: string;
    label: string;
    description?: string;
}

export const editorThemes: EditorTheme[] = [
    {
        value: 'default',
        label: 'Default',
        description: 'Default Prism theme'
    },
    {
        value: 'dark',
        label: 'Dark',
        description: 'Dark theme for better visibility'
    },
    {
        value: 'coy',
        label: 'Coy',
        description: 'Light theme with subtle colors'
    },
    {
        value: 'tomorrow',
        label: 'Tomorrow',
        description: 'Dark theme with soft colors'
    },
    {
        value: 'twilight',
        label: 'Twilight',
        description: 'Dark theme with high contrast'
    },
    {
        value: 'one-dark',
        label: 'One Dark',
        description: 'Atom One Dark theme'
    },
    {
        value: 'solarizedlight',
        label: 'Solarized Light',
        description: 'Light theme with warm tones'
    },
    {
        value: 'okaidia',
        label: 'Okaidia',
        description: 'Dark theme inspired by Sublime Text'
    },
    {
        value: 'dracula',
        label: 'Dracula',
        description: 'Popular dark theme'
    },
    {
        value: 'gruvbox',
        label: 'Gruvbox',
        description: 'Retro groove color scheme'
    }
];
