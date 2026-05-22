
import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
    return (
        <nav id="header" className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
            <div className="container-fluid">
                <Link className="navbar-brand d-flex align-items-center" href="/">
                    <Image src="/assets/pleasantvilleIcon.png" alt="logoPLEASANT" width={75} height={75} />
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
                    <Link href="/login" className="btn btn-outline-success me-2">
                        LOGIN
                    </Link>
                </div>
            </div>
        </nav>
    );
}

