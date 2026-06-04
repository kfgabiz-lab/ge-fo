type IconCardItem = {
  href: string;
  image: string;
  imageAlt: string;
  title: string;
  description: React.ReactNode;
};

const iconCardItems: IconCardItem[] = [
  {
    href: "",
    image: "/img/main/icon_card_01.png",
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
    href: "",
    image: "/img/main/icon_card_02.png",
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
    href: "",
    image: "/img/main/icon_card_03.png",
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
    href: "",
    image: "/img/main/icon_card_04.png",
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
          {iconCardItems.map((item) => (
            <a key={item.title} href={item.href} className="item">
              <div className="img_area">
                <img loading="lazy" decoding="async" src={item.image} alt={item.imageAlt} />
              </div>
              <div className="txt_area">
                <h3 className="tit">{item.title}</h3>
                <p className="txt">{item.description}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
