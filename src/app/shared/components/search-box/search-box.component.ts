import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject, debounceTime, Subscription } from 'rxjs';


@Component({
  selector: 'shared-search-box',
  templateUrl: './search-box.component.html',
  styles: [
  ]
})
export class SearchBoxComponent implements OnInit, OnDestroy {



  private debouncer: Subject<string> = new Subject<string>
  private debouncerSuscription?: Subscription


  @Input()
  public placeholder: string = ''

  @Input()
  public initialValue: string = ''

  @Output()
  public onValue = new EventEmitter<string>();

  @Output()
  public onDebounce = new EventEmitter<string>();

  ngOnInit(): void {
    this.debouncerSuscription = this.debouncer
      .pipe(
        debounceTime(500)
      )
      .subscribe(data => {
        this.onDebounce.emit(data)
      })
  }

  ngOnDestroy(): void {
    this.debouncer?.unsubscribe()
    // throw new Error('Method not implemented.');
  }

  onKeyPress(searchTerm: string): void {
    this.debouncer.next(searchTerm)
  }

  emitValue(txtInput: string): void {
    this.onValue.emit(txtInput)
  }


}