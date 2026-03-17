export type AgeGroupKey = '3-5' | '6-9' | '9-12' | '13+';

export const coreValueAgeDescriptions = {
    1: {
        '3-5': 'Building basic manners, sharing, turn-taking, and recognizing emotions in self and others through play and daily interactions.',
        '6-9': 'At this stage, children are expanding their social world—forming deeper friendships, navigating group dynamics, and learning to cooperate beyond their family. These goals support empathy, manners, respect, and peer interaction.',
        '9-12': 'Children in this age range become more socially aware, value peer acceptance, and begin developing deeper friendships. They are also learning how to navigate complex social situations and build healthy relationships.',
        '13+': 'Teenagers are navigating more complex social environments, developing their identity, and learning how to form and maintain deeper relationships. Social maturity at this stage is foundational for adult interactions.'
    },

    2: {
        '3-5': 'These goals help children build pre-literacy, pre-math, thinking, and learning-to-learn skills in a playful, age-appropriate way.',
        '6-9': 'Between ages 6 and 9, children are laying the foundation for lifelong learning. They\'re learning how to focus, think critically, organize thoughts, and enjoy the process of gaining knowledge—not just memorizing facts.',
        '9-12': 'At this stage, children are transitioning into more complex thinking, deeper learning, and greater academic independence. Supporting strong habits now sets the tone for middle school and beyond.',
        '13+': 'Teens are expected to take more ownership of their learning, apply critical thinking, and prepare for long-term educational and career goals. This stage sets the tone for academic independence and discipline.'
    },

    3: {
        '3-5': 'These goals help children recognize, express, and manage their emotions, while also beginning to understand the emotions of others.',
        '6-9': 'In this age range, children are starting to gain better control over their emotions and reactions. They are learning how to express feelings in more appropriate ways and are starting to understand how their emotions affect their behavior and relationships.',
        '9-12': 'At this age, children are beginning to refine their emotional intelligence. They can identify and manage their emotions, empathize with others, and practice self-regulation in increasingly complex situations.',
        '13+': 'Teenagers are building emotional resilience, identity, and self-awareness. Supporting their emotional development equips them to manage complex feelings and life transitions confidently.'
    },

    4: {
        '3-5': 'This merged category focuses on helping children become more independent, observant, and capable through hands-on learning and decision-making.',
        '6-9': 'Children at this age begin developing independence and responsibility. They\'re ready to handle simple tasks on their own and learn how to think through challenges logically and creatively.',
        '9-12': 'Children in this age group begin to grasp more complex problem-solving skills and are able to think critically about everyday situations. They are also refining their independence and practical life skills.',
        '13+': 'At this age, teens should be practicing real-world independence, mastering essential life skills, and applying critical thinking to everyday decisions. This builds confidence, responsibility, and adaptability.'
    },

    5: {
        '3-5': 'These goals focus on building strong bodies, motor coordination, and healthy habits through active play and daily routines.',
        '6-9': 'At this age, children are becoming more coordinated and independent in caring for their bodies. Encouraging healthy habits and physical activity lays a foundation for lifelong wellness.',
        '9-12': 'Children in this age range are growing quickly, and developing healthy habits and an understanding of self-care is essential. They become more conscious of their physical appearance, health, and fitness while learning to balance nutrition and exercise.',
        '13+': 'Teens experience major physical changes and increased responsibilities for their health. Teaching them to care for their bodies builds a strong foundation for lifelong wellness.'
    },

    6: {
        '3-5': 'These goals help build a loving connection with faith, family values, and spiritual identity through simple and consistent actions.',
        '6-9': 'This is a beautiful age to nurture a child\'s connection to faith through love, routine, and understanding. Children begin to ask deeper questions, memorize prayers, and internalize values by watching how faith is lived at home.',
        '9-12': 'At this stage, children are deepening their understanding of their faith and values. They can begin to engage more fully in religious practices, understand the deeper meanings of faith, and develop a personal connection with their beliefs.',
        '13+': 'At this stage, teens are capable of deeper understanding, personal reflection, and taking more ownership of their faith. The goal is to nurture sincerity, consistency, and connection to purpose.'
    },

    7: {
        '3-5': 'These goals introduce basic money concepts and help children begin to understand the value of resources and thoughtful decision-making.',
        '6-9': 'This is a great age to introduce foundational money concepts. Children can start learning about needs vs. wants, saving, and the value of work, setting the stage for lifelong healthy money habits.',
        '9-12': 'At this stage, children are ready to start developing basic financial skills. This includes understanding money, saving, budgeting, and the value of work. These lessons can help build a foundation for good financial habits in the future.',
        '13+': 'Teenagers are ready to grasp complex financial concepts and begin practicing real money management. These skills foster independence, responsibility, and smart decision-making.'
    },

    8: {
        '3-5': 'These goals help children build a healthy relationship with technology through supervised exposure and clear rules.',
        '6-9': 'At this age, children are being introduced to technology more regularly. It\'s crucial to teach them how to use devices responsibly, balance screen time, and begin to understand the difference between safe and unsafe online behavior.',
        '9-12': 'As children begin using technology more frequently, it\'s crucial to help them develop digital literacy, understand online safety, and navigate media critically. This can set them up for a healthy relationship with technology as they grow.',
        '13+': 'Teens live in a digital world. Helping them navigate it safely, wisely, and responsibly is essential for their mental, emotional, and intellectual well-being.'
    },

    9: {
        '3-5': 'These goals nurture early awareness of community, kindness, responsibility, and active participation in shared spaces.',
        '6-9': 'Children at this stage are ready to understand their role in a broader community. Introducing service, responsibility, and community pride helps them grow into thoughtful, caring citizens.',
        '9-12': 'Children in this age range are developing a sense of responsibility toward their communities and understanding how they can make a positive impact. Teaching them about civic duty, respect for others, and community involvement sets the foundation for being an active, contributing member of society.',
        '13+': 'As teens grow, it\'s essential they learn their role in society and understand how they can positively contribute to their communities. This will help them build empathy, social responsibility, and leadership.'
    },

    10: {
        '3-5': 'These developmental goals nurture a child\'s ability to express ideas, emotions, and imagination through words, movement, art, and storytelling.',
        '6-9': 'At this age, children become more expressive through words, art, movement, and storytelling. They\'re also learning to listen better, speak clearly, and develop their own voice—all key to building confidence and creativity.',
        '9-12': 'At this stage, children are developing their ability to express themselves clearly and creatively. Whether through art, writing, speaking, or performing, encouraging creativity and communication helps build confidence and fosters social connections.',
        '13+': 'As teens develop, their ability to communicate creatively and express themselves becomes a crucial part of their identity. This includes their written, verbal, and artistic communication skills.'
    }
};

export const getCoreValueAgeDescription = (coreValueId: number, ageGroup: AgeGroupKey): string => {
    return coreValueAgeDescriptions[coreValueId as keyof typeof coreValueAgeDescriptions]?.[ageGroup] ||
        'Age-specific goals and development focus for this category.';
};
