const { getAllByDate, getRecent } = require('../services/courseService');

const homeCOntroller = require('express').Router();

 
homeCOntroller.get('/',async (req, res) => {
    let view;
    let courses = [];


    if (req.user) {
        //user home page
        view = 'user-home'   ;
        courses = await getAllByDate(req.query.search);     
    } else {
        //guests home page
        view = 'guest-home';
        courses = await getRecent();
    };

    res.render(view, {
        title: 'Home page',
        courses,
        search: req.query.search,
    });
});

module.exports = homeCOntroller;