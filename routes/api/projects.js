const express = require("express");
const { rawListeners } = require("../../app");
const router = express.Router();
// Import Project model
const Project = require("../../models/project");

// GET /api/projects/ > returns a list of projects in DB
router.get("/", (req, res, next) => {
  // for now, just enter success
  // res.json('success');
  // Show an unfiltered list of Projects
  Project.find((err, projects) => {
    if (err) {
      console.log(err);
    } else {
      res.status(200).json(projects);
    }
  });
});

// POST /api/projects/ > add the provided object in the request body to the DB
router.post("/", (req, res, next) => {
  // Test
  // console.log(req.body);
  // res.status(200).json(req.body);

  // Validate required fields
  if (!req.body.name) {
    res.status(400).json({ ValidationError: "Name is a required field" });
  } else if (!req.body.course) {
    res.status(400).json({ ValidationError: "Course is a required field" });
  }
  else {
    // valid project
    Project.create({
        name: req.body.name,
        dueDate: req.body.dueDate,
        course: req.body.course
    }, (err, newproject)=>{
        if (err) {
            console.log(err);
            res.status(500).json({'ErrorMessage': 'Server threw an exception'});
        }
        else {
            res.status(200).json(newproject);
        }
    })
  }
});

// PUT /api/projects/:_id
router.put('/:_id', (req, res, next) => {
    // Validate required fields
  if (!req.body.name) {
    res.status(400).json({ ValidationError: "Name is a required field" });
  } else if (!req.body.course) {
    res.status(400).json({ ValidationError: "Course is a required field" });
  }
  else {
    Project.findOneAndUpdate({ // filter to find project to update
        _id: req.params._id
    }, { // updated info
        name: req.body.name,
        dueDate: req.body.dueDate,
        course: req.body.course,
        status: req.body.status
    }, (err, updatedProject)=>{ // callback function
        if (err) {
            console.log(err);
            res.status(500).json({'ErrorMessage': 'Server threw an exception'});
        }
        else {
            res.status(200).json(updatedProject);
        }
    });
  }
});

// DELETE /api/projects/:_id
router.delete('/:_id', (req, res, next) => {
    Project.remove({
        _id: req.params._id
    }, (err)=>{
        if (err) {
            console.log(err);
            res.status(500).json({'ErrorMessage': 'Server threw an exception'});
        }
        else {
            res.status(200).json({'success': 'true'});
        }
    })
});

module.exports = router;
