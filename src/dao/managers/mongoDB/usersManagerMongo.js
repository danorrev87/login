import { usersModel } from "../../models/users.model.js";

export class UsersManagerMongo {
    constructor() {
        this.model = usersModel;
    };

    async save(user) {
        try {
            const userCreated = await this.model.create(user);
            return userCreated;
        } catch (error) {
            throw error;
        }
    };

    async getByID(userId) {
        try {
            const user = await this.model.findById(userId);
            if (!user) {
                throw new Error("Usuario no encontrado");
            }
            return user;
        } catch (error) {
            throw error;
        }
    };

    async getByEmail(email) {
        try {
            const user = await this.model.findOne({ email:email });
            if (!user) {
                console.error("Usuario no encontrado");
            }
            return user;
        } catch (error) {
            throw error;
        }
    };
};