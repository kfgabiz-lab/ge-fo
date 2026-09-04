const IMG = "/img/company/america";

export type AmericaStatItem = {
  value: string;
  label: string;
  desc: string;
};

export type AmericaShapingHighlight = {
  title: string;
  desc: string;
};

export type AmericaShapingBlock = {
  id: string;
  image: string;
  video?: string;
  titleLines: string[];
  location: string;
  locationHref?: string;
  highlights: AmericaShapingHighlight[];
};

export type AmericaBusinessItem = {
  id: string;
  image: string;
  title: string;
  description: string;
  imagePosition: "left" | "right";
};

export type AmericaLocationContact = {
  type: "address" | "phone" | "website";
  text: string;
  href?: string;
};

export type AmericaLocationItem = {
  id: string;
  badge: string;
  name: string;
  role: string;
  contacts: AmericaLocationContact[];
};

export type AmericaLocationGroup = {
  id: string;
  title: string;
  rows: AmericaLocationItem[][];
};

export type AmericaLeaderItem = {
  id: string;
  image: string;
  imageMobile?: string;
  role: string;
  name: string;
};

export type AmericaSocialLink = {
  id: string;
  label: string;
  href: string;
  icon: string;
};

export const americaPageTitle = {
  title: "LS ELECTRIC America",
  description:
    "Empowering North American industries with reliable power and automation technologies.",
};

export const americaIntro = {
  heroImage: `${IMG}/hero.webp`,
  headlineLines: ["Delivering Power Distribution and", "Automation Solutions Across the United States"],
  paragraphs: [
    "As the North American subsidiary of global leader LS ELECTRIC, LS ELECTRIC America delivers comprehensive power and automation solutions engineered to maximize operational reliability and efficiency.",
    "We partner with clients across the entire asset lifecycle—providing tailored system design, seamless installation, proactive maintenance, and continuous optimization to minimize costly downtime.",
    "Driven by a legacy of innovation, LS ELECTRIC America made history as the first Asian manufacturer to secure UL certification across its entire product portfolio. By combining world-class engineering expertise with localized execution, we ensure responsive, top-tier service tailored to regional demands.",
    "Headquartered in Chicago, supported by a Los Angeles sales office, and backed by six strategic affiliates, LS ELECTRIC America is uniquely positioned to empower industrial and commercial operations across North America.",
  ],
  stats: [
    {
      value: "UL-Certified",
      label: "for Reliability and compliance",
      desc: "The first and only Asian provider of a full UL-certified switchgear line-up.",
    },
    {
      value: "World's 6th",
      label: "Largest power-system testing-capacity lab",
      desc: "Globally ranked testing infrastructure guaranteeing power system resilience",
    },
    {
      value: "1,000+",
      label: "Power infrastructure Projects",
      desc: "Proven track record of over 1,000 global power deployments",
    },
  ] satisfies AmericaStatItem[],
};

export const americaShaping = {
  title: "Shaping What's Next",
  locationIcon: "/ico/ico_map_16_white.svg",
  blocks: [
    {
      id: "bastrop",
      image: `${IMG}/shaping-bastrop.webp`,
      video: `${IMG}/bastrop.webm`,
      titleLines: [
        "Built in Texas. Proven across America.",
        "Empowering tomorrow's energy",
        "infrastructure.",
      ],
      location: "LS ELECTRIC America Bastrop Center",
      locationHref: "https://maps.app.goo.gl/umXyQpytNzE153Fa7",
      highlights: [
        {
          title: "State-of-the-Art Facility",
          desc: "495,000 ft² of precision engineering",
        },
        {
          title: "Grid-Scale Manufacturing",
          desc: "Domestically producing transformers, switchgear, and power systems.",
        },
        {
          title: "Mission-Critical Support",
          desc: "Supporting U.S. power infrastructure, including semiconductor, data center, EV, and renewable industries.",
        },
        {
          title: "24/7 Service",
          desc: "Pre- and after-sales services, on-site project management, and training across the U.S.",
        },
      ],
    },
    {
      id: "utah",
      image: `${IMG}/shaping-utah.webp`,
      video: `${IMG}/utah.webm`,
      titleLines: [
        "Securing the Supply Chain:",
        "Our Expanding U.S. Footprint",
      ],
      location: "LS ELECTRIC Utah Inc.",
      locationHref: "https://maps.app.goo.gl/oqWsfJnVjXXdZbBa8",
      highlights: [
        {
          title: "Western United States Hub",
          desc: "Dedicated regional manufacturing of heavy-duty distribution systems and custom engineering.",
        },
        {
          title: "On-Demand Capacity",
          desc: "Reducing lead times and strengthening local supply resilience for U.S. power markets.",
        },
        {
          title: "Custom Engineering",
          desc: "System integration for infrastructure expansion across North America.",
        },
        {
          title: "Market Responsiveness",
          desc: "Enhancing delivery speed and responsiveness for North American customers.",
        },
      ],
    },
  ] satisfies AmericaShapingBlock[],
};

