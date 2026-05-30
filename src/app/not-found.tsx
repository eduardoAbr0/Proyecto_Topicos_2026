'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@/styles/css/style.css';
import '@/styles/css/index.css'

export default function NotFound() {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js';
        script.async = true;
        document.body.appendChild(script);

        setIsMounted(true);

        return () => {
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, []);

    return (
        <main style={{backgroundColor: '#A8BBA3'}}>
            <section className="d-flex align-items-center min-vh-100 py-5">
                <div className="container py-5">
                    <div className="row align-items-center">
                        <div className="col-md-6 order-md-2">
                            <div className="lc-block d-flex justify-content-center">
                                {isMounted ? (
                                    // @ts-ignore
                                    <lottie-player
                                        src="https://assets9.lottiefiles.com/packages/lf20_kcsr6fcp.json"
                                        background="transparent"
                                        speed="1"
                                        loop
                                        autoplay
                                        style={{ width: '100%', maxHeight: '400px' }}
                                    />
                                ) : (
                                    <div style={{ height: '400px' }} />
                                )}
                            </div>
                        </div>

                        <div className="col-md-6 text-center text-md-start">
                            <div className="lc-block mb-3">
                                <div>
                                    <h1 className="display-1 fw-bold text-danger">Error 404</h1>
                                </div>
                            </div>

                            <div className="lc-block mb-5">
                                <div>
                                    <p className="rfs-11 text-dark">
                                        La página que buscas se ha movido, se ha eliminado o puede que no exista.
                                    </p>
                                </div>
                            </div>

                            <div className="lc-block">
                                <Link href="/" className="btn btn-lg btn-secondary" role="button">
                                    Volver a inicio
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}