// Shared project data — used by the Projects grid (MagicBento) and the
// per-project case-study route (ProjectDetail). Single source of truth so
// the two views never drift out of sync.

export type ProjectType = 'ai' | 'web';

export interface ProjectData {
  /** URL slug — route is /projects/:slug */
  slug: string;
  type: ProjectType;
  label: string;
  title: string;
  /** Short description used on the grid card */
  description: string;
  tags: string[];
  /** Live deployed URL, if any */
  url?: string;
  /** Local thumbnail image (used for projects with no live URL to screenshot) */
  image?: string;
  imageUrl?: string;
  architecture?: {
    blueprintAvailable?: boolean;
    nodes?: { label: string; detail: string }[];
  };
  caseStudy: {
    problem: string;
    approach: string[];
    stack: string[];
    outcome: string;
  };
}

export const projects: ProjectData[] = [
  // ── WEB PROJECTS ──
  {
    slug: 'kalarth-canvas',
    type: 'web',
    label: 'E-Commerce Platform',
    title: 'Kalarth Canvas',
    description: 'Premium art e-commerce platform for artwork sales & order management with admin dashboard, Supabase backend, and GSAP animations.',
    tags: ['React.js', 'TypeScript', 'Supabase', 'Framer Motion', 'GSAP', 'Tailwind'],
    url: 'https://kalarthartstudio.com/',
    caseStudy: {
      problem: 'An independent art studio needed a storefront that could sell original artwork online, track orders end-to-end, and let non-technical staff manage inventory without touching code.',
      approach: [
        'Built a Supabase-backed data layer for products, orders, and inventory so the admin dashboard reads/writes against a single source of truth.',
        'Designed a lightweight admin panel for order management, separate from the public storefront.',
        'Used GSAP for scroll-triggered gallery reveals and Framer Motion for page/route transitions, keeping motion purposeful rather than decorative.',
        'Structured the storefront with TypeScript throughout for safer refactors as the catalog grew.',
      ],
      stack: ['React.js', 'TypeScript', 'Supabase', 'Framer Motion', 'GSAP', 'Tailwind CSS'],
      outcome: 'Shipped a production storefront currently running live for the studio, handling real sales and order fulfillment with an admin workflow the client operates independently.',
    },
  },
  {
    slug: 'atlaren-services',
    type: 'web',
    label: 'Business Website',
    title: 'Atlaren Services',
    description: 'Responsive business website showcasing software development services with SEO-friendly page structure and interactive animations.',
    tags: ['React.js', 'TypeScript', 'Vite', 'Tailwind', 'Framer Motion'],
    url: 'https://atlaren.com/',
    caseStudy: {
      problem: 'A software services company needed a fast-loading marketing site that presented their offerings credibly to prospective clients and ranked well organically.',
      approach: [
        'Built with Vite for fast dev iteration and small production bundles.',
        'Structured page semantics and metadata for SEO from the start rather than retrofitting it.',
        'Used Framer Motion for section entrances and hover states to make the service catalogue feel considered without slowing the page down.',
      ],
      stack: ['React.js', 'TypeScript', 'Vite', 'Tailwind CSS', 'Framer Motion'],
      outcome: 'Deployed and live as the company\'s public-facing site, serving as their primary channel for inbound service inquiries.',
    },
  },
  {
    slug: 'xronetech',
    type: 'web',
    label: 'Drone Platform',
    title: 'XroneTech',
    description: 'Drone manufacturing & rental services platform with full product catalogue, inquiry system, and company showcase.',
    tags: ['React.js', 'Tailwind', 'Vite'],
    url: 'https://xronetech.com/',
    caseStudy: {
      problem: 'A drone manufacturing/rental business needed a single site to showcase its product catalogue and route inbound rental/purchase inquiries.',
      approach: [
        'Built a structured product catalogue with consistent spec presentation across drone models.',
        'Implemented an inquiry flow so prospects could contact the business directly from any product page.',
        'Kept the build lightweight (Vite + Tailwind) to prioritize fast load on mobile, since most inbound traffic checks specs on the go.',
      ],
      stack: ['React.js', 'Tailwind CSS', 'Vite'],
      outcome: 'Live platform serving as the company\'s product catalogue and primary lead-generation channel.',
    },
  },
  {
    slug: 'groww-internationals',
    type: 'web',
    label: 'Import / Export',
    title: 'Groww Internationals',
    description: 'Import/export business website with service listings, contact workflows, and professional corporate presentation.',
    tags: ['React.js', 'Tailwind', 'TypeScript'],
    url: 'https://growwinternationals.com/',
    caseStudy: {
      problem: 'An import/export firm needed a corporate site that read as credible to international trade partners while clearly listing services and contact pathways.',
      approach: [
        'Built with TypeScript for a maintainable service-listing structure as offerings expanded.',
        'Focused layout and typography on a professional, corporate presentation over flashy visuals — matching the B2B trade audience.',
        'Set up structured contact workflows for partner and client inquiries.',
      ],
      stack: ['React.js', 'Tailwind CSS', 'TypeScript'],
      outcome: 'Live corporate site currently representing the company to international trade partners.',
    },
  },
  // ── AI PROJECTS ──
  {
    slug: 'predictive-analytics-model',
    type: 'ai',
    label: 'Machine Learning',
    title: 'Predictive Analytics Model',
    description: 'Machine learning model for predicting customer churn with 92% accuracy using advanced statistical techniques.',
    tags: ['Python', 'Scikit-learn', 'Pandas'],
    image: '/images/projects/healthcare-chatbot.png',
    caseStudy: {
      problem: 'Predict which customers were likely to churn from historical behavioral and account data, early enough for retention outreach to matter.',
      approach: [
        'Cleaned and engineered features from raw account/usage data with Pandas.',
        'Trained and compared several classifiers in Scikit-learn, tuning for the churn class specifically since it was the minority class.',
        'Validated with held-out test splits and cross-validation to avoid overfitting to the training period.',
      ],
      stack: ['Python', 'Scikit-learn', 'Pandas', 'NumPy'],
      outcome: 'Final model reached 92% accuracy on held-out data, giving a usable ranked list of at-risk accounts for retention follow-up.',
    },
  },
  {
    slug: 'computer-vision-pipeline',
    type: 'ai',
    label: 'Computer Vision',
    title: 'Computer Vision Pipeline',
    description: 'Real-time object detection and classification system for manufacturing and quality assurance.',
    tags: ['PyTorch', 'OpenCV', 'YOLO'],
    image: '/images/projects/arts-studio.png',
    caseStudy: {
      problem: 'Detect and classify manufacturing defects/objects on a line in real time, where a slow pipeline would be as useless as an inaccurate one.',
      approach: [
        'Built the detection pipeline on a YOLO architecture for real-time inference speed.',
        'Used OpenCV for the video capture/pre-processing stage feeding the model.',
        'Trained and iterated in PyTorch, profiling inference latency alongside accuracy throughout.',
      ],
      stack: ['PyTorch', 'OpenCV', 'YOLO', 'Python'],
      outcome: 'Real-time detection pipeline suitable for a quality-assurance line, balancing inference speed against classification accuracy.',
    },
  },
  {
    slug: 'nlp-sentiment-analyzer',
    type: 'ai',
    label: 'NLP',
    title: 'NLP Sentiment Analyzer',
    description: 'Sentiment analysis on large datasets of customer reviews using state-of-the-art transformer models.',
    tags: ['Transformers', 'TensorFlow', 'Python'],
    image: '/images/projects/event-management.png',
    caseStudy: {
      problem: 'Classify sentiment across a large volume of customer reviews to surface trends that manual reading couldn\'t keep up with.',
      approach: [
        'Fine-tuned a transformer-based model on labeled review data using TensorFlow.',
        'Built a preprocessing pipeline handling review text at scale (cleaning, tokenization, batching).',
        'Evaluated against a held-out labeled set to track precision/recall per sentiment class, not just overall accuracy.',
      ],
      stack: ['Transformers', 'TensorFlow', 'Python'],
      outcome: 'A working sentiment classifier able to process large review datasets and surface sentiment trends at a scale manual review couldn\'t match.',
    },
  },
];

export const getProjectBySlug = (slug: string) => projects.find(p => p.slug === slug);
