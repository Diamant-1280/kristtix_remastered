"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
require("module-alias/register");
const Client_1 = require("@classes/Client");
exports.client = new Client_1.ExtendedClient();
exports.client.start(process.env);
//# sourceMappingURL=index.js.map