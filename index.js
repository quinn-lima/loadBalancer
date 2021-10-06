const express = require('express');
const axios = require('axios')

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

var i = -1;
var parser = require('body-parser');
app.use(parser.json());
const api = [`http://localhost:5000/`, `http://localhost:5000/`, `http://localhost:5000/`, `http://localhost:5000/`];


app.set('port', 3000);

app.get('/master', (req, res) => {
i += 1;
if (i === 4) {
    i = 0
}
    axios.get(api[i] + `master`,
    {params: {
        sort: req.query.sort,
        count: req.query.count,
        product_id: req.query.product_id
    }}
    ).then((data) => {
        res.send(data.data)
    }).catch(err => {
        console.log(err)
    })
})

app.put('/helpful', (req, res) => {
    // axios.put all 4 instances
    helpOrReport('helpful', req.body.review_id).then((arr) => {
        console.log('help array', arr) //if length is less then 4
    })
    res.send(201)

});

app.put('/report', (req, res) => {
    //axios.put all 4 instances
    helpOrReport('report', req.body.review_id).then((arr) => {
        console.log('arge', arr)
    })
});

app.post('/review', (req, res) => { 
    //axios post to all
    //find some way to catch errors
    console.log('req.body', req.body)

    reviewAll(req.body).then((arr) => {
        console.log('reviewArr', arr)
        res.send(200)
    })

});

if (!module.parent) {
    app.listen(app.get('port'));
    console.log('Listening on', app.get('port'));
  }

  const helpOrReport = function (string, id) {
      return new Promise ((resolve, reject) => {
          let promiseArr = [];
          for (let j = 0; j < 4; j++) {
              promiseArr.push(axios.put(api[j] + string, {
              review_id: id
            }))
          } 
          Promise.all(promiseArr).then((resultsArr) => {
            resolve(resultsArr)
        })
      })
  }

  const reviewAll = function (obj) {
    return new Promise ((resolve, reject) => {
        let promiseArr = [];
        for (let j = 0; j < 4; j++) {
            promiseArr.push(axios.post(api[j] + 'review', obj))
        }
        Promise.all(promiseArr).then((resultsArr) => {
            resolve(resultsArr)
        })
        
    })
}