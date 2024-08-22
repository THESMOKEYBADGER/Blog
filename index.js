import express from "express";
import bodyParser from "body-parser";
import multer from "multer";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = 3000;
const app = express();
let posts = [];

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, 'uploads/'));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Save with unique name
    }
});

const upload = multer({ storage: storage });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve uploaded files

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get("/", (req, res) => {
    res.render("index", { posts: posts });
});

app.post("/post", upload.single('image'), (req, res) => {
    let post = {
        username: req.body["username"],
        postContent: req.body["content"],
        imageUrl: req.file ? `/uploads/${req.file.filename}` : null,
        timestamp: Date.now(),
        date: new Date().toLocaleDateString() // Save image URL if uploaded
    };
    posts.push(post);
    res.redirect("/");
});

app.get("/edit/:id", (req, res) => {
    const postId = req.params.id;
    res.render("edit", { post: posts[postId], postId: postId });
});

app.post("/update/:id", upload.single('image'), (req, res) => {
    const postId = req.params.id;
    posts[postId] = {
        username: req.body["username"],
        postContent: req.body["content"],
        imageUrl: req.file ? `/uploads/${req.file.filename}` : posts[postId].imageUrl,
        timestamp: Date.now(),
        date: new Date().toLocaleDateString() // Update image URL if new image is uploaded
    };
    res.redirect("/");
});

app.post("/delete/:id", (req, res) => {
    const postId = req.params.id;
    posts.splice(postId, 1);
    res.redirect("/");
});



app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
