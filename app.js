var model = new falcor.Model({
  source: new falcor.HttpDataSource('/model.json')
});


model
  .get(
    ["events", {from: 0, to: 4}, ["name", "description"]],
    ['events', {from: 0, to: 4}, 'location', ['city', 'state']]
  ).then(res => {
    console.log(res)
    Object.keys(res.json.events).map(key => {
      console.log(res.json.events[key])
    })
  })