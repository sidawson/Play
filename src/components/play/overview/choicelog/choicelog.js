
import { Component } from '@angular/core';
import template from './choicelog.html';
import './choicelog.less';

import { SweetAlertService } from 'ng2-sweetalert2';

import { StorageService } from 'ng2-storage';

import { PrimusWrapper } from '../../../../services/primus';
import { ItemService } from '../../../../services/item';

@Component({
  template,
  selector: 'choicelog',
  inputs: ['player']
})
export class ChoiceLogComponent {
  static get parameters() {
    return [[PrimusWrapper], [SweetAlertService], [StorageService]];
  }

  constructor(primus, swal, storage) {
    this.primus = primus;
    this.swal = swal;
    this.storage = storage.local;
  }

  makeChoice(id, choice) {
    this.primus.makeChoice(id, choice);

    if(choice === 'Yes') {
      this.primus.requestEquipment();
    }
  }

  showMoreInfo(choice) {
    const choiceItem = choice.extraData.item;
    const equipment = this.primus._contentUpdates.equipment.getValue();
    const playerItem = equipment[choiceItem.type] || { str: 0, dex: 0, con: 0, int: 0, agi: 0, luk: 0, _baseScore: 1, _calcScore: 1 };

    const choiceItemName = choiceItem.enchantLevel > 0 ? `+${choiceItem.enchantLevel} ${choiceItem.name}` : choiceItem.name;
    const playerItemName = playerItem.enchantLevel > 0 ? `+${playerItem.enchantLevel} ${playerItem.name}` : playerItem.name;

    const html = `
<div class="col-md-12 no-padding text-md-center">
  <h4>Type: ${choiceItem.type}</h4>
</div>
<div class="col-md-12 no-padding text-md-center m-b-1">
  <strong>${playerItemName}</strong> (Score: ${playerItem._calcScore} [base ${playerItem._baseScore}], ${Math.round(playerItem._calcScore/playerItem._baseScore*100)}%)
</div>
<div class="col-md-12 no-padding m-b-1">
  <div class="col-md-2">${playerItem.str}</div>
  <div class="col-md-2">${playerItem.con}</div>
  <div class="col-md-2">${playerItem.dex}</div>
  <div class="col-md-2">${playerItem.agi}</div>
  <div class="col-md-2">${playerItem.int}</div>
  <div class="col-md-2">${playerItem.luk}</div>
</div>
<div class="col-md-12 no-padding m-b-1">
  <div class="col-md-2">STR</div>
  <div class="col-md-2">CON</div>
  <div class="col-md-2">DEX</div>
  <div class="col-md-2">AGI</div>
  <div class="col-md-2">INT</div>
  <div class="col-md-2">LUK</div>
</div>
<div class="col-md-12 no-padding text-md-center m-b-1">
  ${ItemService.getSpecialStatString(playerItem)}
</div>
<div class="col-md-12 no-padding m-b-1">
  <div class="col-md-2">&darr;</div>
  <div class="col-md-2">&darr;</div>
  <div class="col-md-2">&darr;</div>
  <div class="col-md-2">&darr;</div>
  <div class="col-md-2">&darr;</div>
  <div class="col-md-2">&darr;</div>
</div>
<div class="col-md-12 no-padding text-md-center m-b-1">
  <strong>${choiceItemName}</strong> (Score: ${choiceItem._calcScore}, 100%)
</div>
<div class="col-md-12 no-padding m-b-1">
  <div class="col-md-2">${choiceItem.str} <span class="${playerItem.str > choiceItem.str ? 'negative' : 'positive'}-stat">(${playerItem.str > choiceItem.str ? '' : '+'}${choiceItem.str - playerItem.str})</span></div>
  <div class="col-md-2">${choiceItem.con} <span class="${playerItem.con > choiceItem.con ? 'negative' : 'positive'}-stat">(${playerItem.con > choiceItem.con ? '' : '+'}${choiceItem.con - playerItem.con})</span></div>
  <div class="col-md-2">${choiceItem.dex} <span class="${playerItem.dex > choiceItem.dex ? 'negative' : 'positive'}-stat">(${playerItem.dex > choiceItem.dex ? '' : '+'}${choiceItem.dex - playerItem.dex})</span></div>
  <div class="col-md-2">${choiceItem.agi} <span class="${playerItem.agi > choiceItem.agi ? 'negative' : 'positive'}-stat">(${playerItem.agi > choiceItem.agi ? '' : '+'}${choiceItem.agi - playerItem.agi})</span></div>
  <div class="col-md-2">${choiceItem.int} <span class="${playerItem.int > choiceItem.int ? 'negative' : 'positive'}-stat">(${playerItem.int > choiceItem.int ? '' : '+'}${choiceItem.int - playerItem.int})</span></div>
  <div class="col-md-2">${choiceItem.luk} <span class="${playerItem.luk > choiceItem.luk ? 'negative' : 'positive'}-stat">(${playerItem.luk > choiceItem.luk ? '' : '+'}${choiceItem.luk - playerItem.luk})</span></div>
</div>
<div class="col-md-12 no-padding text-md-center m-b-1">
  ${ItemService.getSpecialStatString(choiceItem)}
</div>
`;

    this.swal.swal({
      title: 'New Item Information',
      customClass: this.storage.theme,
      html
    });
  }
}