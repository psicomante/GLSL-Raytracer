var fragFiles = [
  'raytracer_step5.frag'
]

var fragSources = [];

_.each(fragFiles, function(fileName){
  // loading shaders
  fragSources.push(Webglass.ajax({
    url: '../src/shaders/',
    file: fileName
  }));
});

var wgl = new Webglass({
  fs: fragSources[0],
  nfo: true
});

wgl.stop();

window.wgl = wgl;
