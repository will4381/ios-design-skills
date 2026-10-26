// Reference math, not a complete gesture component or an Apple runtime clone.
// Positions use one consistent unit; time is seconds and velocity is units/second.
function finite(...values) {
  if (!values.every(Number.isFinite)) throw new RangeError('Expected finite numbers');
}

export function spring({ from, to, velocity = 0, response = 0.3, bounce = 0 }) {
  finite(from, to, velocity, response, bounce, from - to);
  if (response <= 0 || bounce <= -1 || bounce >= 1) {
    throw new RangeError('response > 0 and -1 < bounce < 1 are required');
  }
  const omega = 2 * Math.PI / response;
  const zeta = bounce >= 0 ? 1 - bounce : 1 / (1 + bounce);
  const alpha = zeta * omega;
  const error = from - to;
  finite(omega * omega, alpha, alpha * velocity + omega * omega * error);
  return time => {
    finite(time);
    if (time < 0) throw new RangeError('time must be nonnegative');
    let C, S;
    if (zeta < 1) {
      const beta = omega * Math.sqrt((1 - zeta) * (1 + zeta));
      const envelope = Math.exp(-alpha * time);
      C = envelope * Math.cos(beta * time);
      S = envelope * Math.sin(beta * time) / beta;
    } else if (zeta > 1) {
      const q = Math.sqrt((zeta - 1) * (zeta + 1));
      const beta = omega * q;
      const slow = Math.exp(-omega / (zeta + q) * time);
      const fast = Math.exp(-omega * (zeta + q) * time);
      C = (slow + fast) / 2;
      S = slow * -Math.expm1(-2 * beta * time) / (2 * beta);
    } else {
      C = Math.exp(-omega * time);
      S = time * C;
    }
    const displacement = error * C + (velocity + alpha * error) * S;
    const nextVelocity = velocity * C - (alpha * velocity + omega * omega * error) * S;
    return {
      position: to + displacement,
      velocity: nextVelocity,
      acceleration: -2 * alpha * nextVelocity - omega * omega * displacement,
    };
  };
}

// Mathematical form recovered from the inspected UIKit boundary function.
// The default 0.55 is one observed branch, not a universal iOS coefficient.
export function rubberBand(distance, extent, coefficient = 0.55) {
  finite(distance, extent, coefficient);
  if (extent <= 0 || coefficient <= 0) throw new RangeError('extent and coefficient must be positive');
  const ratio = coefficient * Math.abs(distance) / extent;
  return Math.sign(distance) * extent * (1 - 1 / (1 + ratio));
}

export function rubberBandSlope(distance, extent, coefficient = 0.55) {
  rubberBand(distance, extent, coefficient);
  return coefficient / (1 + coefficient * Math.abs(distance) / extent) ** 2;
}

// Standard continuous exponential drag; not a reconstruction of UIScrollView.
export function inertia({ from, velocity, decay }, time) {
  finite(from, velocity, decay, time);
  if (decay <= 0 || time < 0) throw new RangeError('decay > 0 and time >= 0 are required');
  return {
    position: from + velocity * -Math.expm1(-decay * time) / decay,
    velocity: velocity * Math.exp(-decay * time),
    projectedPosition: from + velocity / decay,
  };
}
