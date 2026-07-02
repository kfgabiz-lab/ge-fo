import {
  marketsBenefitImages,
  type BenefitItem,
  type IndustryTab,
  type ProductItem,
  type ReferenceItem,
  type WhyItem,
} from "./marketsContent";

export const publicInfrastructureHero = {
  subtitle:
    "Powering resilient, efficient, and future-ready infrastructure for communities and essential public services.",
  title: "Public Infrastructure",
  heroImage: "/img/markets/public-infrastructure/hero/hero.jpg",
};

export const publicInfrastructureIntro = {
  titleLines: ["Reliable Power for", "Critical Infrastructure"],
  text: "Public infrastructure is the vital foundation of modern society, requiring uncompromising power reliability, intelligent automation, and resilient operational systems. As cities continue to modernize, infrastructure operators face increasing pressure to improve energy efficiency, ensure operational continuity, and embrace digital transformation.\nLS ELECTRIC provides a comprehensive portfolio of low- and medium-voltage power distribution systems, including our industry-leading Susol series circuit breakers, advanced Power Transformers (up to 550kV/800MVA), and the GridSol CARE digital management platform. From government facilities and global transportation hubs to critical water treatment plants and mission-critical healthcare institutions, our integrated solutions are engineered to enhance operational stability and optimize energy usage. By converging advanced electrical technologies with smart ICT-based automation, LS ELECTRIC empowers operators to build safer, smarter, and more sustainable environments for the communities they serve.",
};

export const publicInfrastructureIndustryTabs: IndustryTab[] = [
  {
    id: "government",
    label: "Federal, State, and Municipal Government",
    title: "Federal, State, and Municipal Government",
    description:
      "LS ELECTRIC offers robust power distribution and energy management solutions tailored for government administrative facilities and civic infrastructure. Our integrated systems, featuring UL-listed switchgear and intelligent protection relays, support facility modernization and provide enhanced energy visibility. By utilizing our IoT-enabled monitoring platforms, government entities can optimize operational efficiency and meet strict sustainability mandates with scalable, future-ready electrical architectures",
    image: "/img/markets/public-infrastructure/explore/img_government.jpg",
  },
  {
    id: "airports",
    label: "Airports",
    title: "Airports",
    description:
      "Modern aviation hubs require 24/7 reliability across terminals, runway systems, and baggage handling. LS ELECTRIC is a proven leader in airport power modernization, exemplified by our recent project to implement Substation Automation (SA) at Incheon International Airport. This project involves upgrading 154kV GIS (Gas Insulated Switchgear) and integrating IED-based control systems under the IEC 61850 international standard, enabling complete automation of monitoring, measurement, and control.\n\nOur comprehensive airport solutions—from design and manufacturing to SCADA system installation—ensure real-time power management and a seamless, uninterruptible power supply. By combining high-performance automation with proven field experience, LS ELECTRIC helps global airports reduce operational costs, enhance system transparency, and proactively respond to the growing energy demands of the aviation industry.",
    image: "/img/markets/public-infrastructure/explore/img_airports.jpg",
  },
  {
    id: "water",
    label: "Water and Wastewater",
    title: "Water and Wastewater",
    description:
      "Water treatment and pumping stations demand stable process control and high-durability motor management. LS ELECTRIC provides specialized electrical and automation solutions, such as high-efficiency VFDs and PLC-based control systems, that optimize flow rates while reducing energy consumption. Our integrated approach supports the modernization of aging water infrastructure, enabling predictive maintenance and ensuring consistent regulatory performance for municipal utilities.",
    image: "/img/markets/public-infrastructure/explore/img_water.jpg",
  },
  {
    id: "healthcare",
    label: "Healthcare",
    title: "Healthcare",
    description:
      "In healthcare, power continuity is a matter of life and death. LS ELECTRIC delivers redundant power distribution and backup power integration designed for hospitals, laboratories, and medical campuses. Featuring intelligent circuit protection like the Susol Smart MCCB with LSIG relay functions, our solutions ensure uninterrupted operation of mission-critical life-support systems. We help healthcare operators maintain safe, resilient, and energy-optimized environments for patient care.",
    image: "/img/markets/public-infrastructure/explore/img_healthcare.jpg",
  },
];

