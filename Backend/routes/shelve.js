const express = require("express");
const Router = express.Router();
const ShelveModel = require("../models/shelve")

router.post('/', async (req, res) => {
    const { userId, bookId, state } = req.body;
    try {
        const shelveDetails = await ShelveModel.updateOne({ book: bookId, user: userId }, { state: state }, { upsert: true, new: true });
        res.status(200).json(shelveDetails)
    } catch (err) {
        res.status(500).json(err);
    }
})