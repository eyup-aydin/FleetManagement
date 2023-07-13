// busDetailEdit.js
import { LightningElement, api } from 'lwc';

export default class BusDetailEdit extends LightningElement {
    @api recordId;
    editMode = false;

    handleEdit() {
        this.editMode = true;
    }

    handleCancel() {
        this.editMode = false;
    }

    handleSuccess(event) {
        this.editMode = false;

        // Trigger toast event to display success message
        const toastEvent = new ShowToastEvent({
            title: "Success",
            message: "Bus record updated",
            variant: "success"
        });
        this.dispatchEvent(toastEvent);
    }
}