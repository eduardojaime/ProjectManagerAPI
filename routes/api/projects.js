// Router that handles requests to /api/projects
const express = require('express');
const { route } = require('..');
const router = express.Router();
// Import the model
const Project = require('../../models/project');

// Configure your router by adding handlers
// GET handler for /api/projects
// Goal: View a list of projects
router.get('/', (req, res, next) => {
    // the difference between web app and web api is what we return
    // web app >> res.render('view', data);
    // web api returns JSOn
    // res.json('success');
    Project.find((err, projects) => {
        if (err) {
            console.log(err);
            res.status(500).json('Error!');
        }
        else {
            res.status(200).json(projects);
        }
    });
});

// POST /api/projects > Input: JSON object containing information about the project
router.post('/', (req, res, next) => {
    // for testing
    // console.log(req.body);
    // res.json(req.body).status(200);
    // Validation step
    if (!req.body.name) {
        res.status(400).json({ 'ValidationError': 'Name is a required field' });
    }
    else if (!req.body.course) {
        res.status(400).json({ 'ValidationError': 'Course is a required field' });
    }
    else {
        Project.create({ 
                name: req.body.name,
                dueDate: req.body.dueDate,
                course: req.body.course
            }, // project info to be added to the db
            (err, newProject) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({ 'ErrorMessage': 'Server threw exception' });
                }
                else {
                    res.status(200).json(newProject);
                }
            }
        ); // callback function to handle creating a new project
    }
});


// PUT /projects/:_id > Input: JSON object containing information about the project
router.put('/:_id', (req, res, next) => {
    if (!req.body.name) {
        res.status(400).json({ 'ValidationError': 'Name is a required field' });
    }
    else if (!req.body.course) {
        res.status(400).json({ 'ValidationError': 'Course is a required field' });
    }
    else {
        Project.findOneAndUpdate(
            { _id: req.params._id }, // filter query
            {
                name: req.body.name,
                dueDate: req.body.dueDate,
                course: req.body.course,
                status: req.body.status
            }, // updated information
            (err, updatedProject) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({ 'ErrorMessage': 'Server threw exception' });
                }
                else {
                    res.status(200).json(updatedProject);
                }
            }
        );
    }
});

// DELETE /projects/:_id
router.delete('/:_id', (req, res, next) => {
    Project.remove(
        { _id: req.params._id }, // filter query with the id 
        (err) => {
            if (err) {
                console.log(err);
                res.status(500).json({ 'ErrorMessage': 'Server threw exception' });                
            }
            else {
                res.status(200).json({ 'success': 'true' });
            }
        }
    );
});

// Export this router so we can configure it in app.js
module.exports = router;