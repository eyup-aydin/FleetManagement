// busList.js
import { LightningElement, wire } from 'lwc';
import getBusList from '@salesforce/apex/FleetManagementController.getBusList';

export default class BusList extends LightningElement {
    @wire(getBusList) busList;

    handleBusClick(event) {
        this.dispatchEvent(new CustomEvent('busselect', { detail: event.target.closest('p').key }));
    }
}