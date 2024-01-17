const express = require('express');
const router = express.Router();
const post = require('../models/post');

// routes
router.get('',async (req, res) => {
    try {
        const locals = {
            title: "Nodejs Blog",
            description: "Simple blog created with nodejs, express and mongodb"
        }
    let = perPage = 10;
    let page = req.query.page || 1;

    const data = await post.aggregate([{ $sort: { createdAt: -1 }}])
    .skip(perPage * page - perPage)
    .limit(perPage)
    .exec();

    const count = await post.count();
    const nextPage = parseInt(page) + 1;
    const hashNextPage = nextPage <= Math.ceil(count / perPage);

    res.render('index', { 
        locals,
        data,
        current: page,
        nextPage: hashNextPage ? nextPage : null,
        currentRoute: '/'
        }); 
    } catch(error) {
    console.log(error);
     }

}); 

// Get
// Post:id
router.get('/post/:id', async (req, res) => {
    try {
        let slug = req.params.id; 

        const data = await post.findById({ _id: slug });

        const locals = {
            title: data.title,
            description: "Simple blog created with nodejs, express & mongodb."
        }

        res.render('post', { locals, data, currentRoute: `/post/${slug}`});
    } catch(error) {
        console.log(error);
    }
});

// Post
// Post - searchTerm

router.post('/search', async (req, res) => {
    try {
        const locals = {
            title: "NodeJs Blog",
            description: "Simple blog created with nodejs, express & mongodb."
        }

        let searchTerm = req.body.searchTerm;

        // Hilangkan karakter spesial dan ubah menjadi spasi
        const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, " ");

        // Pisahkan kata-kata
        const searchTermsArray = searchNoSpecialChar.split(/\s+/);

        // Buat daftar ekspresi reguler untuk setiap kata
        const regexExpressions = searchTermsArray.map(term => new RegExp(term, 'i'));

        const data = await post.find({
            $or: [
                { title: { $in: regexExpressions }},
                { body: { $in: regexExpressions }}
            ]
        });

        res.render("search", {
            data,
            locals
        });

    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
});

router.get('/about', (req, res) => {
    res.render('about', {
    currentRoute: '/about'
    });
});


module.exports = router;

// Get
// Post:id
// router.get('', async(req, res) => {
//     const locals = {
//         title: "NodeJs Blog",
//         description: "Simple blog created with nodejs, express & mongodb."
//     }
//     try {
//         const data = await Post.find();
//         res.render('index', { locals, data });
//     } catch(error) {
//         console.log(error);
//     }
// });

// function insertpostData () {
//     post.insertMany([
//                 {
//                     title: "Node Js",
//                     body: "How to use Node Js"
//                 },

//                 {
//                     title: "Learn the basic of Mongodb",
//                     body: "This is how to use Mongodb"
//                 },

//                 {
//                     title: "Basic of HTML",
//                     body: "This is how to use HTML"
//                 },

//                 {
//                     title: "Learn the basic of CSS",
//                     body: "This is how to use CSS"
//                 },
//                 {
//                     title: "Discover how to use Express.js",
//                     body: "Discover how to use Express.js, a popular Node.js web framework, to build web applications"
//                 },
//                 {
//                     title: "Asynchronus Programming with Node.js",
//                     body: "Asynchronus Programming with Node.js: Explore the asynchronous nature of Node.js and how it allows for-"
//                 },
//                 {
//                     title: "Learn the basics of Node.js and its architecture",
//                     body: "Learn the basics of Node.js and its architecture, how it works, and why it is popular among developers."
//                 },
//                 {
//                     title: "Learn Morgan - HTTP Request logger for NodeJs",
//                     body: "Learn Morgan."
//                 }
        
        
        
        
        
//             ])
//             .then(() => {
//                console.log("Data inserted");
//             }).catch((err) => {
//                console.log(err);
//             });
//          }
// insertpostData();
