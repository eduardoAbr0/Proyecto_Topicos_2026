'use client';

import React, { useState, useEffect } from 'react';
import Script from 'next/script';
import dynamic from 'next/dynamic';
import {
    obtenerFinanzas,
    obtenerFinanzaPorId,
    crearFinanza,
    actualizarFinanza,
    eliminarFinanza
} from '@/services/finanzasService';
import { obtenerObras } from '@/services/obrasService';

const DataTable = dynamic(() => import('react-data-table-component'), {
    ssr: false,
    loading: () => <div className="text-center p-4 text-muted">Cargando tabla de finanzas...</div>
});

export default function FinanzasPage() {
    // --- ESTADOS DE LA TABLA Y BUSQUEDA ---
    const [finanzas, setFinanzas] = useState<any[]>([]);
    const [busqueda, setBusqueda] = useState('');
    const [filtroTipo, setFiltroTipo] = useState('');

    // --- ESTADO PARA SELECT DE OBRAS EN FORMULARIOS ---
    const [obras, setObras] = useState<any[]>([]);

    // --- ESTADO GLOBAL REGISTRO SELECCIONADO ---
    const [finanzaSeleccionada, setFinanzaSeleccionada] = useState<any>(null);

    // --- ESTADOS PARA EL TOAST ---
    const [toast, setToast] = useState({ mostrar: false, mensaje: '', tipo: 'exito' });

    // --- ESTADO CARGA ---
    const [loading, setLoading] = useState(true);

    // --- CARGAR DATOS AL INICIO ---
    useEffect(() => {
        cargarFinanzas();
        cargarObrasSelect();
    }, []);

    const cargarFinanzas = async () => {
        try {
            const data = await obtenerFinanzas();
            if (Array.isArray(data)) {
                setFinanzas(data);
            } else if (data.status === "error" || data.error) {
                mostrarToast(data.message || data.error, "error");
            }
        } catch (error) {
            console.error("Error al cargar finanzas:", error);
            mostrarToast("Error de conexión con el servidor", "error");
        } finally {
            setLoading(false);
        }
    };

    const cargarObrasSelect = async () => {
        try {
            const data = await obtenerObras();
            if (Array.isArray(data)) {
                setObras(data);
            }
        } catch (error) {
            console.error("Error al cargar obras:", error);
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

    // --- MANEJADORES DE ACCIONES ---

    const handleAgregar = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        try {
            const data = await crearFinanza(formData);
            if (data.status === "exito") {
                cargarFinanzas();
                mostrarToast(data.message, "exito");
                (e.target as HTMLFormElement).reset();
            } else {
                mostrarToast(data.message, "error");
            }
        } catch (error) {
            mostrarToast("Error de conexión", "error");
        } finally {
            cerrarModal('modalAltaFinanza');
        }
    };

    const handleModificarMostrar = async (id: number) => {
        const data = await obtenerFinanzaPorId(id);
        if (!data.error) {
            if (data.fecha) {
                data.fecha = data.fecha.split('T')[0];
            }
            setFinanzaSeleccionada(data);
            const modal = new (window as any).bootstrap.Modal(document.getElementById("modalModificarFinanza"));
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
            const data = await actualizarFinanza(formDataObj);
            if (data.status === "exito") {
                cargarFinanzas();
                mostrarToast(data.message, "exito");
            } else {
                mostrarToast(data.message, "error");
            }
        } catch (error) {
            mostrarToast("Error al actualizar", "error");
        } finally {
            cerrarModal('modalModificarFinanza');
        }
    };

    const handleEliminarMostrar = (id: number) => {
        setFinanzaSeleccionada({ id_finanza: id });
        const modal = new (window as any).bootstrap.Modal(document.getElementById("modalEliminarFinanza"));
        modal.show();
    };

    const handleEliminarConfirmar = async () => {
        if (!finanzaSeleccionada) return;
        try {
            const data = await eliminarFinanza(finanzaSeleccionada.id_finanza);
            if (data.status === "exito") {
                cargarFinanzas();
                mostrarToast(data.message, "exito");
            } else {
                mostrarToast(data.message, "error");
            }
        } catch (error) {
            mostrarToast("Error al eliminar", "error");
        } finally {
            cerrarModal('modalEliminarFinanza');
        }
    };

    const handleDetalle = async (id: number) => {
        const data = await obtenerFinanzaPorId(id);
        if (!data.error) {
            setFinanzaSeleccionada(data);
            const modal = new (window as any).bootstrap.Modal(document.getElementById("modalDetalleFinanza"));
            modal.show();
        } else {
            mostrarToast(data.error, "error");
        }
    };

    const finanzasFiltradas = finanzas.filter((f: any) =>
        f.concepto.toLowerCase().includes(busqueda.toLowerCase()));

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
                <div className="text-center">
                    <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}></div>
                    <p className="text-muted fw-bold">Cargando finanzas...</p>
                </div>
            </div>
        );
    }

    // --- CONFIGURACION DATATABLE --
    const columnas = [
        { name: 'ID', selector: (row: any) => row.id_finanza, sortable: true, width: '80px' },
        {
            name: 'Fecha',
            selector: (row: any) => row.fecha ? row.fecha.split('T')[0] : '',
            sortable: true,
            cell: (row: any) => row.fecha ? row.fecha.split('T')[0] : '',
            width: '120px'
        },
        {
            name: 'Tipo',
            selector: (row: any) => row.tipo,
            sortable: true,
            width: '120px',
            cell: (row: any) => (
                <span className={`badge fs-6 ${row.tipo === 'Ingreso' ? 'bg-success' : 'bg-danger'}`}>
                    {row.tipo}
                </span>
            )
        },
        { name: 'Concepto', selector: (row: any) => row.concepto || '—', sortable: true },
        {
            name: 'Monto',
            selector: (row: any) => Number(row.monto),
            sortable: true,
            cell: (row: any) => (
                <span className={`fw-bold ${row.tipo === 'Ingreso' ? 'text-success' : 'text-danger'}`}>
                    ${row.monto}
                </span>
            ),
            width: '150px'
        },
        { name: 'Obra Relacionada', selector: (row: any) => row.titulo_obra || 'Sin asignar', sortable: true },
        {
            name: 'Acciones',
            cell: (row: any) => (
                <div className="d-flex gap-2">
                    <button onClick={() => handleDetalle(row.id_finanza)} className="btn btn-info btn-sm text-white" title="Detalles">
                        <i className="fa-solid fa-eye"></i>
                    </button>
                    <button onClick={() => handleModificarMostrar(row.id_finanza)} className="btn btn-warning btn-sm" title="Modificar">
                        <i className="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button onClick={() => handleEliminarMostrar(row.id_finanza)} className="btn btn-danger btn-sm" title="Eliminar">
                        <i className="fa-solid fa-trash"></i>
                    </button>
                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            width: '150px'
        }
    ];

    const selectObras = (name: string, defaultValue?: string | number | null) => (
        <select className="form-select border-0 shadow-sm" name={name} defaultValue={defaultValue ?? ''}>
            <option value="">Sin asignar (Gasto/Ingreso general)</option>
            {obras.map((o: any) => (
                <option key={o.id_obra} value={o.id_obra}>
                    {o.titulo}
                </option>
            ))}
        </select>
    );

    const hoy = new Date().toISOString().split('T')[0];

    return (
        <>
            <Script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js" strategy="afterInteractive" />

            <section className="content-header mt-4 mb-3">
                <div className="container-fluid">
                    <div className="row align-items-center">
                        <div className="col-12">
                            <div className="d-flex align-items-center gap-2 mb-1">
                                <i className="fa-solid fa-coins text-muted" style={{ fontSize: '24px', color: '#A8BBA3' }} />
                                <h1 className="h2 fw-bold m-0 text-dark" style={{ fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.5px' }}>
                                    Gestión de Finanzas
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
                                    <button className="btn btn-primary w-100 shadow-sm" data-bs-toggle="modal" data-bs-target="#modalAltaFinanza">
                                        <i className="fa-solid fa-plus me-2"></i> Nuevo Finanza
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="card shadow-sm border-0">
                            <DataTable
                                columns={columnas}
                                data={finanzasFiltradas}
                                pagination
                                highlightOnHover
                                responsive
                                striped
                                noDataComponent={<div className="p-4 text-muted">No se encontraron registros financieros.</div>}
                            />
                        </div>
                    </div>
                </section>

                {/* ==========================================
                    MODAL: ALTA DE FINANZA
                ========================================== */}
                <div className="modal fade" id="modalAltaFinanza" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content border-0 shadow-lg">
                            <form id="formAltaFinanza" onSubmit={handleAgregar} method="POST">
                                <div className="modal-header bg-primary text-white border-0">
                                    <h5 className="modal-title fw-bold">
                                        <i className="fa-solid fa-plus me-2"></i> Registrar Finanza
                                    </h5>
                                    <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body p-4 bg-light">
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <label htmlFor="formFecha" className="form-label small text-muted fw-bold">Fecha *</label>
                                            <input type="date" className="form-control border-0 shadow-sm" id="formFecha" name="formFecha" defaultValue={hoy} required />
                                        </div>
                                        <div className="col-md-6">
                                            <label htmlFor="formTipo" className="form-label small text-muted fw-bold">Tipo *</label>
                                            <select className="form-select border-0 shadow-sm" id="formTipo" name="formTipo" required>
                                                <option value="Ingreso">Ingreso</option>
                                                <option value="Gasto">Gasto</option>
                                            </select>
                                        </div>
                                        <div className="col-md-6">
                                            <label htmlFor="formMonto" className="form-label small text-muted fw-bold">Monto ($ MXN) *</label>
                                            <input type="number" step="0.01" min="0.01" className="form-control border-0 shadow-sm" id="formMonto" name="formMonto" placeholder="0.00" required />
                                        </div>
                                        <div className="col-md-6">
                                            <label htmlFor="formObra" className="form-label small text-muted fw-bold">Obra Relacionada (Opcional)</label>
                                            {selectObras('formObra')}
                                        </div>
                                        <div className="col-12">
                                            <label htmlFor="formConcepto" className="form-label small text-muted fw-bold">Concepto *</label>
                                            <input type="text" className="form-control border-0 shadow-sm" id="formConcepto" name="formConcepto" maxLength={100} placeholder="Ej. Pago de taquilla, Compra de escenografía..." required />
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer bg-white border-0">
                                    <button type="button" className="btn btn-light" data-bs-dismiss="modal">Cancelar</button>
                                    <button type="submit" className="btn btn-primary shadow-sm">Guardar Registro</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {/* ====================================
                    MODAL: MODIFICAR FINANZA
                ========================================== */}
                <div className="modal fade" id="modalModificarFinanza" data-bs-backdrop="static" tabIndex={-1} aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content border-0 shadow-lg">
                            <form id="formModificarFinanza" onSubmit={handleModificar} key={finanzaSeleccionada?.id_finanza || 'nuevo'}>
                                <div className="modal-header bg-warning text-dark border-0">
                                    <h5 className="modal-title fw-bold">
                                        <i className="fa-solid fa-pen-to-square me-2"></i> Modificar Registro Financiero
                                    </h5>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body p-4 bg-light">
                                    <input type="hidden" name="formId" defaultValue={finanzaSeleccionada?.id_finanza} />

                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <label className="form-label small text-muted fw-bold">Fecha *</label>
                                            <input type="date" className="form-control border-0 shadow-sm" name="formFechaModificar" defaultValue={finanzaSeleccionada?.fecha} required />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label small text-muted fw-bold">Tipo *</label>
                                            <select className="form-select border-0 shadow-sm" name="formTipoModificar" defaultValue={finanzaSeleccionada?.tipo || 'Ingreso'} required>
                                                <option value="Ingreso">Ingreso</option>
                                                <option value="Gasto">Gasto</option>
                                            </select>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label small text-muted fw-bold">Monto *</label>
                                            <input type="number" step="0.01" min="0.01" className="form-control border-0 shadow-sm" name="formMontoModificar" defaultValue={finanzaSeleccionada?.monto} required />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label small text-muted fw-bold">Obra Relacionada (Opcional)</label>
                                            {selectObras('formObraModificar', finanzaSeleccionada?.id_obra)}
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label small text-muted fw-bold">Concepto *</label>
                                            <input type="text" className="form-control border-0 shadow-sm" name="formConceptoModificar" defaultValue={finanzaSeleccionada?.concepto} maxLength={100} required />
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer bg-white border-0">
                                    <button type="button" className="btn btn-light" data-bs-dismiss="modal">Cancelar</button>
                                    <button type="submit" className="btn btn-warning shadow-sm">Actualizar Datos</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {/* ========================================
                    MODAL: DETALLE FINANZA
                ========================================== */}
                <div className="modal fade" id="modalDetalleFinanza" tabIndex={-1} aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content border-0 shadow-lg">
                            <div className="modal-header bg-info text-white border-0">
                                <h5 className="modal-title fw-bold">
                                    <i className="fa-solid fa-book-open me-2"></i> Información del Registro Financiero
                                </h5>
                                <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body p-4 bg-light">
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label small text-muted fw-bold">ID</label>
                                        <input type="text" className="form-control-plaintext bg-white px-3 py-2 rounded shadow-sm" value={finanzaSeleccionada?.id_finanza || ''} readOnly />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label small text-muted fw-bold">Fecha</label>
                                        <input type="text" className="form-control-plaintext bg-white px-3 py-2 rounded shadow-sm" value={finanzaSeleccionada?.fecha ? finanzaSeleccionada.fecha.split('T')[0] : ''} readOnly />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label small text-muted fw-bold">Tipo</label>
                                        <input type="text" className="form-control-plaintext bg-white px-3 py-2 rounded shadow-sm" value={finanzaSeleccionada?.tipo || ''} readOnly />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label small text-muted fw-bold">Monto</label>
                                        <input type="text" className="form-control-plaintext bg-white px-3 py-2 rounded shadow-sm" value={finanzaSeleccionada?.monto || ''} readOnly />
                                    </div>
                                    <div className="col-md-12">
                                        <label className="form-label small text-muted fw-bold">Obra Relacionada</label>
                                        <input type="text" className="form-control-plaintext bg-white px-3 py-2 rounded shadow-sm" value={finanzaSeleccionada?.titulo_obra || 'Sin asignar'} readOnly />
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label small text-muted fw-bold">Concepto</label>
                                        <textarea className="form-control-plaintext bg-white px-3 py-2 rounded shadow-sm" rows={2} value={finanzaSeleccionada?.concepto || ''} readOnly />
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
                <div className="modal fade" id="modalEliminarFinanza" tabIndex={-1} aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered modal-sm">
                        <div className="modal-content border-0 shadow-lg">
                            <div className="modal-header bg-danger text-white border-0">
                                <h5 className="modal-title fw-bold">Advertencia!</h5>
                                <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body text-center p-4">
                                <i className="fa-solid fa-triangle-exclamation text-danger fa-3x mb-3"></i>
                                <p className="mb-0 text-dark">¿Estás seguro de que deseas eliminar el registro financiero?</p>
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
