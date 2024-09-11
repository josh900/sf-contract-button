import { api, track } from 'lwc';
import LightningModal from 'lightning/modal';
import getWebhookData from '@salesforce/apex/OpportunityWebhookController.getWebhookData';

export default class OpportunityWebhookModal extends LightningModal {
    @api accountId;
    @track isLoading = true;
    @track htmlContent;

    connectedCallback() {
        this.fetchWebhookData();
    }

    async fetchWebhookData() {
        try {
            console.log('Fetching webhook data for account ID:', this.accountId);
            const result = await getWebhookData({ accountId: this.accountId });
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