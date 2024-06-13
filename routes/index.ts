import express from 'express';
import { authRoutes } from './auth';
import { clinicRoutes } from './clinics';

export const routes = express.Router()

routes.use('/auth', authRoutes)

routes.use('/clinics', clinicRoutes)