import { api, track } from 'lwc';
import LightningModal from 'lightning/modal';
import getWebhookData from '@salesforce/apex/OpportunityWebhookController.getWebhookData';

export default class OpportunityWebhookModal extends LightningModal {
    @api accountId;
    @api opportunityFields;
    @track isLoading = true;
    @track htmlContent;
    @track error;

    connectedCallback() {
        console.log('OpportunityWebhookModal connected. AccountId:', this.accountId);
        console.log('OpportunityFields:', JSON.stringify(this.opportunityFields));
        this.fetchWebhookData();
    }

    async fetchWebhookData() {
        try {
            console.log('Fetching webhook data for Account ID:', this.accountId);
            const result = await getWebhookData({ 
                id: this.accountId, 
                isOpportunityId: false 
            });
            console.log('Raw webhook response:', result);
            if (result) {
                try {
                    this.htmlContent = JSON.parse(result);
                } catch (e) {
                    this.htmlContent = result;
                }
                console.log('Processed webhook data:', this.htmlContent);
                this.isLoading = false;
            } else {
                throw new Error('No data received from webhook');
            }
        } catch (error) {
            console.error('Error fetching webhook data:', error);
            this.error = error.message || JSON.stringify(error);
            this.isLoading = false;
        }
    }

    handleClose() {
        console.log('Closing modal');
        this.close('Modal closed');
    }

    renderedCallback() {
        console.log('Modal rendered. HTML content:', this.htmlContent);
        if (this.htmlContent) {
            const container = this.template.querySelector('div[lwc:dom="manual"]');
            if (container) {
                container.innerHTML = this.htmlContent;
            } else {
                console.error('Container for HTML content not found');
            }
        }
    }
}