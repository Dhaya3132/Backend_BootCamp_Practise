const fs = require('fs');

const toursData = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, 'utf-8'));

exports.checkIdExist = (req, res, next, value) => {
    if(req.params?.id > toursData?.length){
        return res.status(404)?.json({
            "status": "UnExpected Error due to invalid ID",
            "errorMessage": "Invalid ID"
        })
    }
    next();
}

exports.getAllTour = (req, res) => {
    res.status(200).json({
        status: 200,
        requestedAt: req.requestTime,
        result: toursData?.length,
        data: {
            toursData
        }
    })
};

exports.getTour = (req, res) => {      
    const tours = toursData?.find(data => data?.id == Number(req.params?.id));      
    res.status(200)?.json({
        "Status":"Successfull",
        "data": {
            tours
        }
    })

};

exports.updateTour = (req, res) => {
    const toursIndex = toursData?.findIndex(data => data?.id == Number(req.params.id));
    toursData[toursIndex] = {
        ...toursData[toursIndex],
        ...req.body
    }
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(toursData), err => {

        if(err){
            return  res.status(400).json({
                "status": "Un Successfull",
                "data": {
                    "message": "Error Occured",
                }
            })
        }

        res.status(201).json({
            "status": "Successfull",
            "data": {
                "message": "Your data has updated",
            }
        })
    })

}

exports.deleteTour = (req, res) => {
    let id = req.params.id * 1;
    const newTourData = toursData?.filter(data => data?.id !== id);
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(newTourData), err => {
        // errorThrowingandHandling
        if(err){
            res.status(400).json({
                "status": 'Error cccured while the saving the data',
                "data":{
                    "message":"Error in deleting data, Please try again."
                }
            })
        }
      // resThrowing
        res.status(201).json({
            "status": "Successfull",
            "message": "Your data has been deleted",
        })

    });


}

exports.createTour = (req, res) => {
    
    let bodyData = req.body;

    console.log('Body Data', bodyData);

    const newId = toursData[toursData.length - 1]?.id + 1;
    const newToursData = Object.assign({id: newId}, bodyData);

    toursData.push(newToursData);

    // updateOnTheFileDirectlyToGetTheNewResultData
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(toursData), err => {

        // errorThrowingandHandling
        if(err){

            res.status(400).json({
                "status": 'Error cccured while the saving the data',
                "data":{
                    "message":"Error in saving data, Please try again."
                }
            })

        }

        // resThrowing
        res.status(201).json({
            "status": "Successfull",
            "message": "New tours has been created",
            "data": {
                newToursData
            }
        })

    });

}   