'use client';

import React, { useState } from 'react';
import Image from 'next/image'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Script from 'next/script';

export default function RegistroPage() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        nombre: '', email: '', username: '', password: ''
    });
    const [toast, setToast] = useState({ mostrar: false, mensaje: '', tipo: 'exito' });

    const mostrarToast = (mensaje: string, tipo: string) => {
        setToast({ mostrar: true, mensaje, tipo });
        setTimeout(() => setToast({ mostrar: false, mensaje: '', tipo: 'exito' }), 3000);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegistro = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await fetch('/api/auth/registro', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (data.status === 'exito') {
                mostrarToast(data.message, 'exito');
                setTimeout(() => {
                    router.push('/login');
                }, 2000);
            } else {
                mostrarToast(data.message, 'error');
            }
        } catch (error) {
            mostrarToast('Error en el servidor', 'error');
        }
    };

    return (
        <>
            <Script src="https://kit.fontawesome.com/f50be4e936.js" crossOrigin="anonymous" strategy="afterInteractive" />

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

                </div>
            </nav>

            <main className="container py-5 min-vh-100">
                <div className="row justify-content-center">
                    <div className="col-md-8 col-lg-6">
                        <div className="card shadow">
                            <div className="card-body p-4">
                                <h2 className="text-center mb-4" style={{ color: 'black' }}>Registro de Usuario</h2>
                                <form onSubmit={handleRegistro}>
                                    <div className="mb-3">
                                        <label htmlFor="nombre" className="form-label">Nombre Completo</label>
                                        <input type="text" className="form-control" id="nombre" name="nombre" required onChange={handleChange} value={formData.nombre} />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label">Email</label>
                                        <input type="email" className="form-control" id="email" name="email" required onChange={handleChange} value={formData.email} />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="username" className="form-label">Usuario</label>
                                        <input type="text" className="form-control" id="username" name="username" required onChange={handleChange} value={formData.username} />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="password" className="form-label">Contraseña</label>
                                        <input type="password" className="form-control" id="password" name="password" required onChange={handleChange} value={formData.password} />
                                    </div>
                                    <div className="d-grid gap-2">
                                        <button type="submit" className="btn btn-primary">Registrarse</button>
                                    </div>
                                </form>
                                <hr />
                                <div className="text-center">
                                    <p style={{ color: 'black' }}>¿Ya tienes cuenta? <Link href="/login">Inicia Sesión</Link></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <div className="toast-container position-fixed bottom-0 end-0 p-3" style={{ zIndex: 1100 }}>
                <div className={`toast border-0 ${toast.mostrar ? 'show' : 'hide'} ${toast.tipo === 'exito' ? 'text-bg-success' : 'text-bg-danger'}`} role="alert" aria-live="assertive" aria-atomic="true">
                    <div className="d-flex">
                        <div className="toast-body">{toast.mensaje}</div>
                        <button type="button" className="btn-close btn-close-white me-2 m-auto" onClick={() => setToast({ ...toast, mostrar: false })}></button>
                    </div>
                </div>
            </div>

        </>
    );
}