import { api, track } from 'lwc';
import LightningModal from 'lightning/modal';
import getWebhookData from '@salesforce/apex/OpportunityWebhookController.getWebhookData';

export default class OpportunityWebhookModal extends LightningModal {
    @api accountId;
    @api isOpportunityId = false;
    @track isLoading = true;
    @track htmlContent;

    connectedCallback() {
        this.fetchWebhookData();
    }

    async fetchWebhookData() {
        try {
            const idType = this.isOpportunityId ? 'Opportunity' : 'Account';
            console.log(`Fetching webhook data for ${idType} ID:`, this.accountId);
            const result = await getWebhookData({ 
                id: this.accountId, 
                isOpportunityId: this.isOpportunityId 
            });
            console.log('Webhook data received:', result);
            this.htmlContent = result;
            this.isLoading = false;
        } catch (error) {
            console.error('Error fetching webhook data:', error);
            this.htmlContent = '<p>Error fetching data from webhook.</p>';
            this.isLoading = false;
        }
    }

    handleClose() {
        this.close('Modal closed');
    }

    renderedCallback() {
        if (this.htmlContent) {
            this.template.querySelector('div[lwc:dom="manual"]').innerHTML = this.htmlContent;
        }
    }
}