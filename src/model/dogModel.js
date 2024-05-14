"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var dogSchema = new mongoose_1.Schema({
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    weight: { type: Number, required: true },
    age: { type: Number, required: true }
});
// Define Dog Model
var Dog = mongoose_1.default.model('Dog', dogSchema);
exports.default = Dog;
