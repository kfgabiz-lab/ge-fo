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
  titleLines: string[];
  location: string;
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
  role: string;
  name: string;
  gradientStop?: "65.122" | "63.372";
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
  heroImage: `${IMG}/hero.jpg`,
  headlineLines: ["Delivering Power and Automation Solutions Across the United States"],
  paragraphs: [
    "LS ELECTRIC America is the North American subsidiary of LS ELECTRIC, delivering power and automation solutions across the region.",
    "We provide electrical systems, automation products, and field services across the full lifecycle—from design and installation to maintenance and optimization—helping reduce downtime and ensure reliable operations.",
    "Entering the U.S. market with UL certification across its entire product lineup—the first in Asia—LS ELECTRIC America combines global engineering expertise with local execution, supported by its headquarters in Chicago, a sales office in Los Angeles, and six affiliates across North America.",
  ],
  stats: [
    {
      value: "UL-Certified",
      label: "reliability and compliance",
      desc: "As the first and only Asian provider of a full UL-certified switchgear line-up",
    },
    {
      value: "World 6th",
      label: "largest testing capacity lab",
      desc: "Largest-scale testing infrastructure for power systems",
    },
    {
      value: "1,000+",
      label: "Projects",
      desc: "Power infrastructure experience",
    },
  ] satisfies AmericaStatItem[],
};

