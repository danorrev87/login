// Importamos el módulo 'path' de Node.js, el cual proporciona utilidades para trabajar con rutas de archivos y directorios.
import path from 'path';

// Importamos 'fileURLToPath' de 'url' que proporciona utilidades para manipulación de URLs.
// En este caso, 'fileURLToPath' se utiliza para convertir una URL en una ruta de archivo del sistema.
import { fileURLToPath } from 'url';

// Aquí, estamos utilizando la función 'dirname' del módulo 'path' para obtener el nombre del directorio del archivo actual.
// 'fileURLToPath' se usa para convertir 'import.meta.url' (la URL del archivo actual) en una ruta de archivo del sistema.
// El resultado se exporta como '__dirname', que es una convención común en Node.js para representar la ruta del directorio del archivo actual.
export const __dirname = path.dirname(fileURLToPath(import.meta.url));
