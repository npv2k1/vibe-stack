import * as promClient from 'prom-client';

let register: promClient.Registry | null = null;

export const getMetricsRegistry = () => {
  if (!register) {
    register = new promClient.Registry();
  }
  return register;
};
