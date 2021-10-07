const express = require('express');
const axios = require('axios')

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

var i = -1;
var parser = require('body-parser');
app.use(parser.json());
const api = [`http://localhost:5000/`, `http://localhost:5000/`, `http://localhost:5000/`, `http://localhost:5000/`, `http://localhost:5000/`, `http://localhost:5000/`, `http://localhost:5000/`, `http://localhost:5000/`];


app.set('port', 3000);

const redis = require('redis');
//const e = require('express');

const client = redis.createClient();

client.on('connect', () => {
  console.log('Connected!');
});
client.on('error', (err) => { console.log(err); });



app.get('/master', async (req, res) => {
        console.log(req.url)
      if (req.query.product_id === undefined) {
          req.query.product_id = req.headers.product_id;
      }
      client.get(req.query.product_id, (err, response) => {
        if (response !== null) {
            console.log('from cache')
          const parsedResponse = JSON.parse(response);
          res.send(parsedResponse);
        } else {
            i += 1;
            if (i === api.length) {
                i = 0
            }
            axios.get(api[i] + `master`,
            {params: {
                sort: req.query.sort,
                count: req.query.count,
                product_id: req.query.product_id
            }
            }).then((data) => {
                client.set(req.query.product_id, JSON.stringify(data.data))
                res.send(data.data)
            }).catch(err => {
                console.log(err)
            })
        }
    })
})
        
    app.put('/helpful', (req, res) => {

        client.flushall(function(err, success) {
                if (err) {
                    console.log(err)
                } else {
                    console.log(success)
                }
            })



        i += 1;
        if (i === api.length) {
            i = 0
        }
    axios.put(api[i] + 'helpful', {
        review_id: req.body.review_id
      }).then((results) => {
        res.sendStatus(201)
    }).catch((err) => {res.send(err)})

});

app.put('/report', (req, res) => {

    client.flushall(function(err, success) {
            if (err) {
                console.log(err)
            } else {
                console.log(success)
            }
        })

    i += 1;
    if (i === api.length) {
    i = 0
    }

    axios.put(api[i] + 'report', {
        review_id: req.body.review_id
      }).then((results) => {
        res.sendStatus(201)
    }).catch((err) => {res.send(err)})

});

app.post('/review', (req, res) => { 

    client.del(req.body.product_id, function(err, success) {
        if (err) {
            console.log(err)
        } else {
            console.log(success)
        }
    })

    i += 1;
    if (i === api.length) {
    i = 0
    }
    axios.post(api[i] + 'review', req.body).then((results) => {
        res.sendStatus(200)
    }).catch((err) => {res.send(err)})

});

if (!module.parent) {
    app.listen(app.get('port'));
    console.log('Listening on', app.get('port'));
  }

//   const helpOrReport = function (string, id) {
//       return new Promise ((resolve, reject) => {
//           let promiseArr = [];
//           for (let j = 0; j < api.length; j++) {
//               promiseArr.push(axios.put(api[j] + string, {
//               review_id: id
//             }))
//           } 
//           Promise.all(promiseArr).then((resultsArr) => {
//             resolve(resultsArr)
//         })
//       })
//   }

//   const reviewAll = function (obj) {
//     return new Promise ((resolve, reject) => {
//         let promiseArr = [];
//         for (let j = 0; j < api.length; j++) {
//             promiseArr.push(axios.post(api[j] + 'review', obj))
//         }
//         Promise.all(promiseArr).then((resultsArr) => {
//             resolve(resultsArr)
//         })
        
//     })
// }