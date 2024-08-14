import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { Member } from '../_models/member';
import { setPaginatedResponse, setPaginationHeaders } from './paginationHelper';
import { PaginatedResult } from '../_models/pagination';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LikesService {
  private http = inject(HttpClient);
  baseUrl = environment.apiUrl;
  likeIds = signal<number[]>([]);

  // hasLiked = computed(()=>this.likeIds().includes(this.member().id));

  isLiked(memberId: number) {
    return computed(() => this.likeIds().includes(memberId));
  }

  paginatedResult = signal<PaginatedResult<Member[]> | null>(null);
  toggleLike(targetId:number)
  {
    return this.http.post(`${this.baseUrl}like/${targetId}`,{}).pipe(
      tap(()=>
      this.likeIds.update(ids=>
      {
        const index = ids.indexOf(targetId);
        if(index === -1)
        {
          return [...ids,targetId];
        }
        else{
          return ids.filter(x=>x !== targetId)
        }
      }
      ))
    );
  }
  getLikes(predicate:string,pageNumber:number,pageSize:number)
  {
    let params = setPaginationHeaders(pageNumber,pageSize);
    params = params.append('predicate',predicate);
    return this.http.get<Member[]>(`${this.baseUrl}like`,
      {observe:'response',params}
    ).subscribe({
      next: response=>
      {
        setPaginatedResponse(response,this.paginatedResult)
      }
    })
    ;
  }
  getLikeIds(){
    return this.http.get<number[]>(`${this.baseUrl}like/list`).subscribe(
      {
        next:ids=>
        {
          this.likeIds.set(ids)
        }
      }
    )
  }
  constructor() { }
}
