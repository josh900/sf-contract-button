import { api } from 'lwc';
import LightningModal from 'lightning/modal';
import sendToWebhook from '@salesforce/apex/OpportunityWebhookController.sendToWebhook';

export default class OpportunityWebhookModal extends LightningModal {
    @api opportunityData;

    get opportunityFields() {
        if (!this.opportunityData) return [];
        return [
            { label: 'Name', value: this.opportunityData.fields.Name.value },
            { label: 'Amount', value: this.opportunityData.fields.Amount.value },
            { label: 'Close Date', value: this.opportunityData.fields.CloseDate.value },
            { label: 'Stage', value: this.opportunityData.fields.StageName.value },
            { label: 'Account ID', value: this.opportunityData.fields.AccountId.value },
            { label: 'Probability', value: this.opportunityData.fields.Probability.value }
        ];
    }

    async handleSubmit() {
        try {
            const accountId = this.opportunityData.fields.AccountId.value;
            const result = await sendToWebhook({ accountId: accountId });
            this.close(result);
        } catch (error) {
            console.error('Error sending to webhook:', error);
            this.close('Error: ' + error.body.message);
        }
    }
}