export const publicInfrastructureReferences: ReferenceItem[] = [
  {
    id: "pi-ref-1",
    href: "",
    image: "/img/markets/public-infrastructure/references/ref_01.jpg",
    title: "HV-LV Integrated Turnkey Supply",
    description:
      "The rapid expansion of AI data centers has increased demand for reliable and integrated power infrastructure solutions. This project focused on providing a comprehensive electrical package to support a large-scale data center facility with high-voltage and low-voltage equipment.",
    location: "United States",
    country: "",
    modal: {
      modalTitle: "HV-LV Integrated Turnkey Supply",
      images: ["/img/markets/public-infrastructure/references/ref_01.jpg"],
      overview: [
        "The rapid expansion of AI data centers has increased demand for reliable and integrated power infrastructure solutions. This project focused on providing a comprehensive electrical package to support a large-scale data center facility with high-voltage and low-voltage equipment.",
        "To meet the customer's aggressive schedule and requirement for streamlined project execution, a single-source supply approach was implemented. The solution included 180 medium-voltage switchgear panels and 120 unit substations, combining coordinated engineering, procurement, manufacturing, and delivery processes to reduce integration complexity and accelerate project progress.",
        "Through integrated project management and close technical coordination, the project was successfully delivered within the required timeline. This approach helped minimize coordination risks, simplify execution for the end user, and demonstrate the value of turnkey power solutions for mission-critical data center applications.",
      ],
      keyInfo: [
        { label: "Location", value: "United States" },
        { label: "Application", value: "Data Center" },
        {
          label: "Scope of Work",
          value: "180 MV switchgear panels and 120 unit substations",
        },
      ],
      ctaLabel: "Discuss your Project",
      ctaHref: "/support/contact-us",
    },
  },
  {
    id: "pi-ref-2",
    href: "",
    image: "/img/markets/public-infrastructure/references/ref_02.jpg",
    title: "Australian Data Center Project",
    description:
      "PROJECT DUNE is a data center project in Australia aimed at providing an integrated solution by combining advanced power infrastructure and building automation capabilities. The project focuses on delivering reliable and cost-effective solutions for global colocation data center customers.",
    location: "Australia",
    country: "",
    modal: {
      modalTitle: "Australian Data Center Project",
      images: ["/img/markets/public-infrastructure/references/ref_02.jpg"],
      overview: [
        "PROJECT DUNE is a data center project in Australia aimed at providing an integrated solution by combining advanced power infrastructure and building automation capabilities. The project focuses on delivering reliable and cost-effective solutions for global colocation data center customers.",
        "To meet customer requirements for competitive pricing and high-quality electrical systems, an alternative sourcing strategy was reviewed by utilizing an established supplier network. Based on this approach, a competitive electrical package including medium-voltage switchgear, transformer solutions, and low-voltage switchgear was proposed.",
        "Through PROJECT DUNE, the company aims to strengthen its position in the Australian data center market and expand future opportunities with global customers by delivering optimized power solutions.",
      ],
      keyInfo: [
        { label: "Location", value: "Australia" },
        { label: "Application", value: "Data Center" },
        {
          label: "Scope of Work",
          value:
            "Medium-voltage switchgear, transformer solutions, and low-voltage switchgear package",
        },
      ],
      ctaLabel: "Discuss your Project",
      ctaHref: "/support/contact-us",
    },
  },
  {
    id: "pi-ref-3",
    href: "",
    image: "/img/markets/public-infrastructure/references/ref_03.jpg",
    title: "AI Data Center Demonstration Testbed",
    description:
      "To address the rapid expansion of the global data center market, the company and a strategic partner established a collaborative demonstration testbed. This facility aims to strengthen validation capabilities in power and cooling infrastructure, supporting joint market entry into the emerging AI data center sector.",
    location: "South Korea",
    country: "",
    modal: {
      modalTitle: "AI Data Center Demonstration Testbed",
      images: ["/img/markets/public-infrastructure/references/ref_03.jpg"],
      overview: [
        "To address the rapid expansion of the global data center market, the company and a strategic partner established a collaborative demonstration testbed. This facility aims to strengthen validation capabilities in power and cooling infrastructure, supporting joint market entry into the emerging AI data center sector.",
        "To meet requirements for a high-efficiency, high-density AI data center model, the solution integrates liquid cooling and advanced power systems. The company is delivering a power quality monitoring system and an optimized DC power architecture, combined with the partner's specialized high-density racks.",
        "This initiative establishes a valuable technical reference for next-generation data center stability and efficiency. It also strengthens long-term business cooperation between both parties, creating a solid foundation to capture future opportunities in the rapidly evolving AI infrastructure market.",
      ],
      keyInfo: [
        { label: "Location", value: "South Korea" },
        { label: "Application", value: "AI Data Center Infrastructure" },
        {
          label: "Scope of Work",
          value:
            "Power quality monitoring, DC power architecture, and high-density rack integration",
        },
      ],
      ctaLabel: "Discuss your Project",
      ctaHref: "/support/contact-us",
    },
  },
];

