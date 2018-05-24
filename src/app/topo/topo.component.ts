import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Oferta } from '../shared/oferta.model';
import { OfertasService } from '../ofertas.service';
import { Subject } from 'rxjs/Subject';
import '../util/rxjs-extensions';

@Component({
  selector: 'app-topo',
  templateUrl: './topo.component.html',
  styleUrls: ['./topo.component.css'],
  providers: [ OfertasService ]
})
export class TopoComponent implements OnInit {

  public ofertas: Observable<Oferta[]>
  public ofertas2: Oferta[] //este atributo foi utilizado apenas com fins didáticos e será substituído por um pipe
  private subjectPesquisa: Subject<string> = new Subject<string>()

  constructor(private ofertasService: OfertasService) { }

  ngOnInit() {
    this.ofertas = this.subjectPesquisa //retorno Oferta[]
      .debounceTime(1000) //executa a ação do switchMap após 1 segundo
      .distinctUntilChanged() //utilizado para fazer pesquisas distintas
      .switchMap((termo: string) => {
        console.log('requisição http paara api')

        if(termo.trim() === '') {
          //retornar um observable de array de ofertas vazio
          return Observable.of<Oferta[]>([])
        }

        return this.ofertasService.pesquisaOfertas(termo)
      })
      .catch((err: any) => {
        console.log(err)
        return Observable.of<Oferta[]>([])
      })

      this.ofertas.subscribe((ofertas: Oferta[]) => {
        console.log(ofertas)
        this.ofertas2 = ofertas
      })
  }

  public pesquisa(termoDaBusca: string): void {
    console.log('keyup caracter: ', termoDaBusca)
    this.subjectPesquisa.next(termoDaBusca)
  }

}
