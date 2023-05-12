const  model =  require('../model/model');

module.exports.getAllDataBase = async (req,res)=>
{
    // console.log('parms --------->>> '+req);
    
    let serchValue = '';   
        serchValue = req.params.serchValue;
  
    console.log(`Serch Value Received ${serchValue} in Controller Script`);

    let pageNum = parseInt(req.params.pageNum);
    const limit = parseInt(req.params.limit);
    ++pageNum;
    console.log('Req parms Received line 10 Controller.js pageNum:',pageNum,' limit:',limit);
    offset  = (pageNum -1) *limit;
    console.log('pageNum:',pageNum,' Offset:',offset);
    try 
    {    
        //getting offset for limit    
        let data;
        let count;
        if (serchValue !== 'null')
        {

            
            if (typeof serchValue === String )
            {

                data =  await model.find({
                    $or:[
                        { model: {$regex :serchValue, $options:'i'}},
                        { brand: {$regex :serchValue, $options:'i'}},
                        { price: {$regex :serchValue, $options:'i'}},
                    ]
                }).skip(offset).limit(limit);
            }
            else
            {
                serchValue = new RegExp(serchValue.toString(),'i');
                data = await model.find({
                $or:[
                    {model:serchValue},
                    {brand: serchValue},
                    {price: serchValue},
                ]

                }).skip(offset).limit(limit);
            }
            
         count =  data.length;

        }else
        {
            data =  await model.find().skip(offset).limit(limit);
            count = await model.count({});
        }

        console.log ('COunt is', data.length);

        let dataToReturn = {
            data: data,
            count: count,
        }
        
        res.status(200).json(dataToReturn);
    } 
    catch (error)
    {
        res.status(500).json(error);
    }
   
   
}