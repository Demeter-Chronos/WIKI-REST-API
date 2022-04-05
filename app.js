const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs')
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static('public'));

mongoose.connect('mongodb://localhost:27017/wikiDB');

const articleSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Article = new mongoose.model('article', articleSchema);

app.route('.articles')
.get((req, res) => {
    Article.find({}, (err, foundArticles) => {
        if (!err) {
            res.send(foundArticles);
        } else{
            res.send(err);
        }
    });
})
.post((req, res) => {
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });

    newArticle.save((err) => {
        if (!err) {
            res.send('Successfully added a new article');
        } else {
            res.send(err);
        }
    });
})
.delete((req, res) => {
    Article.deleteMany((err) => {
        if (!err) {
            res.send('Successfully deleted all articles');
        } else {
            res.send(err);
        }
    });
});

//Requests targeting specific articles

app.route('/articles/:articleTitle')
.get((req, res) => {
    Article.findOne({title: req.params.articleTitle}, (err, foundArticle) => {
        if (foundArticle) {
            res.send(foundArticle);
        } else {
            res.send('No article matching that title was found');
        }
    });
})
.put((req, res) => {
    Article.updateOne(
        {title: req.params.articleTitle},
        {title: req.body.title, content: req.body.content},
        (err) => {
            if (!err) {
                res.send('Successfully updated article');
            }
        }
    );
})//Read up on put and patch whenever you want to use it
.delete((req, res) => {
    Article.deleteOne({title: req.params.articleTitle}, (err) => {
        if (!err) {
            res.send('Sucessfully deleted the document');
        } else {
            res.send(err);
        }
    });
});






































// app.get('/articles', (req, res) => {
//     Article.find({}, (err, foundArticles) => {
//         if (!err) {
//             res.send(foundArticles);
//         } else{
//             res.send(err);
//         }
//     });
// });

// app.post('/articles', (req, res) => {
//     console.log(req.body.title);
//     console.log(req.body.content);

//     const newArticle = new Article({
//         title: req.body.title,
//         content: req.body.content
//     });

//     newArticle.save((err) => {
//         if (!err) {
//             res.send('Successfully added a new article');
//         } else {
//             res.send(err);
//         }
//     });
// });

// app.delete('/articles', (req,res) => {
//     Article.deleteMany((err) => {
//         if (!err) {
//             res.send('Successfully deleted all articles');
//         } else {
//             res.send(err);
//         }
//     })
// });


app.listen(3000, () => {
    console.log('Server is listening on port 3000...');
});