import { LightningElement, api, wire } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import LightningModal from 'lightning/modal';
import API_UPDATED_FIELD from '@salesforce/schema/Opportunity.API_Updated_Field__c';
import NAME_FIELD from '@salesforce/schema/Opportunity.Name';
import AMOUNT_FIELD from '@salesforce/schema/Opportunity.Amount';
import CLOSEDATE_FIELD from '@salesforce/schema/Opportunity.CloseDate';
import STAGENAME_FIELD from '@salesforce/schema/Opportunity.StageName';
import ACCOUNTID_FIELD from '@salesforce/schema/Opportunity.AccountId';
import PROBABILITY_FIELD from '@salesforce/schema/Opportunity.Probability';

export default class OpportunityWebhookSection extends LightningElement {
    @api recordId;
    webhookResponse;
    error;
    isLoading = true;

    @wire(getRecord, { 
        recordId: '$recordId', 
        fields: [API_UPDATED_FIELD, NAME_FIELD, AMOUNT_FIELD, CLOSEDATE_FIELD, STAGENAME_FIELD, ACCOUNTID_FIELD, PROBABILITY_FIELD] 
    })
    wiredOpportunity({ error, data }) {
        if (data) {
            console.log('Opportunity data loaded:', data);
            this.opportunityData = data;
            this.error = undefined;
        } else if (error) {
            console.error('Error loading opportunity data:', error);
            this.error = error;
            this.opportunityData = undefined;
        }
        this.isLoading = false;
    }

    get apiUpdatedField() {
        console.log('Getting apiUpdatedField, opportunityData:', this.opportunityData);
        return this.opportunityData ? getFieldValue(this.opportunityData, API_UPDATED_FIELD) : '';
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
        console.log('handleOpenModal called, opportunityData:', this.opportunityData);
        if (this.isLoading) {
            console.log('Data is still loading. Please wait.');
            return;
        }

        if (this.error) {
            console.error('Error loading opportunity data:', this.error);
            return;
        }

        if (!this.opportunityData) {
            console.error('Opportunity data not loaded yet');
            return;
        }

        const accountId = getFieldValue(this.opportunityData, ACCOUNTID_FIELD);
        console.log('Opening modal with account ID:', accountId);

        const result = await LightningModal.open({
            component: 'c:opportunityWebhookModal',
            componentParams: {
                opportunityFields: this.opportunityFields,
                accountId: accountId
            }
        });
        if (result) {
            this.webhookResponse = result;
        }
    }
}