var express = require('express');
var router = express.Router();

// LOAD MODELS
const models = require('../models');
const Attribute = models.Attribute;

// SHOW ATRIBUTES
router.get('/', async (req, res) => {
    // mengambil data attribute dari database
    const attributes = await Attribute.findAll({raw: true});

    attributes.forEach(element => {
        element.editmode = false
    });

    // routing ke halaman
    res.render('attributes', {
        app_name : process.env.APP_NAME,
        title : 'Data Atribut', 
        attribute : attributes});
});

// ADD ATRIBUTES
router.post('/add', async (req, res) =>{
    const attributes = await Attribute.findAll();

    if (attributes.some((x) => x.name === req.body.name.toUpperCase())) {
        return res.redirect('/attributes');
    } else {
        await Attribute.create({ 
            name : req.body.name.toUpperCase()
         });
    
         return res.redirect('/attributes');
    }
});

// EDIT ATRIBUTE
router.post('/:id/edit', async (req, res) =>{
    // mengambil data attribute dari database
    const attributes = await Attribute.findAll({raw: true});

    const attribute = await Attribute.findOne({where: {id: req.params.id}});

    // routing ke halaman
    res.render('attributes_edit', {
        app_name : process.env.APP_NAME,
        title : 'Edit Atribut', 
        attributes : attributes,
        attribute : attribute
    });
});

// EDIT ATRIBUTE
router.post('/:id/edit/submit', async (req, res) =>{
    const attribute = await Attribute.findOne({where: {id: req.params.id}});

    attribute.name = req.body.name.toUpperCase();

    await attribute.save();

    return res.redirect('/attributes');
});

// DELETE ATTRIBUTE
router.delete('/:id/delete', async (req, res) => {
    
    await Attribute.destroy({where: {id: parseInt(req.params.id)}})
    
    res.end()
  })

module.exports = router;
