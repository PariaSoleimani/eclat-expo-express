const routes = app => {
	app.get('/', (req, res) => {
		res.send('hello');
	});
};

export default routes;