const data = require('./data');

const model = require('./model/model');

const AddToDataBase = async ()=>
{
    await model.create(data);
    console.log('Data Added Successfully');
}

AddToDataBase();
