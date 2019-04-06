const smarti = require("Smartibot");

const wait = function(min, max) {  
  if (!max) {
    max = min;
  }
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      resolve();
    }, (min * 1000) + ((max - min) * 1000));
  });
};

function turn(motor) {
  if (Math.random() < 0.5) {
    smarti.setMotor(motor, Math.random() * 0.5 + 0.5);
  } else {
    smarti.setMotor(motor, - Math.random() * 0.5 + 0.5);
  }
}

function forward() {
  smarti.setMotor(1, 1.0);
  smarti.setMotor(2, -1.0);
}

function backward() {
  smarti.setMotor(1, 0.75);
  smarti.setMotor(2, -0.75);
}

function direction() {
  const which = Math.random();
  if (which < 0.3) {
    forward();
  } else if (which < 0.5) {
    backward();
  } else {
    turn(1);
    turn(2);
  }
}

function stop() {
  smarti.setMotor(1, 0);
  smarti.setMotor(2, 0);
}

function eyes(up) {
  let i = 0;
  function fade(n) {
    if (!up) {
      return ((10 - i) * n / 10);
    } else {
      return (i * n / 10);
    }
  }
  function step() {
    smarti.setLEDs([ fade(64), fade(64), fade(128) ], [ fade(64), fade(64), fade(128) ]);
    return wait(0.05).then(function() {
      if (i === 10) {
        return;
      } else {
        i++;
        return step();
      }
    });
  }
  return step();
}

function movement() {
  direction();
  return wait(1, 2).then(function() {
    return stop();
  }).then(function() {
    return wait(5, 10);
  });
}

function naps() {
  return eyes(true).then(function() {
    return wait(1, 3);
  }).then(function() {
    return movement();
  }).then(function() {
    return movement();
  }).then(function() {
    return movement();
  }).then(function() {
    return eyes(false);
  }).then(function() {
    return wait(10, 20);
  }).then(function() {
    return naps();
  });
}

naps();

