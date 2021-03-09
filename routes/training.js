var express = require('express');
var router = express.Router();

// LOAD MODELS
const models = require('../models');
const Attribute = models.Attribute;
const Training = models.Training;

// SHOW TRAINING
router.get('/', async (req, res) => {
    // mengambil data attribute dari database
    const attributes = await Attribute.findAll({raw: true});

    const trainings = await Training.findAll({raw: true});

    let data_training = []

    if (trainings.length) {
        data_training = JSON.parse(trainings[0].data)
    }

    // routing ke halaman
    res.render('training', {
        app_name : process.env.APP_NAME,
        title : 'Data Traning', 
        attribute : attributes,
        training : data_training});
});

// ADD TRAINING
router.get('/add', async (req, res) =>{
    const attributes = await Attribute.findAll({raw: true});

    // routing ke halaman
    res.render('training_add', {
        app_name : process.env.APP_NAME,
        title : 'Tambah Data Traning',
        attribute : attributes});
});

// ADD TRAINING SUBMIT
router.post('/add/submit', async (req, res) =>{
    const attributes = await Attribute.findAll({raw: true});
    const trainings = await Training.findAll({raw: true});

    if (trainings.length) {

        const training = await Training.findOne({where: {id: trainings[0].id}});

        const data_training = JSON.parse(training.data)

        var new_training = []
    
        attributes.forEach((element) => {
            new_training.push(req.body[`attribute_${element.name}`])
        });

        data_training.push(new_training)

        training.data = JSON.stringify(data_training)

        await training.save();

    } else {
        var new_training = []

        attributes.forEach((element) => {
            new_training.push(req.body[`attribute_${element.name}`])
        });

        await Training.create({ 
            data : JSON.stringify([new_training])
         });
    }


    return res.redirect('/training');
});

// EDIT TRAINING
router.get('/:id/edit', async (req, res) =>{
    const attributes = await Attribute.findAll({raw: true});
    const trainings = await Training.findAll({raw: true});
    const training = await Training.findOne({where: {id: trainings[0].id}});

    const data_training = JSON.parse(training.data)[req.params.id];

    // routing ke halaman
    res.render('training_edit', {
        app_name : process.env.APP_NAME,
        title : 'Edit Data Traning',
        attribute : attributes,
        training_id : req.params.id,
        training : data_training});
});

// EDIT TRAINING
router.post('/edit/submit', async (req, res) =>{
    const attributes = await Attribute.findAll({raw: true});
    const trainings = await Training.findAll({raw: true});

    const training = await Training.findOne({where: {id: trainings[0].id}});

    const data_training = JSON.parse(training.data)

    var new_training = []

    attributes.forEach((element) => {
        new_training.push(req.body[`attribute_${element.name}`])
    });


    data_training[parseInt(req.body.training_id)] = new_training

    training.data = JSON.stringify(data_training)

    await training.save()

    return res.redirect('/training');
});

// DELETE ATTRIBUTE
router.get('/:id/delete', async (req, res) => {

    const trainings = await Training.findAll({raw: true});

    const training = await Training.findOne({where: {id: trainings[0].id}});

    const data_training = JSON.parse(training.data)

    if (data_training.length > 1) {

        const index = parseInt(req.params.id)

        const index_start = index
        const delete_count = 1

        data_training.splice(index_start,delete_count)

        training.data = JSON.stringify(data_training)
    
        await training.save()
    
        return res.redirect('/training');
    } else {

        await Training.destroy({where: {id: trainings[0].id}})
        
        return res.redirect('/training');
    }

    
  })

module.exports = router;
