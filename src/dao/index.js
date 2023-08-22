import { CartManagerMongo } from '../dao/managers/mongoDB/cartManagerMongo.js'
import { ProductManagerMongo } from './managers/mongoDB/productManagerMongo.js'
import { UsersManagerMongo } from './managers/mongoDB/usersManagerMongo.js';

const productService = new ProductManagerMongo();
const cartService = new CartManagerMongo();
const usersService = new UsersManagerMongo();


export { productService, cartService, usersService}

