class EventObserver {
    constructor() {
        this.listeners = {};
    }

    subscribe(evento, callback) {
        if (!this.listeners[evento]) {
            this.listeners[evento] = [];
        }
        this.listeners[evento].push(callback);
    }

    notify(evento, datos) {
        const suscriptores = this.listeners[evento] || [];
        suscriptores.forEach(callback => {
            try {
                callback(datos);
            } catch (error) {
                console.error(`Error en observer de '${evento}':`, error.message);
            }
        });
    }
}

export const observer = new EventObserver();
