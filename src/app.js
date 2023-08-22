import express from 'express';
import { Server } from 'socket.io';
import { config } from './config/config.js';
import { connectDB } from './config/dbConnection.js';
import { __dirname } from './utils.js';
import path from 'path';
import { router as viewsRouter } from './routes/views.routes.js';
import { sessionsRouter } from './routes/sessions.routes.js';
import productRoutes from './routes/products.routes.js';
import cartsRouter from './routes/carts.routes.js';
import handlebars from 'express-handlebars';
import { chatModel } from './dao/models/chat.model.js';
import session from 'express-session';
import MongoStore from 'connect-mongo';


// Inicialización de la aplicación express
const app = express();
// Definición del puerto en el que se ejecutará la aplicación
const port = config.server.port;

// Configuración de los archivos estáticos en el directorio 'public'
app.use(express.static(path.join(__dirname, '/public')));

// Middleware para el manejo de solicitudes con cuerpo en formato JSON
app.use(express.json());
// Middleware para el manejo de solicitudes con cuerpo en formato urlencoded
app.use(express.urlencoded({ extended: true }));

// Configuración de la sesión
app.use(session({
    store: MongoStore.create({ 
        ttl: 60,
        mongoUrl: config.mongo.url
     }),
    secret: config.server.secretSession,
    resave: true,
    saveUninitialized: true
}));

// Definición de las rutas para los productos y carritos
app.use('/api/products', productRoutes);
app.use('/api/carts', cartsRouter);

// Inicialización del servidor HTTP
const httpServer = app.listen(port, () => console.log(`Server started on port ${port}`));

//Conexión a la Base de Datos
connectDB();

// Configuración del motor de plantillas Handlebars
app.engine('.hbs', handlebars.engine({ extname: '.hbs' }));
app.set('view engine', '.hbs');
// Definición del directorio de las vistas
app.set('views', path.join(__dirname, '/views'));

// Inicialización del servidor Socket.io para permitir la comunicación en tiempo real
export const io = new Server(httpServer);

// Registro del evento de conexión para Socket.io
io.on('connection', (socket) => {
    console.log(`Cliente conectado: ${socket.id}`)

    // Escucha el evento de autenticación y emite el historial de mensajes
    socket.on("authenticated", async (msg) => {
        const messages = await chatModel.find();
        socket.emit("messageHistory", messages);
        socket.broadcast.emit("newUser", msg);
    })

    //Recibe un mensaje y lo emite a todos los clientes
    socket.on("message", async (data) => {
        console.log("data", data);
        const messageCreated = await chatModel.create(data);
        const messages = await chatModel.find();
        io.emit("messageHistory", messages);
    })
});

// Definición de las rutas para las vistas
app.use(viewsRouter);

// Definición de la ruta para las sesiones
app.use('/api/sessions', sessionsRouter);
