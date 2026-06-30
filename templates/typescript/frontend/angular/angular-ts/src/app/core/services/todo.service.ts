import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env';
import { ApiResponse, Todo, TodoRequest } from '@shared/models';

@Injectable({ providedIn: 'root' })
export class TodoService {
  private base = `${environment.apiUrl}/api/todos`;

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<ApiResponse<Todo[]>>(this.base);
  }

  create(body: Pick<TodoRequest, 'title'>) {
    return this.http.post<ApiResponse<Todo>>(this.base, body);
  }

  update(id: number, body: TodoRequest) {
    return this.http.put<ApiResponse<Todo>>(`${this.base}/${id}`, body);
  }

  delete(id: number) {
    return this.http.delete<ApiResponse<null>>(`${this.base}/${id}`);
  }
}
