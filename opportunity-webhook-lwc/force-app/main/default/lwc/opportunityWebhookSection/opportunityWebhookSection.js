import { LightningElement, api, wire } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import LightningModal from 'lightning/modal';
import API_UPDATED_FIELD from '@salesforce/schema/Opportunity.API_Updated_Field__c';
import ACCOUNTID_FIELD from '@salesforce/schema/Opportunity.AccountId';

export default class OpportunityWebhookSection extends LightningElement {
    @api recordId;
    webhookResponse;

    @wire(getRecord, { recordId: '$recordId', fields: [API_UPDATED_FIELD, ACCOUNTID_FIELD] })
    opportunity;

    get apiUpdatedField() {
        return getFieldValue(this.opportunity.data, API_UPDATED_FIELD);
    }

    async handleOpenModal() {
        const result = await LightningModal.open({
            component: 'c:opportunityWebhookModal',
            componentParams: {
                accountId: getFieldValue(this.opportunity.data, ACCOUNTID_FIELD)
            },
            label: 'Opportunity Details'
        });
        if (result) {
            this.webhookResponse = result;
        }
    }
}