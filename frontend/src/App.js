import React, { useState } from 'react';
import '@/App.css';
import { Phone, MapPin, Clock, Mail, Star, Menu as MenuIcon, X, ChevronLeft, ChevronRight, Instagram, Facebook } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

function App() {
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0);
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    date: '',
    time: '',
    persons: '',
    message: ''
  });

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'date' && value) {
      const [year, month, day] = value.split('-').map((part) => Number(part));
      if (year && month && day) {
        const selectedDate = new Date(year, month - 1, day);
        if (!Number.isNaN(selectedDate.getTime()) && selectedDate.getDay() === 5) {
          toast.error('Le restaurant est fermé le vendredi. Veuillez choisir un autre jour.');
          e.target.value = '';
          setFormData((prev) => ({ ...prev, date: '' }));
          return;
        }
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.date || !formData.time || !formData.persons) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      // Send reservation to backend API
      const response = await fetch(`${API_BASE_URL}/api/reservations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email || null,
          date: formData.date,
          time: formData.time,
          persons: parseInt(formData.persons),
          message: formData.message || null,
        }),
      });

      if (response.ok) {
        toast.success('Merci! Votre réservation a été envoyée avec succès.');
        setFormData({
          name: '',
          phone: '',
          email: '',
          date: '',
          time: '',
          persons: '',
          message: ''
        });
      } else {
        const errorBody = await response.text();
        throw new Error(errorBody || 'Erreur lors de l\'envoi de la réservation');
      }
    } catch (error) {
      console.error('Error submitting reservation:', error);
      toast.error('Une erreur est survenue. Merci de réessayer ou d\'appeler le restaurant.');
    }
  };

  const galleryImages = [
    {
      src: '/images/zitoun.png',
      fallback: 'https://customer-assets.emergentagent.com/job_achab-bistro/artifacts/063lb70q_image.png',
      caption: 'Bread & olives',
    },
    {
      src: 'https://customer-assets.emergentagent.com/job_achab-bistro/artifacts/08ezpohe_image.png',
      caption: 'Seafood tajine',
    },
    {
      src: 'https://customer-assets.emergentagent.com/job_achab-bistro/artifacts/063lb70q_image.png',
      caption: 'Grilled fish platter',
    },
    {
      src: 'https://customer-assets.emergentagent.com/job_achab-bistro/artifacts/qctwgfvt_image.png',
      caption: 'Dessert bowls',
    },
     {
      src: '/images/va.png',
      caption: 'Entrées assortment',
    },
     {
      src: '/images/saint.png',
      caption: 'Whole grilled fish',
    },
     {
      src: '/images/taj.png',
      caption: 'Soup + tajine',
    },
     {
      src: '/images/bardor.png',
      caption: 'Double grilled fish',
    },
      {
      src: '/images/barsol.png',
      caption: 'Whole grilled fish',
    },
      {
      src: '/images/ta.png',
      caption: 'Seafood & spinach skillet',
    },
      {
      src: '/images/swi.png',
      caption: 'Desserts & seasonal fruits',
    },
      {
      src: '/images/tea.png',
      caption: 'Fresh herbal tea shots',
    },
    
  ];
  const heroBackgroundSources = [
    '/images/hero-background.png',
    '/images/hero-background.jpg',
    'https://customer-assets.emergentagent.com/job_achab-bistro/artifacts/063lb70q_image.png',
  ];
  const heroBackgroundStyle = {
    backgroundImage: heroBackgroundSources.map((url) => `url(${url})`).join(', '),
  };
  const mapLink =
    'https://www.google.com/maps/place/Dar+Al+Achab/@34.0213963,-6.8252394,17z/data=!3m1!4b1!4m6!3m5!1s0xda76b502a19d547:0xc8af18a818e37b71!8m2!3d34.0213963!4d-6.8252394!16s%2Fg%2F11jzvdm671';
  const featureIcon = '/images/empty-logo.png';
  const aboutImages = [
    {
      src: '/images/stand.png',
      fallback: 'https://customer-assets.emergentagent.com/job_achab-bistro/artifacts/063lb70q_image.png',
      alt: 'Entrée du restaurant',
    },
    {
      src: '/images/chwaya.png',
      fallback: 'https://customer-assets.emergentagent.com/job_achab-bistro/artifacts/08ezpohe_image.png',
      alt: 'Préparation en cuisine',
    },
    {
      src: '/images/rbi3.png',
      fallback: 'https://customer-assets.emergentagent.com/job_achab-bistro/artifacts/qctwgfvt_image.png',
      alt: 'Détails gastronomiques',
    },
  ];
  const aboutFeatureImage = {
    src: '/images/bsla.png',
    fallback: 'https://customer-assets.emergentagent.com/job_achab-bistro/artifacts/iywdtq4m_image.png',
  };
  const menuImageSources = ['/images/menu.png', '/images/menu.jpg'];
  const signatureMenuPhotos = [
    {
      src: '/images/entrer1.png',
      fallback: 'https://customer-assets.emergentagent.com/job_achab-bistro/artifacts/063lb70q_image.png',
      label: 'Entrée',
    },
    {
      src: '/images/menu-tagine.png',
      fallback: 'https://customer-assets.emergentagent.com/job_achab-bistro/artifacts/08ezpohe_image.png',
      label: 'Tajine de Fruits de Mer',
    },
    {
      src: '/images/menu-fish.png',
      fallback: 'https://customer-assets.emergentagent.com/job_achab-bistro/artifacts/qctwgfvt_image.png',
      label: 'Poissons grillés',
    },
    {
      src: '/images/dessert.png',
      fallback: 'https://customer-assets.emergentagent.com/job_achab-bistro/artifacts/iywdtq4m_image.png',
      label: 'Dessert',
    },
  ];

  const testimonials = [
    {
      name: 'Fatima L.',
      rating: 5,
      text: 'Le poisson est incroyablement frais et les portions sont généreuses. Le menu à 200 MAD est un excellent rapport qualité-prix!'
    },
    {
      name: 'Ahmed M.',
      rating: 5,
      text: 'Service chaleureux et accueillant. L\'atmosphère familiale rend chaque visite spéciale. Hautement recommandé!'
    },
    {
      name: 'Sara K.',
      rating: 5,
      text: 'Authentique cuisine marocaine de la mer. Les plats sont préparés avec soin et amour. Un vrai régal!'
    }
  ];

  const openLightbox = (index) => {
    setCurrentGalleryIndex(index);
    setSelectedImage(galleryImages[index]);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const nextImage = () => {
    const nextIndex = (currentGalleryIndex + 1) % galleryImages.length;
    setCurrentGalleryIndex(nextIndex);
    setSelectedImage(galleryImages[nextIndex]);
  };

  const prevImage = () => {
    const prevIndex = (currentGalleryIndex - 1 + galleryImages.length) % galleryImages.length;
    setCurrentGalleryIndex(prevIndex);
    setSelectedImage(galleryImages[prevIndex]);
  };

  return (
    <div className="App">
      {/* Sticky Navigation */}
      <nav className="nav-sticky" data-testid="main-navigation">
        <div className="nav-container">
          <div className="nav-logo-section">
            <img 
              src="/images/logo-without-background.png" 
              alt="Restaurant Dar Al Achab Logo" 
              className="nav-logo"
              data-testid="restaurant-logo"
              onError={(e) => {
                e.target.src = "https://customer-assets.emergentagent.com/job_achab-bistro/artifacts/r0zz75ce_ChatGPT%20Image%2013%20nov.%202025%2C%2001_23_22.png";
              }}
            />
            <div className="nav-brand">
              <div className="nav-brand-name" data-testid="restaurant-name-nav">دار العشاب</div>
              <div className="nav-brand-subtitle">Dar Al Achab</div>
            </div>
          </div>

          <button 
            className="mobile-menu-btn" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            data-testid="mobile-menu-toggle"
          >
            {isMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
          </button>

          <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
            <a onClick={() => scrollToSection('home')} data-testid="nav-home">Accueil</a>
            <a onClick={() => scrollToSection('about')} data-testid="nav-about">À Propos</a>
            <a onClick={() => scrollToSection('menu')} data-testid="nav-menu">Menu</a>
            <a onClick={() => scrollToSection('gallery')} data-testid="nav-gallery">Galerie</a>
            <a onClick={() => scrollToSection('reviews')} data-testid="nav-reviews">Avis</a>
            <a onClick={() => scrollToSection('contact')} data-testid="nav-contact">Contact</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="hero-section" data-testid="hero-section" style={heroBackgroundStyle}>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="hero-logo-wrapper">
            <img
              src="/images/logo-without-background.png"
              alt="Emblème Dar Al Achab"
              className="hero-center-logo"
              onError={(e) => {
                e.target.src =
                  'https://customer-assets.emergentagent.com/job_achab-bistro/artifacts/r0zz75ce_ChatGPT%20Image%2013%20nov.%202025%2C%2001_23_22.png';
              }}
            />
          </div>
          <h1 className="hero-title" data-testid="hero-title">
            <span className="title-arabic">مطعم دار العشاب</span>
            <span className="title-latin">Restaurant Dar Al Achab</span>
          </h1>
          <p className="hero-subtitle" data-testid="hero-subtitle">
            Fresh Moroccan Seafood in the Heart of Rabat
          </p>
          <div className="hero-buttons">
            <Button 
              size="lg" 
              className="hero-btn primary-btn"
              onClick={() => scrollToSection('contact')}
              data-testid="reserve-table-btn"
            >
              Réserver une Table
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="hero-btn secondary-btn"
              onClick={() => setIsMenuModalOpen(true)}
              data-testid="view-menu-btn"
            >
              Voir le Menu
            </Button>
          </div>

          <div className="hero-info" data-testid="hero-info">
            <div className="info-item clickable" onClick={() => window.open(mapLink, '_blank')}>
              <MapPin size={20} />
              <span>Avenue Al Alaouiyine (Av. Moulay Hassan), Rabat, Morocco</span>
            </div>
            <div className="info-item">
              <Clock size={20} />
              <span>Ouvert: Sam–Jeu · 12:30–22:30 · Fermé Vendredi</span>
            </div>
            <div className="info-item">
              <Phone size={20} />
              <a href="tel:0537202037" data-testid="hero-phone">05 37 20 20 37</a>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about-section" data-testid="about-section">
        <div className="section-container">
          <div className="about-grid">
            <div className="about-text">
              <h2 className="section-title" data-testid="about-title">
                <span className="title-arabic">عن المطعم</span>
                <span className="title-divider"></span>
                <span>Notre Histoire</span>
              </h2>
              <p className="about-paragraph" data-testid="about-description">
                Bienvenue chez <strong>Dar Al Achab</strong>, un restaurant marocain traditionnel spécialisé dans les poissons et fruits de mer frais. Situé au cœur de Rabat, nous sommes fiers de vous offrir une expérience culinaire authentique qui célèbre les saveurs de la mer.
              </p>
              <p className="about-paragraph">
                Notre philosophie est simple : chaque jour, nous sélectionnons les poissons les plus frais du marché local pour vous garantir une qualité exceptionnelle. Notre menu fixe poisson, à seulement <strong>200 MAD par personne</strong>, comprend quatre délicieux plats : une soupe savoureuse, des entrées généreuses, un plat principal de poisson en tajine et grillé, et un dessert accompagné de jus frais.
              </p>
              <div className="about-features">
                <div className="feature-item">
                  <img src={featureIcon} alt="" className="feature-icon-img" />
                  <div>
                    <h4>Poisson Frais du Jour</h4>
                    <p>Sélection quotidienne du marché local</p>
                  </div>
                </div>
                <div className="feature-item">
                  <img src={featureIcon} alt="" className="feature-icon-img" />
                  <div>
                    <h4>Recettes Authentiques</h4>
                    <p>Traditions culinaires marocaines</p>
                  </div>
                </div>
                <div className="feature-item">
                  <img src={featureIcon} alt="" className="feature-icon-img" />
                  <div>
                    <h4>Ambiance Familiale</h4>
                    <p>Service chaleureux et accueillant</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="about-images">
              <div className="about-image-grid">
                {aboutImages.map((image, index) => (
                  <div className="about-image-item" key={image.alt}>
                    <img
                      src={image.src}
                      alt={image.alt}
                      data-testid={`about-image-${index + 1}`}
                      onError={(e) => {
                        if (image.fallback && e.target.src !== image.fallback) {
                          e.target.src = image.fallback;
                        }
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="about-featured-media">
            <img
              src={aboutFeatureImage.src}
              alt="Moments au restaurant"
              onError={(e) => {
                if (e.target.src !== aboutFeatureImage.fallback) {
                  e.target.src = aboutFeatureImage.fallback;
                }
              }}
            />
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="menu-section" data-testid="menu-section">
        <div className="section-container">
          <h2 className="section-title centered" data-testid="menu-title">
            <span className="title-arabic">قائمة الطعام</span>
            <span className="title-divider"></span>
            <span>Notre Menu</span>
          </h2>

          {/* Signature Set Menu */}
          <div className="signature-menu" data-testid="signature-menu">
            <div className="signature-menu-header">
              <div className="signature-badge">Menu Signature</div>
              <div className="signature-price-badge">Menu complet pour seulement 200 MAD/personne</div>
            </div>
            
            <div className="signature-menu-content">
              <div className="signature-menu-text">
                <p className="signature-description">
                  Une expérience culinaire authentique : une soupe généreuse, des entrées maison inspirées de la tradition marocaine, un plat principal de poisson (grillé et en tajine) suivi d'un dessert artisanal et de jus frais naturels.
                </p>
                
                <div className="menu-details">
                  <div className="menu-course">
                    <div className="course-number">1</div>
                    <div className="course-content">
                      <h4>Amuse-bouches</h4>
                      <p>Olives, fruits secs grillés, pain marocain & harissa</p>
                    </div>
                  </div>
                  <div className="menu-course">
                    <div className="course-number">2</div>
                    <div className="course-content">
                      <h4>Soupe de poisson</h4>
                      <p>Orge, maïs, millet, lotte/requin</p>
                    </div>
                  </div>
                  <div className="menu-course">
                    <div className="course-number">3</div>
                    <div className="course-content">
                      <h4>Tajine de fruits de mer & épinards</h4>
                      <p>Calamar, petits morceaux de poisson, etc.</p>
                    </div>
                  </div>
                  <div className="menu-course">
                    <div className="course-number">4</div>
                    <div className="course-content">
                      <h4>Poisson grillé entier</h4>
                      <p>Choix possible : bar, dorade, saint-pierre au feu de bois, farci aux herbes</p>
                    </div>
                  </div>
                  <div className="menu-course">
                    <div className="course-number">5</div>
                    <div className="course-content">
                      <h4>Jus de fruits maison à volonté</h4>
                      <p>Grape, figue, caroube</p>
                    </div>
                  </div>
                  <div className="menu-course">
                    <div className="course-number">6</div>
                    <div className="course-content">
                      <h4>Dessert</h4>
                      <p>Melon jaune + mélange fruits secs/grillés, orge, miel</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="signature-menu-images">
                {signatureMenuPhotos.map((photo) => (
                  <div className="menu-image-item" key={photo.label}>
                    <img
                      src={photo.src}
                      alt={photo.label}
                      onError={(e) => {
                        if (photo.fallback && e.target.src !== photo.fallback) {
                          e.target.src = photo.fallback;
                        } else {
                          e.target.style.display = 'none';
                        }
                      }}
                    />
                    <div className="menu-image-label">{photo.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="menu-grid">
            {/* À la carte */}
            <div className="menu-category" data-testid="menu-starters">
              <h3 className="menu-category-title">
                <span className="title-arabic">المقبلات</span>
                Entrées & Amuse-bouches
              </h3>
              <p className="category-note">Disponibles à la carte</p>
            </div>

            <div className="menu-category" data-testid="menu-main-dishes">
              <h3 className="menu-category-title">
                <span className="title-arabic">الأسماك</span>
                Soupes & Tajines variés
              </h3>
              <p className="category-note">Disponibles à la carte</p>
            </div>

            <div className="menu-category" data-testid="menu-seafood">
              <h3 className="menu-category-title">
                <span className="title-arabic">المشاوي</span>
                Poissons grillés ou plats de fruits de mer
              </h3>
              <p className="category-note">Disponibles à la carte</p>
            </div>

            <div className="menu-category" data-testid="menu-drinks">
              <h3 className="menu-category-title">
                <span className="title-arabic">المشروبات</span>
                Boissons & Jus frais maison
              </h3>
              <p className="category-note">Disponibles à la carte</p>
            </div>

            <div className="menu-category" data-testid="menu-desserts">
              <h3 className="menu-category-title">
                <span className="title-arabic">الحلويات</span>
                Desserts légers & fruits de saison
              </h3>
              <p className="category-note">Disponibles à la carte</p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="gallery-section" data-testid="gallery-section">
        <div className="section-container">
          <h2 className="section-title centered" data-testid="gallery-title">
            <span className="title-arabic">معرض الصور</span>
            <span className="title-divider"></span>
            <span>Galerie</span>
          </h2>
          <div className="gallery-grid">
            {galleryImages.map((image, index) => (
              <div 
                key={image.caption} 
                className="gallery-item"
                onClick={() => openLightbox(index)}
                data-testid={`gallery-item-${index}`}
              >
                <img
                  src={image.src}
                  alt={image.caption}
                  onError={(e) => {
                    if (image.fallback && e.target.src !== image.fallback) {
                      e.target.src = image.fallback;
                    }
                  }}
                />
                <div className="gallery-caption">{image.caption}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {selectedImage && (
        <div className="lightbox" onClick={closeLightbox} data-testid="lightbox">
          <button className="lightbox-close" onClick={closeLightbox} data-testid="lightbox-close">
            <X size={32} />
          </button>
          <button className="lightbox-prev" onClick={(e) => { e.stopPropagation(); prevImage(); }} data-testid="lightbox-prev">
            <ChevronLeft size={32} />
          </button>
          <button className="lightbox-next" onClick={(e) => { e.stopPropagation(); nextImage(); }} data-testid="lightbox-next">
            <ChevronRight size={32} />
          </button>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img src={selectedImage.src} alt={selectedImage.caption} />
            <p className="lightbox-caption">{selectedImage.caption}</p>
          </div>
        </div>
      )}

      {/* Reviews Section */}
      <section id="reviews" className="reviews-section" data-testid="reviews-section">
        <div className="section-container">
          <h2 className="section-title centered" data-testid="reviews-title">
            <span className="title-arabic">آراء العملاء</span>
            <span className="title-divider"></span>
            <span>Avis de Nos Clients</span>
          </h2>
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card" data-testid={`testimonial-${index}`}>
                <div className="testimonial-stars">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={20} fill="#d4a21a" color="#d4a21a" />
                  ))}
                </div>
                <p className="testimonial-text">"{testimonial.text}"</p>
                <p className="testimonial-author">— {testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact-section" data-testid="contact-section">
        <div className="section-container">
          <h2 className="section-title centered" data-testid="contact-title">
            <span className="title-arabic">اتصل بنا</span>
            <span className="title-divider"></span>
            <span>Réservations & Contact</span>
          </h2>
          
          <div className="contact-grid">
            <div className="contact-info" data-testid="contact-info">
              <h3>Informations de Contact</h3>
              
              <a className="contact-detail link-wrapper" href={mapLink} target="_blank" rel="noopener noreferrer">
                <MapPin size={24} />
                <div>
                  <h4>Adresse</h4>
                  <p>34 Avenue Al Alaouiyine<br />(Av. Moulay Hassan)<br />Rabat, Morocco</p>
                </div>
              </a>

              <div className="contact-detail">
                <Phone size={24} />
                <div>
                  <h4>Téléphone</h4>
                  <a href="tel:0537202037" data-testid="contact-phone">05 37 20 20 37</a>
                  <div className="social-icons-contact">
                    <a href="https://www.instagram.com/dar_al_achab/" target="_blank" rel="noopener noreferrer" data-testid="instagram-link" className="social-icon-link">
                      <Instagram size={20} />
                    </a>
                    <a href="https://www.facebook.com/DarAlAchab/" target="_blank" rel="noopener noreferrer" data-testid="facebook-link" className="social-icon-link">
                      <Facebook size={20} />
                    </a>
                    <a href="https://www.tiktok.com/@dar.al.achab" target="_blank" rel="noopener noreferrer" data-testid="tiktok-link" className="social-icon-link">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>

              <div className="contact-detail">
                <Clock size={24} />
                <div>
                  <h4>Horaires d'Ouverture</h4>
                  <table className="hours-table">
                    <tbody>
                      <tr>
                        <td>Lundi</td>
                        <td>12:30 - 22:30</td>
                      </tr>
                      <tr>
                        <td>Mardi</td>
                        <td>12:30 - 22:30</td>
                      </tr>
                      <tr>
                        <td>Mercredi</td>
                        <td>12:30 - 22:30</td>
                      </tr>
                      <tr>
                        <td>Jeudi</td>
                        <td>12:30 - 22:30</td>
                      </tr>
                      <tr>
                        <td>Vendredi</td>
                        <td>Fermé</td>
                      </tr>
                      <tr>
                        <td>Samedi</td>
                        <td>12:30 - 22:30</td>
                      </tr>
                      <tr>
                        <td>Dimanche</td>
                        <td>12:30 - 22:30</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="map-container" data-testid="map-container">
                <iframe
                  title="Restaurant Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3307.6157683178285!2d-6.827814024682247!3d34.02139627304507!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda76b502a19d547%3A0xc8af18a818e37b71!2sDar%20Al%20Achab!5e0!3m2!1sfr!2sma!4v1731780000000!5m2!1sfr!2sma"
                  width="100%"
                  height="250"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>

            <div className="reservation-form" data-testid="reservation-form">
              <h3>Formulaire de Réservation</h3>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <Label htmlFor="name">Nom Complet</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    data-testid="form-name"
                  />
                </div>

                <div className="form-group">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    data-testid="form-phone"
                  />
                </div>

                <div className="form-group">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    data-testid="form-email"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      name="date"
                      type="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      required
                      min={new Date().toISOString().split('T')[0]}
                      data-testid="form-date"
                    />
                  </div>

                  <div className="form-group">
                    <Label htmlFor="time">Heure</Label>
                    <Input
                      id="time"
                      name="time"
                      type="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      required
                      min="12:30"
                      max="22:30"
                      data-testid="form-time"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <Label htmlFor="persons">Nombre de Personnes</Label>
                  <Input
                    id="persons"
                    name="persons"
                    type="number"
                    min="1"
                    max="20"
                    value={formData.persons}
                    onChange={handleInputChange}
                    required
                    data-testid="form-persons"
                  />
                </div>

                <div className="form-group">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    rows="3"
                    value={formData.message}
                    onChange={handleInputChange}
                    data-testid="form-message"
                  />
                </div>

                <Button type="submit" className="submit-btn" data-testid="submit-reservation">
                  Envoyer la Réservation
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Modal */}
      {isMenuModalOpen && (
        <div className="menu-modal" onClick={() => setIsMenuModalOpen(false)}>
          <div className="menu-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="menu-modal-close" onClick={() => setIsMenuModalOpen(false)}>
              <X size={28} />
            </button>
            <img
              src={menuImageSources[0]}
              alt="Menu du restaurant"
              onError={(e) => {
                if (menuImageSources.length > 1) {
                  e.target.src = menuImageSources[1];
                }
              }}
            />
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="footer" data-testid="footer">
        <div className="footer-container">
          <div className="footer-grid">
            <div className="footer-brand">
              <img 
                src="/images/logo-without-background.png" 
                alt="Dar Al Achab Logo" 
                className="footer-logo"
                onError={(e) => {
                  e.target.src = "https://customer-assets.emergentagent.com/job_05156f9f-b9d7-4ff1-ae34-57f5d0fe8e69/artifacts/ztp7uho9_image.png";
                }}
              />
              <h3>دار العشاب</h3>
              <p>Restaurant Dar Al Achab</p>
            </div>

            <div className="footer-links">
              <h4>Navigation</h4>
              <a onClick={() => scrollToSection('home')}>Accueil</a>
              <a onClick={() => scrollToSection('about')}>À Propos</a>
              <a onClick={() => scrollToSection('menu')}>Menu</a>
              <a onClick={() => scrollToSection('gallery')}>Galerie</a>
              <a onClick={() => scrollToSection('contact')}>Contact</a>
            </div>

            <div className="footer-contact">
              <h4>Contact</h4>
              <p><MapPin size={16} /> 34 Avenue Al Alaouiyine, Rabat</p>
              <p><Phone size={16} /> <a href="tel:0537202037">05 37 20 20 37</a></p>
            </div>

            <div className="footer-social">
              <h4>Suivez-nous</h4>
              <div className="social-links">
                <a href="https://www.instagram.com/dar_al_achab/" target="_blank" rel="noopener noreferrer" data-testid="instagram-link" className="social-link-item">
                  <Instagram size={20} />
                  <span>Instagram</span>
                </a>
                <a href="https://www.facebook.com/DarAlAchab/" target="_blank" rel="noopener noreferrer" data-testid="facebook-link" className="social-link-item">
                  <Facebook size={20} />
                  <span>Facebook</span>
                </a>
                <a href="https://www.tiktok.com/@dar.al.achab" target="_blank" rel="noopener noreferrer" data-testid="tiktok-link" className="social-link-item">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                  <span>TikTok</span>
                </a>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} Restaurant Dar Al Achab – Tous droits réservés.</p>
            <p style={{ fontSize: '0.875rem', opacity: 0.7, marginTop: '0.5rem' }}>
              <a href="/admin" style={{ color: 'inherit', textDecoration: 'none' }}>Admin</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
