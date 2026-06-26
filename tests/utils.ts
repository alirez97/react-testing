import { delay, http, HttpResponse } from 'msw';
import { server } from './mocks/server';

export const simulateDelay = (endPoint: string) => {
  server.use(
    http.get(endPoint, async () => {
      await delay();
      return HttpResponse.json([]);
    }),
  );
};

export const simulateError = (endPoint: string) => {
  server.use(http.get(endPoint, () => HttpResponse.error()));
};
