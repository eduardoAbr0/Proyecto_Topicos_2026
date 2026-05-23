'use client';

import React, { useState, useEffect } from 'react';
import Script from 'next/script';
import dynamic from 'next/dynamic';
import {
    obtenerMiembros,
    obtenerMiembroPorId,
    crearMiembro,
    actualizarMiembro,
    eliminarMiembro
} from '@/services/miembrosService';

const DataTable = dynamic(() => import('react-data-table-component'), {
    ssr: false,
    loading: () => <div className="text-center p-4 text-muted">Cargando tabla de miembros...</div>
});

export default function MiembrosPage() {
    // --- ESTADOS DE LA TABLA Y BUSQUEDA ---
    const [miembros, setMiembros] = useState<any[]>([]);;
    const [busqueda, setBusqueda] = useState('');

    // --- ESTADOS PARA LOS MODALES DE ALTA Y MODIFICAR ---
    const [estadoMembresia, setEstadoMembresia] = useState('Sin pagar');
    const [fechaPago, setFechaPago] = useState('');
    const [estadoMembresiaModificar, setEstadoMembresiaModificar] = useState('Sin pagar');
    const [fechaPagoModificar, setFechaPagoModificar] = useState('');

    // --- ESTADO GLOBAL MIEMBRO SELECCIONADO ---
    const [miembroSeleccionado, setMiembroSeleccionado] = useState<any>(null);

    // --- ESTADOS PARA EL TOAST ---
    const [toast, setToast] = useState({ mostrar: false, mensaje: '', tipo: 'exito' });

    // --- CARGAR DATOS AL INICIO ---
    useEffect(() => {
        cargarMiembros();
    }, []);

    const cargarMiembros = async () => {
        try {
            const data = await obtenerMiembros();
            if (Array.isArray(data)) {
                setMiembros(data);
            } else if (data.status === "error" || data.error) {
                mostrarToast(data.message || data.error, "error");
            }
        } catch (error) {
            console.error("Error al cargar miembros:", error);
            mostrarToast("Error de conexión con el servidor", "error");
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
            const data = await crearMiembro(formData);
            if (data.status === "exito") {
                cargarMiembros();
                mostrarToast(data.message, "exito");
                (e.target as HTMLFormElement).reset();
            } else {
                mostrarToast(data.message, "error");
            }
        } catch (error) {
            mostrarToast("Error de conexión", "error");
        } finally {
            cerrarModal('modalAltaMiembro');
        }
    };

    const handleModificarMostrar = async (id: number) => {
        const data = await obtenerMiembroPorId(id);
        if (!data.error) {
            setMiembroSeleccionado(data);
            setEstadoMembresiaModificar(data.estado_membresia);
            setFechaPagoModificar(data.fecha_pago_cuota || '');
            const modal = new (window as any).bootstrap.Modal(document.getElementById("modalModificarMiembro"));
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
            const data = await actualizarMiembro(formDataObj);
            if (data.status === "exito") {
                cargarMiembros();
                mostrarToast(data.message, "exito");
            } else {
                mostrarToast(data.message, "error");
            }
        } catch (error) {
            mostrarToast("Error al actualizar", "error");
        } finally {
            cerrarModal('modalModificarMiembro');
        }
    };

    const handleEliminarMostrar = (id: number) => {
        setMiembroSeleccionado({ id_miembro: id });
        const modal = new (window as any).bootstrap.Modal(document.getElementById("modalEliminarMiembro"));
        modal.show();
    };

    const handleEliminarConfirmar = async () => {
        if (!miembroSeleccionado) return;
        try {
            const data = await eliminarMiembro(miembroSeleccionado.id_miembro);
            if (data.status === "exito") {
                cargarMiembros();
                mostrarToast(data.message, "exito");
            } else {
                mostrarToast(data.message, "error");
            }
        } catch (error) {
            mostrarToast("Error al eliminar", "error");
        } finally {
            cerrarModal('modalEliminarMiembro');
        }
    };

    const handleDetalle = async (id: number) => {
        const data = await obtenerMiembroPorId(id);
        if (!data.error) {
            setMiembroSeleccionado(data);
            const modal = new (window as any).bootstrap.Modal(document.getElementById("modalDetalleMiembro"));
            modal.show();
        } else {
            mostrarToast(data.error, "error");
        }
    };

    const miembrosFiltrados = miembros.filter((m: any) =>
        m.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        m.primer_apellido.toLowerCase().includes(busqueda.toLowerCase())
    );

    // --- CONFIGURACION DATATABLE --
    const columnas = [
        { name: 'ID', selector: (row: any) => row.id_miembro, sortable: true, width: '80px' },
        { name: 'Nombre Completo', selector: (row: any) => `${row.nombre} ${row.primer_apellido} ${row.segundo_apellido || ''}`, sortable: true },
        {
            name: 'Estado Membresía', selector: (row: any) => row.estado_membresia, sortable: true,
            cell: (row: any) => (
                <span className={`badge ${row.estado_membresia === 'Pagada' ? 'bg-success' : 'bg-warning text-dark'}`}>
                    {row.estado_membresia}
                </span>
            )
        },
        {
            name: 'Acciones',
            cell: (row: any) => (
                <div className="d-flex gap-2">
                    <button onClick={() => handleDetalle(row.id_miembro)} className="btn btn-info btn-sm text-white" title="Detalles">
                        <i className="fa-solid fa-eye"></i>
                    </button>
                    <button onClick={() => handleModificarMostrar(row.id_miembro)} className="btn btn-warning btn-sm" title="Modificar">
                        <i className="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button onClick={() => handleEliminarMostrar(row.id_miembro)} className="btn btn-danger btn-sm" title="Eliminar">
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

            <section className="content-header">
                <div className="container-fluid">
                    <div className="row mb-2">
                        <div className="col-sm-6">
                            <h1>Gestión de Miembros</h1>
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
                                            type="text" className="form-control bg-light border-start-0"
                                            placeholder="Buscar miembro..." value={busqueda}
                                            onChange={(e) => setBusqueda(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-4 text-md-end">
                                    <button className="btn btn-primary w-100 shadow-sm" data-bs-toggle="modal" data-bs-target="#modalAltaMiembro">
                                        <i className="fa-solid fa-user-plus me-2"></i> Nuevo Miembro
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="card shadow-sm border-0">
                            <DataTable
                                columns={columnas}
                                data={miembrosFiltrados}
                                pagination
                                highlightOnHover
                                responsive
                                striped
                                noDataComponent={<div className="p-4 text-muted">No se encontraron miembros.</div>}
                            />
                        </div>
                    </div>
                </section>

                {/* ==========================================
                    MODAL: ALTA DE MIEMBRO
                ========================================== */}
                <div className="modal fade" id="modalAltaMiembro" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content border-0 shadow-lg">
                            <form id="formAltaMiembro" onSubmit={handleAgregar} method="POST">
                                <div className="modal-header bg-primary text-white border-0">
                                    <h5 className="modal-title fw-bold">
                                        <i className="fa-solid fa-user-plus me-2"></i> Registrar Nuevo Miembro
                                    </h5>
                                    <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body p-4 bg-light">
                                    <div className="row g-3">
                                        <div className="col-md-4">
                                            <label htmlFor="formNombre" className="form-label small text-muted fw-bold">Nombre *</label>
                                            <input type="text" className="form-control border-0 shadow-sm" id="formNombre" name="formNombre" placeholder="Ej. Juan" required />
                                        </div>
                                        <div className="col-md-4">
                                            <label htmlFor="formPrimerAp" className="form-label small text-muted fw-bold">Primer Apellido *</label>
                                            <input type="text" className="form-control border-0 shadow-sm" id="formPrimerAp" name="formPrimerAp" placeholder="Ej. Pérez" required />
                                        </div>
                                        <div className="col-md-4">
                                            <label htmlFor="formSegundoAp" className="form-label small text-muted fw-bold">Segundo Apellido</label>
                                            <input type="text" className="form-control border-0 shadow-sm" id="formSegundoAp" name="formSegundoAp" placeholder="Ej. López" />
                                        </div>
                                        <div className="col-md-6">
                                            <label htmlFor="formTelefono" className="form-label small text-muted fw-bold">Teléfono *</label>
                                            <input type="tel" className="form-control border-0 shadow-sm" id="formTelefono" name="formTelefono" placeholder="10 dígitos" required />
                                        </div>
                                        <div className="col-md-6">
                                            <label htmlFor="formEmail" className="form-label small text-muted fw-bold">Correo Electrónico *</label>
                                            <input type="email" className="form-control border-0 shadow-sm" id="formEmail" name="formEmail" placeholder="juan@example.com" required />
                                        </div>

                                        <hr className="my-3 text-muted" />
                                        <h6 className="text-secondary fw-bold mb-0">Dirección Domiciliaria</h6>

                                        <div className="col-md-3">
                                            <label htmlFor="formNumCasa" className="form-label small text-muted fw-bold">Número de Casa *</label>
                                            <input type="number" className="form-control border-0 shadow-sm" id="formNumCasa" name="formNumCasa" required />
                                        </div>
                                        <div className="col-md-5">
                                            <label htmlFor="formCalle" className="form-label small text-muted fw-bold">Calle *</label>
                                            <input type="text" className="form-control border-0 shadow-sm" id="formCalle" name="formCalle" required />
                                        </div>
                                        <div className="col-md-4">
                                            <label htmlFor="formColonia" className="form-label small text-muted fw-bold">Colonia *</label>
                                            <input type="text" className="form-control border-0 shadow-sm" id="formColonia" name="formColonia" required />
                                        </div>
                                        <div className="col-md-4">
                                            <label htmlFor="formCP" className="form-label small text-muted fw-bold">Código Postal *</label>
                                            <input type="text" className="form-control border-0 shadow-sm" id="formCP" name="formCP" required />
                                        </div>

                                        <hr className="my-3 text-muted" />
                                        <h6 className="text-secondary fw-bold mb-0">Estado de Membresía</h6>

                                        <div className="col-md-6">
                                            <label htmlFor="formEstadoMembresia" className="form-label small text-muted fw-bold">Estado *</label>
                                            <select
                                                className="form-select border-0 shadow-sm"
                                                id="formEstadoMembresia"
                                                name="formEstadoMembresia"
                                                value={estadoMembresia}
                                                onChange={(e) => setEstadoMembresia(e.target.value)}
                                            >
                                                <option value="Sin pagar">Sin pagar</option>
                                                <option value="Pagada">Pagada</option>
                                                <option value="Financiada">Financiada</option>
                                            </select>
                                        </div>
                                        <div className="col-md-6">
                                            <label htmlFor="formFechaPago" className="form-label small text-muted fw-bold">Fecha de Pago</label>
                                            <input
                                                type="date"
                                                className="form-control border-0 shadow-sm"
                                                id="formFechaPago"
                                                name="formFechaPago"
                                                value={fechaPago}
                                                onChange={(e) => setFechaPago(e.target.value)}
                                                disabled={estadoMembresia !== 'Pagada'}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer bg-white border-0">
                                    <button type="button" className="btn btn-light" data-bs-dismiss="modal">Cancelar</button>
                                    <button type="submit" className="btn btn-primary shadow-sm">Guardar Miembro</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                {/* ====================================
                    MODAL: MODIFICAR MIEMBRO
                ========================================== */}
                <div className="modal fade" id="modalModificarMiembro" data-bs-backdrop="static" tabIndex={-1} aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content border-0 shadow-lg">
                            <form id="formModificarMiembro" onSubmit={handleModificar} key={miembroSeleccionado?.id_miembro || 'nuevo'}>
                                <div className="modal-header bg-warning text-dark border-0">
                                    <h5 className="modal-title fw-bold">
                                        <i className="fa-solid fa-user-gear me-2"></i> Modificar Miembro
                                    </h5>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body p-4 bg-light">
                                    {/* ID Oculto */}
                                    <input type="hidden" name="formId" defaultValue={miembroSeleccionado?.id_miembro} />

                                    <div className="row g-3">
                                        <div className="col-md-4">
                                            <label className="form-label small text-muted fw-bold">Nombre *</label>
                                            <input type="text" className="form-control border-0 shadow-sm" name="formNombreModificar" defaultValue={miembroSeleccionado?.nombre} required />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label small text-muted fw-bold">Primer Apellido *</label>
                                            <input type="text" className="form-control border-0 shadow-sm" name="formPrimerApModificar" defaultValue={miembroSeleccionado?.primer_apellido} required />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label small text-muted fw-bold">Segundo Apellido</label>
                                            <input type="text" className="form-control border-0 shadow-sm" name="formSegundoApModificar" defaultValue={miembroSeleccionado?.segundo_apellido} />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label small text-muted fw-bold">Teléfono *</label>
                                            <input type="tel" className="form-control border-0 shadow-sm" name="formTelefonoModificar" defaultValue={miembroSeleccionado?.telefono} required />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label small text-muted fw-bold">Correo Electrónico *</label>
                                            <input type="email" className="form-control border-0 shadow-sm" name="formEmailModificar" defaultValue={miembroSeleccionado?.email} required />
                                        </div>

                                        <hr className="my-3 text-muted" />
                                        <h6 className="text-secondary fw-bold mb-0">Dirección Domiciliaria</h6>

                                        <div className="col-md-3">
                                            <label className="form-label small text-muted fw-bold">Número de Casa *</label>
                                            <input type="number" className="form-control border-0 shadow-sm" name="formNumCasaModificar" defaultValue={miembroSeleccionado?.numero_casa} required />
                                        </div>
                                        <div className="col-md-5">
                                            <label className="form-label small text-muted fw-bold">Calle *</label>
                                            <input type="text" className="form-control border-0 shadow-sm" name="formCalleModificar" defaultValue={miembroSeleccionado?.calle} required />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label small text-muted fw-bold">Colonia *</label>
                                            <input type="text" className="form-control border-0 shadow-sm" name="formColoniaModificar" defaultValue={miembroSeleccionado?.colonia} required />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label small text-muted fw-bold">Código Postal *</label>
                                            <input type="text" className="form-control border-0 shadow-sm" name="formCPModificar" defaultValue={miembroSeleccionado?.cp} required />
                                        </div>

                                        <hr className="my-3 text-muted" />
                                        <h6 className="text-secondary fw-bold mb-0">Estado de Membresía</h6>

                                        <div className="col-md-6">
                                            <label className="form-label small text-muted fw-bold">Estado *</label>
                                            <select
                                                className="form-select border-0 shadow-sm"
                                                name="formEstadoMembresiaModificar"
                                                value={estadoMembresiaModificar}
                                                onChange={(e) => setEstadoMembresiaModificar(e.target.value)}
                                            >
                                                <option value="Sin pagar">Sin pagar</option>
                                                <option value="Pagada">Pagada</option>
                                                <option value="Financiada">Financiada</option>
                                            </select>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label small text-muted fw-bold">Fecha de Pago</label>
                                            <input
                                                type="date"
                                                className="form-control border-0 shadow-sm"
                                                name="formFechaPagoModificar"
                                                readOnly={estadoMembresiaModificar !== 'Pagada'}
                                                value={estadoMembresiaModificar !== 'Pagada' ? '' : fechaPagoModificar}
                                                onChange={(e) => setFechaPagoModificar(e.target.value)}
                                            />
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
                    MODAL: DETALLE MIEMBRO 
                ========================================== */}
                <div className="modal fade" id="modalDetalleMiembro" tabIndex={-1} aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content border-0 shadow-lg">
                            <div className="modal-header bg-info text-white border-0">
                                <h5 className="modal-title fw-bold">
                                    <i className="fa-solid fa-address-card me-2"></i> Información Detallada
                                </h5>
                                <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body p-4 bg-light">
                                <div className="row g-3">
                                    <div className="col-md-4">
                                        <label className="form-label small text-muted fw-bold">Nombre</label>
                                        <input type="text" className="form-control-plaintext bg-white px-3 py-2 rounded shadow-sm" value={miembroSeleccionado?.nombre || ''} readOnly />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label small text-muted fw-bold">Primer Apellido</label>
                                        <input type="text" className="form-control-plaintext bg-white px-3 py-2 rounded shadow-sm" value={miembroSeleccionado?.primer_apellido || ''} readOnly />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label small text-muted fw-bold">Segundo Apellido</label>
                                        <input type="text" className="form-control-plaintext bg-white px-3 py-2 rounded shadow-sm" value={miembroSeleccionado?.segundo_apellido || ''} readOnly />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label small text-muted fw-bold">Teléfono</label>
                                        <input type="text" className="form-control-plaintext bg-white px-3 py-2 rounded shadow-sm" value={miembroSeleccionado?.telefono || ''} readOnly />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label small text-muted fw-bold">Correo Electrónico</label>
                                        <input type="text" className="form-control-plaintext bg-white px-3 py-2 rounded shadow-sm" value={miembroSeleccionado?.email || ''} readOnly />
                                    </div>
                                    <div className="col-md-3">
                                        <label className="form-label small text-muted fw-bold">Número de Casa</label>
                                        <input type="text" className="form-control-plaintext bg-white px-3 py-2 rounded shadow-sm" value={miembroSeleccionado?.numero_casa || ''} readOnly />
                                    </div>
                                    <div className="col-md-5">
                                        <label className="form-label small text-muted fw-bold">Calle</label>
                                        <input type="text" className="form-control-plaintext bg-white px-3 py-2 rounded shadow-sm" value={miembroSeleccionado?.calle || ''} readOnly />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label small text-muted fw-bold">Colonia</label>
                                        <input type="text" className="form-control-plaintext bg-white px-3 py-2 rounded shadow-sm" value={miembroSeleccionado?.colonia || ''} readOnly />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label small text-muted fw-bold">Código Postal</label>
                                        <input type="text" className="form-control-plaintext bg-white px-3 py-2 rounded shadow-sm" value={miembroSeleccionado?.cp || ''} readOnly />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label small text-muted fw-bold">Estado de Membresía</label>
                                        <input type="text" className="form-control-plaintext bg-white px-3 py-2 rounded shadow-sm" value={miembroSeleccionado?.estado_membresia || ''} readOnly />
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
                <div className="modal fade" id="modalEliminarMiembro" tabIndex={-1} aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered modal-sm">
                        <div className="modal-content border-0 shadow-lg">
                            <div className="modal-header bg-danger text-white border-0">
                                <h5 className="modal-title fw-bold">atencion!</h5>
                                <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body text-center p-4">
                                <i className="fa-solid fa-triangle-exclamation text-danger fa-3x mb-3"></i>
                                <p className="mb-0 text-dark">Estas seguro de que deseas eliminar a este miembro?</p>
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