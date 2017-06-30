export const easeInQuad    = (t, b, c, d) => c * (t /= d) * t + b
export const easeOutQuad   = (t, b, c, d) => -c * (t /= d) * (t - 2) + b
export const easeInOutQuad = (t, b, c, d) => ((t /= d / 2) < 1) ? c / 2 * t * t + b : -c / 2 * (--t * (t - 2) - 1) + b

export const easeInCubic    = (t, b, c, d) => c * (t /= d) * t * t + b
export const easeOutCubic   = (t, b, c, d) => c * ((t = t / d - 1) * t * t + 1) + b
export const easeInOutCubic = (t, b, c, d) => ((t /= d / 2) < 1) ? c / 2 * t * t * t + b : c / 2 * ((t -= 2) * t * t + 2) + b

export const easeInQuart    = (t, b, c, d) => c * (t /= d) * t * t * t + b
export const easeOutQuart   = (t, b, c, d) => -c * ((t = t / d - 1) * t * t * t - 1) + b
export const easeInOutQuart = (t, b, c, d) => ((t /= d / 2) < 1) ? c / 2 * t * t * t * t + b : -c / 2 * ((t -= 2) * t * t * t - 2) + b

export const easeInQuint    = (t, b, c, d) => c * (t /= d) * t * t * t * t + b
export const easeOutQuint   = (t, b, c, d) => c * ((t = t / d - 1) * t * t * t * t + 1) + b
export const easeInOutQuint = (t, b, c, d) => ((t /= d / 2) < 1) ? c / 2 * t * t * t * t * t + b : c / 2 * ((t -= 2) * t * t * t * t + 2) + b

export const easeInSine    = (t, b, c, d) => -c * Math.cos(t / d * (Math.PI / 2)) + c + b
export const easeOutSine   = (t, b, c, d) => c * Math.sin(t / d * (Math.PI / 2)) + b
export const easeInOutSine = (t, b, c, d) => -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b

export const easeInExpo    = (t, b, c, d) => t == 0 ? b : c * Math.pow(2, 10 * (t / d - 1)) + b
export const easeOutExpo   = (t, b, c, d) => t == d ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b
export const easeInOutExpo = (t, b, c, d) => (t == 0) ? b : (t == d) ? b + c : ((t /= d / 2) < 1) ? c / 2 * Math.pow(2, 10 * (t - 1)) + b : c / 2 * (-Math.pow(2, -10 * --t) + 2) + b

export const easeInCirc    = (t, b, c, d) => -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b
export const easeOutCirc   = (t, b, c, d) => c * Math.sqrt(1 - (t = t / d - 1) * t) + b
export const easeInOutCirc = (t, b, c, d) => ((t /= d / 2) < 1) ? -c / 2 * (Math.sqrt(1 - t * t) - 1) + b : c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b

export const easeInElastic = (t, b, c, d) => {
  let s = 1.70158, p = 0, a = c
  if (t == 0) return b;if ((t /= d) == 1) return b + c;if (!p) p = d * 0.3;

  if (a < Math.abs(c)) {
    a = c; s = p / 4;
  }
  else s = p / (2 * Math.PI) * Math.asin(c / a);
  return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
}

export const easeOutElastic = (t, b, c, d) => {
  let s = 1.70158, p = 0, a = c
  if (t == 0) return b;if ((t /= d) == 1) return b + c;if (!p) p = d * 0.3;

  if (a < Math.abs(c)) {
    a = c; s = p / 4;
  } else s = p / (2 * Math.PI) * Math.asin(c / a);
  return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
}

export const easeInOutElastic = (t, b, c, d) => {
  let s = 1.70158, p = 0, a = c;
  if (t == 0) return b;if ((t /= d / 2) == 2) return b + c;if (!p) p = d * (0.3 * 1.5);

  if (a < Math.abs(c)) {
    a = c; s = p / 4;
  } else s = p / (2 * Math.PI) * Math.asin(c / a);
  if (t < 1) return -0.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
  return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * 0.5 + c + b;
}

export const easeInBack = (t, b, c, d, s) => {
  if (s == undefined) s = 1.70158;
  return c * (t /= d) * t * ((s + 1) * t - s) + b;
}

export const easeOutBack = (t, b, c, d, s) => {
  if (s == undefined) s = 1.70158;
  return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
}

export const easeInOutBack = (t, b, c, d, s) => {
  if (s == undefined) s = 1.70158;
  if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= 1.525) + 1) * t - s)) + b;
  return c / 2 * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2) + b;
}

export const easeInBounce = (t, b, c, d) => c - easeOutBounce(d - t, 0, c, d) + b

export const easeOutBounce = (t, b, c, d) => {

  if ((t /= d) < 1 / 2.75) {
    return c * (7.5625 * t * t) + b;
  } else if (t < 2 / 2.75) {
    return c * (7.5625 * (t -= 1.5 / 2.75) * t + 0.75) + b;
  } else if (t < 2.5 / 2.75) {
    return c * (7.5625 * (t -= 2.25 / 2.75) * t + 0.9375) + b;
  } else {
    return c * (7.5625 * (t -= 2.625 / 2.75) * t + 0.984375) + b;
  }
}

export const easeInOutBounce = (t, b, c, d) => (t < d / 2) ? easeInBounce(t * 2, 0, c, d) * 0.5 + b : easeOutBounce(t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b
