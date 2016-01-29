m.route.mode = "hash";

m.route(document.body, "/", {
	"/":dashboard,
	"/:tabName":dashboard
});
