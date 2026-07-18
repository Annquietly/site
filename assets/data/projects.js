// PROJECT DATA
// Add a project by creating its image folder and one object below.
const projects = [
  {
    id: "digital-product", title: "Digital Product", category: "Mobile app", duration: "3 weeks", year: "2025",
    cover: "assets/images/projects/digital-product/cover.svg",
    images: ["assets/images/projects/digital-product/01.svg", "assets/images/projects/digital-product/02.svg"],
    summary: "A clear and thoughtful interface concept built around user needs, structure, and an intuitive visual hierarchy.",
    description: { done: "Product interface concept and visual system.", task: "Create a clear digital experience with a strong hierarchy.", result: "A focused interface that makes the next step feel natural." }
  },
  {
    id: "visual-identity", title: "Visual Identity", category: "Brand Identity", duration: "2 weeks", year: "2025",
    cover: "assets/images/projects/visual-identity/cover.svg",
    images: ["assets/images/projects/visual-identity/01.svg", "assets/images/projects/visual-identity/02.svg"],
    summary: "A flexible visual language that brings typography, color, composition, and brand character into one coherent system.",
    description: { done: "Identity direction and a flexible visual language.", task: "Build an expressive system that remains recognisable in every format.", result: "A coherent visual identity with room to grow." }
  },
  {
    id: "ai-concept", title: "AI Concept", category: "Other", duration: "1 week", year: "2025",
    cover: "assets/images/projects/ai-concept/cover.svg",
    images: ["assets/images/projects/ai-concept/01.svg", "assets/images/projects/ai-concept/02.svg", "assets/images/projects/ai-concept/03.svg"],
    summary: "An experimental concept developed through rapid visual exploration, AI tools, and careful art direction.",
    description: { done: "Art direction and an AI-assisted visual experiment.", task: "Explore unexpected visual directions without losing intention.", result: "A curated concept that combines speed with considered design choices." }
  },
  {
    id: "interactive-prototype", title: "Interactive Prototype", category: "Mobile app", duration: "2 weeks", year: "2025",
    cover: "assets/images/projects/interactive-prototype/cover.svg",
    images: ["assets/images/projects/interactive-prototype/01.svg", "assets/images/projects/interactive-prototype/02.svg"],
    summary: "A fast-moving prototype used to test an idea, explore interaction, and turn an early concept into something tangible.",
    description: { done: "Interactive prototype and key user flows.", task: "Test how an early idea feels in motion.", result: "A tangible prototype that made the interaction direction easy to evaluate." }
  },
  {
    id: "spatial-experiment", title: "Spatial Experiment", category: "Site Design", duration: "2 weeks", year: "2025",
    cover: "assets/images/projects/spatial-experiment/cover.svg",
    images: ["assets/images/projects/spatial-experiment/01.svg", "assets/images/projects/spatial-experiment/02.svg"],
    summary: "A study of depth, movement, and atmosphere created through playful 3D composition and interactive thinking.",
    description: { done: "A spatial 3D study focused on depth, light, and movement.", task: "Bring graphic thinking into an interactive three-dimensional space.", result: "An atmospheric visual experiment with a clear sense of motion." }
  },
  {
    id: "editorial-system", title: "Editorial System", category: "Social Media Design", duration: "3 weeks", year: "2025",
    cover: "assets/images/projects/editorial-system/cover.svg",
    images: ["assets/images/projects/editorial-system/01.svg", "assets/images/projects/editorial-system/02.svg"],
    summary: "A typography-led layout system balancing expressive composition with rhythm, readability, and consistency.",
    description: { done: "Typography-led layouts and a reusable editorial system.", task: "Balance expressive composition with clarity and consistency.", result: "A flexible system that creates rhythm across social formats." }
  }
];

window.projects = projects;
