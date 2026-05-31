'use client';

import React, { useState, useEffect } from 'react';
import Script from 'next/script';
import dynamic from 'next/dynamic';
import {
    obtenerBoletos,
    obtenerBoletoPorId,
    crearBoleto,
    actualizarBoleto,
    eliminarBoleto
} from '@/services/boletosService';
import { obtenerUsuarios } from '@/services/usuariosService';
import { obtenerObras } from '@/services/obrasService';

const DataTable = dynamic(() => import('react-data-table-component'), {
    ssr: false,
    loading: () => <div className="text-center p-4 text-muted">Cargando tabla de boletos...</div>
});

export default function BoletosPage() {
    // --- ESTADOS DE LA TABLA Y BÚSQUEDA ---
    const [boletos, setBoletos] = useState<any[]>([]);
    const [busqueda, setBusqueda] = useState('');

    // --- ESTADOS PARA LLENAR LOS SELECTORES DESDE BD ---
    const [usuarios, setUsuarios] = useState<any[]>([]);
    const [obras, setObras] = useState<any[]>([]);

    // --- ESTADOS PROPIOS DEL FORMULARIO DE ALTA Y MODIFICAR ---
    const [estadoBoleto, setEstadoBoleto] = useState('Reservado');
    const [estadoBoletoModificar, setEstadoBoletoModificar] = useState('Reservado');

    // --- ESTADO GLOBAL BOLETO SELECCIONADO ---
    const [boletoSeleccionado, setBoletoSeleccionado] = useState<any>(null);

    // --- ESTADOS PARA EL TOAST ---
    const [toast, setToast] = useState({ mostrar: false, mensaje: '', tipo: 'exito' });

    // --- ESTADO CARGA ---
    const [loading, setLoading] = useState(true);

    // --- CARGAR DATOS AL INICIO ---
    useEffect(() => {
        cargarBoletos();
        cargarDatosRelacionales();
    }, []);

    const cargarBoletos = async () => {
        try {
            const data = await obtenerBoletos();
            if (Array.isArray(data)) {
                setBoletos(data);
            } else if (data.status === "error" || data.error) {
                mostrarToast(data.message || data.error, "error");
            }
        } catch (error) {
            console.error("Error al cargar boletos:", error);
            mostrarToast("Error de conexión con el servidor", "error");
        } finally {
            setLoading(false);
        }
    };

    const cargarDatosRelacionales = async () => {
        try {
            const [resUsuarios, resObras] = await Promise.all([
                obtenerUsuarios(),
                obtenerObras()
            ]);
            if (Array.isArray(resUsuarios)) setUsuarios(resUsuarios);
            if (Array.isArray(resObras)) setObras(resObras);
        } catch (error) {
            console.error("Error al cargar datos para formularios:", error);
        }
    };

    const mostrarToast = (mensaje: string, tipo: string) => {
        setToast({ mostrar: true, mensaje, tipo });
        setTimeout(() => setToast({ mostrar: false, mensaje: '', tipo: 'exito' }), 3000);
    };

    const cerrarModal = (idModal: string) => {
        const modalEl = document.getElementById(idModal);
        if (!modalEl) return;

        const onHidden = () => {
            modalEl.removeEventListener('hidden.bs.modal', onHidden);
            const instancia = (window as any).bootstrap.Modal.getInstance(modalEl);
            if (instancia) instancia.dispose();
            document.querySelectorAll('.modal-backdrop').forEach(b => b.remove());
            document.body.classList.remove('modal-open');
            document.body.style.removeProperty('overflow');
            document.body.style.removeProperty('padding-right');
        };

        modalEl.addEventListener('hidden.bs.modal', onHidden);

        const instancia = (window as any).bootstrap.Modal.getInstance(modalEl);
        if (instancia) {
            instancia.hide();
        } else {
            onHidden();
        }
    };

    // --- MANEJADORES DE ACCIONES (CRUD) ---

    const handleAgregar = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        try {
            const data = await crearBoleto(formData);
            if (data.status === "exito") {
                cargarBoletos();
                mostrarToast(data.message, "exito");
                (e.target as HTMLFormElement).reset();
            } else {
                mostrarToast(data.message, "error");
            }
        } catch (error) {
            mostrarToast("Error de conexión", "error");
        } finally {
            cerrarModal('modalAltaBoleto');
        }
    };

    const handleModificarMostrar = async (id: number) => {
        const data = await obtenerBoletoPorId(id);
        if (!data.error) {
            if (data.fecha_compra) {
                data.fecha_compra = data.fecha_compra.split('T')[0];
            }
            setBoletoSeleccionado(data);
            setEstadoBoletoModificar(data.estado || 'Reservado');
            const modal = new (window as any).bootstrap.Modal(document.getElementById("modalModificarBoleto"));
            modal.show();
        } else {
            mostrarToast(data.error, "error");
        }
    };

    const handleModificar = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const formDataObj = Object.fromEntries(formData.entries());
        try {
            const data = await actualizarBoleto(formDataObj);
            if (data.status === "exito") {
                cargarBoletos();
                mostrarToast(data.message, "exito");
            } else {
                mostrarToast(data.message, "error");
            }
        } catch (error) {
            mostrarToast("Error al actualizar", "error");
        } finally {
            cerrarModal('modalModificarBoleto');
        }
    };

    const handleEliminarMostrar = (id: number) => {
        setBoletoSeleccionado({ id_boleto: id });
        const modal = new (window as any).bootstrap.Modal(document.getElementById("modalEliminarBoleto"));
        modal.show();
    };

    const handleEliminarConfirmar = async () => {
        if (!boletoSeleccionado) return;
        try {
            const data = await eliminarBoleto(boletoSeleccionado.id_boleto);
            if (data.status === "exito") {
                cargarBoletos();
                mostrarToast(data.message, "exito");
            } else {
                mostrarToast(data.message, "error");
            }
        } catch (error) {
            mostrarToast("Error al eliminar", "error");
        } finally {
            cerrarModal('modalEliminarBoleto');
        }
    };

    const handleDetalle = async (id: number) => {
        const data = await obtenerBoletoPorId(id);
        if (!data.error) {
            if (data.fecha_compra) {
                data.fecha_compra = data.fecha_compra.split('T')[0];
            }
            setBoletoSeleccionado(data);
            const modal = new (window as any).bootstrap.Modal(document.getElementById("modalDetalleBoleto"));
            modal.show();
        } else {
            mostrarToast(data.error, "error");
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
                <div className="text-center">
                    <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}></div>
                    <p className="text-muted fw-bold">Cargando boletos...</p>
                </div>
            </div>
        );
    }

    const boletosFiltrados = boletos.filter((b: any) =>
        b.nombre_usuario.toLowerCase().includes(busqueda.toLowerCase())
    );

    // --- CONFIGURACIÓN DATATABLE ---
    const columnas = [
        { name: 'Boleto ID', selector: (row: any) => row.id_boleto, sortable: true, width: '110px' },
        { name: 'Cliente / Usuario', selector: (row: any) => row.nombre_usuario || `ID: ${row.id_usuario}`, sortable: true },
        { name: 'Obra Teatral', selector: (row: any) => row.titulo_obra || `ID: ${row.id_obra}`, sortable: true },
        { name: 'Asiento', selector: (row: any) => `No. ${row.id_asiento}`, sortable: true, width: '100px' },
        {
            name: 'Precio',
            selector: (row: any) => row.precio,
            sortable: true,
            width: '100px',
            cell: (row: any) => <span>${Number(row.precio).toFixed(2)}</span>
        },
        {
            name: 'Estado', selector: (row: any) => row.estado, sortable: true, width: '130px',
            cell: (row: any) => (
                <span className={`badge fs-6 ${row.estado === 'Pagado' ? 'bg-success' :
                    row.estado === 'Reservado' ? 'bg-warning' : 'bg-danger'}`}>
                    {row.estado || 'Reservado'}
                </span>
            )
        },
        {
            name: 'Acciones',
            cell: (row: any) => (
                <div className="d-flex gap-2">
                    <button onClick={() => handleDetalle(row.id_boleto)} className="btn btn-info btn-sm text-white" title="Detalles">
                        <i className="fa-solid fa-eye"></i>
                    </button>
                    <button onClick={() => handleModificarMostrar(row.id_boleto)} className="btn btn-warning btn-sm" title="Modificar">
                        <i className="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button onClick={() => handleEliminarMostrar(row.id_boleto)} className="btn btn-danger btn-sm" title="Cancelar / Eliminar">
                        <i className="fa-solid fa-trash"></i>
                    </button>
                </div>
            ),
            ignoreRowClick: true, allowOverflow: true, button: true, width: '150px'
        }
    ];

    return (
        <>
            <Script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js" strategy="afterInteractive" />
            <Script src="https://kit.fontawesome.com/f50be4e936.js" crossOrigin="anonymous" strategy="afterInteractive" />

            <section className="content-header mt-4 mb-3">
                <div className="container-fluid">
                    <div className="row align-items-center">
                        <div className="col-12">
                            <div className="d-flex align-items-center gap-2 mb-1">
                                <i className="fa-solid fa-ticket text-muted" style={{ fontSize: '24px', color: '#A8BBA3' }} />
                                <h1 className="h2 fw-bold m-0 text-dark" style={{ fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.5px' }}>
                                    Gestión de Boletos
                                </h1>
                            </div>
                            <hr className="my-2 opacity-25" style={{ backgroundColor: '#2C3A2B', height: '1px', border: 'none' }} />
                        </div>
                    </div>
                </div>
            </section>

            <main className="container-fluid pt-4 px-4 bg-light min-vh-100">
                <section className="content">
                    <div className="container-fluid">
                        <div className="card p-4 mb-4 shadow-sm border-0">
                            <div className="row align-items-center">
                                <div className="col-md-8 mb-3 mb-md-0">
                                    <div className="input-group">
                                        <span className="input-group-text bg-light border-end-0 text-muted">
                                            <i className="fa-solid fa-magnifying-glass"></i>
                                        </span>
                                        <input
                                            type="text"
                                            className="form-control bg-light border-start-0"
                                            placeholder="Buscar boleto..."
                                            value={busqueda}
                                            onChange={(e) => setBusqueda(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-4 text-md-end">
                                    <button className="btn btn-primary w-100 shadow-sm" data-bs-toggle="modal" data-bs-target="#modalAltaBoleto">
                                        <i className="fa-solid fa-plus me-2"></i> Nuevo Boleto
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="card shadow-sm border-0">
                            <DataTable
                                columns={columnas}
                                data={boletosFiltrados}
                                pagination
                                highlightOnHover
                                responsive
                                striped
                                noDataComponent={<div className="p-4 text-muted">No se encontraron registros de boletos.</div>}
                            />
                        </div>
                    </div>
                </section>

                {/* ==========================================
                    MODAL: ALTA DE BOLETO
                ========================================== */}
                <div className="modal fade" id="modalAltaBoleto" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content border-0 shadow-lg">
                            <form id="formAltaBoleto" onSubmit={handleAgregar} method="POST">
                                <div className="modal-header bg-primary text-white border-0">
                                    <h5 className="modal-title fw-bold">
                                        <i className="fa-solid fa-ticket me-2"></i> Registrar Venta de Boleto
                                    </h5>
                                    <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body p-4 bg-light">
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <label className="form-label small text-muted fw-bold">Cliente / Usuario *</label>
                                            <select className="form-select border-0 shadow-sm" name="formUsuario" required>
                                                <option value="">Seleccione un cliente...</option>
                                                {usuarios.map((u: any) => (
                                                    <option key={u.id_usuario} value={u.id_usuario}>
                                                        {u.nombre} ({u.username})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label small text-muted fw-bold">Obra Teatral *</label>
                                            <select className="form-select border-0 shadow-sm" name="formObra" required>
                                                <option value="">Seleccione la obra...</option>
                                                {obras.map((o: any) => (
                                                    <option key={o.id_obra} value={o.id_obra}>
                                                        {o.titulo}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <hr className="my-3 text-muted" />

                                        <div className="col-md-4">
                                            <label className="form-label small text-muted fw-bold">Número de Asiento *</label>
                                            <input type="number" className="form-control border-0 shadow-sm" name="formAsiento" placeholder="Ej. 14" required />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label small text-muted fw-bold">Precio ($) *</label>
                                            <input type="number" step="0.01" className="form-control border-0 shadow-sm" name="formPrecio" placeholder="150.00" required />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label small text-muted fw-bold">Fecha de Compra *</label>
                                            <input type="date" className="form-control border-0 shadow-sm" name="formFechaCompra" required />
                                        </div>

                                        <div className="col-md-12">
                                            <label className="form-label small text-muted fw-bold">Estado del Boleto *</label>
                                            <select
                                                className="form-select border-0 shadow-sm"
                                                name="formEstado"
                                                value={estadoBoleto}
                                                onChange={(e) => setEstadoBoleto(e.target.value)}
                                            >
                                                <option value="Reservado">Reservado</option>
                                                <option value="Pagado">Pagado</option>
                                                <option value="Cancelado">Cancelado</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer bg-white border-0">
                                    <button type="button" className="btn btn-light" data-bs-dismiss="modal">Cancelar</button>
                                    <button type="submit" className="btn btn-primary shadow-sm">Guardar Boleto</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {/* ====================================
                    MODAL: MODIFICAR BOLETO
                ========================================== */}
                <div className="modal fade" id="modalModificarBoleto" data-bs-backdrop="static" tabIndex={-1} aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content border-0 shadow-lg">
                            <form id="formModificarBoleto" onSubmit={handleModificar} key={boletoSeleccionado?.id_boleto || 'nuevo'}>
                                <div className="modal-header bg-warning text-dark border-0">
                                    <h5 className="modal-title fw-bold">
                                        <i className="fa-solid fa-ticket me-2"></i> Modificar Boleto
                                    </h5>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body p-4 bg-light">
                                    <input type="hidden" name="formId" defaultValue={boletoSeleccionado?.id_boleto} />

                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <label className="form-label small text-muted fw-bold">Cliente / Usuario *</label>
                                            <select className="form-select border-0 shadow-sm" name="formUsuarioModificar" defaultValue={boletoSeleccionado?.id_usuario} required>
                                                <option value="">Seleccione un cliente...</option>
                                                {usuarios.map((u: any) => (
                                                    <option key={u.id_usuario} value={u.id_usuario}>
                                                        {u.nombre} ({u.username})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label small text-muted fw-bold">Obra Teatral *</label>
                                            <select className="form-select border-0 shadow-sm" name="formObraModificar" defaultValue={boletoSeleccionado?.id_obra} required>
                                                <option value="">Seleccione la obra...</option>
                                                {obras.map((o: any) => (
                                                    <option key={o.id_obra} value={o.id_obra}>
                                                        {o.titulo}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <hr className="my-3 text-muted" />

                                        <div className="col-md-4">
                                            <label className="form-label small text-muted fw-bold">Número de Asiento *</label>
                                            <input type="number" className="form-control border-0 shadow-sm" name="formAsientoModificar" defaultValue={boletoSeleccionado?.id_asiento} required />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label small text-muted fw-bold">Precio ($) *</label>
                                            <input type="number" step="0.01" className="form-control border-0 shadow-sm" name="formPrecioModificar" defaultValue={boletoSeleccionado?.precio} required />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label small text-muted fw-bold">Fecha de Compra *</label>
                                            <input type="date" className="form-control border-0 shadow-sm" name="formFechaCompraModificar" defaultValue={boletoSeleccionado?.fecha_compra} required />
                                        </div>

                                        <div className="col-md-12">
                                            <label className="form-label small text-muted fw-bold">Estado del Boleto *</label>
                                            <select
                                                className="form-select border-0 shadow-sm"
                                                name="formEstadoModificar"
                                                value={estadoBoletoModificar}
                                                onChange={(e) => setEstadoBoletoModificar(e.target.value)}
                                            >
                                                <option value="Reservado">Reservado</option>
                                                <option value="Pagado">Pagado</option>
                                                <option value="Cancelado">Cancelado</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer bg-white border-0">
                                    <button type="button" className="btn btn-light" data-bs-dismiss="modal">Cancelar</button>
                                    <button type="submit" className="btn btn-warning shadow-sm">Actualizar Boleto</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {/* ========================================
                    MODAL: DETALLE BOLETO 
                ========================================== */}
                <div className="modal fade" id="modalDetalleBoleto" tabIndex={-1} aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content border-0 shadow-lg">
                            <div className="modal-header bg-info text-white border-0">
                                <h5 className="modal-title fw-bold">
                                    <i className="fa-solid fa-book-open me-2"></i> Información del Boleto
                                </h5>
                                <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body p-4 bg-light">
                                <div className="row g-3">
                                    <div className="col-md-4">
                                        <label className="form-label small text-muted fw-bold">ID del Boleto</label>
                                        <input type="text" className="form-control-plaintext bg-white px-3 py-2 rounded shadow-sm" value={boletoSeleccionado?.id_boleto || ''} readOnly />
                                    </div>
                                    <div className="col-md-8">
                                        <label className="form-label small text-muted fw-bold">Cliente / Usuario</label>
                                        <input type="text" className="form-control-plaintext bg-white px-3 py-2 rounded shadow-sm" value={boletoSeleccionado?.nombre_usuario || ''} readOnly />
                                    </div>
                                    <div className="col-md-8">
                                        <label className="form-label small text-muted fw-bold">Obra Teatral</label>
                                        <input type="text" className="form-control-plaintext bg-white px-3 py-2 rounded shadow-sm" value={boletoSeleccionado?.titulo_obra || ''} readOnly />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label small text-muted fw-bold">Número de Asiento</label>
                                        <input type="text" className="form-control-plaintext bg-white px-3 py-2 rounded shadow-sm" value={boletoSeleccionado?.id_asiento ? `No. ${boletoSeleccionado.id_asiento}` : ''} readOnly />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label small text-muted fw-bold">Precio ($)</label>
                                        <input type="text" className="form-control-plaintext bg-white px-3 py-2 rounded shadow-sm" value={boletoSeleccionado?.precio ? `$${Number(boletoSeleccionado.precio).toFixed(2)}` : ''} readOnly />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label small text-muted fw-bold">Fecha Compra</label>
                                        <input type="text" className="form-control-plaintext bg-white px-3 py-2 rounded shadow-sm" value={boletoSeleccionado?.fecha_compra ? boletoSeleccionado.fecha_compra.split('T')[0] : ''} readOnly />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label small text-muted fw-bold">Estado Pago</label>
                                        <input type="text" className="form-control-plaintext bg-white px-3 py-2 rounded shadow-sm" value={boletoSeleccionado?.estado || ''} readOnly />
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer bg-white border-0">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ===============================
                    MODAL: CONFIRMAR ELIMINAR
                ========================================== */}
                <div className="modal fade" id="modalEliminarBoleto" tabIndex={-1} aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered modal-sm">
                        <div className="modal-content border-0 shadow-lg">
                            <div className="modal-header bg-danger text-white border-0">
                                <h5 className="modal-title fw-bold">Advertencia!</h5>
                                <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body text-center p-4">
                                <i className="fa-solid fa-triangle-exclamation text-danger fa-3x mb-3"></i>
                                <p className="mb-0 text-dark">Estas seguro de que deseas eliminar el boleto?</p>
                            </div>
                            <div className="modal-footer bg-light border-0 justify-content-center">
                                <button type="button" className="btn btn-light" data-bs-dismiss="modal">Cancelar</button>
                                <button type="button" className="btn btn-danger px-4 shadow-sm" onClick={handleEliminarConfirmar}>Sí, Eliminar</button>
                            </div>
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