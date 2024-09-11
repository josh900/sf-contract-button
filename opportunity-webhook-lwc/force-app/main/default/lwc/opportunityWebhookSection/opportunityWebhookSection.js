import { LightningElement, api, wire } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import LightningModal from 'lightning/modal';
import API_UPDATED_FIELD from '@salesforce/schema/Opportunity.API_Updated_Field';
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
            this.opportunity = data;
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.opportunity = undefined;
        }
        this.isLoading = false;
    }

    get apiUpdatedField() {
        return this.opportunity ? getFieldValue(this.opportunity, API_UPDATED_FIELD) : '';
    }

    get opportunityFields() {
        if (!this.opportunity) return [];
        return [
            { label: 'API Updated Field', value: getFieldValue(this.opportunity, API_UPDATED_FIELD) },
            { label: 'Name', value: getFieldValue(this.opportunity, NAME_FIELD) },
            { label: 'Amount', value: getFieldValue(this.opportunity, AMOUNT_FIELD) },
            { label: 'Close Date', value: getFieldValue(this.opportunity, CLOSEDATE_FIELD) },
            { label: 'Stage', value: getFieldValue(this.opportunity, STAGENAME_FIELD) },
            { label: 'Account ID', value: getFieldValue(this.opportunity, ACCOUNTID_FIELD) },
            { label: 'Probability', value: getFieldValue(this.opportunity, PROBABILITY_FIELD) }
        ];
    }

    async handleOpenModal() {
        if (this.isLoading) {
            console.log('Data is still loading. Please wait.');
            return;
        }

        if (this.error) {
            console.error('Error loading opportunity data:', this.error);
            return;
        }

        if (!this.opportunity) {
            console.error('Opportunity data not loaded yet');
            return;
        }

        const accountId = getFieldValue(this.opportunity, ACCOUNTID_FIELD);
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