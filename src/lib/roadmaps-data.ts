export type Difficulty = "Beginner" | "Intermediate" | "Advanced";
export type Demand = "High" | "Very High" | "Future Ready";

export type Career = {
  slug: string;
  name: string;
  desc: string;
  emoji: string;
  difficulty: Difficulty;
  duration: string;
  demand: Demand;
  gradient: string;
  accent: string;
  salary: string;
  skills: string[];
  overview: string;
  growth: string;
  future: string;
};

export type Category = {
  slug: string;
  name: string;
  short: string;
  desc: string;
  emoji: string;
  gradient: string;
  accent: string;
  careers: Career[];
};

const c = (
  slug: string,
  name: string,
  desc: string,
  emoji: string,
  difficulty: Difficulty,
  duration: string,
  demand: Demand,
  gradient: string,
  accent: string,
  salary: string,
  skills: string[],
  overview: string,
): Career => ({
  slug,
  name,
  desc,
  emoji,
  difficulty,
  duration,
  demand,
  gradient,
  accent,
  salary,
  skills,
  overview,
  growth: "Strong upward trajectory with senior, lead and architect tracks.",
  future: "High long-term relevance across startups, enterprises and global teams.",
});

export const CATEGORIES: Category[] = [
  {
    slug: "software-development",
    name: "Software Development",
    short: "Software",
    desc: "Build websites, mobile apps, APIs and scalable software products.",
    emoji: "💻",
    gradient: "from-[#FFF4D6] via-[#FBE6A2] to-[#F4D06F]",
    accent: "#C9971A",
    careers: [
      c("software-engineer", "Software Engineer", "Architect modern, scalable software.", "💻", "Intermediate", "10–14 Months", "Very High", "from-[#E6F4FF] via-[#B7DAFF] to-[#7FBAFF]", "#1858B5", "₹6–25 LPA", ["DSA", "System Design", "Java/Python", "Databases"], "Software Engineers design and build production-grade software across web, cloud and platforms."),
      c("full-stack-developer", "Full Stack Developer", "Ship frontend and backend end-to-end.", "🧩", "Intermediate", "8–12 Months", "Very High", "from-[#FFF4D6] via-[#FBDA8C] to-[#F4BE45]", "#B5841A", "₹5–22 LPA", ["React", "Node.js", "Databases", "APIs"], "Full Stack Developers build complete products — UI, API, database and deployment."),
      c("frontend-developer", "Frontend Developer", "Craft beautiful, fast user interfaces.", "🎨", "Beginner", "6–10 Months", "High", "from-[#FFE9F1] via-[#FFC1D9] to-[#FF94B9]", "#D43A77", "₹4–18 LPA", ["HTML/CSS", "JavaScript", "React", "Tailwind"], "Frontend Developers build the interfaces millions of people use every day."),
      c("backend-developer", "Backend Developer", "Build APIs, servers and databases.", "⚙️", "Intermediate", "8–12 Months", "Very High", "from-[#F0F2F7] via-[#D6DCEA] to-[#B4BFD8]", "#3B4A6B", "₹5–22 LPA", ["Node.js", "SQL", "APIs", "Cloud"], "Backend Developers build the engine that powers modern products and platforms."),
      c("mobile-app-developer", "Mobile App Developer", "Ship native iOS and Android apps.", "📱", "Intermediate", "8–12 Months", "High", "from-[#F5ECFF] via-[#DCC3FF] to-[#B98EFF]", "#6A2EDB", "₹5–20 LPA", ["React Native", "Flutter", "Swift", "Kotlin"], "Mobile Developers build the apps people use every single day on their phones."),
      c("web-developer", "Web Developer", "Build responsive sites and web apps.", "🌐", "Beginner", "5–9 Months", "High", "from-[#E8FBF1] via-[#B6E8CB] to-[#7FD2A6]", "#1F7A4F", "₹3–15 LPA", ["HTML", "CSS", "JavaScript", "Hosting"], "Web Developers craft the modern web — from landing pages to full applications."),
    ],
  },
  {
    slug: "ai-and-data",
    name: "Artificial Intelligence & Data",
    short: "AI & Data",
    desc: "Build intelligent systems using AI, machine learning and data.",
    emoji: "🤖",
    gradient: "from-[#F5ECFF] via-[#E2CCFF] to-[#C9A8FF]",
    accent: "#7B3FE4",
    careers: [
      c("ai-engineer", "AI Engineer", "Build intelligent systems and neural networks.", "🤖", "Advanced", "12–18 Months", "Future Ready", "from-[#FFF4D6] via-[#FBE6A2] to-[#F4D06F]", "#C9971A", "₹10–40 LPA", ["Python", "Deep Learning", "PyTorch", "MLOps"], "AI Engineers build the intelligent products powering the next decade of technology."),
      c("machine-learning-engineer", "Machine Learning Engineer", "Train predictive models and AI pipelines.", "🧠", "Advanced", "12–16 Months", "Future Ready", "from-[#F5ECFF] via-[#E2CCFF] to-[#C9A8FF]", "#7B3FE4", "₹10–35 LPA", ["Python", "ML", "Statistics", "MLOps"], "ML Engineers ship production models that learn from data and improve over time."),
      c("generative-ai-engineer", "Generative AI Engineer", "Craft LLM workflows and content systems.", "✨", "Advanced", "10–14 Months", "Future Ready", "from-[#FFE9F1] via-[#FFC8DE] to-[#FF9DC0]", "#D4377B", "₹12–45 LPA", ["LLMs", "RAG", "Prompting", "Vector DBs"], "GenAI Engineers build assistants, copilots and content systems with cutting-edge models."),
      c("llm-engineer", "LLM Engineer", "Design prompts, assistants and language models.", "💬", "Advanced", "10–14 Months", "Future Ready", "from-[#E6F4FF] via-[#BFE0FF] to-[#8FC8FF]", "#1F6FD9", "₹12–40 LPA", ["LLMs", "Prompting", "Evals", "Agents"], "LLM Engineers shape the behavior and reliability of modern language models in production."),
      c("data-scientist", "Data Scientist", "Turn data into insights and decisions.", "📊", "Advanced", "10–14 Months", "Very High", "from-[#FFF0E4] via-[#FFD3B0] to-[#FFB37C]", "#D26A1E", "₹8–30 LPA", ["Python", "Statistics", "ML", "SQL"], "Data Scientists translate messy data into decisions worth millions."),
      c("data-analyst", "Data Analyst", "Build dashboards and business intelligence.", "📈", "Beginner", "6–9 Months", "High", "from-[#E8FBF1] via-[#BEEFD3] to-[#86DDB0]", "#1F8A57", "₹4–15 LPA", ["SQL", "Excel", "Power BI", "Python"], "Data Analysts turn raw data into clear stories that guide business action."),
      c("data-engineer", "Data Engineer", "Engineer pipelines and cloud data systems.", "🛢️", "Advanced", "10–14 Months", "Very High", "from-[#EEF1FF] via-[#C8D1FF] to-[#9CADFF]", "#3D52D5", "₹8–28 LPA", ["SQL", "Spark", "Airflow", "Cloud"], "Data Engineers build the pipelines that move and shape data at massive scale."),
    ],
  },
  {
    slug: "cybersecurity",
    name: "Cybersecurity",
    short: "Security",
    desc: "Protect digital systems and modern infrastructure.",
    emoji: "🛡️",
    gradient: "from-[#F0F2F7] via-[#CCD3E3] to-[#A4AFCE]",
    accent: "#2E3A5C",
    careers: [
      c("cybersecurity-analyst", "Cybersecurity Analyst", "Defend organizations from cyber threats.", "🛡️", "Intermediate", "8–12 Months", "Very High", "from-[#F0F2F7] via-[#CCD3E3] to-[#A4AFCE]", "#2E3A5C", "₹6–22 LPA", ["Networking", "SIEM", "Linux", "Threat Intel"], "Security Analysts monitor, detect and respond to threats inside modern companies."),
      c("ethical-hacker", "Ethical Hacker", "Pentest systems and find vulnerabilities.", "🕵️", "Advanced", "10–14 Months", "Very High", "from-[#FFE9E9] via-[#FFBDBD] to-[#FF8C8C]", "#C03030", "₹7–25 LPA", ["Pentesting", "Burp", "Networking", "Scripting"], "Ethical Hackers break systems on purpose so attackers can't break them for real."),
      c("penetration-tester", "Penetration Tester", "Simulate real-world attacks to harden systems.", "🧨", "Advanced", "10–14 Months", "Very High", "from-[#FFE9E9] via-[#FFB8B8] to-[#FF8B8B]", "#A52828", "₹8–28 LPA", ["Pentesting", "Web Sec", "Cloud Sec", "OSCP"], "Pen Testers run controlled attacks against apps, networks and cloud to expose risk."),
      c("security-engineer", "Security Engineer", "Engineer secure networks and platforms.", "🔐", "Advanced", "10–14 Months", "Very High", "from-[#FFF4D6] via-[#F4D88A] to-[#E4B948]", "#9C7715", "₹10–30 LPA", ["AppSec", "Cloud Sec", "IAM", "DevSecOps"], "Security Engineers design the defenses that keep modern platforms safe by default."),
    ],
  },
  {
    slug: "cloud-devops",
    name: "Cloud & DevOps",
    short: "Cloud & DevOps",
    desc: "Deploy, automate and scale cloud infrastructure.",
    emoji: "☁️",
    gradient: "from-[#E6F4FF] via-[#BFDFFB] to-[#8FC2F0]",
    accent: "#1F6FD9",
    careers: [
      c("devops-engineer", "DevOps Engineer", "Automate CI/CD and cloud delivery.", "🚀", "Intermediate", "8–12 Months", "Very High", "from-[#FFF0E4] via-[#FFC79A] to-[#FF9F5C]", "#C75A14", "₹8–28 LPA", ["Docker", "Kubernetes", "CI/CD", "AWS"], "DevOps Engineers automate everything from build to deploy to production at scale."),
      c("cloud-engineer", "Cloud Engineer", "Design cloud infra and architecture.", "☁️", "Intermediate", "8–12 Months", "Very High", "from-[#E6F4FF] via-[#BFDFFB] to-[#8FC2F0]", "#1F6FD9", "₹8–28 LPA", ["AWS", "Azure", "Terraform", "Networking"], "Cloud Engineers design and operate the infrastructure powering modern products."),
      c("site-reliability-engineer", "Site Reliability Engineer", "Keep systems fast, scalable and alive.", "📡", "Advanced", "10–14 Months", "Very High", "from-[#EEF1FF] via-[#C9D2FF] to-[#9AAAFF]", "#3346BD", "₹12–32 LPA", ["Linux", "Monitoring", "K8s", "Automation"], "SREs keep systems running 24/7 — fast, reliable and ready to scale."),
    ],
  },
  {
    slug: "design-product",
    name: "Design & Product",
    short: "Design & Product",
    desc: "Create exceptional digital experiences.",
    emoji: "🪄",
    gradient: "from-[#FFE9F1] via-[#FFC4DD] to-[#FF94BF]",
    accent: "#C9357A",
    careers: [
      c("ui-designer", "UI Designer", "Design clean, beautiful visual interfaces.", "🖌️", "Beginner", "5–8 Months", "High", "from-[#FFE9F1] via-[#FFC4DD] to-[#FF94BF]", "#C9357A", "₹4–15 LPA", ["Figma", "Visual Design", "Typography", "Color"], "UI Designers craft pixel-perfect interfaces that feel premium and intentional."),
      c("ux-designer", "UX Designer", "Map user journeys and experiences.", "🧭", "Intermediate", "6–10 Months", "High", "from-[#F5ECFF] via-[#D9BCFF] to-[#B286FF]", "#6A2EDB", "₹5–18 LPA", ["Research", "Wireframing", "Prototyping", "Figma"], "UX Designers shape how products feel — from research to flows to delight."),
      c("product-designer", "Product Designer", "Shape products end-to-end with design.", "🪄", "Intermediate", "8–12 Months", "Very High", "from-[#FFF4D6] via-[#F8DC9A] to-[#EFC056]", "#A8821A", "₹6–22 LPA", ["UX", "UI", "Systems", "Product"], "Product Designers own the experience end-to-end across web, mobile and platforms."),
      c("product-manager", "Product Manager", "Lead roadmap, strategy and execution.", "📋", "Advanced", "10–14 Months", "Very High", "from-[#E8FBF1] via-[#BFEAD3] to-[#86D2A8]", "#1F7A4F", "₹10–35 LPA", ["Strategy", "Roadmap", "Analytics", "Communication"], "Product Managers turn ideas into products users love and businesses grow on."),
    ],
  },
  {
    slug: "testing-quality",
    name: "Testing & Quality",
    short: "QA",
    desc: "Build reliable software through testing and automation.",
    emoji: "🧪",
    gradient: "from-[#E6F4FF] via-[#BCDBFB] to-[#8DBEEF]",
    accent: "#1F5FB5",
    careers: [
      c("qa-engineer", "QA Engineer", "Catch bugs and ensure quality ships.", "🧪", "Beginner", "5–8 Months", "High", "from-[#E6F4FF] via-[#BCDBFB] to-[#8DBEEF]", "#1F5FB5", "₹4–14 LPA", ["Manual QA", "Test Cases", "Bug Tracking", "APIs"], "QA Engineers protect product quality so users only ever see the good stuff."),
      c("automation-test-engineer", "Automation Test Engineer", "Automate testing across pipelines.", "🤖", "Intermediate", "7–10 Months", "Very High", "from-[#EEF1FF] via-[#CAD2FF] to-[#9CAAFF]", "#3346BD", "₹5–18 LPA", ["Selenium", "Cypress", "Playwright", "CI/CD"], "Automation Engineers build the test systems that keep releases fast and safe."),
    ],
  },
  {
    slug: "emerging-tech",
    name: "Emerging Technologies",
    short: "Emerging Tech",
    desc: "Work with tomorrow's technologies.",
    emoji: "🛸",
    gradient: "from-[#F5ECFF] via-[#D8BAFF] to-[#AF82FF]",
    accent: "#6A2EDB",
    careers: [
      c("blockchain-developer", "Blockchain Developer", "Build smart contracts and Web3 apps.", "⛓️", "Advanced", "10–14 Months", "Future Ready", "from-[#F0F2F7] via-[#D2D9EB] to-[#A8B4D6]", "#3B4A6B", "₹8–28 LPA", ["Solidity", "EVM", "Web3", "Smart Contracts"], "Blockchain Developers build decentralized apps and the contracts powering them."),
      c("robotics-engineer", "Robotics Engineer", "Engineer robots and automation systems.", "🦾", "Advanced", "12–18 Months", "Future Ready", "from-[#FFF0E4] via-[#FFCCA0] to-[#FF9F5C]", "#C75A14", "₹6–25 LPA", ["ROS", "Embedded", "Control", "C++"], "Robotics Engineers design and program machines that move and act in the real world."),
      c("arvr-developer", "AR/VR Developer", "Craft immersive virtual experiences.", "🥽", "Advanced", "10–14 Months", "Future Ready", "from-[#F5ECFF] via-[#D8BAFF] to-[#AF82FF]", "#6A2EDB", "₹6–22 LPA", ["Unity", "Unreal", "3D", "C#"], "AR/VR Developers build immersive worlds and tools for the next interface."),
      c("iot-engineer", "IoT Engineer", "Connect devices into smart systems.", "📶", "Intermediate", "8–12 Months", "High", "from-[#E8FBF1] via-[#B8EBCC] to-[#80D5A7]", "#1F7A4F", "₹6–20 LPA", ["Embedded", "MQTT", "Cloud", "C/C++"], "IoT Engineers connect the physical world to the cloud at scale."),
    ],
  },
  {
    slug: "enterprise-business",
    name: "Enterprise & Business Tech",
    short: "Enterprise",
    desc: "Develop enterprise-grade business solutions.",
    emoji: "🏢",
    gradient: "from-[#F0F2F7] via-[#CFD6E8] to-[#A6B2D2]",
    accent: "#2E3A5C",
    careers: [
      c("salesforce-developer", "Salesforce Developer", "Build on the world's #1 CRM platform.", "☁️", "Intermediate", "6–10 Months", "Very High", "from-[#E6F4FF] via-[#B5D6FA] to-[#7FB6EE]", "#1858B5", "₹6–22 LPA", ["Apex", "LWC", "SOQL", "Admin"], "Salesforce Developers build on the world's most-used CRM platform."),
      c("sap-consultant", "SAP Consultant", "Implement enterprise SAP systems.", "🏢", "Advanced", "10–14 Months", "Very High", "from-[#F0F2F7] via-[#CFD6E8] to-[#A6B2D2]", "#2E3A5C", "₹8–28 LPA", ["SAP", "ERP", "Business", "Modules"], "SAP Consultants implement the systems running the world's biggest businesses."),
      c("business-analyst", "Business Analyst", "Translate business needs into solutions.", "📑", "Beginner", "5–9 Months", "High", "from-[#EEF1FF] via-[#CDD4FF] to-[#A0AEFF]", "#3346BD", "₹5–18 LPA", ["SQL", "Excel", "Requirements", "Analytics"], "Business Analysts sit between business and tech and make both work better."),
    ],
  },
  {
    slug: "infrastructure-systems",
    name: "Infrastructure & Systems",
    short: "Infrastructure",
    desc: "Power the backbone of modern computing.",
    emoji: "🗄️",
    gradient: "from-[#FFF4D6] via-[#F6DA90] to-[#EAB948]",
    accent: "#9C7715",
    careers: [
      c("database-administrator", "Database Administrator", "Optimize and protect data at scale.", "🗄️", "Intermediate", "8–12 Months", "High", "from-[#FFF4D6] via-[#F6DA90] to-[#EAB948]", "#9C7715", "₹6–22 LPA", ["SQL", "Tuning", "Backups", "Security"], "DBAs keep the world's most important data safe, fast and available."),
      c("network-engineer", "Network Engineer", "Design and run resilient networks.", "🛰️", "Intermediate", "8–12 Months", "High", "from-[#E6F4FF] via-[#BBDAFB] to-[#88BBEF]", "#1F5FB5", "₹5–20 LPA", ["TCP/IP", "Routing", "Cisco", "Cloud Net"], "Network Engineers design the invisible roads modern internet runs on."),
    ],
  },
];

export function findCategory(slug: string) {
  return CATEGORIES.find((cat) => cat.slug === slug);
}

export function findCareer(catSlug: string, careerSlug: string) {
  const cat = findCategory(catSlug);
  return cat?.careers.find((cr) => cr.slug === careerSlug);
}

export function allCareers() {
  return CATEGORIES.flatMap((cat) =>
    cat.careers.map((cr) => ({ ...cr, categorySlug: cat.slug, categoryName: cat.name })),
  );
}