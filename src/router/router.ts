import { response, Router } from 'express';
import asyncHandler from 'express-async-handler';

import {
  changeTodoItem,
  createTodoItem,
  getTodoItemsCount,
  showTodoItems,
} from '../add_funcs/add_funcs';

const router = Router();

router.get(
  '/',
  asyncHandler(async (request, response) => {
    const { page = '1', limit = '10' } = request.query;

    const result = await showTodoItems({
      page: +page,
      limit: +limit,
    });

    response.send(result);
  })
);

router.get(
  '/count',
  asyncHandler(async (request, response) => {
    let count: number = 0;
    await getTodoItemsCount()
      .then((num: number) => (count = num))
      .then(() => {
        response.send(`${count}`);
      })
      .catch((e: Error) => {
        console.warn(e);
        response.sendStatus(403);
      });
  })
);

router.get(
  '/:id',
  asyncHandler(async (request, response) => {
    const id = request.params.id;

    await showTodoItems({ id })
      .then((result) => {
        response.send(result);
      })
      .catch((e: PromiseRejectionEvent) => {
        response.sendStatus(404);
      });
  })
);

router.post(
  '/',
  asyncHandler(async (request, response) => {
    const { message, completed } = request.body;

    if (message === undefined || completed === undefined) {
      return response.sendStatus(400);
    }

    await createTodoItem({ message, completed }).then(() => {
      response.sendStatus(200);
    });
  })
);

router.patch(
  '/:id',
  asyncHandler(async (request, response) => {
    const id = request.params.id;

    await changeTodoItem(id, request.body)
      .then(() => {
        response.sendStatus(200);
      })
      .catch((e: PromiseRejectionEvent) => {
        response.sendStatus(404);
      });
  })
);

router.delete(
  '/:id',
  asyncHandler(async (request, response) => {
    const id = request.params.id;
    const deleteTime = Date.now();

    await changeTodoItem(id, { deletedAt: deleteTime })
      .then(() => {
        response.sendStatus(200);
      })
      .catch((e: PromiseRejectionEvent) => {
        response.sendStatus(404);
      });
  })
);

router.get(
  '*',
  asyncHandler(async (request, response) => {
    response.sendStatus(404);
  })
);

export { router };