export const americaShaping = {
  title: "Shaping What's Next",
  locationIcon: "/ico/ico_map_16_white.svg",
  blocks: [
    {
      id: "bastrop",
      image: `${IMG}/shaping-bastrop.jpg`,
      titleLines: [
        "Built in Texas. Ready for",
        "Expanding Power Infrastructure",
      ],
      location: "LS ELECTRIC America Bastrop Campus",
      highlights: [
        { title: "U.S. Based", desc: "46,000㎡ site in Bastrop, Texas" },
        {
          title: "Local Production",
          desc: "Local production of transformers, switchgear, and power systems",
        },
        {
          title: "Industry Proven",
          desc: "Supporting EV, renewable, semiconductor, and data center industries",
        },
        {
          title: "24/7 Support",
          desc: "24/7 service and warranty coordination across the U.S.",
        },
      ],
    },
    {
      id: "utah",
      image: `${IMG}/shaping-utah.jpg`,
      titleLines: ["Expanding Our", "U.S. Production Footprint"],
      location: "LS ELECTRIC Utah Inc.",
      highlights: [
        {
          title: "U.S. Production Base",
          desc: "U.S.-based distribution system production",
        },
        {
          title: "Local Supply",
          desc: "Strengthening local supply capability",
        },
        {
          title: "Infrastructure Support",
          desc: "Supporting power infrastructure expansion across North America",
        },
        {
          title: "Dual Hub Strategy",
          desc: "Operating alongside our Bastrop campus",
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
      image: `${IMG}/business-01.jpg`,
      title: "LV & MV Power Solutions",
      description:
        "We provide complete low and medium voltage power distribution solutions—from transformers and switchgear to switchboards, panelboards, and DC power systems. Built for mission critical applications like data centers, manufacturing, and commercial infrastructure, our solutions deliver the reliability, efficiency, and scalability North American operations demand.",
      imagePosition: "left",
    },
    {
      id: "grid",
      image: `${IMG}/business-02.jpg`,
      title: "Grid & Utility Infrastructure",
      description:
        "LS ELECTRIC supports utilities, renewable developers, and large industrial projects with high voltage transmission and grid infrastructure solutions. Our portfolio—from ultra high voltage disconnect switches to power transformers—is designed to strengthen grid resilience, improve efficiency, and support the transition to cleaner, more reliable energy systems across North America.",
      imagePosition: "right",
    },
    {
      id: "automation",
      image: `${IMG}/business-03.jpg`,
      title: "Automation & Industrial Control",
      description:
        "We deliver advanced automation and motor control solutions including VFDs, PLCs, HMIs, and integrated control systems. Designed for North American industry, our technologies help manufacturers and operators boost productivity, reduce downtime, and drive smarter, data driven decision making.",
      imagePosition: "left",
    },
  ] satisfies AmericaBusinessItem[],
};

export const americaCareersBanner = {
  /** Figma 5876:29880 (MO) · PC banner-bg.png */
  bgImage: `${IMG}/banner-bg.png`,
  bgImageMo: `${IMG}/banner-bg-mo.png`,
  title: "Imagineers Dedicated to the Future of Smart Energy",
  description: "Join LS ELECTRIC and drive the energy transition in North America.",
  ctaLabel: "Explore Careers",
  ctaHref: "/company/careers",
};

export const americaOperate = {
  title: "Where We Operate",
  description:
    "Expanding our footprint across the United States. LS ELECTRIC connects operational hubs and project sites through a strong network, delivering reliable performance wherever we operate.",
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
              { type: "address", text: "625 Heathrow Dr, Lincolnshire, IL 60069" },
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
              { type: "address", text: "409 Technology Dr, Bastrop, TX 78602" },
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
              { type: "address", text: "3176 Main St. Suite 201, Duluth, GA 30096" },
              { type: "phone", text: "512-230-3873" },
            ],
          },
          {
            id: "dallas",
            badge: "Office",
            name: "LS ELECTRIC America Dallas Office",
            role: "Sales",
            contacts: [{ type: "address", text: "320 Decker Dr, Irving, TX 75062" }],
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
              { type: "address", text: "655 E 4930 N, Enoch, UT 84721" },
              { type: "phone", text: "435-865-0125" },
              {
                type: "website",
                text: "https://mcmeng2.com/",
                href: "https://mcmeng2.com/",
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
  title: "Meet Our Leaders",
  description:
    "Connecting accomplished executives and business leaders who shape industries and create lasting value.",
  letterTitle:
    "Letter from COO: Our Commitment to MCM Engineering II Customers and the Power Distribution Industry",
  letterBody: [
    "At MCM Engineering II, our core values distinguish us in the manufacturing landscape, permeating every facet of our operations,",
    "providing our customers a distinct competitive edge. Our commitment to our customers and the industry we serve embodies these values:",
  ],
  items: [
    {
      id: "ceo",
      image: `${IMG}/leader-01.jpg`,
      role: "President/CEO",
      name: "Chung Hee “Charlie” Lee",
      gradientStop: "65.122",
    },
    {
      id: "coo",
      image: `${IMG}/leader-02.jpg`,
      role: "COO",
      name: "Byron Black",
      gradientStop: "63.372",
    },
    {
      id: "sales",
      image: `${IMG}/leader-03.jpg`,
      role: "Sales Director",
      name: "Clarke Arnold",
      gradientStop: "63.372",
    },
    {
      id: "operations",
      image: `${IMG}/leader-04.jpg`,
      role: "Director of Operation",
      name: "Richard Dawson",
      gradientStop: "63.372",
    },
  ] satisfies AmericaLeaderItem[],
};

export { companyMission as americaMission } from "./companyMissionContent";

export const americaFollow = {
  title:
    "Follow us for the latest updates, insights,and innovations from LS ELECTRIC.",
  links: [
    {
      id: "instagram",
      label: "INSTAGRAM",
      href: "https://www.instagram.com/lselectric_official",
      icon: `${IMG}/follow-insta.svg`,
    },
    // {
    //   id: "facebook",
    //   label: "FACEBOOK",
    //   href: "https://www.facebook.com/lselectricofficial",
    //   icon: `${IMG}/follow-facebook.svg`,
    // },
    {
      id: "linkedin",
      label: "LINKEDIN",
      href: "https://www.linkedin.com/company/lselectricamerica/jobs/",
      icon: `${IMG}/follow-linkedin.svg`,
    },
    {
      id: "youtube",
      label: "YOUTUBE",
      href: "https://www.youtube.com/channel/UCS4SwwqhnNK4072O8BDZtLg",
      icon: `${IMG}/follow-youtube.svg`,
    },
  ] satisfies AmericaSocialLink[],
};
