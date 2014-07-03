# glsl_raytracer

A simple raytracer made with a GLSL fragment shader using [webglass - a webgl library](http://Webglassers.github.io/webglass).

## About

A project by Roberto Pesando and Ruben Caliandro

See the [project homepage](http://Webglassers.github.io/glsl_raytracer).

#### Install all the dependencies

    npm install
    bower install

You can (and probably you should) also install two useful Sublime Plugins:

  * [GLSL Shader Validator](https://github.com/WebGLTools/GL-Shader-Validator)
  * [GLSL / ESSL syntax highlighter](https://github.com/euler0/sublime-glsl)

#### Easy development flow

We created a grunt task to make development easier.

    grunt demo

This command starts a server on localhost:9000 and watches for changes on the directory. Whenever you change a file, it runs all the needed tasks and reload the browser (if necessary).

In this way, you can develop your feature, tests and demos at once, without having to stop to launch the tasks manually.

## License

MIT. See `LICENSE.txt` in this directory.
