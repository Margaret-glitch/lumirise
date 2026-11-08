import { Course, QuizQuestion } from '../types/education';

export const primaryCourse: Course = {
  id: 'uiux-masterclass',
  title: 'UI/UX Design Concept & Systems',
  subtitle: 'Master wireframing, typography scales, Figma auto-layout, and interactive prototype delivery for modern digital products.',
  description: 'An end-to-end masterclass in building modern, flat, accessible, and high-conversion digital experiences. Learn the secrets of auto-layout, design tokens, responsive breakpoints, and ergonomic mobile interfaces.',
  status: 'published',
  category: 'Design Systems',
  createdAt: '2026-10-20',
  updatedAt: '2026-10-27',
  instructor: {
    name: 'Saiful Ahmed',
    role: 'Lead Product & UI/UX Designer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&h=160&q=80',
    rating: 4.95,
    studentsCount: '24,800+',
    bio: 'Senior design practitioner specializing in flat design systems, mobile app architectures, and minimalist design ergonomics.',
  },
  level: 'Beginner',
  rating: 4.9,
  reviewCount: 1840,
  enrolledStudents: '12,450',
  duration: '8h 45m',
  totalLessons: 15,
  tags: ['Figma', 'UI Design', 'Wireframing', 'Design Systems', 'Mobile App'],
  bannerColor: 'bg-indigo-600',
  accentColor: '#4F46E5',
  modules: [
    {
      id: 'mod-1',
      number: 1,
      title: 'Design Principles & Spatial Grids',
      description: 'Understanding visual hierarchy, the 8-point spatial grid, and content-first wireframing.',
      totalDuration: '1h 35m',
      lessons: [
        {
          id: 'les-1-1',
          title: 'Introduction to Flat UI & Minimalist Ergonomics',
          duration: '14 min',
          durationMinutes: 14,
          completed: true,
          type: 'video',
          description: 'Explore the foundations of flat design, color contrast balance, and typography pairing without skeuomorphic clutter.',
          detailedContent: `Flat design is an intentional design philosophy that strips away decorative skeuomorphism—such as excessive gradients, heavy drop shadows, and bevels—in favor of clean geometric surfaces, bold typography, and disciplined color harmony.

When designing for modern screens, flat design drastically reduces visual friction and cognitive load. By focusing on layout rhythm, spatial alignment, and high-contrast typography, users perceive information much faster.

Key Pillars of Minimalist Flat UI:
1. Strict 60-30-10 Color Budget: 60% dominant neutral backdrop, 30% structural surfaces (hairline dividers, subtle card tones), and 10% high-intent focal accents on primary actions.
2. Zero-Pill Discipline: Static metadata (read times, categories, author credits) should be clean unboxed text separated by typographic glyphs ('·' or '/'), rather than wrapped in colorful bubble badges.
3. Purposeful Hierarchy: Lead with primary data anchors rather than ornamental boxes.`,
          summary: 'Flat UI replaces glossy skeuomorphism with crisp geometric hierarchy, 60-30-10 color allocation, and zero-pill typographic discipline.',
          examples: [
            {
              title: 'Mobile Navigation Bar Refactoring',
              description: 'Transforming a skeuomorphic glossy glass bar into a flat 1px bordered toolbar.',
              codeOrCaseStudy: '// Flat Design Toolbar Contract\n<div className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200">\n  <span className="font-bold text-slate-900">Brand</span>\n  <nav className="flex gap-6 text-sm text-slate-600">...</nav>\n</div>',
            },
          ],
          quiz: [
            {
              id: 'q-1-1',
              question: 'In clean flat design, how should static metadata such as dates or read times be rendered?',
              options: [
                'In rounded candy pill boxes with drop shadows',
                'As clean unboxed text separated by subtle typographic dividers like "·"',
                'Inside 3D embossed capsules',
                'Prefixed with code comments like "// DATE:"'
              ],
              correctIndex: 1,
              explanation: 'Static metadata is best presented as quiet, unboxed text to avoid visual clutter and "pill fatigue".',
            },
          ],
          keyTakeaways: [
            'Avoid heavy gradients and drop shadows in favor of crisp spatial alignment.',
            'Establish 60-30-10 color allocation for focused cognitive load.',
            'Embrace intentional whitespace as an active structural element.',
          ],
          resources: [
            { name: 'Flat_Design_CheatSheet.pdf', size: '1.2 MB', type: 'PDF' },
            { name: 'Grid_System_Starter.fig', size: '3.4 MB', type: 'FIG' },
          ],
        },
        {
          id: 'les-1-2',
          title: 'Mastering the 8pt Grid & Typography Hierarchy',
          duration: '22 min',
          durationMinutes: 22,
          completed: true,
          type: 'video',
          description: 'How to calculate padding math, baseline line heights, and rhythmic vertical spacing.',
          detailedContent: `The 8-point grid is the universal foundation for digital interfaces. Because standard device display pixel densities scale mathematically by factors of 1x, 2x, 3x, and 4x, aligning all spacing, margins, padding, and component heights to multiples of 8 (with a 4pt subgrid) guarantees pixel-perfect rendering across all screens.

Formula for Container Containment:
r_inner = r_outer - padding
Container outer padding must always be greater than or equal to inner gap between child elements to avoid visual crowding.`,
          summary: 'Multiples of 8px create predictable, harmonious visual cadence across buttons, cards, and text baselines.',
          examples: [
            {
              title: 'Card Padding Calculation',
              description: 'Using 16px outer container padding with an 8px inner gap between title and description.',
              codeOrCaseStudy: 'padding: 16px;\ngap: 8px;\nborder-radius: 12px;\ninner_element_radius: 4px;',
            },
          ],
          quiz: [
            {
              id: 'q-1-2',
              question: 'Why is the 8pt grid standard across iOS and Android?',
              options: [
                'Because 8 is a lucky number in software engineering',
                'Because display density scales cleanly across 1x, 2x, 3x, and 4x screen resolutions without fractional pixels',
                'Because fonts can only be rendered in 8px increments',
                'It is only used on desktop screens'
              ],
              correctIndex: 1,
              explanation: '8 scales cleanly across retina and high-density viewports, preventing blurry fractional subpixels.',
            },
          ],
          keyTakeaways: [
            'All margins, paddings, and component heights adhere to multiples of 4 and 8.',
            'Outer container padding must always exceed inner child gap.',
            'Maintain strict line-height ratios (1.5x - 1.7x) for paragraph body text.',
          ],
          resources: [
            { name: 'Typography_Scale_Calculator.xlsx', size: '240 KB', type: 'XLS' },
          ],
        },
        {
          id: 'les-1-3',
          title: 'Visual Hierarchy & Negative Space Mastery',
          duration: '18 min',
          durationMinutes: 18,
          completed: true,
          type: 'exercise',
          description: 'Hands-on task: Refactoring a noisy dashboard card into a clean, scannable flat layout.',
          detailedContent: `Negative space is not empty space; it is an active design element that guides the human eye. When visual elements are too close together, the human brain expends significant energy parsing where one boundary ends and the next begins.

By applying deliberate spatial groupings (Gestalt laws of proximity and continuity), you communicate relationship and importance without relying on artificial dividers.`,
          summary: 'Use whitespace margins and typographic weight variation to establish hierarchy instead of adding redundant borders.',
          examples: [
            {
              title: 'Gestalt Proximity in Product Cards',
              description: 'Grouping price, title, and action with 4px inner spacing, while separating unrelated cards with 24px margins.',
            },
          ],
          keyTakeaways: [
            'Lead with primary data anchors rather than ornamental pill chips.',
            'Use typographic scale (weight and size) instead of multiple bright colors to denote importance.',
          ],
          resources: [
            { name: 'Exercise_01_Hierarchy_Starter.fig', size: '2.1 MB', type: 'FIG' },
          ],
        },
        {
          id: 'les-1-4',
          title: 'Module 1 Knowledge Check: Foundations',
          duration: '15 min',
          durationMinutes: 15,
          completed: false,
          type: 'quiz',
          description: 'Test your understanding of grid systems, typography, and clean metadata alignment.',
          summary: 'Review questions testing comprehension of spatial units, line-height math, and flat visual hierarchy.',
          keyTakeaways: [
            'Verify mastery of 8pt spatial rhythm.',
            'Confirm ability to diagnose visual hierarchy errors.',
          ],
        },
      ],
    },
    {
      id: 'mod-2',
      number: 2,
      title: 'Components, Auto Layout & Atomic UI',
      description: 'Building bulletproof responsive components using Figma auto-layout and variant properties.',
      totalDuration: '2h 15m',
      lessons: [
        {
          id: 'les-2-1',
          title: 'Anatomy of the Perfect Lesson Card',
          duration: '26 min',
          durationMinutes: 26,
          completed: false,
          type: 'video',
          description: 'Step-by-step recreation of Saiful Ahmed’s iconic lesson cards featuring duration, progress state, and icon anchors.',
          detailedContent: `A lesson card must communicate three things in under 500 milliseconds:
1. What is this lesson about? (Clean title with single-line truncation)
2. How long will it take? (Duration in minutes, tabular figures)
3. Have I finished it? (Distinct completion checkmark or active play trigger)

By placing the completion affordance on the left and the playback trigger on the right, the eye travels naturally across the information path.`,
          summary: 'A well-crafted lesson card gives immediate status, duration, and access without unnecessary visual noise.',
          examples: [
            {
              title: 'Card Interaction States',
              description: 'Default (border-slate-200), Hover (border-slate-300 + subtle lift), Active/Current (ring-1 ring-indigo-500 bg-indigo-50/60).',
            },
          ],
          keyTakeaways: [
            'Single-line text truncations ensure resilience on narrow screens.',
            'Play trigger states with micro-hover feedback (transform scale 1.02).',
            'Subtle 1px border with 0 elevation for authentic flat design feel.',
          ],
          resources: [
            { name: 'Saiful_Lesson_Cards_Kit.fig', size: '4.8 MB', type: 'FIG' },
          ],
        },
        {
          id: 'les-2-2',
          title: 'Building Resilient Segmented Controls & Tabs',
          duration: '20 min',
          durationMinutes: 20,
          completed: false,
          type: 'video',
          description: 'Avoid pills and badges for static text, and build functional segmented button controls for view switching.',
          detailedContent: `Segmented controls are interactive state switchers. They must look like a solid physical group of switches:
- A shared pill or rounded-lg trough container in a light neutral (slate-100).
- White button for the active segment with a micro shadow-sm.
- Muted text for inactive segments with clear hover feedback.`,
          summary: 'Segmented controls group related modes (e.g. All, Videos, Quizzes) into a single cohesive control.',
          keyTakeaways: [
            'Differentiating active interactive buttons from unboxed text metadata.',
            'Keyboard focus states with visible focus-visible outline rings.',
          ],
          resources: [
            { name: 'Segmented_Control_Variants.fig', size: '1.9 MB', type: 'FIG' },
          ],
        },
        {
          id: 'les-2-3',
          title: 'Course Navigation & Top Bar Contract',
          duration: '19 min',
          durationMinutes: 19,
          completed: false,
          type: 'reading',
          description: 'Architecting the 3-zone header: wordmark brand, concise nav links, single primary action.',
          detailedContent: `The Top Bar Contract guarantees a predictable, clutter-free navigation experience:
Zone 1: Brand title / wordmark in 1 line.
Zone 2: 4 to 5 concise navigation links, single-line text with hover underline.
Zone 3: 1 primary CTA or user session control.

No floating marketing badges, no second rows of status tickers, and no mode toggles jammed next to the brand name.`,
          summary: 'Keep headers focused on brand, core navigation, and primary user profile/action.',
          keyTakeaways: [
            'Zero decorative status dots or fake telemetry tickers.',
            'Maintain strict single-row desktop layout without wrapping.',
          ],
        },
      ],
    },
    {
      id: 'mod-3',
      number: 3,
      title: 'Interactive Learning Experience & Flows',
      description: 'Designing intuitive student progress tracking, quizzes, and note-taking interfaces.',
      totalDuration: '2h 40m',
      lessons: [
        {
          id: 'les-3-1',
          title: 'Designing Focused Video & Audio Players',
          duration: '28 min',
          durationMinutes: 28,
          completed: false,
          type: 'video',
          description: 'UX patterns for distraction-free media playback, speed toggling, and keyboard shortcuts.',
          detailedContent: `Educational media players require distinct UX considerations compared to entertainment apps.
Students frequently scrub backward to replay difficult concepts, toggle between 1.0x, 1.25x, and 1.5x playback speeds, and bookmark specific timestamps for revision.

Controls should be minimal, accessible, and high-contrast, with keyboard shortcuts for play/pause (Space), seek (Arrow keys), and speed cycling.`,
          summary: 'Optimize player controls for comprehension, speed adjustment, and note synchronization.',
          keyTakeaways: [
            'Keep playback controls accessible without blocking video canvas.',
            'Provide immediate visual timestamp markers and playback rate adjustments.',
          ],
        },
        {
          id: 'les-3-2',
          title: 'Real-Time Note Taking & Timestamp Bookmarking',
          duration: '24 min',
          durationMinutes: 24,
          completed: false,
          type: 'video',
          description: 'How to structure in-context note taking synchronized with lesson milestones.',
          detailedContent: `Synchronized note taking allows learners to write thoughts that automatically link to the current player timestamp (e.g. '03:42'). When clicking the note later, the player jumps straight to that moment in the lecture.`,
          summary: 'Timestamped notes allow learners to review key concepts in seconds.',
          keyTakeaways: [
            'Autosave drafts without blocking the primary view.',
            'Clean export to Markdown or PDF.',
          ],
        },
      ],
    },
  ],
};

