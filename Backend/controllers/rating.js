const Rating = require('../models/ratings');
const User = require('../models/users');
const Store = require('../models/stores');

 exports.createRating = async (req, res) => {
    const { userId, storeId } = req.params;
    const { rating } = req.body;

    if (!rating || typeof rating !== 'number') {
        return res.status(400).json({ error: 'Rating must be a number.' });
    }

    try {
        const newRating = new Rating({ userId, storeId, rating });
        await newRating.save();

        res.status(201).json({ message: 'Rating submitted successfully.', userId, storeId, rating });
    } catch (error) {
        res.status(500).json({ error: 'Failed to submit rating.' });
    }
}

exports.getRatingsByStoreId = async (req, res) => {
    const { storeId } = req.params;

    try {
        const ratings = await Rating.find({ storeId }).populate('userId', 'username email');
        const averageRating = ratings.length > 0
            ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
            : 0;
        await Store.findByIdAndUpdate(
            storeId,
            { overallRating: averageRating },
            { new: true }
        );

        res.status(200).json({ ratings, averageRating });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch ratings.' });
    }
};

exports.editRatingByUserAndStore = async (req, res) => {
    const { userId, storeId } = req.params;
    const { rating } = req.body;

    if (rating === undefined || typeof rating !== 'number' || rating < 1 || rating > 5) {
        return res.status(400).json({ error: 'Rating must be a number between 1 and 5.' });
    }

    try {
        if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(storeId)) {
            return res.status(400).json({ error: 'Invalid userId or storeId.' });
        }

        await Rating.deleteMany({
            userId: mongoose.Types.ObjectId(userId),
            storeId: mongoose.Types.ObjectId(storeId)
        });

        const newRating = await Rating.create({
            userId: mongoose.Types.ObjectId(userId),
            storeId: mongoose.Types.ObjectId(storeId),
            rating
        });

        res.status(200).json({
            message: 'Rating saved successfully.',
            rating: newRating
        });

    } catch (error) {
        console.error('Error saving rating:', error);
        res.status(500).json({ error: 'Failed to save rating.' });
    }
};

exports.deleteRatingById = async (req, res) => {
    const { userId, storeId } = req.params;

    try {
        const deletedRating = await Rating.findOneAndDelete({ userId, storeId });
        if (!deletedRating) {
            return res.status(404).json({ error: 'Rating not found.' });
        }
        res.status(200).json({ message: 'Rating deleted successfully.' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete rating.' });
    }
};

exports.getUsersByStoreId = async (req, res) => {
    const { storeId } = req.params;

    try {
        const ratings = await Rating.find({ storeId }).select('userId -_id');
        const userIds = ratings.map(r => r.userId);


        const users = await User.find({ _id: { $in: userIds } }).select('-password');

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users.' });
    }
};

exports.getRatingByStoreIdAndUserId = async (req, res) => {
    const { storeId, userId } = req.params;
    try {
        const rating = await Rating.findOne({ storeId, userId });
        console.log(rating);
        if (!rating) {
            return res.status(405).json({ error: 'Rating not found.' });
        }
        res.status(200).json(rating);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch rating.' });
    }
};
