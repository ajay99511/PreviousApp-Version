import { HttpClient, HttpParams, HttpResponse} from '@angular/common/http';
import { inject, Injectable, signal, Signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { Member } from '../_models/member';
import { map, of, tap } from 'rxjs';
import { Photo } from '../_models/photo';
import { PaginatedResult } from '../_models/pagination';
import { UserParams } from '../_models/userParams';
import { AccountService } from './account.service';
import { setPaginatedResponse, setPaginationHeaders } from './paginationHelper';
@Injectable({
  providedIn: 'root'
})
export class MemberService {
  // members = signal<Member[]>([]);
  paginatedResult = signal<PaginatedResult <Member[]> | null>(null);
  private accountService = inject(AccountService);
  private http = inject(HttpClient);
  // private toastr = inject(ToastrService);
  baseUrl = environment.apiUrl;
  memberCache = new Map();
  user = this.accountService.currentUser();
  userParams = signal<UserParams>(new UserParams(this.user));
  resetUserParams()
  {
    this.userParams.set(new UserParams(this.user));
  }
  getMembers()
  {
    const response = this.memberCache.get(Object.values(this.userParams()).join('-'));
    if(response) 
      {
        return setPaginatedResponse(response,this.paginatedResult);
      }
    let params = setPaginationHeaders(this.userParams().pageNumber,this.userParams().pageSize);
    params = params.append('minAge',this.userParams().minAge);
    params = params.append('maxAge',this.userParams().maxAge);
    if(this.userParams().gender!='all')
    {
      params = params.append('gender',this.userParams().gender);
    }
    params = params.append('orderBy',this.userParams().orderBy);
    return this.http.get<Member[]>(this.baseUrl+'users', {observe:'response', params}).subscribe({
      next: response => {
        setPaginatedResponse(response,this.paginatedResult);
        this.memberCache.set(Object.values(this.userParams()).join('-'), response);
      }
    }
    )
  }
  //  private setPaginatedResponse(response : HttpResponse<Member[]>)
  // {
  //   this.paginatedResult.set({
  //   items: response.body as Member[],
  //   pagination: JSON.parse(response.headers.get('Pagination')!)
  // })
  // }
  // setPaginationHeaders(pageNumber : number,pageSize:number)
  // {
  //   let params = new HttpParams();
  //   if(pageNumber && pageSize)
  //   {
  //     params = params.append('pageNumber',pageNumber);
  //     params = params.append('pageSize',pageSize);
  //   }
  //   return params
  // }
  getMember(username:string)
  {
    const member:Member = [...this.memberCache.values()]
    .reduce((arr,ele)=>arr.concat(ele.body),[])
    .find((m:Member)=>m.userName==username)
    if(member) return of(member)
    // const member = this.members().find(x=>x.userName === username);
    // if(member !== undefined) return of(member);
    return this.http.get<Member>(this.baseUrl+'users/'+username);
  }
  updateMember(member:Member)
  {
    return this.http.put(this.baseUrl+'users',member).pipe(
    //   tap(()=>{
    //     this.members.update(
    //       members=>members.map
    //       (m=>m.userName===member.userName ? member:m)
    //     )
    //   }
    // )
    );
  }
  setMainPhoto(photo:Photo)
  {
    return this.http.put(this.baseUrl+'users/set-main-photo/'+photo.id,{}).pipe(
      // tap(
      //   ()=>{
      //     this.members.update(
      //       members=>members.map(
      //         m=>{
      //           if(m.photos.includes(photo))
      //           {
      //             m.photoUrl=photo.url
      //           }
      //           return m;
      //         }
      //       )
      //     )
      //   }
      // )
    );

  }
deletePhoto(photo:Photo)
{
  return this.http.delete(this.baseUrl+'users/delete-photo/'+photo.id).pipe(
    // tap(
    //   ()=>this.members.update(members=>members.map(
    //     m=>{
    //       if(m.photos.includes(photo))
    //       {
    //         m.photos = m.photos.filter(x=>x.id!==photo.id)
    //       }
    //       return m
    //     }
    //   ))
    // )
  );
}




  /*
  ,this.getHttpOptions()

  getHttpOptions()
  {
    return {
      headers: new HttpHeaders({
        Authorization:`Bearer ${this.accountService.currentUser()?.token}`
      })
    }
  }
  */

  constructor() { }
}

