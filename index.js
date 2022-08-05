const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
var router = express.Router();



var app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.json());
//app.listen(9001);

const cors = require('cors');
const { json } = require('express');
app.use(cors());
const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "db_bureaux"
});
//route pour la connexion
app.post('/user/login', function (req, res) {

    var username = req.body.username,
        password = req.body.password;
    console.log(req.body);

    if (!username || !password) {
        return res
            .status(400)
            .jsonp({
                error: "Needs a json body with { username: <username>, password: <password>}"
            });
    }
    con.query("SELECT * FROM users where mail=? AND password=?", [username, password], function (err, result) {
        if (err) {
            console.log(result);
            console.log(result.JSON);
            console.log(err.message);
            return res
                .status(401)
                .jsonp({
                    error: "Authentication failied.",
                });
        }
        else {
            if (result[0] != null) {
                console.log("ok");
                console.log(result);
                console.log(JSON.stringify(result));
                return res
                    //  .statusMessage='Login Successfully'
                    .status(200)

                    .jsonp({
                        loginStatus: true
                    });
            }
            else {
                console.log(" not ok");
                console.log(result);
                return res
                    .status(200)
                    .json({
                        loginStatus: false,
                    });
            }
        }
    });
})
//route pour l'enregistrement sur le site
app.post('/user/register', function (req, res) {
    var mail = req.body.mail,
        password = req.body.password;
    console.log(req.body);

    if (!mail || !password) {
        return res
            .status(400)
            .jsonp({
                error: "Needs a json body with { mail: <username>, password: <password>}"
            });
    }
    con.query("SELECT * FROM users where mail=?", mail, function (err, result) {
        if (err) {
            console.log(result);
            console.log(result.JSON);
            console.log(err.message);
            return res
                .status(401)
                .jsonp({
                    error: "Authentication failied.",
                });
        }
        // si le mail existe déjà dans la base
        if (result[0] != null) {
            console.log("mail existe déjà");
            console.log(result);
            console.log(JSON.stringify(result));
            return res
                .status(200)
                .jsonp({
                    registerStatus: false,
                    loginStatus: true
                });
        }
    else{
    //ajout de l'utilisateur dan la base
        console.log(req.body);
        var prenom = req.body.prenom,
            nom = req.body.nom,
            profession = req.body.profession,
            adresse = req.body.adresse,
            CodePostal = req.body.CodePostal,
            ville = req.body.ville,
            telephone = req.body.telephone,
            mail = req.body.mail,
            password = req.body.password;
        con.query("INSERT INTO  users SET ? ", {prenom:prenom,nom: nom,profession:profession,adresse:adresse,CP:CodePostal,ville:ville,telephone:telephone,mail: mail, password:password}, function (err, result) {
            if (err) {
                console.log(err.message);
                console.log(result);
                console.log(result.JSON);
                
                return res
                    .status(401)
                    .jsonp({
                        error: "Insertion base non réussie.",
                    });
            }
            else
            {
                return res
                    .status(200)
                    .jsonp({
                        registerStatus: true,
                    });
                }
        });
    }
})
});
//route pour l'enregistrement d'une réservation de créneau pour un bureau
app.post('/reservation', function (req, res) {
    console.log(req.body);
        //ajout de l'utilisateur dan la base
        console.log(req.body);
        var prenom = req.body.firstName,
            nom = req.body.lastName,
            numBureau = req.body.numBureau,
            date=req.body.date,
            heureDebut = req.body.heureDebut,
            heureFin = req.body.heureFin
          ;
        con.query("INSERT INTO  agendas SET ? ", {nomReservation: prenom+"  "+nom,numBureau:numBureau,dateReservation:date,heureDebut:heureDebut,heureFin:heureFin}, function (err, result) {
            if (err) {
                console.log(err.message);
                console.log(result);
                console.log(result.JSON);
                
                return res
                    .status(401)
                    .jsonp({
                        error: "Insertion base non réussie.",
                    });
            }
            else
            {
                return res
                    .status(200)
                    .jsonp({
                        registerStatus: true,
                    });
                }
            });
        }
    )
;

app.get('/reservation/list', function (req, res) {
    console.log("liste reservation");
  /*  con.connect(function (err) {
        if (err) {
            console.log(err.message);

            return res

                .status(400)
                .jsonp({
                    error: "Erreur connexion",
                });
            throw err
        };*/
        console.log("Connecté à la base de données MySQL!");
        con.query("SELECT * FROM agendas", function (err, result) {
            if (err) {
                return res
                    .status(401)
                    .jsonp({
                        error: "Erreur requete",
                    });
                throw err;

            }

            console.log(result);
            return res
                .status(200)
                .jsonp(
                    JSON.stringify(result));
        });
  //  });
});

app.get('/user/logout', function (req, res) {
        con.connect(function (req) {
            if (err) {

                return res

                    .status(200)
                    .jsonp({
                        error: "Erreur connexion",
                    });
                throw err
            };
            console.log("Connecté à la base de données MySQL!");
            con.query("SELECT * FROM users", function (err, result) {
                if (err) {
                    return res
                        .status(401)
                        .jsonp({
                            error: "Erreur requete",
                        });
                    throw err;

                }

                console.log(result);
                return res
                    .status(200)
                    .jsonp(
                        JSON.stringify(result));
            });

        });
    });



    // catch 404 and forward to error handler
    app.use(function (req, res, next) {
        /*var err = new Error('Not Found');
        err.status = 404;
        next(err);*/
        return res.status(404).json({
            success: false,
            message: "not found"
        });
    });

    if (app.get('env') === 'development') {
        app.use(function (err, req, res, next) {
            console.log(err);
            return res.status(err.status || 500).jsonp({
                success: false,
                "data": [{
                    message: err.message
                }]
            });
        });
    };


    var port = process.env.PORT || 9001;

    const server = app.listen(port, function () {
        console.log('Server up at http://localhost:' + port);
    });

    process.on('SIGTERM', () => {
        console.info('SIGTERM signal received.');
        console.log('Closing http server.');
        server.close(() => {
            console.log('Http server closed.');
        });
    });

    process.on('SIGINT', () => {
        console.info('SIGINT signal received.');
        console.log('Closing http server.');
        server.close(() => {
            console.log('Http server closed.');
        });
    });
