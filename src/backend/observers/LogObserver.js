import { observer } from '../EventObserver';

function registrarEvento(info) {
    const tiempo = new Date();
    const idInfo = info.id !== undefined ? ` | ID: ${info.id}` : '';
    const datos = info.datos ? ` | Datos: ${JSON.stringify(info.datos)}` : '';

    console.log(
        `\n[OBSERVACION a: ${tiempo}` +
        `\nEntidad: ${info.entidad}` +
        `\nAccion: ${info.accion}${idInfo}${datos}\n`
    );
}

observer.subscribe('obra:crear', registrarEvento);
observer.subscribe('obra:actualizar', registrarEvento);
observer.subscribe('obra:eliminar', registrarEvento);

observer.subscribe('miembro:crear', registrarEvento);
observer.subscribe('miembro:actualizar', registrarEvento);
observer.subscribe('miembro:eliminar', registrarEvento);

// observer.subscribe('boleto:crear', registrarEvento);
// observer.subscribe('boleto:actualizar', registrarEvento);
// observer.subscribe('boleto:eliminar', registrarEvento);

// observer.subscribe('finanza:crear', registrarEvento);
// observer.subscribe('finanza:actualizar', registrarEvento);
// observer.subscribe('finanza:eliminar',registrarEvento);
