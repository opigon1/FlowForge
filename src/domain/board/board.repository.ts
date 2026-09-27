import { Board } from './board.entity';

export interface BoardRepository {
  findById(id: string): Promise<Board | null>;
  save(board: Board): Promise<void>;
}
