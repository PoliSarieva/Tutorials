const { createdCourse, getById, deleteById, updateById, anrollUser } = require('../services/courseService');
const { parseError } = require('../util/parser');

const courseController = require('express').Router();

courseController.get('/create', (req, res) => {
    res.render('create', {
        title: 'Create Course'
    });
});

courseController.post('/create', async (req, res) => {
    const course = {
        title: req.body.title,
        description: req.body.description,
        imageUrl: req.body.imageUrl,
        duration: req.body.duration,
        owner: req.user._id
    };

    try {
        await createdCourse(course);
        res.redirect('/');

    } catch (error) {
        const errors = parseError(error);
        res.render('create', {
            title: 'Create Course',
            errors: parseError(error),
            body: course
        })
    }
});

courseController.get('/:id', async (req, res) => {
    const course = await getById(req.params.id);
    course.enrolled = course.users.map(x => x.toString()).includes(req.user._id.toString());

    course.isOwner = course.owner.toString() == req.user._id.toString();

    res.render('details', {
        title: course.title,
        course,
    });
});

courseController.get('/:id/delete', async (req, res) => {
    const id = req.params.id;
    const course = await getById(req.params.id);

    if (course.owner.toString() != req.user._id.toString()) {
        return res.redirect('/auth/login');
    }

    await deleteById(id);
    res.redirect('/');
});

courseController.get('/:id/edit', async (req, res) => {
    const course = await getById(req.params.id);
    res.render('edit', {
        title: 'Course Edit',
        course,

    });
});

courseController.post('/:id/edit', async (req, res) => {
    const course = await getById(req.params.id);
    const id = req.params.id;

    if (course.owner.toString() != req.user._id.toString()) {
        return res.redirect('/auth/login');
    }

    try {
        await updateById(id, req.body);
        res.redirect(`/course/${id}`);
    } catch (error) {
        res.render('edit', {
            title: 'Course Edit',
            course: req.body,
            errors: parseError(error),
        });
    };

});


courseController.get('/:id/enroll', async (req, res) => {
    const course = await getById(req.params.id);
    
    if (course.owner.toString() != req.user._id.toString() &&
        course.users.map(x => x.toString()).includes(req.user._id.toString()) == false) {
           await anrollUser(req.params.id, req.user._id);
        };
        
        res.redirect(`/course/${req.params.id}`);
});

module.exports = courseController;