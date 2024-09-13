import { api, track } from 'lwc';
import LightningModal from 'lightning/modal';
import getWebhookData from '@salesforce/apex/OpportunityWebhookController.getWebhookData';

export default class OpportunityWebhookModal extends LightningModal {
    @api
    set opportunityId(value) {
        this._opportunityId = value;
        console.log('OpportunityId set:', this._opportunityId);
        if (this._opportunityId) {
            this.fetchWebhookData();
        }
    }
    get opportunityId() {
        return this._opportunityId;
    }

    @api opportunityFields;
    @track isLoading = true;
    @track htmlContent;
    @track error;

    connectedCallback() {
        console.log('OpportunityWebhookModal connected');
        console.log('OpportunityId:', this._opportunityId);
        console.log('OpportunityFields:', JSON.stringify(this.opportunityFields));
    }

    async fetchWebhookData() {
        console.log('fetchWebhookData called');
        if (!this._opportunityId) {
            console.error('Opportunity ID is missing');
            this.error = 'Opportunity ID is missing';
            this.isLoading = false;
            return;
        }

        try {
            console.log('Calling getWebhookData with opportunityId:', this._opportunityId);
            const result = await getWebhookData({ id: this._opportunityId, isOpportunityId: true });
            console.log('getWebhookData result:', result);
            console.log('Raw webhook response:', result);
            if (result) {
                try {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(result, 'text/html');
                    const webhookDataDiv = doc.querySelector('.webhook-data');
                    
                    if (webhookDataDiv) {
                        this.htmlContent = webhookDataDiv.innerHTML;
                    } else {
                        this.htmlContent = result;
                    }
                } catch (e) {
                    this.htmlContent = result;
                }
                console.log('Processed webhook data:', this.htmlContent);
            } else {
                throw new Error('No data received from webhook');
            }
        } catch (error) {
            console.error('Error in fetchWebhookData:', error);
            this.error = error.message || JSON.stringify(error);
        } finally {
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
            const container = this.template.querySelector('.webhook-content');
            if (container) {
                container.innerHTML = this.htmlContent;
            } else {
                console.error('Container for HTML content not found');
            }
        }
    }
}