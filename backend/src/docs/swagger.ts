import swaggerUi from 'swagger-ui-express';
import YAML from "yamljs";
import { BASE_URL } from '../helpers/constants';

const swaggerDocument = YAML.load("./src/docs/openapi.yml");
console.log('DOC', swaggerDocument, BASE_URL);


export const swaggerDocs = (app: any) => {
    app.use(`${BASE_URL}/docs`, swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};