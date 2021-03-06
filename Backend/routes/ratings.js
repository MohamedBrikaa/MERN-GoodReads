const express = require('express');
const router = express.Router();
const RatingModel = require('../models/rating');
const BookModel = require('../models/book')
const { separateToken} = require('../middlewares/users')

router.post('/:token', async (req, res) => {
    const token = JSON.parse(req.params.token);
    const separtedInfo = separateToken(token);  
    const userId = separtedInfo.id;  
    const { bookId, value } = req.body;
    try {
        const rating = await RatingModel.updateOne({ book: bookId, user: userId }, { value: value }, { upsert: true, new: true });
        const ratingDetails = await RatingModel.getRatingDetails(bookId)
        await BookModel.updateOne({ _id: bookId }, ratingDetails, { new: true }).populate('category').populate('author')
        res.status(200).json(rating)
    } catch (err) {
        res.status(500).json(err);
    }
})

router.get('/', async (req, res) => {
    console.log("Get All Ratings");
    try {
        const ratings = await RatingModel.find({})
        res.json(ratings)
    } catch (err) {
        console.log(err);
        res.status(500).json(err)
    }
})

router.get('/:token/:bookID', async (req, res) => {
    console.log("Get User Rating");
    try {     const token= JSON.parse(req.params.token);
        const separtedInfo = separateToken(token);  
        const userId=separtedInfo.id;  
        const bookId= req.params.bookID
        const ratings = await RatingModel.findOne({user:userId,book:bookId})
        console.log(ratings)
        res.json(ratings)
    } catch (err) {
        console.log(err);
        res.status(500).json(err)
    }
})

router.get('/', async (req, res) => {
    console.log("Get all Ratings");
    
    try {     
        const rating = await RatingModel.find()
        console.log(rating)
        res.json(rating)
    } catch (err) {
        console.log(err);
        res.status(500).json(err)
    }
})

module.exports = router