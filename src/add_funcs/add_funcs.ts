import { TodoItemModel } from '../model/todo_model';
import { ITodo, IGetParams } from '../interface/interface';

export const changeTodoItem = async (
  id: string,
  params: ITodo
): Promise<typeof TodoItemModel> => {
  const upd: ITodo = Object.keys(params).reduce((res: ITodo, val: string) => {
    if (params[val] !== undefined) {
      res[val] = params[val];
    }
    return res;
  }, {});

  return await TodoItemModel.updateOne({ _id: id }, upd);
};

export const createTodoItem = async (
  params: ITodo
): Promise<typeof TodoItemModel> => {
  return await TodoItemModel.create(params);
};

export const showTodoItems = async (
  params: IGetParams
): Promise<typeof TodoItemModel> => {
  if (params.id) {
    return await TodoItemModel.find({ _id: params.id });
  } else {
    const { page = 1, limit = 10 } = params;
    const currentPage = page < 1 ? 0 : page - 1;
    const pages: number = currentPage * limit;
    return await TodoItemModel.find({ deletedAt: null })
      .skip(pages)
      .limit(limit);
  }
};

export const getTodoItemsCount = async (): Promise<number> => {
  return await TodoItemModel.countDocuments({ deletedAt: null });
};
