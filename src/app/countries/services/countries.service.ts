import { Region } from './../interfaces/region.type';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'

import { Observable, catchError, of, map, delay, tap } from 'rxjs';

import { Country } from '../interfaces/country';
import { CacheStore } from '../interfaces/cache-store.interface';

@Injectable({
  providedIn: 'root'
})
export class CountriesService {

  private apiUrl: string = 'https://restcountries.com/v3.1'

  public cacheStore: CacheStore = {
    byCapital: {
      term: '', countries: []
    },
    byCountries: {
      term: '', countries: []
    },
    byRegion: {
      region: '', countries: []
    },
  }

  constructor(private http: HttpClient) { 
    this.loadToLocalStorage()
  }

  private saveToLocalStorage() {
    localStorage.setItem('cacheStore', JSON.stringify(this.cacheStore))
  }

  private loadToLocalStorage() {
    if (!localStorage.getItem('cacheStore')) return

    this.cacheStore = JSON.parse(localStorage.getItem('cacheStore')!)
  }

  private getCountriesRequest(url: string): Observable<Country[]> {
    return this.http.get<Country[]>(url)
      .pipe(
        catchError(error => { return of([]) }),
        delay(1000)
      )
  }


  searchCountryByAlphaCode(code: string): Observable<Country | null> {

    const url = `${this.apiUrl}/alpha/${code}`


    return this.http.get<Country[]>(url)
      .pipe(
        map(countries => countries.length > 0 ? countries[0] : null),
        catchError(() => of(null)),

      )
  }


  searchCapital(term: string): Observable<Country[]> {
    const url = `${this.apiUrl}/capital/${term}`
    return this.getCountriesRequest(url)
      .pipe(
        tap(countries => this.cacheStore.byCapital = { term: term, countries: countries }),
        tap(() => this.saveToLocalStorage())
      )
  }

  searchCountry(term: string): Observable<Country[]> {
    const url = `${this.apiUrl}/name/${term}`
    return this.getCountriesRequest(url)
      .pipe(
        tap(countries => this.cacheStore.byCountries = { term: term, countries: countries }),
        tap(() => this.saveToLocalStorage())
      )
  }


  searchRegion(region: Region): Observable<Country[]> {
    const url = `${this.apiUrl}/region/${region}`
    return this.getCountriesRequest(url)
      .pipe(
        tap(countries => this.cacheStore.byRegion = { region, countries }),
        tap(() => this.saveToLocalStorage())
      )
  }



}
