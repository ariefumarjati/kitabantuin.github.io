var express = require('express');
var router = express.Router();
var _ = require('lodash');

// LOAD MODELS
const models = require('../models');
const Attribute = models.Attribute;
const Training = models.Training;

// SHOW CALCULATE
router.get('/', async (req, res) => {
    // mengambil data dari database
    const attributes = await Attribute.findAll({raw: true});
    const trainings = await Training.findAll({raw: true});
    const training = await Training.findOne({where: {id: trainings[0].id}});

    // TRAINING DATA
    const data_training = JSON.parse(training.data)
    // menyediakan versi array of object dari data_traning agar mudah difilter
    const array_object = []
    data_training.forEach((item) => {
        array_object.push(Object.assign({}, item))
    })

    // MEMFILTER DATA TRAINING SESUAI DENGAN ATRIBUTNYA
    const calculated_data = []
    attributes.forEach((attribute, index) => {
        // mendeklarasi object
        const array_value = {
            name : attribute.name,
            calculate : [],
            data : []
        }

        // memfilter data
        data_training.forEach((value) => {
            array_value.data.push(value[index])
        })

        // memasukan data perhitungan ke array_value
        const uniq_value = _.uniq(array_value.data, true)
        const count_value = _.countBy(array_value.data)
        uniq_value.forEach((value_name) => {
            array_value.calculate.push({
                name : value_name,
                total : count_value[value_name],
                probability : count_value[value_name] / array_value.data.length
            })
        })
        
        
        // memasukan data ke object array_value
        calculated_data.push(array_value)
    })

    // MENGHITUNG PROBABLITAS NILAI HASIL
    const probability_of_outcome = []
    calculated_data.forEach((item, index) => {
        // menghitung probabilitas kemunculan nilai atribut dengan hasil
        if (index !== calculated_data.length-1) {

            item.calculate.forEach((atribut) => {

                calculated_data[calculated_data.length-1].calculate.forEach((outcome) => {

                    const jumlah = array_object.filter((x) => {
                        return x[index] === atribut.name && x[calculated_data.length-1] === outcome.name
                    }) 

                    const index_outcome =  _.findIndex(calculated_data[calculated_data.length-1].calculate, { 'name' : outcome.name})

                        probability_of_outcome.push({
                            atribute_name : item.name,
                            value_name : atribut.name,
                            outcome_name : outcome.name,
                            total : jumlah.length,
                            probability : jumlah.length/calculated_data[calculated_data.length-1].calculate[ index_outcome].total
                        })
                })

            })
        }
    })

    const request = ['rainy', 'hot', 'high', String('TRUE')]

    // MENGHITUNG DATA UJI
    const test_data = {
        detail : [],
        outcome : null
    }
    calculated_data[calculated_data.length-1].calculate.forEach((probability_outcome) => {

        const total_value_probabilitas = [probability_outcome.probability]

        
        request.forEach((test) => {

            const probability_of_outcome_item = probability_of_outcome.find((x) => x.value_name === test && x.outcome_name === probability_outcome.name)

            total_value_probabilitas.push(probability_of_outcome_item.probability)
        })

        function multiply(array) {
            var sum = 1;
            for (var i = 0; i < array.length; i++) {
                sum = sum * array[i];
            }
            return sum;
        }

        test_data.detail.push({
            name : probability_outcome.name,
            probability : total_value_probabilitas,
            total : multiply(total_value_probabilitas)
        })
    })

    test_data.outcome = test_data.detail.reduce((prev, current) => (prev.total > current.total) ? prev : current)


    res.json({
        value_attributes : calculated_data,
        naive_bayes_probability : probability_of_outcome,
        test_data : test_data
    })

    // res.render('training', {
    //     app_name : process.env.APP_NAME,
    //     title : 'Data Uji', 
    //     attribute : attributes,
    //     training : data_training});
    
});

module.exports = router;
