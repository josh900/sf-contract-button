import { api, track } from 'lwc';
import LightningModal from 'lightning/modal';
import getWebhookData from '@salesforce/apex/OpportunityWebhookController.getWebhookData';

export default class OpportunityWebhookModal extends LightningModal {
    @api opportunityFields;
    @api accountId;
    @track isLoading = true;
    @track htmlContent;

    connectedCallback() {
        this.fetchWebhookData();
    }

    async fetchWebhookData() {
        try {
            const result = await getWebhookData({ accountId: this.accountId });
            this.htmlContent = result;
            this.isLoading = false;
        } catch (error) {
            console.error('Error fetching webhook data:', error);
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