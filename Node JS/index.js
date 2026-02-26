import { log, readLogs } from './logger.js';

log('App started');

setTimeout(() => {
  log('First timeout event');
}, 2000);

let counter = 0;

const intervalId = setInterval(() => {
  counter++;
  log('Interval tick');

  if (counter === 3) {
    clearInterval(intervalId);
  }
}, 1000);

setTimeout(() => {
  readLogs();
}, 6000);