export const americaBusiness = {
  title: "Core Business Areas",
  description:
    "Practical solutions that power infrastructure, manufacturing, and energy systems.",
  items: [
    {
      id: "lv-mv",
      image: `${IMG}/business-01.webp`,
      title: "LV & MV Power Solutions",
      description:
        "LS ELECTRIC America delivers LV and MV power distribution solutions, from transformers and switchgear to switchboards, panelboards, and DC power systems. These solutions provide reliable, efficient, and scalable power for data centers, manufacturing, and commercial infrastructure industries",
      imagePosition: "left",
    },
    {
      id: "grid",
      image: `${IMG}/business-02.webp`,
      title: "Grid & Utility Infrastructure",
      description:
        "LS ELECTRIC supports utilities, renewable developers, and large industrial projects with high-voltage transmission and grid infrastructure solutions. Our portfolio includes ultra-high-voltage disconnect switches and power transformers. This portfolio is designed to strengthen grid resilience, improve efficiency, and support the transition to more reliable energy systems across North America.",
      imagePosition: "right",
    },
    {
      id: "automation",
      image: `${IMG}/business-03.webp`,
      title: "Automation & Industrial Control",
      description:
        "LS ELECTRIC America delivers VFDs, PLCs, HMIs, and integrated automation and motor control systems. Built for North American industry, these solutions increase productivity, reduce downtime, and enable data-driven decisions.",
      imagePosition: "left",
    },
  ] satisfies AmericaBusinessItem[],
};

export const americaCareersBanner = {
  bgImage: `${IMG}/banner-bg.svg`,
  bgImageMo: `${IMG}/banner-bg-mo.svg`,
  title: "Imagineers Dedicated to the Future of Smart Energy",
  description: "Join LS ELECTRIC and drive the energy transition in North America.",
  ctaLabel: "Explore Careers",
  ctaHref: "/company/careers",
};

export const americaOperate = {
  title: "LS ELECTRIC U.S. Operations",
  description:
    "LS ELECTRIC supports U.S. projects through connected operational hubs and service locations, delivering reliable local performance.",
  mapImage: `${IMG}/map.svg`,
  contactIcons: {
    map: "/ico/ico_map_16.svg",
    phone: "/ico/ico_phone_16.svg",
    website: `${IMG}/ico_website_16.svg`,
  },
  locationGroups: [
    {
      id: "head-office",
      title: "Head Office",
      rows: [
        [
          {
            id: "head-office",
            badge: "Head Office",
            name: "LS ELECTRIC America Inc.",
            role: "Sales, Warehouse",
            contacts: [
              {
                type: "address",
                text: "625 Heathrow Dr, Lincolnshire, IL 60069",
                href: "https://maps.app.goo.gl/MdahH2KN3HEopCvj7",
              },
              { type: "phone", text: "224-352-2265" },
            ],
          },
        ],
      ],
    },
    {
      id: "office",
      title: "Office",
      rows: [
        [
          {
            id: "bastrop",
            badge: "Office",
            name: "LS ELECTRIC America Bastrop Center",
            role: "Service, Training / Manufacturing",
            contacts: [
              {
                type: "address",
                text: "409 Technology Dr, Bastrop, TX 78602",
                href: "https://maps.app.goo.gl/umXyQpytNzE153Fa7",
              },
              { type: "phone", text: "800-891-2941" },
            ],
          },
          {
            id: "western",
            badge: "Office",
            name: "LS ELECTRIC America Western Office",
            role: "Sales, Warehouse",
            contacts: [
              {
                type: "address",
                text: "9647 Santa Fe Springs Rd, Santa Fe Springs, CA 90670",
                href: "https://maps.app.goo.gl/d2a7bg57KEghM8by7",
              },
              { type: "phone", text: "949-333-3140" },
            ],
          },
        ],
        [
          {
            id: "atlanta",
            badge: "Office",
            name: "LS ELECTRIC America Atlanta Office",
            role: "Sales",
            contacts: [
              {
                type: "address",
                text: "3176 Main St. Suite 201, Duluth, GA 30096",
                href: "https://maps.app.goo.gl/WrGAc9eRMs7MwGdh7",
              },
              { type: "phone", text: "512-230-3873" },
            ],
          },
          {
            id: "dallas",
            badge: "Office",
            name: "LS ELECTRIC America Dallas Office",
            role: "Sales",
            contacts: [
              {
                type: "address",
                text: "320 Decker Dr, Irving, TX 75062",
                href: "https://maps.app.goo.gl/1h13afiB86wzsw1W7",
              },
            ],
          },
        ],
      ],
    },
    {
      id: "affiliate",
      title: "Affiliate",
      rows: [
        [
          {
            id: "utah",
            badge: "Affiliate",
            name: "LS ELECTRIC Utah Inc.",
            role: "Sales, Manufacturing",
            contacts: [
              {
                type: "address",
                text: "655 E 4930 N, Enoch, UT 84721",
                href: "https://maps.app.goo.gl/oqWsfJnVjXXdZbBa8",
              },
              { type: "phone", text: "435-865-0125" },
              {
                type: "website",
                text: "https://lselectricutah.com",
                href: "https://lselectricutah.com",
              },
            ],
          },
          {
            id: "energy-solutions",
            badge: "Affiliate",
            name: "LS Energy Solutions",
            role: "Service, Engineering",
            contacts: [
              {
                type: "address",
                text: "9201 Forsyth Park Dr., Charlotte, NC 28273",
                href: "https://maps.app.goo.gl/tNsViuLJvkXXntb57",
              },
              { type: "phone", text: "980-221-0654" },
              {
                type: "website",
                text: "https://www.ls-es.com/",
                href: "https://www.ls-es.com/",
              },
            ],
          },
        ],
      ],
    },
  ] satisfies AmericaLocationGroup[],
};

