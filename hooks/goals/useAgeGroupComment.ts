export const ageGroupDescriptions = {
    "3-5": {
        label: 'Age 3–5',
        description: 'This age isn’t about deep theology. It’s about planting seeds through love, joy, and repetition. Think stories, songs, and modeling faith in everyday life.'
    },
    "6-9": {
        label: 'Age 6–9',
        description: 'Develop empathy, conflict resolution skills, teamwork, and understanding of social boundaries in school and peer settings.'
    },
    "9-12": {
        label: 'Age 9–12',
        description: 'Build leadership skills, digital etiquette, accountability, and navigate complex social dynamics and peer pressure situations.'
    },
    "13+": {
        label: 'Age 12+',
        description: 'Master advanced communication, responsible decision-making, independent conflict resolution, and develop mature relationships.'
    }
};

export type AgeGroupKey = keyof typeof ageGroupDescriptions;