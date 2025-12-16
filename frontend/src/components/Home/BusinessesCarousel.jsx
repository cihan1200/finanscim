import "../../styles/Home/BusinessesCarousel.css";
import { AiFillOpenAI } from "react-icons/ai";
import { TbBrandAppleFilled, TbBrandChrome } from "react-icons/tb";
import { ArrowRight, ArrowLeft, ChevronRight } from "lucide-react";
import { useRef, useEffect } from "react";

export default function BusinessesCarousel() {
  const businesses = [
    {
      title: "AI",
      description: `Finanscım'ın yapay zeka destekli finansal analiz araçlarıyla,
      kişisel ve kurumsal finans yönetiminizi optimize edin. Akıllı önerilerle
      yatırım kararlarınızı güçlendirin.`,
      brands: [AiFillOpenAI, TbBrandAppleFilled, TbBrandChrome]
    },
    {
      title: "SaaS",
      description: `Finanscım'ın bulut tabanlı SaaS çözümleriyle, finansal
      süreçlerinizi dijitalleştirin ve verimliliği artırın. Her yerden erişimle
      işinizi büyütün.`,
      brands: [AiFillOpenAI, TbBrandAppleFilled, TbBrandChrome]
    },
    {
      title: "Geniş Pazar",
      description: `Finanscım'ın geniş ürün ve hizmet yelpazesiyle,
      finansal ihtiyaçlarınıza uygun çözümleri keşfedin. Güvenilir iş ortaklarıyla
      işinizi güçlendirin.`,
      brands: [AiFillOpenAI, TbBrandAppleFilled, TbBrandChrome]
    },
    {
      title: "Entegre çözümler",
      description: `Finanscım'ın entegre finansal çözümleriyle, mevcut
      platformlarınıza sorunsuz finansal hizmetler ekleyin. Müşteri deneyimini
      iyileştirin ve gelir akışlarınızı çeşitlendirin.`,
      brands: [AiFillOpenAI, TbBrandAppleFilled, TbBrandChrome]
    },
    {
      title: "E-ticaret",
      description: `Finanscım'ın e-ticaret finansal çözümleriyle, online
      mağazanızın ödeme süreçlerini kolaylaştırın. Güvenli ve hızlı işlemlerle
      müşteri memnuniyetini artırın.`,
      brands: [AiFillOpenAI, TbBrandAppleFilled, TbBrandChrome]
    },
    {
      title: "Kripto",
      description: `Finanscım'ın kripto para finansal hizmetleriyle, dijital
      varlıklarınızı güvenle yönetin. Kripto ödemeleri ve yatırımlarıyla finansal
      portföyünüzü çeşitlendirin.`,
      brands: [AiFillOpenAI, TbBrandAppleFilled, TbBrandChrome]
    },
    {
      title: "İçerik Oluşturucular",
      description: `Finanscım'ın içerik oluşturuculara özel finansal çözümleriyle,
      gelirlerinizi optimize edin. Abonelik yönetimi ve ödeme sistemleriyle
      kazançlarınızı artırın.`,
      brands: [AiFillOpenAI, TbBrandAppleFilled, TbBrandChrome]
    }
  ];

  const carouselRef = useRef(null);

  useEffect(() => {
    const slider = carouselRef.current;
    if (!slider) return;

    let isDragging = false;
    let startX = 0;
    let startScrollLeft = 0;

    const cardGap = 20;

    const onPointerDown = (e) => {
      isDragging = true;
      slider.classList.add("dragging");

      startX = e.clientX || e.touches?.[0].clientX;
      startScrollLeft = slider.scrollLeft;

      slider.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e) => {
      if (!isDragging) return;
      const x = e.clientX || e.touches?.[0].clientX;
      const delta = startX - x;
      slider.scrollLeft = startScrollLeft + delta;
    };

    const onPointerUp = (e) => {
      if (!isDragging) return;
      isDragging = false;
      slider.classList.remove("dragging");

      const cards = slider.querySelectorAll(".business-card");
      if (!cards.length) return;

      const cardWidth = cards[0].offsetWidth;
      const totalCardWidth = cardWidth + cardGap;

      const index = Math.round(slider.scrollLeft / totalCardWidth);

      slider.scrollTo({
        left: index * totalCardWidth,
        behavior: "smooth",
      });

      slider.releasePointerCapture(e.pointerId);
    };

    slider.addEventListener("pointerdown", onPointerDown);
    slider.addEventListener("pointermove", onPointerMove);
    slider.addEventListener("pointerup", onPointerUp);
    slider.addEventListener("pointerleave", onPointerUp);

    return () => {
      slider.removeEventListener("pointerdown", onPointerDown);
      slider.removeEventListener("pointermove", onPointerMove);
      slider.removeEventListener("pointerup", onPointerUp);
      slider.removeEventListener("pointerleave", onPointerUp);
    };
  }, []);


  const scrollRight = () => {
    if (carouselRef.current) {
      const card = carouselRef.current.querySelector(".business-card");
      if (!card) return;

      const cardWidth = card.offsetWidth;
      const gap = 20;

      carouselRef.current.scrollBy({
        left: cardWidth + gap,
        behavior: "smooth"
      });
    }
  };

  const scrollLeft = () => {
    if (carouselRef.current) {
      const card = carouselRef.current.querySelector(".business-card");
      if (!card) return;

      const cardWidth = card.offsetWidth;
      const gap = 20;

      carouselRef.current.scrollBy({
        left: -(cardWidth + gap),
        behavior: "smooth"
      });
    }
  };

  return (
    <div className="section-container">

      <div className="section-header">
        <div className="businesses-carousel-header">
          <span className="header-title">Her türlü işletme için finansal çözümler</span>
          <span className="header-description">Küresel yapay zeka şirketlerinden kategori tanımlayan pazar yerlerine kadar, farklı sektörlerdeki başarılı işletmeler Finanscım ile büyüyor ve ölçekleniyor.</span>
        </div>
        <div className="nav-buttons">
          <button className="nav-button" onClick={scrollLeft}><ArrowLeft size="1em" /></button>
          <button className="nav-button" onClick={scrollRight}><ArrowRight size="1em" /></button>
        </div>
      </div>

      <div className="businesses-carousel-scroll-wrapper">

        <div className="businesses-carousel-container" ref={carouselRef}>

          {businesses.map((business, index) => (
            <div key={index} className="business-card">

              <div className="business-description-section">
                <span className="business-title">{business.title}</span>
                <span className="business-description">{business.description}</span>
                <div className="business-details-link">
                  <span className="business-details-text">Detaylar</span>
                  <ChevronRight size="0.8em" />
                </div>
              </div>

              <div className="brands">
                {business.brands && business.brands.map((brand, brandIndex) => (
                  brand({ key: brandIndex, className: "brand-icon" })
                ))}
              </div>

            </div>
          ))}

        </div>

      </div>

    </div>
  );
}