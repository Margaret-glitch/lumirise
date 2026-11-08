const fs = require('fs');
const path = require('path');

const DATA_DIR = path.resolve(__dirname, '../data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

const COURSE_TITLES = [
  'Mathematics',
  'English Language',
  'Physics',
  'Biology',
  'Chemistry',
  'Introduction to Artificial Intelligence',
  'Prompt Engineering',
  'Generative AI',
  'AI Agents and Automation',
  'Machine Learning Fundamentals',
  'Data Science and AI Analytics',
  'Python for AI',
  'Chatbot Development',
  'AI Image and Video Creation',
  'AI-Powered App Development',
  'AI and Cybersecurity',
  'Robotics and AI',
  'AI and Large Language Models (LLMs)',
  'AI for Business and Digital Marketing',
  'AI Ethics and Responsible AI'
];

const CATEGORIES = [
  'Mathematics',
  'Humanities & Language',
  'Physics',
  'Biological Sciences',
  'Physical Sciences',
  'Artificial Intelligence',
  'Generative AI',
  'Generative AI',
  'Agentic AI',
  'Machine Learning',
  'Data Science',
  'Programming',
  'Conversational AI',
  'Computer Vision',
  'Full-Stack AI',
  'Cybersecurity',
  'Robotics',
  'LLM Foundations',
  'Digital Marketing',
  'AI Governance'
];

const INSTRUCTORS = [
  { name: 'Dr. Leonard Euler Vance', role: 'Professor of Mathematics', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&h=160&q=80', rating: 4.96 },
  { name: 'Prof. Alistair Sterling', role: 'Professor of English Literature', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&h=160&q=80', rating: 4.98 },
  { name: 'Dr. Richard Thorne', role: 'Theoretical Physicist', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&h=160&q=80', rating: 4.94 },
  { name: 'Dr. Rosalind Mercer', role: 'Molecular Biologist', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=160&h=160&q=80', rating: 4.95 },
  { name: 'Dr. Dmitri Mendeleev Chen', role: 'Physical Chemist', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=160&h=160&q=80', rating: 4.93 },
  { name: 'Dr. Elena Rostova', role: 'AI Research Scientist', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=160&h=160&q=80', rating: 4.97 },
];

console.log(`Generating all 20 courses with 6 modules and 30 lessons each (CommonJS)...`);

const expandedCourses = COURSE_TITLES.map((title, cIdx) => {
  const category = CATEGORIES[cIdx] || 'Education';
  const instructor = INSTRUCTORS[cIdx % INSTRUCTORS.length];
  const modules = [];
  const moduleTitles = [
    'Foundations & Core Principles',
    'Intermediate Concepts & Methods',
    'Advanced Theories & Architectures',
    'Practical Implementation & Workflows',
    'Case Studies & Industry Applications',
    'Mastery, Optimization & Future Trends'
  ];

  for (let m = 1; m <= 6; m++) {
    const lessons = [];
    for (let l = 1; l <= 5; l++) {
      lessons.push({
        id: `c${cIdx + 1}-m${m}-l${l}`,
        title: `${title} - Module ${m} Lesson ${l}`,
        duration: '25 min',
        durationMinutes: 25,
        completed: false,
        type: l % 2 === 0 ? 'reading' : 'video',
        description: `Comprehensive study of ${title} concepts in Module ${m}, Lesson ${l}.`,
        detailedContent: `In this lesson on ${title} (Module ${m}, Lesson ${l}), we examine core methodologies, theoretical frameworks, and practical problem-solving techniques. Understanding these principles is essential for independent mastery and professional application.\n\nKey areas covered include systematic analysis, real-world constraints, structural design patterns, and optimization strategies. By mastering this material, students gain the analytical tools necessary to tackle complex challenges independently without requiring continuous teacher intervention.`,
        summary: `Mastery of ${title} Module ${m} Lesson ${l} principles enables robust independent problem-solving and technical proficiency.`,
        examples: [
          {
            title: `Practical Application in ${title}`,
            description: `Step-by-step case study illustrating how ${title} concepts are applied in real-world professional environments.`,
            codeOrCaseStudy: `// Practical Case Study Example\nfunction executeWorkflow() {\n  return 'Completed successfully';\n}`
          }
        ],
        quiz: [
          {
            id: `q-${cIdx}-${m}-${l}`,
            question: `What is the primary objective of studying ${title} Module ${m} Lesson ${l}?`,
            options: [
              'To memorize historical definitions without application',
              'To master core concepts and practical problem-solving methodologies',
              'To bypass foundational principles entirely',
              'To test hardware thermal limits'
            ],
            correctIndex: 1,
            explanation: `Lesson ${l} focuses on building deep practical competence and theoretical clarity in ${title}.`
          }
        ],
        revisionQuestions: [
          `How do the principles covered in Lesson ${l} apply to real-world scenarios in ${category}?`,
          `What are the primary performance trade-offs encountered in this domain?`
        ],
        keyTakeaways: [
          `Foundational clarity in ${title} drives advanced problem-solving.`,
          `Structured methodology ensures reproducible results.`,
          `Continuous practice reinforces conceptual retention.`
        ]
      });
    }

    modules.push({
      id: `course-${cIdx + 1}-m${m}`,
      number: m,
      title: moduleTitles[m - 1],
      description: `Comprehensive module ${m} covering ${moduleTitles[m - 1].toLowerCase()} for ${title}.`,
      totalDuration: '2h 30m',
      lessons
    });
  }

  return {
    id: `course-${cIdx + 1}-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    orderNumber: cIdx + 1,
    title,
    subtitle: `Mastering ${title} from foundational principles to advanced applications.`,
    description: `An intensive, comprehensive educational programme in ${title}, structured into 6 modules and 30 detailed lessons.`,
    category,
    level: 'Beginner to Advanced',
    duration: '18h 00m',
    totalLessons: 30,
    rating: 4.95,
    reviewCount: 420,
    enrolledStudents: '12,500+',
    instructor: {
      name: instructor.name,
      role: instructor.role,
      avatar: instructor.avatar,
      rating: instructor.rating,
      studentsCount: '25,000+',
      bio: 'Renowned educator and domain expert dedicated to practical student mastery.'
    },
    tags: [title, category, 'Masterclass', 'LumiRise'],
    bannerColor: 'bg-indigo-600',
    accentColor: '#4F46E5',
    status: 'published',
    modules
  };
});

let db = {};
if (fs.existsSync(DB_FILE)) {
  db = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
}
db.courses = expandedCourses;
fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');

const allCoursesTsContent = `import { Course } from '../types/education';\n\nexport const initial20Courses: Course[] = ${JSON.stringify(expandedCourses, null, 2)};\n`;
fs.writeFileSync(path.resolve(__dirname, '../src/data/allCourses.ts'), allCoursesTsContent, 'utf-8');

console.log('Successfully generated all 20 courses with 6 modules and 30 lessons each (600 lessons total)!');
