export interface LessonExample {
  title: string;
  description: string;
  codeOrCaseStudy?: string;
}

export interface LessonQuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Definition {
  term: string;
  definition: string;
  example?: string;
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  durationMinutes: number;
  completed: boolean;
  type: 'video' | 'reading' | 'exercise' | 'quiz';
  description?: string;
  detailedContent?: string;
  summary?: string;
  definitions?: Definition[];
  examples?: LessonExample[];
  quiz?: LessonQuizQuestion[];
  revisionQuestions?: string[];
  keyTakeaways: string[];
  resources?: { name: string; size: string; type: string }[];
}

export interface Module {
  id: string;
  number: number;
  title: string;
  description: string;
  totalDuration: string;
  lessons: Lesson[];
}

export interface WritingPrompt {
  id: string;
  category: 'Essay' | 'Formal Letter' | 'Informal Letter' | 'Creative Writing' | 'Summary Writing' | 'Report Writing';
  title: string;
  prompt: string;
  targetWordCount: number;
  rubrics: string[];
  sampleStarter?: string;
}

export interface WritingSubmission {
  id: string;
  promptId: string;
  category: string;
  title: string;
  content: string;
  wordCount: number;
  submittedAt: string;
  status: 'draft' | 'evaluated';
  aiFeedback?: {
    overallScore: number;
    grammarScore: number;
    vocabularyScore: number;
    structureScore: number;
    strengths: string[];
    improvements: string[];
    detailedAnalysis: string;
    evaluatedAt: string;
  };
}

export interface Course {
  id: string;
  orderNumber?: number;
  title: string;
  subtitle: string;
  description?: string;
  learningObjectives?: string[];
  importantDefinitions?: Definition[];
  finalTest?: QuizQuestion[] | {
    id?: string;
    title?: string;
    description?: string;
    timeLimitMinutes?: number;
    passingScorePercent?: number;
    questions: QuizQuestion[];
  };
  writingPrompts?: WritingPrompt[];
  status: 'draft' | 'review' | 'published';
  createdAt?: string;
  updatedAt?: string;
  instructor: {
    name: string;
    role: string;
    avatar: string;
    rating: number;
    studentsCount: string;
    bio: string;
  };
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Beginner to Advanced' | 'Beginner to Intermediate' | 'Intermediate to Advanced' | string;
  rating: number;
  reviewCount: number;
  enrolledStudents: string;
  duration: string;
  totalLessons: number;
  tags: string[];
  bannerColor: string;
  accentColor: string;
  category: string;
  price?: number; // Price in NGN, e.g. 15000
  isFree?: boolean;
  modules: Module[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Note {
  id: string;
  courseId?: string;
  lessonId: string;
  timestamp: string;
  text: string;
  createdAt?: string;
}

export interface PaymentRecord {
  id: string;
  userId: string;
  studentEmail: string;
  studentName?: string;
  courseId: string;
  courseTitle: string;
  reference: string;
  amount: number; // in NGN
  currency: string;
  status: 'success' | 'failed' | 'pending' | 'abandoned';
  paidAt?: string;
  createdAt: string;
  channel?: string;
  metadata?: any;
}

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
  streak: number;
  enrolledCourseIds: string[];
  completedLessonIds: string[];
}

export interface GenerateCourseParams {
  topic: string;
  targetAudience: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  moduleCount?: number;
  specialInstructions?: string;
}
