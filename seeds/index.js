const mongoose = require('mongoose');
const Campground = require('../models/campground');      // Require model Campground which we exported
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');

mongoose.set('strictQuery', true);
main().catch(err => console.log(err));


async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');

    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}


// CHECK - SUCCESS or ERROR

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
    console.log("Database Connected");
})


const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '63d365c7a376875b32c50b72',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            images: [
                {
                    url: 'https://res.cloudinary.com/dovl6cxrw/image/upload/v1675682038/YelpCamp/lqvl0l8fngot916ysi30.png',
                    filename: 'YelpCamp/lqvl0l8fngot916ysi30'
                }
            ],
            // image: "https://source.unsplash.com/collection/11989308",
            //image: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHwxMTk4OTMwOHx8fHx8fHwxNjczNDUyMjA0&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080',
            price: price,
            description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Reiciendis, numquam? Quo nisi voluptatum consequatur ducimus nemo exercitationem nobis ex modi. Nesciunt a minima necessitatibus sequi deleniti aperiam ut adipisci atque?'
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})