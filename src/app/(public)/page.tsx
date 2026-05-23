import Image from 'next/image'
import Link from 'next/link';

export default function LandingPage() {
  return (
    <main>
      <nav id="header" className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow-sm">
        <div className="container-fluid">
          <Link className="navbar-brand d-flex align-items-center" href="/">
            <Image 
              src="/assets/pleasantvilleIcon.png" 
              alt="logoPLEASANT" 
              width={75} 
              height={75} 
              className="me-2"
            />
            Pleasantville Theater Group
          </Link>
          
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent">
            <span className="navbar-toggler-icon"></span>
          </button>
          
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ms-auto mb-2 me-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link hover-underline-animation center" href="/mostrarMiembros">
                  Miembros
                </Link>
              </li>
            </ul>
            <Link href="/login" className="btn btn-outline-success me-2 px-4">
              LOGIN
            </Link>
          </div>
        </div>
      </nav>

      <section id="landingP" className="position-relative w-100" style={{ height: '80vh' }}>
        <Image 
          id='imageL' 
          src="/assets/landindImg.png" 
          alt="Pleasantville landing image" 
          fill 
          style={{ objectFit: 'cover', zIndex: 0 }} 
          priority
        />

        <div 
          className="overlay position-relative w-100 h-100 d-flex align-items-center" 
          style={{ zIndex: 1}} 
        >
          <div className="container text-start text-white">
            <div className="row">
              <div className="col-md-8 col-lg-6">
                <h4 className="display-5 fw-bold mb-3">Pleasantville Community Theater</h4>
                <p className="lead d-none d-lg-block">
                  El teatro comunitario de Pleasantville brinda a la entidad la
                  posibilidad de apreciar el talento local.
                </p>
              </div>
            </div>
          </div>
        </div>

      </section>
    </main>
  );
}