export const publicInfrastructureBenefits: BenefitItem[] = [
  {
    id: "pi-b1",
    href: "",
    title: "Operational Reliability & Continuity",
    description:
      "Ensure stable, 24/7 operation of essential public services through high-reliability power distribution and diagnostic technologies.",
    capabilities:
      "Advanced UL-listed switchgear and IED-based Substation Automation (SA) that enables complete automation of power monitoring and control for mission-critical facilities like international airports.",
    image: marketsBenefitImages.benefit01,
  },
  {
    id: "pi-b2",
    href: "",
    title: "Scalable & Future-Proof Infrastructure",
    description:
      "Support long-term community growth and modernization with flexible, modular electrical systems.",
    capabilities:
      "Open communication protocols (Modbus, Ethernet) and modular hardware design that simplify integration with existing and future infrastructure.",
    image: marketsBenefitImages.benefit04,
    reverse: true,
  },
  {
    id: "pi-b3",
    href: "",
    title: "Advanced Safety & Regulatory Compliance",
    description:
      "Prioritize public safety and ensure compliance with strict North American industry standards.",
    capabilities:
      "UL-listed Arc-Resistant equipment and intelligent Susol Smart MCCB units that provide precision metering and equipment maintenance diagnostics.",
    image: marketsBenefitImages.benefit05,
  },
  {
    id: "pi-b4",
    href: "",
    title: "Energy Efficiency & Smart Operations",
    description:
      "Reduce the financial burden on public budgets through data-driven energy optimization and smart management.",
    capabilities:
      "IEC 61850 compliant systems and GridSol CARE cloud-based monitoring that minimize energy waste while lowering operational and maintenance costs through real-time data.",
    image: marketsBenefitImages.benefit09,
    reverse: true,
  },
];

export const publicInfrastructureWhyItems: WhyItem[] = [
  {
    id: "pi-why-1",
    href: "",
    title: "Technological Innovation",
    description:
      "Low-voltage protection devices, power distribution systems, smart electrical rooms, BEMS, and renewable energy solutions",
    icon: "/img/markets/img_why_01.svg",
  },
  {
    id: "pi-why-2",
    href: "",
    title: "Operational Optimization",
    description:
      "Optimized power consumption, reduced operating costs, and improved energy efficiency across building facilities",
    icon: "/img/markets/img_why_02.svg",
  },
  {
    id: "pi-why-3",
    href: "",
    title: "Proven Reliability",
    description:
      "Highly reliable and safe power infrastructure tailored to the demanding requirements of commercial buildings",
    icon: "/img/markets/img_why_03.svg",
  },
];

export const publicInfrastructureProducts: ProductItem[] = [
  {
    id: "pi-p1",
    href: "/products-systems/motor-control/metasol-ms",
    image: "/img/markets/public-infrastructure/products/product_01.jpg",
    title: "Metasol MS",
    category: "Metasol Contactor & Overload Relay",
  },
  {
    id: "pi-p2",
    href: "",
    image: "/img/markets/public-infrastructure/products/product_02.jpg",
    title: "Miniature circuit breaker",
    category: "The Global Standard",
  },
  {
    id: "pi-p3",
    href: "",
    image: "/img/markets/public-infrastructure/products/product_03.jpg",
    title: "Metasol MMS",
    category: "Metasol Contactor & Overload Relay",
    badges: 2,
  },
  {
    id: "pi-p4",
    href: "",
    image: "/img/markets/public-infrastructure/products/product_04.jpg",
    title: "Susol UL MCCB",
    category: "Susol UL Molded Case Circuit Breaker",
  },
  {
    id: "pi-p5",
    href: "",
    image: "/img/markets/public-infrastructure/products/product_05.jpg",
    title: "DMPi",
    category: "Intelligent Digital Motor Protection Relay",
    badges: 2,
  },
  {
    id: "pi-p6",
    href: "",
    image: "/img/markets/public-infrastructure/products/product_06.jpg",
    title: "IMP",
    category: "Intelligent Motor Protection Relay",
  },
  {
    id: "pi-p7",
    href: "",
    image: "/img/markets/public-infrastructure/products/product_07.jpg",
    title: "MMP",
    category: "Small Electronic Motor Protection Relay",
  },
  {
    id: "pi-p8",
    href: "",
    image: "/img/markets/public-infrastructure/products/product_08.jpg",
    title: "GMP",
    category: "Electronic Motor Protection Relay",
  },
];
