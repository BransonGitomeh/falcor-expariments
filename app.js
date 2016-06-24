var model = new falcor.Model({
  source: new falcor.HttpDataSource('/model.json')
});


model.get('genrelist[0].name','genrelist[0].titles[0..1].name').then(function(data) {
  console.log(data);
});