import "../../styles/Home/Services.css";
import { useState, useEffect, useRef } from "react";
import Lottie from "lottie-react";
import integratedAnim from "../../animations/integrated.json";
import budgetAnim from "../../animations/budget.json";
import riskAnim from "../../animations/risk.json";
import goalAnim from "../../animations/goal.json";

export default function Services() {
  const services = [
    {
      title: "Gelir ve giderlerinizi tek bir yerden kolayca yönetin",
      subTitle: "Gelir & Gider Takibi",
      description: `Maaş ve ek gelirlerinizi kaydedin, aylık harcamalarınızı kategorize edin. 
      Dinamik form yapısı ve kullanıcı dostu arayüz ile nakit akışınızı saniyeler içinde 
      dijitalleştirin ve finansal farkındalığınızı artırın.`,
      animation: budgetAnim
    },
    {
      title: "Yıllık bütçe performansınızı grafiklerle analiz edin",
      subTitle: "Bütçe Özeti & Grafikler",
      description: `Gelir-gider dengenizi interaktif grafiklerle görselleştirin. Aylık net 
      bakiyenizi takip edin, geçmiş dönemlerle karşılaştırmalar yapın ve finansal trendlerinizi 
      anlık olarak görerek bütçenizi kontrol altına alın.`,
      animation: integratedAnim
    },
    {
      title: "Banka standartlarında finansal sağlık analizi",
      subTitle: "Finansal Sağlık Radarı",
      description: `Tasarruf oranı, harcama istikrarı ve büyüme trendi gibi kritik metriklerle 
      hesaplanan detaylı sağlık skorunuzu öğrenin. Yapay zeka destekli akıllı önerilerle 
      finansal durumunuzu "Kritik" seviyesinden "Mükemmel" seviyesine taşıyın.`,
      animation: riskAnim
    },
    {
      title: "Risk profilinize uygun yatırım araçlarını keşfedin",
      subTitle: "Yatırım Planlama & Piyasa Takibi",
      description: `Risk toleransı anketi ile yatırımcı profilinizi belirleyin ve AHP algoritmasıyla 
      size özel seçilen S&P 500 hisse önerilerini inceleyin. Canlı piyasa verileri, volatilite 
      analizleri ve 90 günlük performans trendleri ile yatırımlarınıza yön verin.`,
      animation: goalAnim
    }
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const refs = useRef([]);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "-50% 0px -50% 0px",
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveIndex(Number(entry.target.getAttribute("data-index")));
        }
      });
    }, options);

    refs.current.forEach((ref) => ref && observer.observe(ref));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="services-wrapper">

      <div className="service-text-list">
        {services.map((item, index) => (
          <div className="service-container" key={index} data-index={index} ref={(el) => (refs.current[index] = el)}>
            <div className="service-description-container">
              <div className="service-description-subtitle">
                <span>{item.subTitle}</span>
              </div>
              <div className="service-description-title">
                <span>{item.title}</span>
              </div>
              <div className="service-description">
                <span>{item.description}</span>
              </div>
            </div>

            <div className="mobile-service-lottie" aria-hidden={false}>
              <Lottie animationData={item.animation} loop={true} autoplay={true} />
            </div>
          </div>
        ))}
      </div>

      <div className="sticky-image-container" aria-hidden={false}>
        {services.map((srv, i) => (
          <div
            className={`sticky-lottie-wrapper ${activeIndex === i ? "active" : ""}`}
            key={i}
            aria-hidden={activeIndex === i ? "false" : "true"}
          >
            <Lottie animationData={srv.animation} loop={true} autoplay={true} />
          </div>
        ))}
      </div>
    </div>
  );
}