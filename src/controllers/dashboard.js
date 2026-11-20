export const dashboardPage = (req, res) => {
    res.render('user-dashboard', {
        title: 'Dashboard',
        user: req.session.user
    });
};