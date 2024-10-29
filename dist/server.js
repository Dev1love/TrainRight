"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_1 = require("./app");
const database_1 = require("./config/database");
const PORT = process.env.PORT || 3000;
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Initialize TypeORM connection
            yield database_1.AppDataSource.initialize();
            console.log('Database connection established');
            // Start Express server
            app_1.app.listen(PORT, () => {
                console.log(`Server is running on port ${PORT}`);
                console.log(`API Documentation available at http://localhost:${PORT}/api-docs`);
            });
        }
        catch (error) {
            console.error('Error starting server:', error);
            if (error instanceof Error && 'code' in error && error.code === 'ECONNREFUSED') {
                console.error('Make sure PostgreSQL is running and credentials are correct');
                console.error('Check your database connection settings in .env file');
            }
            process.exit(1);
        }
    });
}
startServer();
