import { LightningElement } from 'lwc';

export default class BusRecordForm extends LightningElement {
    selectedBusId;

    handleBusSelect(event) {
        this.selectedBusId = event.detail;
    }
}