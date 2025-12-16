import "../../styles/Home/CompanyStories.css";
import { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import connectIcon from "../../assests/hyperboloid.png";
import paymentsIcon from "../../assests/combinatorics.png";
import amazonLogoNoColor from "../../assests/amazonLogoNoColor.svg";
import amazonLogoWithColor from "../../assests/amazonLogoWithColor.png";
import companyStoryLinkLogo from "../../assests/companyStoryLinkLogo.svg";
import bmwLogoWithColor from "../../assests/bmwLogoWithColor.png";
import bmwLogoNoColor from "../../assests/bmwLogoNoColor.svg";
import maerskLogoWithColor from "../../assests/maerskLogoWithColor.png";
import maerskLogoNoColor from "../../assests/maerskLogoNoColor.svg";
import twilioLogoWithColor from "../../assests/twilioLogoWithColor.png";
import twilioLogoNoColor from "../../assests/twilioLogoNoColor.svg";
import amazon from "../../assests/amazon.jpg";
import bmw from "../../assests/bmw.webp";
import maersk from "../../assests/maersk.avif";
import twilio from "../../assests/twilio.png";

export default function CompanyStories() {
  const [showGoToStoryText, setShowGoToStoryText] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const headerVariables = {
    title: "İşletmenize çeviklik kazandırın",
    subTitle: "Kurumsal yeniden yapılanma",
    description: `Hızlıca harika ödeme deneyimleri oluşturun,
    performansı artırın, yeni pazarlara açılın ve abonelikler
    ve pazar yerleriyle müşterilerinizle etkileşim kurun.
    Profesyonel hizmetler ekibimizden ve sertifikalı iş ortaklarımızdan
    uzman entegrasyon rehberliği alın ve Finanscım Uygulama Pazar Yeri
    aracılığıyla Finanscım'ı Salesforce, SAP ve daha fazlasıyla bağlayın.`
  };

  const carouselVariables = [
    {
      company: "Amazon",
      firstStatisticValue: "5+",
      firstStatisticDescription: "Prime, Audible ve Amazon Pay dahil olmak üzere Finanscım'daki Amazon işletmeleri.",
      secondStatisticValue: "50+",
      secondStatisticDescription: "Finanscım'da mevcut ödeme yöntemleri",
      firstUsedProduct: { productName: "Ödemeler", productIcon: paymentsIcon },
      secondUsedProduct: { productName: "Bağlan", productIcon: connectIcon },
      companyStoryTitle: "Amazon'un Finanscım ile sınır ötesi ödemeleri nasıl kolaylaştırdığını keşfedin.",
      logo: amazonLogoNoColor,
      image: amazon,
      imageGradientColor: "rgba(239, 168, 46, 0.85), rgba(239, 168, 46, 0)"
    },
    {
      company: "BMW",
      firstStatisticValue: "Milyonlarca",
      firstStatisticDescription: "BMW sahibi, ConnectedDrive Store'u kullanıyor.",
      secondStatisticValue: "350+",
      secondStatisticDescription: "ABD Bayilikleri",
      firstUsedProduct: { productName: "Ödemeler", productIcon: paymentsIcon },
      secondUsedProduct: { productName: "Bağlan", productIcon: connectIcon },
      companyStoryTitle: "BMW'nin e-ticareti ve ödemeleri güçlendirmek için neden Finanscım'ı seçtiğini öğrenin",
      logo: bmwLogoNoColor,
      image: bmw,
      imageGradientColor: "rgba(0, 102, 179, 0.85), rgba(0, 102, 179, 0)"
    },
    {
      company: "Maersk",
      firstStatisticValue: "130",
      firstStatisticDescription: "Lojistik ağındaki ülkeler",
      secondStatisticValue: "$10+",
      secondStatisticDescription: "Milyar dolarlık mal her yıl dünya çapında taşınıyor",
      firstUsedProduct: { productName: "Ödemeler", productIcon: paymentsIcon },
      secondUsedProduct: { productName: "Bağlan", productIcon: connectIcon },
      companyStoryTitle: "Maersk'in dünya çapında nakliyeyi kolaylaştırmak için yeni teknolojiden nasıl yararlandığını görün",
      logo: maerskLogoNoColor,
      image: maersk,
      imageGradientColor: "rgba(66, 176, 213, 0.85), rgba(66, 176, 213, 0)"
    },
    {
      company: "Twilio",
      firstStatisticValue: "+5.5%",
      firstStatisticDescription: "Finanscım'ın Küresel Ödeme Altyapısından Gelen Yükseliş",
      secondStatisticValue: "+1%",
      secondStatisticDescription: "Uyarlanabilir Kabulden Yükseliş",
      firstUsedProduct: { productName: "Ödemeler", productIcon: paymentsIcon },
      secondUsedProduct: { productName: "Bağlan", productIcon: connectIcon },
      companyStoryTitle: "Twilio'nun yetkilendirme oranlarını Finanscım ile %10 nasıl artırdığını görün",
      logo: twilioLogoNoColor,
      image: twilio,
      imageGradientColor: "rgba(241, 47, 70, 0.85), rgba(241, 47, 70, 0)"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % carouselVariables.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [carouselVariables.length]);

  const activeItem = carouselVariables[activeIndex];

  return (
    <div className="company-stories-container">

      <div className="company-stories-header-container">
        <span className="company-stories-header-subtitle">{headerVariables.subTitle}</span>
        <span className="company-stories-header-title">{headerVariables.title}</span>
        <span className="company-stories-header-description">{headerVariables.description}</span>
        <button className="company-stories-header-button">İşletmeler için Finanscım'ı keşfedin <ChevronRight size="1em" /></button>
      </div>

      <div className="company-stories-carousel-container">

        <div className="company-stories-carousel-statistics-with-image-container" key={activeIndex}>

          <div className="company-stories-carousel-statistics-container slide-left">
            <div className="company-stories-carousel-first-statistic-container">
              <span className="company-stories-carousel-first-statistic-value">{activeItem.firstStatisticValue}</span>
              <span className="company-stories-carousel-first-statistic-description">
                {activeItem.firstStatisticDescription}
              </span>
            </div>
            <div className="company-stories-carousel-second-statistic-container">
              <span className="company-stories-carousel-second-statistic-value">{activeItem.secondStatisticValue}</span>
              <span className="company-stories-carousel-second-statistic-description">
                {activeItem.secondStatisticDescription}
              </span>
            </div>
            <div className="company-stories-carousel-used-products-statistic-container">
              <span className="company-stories-carousel-used-products-text">Kullanılan ürünler</span>
              <div className="company-stories-carousel-used-products-container">
                <span className="first-used-product">
                  <img className="payments-icon" src={activeItem.firstUsedProduct.productIcon} alt="payments icon" />
                  <span>{activeItem.firstUsedProduct.productName}</span>
                </span>
                <span className="second-used-product">
                  <img className="connect-icon" src={activeItem.secondUsedProduct.productIcon} alt="connect icon" />
                  <span>{activeItem.secondUsedProduct.productName}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="company-stories-carousel-image-container"
            style={{ backgroundImage: `linear-gradient(to top, ${activeItem.imageGradientColor}), url(${activeItem.image})` }}
            onMouseEnter={() => setShowGoToStoryText(true)}
            onMouseLeave={() => setShowGoToStoryText(false)}
          >
            <img
              className="company-stories-carousel-image-container-company-logo slide-left"
              src={activeItem.logo}
              alt="amazon logo"
            />
            <img
              className="company-stories-carousel-image-container-link-logo slide-left"
              src={companyStoryLinkLogo}
              alt="story link logo"
            />
            <div className="company-stories-carousel-image-container-description slide-left">
              <span className="company-story-title">
                {activeItem.companyStoryTitle}
              </span>
              <br />
              <span className={`read-story-text ${showGoToStoryText ? "show" : "hide"}`}>
                Hikayeyi okuyun <ChevronRight size="1em" />
              </span>
            </div>
          </div>

        </div>

        <div className="company-stories-carousel-companies-nav-container">
          <div className="company">
            <img className="amazon" src={amazonLogoWithColor} alt="company logo" />
          </div>
          <div className="company">
            <img className="bmw" src={bmwLogoWithColor} alt="company logo" />
          </div>
          <div className="company">
            <img className="maersk" src={maerskLogoWithColor} alt="company logo" />
          </div>
          <div className="company">
            <img className="twilio" src={twilioLogoWithColor} alt="company logo" />
          </div>
        </div>

      </div>

    </div>
  );
}