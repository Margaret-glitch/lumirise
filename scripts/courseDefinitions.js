// Script to seed all 20 LumiRise courses into database.json
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.resolve(__dirname, '../data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export const COURSE_DEFINITIONS = [
  {
    id: 'course-1-mathematics',
    orderNumber: 1,
    title: 'Mathematics',
    subtitle: 'From foundational algebra and geometry to calculus, vectors, and mathematical modeling.',
    category: 'Mathematics',
    level: 'Beginner to Advanced',
    duration: '14h 30m',
    instructor: {
      name: 'Dr. Leonard Euler Vance',
      role: 'Professor of Pure & Applied Mathematics',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&h=160&q=80',
      rating: 4.96,
      studentsCount: '38,200+',
      bio: 'Author and mathematician dedicated to intuitive proofs, spatial geometry, and practical computational mathematics.',
    },
    learningObjectives: [
      'Master core algebraic manipulations, linear systems, and polynomial functions.',
      'Understand Euclidean geometry, trigonometry, and coordinate geometry transformations.',
      'Develop intuition for differential and integral calculus and their real-world applications.',
      'Apply discrete mathematics, probability distributions, and statistical inference.',
    ],
    importantDefinitions: [
      { term: 'Function', definition: 'A mathematical relation that uniquely maps every element of a domain set to an element in a codomain set.' },
      { term: 'Derivative', definition: 'The instantaneous rate of change of a function with respect to its independent variable, representing the tangent slope.' },
      { term: 'Matrix', definition: 'A rectangular array of numbers or expressions arranged in rows and columns, used to represent linear transformations.' },
      { term: 'Eigenvalue', definition: 'A scalar factor by which an eigenvector is scaled under a linear transformation without changing its directional line.' },
    ],
    modules: [
      {
        id: 'math-m1',
        number: 1,
        title: 'Algebra, Functions & Coordinate Geometry',
        description: 'Linear equations, quadratic functions, coordinate systems, and polynomial factoring.',
        totalDuration: '4h 15m',
        lessons: [
          {
            id: 'math-1-1',
            title: 'Linear Systems and Matrix Inversion',
            duration: '25 min',
            durationMinutes: 25,
            completed: false,
            type: 'video',
            description: 'Solving multi-variable linear equation systems using Gaussian elimination and matrix operations.',
            detailedContent: `Linear algebra provides the mathematical language of both classical engineering and modern computation. A linear system of n equations with n unknowns can be compactly represented as Ax = b, where A is the coefficient matrix, x is the vector of variables, and b is the vector of constants.

When the determinant of matrix A is non-zero (det(A) ≠ 0), the matrix is non-singular and invertible, guaranteeing a unique solution x = A⁻¹b. In computational practice, direct inversion is often replaced by Gaussian elimination with partial pivoting or LU decomposition, which are numerically stable and computationally efficient (O(n³)).

Understanding linear transformations geometrically reveals how matrices shear, rotate, and scale coordinate spaces. Every linear mapping preserves vector addition (T(u + v) = T(u) + T(v)) and scalar multiplication (T(cu) = cT(u)), keeping the origin fixed in space.`,
            summary: 'Linear systems Ax = b have unique solutions when matrix A is invertible, solvable via Gaussian elimination and matrix decomposition.',
            definitions: [
              { term: 'Determinant', definition: 'A scalar property of a square matrix that indicates whether the system has a unique solution and measures volumetric scaling.' },
            ],
            examples: [
              {
                title: 'Solving 2x2 System',
                description: 'Solve 2x + 3y = 8 and 4x - y = 2 using matrix equations.',
                codeOrCaseStudy: 'A = [[2, 3], [4, -1]], b = [8, 2]\ndet(A) = (2)(-1) - (3)(4) = -14 ≠ 0\nx = 1, y = 2',
              },
            ],
            quiz: [
              {
                id: 'qm-1-1',
                question: 'Under what condition does a square matrix A have a unique inverse?',
                options: ['det(A) = 0', 'det(A) ≠ 0', 'All matrix entries must be positive integers', 'The matrix must have an odd number of rows'],
                correctIndex: 1,
                explanation: 'A matrix is invertible if and only if its determinant is non-zero, meaning its columns are linearly independent.',
              },
            ],
            revisionQuestions: [
              'Explain why Gaussian elimination is preferred over computing matrix inverses directly for large systems.',
              'What geometric transformation occurs when det(A) is negative?',
            ],
            keyTakeaways: [
              'Ax = b models intersections of hyperplanes in n-dimensional space.',
              'Non-zero determinants guarantee linear independence and unique solutions.',
              'Matrix operations are the computational engine of scientific simulations.',
            ],
          },
          {
            id: 'math-1-2',
            title: 'Quadratic Curves and Conic Sections',
            duration: '28 min',
            durationMinutes: 28,
            completed: false,
            type: 'reading',
            description: 'Parabolas, ellipses, hyperbolas, and their geometric properties in physics and optics.',
            detailedContent: `Conic sections are the curves formed by the intersection of a plane and a double right circular cone. Depending on the plane's angle of incidence relative to the cone's axis, four classical curves arise: circles, ellipses, parabolas, and hyperbolas.

All conics share a unified geometric locus definition: the set of points whose distance to a fixed point (focus) divided by their distance to a fixed line (directrix) is a constant ratio called eccentricity (e).
- e = 0: Circle
- 0 < e < 1: Ellipse (orbits of planets and satellites)
- e = 1: Parabola (reflectors, projectile paths under gravity)
- e > 1: Hyperbola (gravitational slingshots, sonic boom wavefronts)

In Cartesian form, the general second-degree polynomial equation Ax² + Bxy + Cy² + Dx + Ey + F = 0 describes all conics. Evaluating the discriminant B² - 4AC classifies the curve instantly.`,
            summary: 'Conic sections are unified by the eccentricity ratio e = distance(focus) / distance(directrix), dictating planetary orbits and optical reflection.',
            definitions: [
              { term: 'Eccentricity (e)', definition: 'The ratio measuring how much a conic section deviates from being circular.' },
            ],
            examples: [
              {
                title: 'Parabolic Reflective Property',
                description: 'Light rays parallel to the parabola axis of symmetry reflect precisely into the focal point, enabling radar dishes and solar concentrators.',
              },
            ],
            quiz: [
              {
                id: 'qm-1-2',
                question: 'Which eccentricity value corresponds to an elliptical orbit?',
                options: ['e = 0', '0 < e < 1', 'e = 1', 'e > 1'],
                correctIndex: 1,
                explanation: 'Ellipses have eccentricity strictly between 0 and 1, as observed in Keplerian planetary orbits.',
              },
            ],
            revisionQuestions: [
              'Derive the focal length of a parabola with standard equation y² = 4ax.',
              'How does the discriminant B² - 4AC identify whether an equation is hyperbolic?',
            ],
            keyTakeaways: [
              'Planets orbit in elliptical paths with the sun at one focus.',
              'Parabolic mirrors reflect incoming parallel rays to a single focal point.',
              'The discriminant B² - 4AC classifies second-degree algebraic curves.',
            ],
          },
        ],
      },
      {
        id: 'math-m2',
        number: 2,
        title: 'Differential & Integral Calculus',
        description: 'Limits, instantaneous rates of change, optimization, integration, and area under curves.',
        totalDuration: '5h 10m',
        lessons: [
          {
            id: 'math-2-1',
            title: 'Limits and Continuity from First Principles',
            duration: '22 min',
            durationMinutes: 22,
            completed: false,
            type: 'video',
            description: 'The epsilon-delta formalization of limits and computing indeterminate forms.',
            detailedContent: `Calculus is fundamentally the mathematics of change and approximation. The formal definition of a limit states that lim_{x→c} f(x) = L if for every ε > 0, there exists a δ > 0 such that whenever 0 < |x - c| < δ, |f(x) - L| < ε.

Understanding limits allows us to resolve apparent mathematical paradoxes where expressions yield indeterminate forms like 0/0 or ∞/∞. L'Hôpital's Rule provides a rigorous mechanism: when direct substitution yields 0/0 or ±∞/±∞ for differentiable functions, lim f(x)/g(x) = lim f'(x)/g'(x).

Continuity at a point requires three conditions: f(c) is defined, the limit as x approaches c exists, and the limit equals f(c). Continuous functions across closed intervals guarantee the Intermediate Value Theorem and Extreme Value Theorem.`,
            summary: 'Limits formalize infinitesimal behavior, resolving indeterminate forms and establishing mathematical continuity.',
            definitions: [
              { term: 'Indeterminate Form', definition: 'An algebraic expression like 0/0 or ∞/∞ whose limit cannot be determined by direct substitution alone.' },
            ],
            examples: [
              {
                title: 'Limit of sin(x)/x as x approaches 0',
                description: 'By the Squeeze Theorem, cos(x) ≤ sin(x)/x ≤ 1, proving that the limit equals 1.',
                codeOrCaseStudy: 'lim_{x→0} (sin x)/x = 1',
              },
            ],
            quiz: [
              {
                id: 'qm-2-1',
                question: 'When can L’Hôpital’s Rule be legally applied to a quotient f(x)/g(x)?',
                options: ['Whenever f(x) is larger than g(x)', 'Only when substitution yields an indeterminate form like 0/0 or ±∞/±∞', 'Whenever the denominator is an odd number', 'Only for linear polynomials'],
                correctIndex: 1,
                explanation: 'L’Hôpital’s Rule is strictly valid when evaluating indeterminate forms 0/0 or ±∞/±∞ for differentiable functions.',
              },
            ],
            revisionQuestions: [
              'State the three conditions required for a function to be continuous at x = a.',
              'Compute the limit of (x² - 9)/(x - 3) as x approaches 3.',
            ],
            keyTakeaways: [
              'Limits underpin both derivatives (instantaneous rates) and integrals (continuous sums).',
              'L’Hôpital’s Rule evaluates differentiable indeterminate ratios.',
              'The Intermediate Value Theorem requires unbroken continuity across an interval.',
            ],
          },
          {
            id: 'math-2-2',
            title: 'The Fundamental Theorem of Calculus',
            duration: '32 min',
            durationMinutes: 32,
            completed: false,
            type: 'video',
            description: 'Bridging differentiation and integration: the cumulative area function and definite integrals.',
            detailedContent: `Before the 17th century, differentiation (tangent problems) and integration (quadrature/area problems) were treated as entirely separate mathematical puzzles. Isaac Newton and Gottfried Wilhelm Leibniz independently discovered the profound inverse relationship: differentiation and integration are inverse operations.

The Fundamental Theorem of Calculus Part 1 asserts that if f is continuous on [a, b], the accumulation function F(x) = ∫_a^x f(t)dt is differentiable, and F'(x) = f(x).

Part 2 establishes that the definite integral ∫_a^b f(x)dx can be computed simply by evaluating F(b) - F(a), where F is any antiderivative of f. This transformed integration from exhausting limit summations (Riemann sums) into straightforward algebraic anti-differentiation.`,
            summary: 'The Fundamental Theorem connects rates of change to accumulated quantities: ∫_a^b f(x)dx = F(b) - F(a).',
            definitions: [
              { term: 'Antiderivative', definition: 'A differentiable function F whose derivative is equal to the original function f (F\' = f).' },
            ],
            examples: [
              {
                title: 'Calculating Work Done by Variable Force',
                description: 'Work = ∫_a^b F(x)dx. For a spring following Hooke\'s Law F = kx, Work = ∫_0^x kx dx = 1/2 kx².',
              },
            ],
            quiz: [
              {
                id: 'qm-2-2',
                question: 'What does the Fundamental Theorem of Calculus Part 2 compute?',
                options: ['The derivative of an unknown constant', 'The definite integral ∫_a^b f(x)dx via F(b) - F(a)', 'The tangent slope at infinity', 'The determinant of a 3x3 matrix'],
                correctIndex: 1,
                explanation: 'Part 2 evaluates definite integrals using the difference of antiderivatives at the interval boundaries.',
              },
            ],
            revisionQuestions: [
              'Explain in your own words why differentiation and integration are inverse processes.',
              'Evaluate the definite integral of x³ from x = 0 to x = 2.',
            ],
            keyTakeaways: [
              'Integration accumulates continuous infinitesimal quantities.',
              'The Fundamental Theorem allows calculating areas without infinite sums.',
              'Antiderivatives solve differential equations modeling natural phenomena.',
            ],
          },
        ],
      },
    ],
    finalTest: [
      {
        id: 'math-ft-1',
        question: 'What is the derivative of f(x) = e^(3x) with respect to x?',
        options: ['e^(3x)', '3e^(3x)', '3x e^(3x)', 'e^(3x) / 3'],
        correctIndex: 1,
        explanation: 'By the chain rule, d/dx[e^(u)] = e^(u) * du/dx. For u = 3x, the derivative is 3e^(3x).',
      },
      {
        id: 'math-ft-2',
        question: 'If vectors u and v are perpendicular in Euclidean space, what is their dot product u · v?',
        options: ['1', '0', '-1', 'Infinity'],
        correctIndex: 1,
        explanation: 'u · v = |u||v|cos(θ). Since cos(90°) = 0, the dot product of perpendicular vectors is always 0.',
      },
      {
        id: 'math-ft-3',
        question: 'What is the value of ∫ (2x + 5) dx?',
        options: ['x² + 5x + C', '2x² + 5x + C', 'x² + C', '2 + C'],
        correctIndex: 0,
        explanation: '∫ 2x dx = x² and ∫ 5 dx = 5x, so the antiderivative is x² + 5x + C.',
      },
      {
        id: 'math-ft-4',
        question: 'In statistics, what does the standard deviation measure?',
        options: ['The highest value in a dataset', 'The dispersion or spread of values around the arithmetic mean', 'The total count of observations', 'The middle value when sorted'],
        correctIndex: 1,
        explanation: 'Standard deviation quantifies the average deviation of individual data points from the mean.',
      },
    ],
  },
  {
    id: 'course-2-english-language',
    orderNumber: 2,
    title: 'English Language',
    subtitle: 'Comprehensive mastery of grammar, comprehension, vocabulary, essays, letters, summary writing, and communication skills.',
    category: 'Humanities & Language',
    level: 'Beginner to Advanced',
    duration: '18h 45m',
    instructor: {
      name: 'Prof. Alistair Sterling',
      role: 'Professor of English Literature & Applied Linguistics',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&h=160&q=80',
      rating: 4.98,
      studentsCount: '46,100+',
      bio: 'Linguist, author, and senior examiner specializing in rhetorical analysis, syntactic precision, creative composition, and institutional communication.',
    },
    learningObjectives: [
      'Master advanced English grammar, syntax, verb tenses, subject-verb concord, and voice.',
      'Achieve speed and depth in reading comprehension, deductive inference, and tonal analysis.',
      'Construct persuasive essays, expository arguments, and balanced academic treatises.',
      'Draft formal business inquiries, executive reports, official complaints, and informal correspondence.',
      'Hone creative writing techniques: character arcs, dialogue, descriptive sensory imagery, and pacing.',
      'Master summary writing and précis condensation while preserving authorial intent.',
      'Refine communication, pronunciation, debate rhetoric, and interpersonal oratory skills.',
    ],
    importantDefinitions: [
      { term: 'Concord (Agreement)', definition: 'The grammatical harmony between words, particularly the subject and finite verb in number and person.' },
      { term: 'Précis (Summary)', definition: 'A clear, concise, and objective condensation of a longer text preserving its essential argument without personal opinion.' },
      { term: 'Register', definition: 'The degree of formality and specialized vocabulary appropriate for a particular social or professional context.' },
      { term: 'Syntax', definition: 'The structural rules and principles governing sentence construction and word order in a language.' },
      { term: 'Rhetoric', definition: 'The art of effective and persuasive speaking or writing, utilizing ethos (credibility), pathos (emotion), and logos (logic).' },
    ],
    writingPrompts: [
      {
        id: 'wp-1',
        category: 'Essay',
        title: 'Persuasive Essay: The Societal Impact of Artificial Intelligence',
        prompt: 'Write a persuasive essay (400–600 words) examining whether the rapid rise of generative artificial intelligence poses an existential opportunity or disruption to modern education and human employment. Present a clear thesis, support your claims with concrete evidence, address counterarguments, and provide a compelling conclusion.',
        targetWordCount: 500,
        rubrics: [
          'Clear thesis statement in the introductory paragraph',
          'Well-developed body paragraphs with topic sentences and transition words',
          'Evidence and analysis of counterarguments',
          'Grammar, syntax, and sophisticated vocabulary register',
        ],
        sampleStarter: 'In an era defined by rapid technological acceleration, artificial intelligence has ceased to be a speculative novelty and has become an omnipresent reality...',
      },
      {
        id: 'wp-2',
        category: 'Formal Letter',
        title: 'Formal Letter: Academic Grant Application to the University Senate',
        prompt: 'Draft a formal letter (250–350 words) to the Dean of Academic Affairs requesting research grant funding for a community education initiative. Adhere strictly to formal letter formatting (two addresses, formal salutation, explicit subject line, respectful tone, and appropriate sign-off).',
        targetWordCount: 300,
        rubrics: [
          'Correct formal two-address block, date, and subject heading',
          'Respectful, professional, and persuasive tone',
          'Clear explanation of the project purpose and requested funds',
          'Proper formal sign-off (Yours faithfully / Yours sincerely)',
        ],
        sampleStarter: 'The Dean of Academic Affairs,\nFaculty of Arts and Humanities,\nImperial University...\n\nDear Sir/Madam,\n\nAPPLICATION FOR COMMUNITY EDUCATION RESEARCH GRANT...',
      },
      {
        id: 'wp-3',
        category: 'Informal Letter',
        title: 'Informal Letter: Letter to a Close Friend Abroad',
        prompt: 'Write an informal letter (250–350 words) to a childhood friend living abroad, describing a recent personal achievement or significant life transition. Use warm, natural, and expressive language while maintaining grammatical fluency.',
        targetWordCount: 280,
        rubrics: [
          'Single address and informal date format',
          'Warm, engaging, and personal voice',
          'Natural conversational flow and vivid personal anecdotes',
          'Affectionate informal sign-off (Warm regards / With love)',
        ],
        sampleStarter: 'Dearest Maya,\n\nI hope this letter finds you in splendid spirits! It feels like ages since we last caught up over coffee...',
      },
      {
        id: 'wp-4',
        category: 'Creative Writing',
        title: 'Narrative Story: The Discovery in the Old Observatory',
        prompt: 'Write a compelling narrative story (350–500 words) beginning with a character unlocking the rusty dome of an abandoned mountain observatory at dusk. Employ sensory imagery, dialogue, character motivation, and suspenseful pacing.',
        targetWordCount: 400,
        rubrics: [
          'Rich sensory details (sight, sound, tactile textures)',
          'Effective dialogue formatting with correct quotation marks',
          'Clear narrative arc with tension and resolution',
          'Varied sentence lengths to control reading speed and suspense',
        ],
        sampleStarter: 'The heavy brass key ground against the oxidized tumbler with a sound like sharpening knives. Julian held his breath as the iron door groaned inward...',
      },
      {
        id: 'wp-5',
        category: 'Summary Writing',
        title: 'Summary & Précis: Condensing Global Climate Transitions',
        prompt: 'Read an excerpt on sustainable energy grids and write an objective 100–150 word summary capturing the central thesis, two supporting arguments, and the authors primary recommendation. Do not include personal commentary.',
        targetWordCount: 120,
        rubrics: [
          'Concise synthesis of primary thesis in the writers own words',
          'Omission of secondary illustrations, rhetoric, and redundancies',
          'Accurate retention of original authorial intent',
          'Strict word count compliance',
        ],
        sampleStarter: 'The transition to renewable energy requires simultaneously addressing battery storage capacity and decentralized grid balancing...',
      },
      {
        id: 'wp-6',
        category: 'Report Writing',
        title: 'Investigative Report: Digital Accessibility Audit of Campus Facilities',
        prompt: 'Prepare an investigative report (300–450 words) evaluating digital accessibility across university study halls. Include: Title, Executive Summary, Scope of Investigation, Findings, and Actionable Recommendations.',
        targetWordCount: 350,
        rubrics: [
          'Standard administrative report structure with labeled headings',
          'Objective, passive/third-person analytical register',
          'Clear data-backed findings and prioritized recommendations',
          'Professional concluding statement with author designation',
        ],
        sampleStarter: 'REPORT ON DIGITAL ACCESSIBILITY INFRASTRUCTURE IN CAMPUS LIBRARIES\n\n1.0 EXECUTIVE SUMMARY\nThis audit evaluates screen-reader compliance and wheelchair accessibility across campus learning centers...',
      },
    ],
    modules: [
      {
        id: 'eng-m1',
        number: 1,
        title: 'Grammar, Concord & Structural Mechanics',
        description: 'Parts of speech, sentence syntax, active/passive voice, clause analysis, and subject-verb agreement.',
        totalDuration: '3h 30m',
        lessons: [
          {
            id: 'eng-1-1',
            title: 'Subject-Verb Concord and Common Agreement Pitfalls',
            duration: '25 min',
            durationMinutes: 25,
            completed: false,
            type: 'video',
            description: 'Master the fundamental rules of grammatical concord, compound subjects, and intervening phrases.',
            detailedContent: `Concord is the grammatical agreement between words in gender, number, case, or person. In modern English, the most critical concord rule is subject-verb agreement: a singular subject requires a singular finite verb, and a plural subject requires a plural finite verb.

While simple cases ('The student reads' vs. 'The students read') are straightforward, complexity arises in three common syntactic scenarios:

1. Intervening Prepositional Phrases:
Phrases separating the subject from the verb do NOT alter the subject's grammatical number.
Example: 'The stack of rare books [singular] is on the mahogany desk.' ('books' is an object of preposition, not the subject).

2. Correlative Conjunctions (Either...or, Neither...nor):
The verb agrees with the subject nearest to it (the rule of proximity).
Example: 'Neither the teacher nor the students were in the auditorium.' But: 'Neither the students nor the teacher was in the auditorium.'

3. Indefinite Pronouns:
Words like 'everyone', 'each', 'someone', 'nobody', and 'neither' are grammatically singular in standard formal register and take singular verbs: 'Everyone has submitted their assignment.'`,
            summary: 'Subject-verb concord dictates that intervening phrases do not alter subject number, and correlative conjunctions follow the proximity rule.',
            definitions: [
              { term: 'Proximity Rule', definition: 'The grammatical principle where a verb agrees with the noun phrase immediately adjacent to it in compound subjects joined by or/nor.' },
            ],
            examples: [
              {
                title: 'Intervening Phrase Concord',
                description: 'Incorrect: "The leader of the expedition, along with his guides, were stranded."\nCorrect: "The leader of the expedition, along with his guides, was stranded."',
              },
            ],
            quiz: [
              {
                id: 'qeng-1-1',
                question: 'Choose the grammatically correct sentence adhering to standard concord rules:',
                options: [
                  'A bouquet of yellow roses were delivered to the office.',
                  'A bouquet of yellow roses was delivered to the office.',
                  'A bouquet of yellow roses have been delivered to the office.',
                  'A bouquet of yellow roses are delivered to the office.'
                ],
                correctIndex: 1,
                explanation: 'The head subject noun is "bouquet" (singular), so it requires the singular verb "was delivered". "Roses" is inside the prepositional phrase.',
              },
            ],
            revisionQuestions: [
              'Explain the rule of proximity using "neither...nor" with subjects of different grammatical numbers.',
              'Why does "The jury has reached its verdict" take a singular verb in standard American/British collective usage?',
            ],
            keyTakeaways: [
              'Identify the head noun of the subject phrase before selecting the verb form.',
              'Intervening clauses like "along with", "as well as", and "together with" do not change subject number.',
              'Indefinite pronouns such as "each" and "everybody" are singular in formal grammar.',
            ],
          },
          {
            id: 'eng-1-2',
            title: 'Active vs. Passive Voice and Rhetorical Agency',
            duration: '22 min',
            durationMinutes: 22,
            completed: false,
            type: 'reading',
            description: 'Syntactic structures of voice, when to deploy passive construction in scientific reports, and avoiding weak prose.',
            detailedContent: `Voice refers to the relationship between the action of a verb and the participants identified by its arguments (subject and object).

In the Active Voice, the subject performs the action:
'The researcher synthesized the compound in the laboratory.' (Agent = Subject).

In the Passive Voice, the subject undergoes or receives the action:
'The compound was synthesized in the laboratory by the researcher.' (Patient = Subject; Agent moved to prepositional phrase or omitted).

While active voice is celebrated for vigor, directness, and concision in persuasive essays, the passive voice serves vital rhetorical purposes:
1. When the agent is unknown, irrelevant, or obvious: 'The ancient pyramid was constructed over four millennia ago.'
2. In scientific and formal investigative reporting to emphasize objectivity and repeatable phenomena rather than personal involvement: 'The solution was heated to 100°C.'
3. Tact and diplomacy to avoid assigning direct blame: 'A critical billing mistake was made.'`,
            summary: 'Active voice emphasizes the doer of the action; passive voice emphasizes the result, object, or experimental procedure.',
            definitions: [
              { term: 'Agent', definition: 'The entity that initiates or performs the action expressed by the verb.' },
            ],
            examples: [
              {
                title: 'Transforming for Concision',
                description: 'Passive: "It was decided by the committee that the initiative should be delayed."\nActive: "The committee decided to delay the initiative."',
              },
            ],
            quiz: [
              {
                id: 'qeng-1-2',
                question: 'Which of the following represents an active voice sentence?',
                options: [
                  'The new bridge was designed by urban architects in 2024.',
                  'Urban architects designed the new bridge in 2024.',
                  'The bridge had been constructed before the monsoon began.',
                  'A decision was announced yesterday evening.'
                ],
                correctIndex: 1,
                explanation: 'In sentence B, the subject "Urban architects" is actively performing the verb "designed".',
              },
            ],
            revisionQuestions: [
              'When is the passive voice preferred over the active voice in academic publications?',
              'Convert this passive sentence into active voice: "The code was audited by security engineers."',
            ],
            keyTakeaways: [
              'Active voice creates lively, direct, and authoritative prose.',
              'Passive voice places focus on the recipient or product of the action.',
              'Strategic voice selection is a hallmark of mature rhetorical style.',
            ],
          },
        ],
      },
      {
        id: 'eng-m2',
        number: 2,
        title: 'Punctuation, Orthography & Spelling Precision',
        description: 'Semicolons, colons, em-dashes, hyphens, apostrophes, comma splices, and homophone discrimination.',
        totalDuration: '2h 45m',
        lessons: [
          {
            id: 'eng-2-1',
            title: 'Semicolons, Colons and Eliminating Comma Splices',
            duration: '24 min',
            durationMinutes: 24,
            completed: false,
            type: 'video',
            description: 'How to correctly link independent clauses and avoid the dreaded comma splice in formal writing.',
            detailedContent: `Punctuation is the musical notation of written thought. It establishes cadence, resolves ambiguity, and clarifies hierarchical relationships between clauses.

The Comma Splice Error:
A comma splice occurs when two complete independent clauses are joined with only a comma:
Incorrect: 'The expedition reached the summit at dawn, the weather was brutally cold.'

Remedies:
1. Semicolon: 'The expedition reached the summit at dawn; the weather was brutally cold.' (Links two closely related independent clauses).
2. Coordinating Conjunction: 'The expedition reached the summit at dawn, but the weather was brutally cold.'
3. Period: 'The expedition reached the summit at dawn. The weather was brutally cold.'

The Colon (:):
A colon introduces lists, quotations, explanations, or conclusions that directly amplify what preceded it. The clause preceding a colon must be grammatically complete:
'The director highlighted one non-negotiable value: absolute honesty.'`,
            summary: 'Semicolons join closely linked independent clauses; colons introduce explanations or lists following a complete sentence.',
            definitions: [
              { term: 'Comma Splice', definition: 'The grammatical error of connecting two independent clauses with only a comma and no coordinating conjunction.' },
            ],
            examples: [
              {
                title: 'Conjunctive Adverb with Semicolon',
                description: 'The experiment produced anomalous readings; therefore, the team recalibrated the sensors.',
              },
            ],
            quiz: [
              {
                id: 'qeng-2-1',
                question: 'Which of the following correctly repairs a comma splice?',
                options: [
                  'She loves studying linguistics, she reads every night.',
                  'She loves studying linguistics; she reads every night.',
                  'She loves studying linguistics she reads every night.',
                  'She loves studying linguistics, and reads every night without sleep.'
                ],
                correctIndex: 1,
                explanation: 'A semicolon correctly connects two related independent clauses without creating a run-on or comma splice.',
              },
            ],
            revisionQuestions: [
              'What is the difference between an em-dash (—) and an en-dash (–)?',
              'Explain why an independent clause must precede a colon.',
            ],
            keyTakeaways: [
              'Never join two complete independent thoughts with only a lone comma.',
              'Semicolons emphasize conceptual proximity between thoughts.',
              'Colons signal an announcement, definition, or list following a full sentence.',
            ],
          },
        ],
      },
      {
        id: 'eng-m3',
        number: 3,
        title: 'Essay, Letter & Report Composition Workshop',
        description: 'Argumentative essays, persuasive rhetoric, formal application letters, investigative reports, and précis writing.',
        totalDuration: '4h 15m',
        lessons: [
          {
            id: 'eng-3-1',
            title: 'The Architecture of the Argumentative Essay',
            duration: '35 min',
            durationMinutes: 35,
            completed: false,
            type: 'reading',
            description: 'Crafting defensible thesis statements, topic sentence anchors, evidentiary synthesis, and counterargument refutation.',
            detailedContent: `An argumentative essay is a sustained intellectual exercise in logical persuasion. It requires taking an informed stand on a controversial or nuanced issue and defending that position using credible evidence and sound logic.

The Five-Part Classical Structure:
1. Introduction: Hook, contextual background, and a sharp, contestable Thesis Statement.
2. Body Paragraphs 1 & 2: Affirmative arguments backed by empirical data, citations, or logical proofs. Each paragraph begins with a clear Topic Sentence.
3. Counterargument & Rebuttal: Fairly presenting opposing perspectives and dismantling them with superior evidence.
4. Conclusion: Synthesizing the arguments without repeating the exact introductory words, articulating broader significance.

The Thesis Statement is the keystone of the entire piece. It must be specific, argumentative, and provide a roadmap for the reader.`,
            summary: 'An argumentative essay defends a contestable thesis through topic-sentence-led paragraphs, evidentiary proof, and refutation.',
            definitions: [
              { term: 'Thesis Statement', definition: 'A concise 1-2 sentence claim that states the central argument and scope of an essay.' },
            ],
            examples: [
              {
                title: 'Weak vs. Strong Thesis',
                description: 'Weak: "Social media has good and bad effects on young people."\nStrong: "Although social media facilitates global communication, unregulated algorithmic feeds degrade adolescent attention spans and foster anxiety, demanding comprehensive digital literacy curricula."',
              },
            ],
            quiz: [
              {
                id: 'qeng-3-1',
                question: 'What is the primary function of a topic sentence in an essay body paragraph?',
                options: [
                  'To repeat the first sentence of the introduction verbatim',
                  'To state the central claim of that paragraph and link it back to the overarching thesis',
                  'To list all citations and bibliography references',
                  'To provide a decorative quote from famous authors'
                ],
                correctIndex: 1,
                explanation: 'A topic sentence establishes the core argument of the paragraph and anchors it directly to the thesis.',
              },
            ],
            revisionQuestions: [
              'What makes a thesis statement debatable rather than merely factual?',
              'How does addressing a counterargument strengthen an author’s ethos?',
            ],
            keyTakeaways: [
              'Lead every paragraph with an analytical topic sentence.',
              'Use the PEEL structure: Point, Evidence, Explanation, Link.',
              'Anticipate and respectfully refute the strongest counterargument.',
            ],
          },
          {
            id: 'eng-3-2',
            title: 'Formal Correspondence, Business Writing and Executive Reports',
            duration: '30 min',
            durationMinutes: 30,
            completed: false,
            type: 'exercise',
            description: 'Formal letter conventions, memoranda, executive reports, and institutional email etiquette.',
            detailedContent: `Professional communication demands absolute precision in format, tone, and register. Unlike casual digital messaging, formal letters and institutional reports are legal and archival records.

Key Conventions of Formal Letters:
- Two Addresses: Senders address (top right or top left) and Recipients formal designation/address (left).
- Date: Written in full (e.g., '30 October 2026', not '10/30/26').
- Salutation & Sign-off Pairing:
  * When name is unknown: 'Dear Sir or Madam' -> 'Yours faithfully'.
  * When recipient is addressed by name: 'Dear Dr. Sterling' -> 'Yours sincerely'.
- Subject Heading: Capitalized or underlined summary line immediately following salutation.

Report Writing Conventions:
An executive report is organized using numbered decimal hierarchies (1.0 Introduction, 1.1 Scope, 2.0 Findings, 3.0 Recommendations). The tone is analytical, objective, and solution-oriented.`,
            summary: 'Formal letters require precise layout, correct salutation-signoff pairing, and unambiguous subject headings.',
            definitions: [
              { term: 'Executive Summary', definition: 'A brief synopsis at the beginning of a formal report highlighting core findings and recommendations for decision-makers.' },
            ],
            examples: [
              {
                title: 'Subject Line in Formal Letters',
                description: 'RE: FORMAL PROPOSAL FOR ARTIFICIAL INTELLIGENCE LAB INTEGRATION',
              },
            ],
            quiz: [
              {
                id: 'qeng-3-2',
                question: 'When a formal letter begins with "Dear Sir or Madam", what is the required complimentary close?',
                options: ['Yours sincerely', 'Yours faithfully', 'Warm regards', 'Cheers'],
                correctIndex: 1,
                explanation: 'In standard formal British and international English, "Dear Sir or Madam" pairs strictly with "Yours faithfully".',
              },
            ],
            revisionQuestions: [
              'What are the key structural components of a formal investigative report?',
              'When would you deploy "Yours sincerely" versus "Yours faithfully"?',
            ],
            keyTakeaways: [
              'Format and salutation rules signal professional competence and respect.',
              'Executive reports use numbered headers and actionable recommendations.',
              'Clarity, brevity, and courtesy are the tripartite foundation of business correspondence.',
            ],
          },
        ],
      },
      {
        id: 'eng-m4',
        number: 4,
        title: 'Reading Comprehension, Vocabulary & Oratory Skills',
        description: 'Deductive textual inference, tone identification, advanced etymology, vocabulary registers, and public speech delivery.',
        totalDuration: '3h 30m',
        lessons: [
          {
            id: 'eng-4-1',
            title: 'Critical Reading: Inference, Tone and Authorial Bias',
            duration: '28 min',
            durationMinutes: 28,
            completed: false,
            type: 'video',
            description: 'Reading between the lines: detecting underlying irony, deductive reasoning, and identifying unsupported assumptions.',
            detailedContent: `Reading comprehension at an advanced level transcends surface-level factual recall. It requires active textual interrogation to determine not just what an author says, but what they imply, presuppose, and intentionally omit.

Analytical Dimensions:
1. Tone and Mood: Does the author write with detached clinical skepticism, reverent admiration, biting satire, or urgent moral indignation? Tone is revealed through diction (word choice) and connotation.
2. Inference vs. Assumption: An inference is a logical deduction drawn directly from evidence in the passage. An assumption is an unproven belief taken for granted by the author.
3. Rhetorical Devices: Spotting metaphors, hyperbole, litotes (understatement), and rhetorical questions used to sway the reader emotionally.`,
            summary: 'Critical comprehension evaluates word choice, tone, logical inferences, and unstated authorial assumptions.',
            definitions: [
              { term: 'Inference', definition: 'A rational conclusion reached on the basis of textual evidence and deductive reasoning.' },
              { term: 'Diction', definition: 'The choice and use of words and phrases in speech or writing that establish tone and register.' },
            ],
            examples: [
              {
                title: 'Analyzing Connotation',
                description: 'Comparing "The politician was stubborn" (negative/pejorative) versus "The politician was resolute" (positive/admirable).',
              },
            ],
            quiz: [
              {
                id: 'qeng-4-1',
                question: 'What distinguishes an inference from an explicit statement in a text?',
                options: [
                  'An inference is stated word-for-word in the opening sentence',
                  'An inference is a logical deduction drawn from clues in the text rather than directly spoken',
                  'Inferences are only found in poetry',
                  'Inferences cannot be supported by evidence'
                ],
                correctIndex: 1,
                explanation: 'Inferences require readers to synthesize clues, context, and logic to understand what is suggested rather than outright stated.',
              },
            ],
            revisionQuestions: [
              'How does an author’s choice of adjectives reveal their personal bias toward a subject?',
              'What is the difference between denotation and connotation?',
            ],
            keyTakeaways: [
              'Look beyond literal meaning to assess tone, subtext, and motivation.',
              'Words carry emotional connotations that influence reader perception.',
              'Strong arguments withstand scrutiny of their underlying premises.',
            ],
          },
        ],
      },
    ],
    finalTest: [
      {
        id: 'eng-ft-1',
        question: 'Identify the sentence with correct subject-verb agreement:',
        options: [
          'The quality of these educational programs have improved dramatically.',
          'The quality of these educational programs has improved dramatically.',
          'The quality of these educational programs are improving dramatically.',
          'The quality of these educational programs were improving dramatically.'
        ],
        correctIndex: 1,
        explanation: 'The subject noun is "quality" (singular), which agrees with "has improved". "Programs" is an object of preposition.',
      },
      {
        id: 'eng-ft-2',
        question: 'What punctuation mark is used to introduce an elaboration, quotation, or list following a complete independent clause?',
        options: ['Semicolon', 'Comma', 'Colon', 'Hyphen'],
        correctIndex: 2,
        explanation: 'A colon is used after an independent clause to announce or amplify a list, quotation, or explanation.',
      },
      {
        id: 'eng-ft-3',
        question: 'In summary writing (précis), what should the writer rigorously avoid?',
        options: [
          'Using their own words to express the author\'s main ideas',
          'Inserting personal opinions, commentary, or external examples not found in the original text',
          'Retaining the central thesis of the original passage',
          'Writing in clear, grammatically sound prose'
        ],
        correctIndex: 1,
        explanation: 'A summary must remain purely objective and faithful to the source, excluding personal opinions or extraneous additions.',
      },
      {
        id: 'eng-ft-4',
        question: 'Which of the following demonstrates parallel grammatical structure?',
        options: [
          'She enjoys reading historical novels, to write poetry, and swimming.',
          'She enjoys reading historical novels, writing poetry, and swimming in the lake.',
          'She enjoys reading historical novels, writes poetry, and to swim.',
          'She enjoys to read, writing poetry, and swims.'
        ],
        correctIndex: 1,
        explanation: 'Parallel structure requires equal grammatical forms (gerunds: reading, writing, swimming).',
      },
    ],
  },
];

export const ALL_20_COURSE_TITLES = [
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
  'AI Ethics and Responsible AI',
];
