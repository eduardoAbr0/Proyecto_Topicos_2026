'use client';

import React, { useState, useEffect } from 'react';
import Script from 'next/script';
import dynamic from 'next/dynamic';
import {
    obtenerObras,
    obtenerObraPorId,
    crearObra,
    actualizarObra,
    eliminarObra
} from '@/services/obrasService';
import { obtenerMiembros } from '@/services/miembrosService';

const DataTable = dynamic(() => import('react-data-table-component'), {
    ssr: false,
    loading: () => <div className="text-center p-4 text-muted">Cargando tabla de obras...</div>
});

export default function ObrasPage() {
    // --- ESTADOS DE LA TABLA Y BUSQUEDA ---
    const [obras, setObras] = useState<any[]>([]);
    const [busqueda, setBusqueda] = useState('');

    // --- ESTADO PARA SELECT DE PRODUCTOR EN FORMULARIOS ---
    const [miembros, setMiembros] = useState<any[]>([]);

    // --- ESTADO GLOBAL OBRA SELECCIONADA ---
    const [obraSeleccionada, setObraSeleccionada] = useState<any>(null);

    // --- ESTADOS PARA EL TOAST ---
    const [toast, setToast] = useState({ mostrar: false, mensaje: '', tipo: 'exito' });

    // --- CARGAR DATOS AL INICIO ---
    useEffect(() => {
        cargarObras();
        cargarMiembrosSelect();
    }, []);

    const cargarObras = async () => {
        try {
            const data = await obtenerObras();
            if (Array.isArray(data)) {
                setObras(data);
            } else if (data.status === "error" || data.error) {
                mostrarToast(data.message || data.error, "error");
            }
        } catch (error) {
            console.error("Error al cargar obras:", error);
            mostrarToast("Error de conexión con el servidor", "error");
        }
    };

    const cargarMiembrosSelect = async () => {
        try {
            const data = await obtenerMiembros();
            if (Array.isArray(data)) {
                setMiembros(data);
            }
        } catch (error) {
            console.error("Error al cargar miembros para productor:", error);
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
            const data = await crearObra(formData);
            if (data.status === "exito") {
                cargarObras();
                mostrarToast(data.message, "exito");
                (e.target as HTMLFormElement).reset();
            } else {
                mostrarToast(data.message, "error");
            }
        } catch (error) {
            mostrarToast("Error de conexión", "error");
        } finally {
            cerrarModal('modalAltaObra');
        }
    };

    const handleModificarMostrar = async (id: number) => {
        const data = await obtenerObraPorId(id);
        console.log('DATA HANDLE MODIFICAR MOSTRAR', data);
        if (!data.error) {
            setObraSeleccionada(data);
            const modal = new (window as any).bootstrap.Modal(document.getElementById("modalModificarObra"));
            modal.show();
        } else {
            mostrarToast(data.error, "error");
        }
    };

    const handleModificar = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const formDataObj = Object.fromEntries(formData.entries());

        console.log('OBJETO ANTES DE ACTUALIZAR> ',formDataObj);

        try {
            const data = await actualizarObra(formDataObj);
            if (data.status === "exito") {
                cargarObras();
                mostrarToast(data.message, "exito");
            } else {
                mostrarToast(data.message, "error");
            }
        } catch (error) {
            mostrarToast("Error al actualizar", "error");
        } finally {
            cerrarModal('modalModificarObra');
        }
    };

    const handleEliminarMostrar = (id: number) => {
        setObraSeleccionada({ id_obra: id });
        const modal = new (window as any).bootstrap.Modal(document.getElementById("modalEliminarObra"));
        modal.show();
    };

    const handleEliminarConfirmar = async () => {
        if (!obraSeleccionada) return;
        try {
            const data = await eliminarObra(obraSeleccionada.id_obra);
            if (data.status === "exito") {
                cargarObras();
                mostrarToast(data.message, "exito");
            } else {
                mostrarToast(data.message, "error");
            }
        } catch (error) {
            mostrarToast("Error al eliminar", "error");
        } finally {
            cerrarModal('modalEliminarObra');
        }
    };

    const handleDetalle = async (id: number) => {
        const data = await obtenerObraPorId(id);
        if (!data.error) {
            setObraSeleccionada(data);
            const modal = new (window as any).bootstrap.Modal(document.getElementById("modalDetalleObra"));
            modal.show();
        } else {
            mostrarToast(data.error, "error");
        }
    };

    const obrasFiltradas = obras.filter((o: any) =>
        o.titulo?.toLowerCase().includes(busqueda.toLowerCase()) ||
        (o.autor || '').toLowerCase().includes(busqueda.toLowerCase())
    );

    // --- CONFIGURACION DATATABLE --
    const columnas = [
        { name: 'ID', selector: (row: any) => row.id_obra, sortable: true, width: '80px' },
        { name: 'Título', selector: (row: any) => row.titulo, sortable: true },
        { name: 'Autor', selector: (row: any) => row.autor || '—', sortable: true },
        {
            name: 'Tipo',
            selector: (row: any) => row.tipo || '—',
            sortable: true,
            cell: (row: any) => (
                row.tipo
                    ? <span className="badge fs-6 bg-secondary">{row.tipo}</span>
                    : <span className="text-muted">—</span>
            )
        },
        {
            name: 'Temporada',
            selector: (row: any) => row.temporada || '—',
            sortable: true, width: '120px',
            cell: (row: any) => (
                <span className={`badge fs-6 ${row.temporada === 'Primavera' ? 'bg-success' :
                        row.temporada === 'Verano' ? 'bg-danger' :
                        row.temporada === 'Otoño' ? 'bg-warning text-dark' :
                        row.temporada === 'Invierno' ? 'bg-info text-dark' :
                        'bg-secondary' 
                    }`}>
                    {row.temporada || '—'}
                </span>
            )
        },
        { name: 'Productor', selector: (row: any) => row.nombre_productor || 'Sin asignar', sortable: true },
        {
            name: 'Acciones',
            cell: (row: any) => (
                <div className="d-flex gap-2">
                    <button onClick={() => handleDetalle(row.id_obra)} className="btn btn-info btn-sm text-white" title="Detalles">
                        <i className="fa-solid fa-eye"></i>
                    </button>
                    <button onClick={() => handleModificarMostrar(row.id_obra)} className="btn btn-warning btn-sm" title="Modificar">
                        <i className="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button onClick={() => handleEliminarMostrar(row.id_obra)} className="btn btn-danger btn-sm" title="Eliminar">
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

    const selectProductores = (name: string, defaultValue?: string | number | null) => (
        <select className="form-select border-0 shadow-sm" name={name} defaultValue={defaultValue ?? ''}>
            <option value="">Sin asignar</option>
            {miembros.map((m: any) => (
                <option key={m.id_miembro} value={m.id_miembro}>
                    {m.nombre} {m.primer_apellido} {m.segundo_apellido || ''}
                </option>
            ))}
        </select>
    );

    return (
        <>
            <Script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js" strategy="afterInteractive" />

            <section className="content-header mt-4 mb-3">
                <div className="container-fluid">
                    <div className="row align-items-center">
                        <div className="col-12">
                            <div className="d-flex align-items-center gap-2 mb-1">
                                <i className="fa-solid fa-masks-theater text-muted" style={{ fontSize: '24px', color: '#A8BBA3' }} />
                                <h1 className="h2 fw-bold m-0 text-dark" style={{ fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.5px' }}>
                                    Gestión de Obras
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
                                            placeholder="Buscar obra..."
                                            value={busqueda}
                                            onChange={(e) => setBusqueda(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-4 text-md-end">
                                    <button className="btn btn-primary w-100 shadow-sm" data-bs-toggle="modal" data-bs-target="#modalAltaObra">
                                        <i className="fa-solid fa-plus me-2"></i> Nueva Obra
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="card shadow-sm border-0">
                            <DataTable
                                columns={columnas}
                                data={obrasFiltradas}
                                pagination
                                highlightOnHover
                                responsive
                                striped
                                noDataComponent={<div className="p-4 text-muted">No se encontraron obras.</div>}
                            />
                        </div>
                    </div>
                </section>

                {/* ==========================================
                    MODAL: ALTA DE OBRA
                ========================================== */}
                <div className="modal fade" id="modalAltaObra" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content border-0 shadow-lg">
                            <form id="formAltaObra" onSubmit={handleAgregar} method="POST">
                                <div className="modal-header bg-primary text-white border-0">
                                    <h5 className="modal-title fw-bold">
                                        <i className="fa-solid fa-plus me-2"></i> Registrar Nueva Obra
                                    </h5>
                                    <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body p-4 bg-light">
                                    <div className="row g-3">
                                        <div className="col-md-8">
                                            <label htmlFor="formTitulo" className="form-label small text-muted fw-bold">Título *</label>
                                            <input type="text" className="form-control border-0 shadow-sm" id="formTitulo" name="formTitulo" maxLength={100} placeholder="Ej. Hamlet" required />
                                        </div>
                                        <div className="col-md-4">
                                            <label htmlFor="formAutor" className="form-label small text-muted fw-bold">Autor</label>
                                            <input type="text" className="form-control border-0 shadow-sm" id="formAutor" name="formAutor" maxLength={100} placeholder="Ej. Shakespeare" required/>
                                        </div>
                                        <div className="col-md-4">
                                            <label htmlFor="formTipo" className="form-label small text-muted fw-bold">Tipo / Género</label>
                                            <select className="form-select border-0 shadow-sm" id="formTipo" name="formTipo">
                                                <option value="Drama">Drama</option>
                                                <option value="Comedia">Comedia</option>
                                                <option value="Suspenso">Suspenso</option>
                                                <option value="Musical">Musical</option>
                                                <option value="Terror">Terror</option>
                                                <option value="Romance">Romance</option>
                                            </select>
                                        </div>
                                        <div className="col-md-4">
                                            <label htmlFor="formNumActos" className="form-label small text-muted fw-bold">Número de actos</label>
                                            <input type="number" min={1} className="form-control border-0 shadow-sm" id="formNumActos" name="formNumActos" required/>
                                        </div>
                                        <div className="col-md-4">
                                            <label htmlFor="formAnioPresentacion" className="form-label small text-muted fw-bold">Año de presentación</label>
                                            <input type="number" min={1900} max={2100} className="form-control border-0 shadow-sm" id="formAnioPresentacion" name="formAnioPresentacion" required/>
                                        </div>
                                        <div className="col-md-4">
                                            <label htmlFor="formTemporada" className="form-label small text-muted fw-bold">Temporada</label>
                                            <select className="form-select border-0 shadow-sm" id="formTemporada" name="formTemporada">
                                                <option value="Primavera">Primavera</option>
                                                <option value="Verano">Verano</option>
                                                <option value="Otoño">Otoño</option>
                                                <option value="Invierno">Invierno</option>
                                            </select>
                                        </div>
                                        <div className="col-md-8">
                                            <label htmlFor="formProductor" className="form-label small text-muted fw-bold">Productor</label>
                                            {selectProductores('formProductor')}
                                        </div>
                                        <div className="col-12">
                                            <label htmlFor="formDescripcion" className="form-label small text-muted fw-bold">Descripción</label>
                                            <textarea className="form-control border-0 shadow-sm" id="formDescripcion" name="formDescripcion" rows={3} />
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer bg-white border-0">
                                    <button type="button" className="btn btn-light" data-bs-dismiss="modal">Cancelar</button>
                                    <button type="submit" className="btn btn-primary shadow-sm">Guardar Obra</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {/* ====================================
                    MODAL: MODIFICAR OBRA
                ========================================== */}
                <div className="modal fade" id="modalModificarObra" data-bs-backdrop="static" tabIndex={-1} aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content border-0 shadow-lg">
                            <form id="formModificarObra" onSubmit={handleModificar} key={obraSeleccionada?.id_obra || 'nuevo'}>
                                <div className="modal-header bg-warning text-dark border-0">
                                    <h5 className="modal-title fw-bold">
                                        <i className="fa-solid fa-pen-to-square me-2"></i> Modificar Obra
                                    </h5>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body p-4 bg-light">
                                    <input type="hidden" name="formId" defaultValue={obraSeleccionada?.id_obra} />

                                    <div className="row g-3">
                                        <div className="col-md-8">
                                            <label className="form-label small text-muted fw-bold">Título *</label>
                                            <input type="text" className="form-control border-0 shadow-sm" name="formTituloModificar" defaultValue={obraSeleccionada?.titulo} maxLength={100} required />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label small text-muted fw-bold">Autor</label>
                                            <input type="text" className="form-control border-0 shadow-sm" name="formAutorModificar" defaultValue={obraSeleccionada?.autor || 'Drama'} maxLength={100} required/>
                                        </div>
                                        <div className="col-md-4">
                                            <label htmlFor="formTipoModificar" className="form-label small text-muted fw-bold">Tipo / Género</label>
                                            <select className="form-select border-0 shadow-sm" id="formTipoModificar" name="formTipoModificar" defaultValue={obraSeleccionada?.tipo || 'Drama'}>
                                                <option value="Drama">Drama</option>
                                                <option value="Comedia">Comedia</option>
                                                <option value="Suspenso">Suspenso</option>
                                                <option value="Musical">Musical</option>
                                                <option value="Terror">Terror</option>
                                                <option value="Romance">Romance</option>
                                            </select>
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label small text-muted fw-bold">Número de actos</label>
                                            <input type="number" min={1} className="form-control border-0 shadow-sm" name="formNumActosModificar" defaultValue={obraSeleccionada?.num_actos ?? ''} required/>
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label small text-muted fw-bold">Año de presentación</label>
                                            <input type="number" min={1900} max={2100} className="form-control border-0 shadow-sm" name="formAnioPresentacionModificar" defaultValue={obraSeleccionada?.anio_presentacion ?? ''} required/>
                                        </div>
                                        <div className="col-md-4">
                                            <label htmlFor="formTemporadaModificar" className="form-label small text-muted fw-bold">Temporada</label>
                                            <select className="form-select border-0 shadow-sm" id="formTemporadaModificar" name="formTemporadaModificar" defaultValue={obraSeleccionada?.temporada || 'Primavera'}>
                                                <option value="Primavera">Primavera</option>
                                                <option value="Verano">Verano</option>
                                                <option value="Otoño">Otoño</option>
                                                <option value="Invierno">Invierno</option>
                                            </select>
                                        </div>
                                        <div className="col-md-8">
                                            <label className="form-label small text-muted fw-bold">Productor</label>
                                            {selectProductores('formProductorModificar', obraSeleccionada?.productor)}
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label small text-muted fw-bold">Descripción</label>
                                            <textarea className="form-control border-0 shadow-sm" name="formDescripcionModificar" rows={3} defaultValue={obraSeleccionada?.descripcion || ''} />
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
                    MODAL: DETALLE OBRA
                ========================================== */}
                <div className="modal fade" id="modalDetalleObra" tabIndex={-1} aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content border-0 shadow-lg">
                            <div className="modal-header bg-info text-white border-0">
                                <h5 className="modal-title fw-bold">
                                    <i className="fa-solid fa-book-open me-2"></i> Información de la Obra
                                </h5>
                                <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body p-4 bg-light">
                                <div className="row g-3">
                                    <div className="col-md-8">
                                        <label className="form-label small text-muted fw-bold">Título</label>
                                        <input type="text" className="form-control-plaintext bg-white px-3 py-2 rounded shadow-sm" value={obraSeleccionada?.titulo || ''} readOnly />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label small text-muted fw-bold">Autor</label>
                                        <input type="text" className="form-control-plaintext bg-white px-3 py-2 rounded shadow-sm" value={obraSeleccionada?.autor || ''} readOnly />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label small text-muted fw-bold">Tipo</label>
                                        <input type="text" className="form-control-plaintext bg-white px-3 py-2 rounded shadow-sm" value={obraSeleccionada?.tipo || ''} readOnly />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label small text-muted fw-bold">Número de actos</label>
                                        <input type="text" className="form-control-plaintext bg-white px-3 py-2 rounded shadow-sm" value={obraSeleccionada?.num_actos ?? ''} readOnly />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label small text-muted fw-bold">Año de presentación</label>
                                        <input type="text" className="form-control-plaintext bg-white px-3 py-2 rounded shadow-sm" value={obraSeleccionada?.anio_presentacion ?? ''} readOnly />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label small text-muted fw-bold">Temporada</label>
                                        <input type="text" className="form-control-plaintext bg-white px-3 py-2 rounded shadow-sm" value={obraSeleccionada?.temporada || ''} readOnly />
                                    </div>
                                    <div className="col-md-8">
                                        <label className="form-label small text-muted fw-bold">Productor</label>
                                        <input type="text" className="form-control-plaintext bg-white px-3 py-2 rounded shadow-sm" value={obraSeleccionada?.nombre_productor || 'Sin asignar'} readOnly />
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label small text-muted fw-bold">Descripción</label>
                                        <textarea className="form-control-plaintext bg-white px-3 py-2 rounded shadow-sm" rows={3} value={obraSeleccionada?.descripcion || ''} readOnly />
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
                <div className="modal fade" id="modalEliminarObra" tabIndex={-1} aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered modal-sm">
                        <div className="modal-content border-0 shadow-lg">
                            <div className="modal-header bg-danger text-white border-0">
                                <h5 className="modal-title fw-bold">Advertencia!</h5>
                                <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body text-center p-4">
                                <i className="fa-solid fa-triangle-exclamation text-danger fa-3x mb-3"></i>
                                <p className="mb-0 text-dark">Estas seguro de que deseas eliminar esta obra?</p>
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
