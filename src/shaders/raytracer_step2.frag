/**
For each pixel {
  construct a ray from eye (camera) through the pixel center of image plane
  min_t = ∞
  For each object {
    if (t = intersection(ray, object)) {
       if (t < min_t) {
         closestObject = object
         min_t = t
       }
    }
 }
}
*/

precision highp float;
uniform vec2 resolution;
uniform float time;

/**
 * Normalized vector struct
 *
 * Commonly
 *   the ray origin is the eye position
 *   the ray direction is the pixel coordinates positioned in the virtual screen
 *
 * @type {vec3} origin initial position of the vector, $P_0$
 * @type {vec3} direction unit direction $u$
 */
struct Ray {
  vec3 origin;
  vec3 direction;
};

/**
 * Sphere struct
 *
 * @type {vec3} center
 * @type {vec3} radius
 * @type {vec3} color diffuse color of the sphere
 */
struct Sphere {
  vec3 center;
  float radius;
  vec4 color;
};

/**
 * Intersection struct
 *
 * @type {vec3} center
 * @type {vec3} radius
 * @type {vec3} color intersection color
 */
struct Intersection {
  float t;
  int hit;
  vec4 color;
};

// ray origin === eye position, or vantage point
vec3 eye = vec3 (0.0, 0.0, 2.0);

// spheres
Sphere spheres[3];

/**
 * Ray - Sphere intersection test
 *
 * in vector notation, the equation for a sphere is:
 * ||x - c||^2 = r^2
 *
 * where x is points on the sphere, c the center and r the radius
 * x and c are vectors.
 *
 * ray equation:
 * x = o + d*l
 *
 * - o: origin of the line, that is the camera position or eye
 * - d: distance along line from starting poing
 * - l: direction of the line (a unit vector)
 * - x: points on the line
 *
 * x, o and l are vectors.
 *
 * searching for points that are on the line and on the sphere
 * means combining the equations and solving for d.
 *
 * ||o + dl - c||^2 = r^2 <=> (o + dl - c).(o + dl - c) = r^2
 *
 * expanded (||dl - (o - c)||^2):
 * d^2*(l.l) + 2d*(l.(o - c)) + (o - c).(o - c) = r^2
 *
 * rearranged:
 * d^2*(l.l) + 2d*(l.(o - c)) + (o - c).(o - c) - r^2 = 0
 *
 * the form of a Quadratic formula is now observable.
 * (This quadratic equation is an example of Joachimathal Equation:)
 * ad^2 + bd + c = 0;
 *
 * d = (-b^2 +/- sqrt(b^2 - 4ac)) / 2a
 *
 * where
 * a = l.l = ||l||^2 == 1 (unit vector, its modulo is 1)
 * b = 2(l.(o - c))
 * c = (o - c).(o - c) - r^2 = ||o - c||^2 - r^2
 *
 * simplifying
 * == (2*(b/2) - 2*sqrt(b/4 - c)) / 2.
 * == (- b - sqrt(b^2 - c))
 *
 * d = -(l.(o - c)) +/- sqrt[(l.(o - c))^2 - || o - c ||^2 + r^2]
 */
void raySphereIntersection(Ray ray, Sphere sphere, inout Intersection isect) {
  vec3 rs = ray.origin - sphere.center; //(o -c)
  float b = dot(ray.direction, rs);
  float c = dot(rs,rs) - pow(sphere.radius,2.);
  float d = pow(b,2.) - c; // b^2 - c

  // if d < 0, no solution, ray does is far away
  // if d = 0, one solution, ray is tangent the sphere
  // if d > 0, two solution (enter and exit), ray intersecs the sphere

  if (d < 0.0) {
    return;
  }

  float t = - b - sqrt(d);

  if ( (t >= 0.0) && (t < isect.t) ) {
    isect.t = t;
    isect.hit = 1;
    isect.color = sphere.color;
  }
}

/**
 * Generic Intersect function with all spheres
 */
void Intersect(Ray r, inout Intersection i) {
  for (int c = 0; c < 3; c++) {
    raySphereIntersection(r, spheres[c], i);
  }
}

void main() {
  // normalized coordinates, origin in the center of the screen
  vec2 uv = (gl_FragCoord.xy / resolution.xy)*2.0 - 1.0;

  // aspect ratio, useful to avoid the image stretch
  float ar = resolution.x / resolution.y;

  // build a ray from eye to pixel position
  // - the z is negative because the positive z axis is towards the eye
  // - normalize because we need a unit vector
  // - multiply uv.x for aspect ratio to correct image stretch on x axis
  vec3 direction = normalize(vec3(uv*vec2(ar,1.0), -eye.z));

  spheres[0].center = vec3(0.7, 0.0, -2.5);
  spheres[0].radius = 0.5;
  spheres[0].color = vec4(1,0,0,1);
  spheres[1].center = vec3(-0.7, 0.0, -3.0);
  spheres[1].radius = 1.5;
  spheres[1].color = vec4(0,1,0,1);
  spheres[2].center = vec3(-2.0, 0.0, -3.0);
  spheres[2].radius = 0.5;
  spheres[2].color = vec4(0,0,1,1);

  Ray ray;
  ray.origin = eye;
  ray.direction = direction;

  Intersection i;
  i.hit = 0;
  i.t = 1.0e+30;
  i.color = vec4(0.0, 0.0, 0.0, 1.0);

  Intersect(ray, i);

  vec4 pixel_color = i.color;

  // set pixel color value
  gl_FragColor = pixel_color;
}
