import {LightningElement,track,api,wire} from 'lwc';
import updateBus from '@salesforce/apex/FleetManagementController.updateBus';
import getBusList from '@salesforce/apex/FleetManagementController.getBusList';
import getResaleValue from '@salesforce/apex/FleetManagementController.getResaleValue';
import {NavigationMixin} from 'lightning/navigation';
import {refreshApex} from '@salesforce/apex';

const FIELDS = ['Id','Name', 'Year__c', 'Maximum_Capacity__c', 'Odometer_Reading__c'];

export default class FleetBusList extends NavigationMixin(LightningElement) {
    @track busList;
    @track selectedBus;
    @track resaleValue;
    @track editMode = false;

    // Fetch the list of buses
    @wire(getBusList)
    wiredBusList({error,data}) {
        if (data) {
            this.busList = data;
        } else if (error) {
            this.handleError(error);
        }
    }

    // Fetch the resale value
    @wire(getResaleValue, {busId: '$selectedBus.Id'})
    wiredResaleValue({error,data}) {
        if(data == null){
            this.resaleValue = null;
        }else if (data) {
            let formatter = new Intl.NumberFormat('en-US');
            this.resaleValue = `$ ${formatter.format(data)}`;
            //this.resaleValue = data;
        } else if (error) {
            this.handleError(error);
        }
    }

    // Handle click on a bus card
    handleBusClick(event) {
        const busId = event.currentTarget.dataset.busid;
        this.selectedBus = this.busList.find((bus) => bus.Id === busId);
        console.log('Year Bus Click old value: ' +this.selectedBus.Year__c);
        this.editMode = false;
    }

    // Handle edit button click
    handleEditClick() {
        this.editMode = !this.editMode;
    }

    // Handle input change in bus details   
    handleBusInputChange(event) {
        console.log('Before update ' + this.selectedBus.Odometer_Reading__c);
        const fieldName = event.target.name;
        const value = event.target.value;
        this.selectedBus = {
            ...this.selectedBus,
            [fieldName]: value
        };
        console.log('After update ' + this.selectedBus.Odometer_Reading__c);
    }

    async handleSaveClick() {
        const fields = {};
        console.log('I am in updateBus method');
        FIELDS.forEach((field) => {
            fields[field] = this.selectedBus[field];
        });

        const busId = this.selectedBus.Id;
        const busData = {
            Name: this.selectedBus.Name,
            Year__c: this.selectedBus.Year__c,
            Odometer_Reading__c: this.selectedBus.Odometer_Reading__c,
            Maximum_Capacity__c: this.selectedBus.Maximum_Capacity__c
        };
        console.log('bus Name ' + busData.Odometer_Reading__c + ' also ' +this.selectedBus.Odometer_Reading__c);

        try {
            await updateBus({busId, busData});
            this.editMode = false;
            // Refresh the bus list after save
            this.busList = await getBusList();
        } catch (error) {
            this.handleError(error);
        }
    }

    // Handle cancel button click
    handleCancelClick() {
        this.editMode = false;
        this.selectedBus = null;
    }

    // Handle name click on non edit mode
    handleNameClick(event) {
        const recordId = this.selectedBus.Id; 
        console.log('record id is: ' + recordId);
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                actionName: "view",
                recordId: recordId
            }
        }, {
            target: '_blank'
        });
    }

    handleError(error) {
        console.error('An error occurred:', error);
    }
}