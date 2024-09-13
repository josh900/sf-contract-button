import { LightningElement, api, wire } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import LightningModal from 'lightning/modal';
import OpportunityWebhookModal from 'c/opportunityWebhookModal';
import NAME_FIELD from '@salesforce/schema/Opportunity.Name';
import AMOUNT_FIELD from '@salesforce/schema/Opportunity.Amount';
import CLOSEDATE_FIELD from '@salesforce/schema/Opportunity.CloseDate';
import STAGENAME_FIELD from '@salesforce/schema/Opportunity.StageName';
import ACCOUNTID_FIELD from '@salesforce/schema/Opportunity.AccountId';
import PROBABILITY_FIELD from '@salesforce/schema/Opportunity.Probability';

export default class OpportunityWebhookSection extends LightningElement {
    @api recordId; // This is the opportunity ID
    webhookResponse;
    error;
    isLoading = true;
    opportunityData;

    @wire(getRecord, { 
        recordId: '$recordId', 
        fields: [NAME_FIELD, AMOUNT_FIELD, CLOSEDATE_FIELD, STAGENAME_FIELD, ACCOUNTID_FIELD, PROBABILITY_FIELD] 
    })
    wiredOpportunity({ error, data }) {
        if (data) {
            console.log('Opportunity data loaded:', JSON.stringify(data));
            this.opportunityData = data;
            this.error = undefined;
        } else if (error) {
            console.error('Error loading opportunity data:', JSON.stringify(error));
            this.error = error;
            this.opportunityData = undefined;
        }
        this.isLoading = false;
    }

    get opportunityFields() {
        if (!this.opportunityData) return [];
        return [
            { label: 'Name', value: getFieldValue(this.opportunityData, NAME_FIELD) },
            { label: 'Amount', value: getFieldValue(this.opportunityData, AMOUNT_FIELD) },
            { label: 'Close Date', value: getFieldValue(this.opportunityData, CLOSEDATE_FIELD) },
            { label: 'Stage', value: getFieldValue(this.opportunityData, STAGENAME_FIELD) },
            { label: 'Account ID', value: getFieldValue(this.opportunityData, ACCOUNTID_FIELD) },
            { label: 'Probability', value: getFieldValue(this.opportunityData, PROBABILITY_FIELD) }
        ];
    }

    async handleOpenModal() {
        console.log('handleOpenModal called, opportunityData:', JSON.stringify(this.opportunityData));
        if (this.isLoading) {
            console.log('Data is still loading. Please wait.');
            return;
        }

        if (this.error) {
            console.error('Error loading opportunity data:', JSON.stringify(this.error));
            return;
        }

        if (!this.opportunityData) {
            console.error('Opportunity data not loaded yet');
            return;
        }

        const accountId = getFieldValue(this.opportunityData, ACCOUNTID_FIELD);
        console.log('Opening modal with opportunity ID:', this.recordId);

        try {
            console.log('Attempting to open modal...');
            const result = await OpportunityWebhookModal.open({
                componentParams: {
                    opportunityFields: this.opportunityFields,
                    accountId: accountId,
                    opportunityId: this.recordId // Pass the opportunity ID
                },
                label: 'Opportunity Details'
            });
            console.log('Modal opened successfully');
            console.log('Modal result:', JSON.stringify(result));
            if (result) {
                this.webhookResponse = result;
            }
        } catch (error) {
            console.error('Error opening modal:', JSON.stringify(error));
        }
    }
}