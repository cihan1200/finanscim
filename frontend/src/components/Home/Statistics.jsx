import "../../styles/Home/Statistics.css";
import globeAnim from "../../animations/globe.mp4";
import { useEffect, useRef, useState } from "react";

export default function Statistics() {
  const videoRef = useRef();
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const statistics = [
    { statisticDescription: "Kişi Finanscım'ı aktif olarak kullanıyor.", value: "10M+" },
    { statisticDescription: "Finanscım servisleri için çalışma süresi.", value: "%99.999" },
    { statisticDescription: "Günlük API talebi sayısı, saniyede 13.000 istekle zirveye ulaşıyor.", value: "500M+" },
    { statisticDescription: "Üye işyeri Finanscım'ı kullanmayı tercih ediyor.", value: "135.000+" }
  ];

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleVideoLoad = () => {
      setIsVideoLoaded(true);
    };

    video.addEventListener('loadeddata', handleVideoLoad);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && isVideoLoaded) {
            video.play().catch(error => {
              console.log('Video play failed:', error);
            });
          } else {
            if (!video.paused) {
              video.pause();
            }
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: '100px'
      }
    );

    observer.observe(video);

    return () => {
      observer.disconnect();
      video.removeEventListener('loadeddata', handleVideoLoad);
      if (!video.paused) {
        video.pause();
      }
    };
  }, [isVideoLoaded]);

  return (
    <div className="statistics-container">
      <video
        className="background-globe"
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      >
        <source src={globeAnim} type="video/mp4" />
      </video>
      <div className="statistics-description-container">
        <span className="statistics-subtitle">Küresel ölçek</span>
        <span className="statistics-title">Küresel ticaretin omurgası</span>
        <span className="statistics-description">
          Finanscım, para transferini veri transferi kadar kolay ve programlanabilir hale getiriyor.
          Ekiplerimiz dünya çapındaki ofislerimizde bulunuyor ve her ölçekten iddialı işletmeler
          için her yıl yüz milyarlarca dolarlık işlem gerçekleştiriyoruz.
        </span>
      </div>
      <div className="statistics-data-container">
        {statistics.map((item, index) => (
          <div className="statistics-data" key={index}>
            <span className="statistics-data-value">{item.value}</span><br />
            <span className="statistics-data-description">{item.statisticDescription}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
