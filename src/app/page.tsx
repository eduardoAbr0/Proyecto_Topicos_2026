import Image from 'next/image'

export default function LandingPage() {
  return (
    <section id="landingP" className="row position-relative" style={{ height: '80vh' }}>
      <Image id='imageL' src="/assets/landindImg.png" alt="Pleasantville landing image" fill style={{ objectFit: 'cover' }} />
      <div className="overlay">
        <div className="container text-start">
          <div className="row">
            <h4>Pleasantville Community Theater</h4>
            <p className="d-none d-lg-block">
              El teatro comunitario de Pleasantville brinda a nuestra entidad la
              posibilidad de ver el talento de nuestros ciudadanos.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}