export const config = {

    //Configuración del puerto local.
    server: {
        port: 8080,
        secretSession: 'secretSessionKey'
    },

    //Configuración de la base de datos con MongoDB Atlas. 
    mongo: {
        url: "mongodb+srv://avacaro:coder@coderbackend.rf7x0pq.mongodb.net/ecomerceDB?retryWrites=true&w=majority"
    }
}