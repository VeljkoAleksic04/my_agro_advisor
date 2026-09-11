import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ForumIndikatorService } from '../../services/forum-indikator.service';

@Component({
  selector: 'app-forum-indikator',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './forum-indikator.component.html',
  styleUrl: './forum-indikator.component.scss',
})
export class ForumIndikatorComponent implements OnInit {
  private readonly indikator = inject(ForumIndikatorService);
  protected readonly imaNovihTema = this.indikator.imaNovihTema;

  ngOnInit(): void {
    this.indikator.pokreni();
  }

  oznaciKaoVidjeno(): void {
    this.indikator.oznaciKaoVidjeno();
  }
}