export const sampleQuizQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'In flat UI design, how should static metadata (such as lesson duration or category) be presented?',
    options: [
      'Wrapped in brightly colored candy pill badges with drop shadows',
      'As clean unboxed text separated by typographic glyphs like "·" or "/"',
      'Inside 3D skeuomorphic embossed capsules',
      'Prefixed with code-comment syntax like "// 01_DURATION"'
    ],
    correctIndex: 1,
    explanation: 'Correct! Anti-slop and flat design principles emphasize clean unboxed metadata with subtle typographic separators, keeping badges reserved only for interactive clickable filters.',
  },
  {
    id: 'q2',
    question: 'What is the primary rule for the 8pt spatial grid system when calculating padding?',
    options: [
      'Inner gap between children must be larger than container padding',
      'Container outer padding should be greater than or equal to inner spacing between child elements',
      'All spacing values must be odd numbers like 7px or 13px',
      'Padding should always be zero to pack maximum elements'
    ],
    correctIndex: 1,
    explanation: 'Exactly! Container outer padding >= inner gap prevents visual claustrophobia and preserves proper visual containment math.',
  },
  {
    id: 'q3',
    question: 'What is the 60-30-10 color allocation rule in clean UI design?',
    options: [
      '60% neon gradients, 30% animations, 10% dark borders',
      '60% neutral canvas, 30% structural surfaces/dividers, 10% intentional focal accent',
      '60% primary color, 30% secondary color, 10% white',
      '60% random colors, 30% black text, 10% transparent buttons'
    ],
    correctIndex: 1,
    explanation: 'Spot on! The 60-30-10 rule ensures 60% neutral background, 30% clean structural surfaces, and 10% high-intent focal color on primary actions.',
  },
  {
    id: 'q4',
    question: 'According to the Top Bar contract, what should the primary navigation header contain?',
    options: [
      'Floating badges, weather tickers, mode toggles, and three search bars',
      'Exactly 3 zones: Brand title, 4-5 concise single-line nav links, and 1 primary action',
      'As many dropdowns and secondary icons as can fit in the viewport',
      'A 3-row layout with sub-brand cards and promotional tickers'
    ],
    correctIndex: 1,
    explanation: 'Correct! The 3-zone contract guarantees clean, single-line legibility and zero visual clutter in the top bar.',
  },
];
