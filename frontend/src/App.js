import React, { useState } from 'react';
import '@/App.css';
import { Phone, MapPin, Clock, Mail, Star, Menu as MenuIcon, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0);
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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.date || !formData.time || !formData.persons) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }
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
  };

  const galleryImages = [
    { url: 'https://customer-assets.emergentagent.com/job_achab-bistro/artifacts/063lb70q_image.png', caption: 'Restaurant Entrance' },
    { url: 'https://customer-assets.emergentagent.com/job_achab-bistro/artifacts/iywdtq4m_image.png', caption: 'Fresh Seafood' },
    { url: 'https://customer-assets.emergentagent.com/job_achab-bistro/artifacts/08ezpohe_image.png', caption: 'Signature Dishes' },
    { url: 'https://customer-assets.emergentagent.com/job_achab-bistro/artifacts/qctwgfvt_image.png', caption: 'Dining Experience' }
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
              src="https://customer-assets.emergentagent.com/job_achab-bistro/artifacts/r0zz75ce_ChatGPT%20Image%2013%20nov.%202025%2C%2001_23_22.png" 
              alt="Restaurant Dar Al Achab Logo" 
              className="nav-logo"
              data-testid="restaurant-logo"
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
      <section id="home" className="hero-section" data-testid="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
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
              onClick={() => scrollToSection('menu')}
              data-testid="view-menu-btn"
            >
              Voir le Menu
            </Button>
          </div>

          <div className="hero-info" data-testid="hero-info">
            <div className="info-item">
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
                Notre philosophie est simple : chaque jour, nous sélectionnons les poissons les plus frais du marché local pour vous garantir une qualité exceptionnelle. Notre menu fixe poisson, à seulement <strong>200 MAD par personne</strong>, comprend quatre délicieux plats : une soupe savoureuse, des entrées généreuses, un plat principal de poisson grillé ou en tajine, et un dessert accompagné de jus frais.
              </p>
              <div className="about-features">
                <div className="feature-item">
                  <div className="feature-icon">🐟</div>
                  <div>
                    <h4>Poisson Frais du Jour</h4>
                    <p>Sélection quotidienne du marché local</p>
                  </div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">👨‍🍳</div>
                  <div>
                    <h4>Recettes Authentiques</h4>
                    <p>Traditions culinaires marocaines</p>
                  </div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">👨‍👩‍👧‍👦</div>
                  <div>
                    <h4>Ambiance Familiale</h4>
                    <p>Service chaleureux et accueillant</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="about-image">
              <img 
                src="https://customer-assets.emergentagent.com/job_05156f9f-b9d7-4ff1-ae34-57f5d0fe8e69/artifacts/407o0nun_image.png" 
                alt="Restaurant Interior" 
                data-testid="about-image"
              />
            </div>
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
            <div className="signature-badge">Menu Signature</div>
            <h3 className="menu-category-title">Menu Poisson Complet</h3>
            <p className="signature-description">
              Une expérience gastronomique complète : soupe, entrées variées, plat de poisson principal (grillé ou tajine), dessert maison et jus frais.
            </p>
            <div className="signature-price">200 MAD par personne</div>
          </div>

          <div className="menu-grid">
            {/* Entrées */}
            <div className="menu-category" data-testid="menu-starters">
              <h3 className="menu-category-title">
                <span className="title-arabic">المقبلات</span>
                Entrées / Starters
              </h3>
              <div className="menu-items">
                <div className="menu-item">
                  <div className="menu-item-header">
                    <h4>Salade Marocaine Mixte</h4>
                  </div>
                  <p>Tomates, concombres, oignons, et herbes fraîches</p>
                </div>
                <div className="menu-item">
                  <div className="menu-item-header">
                    <h4>Salade de Crevettes</h4>
                  </div>
                  <p>Crevettes fraîches avec avocat et citron</p>
                </div>
                <div className="menu-item">
                  <div className="menu-item-header">
                    <h4>Harira aux Fruits de Mer</h4>
                  </div>
                  <p>Soupe traditionnelle enrichie de fruits de mer</p>
                </div>
              </div>
            </div>

            {/* Plats Principaux */}
            <div className="menu-category" data-testid="menu-main-dishes">
              <h3 className="menu-category-title">
                <span className="title-arabic">الأسماك</span>
                Plats Principaux / Main Dishes
              </h3>
              <div className="menu-items">
                <div className="menu-item">
                  <div className="menu-item-header">
                    <h4>Poisson Grillé sur Charbon de Bois</h4>
                  </div>
                  <p>Poisson frais du jour grillé nature aux épices marocaines</p>
                </div>
                <div className="menu-item">
                  <div className="menu-item-header">
                    <h4>Tajine d'Épinards avec Lotte, Calmars et Requin</h4>
                  </div>
                  <p>Mélange de fruits de mer mijoté avec épinards frais</p>
                </div>
                <div className="menu-item">
                  <div className="menu-item-header">
                    <h4>Brochettes de Requin aux Épices Malgaches</h4>
                  </div>
                  <p>Brochettes marinées aux épices exotiques</p>
                </div>
                <div className="menu-item">
                  <div className="menu-item-header">
                    <h4>Friture de Poisson Mixte</h4>
                  </div>
                  <p>Assortiment de petits poissons frits croustillants</p>
                </div>
              </div>
            </div>

            {/* Desserts */}
            <div className="menu-category" data-testid="menu-desserts">
              <h3 className="menu-category-title">
                <span className="title-arabic">الحلويات</span>
                Desserts
              </h3>
              <div className="menu-items">
                <div className="menu-item">
                  <div className="menu-item-header">
                    <h4>Fruits de Saison</h4>
                  </div>
                  <p>Sélection de fruits frais selon la saison</p>
                </div>
                <div className="menu-item">
                  <div className="menu-item-header">
                    <h4>Orge au Miel Naturel</h4>
                  </div>
                  <p>Dessert traditionnel marocain au miel</p>
                </div>
                <div className="menu-item">
                  <div className="menu-item-header">
                    <h4>Pâtisserie Marocaine</h4>
                  </div>
                  <p>Assortiment de pâtisseries traditionnelles</p>
                </div>
              </div>
            </div>

            {/* Boissons */}
            <div className="menu-category" data-testid="menu-drinks">
              <h3 className="menu-category-title">
                <span className="title-arabic">المشروبات</span>
                Boissons & Jus Frais / Drinks
              </h3>
              <div className="menu-items">
                <div className="menu-item">
                  <div className="menu-item-header">
                    <h4>Jus Maison aux Fruits Mûrs et Figues</h4>
                  </div>
                  <p>Jus frais préparé avec fruits secs</p>
                </div>
                <div className="menu-item">
                  <div className="menu-item-header">
                    <h4>Jus d'Orange Frais</h4>
                  </div>
                  <p>Pressé à la commande</p>
                </div>
                <div className="menu-item">
                  <div className="menu-item-header">
                    <h4>Thé à la Menthe</h4>
                  </div>
                  <p>Thé marocain traditionnel</p>
                </div>
              </div>
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
                key={index} 
                className="gallery-item"
                onClick={() => openLightbox(index)}
                data-testid={`gallery-item-${index}`}
              >
                <img src={image.url} alt={image.caption} />
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
            <img src={selectedImage.url} alt={selectedImage.caption} />
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
              
              <div className="contact-detail">
                <MapPin size={24} />
                <div>
                  <h4>Adresse</h4>
                  <p>34 Avenue Al Alaouiyine<br />(Av. Moulay Hassan)<br />Rabat, Morocco</p>
                </div>
              </div>

              <div className="contact-detail">
                <Phone size={24} />
                <div>
                  <h4>Téléphone</h4>
                  <a href="tel:0537202037" data-testid="contact-phone">05 37 20 20 37</a>
                  <p><a href="https://wa.me/212537202037" target="_blank" rel="noopener noreferrer" data-testid="whatsapp-link">WhatsApp</a></p>
                </div>
              </div>

              <div className="contact-detail">
                <Clock size={24} />
                <div>
                  <h4>Horaires d'Ouverture</h4>
                  <table className="hours-table">
                    <tbody>
                      <tr>
                        <td>Samedi - Jeudi</td>
                        <td>12:30 - 22:30</td>
                      </tr>
                      <tr>
                        <td>Vendredi</td>
                        <td>Fermé</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="map-container" data-testid="map-container">
                <iframe
                  title="Restaurant Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3307.7!2d-6.8342!3d34.0209!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDAxJzE1LjIiTiA2wrA1MCcwMy4xIlc!5e0!3m2!1sen!2sma!4v1234567890"
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
                  <Label htmlFor="name">Nom Complet *</Label>
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
                  <Label htmlFor="phone">Téléphone *</Label>
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
                    <Label htmlFor="date">Date *</Label>
                    <Input
                      id="date"
                      name="date"
                      type="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      required
                      data-testid="form-date"
                    />
                  </div>

                  <div className="form-group">
                    <Label htmlFor="time">Heure *</Label>
                    <Input
                      id="time"
                      name="time"
                      type="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      required
                      data-testid="form-time"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <Label htmlFor="persons">Nombre de Personnes *</Label>
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

      {/* Footer */}
      <footer className="footer" data-testid="footer">
        <div className="footer-container">
          <div className="footer-grid">
            <div className="footer-brand">
              <img 
                src="https://customer-assets.emergentagent.com/job_05156f9f-b9d7-4ff1-ae34-57f5d0fe8e69/artifacts/ztp7uho9_image.png" 
                alt="Dar Al Achab Logo" 
                className="footer-logo"
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
                <a href="#" target="_blank" rel="noopener noreferrer" data-testid="facebook-link">Facebook</a>
                <a href="#" target="_blank" rel="noopener noreferrer" data-testid="instagram-link">Instagram</a>
                <a href="#" target="_blank" rel="noopener noreferrer" data-testid="tiktok-link">TikTok</a>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} Restaurant Dar Al Achab – Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
