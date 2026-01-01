// Importing Packages
const express = require('express');
const fs = require('fs');
const morgan = require('morgan');

// Configuration
const app = express();
const PORT = 3002;

// MiddleWares
app.use(morgan('dev'));
app.use(express.json());

// File Data
const toursData = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`, 'utf-8'));

// middleWares
app.use((req, res, next) => {
    console.log('Iam from middleware 1');
    next();
});

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
})

// getAllTour
const getAllTour = (req, res) => {
    res.status(200).json({
        status: 200,
        requestedAt: req.requestTime,
        result: toursData?.length,
        data: {
            toursData
        }
    })
};

// getTour
const getTour = (req, res) => {
        
    const tours = toursData?.find(data => data?.id == Number(req.params?.id));      

    if(Number(req.params) > toursData?.length){
        res.status(404)?.json({
            "Status":"Failed",
            "Error": 'Invalid Id'
        })
    }

    res.status(200)?.json({
        "Status":"Successfull",
        "data": {
            tours
        }
    })

};

// updateTour
const updateTour = (req, res) => {

    if(Number(req.params?.id) > toursData?.length){
        res.status(400).json({
            "status": "Un Successfull",
            "data": {
                "message": "Invalid ID, Please try Valid Credentials",
            }
        })
    }
    
    const toursIndex = toursData?.findIndex(data => data?.id == Number(req.params.id));

    console.log('tourIndex', toursIndex);
    

    toursData[toursIndex] = {
        ...toursData[toursIndex],
        ...req.body
    }

    console.log('tour data', toursData);
    

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

// deleteTour
const deleteTour = (req, res) => {

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

// createTour
const createTour = (req, res) => {
    
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

const getAllUsers = (req, res) => {
    res.status(500).json({
        "message": "UnExpected Error, Invalid Route Incoming"
    })
}

const createUser = (req, res) => {
    res.status(500).json({
        "message": "UnExpected Error, Invalid Route Incoming"
    })
}

const getUser = (req, res) => {
    res.status(500).json({
        "message": "UnExpected Error, Invalid Route Incoming"
    })
}

const updateUser = (req, res) => {
    res.status(500).json({
        "message": "UnExpected Error, Invalid Route Incoming"
    })
}

const deleteUser = (req, res) => {
    res.status(500).json({
        "message": "UnExpected Error, Invalid Route Incoming"
    })
}

const tourRouter = express.Router();
const userRouter = express.Router();

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);



// routeHandler
app.route('/api/v1/tours').get(getAllTour).post(createTour);
app.route('/api/v1/tours/:id').get(getTour).patch(updateTour).delete(deleteTour);
app.route('/api/v1/users').get(getAllUsers).post(createUser);
app.route('/api/v1/users/:id').patch(updateUser).get(getUser).delete(deleteUser);

// Server Listening
app.listen(PORT, () => {
    console.log(`APP listening to port number ${PORT}`);
});

