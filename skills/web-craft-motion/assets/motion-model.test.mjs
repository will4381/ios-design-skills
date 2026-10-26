import test from 'node:test';
import assert from 'node:assert/strict';
import { spring, rubberBand, rubberBandSlope, inertia } from './motion-model.mjs';

const close = (a, b, tolerance = 1e-6) => assert.ok(Math.abs(a - b) <= tolerance * Math.max(1, Math.abs(b)), `${a} != ${b}`);

test('all damping regimes preserve arbitrary initial position and velocity', () => {
  for (const bounce of [-0.7, -1e-9, 0, 1e-9, 0.2, 0.6]) {
    const sample = spring({ from: 35, to: -18, velocity: 420, response: 0.4, bounce });
    close(sample(0).position, 35);
    close(sample(0).velocity, 420);
    close(sample(10).position, -18);
    close(sample(10).velocity, 0);
  }
});

test('finite differences independently satisfy velocity and the spring ODE', () => {
  for (const bounce of [-0.6, 0, 0.4]) {
    const response = 0.43, omega = 2 * Math.PI / response;
    const zeta = bounce >= 0 ? 1 - bounce : 1 / (1 + bounce);
    const sample = spring({ from: -12, to: 100, velocity: -220, response, bounce });
    for (const t of [0.03, 0.17, 0.6]) {
      const h = 1e-5, before = sample(t - h), at = sample(t), after = sample(t + h);
      close((after.position - before.position) / (2 * h), at.velocity, 2e-5);
      const acceleration = (after.velocity - before.velocity) / (2 * h);
      close(acceleration, -2 * zeta * omega * at.velocity - omega ** 2 * (at.position - 100), 2e-5);
    }
  }
});

test('retargeting preserves position and velocity, including at zero displacement', () => {
  const first = spring({ from: 0, to: 1, velocity: 2, bounce: 0.25 });
  const current = first(0.08);
  for (const to of [0, current.position]) {
    const next = spring({ from: current.position, velocity: current.velocity, to, bounce: 0.25 });
    close(next(0).position, current.position);
    close(next(0).velocity, current.velocity);
  }
});

test('equal elapsed time agrees across 60 and 120 Hz repeated reinitialization', () => {
  for (const bounce of [-0.2, 0, 0.3]) {
    const options = { from: 0, to: 100, velocity: 70, response: 0.5, bounce };
    const expected = spring(options)(0.5);
    for (const hz of [60, 120]) {
      let state = { position: options.from, velocity: options.velocity };
      for (let i = 0; i < hz / 2; i++) {
        state = spring({ ...options, from: state.position, velocity: state.velocity })(1 / hz);
      }
      close(state.position, expected.position);
      close(state.velocity, expected.velocity);
    }
  }
});

test('zero-velocity step overshoot matches the independent peak formula', () => {
  const bounce = 0.2, zeta = 1 - bounce, response = 0.3;
  const omega = 2 * Math.PI / response;
  const peakTime = Math.PI / (omega * Math.sqrt(1 - zeta ** 2));
  const expected = 1 + Math.exp(-Math.PI * zeta / Math.sqrt(1 - zeta ** 2));
  close(spring({ from: 0, to: 1, response, bounce })(peakTime).position, expected);
  for (const b of [-0.3, 0]) {
    const f = spring({ from: 0, to: 1, response, bounce: b });
    for (let t = 0; t <= 2; t += 0.01) assert.ok(f(t).position <= 1 + 1e-12);
  }
});

test('rubber band is odd, bounded, monotonic and has the stated derivative', () => {
  let previous = -1;
  for (const x of [0, 1, 20, 200, 2000]) {
    const value = rubberBand(x, 400);
    assert.ok(value >= previous && value < 400);
    close(rubberBand(-x, 400), -value);
    const h = 1e-4;
    close((rubberBand(x + h, 400) - rubberBand(x - h, 400)) / (2 * h), rubberBandSlope(x, 400), 2e-6);
    previous = value;
  }
});

test('exponential inertia has consistent units, derivative and projection', () => {
  const options = { from: 40, velocity: 900, decay: 3 };
  const h = 1e-5;
  close(inertia(options, 0).position, 40);
  close(inertia(options, 0).velocity, 900);
  close(inertia(options, 10).position, 340);
  close((inertia(options, 0.2 + h).position - inertia(options, 0.2 - h).position) / (2 * h), inertia(options, 0.2).velocity);
});

test('invalid inputs fail explicitly', () => {
  for (const response of [0, -1, NaN, Infinity]) assert.throws(() => spring({ from: 0, to: 1, response }), RangeError);
  for (const bounce of [-1, 1, NaN]) assert.throws(() => spring({ from: 0, to: 1, bounce }), RangeError);
  assert.throws(() => spring({ from: 0, to: 1 })(-1), RangeError);
  assert.throws(() => rubberBand(20, 0), RangeError);
  assert.throws(() => inertia({ from: 0, velocity: 1, decay: 0 }, 1), RangeError);
});
