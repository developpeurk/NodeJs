import express, {Request, Response} from "express";
import mongoose, {mongo} from "mongoose";
import Book from "./model/book.model";
import bodyParser from "body-parser";
import cors from "cors";

//middelware
const app =express();
app.use(cors());
app.use(bodyParser.json());
const uri= "mongodb://localhost:27017/biblio";
mongoose.connect(uri, (err)=>{
   if(err) console.log(err);
   else console.log("Mongo Data base connected successfully");
});
app.get("/", (req: Request , resp: Response) =>{
        resp.send("Hello Express");
});
app.get("/books", (req: Request, res: Response)=>{
  Book.find((err, books) => {
             if(err) { res.status(500).send(err);}
             else { res.send(books);}
  })
});

app.get("/books/:id", (req: Request, res: Response)=>{
    Book.findById(req.params.id, (err, book)=> {
        if(err) { res.status(500).send(err);}
        else { res.send(book);}
    })
});

/*  Request HTTP GET http://localhost:8085/pbooks?page=1&size=5  */

app.get("/pbooks", (req: Request, res: Response)=>{
    let p:number = parseInt(req.query.page || 1);
    let size: number = parseInt(req.query.size || 5);
    Book.paginate({}, {page:p, limit: size}, function (err, result) {
        if(err) res.status(500).send(err);
        else res.send(result);
    });
});

/*  Request HTTP SEARCH http://localhost:8085/books-search?kw=J&Page=1&size=5  */

app.get("/books-search", (req: Request, res: Response)=>{
    let p:number = parseInt(req.query.page || 1);
    let size: number = parseInt(req.query.size || 100000);
    let keyword: string = req.query.kw || '';
    Book.paginate({title:{$regex:".*(?i)" + keyword + ".*"}}, {page:p, limit: size},  function (err, result){
        if(err) res.status(500).send(err);
        else res.send(result);
    });
});

app.post("/books", (req: Request, res: Response)=>{
   let book = new Book(req.body);
   book.save(err => {
       if(err) res.status(500).send(err);
       else res.send(book);
   })
});

app.put("/books/:id", (req: Request, res: Response)=> {
    Book.findByIdAndUpdate(req.params.id, req.body, (err, book) => {
        if(err) res.status(500).send(err);
        else {
            res.send("Book is updated successfully");
        }
     })

});

app.delete("/books/:id", (req: Request, res: Response)=> {
    Book.deleteOne({_id: req.params.id}, err => {
        if(err) res.status(500).send(err);
        else {
            res.send("Book is deleted successfully");
        }
    })

});
app.listen(8085, () =>{
     console.log("Serve started");
})
