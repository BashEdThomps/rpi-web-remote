PiApp.config(function($provide, $stateProvider, $urlRouterProvider)
{
  $urlRouterProvider.otherwise("/");

  $stateProvider.state('Landing',
  {
  	url: "/",
  	templateUrl: "landing.html",
    controller: "Landing"
  });
});