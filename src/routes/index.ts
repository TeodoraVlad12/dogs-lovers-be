import express from 'express';
import { defaultRoute } from './defaultRoute';
import { calcRoute } from './calcRoute';
import bodyParser from 'body-parser';
import dogsRoutes from "./dogsRoutes";

export const routes = express.Router();

routes.use(defaultRoute);
//routes.use(calcRoute);
routes.use(dogsRoutes);