const profile = {
    name: "Etudiant",
    role: "Developpeur Full Stack",
    stack: "React · Node.js · MongoDB",
    availability: "Disponible pour des missions",
    email: "mourad@email.com",
    phone: "514 123 4567",
    location: "Montreal, Québec , Canada",
    links: {
        github: "https://github.com/yourusername",
        linkedin: "https://linkedin.com/in/yourusername",
        cv: "/CV.pdf", // chemin vers ton fichier CV,
        calendly: "https://calendly.com/yourusername/30min",
    },
};

export const projects = [
    {
        id: 1,
        title: "E-Commerce Platform",
        description: "Plateforme e-commerce complete avec panier, paiements Stripe et espace admin.",
        impact: "+31% de conversion checkout en 8 semaines apres refonte UX et optimisation perfs.",
        tags: ["React", "Node.js", "MongoDB", "Stripe"],
        github: "https://github.com/yourusername/ecommerce",
        live: "https://ecommerce-demo.com",
        color: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
    },
    {
        id: 2,
        title: "Task Management App",
        description: "App collaborative avec auth, partage d'espaces et notifications en temps reel.",
        impact: "Temps moyen de traitement des tickets interne reduit de 42%.",
        tags: ["React", "Firebase", "Tailwind CSS"],
        github: "https://github.com/yourusername/taskapp",
        live: "https://taskapp-demo.com",
        color: "linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)",
    },
    {
        id: 3,
        title: "Blog Platform",
        description: "Plateforme de contenu avec recherche avancee, SEO et analytics editoriales.",
        impact: "Pages speed score passe de 58 a 94 et trafic organique +67% en 3 mois.",
        tags: ["Next.js", "PostgreSQL", "GraphQL"],
        github: "https://github.com/yourusername/blog",
        live: "https://blog-demo.com",
        color: "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
    },
];

export default profile;
