const IMG = "/img/company/affiliate";

export const affiliatePageTitle = {
  title: "Affiliate in America",
  description: "Discover the global network of LS ELECTRIC affiliates and subsidiaries.",
};

export const affiliateIntro = {
  heroImage: `${IMG}/hero.jpg`,
  headlineLines: ["Power and Infrastructure Solutions", "Across the Americas"],
  paragraphs: [
    "Our affiliates deliver reliable electrical systems, engineering services,",
    "and industrial solutions to support critical operations across North America.",
  ],
};

export type AffiliateAmericaItem = {
  id: string;
  logo: string;
  logoWidth: number;
  logoHeight: number;
  foundedYear: string;
  website: string;
  websiteHref: string;
  keyBusinessAreas: string;
  headquarters: string;
};

/** Figma 5565:134319 — affiliate rows */
export const affiliateList: AffiliateAmericaItem[] = [
  {
    id: "ls-energy-solutions",
    logo: `${IMG}/logo-ls-energy-solutions.png`,
    logoWidth: 218,
    logoHeight: 32,
    foundedYear: "2008",
    website: "https://www.ls-es.com",
    websiteHref: "https://www.ls-es.com",
    keyBusinessAreas: "Energy storage (ESS), power infrastructure, smart energy",
    headquarters: "9201 Forsyth Park Dr.Charlotte, NC USA 28273",
  },
  {
    id: "ls-electric-usa",
    logo: `${IMG}/logo-ls-electric-usa.png`,
    logoWidth: 218,
    logoHeight: 42,
    foundedYear: "1995",
    website: "https://mcmeng2.com/",
    websiteHref: "https://mcmeng2.com/",
    keyBusinessAreas: "Energy storage (ESS), power infrastructure, smart energy",
    headquarters: "655 E 4930 N Enoch, UT",
  },
  {
    id: "ls-e-mobility-solutions",
    logo: `${IMG}/logo-ls-e-mobility-solutions.png`,
    logoWidth: 218,
    logoHeight: 30,
    foundedYear: "2005",
    website: "https://www.lsems.com/en/",
    websiteHref: "https://www.lsems.com/en/",
    keyBusinessAreas: "EV components, electrical systems, battery-related solutions",
    headquarters: "5700 Crooks Rd. STE 445, Troy, MI 48098, USA",
  },
  {
    id: "ls-cable-usa",
    logo: `${IMG}/logo-ls-cable-usa.png`,
    logoWidth: 218,
    logoHeight: 56,
    foundedYear: "1962",
    website: "https://lscsusa.com",
    websiteHref: "https://lscsusa.com",
    keyBusinessAreas: "Power cables, submarine cables, communication cables",
    headquarters: "6625 The Corners Parkway, Suite 400 Peachtree Corners, GA 30092",
  },
  {
    id: "ls-mtron",
    logo: `${IMG}/logo-ls-mtron.png`,
    logoWidth: 144,
    logoHeight: 32,
    foundedYear: "1962",
    website: "https://www.lsmtron.com/us/en/",
    websiteHref: "https://www.lsmtron.com/us/en/",
    keyBusinessAreas: "Tractors, injection molding machines, industrial equipment",
    headquarters: "PO BOX 70, 6900 Corporation Pkwy, Battleboro, NC 27809",
  },
  {
    id: "ls-mnm",
    logo: `${IMG}/logo-ls-mnm.png`,
    logoWidth: 132,
    logoHeight: 32,
    foundedYear: "1936",
    website: "https://www.lsmnm.com/en/main",
    websiteHref: "https://www.lsmnm.com/en/main",
    keyBusinessAreas: "Copper smelting, precious metals, battery materials",
    headquarters: "148 Sanam-ro, Onsan-eup, Ulju-gun, Ulsan, Republic of Korea, 44997",
  },
];
