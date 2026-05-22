"use client";

import { useEffect } from 'react';
import Image from 'next/image';


export default function Footer() {
    useEffect(() => {
        if (typeof window !== "undefined") {
            const bootstrap = require('bootstrap/dist/js/bootstrap.bundle.min.js');
            const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
            tooltipTriggerList.map((tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl));
        }
    }, []);

    return (
        <footer id="footer" className="bg-dark text-white pt-4 pb-4">
            <div className="container">
                <div className="row text-center mb-4">
                    <div className="col-12 col-md"><a href="#" className="text-white text-decoration-none">Preguntas frecuentes</a></div>
                    <div className="col-12 col-md"><a href="#" className="text-white text-decoration-none">Contacto</a></div>
                    <div className="col-12 col-md"><a href="#" className="text-white text-decoration-none">Quienes somos?</a></div>
                    <div className="col-12 col-md"><a href="#" className="text-white text-decoration-none">Mapa del sitio</a></div>
                </div>

                <div className="row text-center mb-4">
                    <div className="col">
                        <a href="#" data-bs-toggle="tooltip" title="Facebook" className="text-white"><i className="fa-brands fa-square-facebook fa-3x px-3"></i></a>
                        <a href="#" data-bs-toggle="tooltip" title="Instagram" className="text-white"><i className="fa-brands fa-square-instagram fa-3x px-3"></i></a>
                        <a href="#" data-bs-toggle="tooltip" title="TikTok" className="text-white"><i className="fa-brands fa-tiktok fa-3x px-3"></i></a>
                        <a href="#" data-bs-toggle="tooltip" title="X" className="text-white"><i className="fa-brands fa-square-x-twitter fa-3x px-3"></i></a>
                        <a href="#" data-bs-toggle="tooltip" title="Youtube" className="text-white"><i className="fa-brands fa-square-youtube fa-3x px-3"></i></a>
                    </div>
                </div>

                <div className="row text-center mb-2">
                    <div className="col">
                        <Image src='/assets/pleasantvilleIcon.png' width={60} height={60} alt="logoITSJ"/>
                    </div>
                </div>

                <div className="row text-center">
                    <div className="col text-muted">
                        <p>&copy;2026 - Pleasantville Community</p>
                        <p>Reservados todos los derechos.</p>
                    </div>
                </div>
            </div>
        </footer>
    );
}