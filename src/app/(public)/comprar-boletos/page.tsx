'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';
import { obtenerObras } from '@/services/obrasService';
import { boletoSchema } from '@/schemas/boletoSchema';

export default function ComprarBoletosPage() {
    const [obras, setObras] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [idObra, setIdObra] = useState('');
    const [asiento, setAsiento] = useState('');
    const [categoria, setCategoria] = useState('150.00');
    const [medio, setMedio] = useState('Pagado');
    const [asientosOcupados, setAsientosOcupados] = useState<number[]>([]);

    const [toast, setToast] = useState({ mostrar: false, mensaje: '', tipo: 'exito' });

    useEffect(() => {
        cargarObras();
    }, []);

    const cargarObras = async () => {
        try {
            const data = await obtenerObras();
            if (Array.isArray(data)) {
                setObras(data);
            }
        } catch (err) {
            console.error('Error al cargar obras:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setAsiento('');
        if (idObra) {
            cargarAsientosOcupados(idObra);
        } else {
            setAsientosOcupados([]);
        }
    }, [idObra]);

    const cargarAsientosOcupados = async (obraId: string) => {
        try {
            const res = await fetch(`/api/boletos/ocupados?id_obra=${obraId}`);
            const data = await res.json();
            if (data.status === 'exito') {
                setAsientosOcupados(data.asientosOcupados.map(Number));
            }
        } catch (err) {
            console.error('Error al cargar asientos ocupados:', err);
        }
    };

    const mostrarToast = (mensaje: string, tipo: string) => {
        setToast({ mostrar: true, mensaje, tipo });
        setTimeout(() => setToast({ mostrar: false, mensaje: '', tipo: 'exito' }), 3000);
    };

    const handleComprar = async (e: React.FormEvent) => {
        e.preventDefault();

        const datosBoleto = {
            id_usuario: "1",
            id_asiento: asiento,
            id_obra: idObra,
            precio: categoria,
            fecha_compra: new Date().toISOString().split('T')[0],
            estado: medio
        };

        const validacion = boletoSchema.safeParse(datosBoleto);
        if (!validacion.success) {
            const errores = validacion.error.issues.map(err => err.message).join(', ');
            mostrarToast(`Verifica los campos: ${errores}`, "error");
            return;
        }

        try {
            const response = await fetch('/api/boletos/comprar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id_obra: idObra,
                    id_asiento: asiento,
                    precio: categoria,
                    estado: medio
                })
            });

            const data = await response.json();

            if (data.status === 'exito') {
                mostrarToast('Boleto comprado correctamente', 'exito');
                setIdObra('');
                setAsiento('');
                setCategoria('150.00');
                setMedio('Pagado');
            } else {
                mostrarToast(data.message || 'Error al comprar boleto', 'error');
            }
        } catch (err) {
            mostrarToast('Error de conexión con el servidor', 'error');
        }
    };

    const handleLogout = async () => {
        try {
            const response = await fetch('/api/auth/logout', { method: 'POST' });
            const data = await response.json();

            if (data.status === "exito") {
                window.location.href = '/login';
            }
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
                <div className="text-center">
                    <div className="spinner-border text-success mb-3" role="status" style={{ width: '3rem', height: '3rem' }}></div>
                    <p className="text-muted fw-bold">Cargando ...</p>
                </div>
            </div>
        );
    }

    const opcionesDeAsientos = [];

    for (let numero = 1; numero <= 40; numero++) {
        const estaDisponible = !asientosOcupados.includes(numero);

        if (estaDisponible) {
            opcionesDeAsientos.push(
                <option key={numero} value={numero}>
                    Asiento {numero}
                </option>
            );
        }
    }

    return (
        <>
            <Script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js" strategy="afterInteractive" />

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
                                <button className="btn btn-outline-secondary me-2 px-4 center" onClick={handleLogout}>
                                    Salir
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            <main className="container py-5 min-vh-100 bg-light">
                <div className="row justify-content-center">
                    <div className="col-12 text-center mb-4">
                        <h1 className="fw-bold text-dark" style={{ fontFamily: 'Outfit, sans-serif' }}>
                            Adquisición de Boletos
                        </h1>
                    </div>

                    <div className="col-md-8 col-lg-6 col-xl-5">
                        <div className="card border-0 shadow-sm p-4 bg-white rounded-4">
                            <form onSubmit={handleComprar}>
                                <div className="mb-3">
                                    <label htmlFor="formObra" className="form-label small text-muted fw-bold">Seleccionar Obra *</label>
                                    <select
                                        id="formObra"
                                        className="form-select border-0 bg-light p-3 shadow-sm"
                                        value={idObra}
                                        onChange={(e) => setIdObra(e.target.value)}
                                        required
                                    >
                                        <option value="">Seleccione una obra en cartelera</option>
                                        {obras.map(o => (
                                            <option key={o.id_obra} value={o.id_obra}>
                                                {o.titulo} ({o.tipo})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="formAsiento" className="form-label small text-muted fw-bold">Número de Asiento *</label>
                                    <select
                                        id="formAsiento"
                                        className="form-select border-0 bg-light p-3 shadow-sm"
                                        value={asiento}
                                        onChange={(e) => setAsiento(e.target.value)}
                                        required
                                        disabled={!idObra}
                                    >
                                        <option value="">
                                            {!idObra ? 'Selecciona una obra primero' : 'Selecciona un asiento disponible'}
                                        </option>
                                        {opcionesDeAsientos}
                                    </select>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="formCategoria" className="form-label small text-muted fw-bold">Clase Boleto *</label>
                                    <select
                                        id="formCategoria"
                                        className="form-select border-0 bg-light p-3 shadow-sm"
                                        value={categoria}
                                        onChange={(e) => setCategoria(e.target.value)}
                                        required
                                    >
                                        <option value="150.00">General - $150.00 </option>
                                        <option value="250.00">VIP - $250.00</option>
                                        <option value="300.00">VIP Premium - $300.00 </option>
                                    </select>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="formMedio" className="form-label small text-muted fw-bold">Medio Adquisición *</label>
                                    <select
                                        id="formMedio"
                                        className="form-select border-0 bg-light p-3 shadow-sm"
                                        value={medio}
                                        onChange={(e) => setMedio(e.target.value)}
                                        required
                                    >
                                        <option value="Pagado">Pago</option>
                                        <option value="Reservado">Reserva</option>
                                    </select>
                                </div>

                                <div className="mt-4 pt-2">
                                    <button
                                        type="submit"
                                        className="btn btn-success btn-lg w-100 shadow-sm py-3 rounded-3 fw-bold"
                                        style={{ backgroundColor: '#2C3A2B', borderColor: '#2C3A2B' }}
                                    >
                                        Adquirir Boleto
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {/* --- TOASTS --- */}
                <div className="toast-container position-fixed bottom-0 end-0 p-3" style={{ zIndex: 1100 }}>
                    <div
                        className={`toast border-0 ${toast.mostrar ? 'show' : 'hide'} ${toast.tipo === 'exito' ? 'text-bg-success' : 'text-bg-danger'}`}
                        role="alert"
                        aria-live="assertive"
                        aria-atomic="true"
                    >
                        <div className="d-flex">
                            <div className="toast-body">
                                <i className={`fa-solid ${toast.tipo === 'exito' ? 'fa-check-circle' : 'fa-circle-exclamation'} me-2`}></i>
                                <span>{toast.mensaje}</span>
                            </div>
                            <button type="button" className="btn-close btn-close-white me-2 m-auto" onClick={() => setToast({ ...toast, mostrar: false })}></button>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}