export const americaLeaders = {
  title: "Meet LS ELECTRIC America Leaders",
  description:
    "Leaders advancing North American power, automation, and energy infrastructure.",
  featured: {
    id: "charlie-lee",
    image: `${IMG}/leader-featured.webp`,
    imageMobile: `${IMG}/leader-featured-mo.webp`,
    name: "ChungHee (Charlie) Lee",
    role: "CEO & President of LS ELECTRIC America and\nLS ELECTRIC Utah",
  } satisfies AmericaLeaderItem,
  items: [
    {
      id: "youn-seob-lim",
      image: `${IMG}/leader-01.webp`,
      name: "Youn Seob Lim",
      role: "Head of Grid Business Division & President of LS Energy Solutions",
    },
    {
      id: "jaekyun-kim",
      image: `${IMG}/leader-02.webp`,
      name: "JaeKyun (J.K.) Kim",
      role: "Head of Power System Division",
    },
    {
      id: "sean-cho",
      image: `${IMG}/leader-03.webp`,
      name: "Sean Seungheon Cho",
      role: "Head of Business Support Division",
    },
    {
      id: "edward-lee",
      image: `${IMG}/leader-04.webp`,
      name: "Edward Lee",
      role: "Head of Solution Business Department",
    },
    {
      id: "steve-lee",
      image: `${IMG}/leader-05.webp`,
      name: "Steve Lee",
      role: "Head of Engineering & Technology Center",
    },
    {
      id: "yongmo-jeong",
      image: `${IMG}/leader-06.webp`,
      name: "Yongmo Jeong",
      role: "Head of Operation Center, Bastrop Campus TX",
    },
    {
      id: "andrew-urda",
      image: `${IMG}/leader-07.webp`,
      name: "Andrew Urda",
      role: "Head of Marketing",
    },
    {
      id: "mike-ellisor",
      image: `${IMG}/leader-08.webp`,
      name: "Mike Ellisor",
      role: "Head of Power Solution Sales Team",
    },
  ] satisfies AmericaLeaderItem[],
};

export { companyMission as americaMission } from "./companyMissionContent";

export const americaFollow = {
  title:
    "Follow us for the latest updates, insights, and innovations from LS ELECTRIC.",
  links: [
    {
      id: "instagram",
      label: "INSTAGRAM",
      href: "https://www.instagram.com/lselectricamerica/",
      icon: `${IMG}/follow-insta.svg`,
    },
    {
      id: "linkedin",
      label: "LINKEDIN",
      href: "https://www.linkedin.com/company/lselectricamerica/posts",
      icon: `${IMG}/follow-linkedin.svg`,
    },
    {
      id: "youtube",
      label: "YOUTUBE",
      href: "https://www.youtube.com/@lselectricamerica",
      icon: `${IMG}/follow-youtube.svg`,
    },
  ] satisfies AmericaSocialLink[],
};
