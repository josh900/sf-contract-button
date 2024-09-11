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

    @wire(getRecord, { recordId: '$recordId', fields: [API_UPDATED_FIELD, NAME_FIELD, AMOUNT_FIELD, CLOSEDATE_FIELD, STAGENAME_FIELD, ACCOUNTID_FIELD, PROBABILITY_FIELD] })
    opportunity;

    get apiUpdatedField() {
        return getFieldValue(this.opportunity.data, API_UPDATED_FIELD);
    }

    get opportunityFields() {
        return this.opportunity.data ? [
            { label: 'Name', value: getFieldValue(this.opportunity.data, NAME_FIELD) },
            { label: 'Amount', value: getFieldValue(this.opportunity.data, AMOUNT_FIELD) },
            { label: 'Close Date', value: getFieldValue(this.opportunity.data, CLOSEDATE_FIELD) },
            { label: 'Stage', value: getFieldValue(this.opportunity.data, STAGENAME_FIELD) },
            { label: 'Account ID', value: getFieldValue(this.opportunity.data, ACCOUNTID_FIELD) },
            { label: 'Probability', value: getFieldValue(this.opportunity.data, PROBABILITY_FIELD) }
        ] : [];
    }

    async handleOpenModal() {
        const result = await LightningModal.open({
            component: 'c:opportunityWebhookModal',
            componentParams: {
                opportunityFields: this.opportunityFields,
                accountId: getFieldValue(this.opportunity.data, ACCOUNTID_FIELD)
            }
        });
        if (result) {
            this.webhookResponse = result;
        }
    }
}