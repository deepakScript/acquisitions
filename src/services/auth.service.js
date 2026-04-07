import logger from '#config/logger.js';
import bcrypt from 'bcrypt';
import db from '#config/database.js';
import { users } from '#models/user.model.js';
export const hashPassword = async (password) => {
    try {
        return await bcrypt.hash(password, 10);

    } catch (error) {
        logger.error('Error hashing password', { error });
        throw new Error('Error hashing password', { cause: error });
    }
};

export const createUser = async ({ name, email, password, role= 'user' }) => {
    try {
        const  existsUser = await existUserByEmail(email);
        if(existsUser) {
            throw new Error(' User with this email already exists');
        }
        const password_hash = await hashPassword(password);

        const [newUser] = await db.insert(users).values({
            name,
            email,
            password_hash,
            role
        }).returning({id: users.id, name: users.name, email: users.email, role: users.role, created_at: users.created_at});
        logger.info('User created successfully', { user: newUser });
        return newUser;
    } catch (error) {
        logger.error('Error creating user', { error });
        throw new Error('Error creating user', { cause: error });
    }
};

export const existUserByEmail = async (email) => {
    try {
        const result = await db.select().from(users).where({ email }).limit(1);
        logger.info('User existence checked', { email, exists: !!result });
        return !!result;
    } catch (error) {
        logger.error('Error checking user existence by email', { error });
        throw new Error('Error checking user existence by email', { cause: error });
    }
};
