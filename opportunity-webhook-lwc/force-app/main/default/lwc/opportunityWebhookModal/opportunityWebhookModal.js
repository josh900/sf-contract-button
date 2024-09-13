import { LightningElement, api } from 'lwc';
import getWebhookData from '@salesforce/apex/OpportunityWebhookController.getWebhookData';

export default class OpportunityWebhookModal extends LightningElement {
    @api accountId;
    @api opportunityFields;
    isLoading = true;
    error;
    htmlContent;

    connectedCallback() {
        console.log('OpportunityWebhookModal connected');
        console.log('AccountId:', this.accountId);
        console.log('OpportunityFields:', JSON.stringify(this.opportunityFields));
        this.fetchWebhookData();
    }

    async fetchWebhookData() {
        console.log('fetchWebhookData called');
        try {
            console.log('Calling getWebhookData with accountId:', this.accountId);
            const result = await getWebhookData({ 
                id: this.accountId, 
                isOpportunityId: false 
            });
            console.log('getWebhookData result:', result);
            this.htmlContent = result;
            this.error = undefined;
        } catch (error) {
            console.error('Error in fetchWebhookData:', error);
            this.error = error.message || JSON.stringify(error);
            this.htmlContent = undefined;
        } finally {
            this.isLoading = false;
        }
    }

    renderedCallback() {
        if (this.htmlContent) {
            const container = this.template.querySelector('.webhook-content');
            if (container) {
                container.innerHTML = this.htmlContent;
            }
        }
    }

    handleClose() {
        this.close('closed');
    }
}