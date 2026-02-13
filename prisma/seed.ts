import bcrypt from "bcryptjs";
import { PrismaClient, ProjectStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@jdigital.local";
  const adminPassword = process.env.ADMIN_PASSWORD || "JDigital@12345";
  const officialEmail = "jdigitalsolutions27@gmail.com";
  const officialPhone = "0927 495 0610";
  const officialFacebook = "https://www.facebook.com/jdigitalsolutions";
  const officialMessenger = "https://m.me/jdigitalsolutions";

  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { passwordHash },
    create: {
      email: adminEmail,
      passwordHash,
      name: "J-Digital Admin"
    }
  });

  await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: {
      email: officialEmail,
      phone: officialPhone,
      facebookUrl: officialFacebook,
      messageButtonLink: officialMessenger,
      messengerLink: officialMessenger
    },
    create: {
      id: 1,
      heroHeadline: "Turn Your Website Into a 24/7 Client-Generating System",
      heroSubheadline:
        "We design and build premium websites for Philippine businesses that improve trust, capture leads, and drive consistent growth.",
      seoDefaultTitle: "J-Digital Solutions | Premium Websites for Philippine Businesses",
      seoDefaultDescription:
        "J-Digital Solutions creates conversion-focused websites, landing pages, and growth systems for Philippine SMEs and local brands.",
      email: officialEmail,
      phone: officialPhone,
      facebookUrl: officialFacebook,
      messageButtonLink: officialMessenger,
      messengerLink: officialMessenger
    }
  });

  const services = [
    {
      title: "Website Design & Development",
      slug: "website-design-development",
      shortDescription: "Conversion-focused websites that position your business as premium and credible.",
      description:
        "Custom websites with high-converting layouts, clear messaging, and performance-first implementation for serious business growth.",
      iconKey: "Monitor",
      position: 1
    },
    {
      title: "Landing Pages for Ads",
      slug: "landing-pages-for-ads",
      shortDescription: "Ad-ready landing pages built to convert clicks into qualified inquiries.",
      description:
        "Purpose-built landing pages with persuasive sections, trust signals, and fast load times for paid traffic campaigns.",
      iconKey: "MousePointerClick",
      position: 2
    },
    {
      title: "E-Commerce / Online Store",
      slug: "ecommerce-online-store",
      shortDescription: "Online storefronts that make buying simple and increase order confidence.",
      description:
        "Secure and scalable e-commerce experiences with optimized product flow, checkout UX, and mobile-first shopping journeys.",
      iconKey: "ShoppingBag",
      position: 3
    },
    {
      title: "Website Speed & SEO Optimization",
      slug: "website-speed-seo-optimization",
      shortDescription: "Technical improvements to help your site rank better and convert faster.",
      description:
        "Performance tuning, technical SEO setup, and structure improvements to increase discoverability and user trust.",
      iconKey: "Gauge",
      position: 4
    },
    {
      title: "Maintenance & Support",
      slug: "maintenance-support",
      shortDescription: "Ongoing support so your website stays secure, updated, and reliable.",
      description:
        "Proactive maintenance, issue monitoring, and content updates so your team can focus on operating the business.",
      iconKey: "Wrench",
      position: 5
    }
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: service,
      create: service
    });
  }

  const projectCategories = [
    { name: "Construction", slug: "construction", position: 1 },
    { name: "E-commerce", slug: "e-commerce", position: 2 },
    { name: "Consulting", slug: "consulting", position: 3 },
    { name: "Healthcare", slug: "healthcare", position: 4 },
    { name: "Real Estate", slug: "real-estate", position: 5 }
  ];

  for (const category of projectCategories) {
    await prisma.projectCategory.upsert({
      where: { slug: category.slug },
      update: { ...category, isActive: true },
      create: { ...category, isActive: true }
    });
  }

  const pricing = [
    {
      name: "Starter",
      slug: "starter",
      price: 3999,
      delivery: "3-5 Days",
      includes: [
        "1-Page Landing Page",
        "Mobile Responsive Design",
        "Contact Form",
        "Basic Setup",
        "Live Deployment"
      ],
      freebies: ["Free Logo (Branding)", "Free Consultation"],
      note: "Hosting & Domain NOT included",
      position: 1,
      isPopular: false
    },
    {
      name: "Basic",
      slug: "basic",
      price: 5999,
      delivery: "3-7 Days",
      includes: [
        "Up to 3 Pages",
        "Mobile Responsive Design",
        "Contact Form Integration",
        "Basic SEO Setup",
        "Social Media Links",
        "Live Deployment"
      ],
      freebies: ["1 Year Hosting & Domain", "Free Logo", "Free Consultation"],
      position: 2,
      isPopular: false
    },
    {
      name: "Startup",
      slug: "startup",
      price: 14999,
      delivery: "7-10 Days",
      includes: [
        "Up to 5-7 Pages",
        "Mobile Responsive Design",
        "Custom Layout & Branding",
        "Lead Capture Forms",
        "SEO-Ready Structure",
        "SSL Secured",
        "Speed & Performance Optimization",
        "Google Indexing",
        "Live Deployment"
      ],
      freebies: ["1 Year Hosting & Domain", "Free Logo", "Free Consultation"],
      position: 3,
      isPopular: true
    },
    {
      name: "Professional",
      slug: "professional",
      price: 26999,
      delivery: "7-15 Days",
      includes: [
        "Up to 8-10 Pages",
        "Mobile Responsive Design",
        "Fully Custom Website",
        "Booking/Inquiry System",
        "Advanced SEO Structure",
        "Security & Performance Setup",
        "SSL",
        "Admin/Staff Dashboard"
      ],
      freebies: ["1 Year Hosting & Domain", "Free Logo", "Free Consultation"],
      position: 4,
      isPopular: false
    },
    {
      name: "Business / E-Commerce",
      slug: "business-ecommerce",
      price: 46999,
      delivery: "7-20 Days",
      includes: [
        "10+ Pages",
        "Mobile Responsive Design",
        "Online Store or Advanced System",
        "Product/Service Setup",
        "Payment Integration (if required)",
        "Advanced Optimization",
        "Admin/Staff Dashboard",
        "Security & Performance Setup",
        "SSL",
        "Priority Support (30 days free)"
      ],
      freebies: ["1 Year Hosting & Domain", "Free Logo", "Free Consultation"],
      position: 5,
      isPopular: false
    }
  ];

  for (const item of pricing) {
    await prisma.pricingPackage.upsert({
      where: { slug: item.slug },
      update: item,
      create: item
    });
  }

  const processSteps = [
    {
      title: "Discovery & Strategy",
      description: "We align your business goals, market positioning, and conversion objectives.",
      deliverables: ["Business intake", "Competitor scan", "Offer positioning", "Content direction"],
      timeline: "Day 1",
      position: 1
    },
    {
      title: "Structure & Wireframe",
      description: "We create a conversion-first structure that guides visitors toward action.",
      deliverables: ["Sitemap", "Section hierarchy", "Wireframe layout", "CTA flow"],
      timeline: "Day 1-2",
      position: 2
    },
    {
      title: "Design & Development",
      description: "We build a premium, responsive website with clear trust signals and messaging.",
      deliverables: ["Brand-aligned UI", "Responsive implementation", "CMS setup", "Form systems"],
      timeline: "Day 2-7",
      position: 3
    },
    {
      title: "Optimization & Testing",
      description: "We optimize speed, SEO structure, and usability before launch.",
      deliverables: ["Technical SEO", "Performance tuning", "QA testing", "Cross-device checks"],
      timeline: "Day 6-9",
      position: 4
    },
    {
      title: "Launch & Support",
      description: "We deploy your website and ensure your team can manage content confidently.",
      deliverables: ["Production launch", "Admin handover", "Tracking setup", "Post-launch support"],
      timeline: "Day 7-10",
      position: 5
    }
  ];

  for (const step of processSteps) {
    await prisma.processStep.upsert({
      where: { id: `seed-process-${step.position}` },
      update: step,
      create: {
        id: `seed-process-${step.position}`,
        ...step
      }
    });
  }

  const faqs = [
    {
      question: "How soon can we launch?",
      answer: "Most projects launch within 3 to 15 days depending on scope, content readiness, and integrations.",
      position: 1
    },
    {
      question: "Do you provide content writing?",
      answer: "Yes. We can help structure and polish your messaging so your offer is clear and conversion-focused.",
      position: 2
    },
    {
      question: "Can you redesign our existing website?",
      answer: "Yes. We can redesign and rebuild your current website with better speed, trust, and lead generation.",
      position: 3
    },
    {
      question: "Do we get admin access?",
      answer: "Yes. Every website includes secure admin access so you can update key content without developer dependency.",
      position: 4
    },
    {
      question: "Is this suitable for local Philippine businesses?",
      answer: "Yes. Our process and messaging are tailored for Philippine audiences and local buyer behavior.",
      position: 5
    }
  ];

  for (const faq of faqs) {
    await prisma.fAQ.upsert({
      where: { id: `seed-faq-${faq.position}` },
      update: faq,
      create: {
        id: `seed-faq-${faq.position}`,
        ...faq
      }
    });
  }

  const portfolio = [
    ["MetroBuild Prime", "Construction", "Modern lead-generation site for a fast-growing contractor.", ["Construction", "Lead Gen", "Corporate"]],
    ["Luna Cart Essentials", "E-commerce", "Product-focused online store with conversion-optimized checkout.", ["E-commerce", "Retail", "Conversion"]],
    ["Axis Advisory Group", "Consulting", "Trust-first consulting website designed for executive buyers.", ["Consulting", "B2B", "Authority"]],
    ["Carewell Medical Clinic", "Healthcare", "Patient inquiry website with mobile-first appointment requests.", ["Healthcare", "Appointments", "Local SEO"]],
    ["Skyline Realty Hub", "Real Estate", "Premium property showcase platform with inquiry routing.", ["Real Estate", "Showcase", "Leads"]],
    ["NorthPeak Engineering", "Construction", "High-credibility engineering brand site with clear service funnels.", ["Construction", "Branding", "SEO"]],
    ["Harvest Basket PH", "E-commerce", "Direct-to-consumer storefront with seasonal campaign landing pages.", ["E-commerce", "Growth", "Performance"]],
    ["Catalyst Coaching Co.", "Consulting", "Coaching funnel website combining authority content and calls-to-action.", ["Consulting", "Coaching", "Lead Funnel"]],
    ["Nova Dental Studio", "Healthcare", "Clinic presence website with treatment pages and booking CTA.", ["Healthcare", "Dental", "Trust"]],
    ["Crown Estates Manila", "Real Estate", "Sales-focused real estate website for premium property listings.", ["Real Estate", "Sales", "Mobile"]]
  ] as const;

  for (let i = 0; i < portfolio.length; i += 1) {
    const [title, industry, shortSummary, tags] = portfolio[i];
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    const record = await prisma.portfolioProject.upsert({
      where: { slug },
      update: {
        industry,
        shortSummary,
        tags: [...tags],
        coverImage: `/placeholders/project-${i + 1}.svg`,
        servicesProvided: ["Website Design", "Development", "SEO Foundation"],
        status: i % 2 === 0 ? ProjectStatus.CLIENT : ProjectStatus.DEMO,
        position: i + 1
      },
      create: {
        title,
        slug,
        industry,
        shortSummary,
        tags: [...tags],
        coverImage: `/placeholders/project-${i + 1}.svg`,
        servicesProvided: ["Website Design", "Development", "SEO Foundation"],
        status: i % 2 === 0 ? ProjectStatus.CLIENT : ProjectStatus.DEMO,
        position: i + 1
      }
    });

    const galleryUrls = [
      `/placeholders/project-${((i + 1) % 10) + 1}.svg`,
      `/placeholders/project-${((i + 2) % 10) + 1}.svg`
    ];

    await prisma.projectImage.deleteMany({ where: { projectId: record.id } });
    await prisma.projectImage.createMany({
      data: galleryUrls.map((url, index) => ({
        projectId: record.id,
        url,
        alt: `${title} gallery ${index + 1}`,
        position: index + 1
      }))
    });
  }

  const testimonials = [
    {
      name: "Mark De Leon",
      role: "Owner",
      company: "MetroBuild Prime",
      quote: "J-Digital helped us present our company professionally and increased inquiry quality in the first month.",
      position: 1
    },
    {
      name: "Alyssa Tan",
      role: "Founder",
      company: "Luna Cart Essentials",
      quote: "Our new website finally reflects our brand. The structure is clear, fast, and made for conversion.",
      position: 2
    },
    {
      name: "Dr. Kevin Cruz",
      role: "Clinic Director",
      company: "Carewell Medical Clinic",
      quote: "The team understood local patient behavior and built a smooth inquiry flow for mobile users.",
      position: 3
    }
  ];

  for (const testimonial of testimonials) {
    await prisma.testimonial.upsert({
      where: { id: `seed-testimonial-${testimonial.position}` },
      update: testimonial,
      create: {
        id: `seed-testimonial-${testimonial.position}`,
        ...testimonial,
        isPublished: true
      }
    });
  }

  console.log("Seed completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
