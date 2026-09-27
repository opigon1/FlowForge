import { describe, it, expect } from 'vitest';
import { PrismaBoardRepository } from './prisma-board-repository';
import { prisma } from '../database/prisma.client';
import { BoardTitle } from '@/domain/board/value-objects/board-title.vo';
import { TaskTitle } from '@/domain/task/value-objects/task-title.vo';

describe('PrismaBoardRepository', () => {
  it('should find board by id', async () => {
    const boardRepository = new PrismaBoardRepository();

    const created = await prisma.board.create({
      data: {
        title: new BoardTitle('Test Board').toString(),
      },
    });

    try {
      const board = await boardRepository.findById(created.id);
      expect(board).not.toBeNull();
      expect(board!.getId()).toBe(created.id);
      expect(board!.getTitle().toString()).toBe('Test Board');
      expect(board!.getColumns()).toHaveLength(0);
    } finally {
      await prisma.board.delete({
        where: { id: created.id },
      });
    }
  });

  it('should save board title', async () => {
    const boardRepository = new PrismaBoardRepository();

    const created = await prisma.board.create({
      data: {
        title: new BoardTitle('Test Board').toString(),
      },
    });

    try {
      const board = await boardRepository.findById(created.id);

      expect(board).not.toBeNull();

      board!.rename(new BoardTitle('Updated Board Title'));

      await boardRepository.save(board!);

      const result = await prisma.board.findUnique({
        where: { id: created.id },
      });

      expect(result?.title).toBe('Updated Board Title');
    } finally {
      await prisma.board.delete({
        where: { id: created.id },
      });
    }
  });
  it('should find board with columns and tasks', async () => {
    const boardRepository = new PrismaBoardRepository();

    const created = await prisma.board.create({
      data: {
        title: new BoardTitle('Test Board').toString(),
        columns: {
          create: [
            {
              title: new BoardTitle('Todo').toString(),
              position: 0,
              tasks: {
                create: [
                  {
                    title: new TaskTitle('Task 1').toString(),
                  },
                ],
              },
            },
            {
              title: new BoardTitle('Done').toString(),
              position: 1,
            },
          ],
        },
      },
      include: {
        columns: {
          include: {
            tasks: true,
          },
        },
      },
    });

    try {
      const board = await boardRepository.findById(created.id);

      expect(board).not.toBeNull();

      const columns = board!.getColumns();

      expect(columns).toHaveLength(2);

      const todo = columns[0];
      const done = columns[1];

      expect(todo.getTitle().toString()).toBe('Todo');
      expect(todo.getTasks()).toHaveLength(1);
      expect(todo.getTasks()[0].getTitle().toString()).toBe('Task 1');

      expect(done.getTitle().toString()).toBe('Done');
      expect(done.getTasks()).toHaveLength(0);
    } finally {
      await prisma.board.delete({
        where: {
          id: created.id,
        },
      });
    }
  });
  it('should save board with columns and tasks', async () => {
    const boardRepository = new PrismaBoardRepository();

    const created = await prisma.board.create({
      data: {
        title: new BoardTitle('Test Board').toString(),
        columns: {
          create: [
            {
              title: new BoardTitle('Todo').toString(),
              position: 0,
              tasks: {
                create: [
                  {
                    title: new TaskTitle('Task 1').toString(),
                  },
                ],
              },
            },
            {
              title: new BoardTitle('Done').toString(),
              position: 1,
            },
          ],
        },
      },
      include: {
        columns: {
          include: {
            tasks: true,
          },
        },
      },
    });

    try {
      const board = await boardRepository.findById(created.id);

      expect(board).not.toBeNull();
      expect(board!.getTitle().toString()).toBe('Test Board');
      const columns = board!.getColumns();
      expect(columns).toHaveLength(2);
      expect(columns[0].getTitle().toString()).toBe('Todo');
      expect(columns[0].getTasks()).toHaveLength(1);
      expect(columns[1].getTitle().toString()).toBe('Done');
      expect(columns[1].getTasks()).toHaveLength(0);
    } finally {
      await prisma.board.delete({
        where: {
          id: created.id,
        },
      });
    }
  });
  it('should delete removed columns when saving board', async () => {
    const boardRepository = new PrismaBoardRepository();
    const created = await prisma.board.create({
      data: {
        title: new BoardTitle('Test Board').toString(),
        columns: {
          create: [
            {
              title: new BoardTitle('Todo').toString(),
              position: 0,
              tasks: {
                create: [
                  {
                    title: new TaskTitle('Task 1').toString(),
                  },
                ],
              },
            },
            {
              title: new BoardTitle('Done').toString(),
              position: 1,
            },
          ],
        },
      },
      include: {
        columns: {
          include: {
            tasks: true,
          },
        },
      },
    });
    try {
      const board = await boardRepository.findById(created.id);
      board!.removeColumn(board!.getColumns()[1].getId());
      await boardRepository.save(board!);
      const result = await prisma.board.findUnique({
        where: { id: created.id },
        include: {
          columns: true,
        },
      });
      expect(result?.columns).toHaveLength(1);
      expect(result?.columns[0].title).toBe('Todo');
    } finally {
      await prisma.board.delete({
        where: {
          id: created.id,
        },
      });
    }
  });
  it('should synchronize tasks when saving board', async () => {
    const boardRepository = new PrismaBoardRepository();

    const created = await prisma.board.create({
      data: {
        title: new BoardTitle('Test Board').toString(),
        columns: {
          create: [
            {
              title: new BoardTitle('Todo').toString(),
              position: 0,
              tasks: {
                create: [
                  {
                    title: new TaskTitle('Task 1').toString(),
                  },
                  {
                    title: new TaskTitle('Task 2').toString(),
                  },
                ],
              },
            },
            {
              title: new BoardTitle('Done').toString(),
              position: 1,
              tasks: {
                create: [
                  {
                    title: new TaskTitle('Task 3').toString(),
                  },
                ],
              },
            },
          ],
        },
      },
      include: {
        columns: {
          include: {
            tasks: true,
          },
        },
      },
    });

    try {
      const board = await boardRepository.findById(created.id);
      const todo = board!.getColumns().find((column) => column.getTitle().toString() === 'Todo')!;
      const done = board!.getColumns().find((column) => column.getTitle().toString() === 'Done')!;
      const task1 = todo.getTasks().find((task) => task.getTitle().toString() === 'Task 1')!;
      task1.rename(new TaskTitle('Updated Task 1'));

      todo.removeTask(
        todo
          .getTasks()
          .find((task) => task.getTitle().toString() === 'Task 2')!
          .getId(),
      );

      const task3 = done.removeTask(
        done
          .getTasks()
          .find((task) => task.getTitle().toString() === 'Task 3')!
          .getId(),
      );

      todo.addTask(task3);
      await boardRepository.save(board!);

      const result = await prisma.board.findUnique({
        where: {
          id: created.id,
        },
        include: {
          columns: {
            include: {
              tasks: true,
            },
          },
        },
      });

      const resultTodo = result!.columns.find((column) => column.title === 'Todo')!;
      const resultDone = result!.columns.find((column) => column.title === 'Done')!;

      expect(resultTodo.tasks).toHaveLength(2);
      expect(resultDone.tasks).toHaveLength(0);
      expect(resultTodo.tasks.find((task) => task.id === task1.getId())?.title).toBe(
        'Updated Task 1',
      );
      expect(resultTodo.tasks.find((task) => task.id === task3.getId())).toBeDefined();
      expect(resultTodo.tasks.find((task) => task.id === task3.getId())?.title).toBe('Task 3');
    } finally {
      await prisma.board.delete({
        where: {
          id: created.id,
        },
      });
    }
  });
});
