import * as obrasService    from './obrasService';
import * as miembrosService from './miembrosService';
import * as boletosService  from './boletosService';
import * as finanzasService from './finanzasService';
import * as usuariosService from './usuariosService';

class AdminFacade {

    // OBRAS

    obtenerObras() {
        return obrasService.obtenerObras();
    }

    obtenerObraPorId(id) {
        return obrasService.obtenerObraPorId(id);
    }

    crearObra(formData) {
        return obrasService.crearObra(formData);
    }

    actualizarObra(datos) {
        return obrasService.actualizarObra(datos);
    }

    eliminarObra(id) {
        return obrasService.eliminarObra(id);
    }

    // MIEMBROS

    obtenerMiembros() {
        return miembrosService.obtenerMiembros();
    }

    obtenerMiembroPorId(id) {
        return miembrosService.obtenerMiembroPorId(id);
    }

    crearMiembro(formData) {
        return miembrosService.crearMiembro(formData);
    }

    actualizarMiembro(datos) {
        return miembrosService.actualizarMiembro(datos);
    }

    eliminarMiembro(id) {
        return miembrosService.eliminarMiembro(id);
    }

    // BOLETOS

    obtenerBoletos() {
        return boletosService.obtenerBoletos();
    }

    obtenerBoletoPorId(id) {
        return boletosService.obtenerBoletoPorId(id);
    }

    crearBoleto(formData) {
        return boletosService.crearBoleto(formData);
    }

    actualizarBoleto(datos) {
        return boletosService.actualizarBoleto(datos);
    }

    eliminarBoleto(id) {
        return boletosService.eliminarBoleto(id);
    }

    // FINANZAS

    obtenerFinanzas() {
        return finanzasService.obtenerFinanzas();
    }

    obtenerFinanzaPorId(id) {
        return finanzasService.obtenerFinanzaPorId(id);
    }

    crearFinanza(formData) {
        return finanzasService.crearFinanza(formData);
    }

    actualizarFinanza(datos) {
        return finanzasService.actualizarFinanza(datos);
    }

    eliminarFinanza(id) {
        return finanzasService.eliminarFinanza(id);
    }

    // USUARIOS

    obtenerUsuarios() {
        return usuariosService.obtenerUsuarios();
    }
}

export const adminFacade = new AdminFacade();
