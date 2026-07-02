import Link from "next/link";

type IconCardItem = {
  href?: string;
  image: string;
  imageAlt: string;
  title: string;
  description: React.ReactNode;
};

const iconCardItems: IconCardItem[] = [
  {
    href: "/support/connect-portal",
    image: "/img/main/icon_card_01.svg",
    imageAlt: "Connect Portal",
    title: "Connect Portal",
    description: (
      <>
        One platform to browse products,
        <br /> request quotes, track orders,
        <br />
        and manage documents.
      </>
    ),
  },
  {
    href: "/support/tech-hub",
    image: "/img/main/icon_card_02.svg",
    imageAlt: "Tech Hub",
    title: "Tech Hub",
    description: (
      <>
        Watch step-by-step video
        <br />
        tutorials and service guides for
        <br />
        LS ELECTRIC products
      </>
    ),
  },
  {
    href: "/support/download-center",
    image: "/img/main/icon_card_03.svg",
    imageAlt: "Download Center",
    title: "Download Center",
    description: (
      <>
        Download the latest product
        <br />
        catalogs, datasheets,
        <br />
        and installation guides
      </>
    ),
  },
  {
    image: "/img/main/icon_card_04.svg",
    imageAlt: "Training",
    title: "Training",
    description: (
      <>
        Get certified with in-person
        <br />
        training led by LS ELECTRIC
        <br />
        product experts
      </>
    ),
  },
];

export default function IconCards() {
  return (
    <section className="icon_cards">
      <div className="inner">
        <h2 className="section_tit">Explore More</h2>
        <div className="items">
          {iconCardItems.map((item) => {
            const content = (
              <>
                <div className="img_area">
                  <img loading="lazy" decoding="async" src={item.image} alt={item.imageAlt} />
                </div>
                <div className="txt_area">
                  <h3 className="tit">{item.title}</h3>
                  <p className="txt">{item.description}</p>
                </div>
              </>
            );

            if (item.href) {
              return (
                <Link key={item.title} href={item.href} className="item">
                  {content}
                </Link>
              );
            }

            return (
              <div key={item.title} className="item">
                {content}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
