import { api } from 'lwc';
import LightningModal from 'lightning/modal';
import sendToWebhook from '@salesforce/apex/OpportunityWebhookController.sendToWebhook';

export default class OpportunityWebhookModal extends LightningModal {
    @api opportunityFields;
    @api accountId;

    connectedCallback() {
        console.log('Modal connected. Opportunity fields:', this.opportunityFields);
        console.log('Account ID:', this.accountId);
    }

    async handleSubmit() {
        console.log('Submit button clicked');
        try {
            console.log('Sending to webhook with account ID:', this.accountId);
            const result = await sendToWebhook({ accountId: this.accountId });
            console.log('Webhook result:', result);
            this.close(result);
        } catch (error) {
            console.error('Error sending to webhook:', error);
            this.close('Error: ' + (error.body ? error.body.message : error.message));
        }
    }
}